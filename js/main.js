// ===== Run management & game flow =====
'use strict';

const SAVE_KEY = 'lanternfall_save_v1';

// ---------- Save / Load ----------
function saveRun() {
  if (!Game.run) return;
  Game.run.rngState = Rng.state;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(Game.run)); } catch (e) { /* storage unavailable */ }
}
function loadSave() {
  try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } }

function loadSettings() {
  try { Game.speed = +(localStorage.getItem('lanternfall_speed') || 1); } catch (e) { Game.speed = 1; }
}
function setSpeed(s) { Game.speed = s; try { localStorage.setItem('lanternfall_speed', s); } catch (e) { /* ignore */ } }

// ---------- New run ----------
function newRun(charId = 'lampwright', opts = {}) {
  const ch = CHARACTERS[charId];
  Rng.state = opts.seed ? hashSeed(String(opts.seed)) : null;
  Game.run = {
    char: charId, depth: opts.depth || 0, seed: opts.seed || null, daily: opts.daily || null,
    act: 1, floor: 0, hp: ch.hp, maxHp: ch.hp, gold: ch.gold,
    deck: [], relics: [], potions: [null, null, null],
    map: null, pos: null, path: [], bossEncounter: null,
    seenEvents: [], fightsThisAct: 0, lastEncounter: null, removeCost: 75, potionChance: 40, nextUid: 1,
    stats: { kills: 0, damageTaken: 0, cardsPlayed: 0, elites: 0, floors: 0, gold: 0 },
    pending: null,
  };
  for (const id of ch.deck) Game.run.deck.push(makeCard(id));
  if (depthOn(4)) Game.run.deck.push(makeCard('dread'));
  if (depthOn(6)) { Game.run.maxHp -= 8; Game.run.hp -= 8; }
  obtainRelic(ch.relic, true);
  startAct(1);
  saveRun();
  showFerryman();
}

function startAct(n) {
  const run = Game.run;
  run.act = n;
  if (run.seed) Rng.state = hashSeed(run.seed + ':act' + n);
  run.map = genMap(n);
  run.pos = null;
  run.path = [];
  run.bossEncounter = pick(ACTS[n - 1].bosses);
  run.fightsThisAct = 0;
}

function continueRun() {
  const s = loadSave();
  if (!s) return;
  Game.run = s;
  Rng.state = s.seed && s.rngState != null ? s.rngState : null;
  if (s.pending) return resumePending(s.pending);
  showMap();
}

// ---------- Entering map nodes ----------
function enterNode(n) {
  const run = Game.run;
  if (Game.combat || overlayOpen()) return;
  run.floor++;
  run.stats.floors++;
  if (n.type !== 'boss') { run.pos = { r: n.r, c: n.c }; run.path.push({ r: n.r, c: n.c }); }
  let pending = { type: n.type };
  if (n.type === 'fight') pending.encounter = pickEncounter();
  else if (n.type === 'elite') pending.encounter = pick(ACTS[run.act - 1].elites);
  else if (n.type === 'boss') pending.encounter = run.bossEncounter;
  else if (n.type === 'event') {
    const myst = ACTS[run.act - 1].mystery;
    if (myst && myst.length && chance(0.15)) pending = { type: 'mystery', encounter: pick(myst) };
    else pending.eventId = pickEvent();
  }
  run.pending = pending;
  saveRun();
  resumePending(pending);
}

function resumePending(p) {
  renderTopbar(true);
  switch (p.type) {
    case 'fight': case 'elite': case 'boss': case 'mimic': case 'mystery': return startCombat(p.encounter, p.type === 'mimic' ? 'elite' : p.type);
    case 'event': return showEvent(p.eventId);
    case 'shop': return showShop();
    case 'rest': return showRest();
    case 'treasure': return showTreasure();
    case 'bossReward': return showRewards(p.rewards, () => showBossReward(), 'The Boss Falls!');
    default: Game.run.pending = null; return showMap();
  }
}

function completeNode() {
  const run = Game.run;
  run.pending = null;
  saveRun();
  showMap();
}

function pickEncounter() {
  const run = Game.run, act = ACTS[run.act - 1];
  const easyCount = 3;
  const pool = run.fightsThisAct < easyCount ? act.easy : act.hard;
  run.fightsThisAct++;
  let enc;
  for (let i = 0; i < 10; i++) { enc = pick(pool); if (enc.join() !== run.lastEncounter) break; }
  run.lastEncounter = enc.join();
  return enc;
}

function pickEvent() {
  const run = Game.run;
  let ids = Object.keys(EVENTS).filter((k) => EVENTS[k].acts.includes(run.act) && !run.seenEvents.includes(k));
  if (!ids.length) { run.seenEvents = []; ids = Object.keys(EVENTS).filter((k) => EVENTS[k].acts.includes(run.act)); }
  const id = pick(ids);
  run.seenEvents.push(id);
  return id;
}

function startCombat(encounter, kind) {
  closeOverlay();
  Game.run.lastFight = encounter.map((id) => ENEMIES[id].name).join(' & ');
  Game.combat = new Combat(encounter, kind);
  Sound.music(kind === 'boss' ? 'boss' : kind === 'elite' ? 'elite' : 'combat');
  renderTopbar(true);
  Game.combat.begin();
}

// ---------- After combat ----------
function combatWon(kind) {
  const run = Game.run;
  if (kind === 'elite') run.stats.elites++;
  let gold = kind === 'boss' ? rand(95, 105) : kind === 'elite' ? rand(25, 35) : kind === 'mystery' ? rand(22, 32) : rand(10, 20);
  if (hasRelic('idol')) gold = Math.round(gold * 1.5);
  if (depthOn(7)) gold = Math.round(gold * 0.75);
  const rewards = { gold, cards: generateCardReward(kind) };
  if (kind !== 'boss') {
    if (rand(1, 100) <= run.potionChance) { rewards.potion = randomPotion(); run.potionChance = Math.max(0, run.potionChance - 10); }
    else run.potionChance = Math.min(100, run.potionChance + 10);
  }
  if (kind === 'elite') rewards.relic = randomRelic([['common', 50], ['uncommon', 33], ['rare', 17]]);
  if (kind === 'boss' && run.act >= 3) { nextAct(); return; }
  if (kind === 'boss') {
    run.pending = { type: 'bossReward', rewards };
    saveRun();
    showRewards(rewards, () => showBossReward(), 'The Boss Falls!');
    return;
  }
  run.pending = null;
  saveRun();
  showRewards(rewards, () => completeNode(), kind === 'elite' ? 'Elite Defeated!' : kind === 'mystery' ? 'Ambush Survived!' : 'Victory!');
}

function generateCardReward(kind) {
  const run = Game.run;
  const n = 3 + (hasRelic('owl') ? 1 : 0);
  const out = [], used = new Set();
  for (let i = 0; i < n; i++) {
    const rw = hasRelic('quill') ? 2 : 1;
    let rarity = kind === 'boss' ? 'rare' : weighted(kind === 'elite' || kind === 'mystery'
      ? [['common', 50], ['uncommon', 40], ['rare', 10 * rw]] : [['common', 60], ['uncommon', 36], ['rare', 4 * rw]]);
    let pool = cardPool(rarity).filter((id) => !used.has(id));
    if (!pool.length) pool = cardPool('common').filter((id) => !used.has(id));
    const id = pick(pool);
    used.add(id);
    const upChance = rarity === 'rare' ? 0 : run.act === 2 ? 0.15 : run.act === 3 ? 0.3 : 0;
    out.push(makeCard(id, chance(upChance)));
  }
  return out;
}

function runLost() {
  clearSave();
  showGameOver(false);
}

function nextAct() {
  const run = Game.run;
  if (run.act >= 3) { clearSave(); showGameOver(true); return; }
  startAct(run.act + 1);
  run.hp = depthOn(10) ? run.hp + Math.floor((run.maxHp - run.hp) / 2) : run.maxHp;
  run.pending = null;
  saveRun();
  showActIntro();
}

// ---------- Run helpers (used by events, shop, etc.) ----------
function gainGold(n) {
  const run = Game.run;
  if (hasRelic('hollow')) { toast('The Hollow Lantern swallows your gold.'); return; }
  run.gold += n;
  run.stats.gold += n;
  if (n > 0) Sound.play('gold');
  checkRunAchievements();
  renderTopbar(true);
}
function gainMaxHp(n) {
  const run = Game.run;
  run.maxHp += n;
  run.hp = Math.min(run.maxHp, run.hp + n);
  if (Game.combat) { Game.combat.player.maxHp += n; Game.combat.player.hp = Math.min(Game.combat.player.maxHp, Game.combat.player.hp + n); }
  Sound.play('heal');
  renderTopbar(true);
}
function loseHp(n) {
  const run = Game.run;
  run.hp = Math.max(1, run.hp - n);
  if (n > 0) Sound.play('hurt', { voice: currentCharId() });
  run.stats.damageTaken += n;
  renderTopbar(true);
}
function addCardToDeck(id, up = false) {
  const c = makeCard(id, up);
  Game.run.deck.push(c);
  Sound.play('cardGet');
  renderTopbar(true);
  return c;
}
function removableCards() { return Game.run.deck; }
function removeCardByUid(uid) {
  const d = Game.run.deck;
  const i = d.findIndex((c) => c.uid === uid);
  if (i >= 0) d.splice(i, 1);
  renderTopbar(true);
}
async function chooseRemoveCard(title = 'Remove a card from your deck') {
  const list = sortDeck(removableCards());
  const i = await chooseCards(list, { title, canSkip: true, skipLabel: 'Cancel' });
  if (i < 0) return null;
  removeCardByUid(list[i].uid);
  Sound.play('remove');
  toast(`Removed <b>${esc(cardName(list[i]))}</b>.`);
  return list[i];
}
async function chooseUpgradeCard(title = 'Temper a card') {
  const list = sortDeck(Game.run.deck.filter(canUpgrade));
  const i = await chooseCards(list, { title, subtitle: 'Hover a card to preview its upgrade.', canSkip: true, skipLabel: 'Cancel', preview: 'upgrade' });
  if (i < 0) return null;
  list[i].up = true;
  Sound.play('upgrade');
  toast(`Upgraded <b>${esc(cardName(list[i]))}</b>.`);
  renderTopbar(true);
  return list[i];
}
async function chooseTransformCard() {
  const list = sortDeck(removableCards());
  const i = await chooseCards(list, { title: 'Transform a card', subtitle: 'It becomes a random card.', canSkip: true, skipLabel: 'Cancel' });
  if (i < 0) return null;
  const old = list[i];
  const r = CARDS[old.id].rarity;
  const pool = cardPool(['common', 'uncommon', 'rare'].includes(r) ? r : 'common').filter((id) => id !== old.id);
  removeCardByUid(old.uid);
  const nc = addCardToDeck(pick(pool));
  return [cardName(old), cardName(nc)];
}
function upgradeRandomCards(n) {
  const list = pickN(Game.run.deck.filter(canUpgrade), n);
  list.forEach((c) => (c.up = true));
  return list.map(cardName);
}
function obtainRelic(id, silent = false) {
  if (!id) return;
  const run = Game.run;
  const R = RELICS[id];
  const r = { id };
  if (R.counter != null) r.counter = 0;
  run.relics.push(r);
  if (R.onPickup) R.onPickup(run, r);
  renderTopbar(true);
  checkRunAchievements();
  if (!silent) Sound.play('relic');
  if (!silent) toast(`Obtained ${R.icon} <b>${esc(R.name)}</b>`);
}
function obtainPotion(id) {
  const run = Game.run;
  const i = run.potions.indexOf(null);
  if (i < 0) { toast('Your Tonic slots are full!'); Sound.play('error'); return false; }
  run.potions[i] = id;
  Sound.play('potionGet');
  renderTopbar(true);
  return true;
}
async function offerCards(cards, title = 'Choose a card') {
  const i = await chooseCards(cards, { title, canSkip: true });
  if (i < 0) return null;
  Game.run.deck.push(cards[i]);
  Sound.play('cardGet');
  renderTopbar(true);
  toast(`Added <b>${esc(cardName(cards[i]))}</b> to your deck.`);
  return cards[i];
}

// ---------- Boot ----------
window.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  Profile.load();
  showTitle();
});

// ===== Progress between runs =====
// Your profile remembers: Lantern Level (experience from every run), unlocked Depths
// (difficulty levels) per hero, achievements, run history and daily results.
'use strict';

const PROFILE_KEY = 'lanternfall_profile_v1';

// ---------- Lantern Levels and what they unlock ----------
const LEVELS = [
  { xp: 0 },
  { xp: 100,  unlock: 'The Alchemist (a new hero)' },
  { xp: 450,  unlock: '3 new curios: Rusty Compass, Mirror Shard, Snail Shell' },
  { xp: 900,  unlock: '3 new Lampwright cards' },
  { xp: 1400, unlock: '3 new Moonblade cards' },
  { xp: 2000, unlock: '3 new Alchemist cards and 2 curios: Gilded Quill, Bloodstone' },
  { xp: 2700, unlock: '3 more curios: Iron Kettle, Tide Charm, Weaver\'s Loom' },
];

// ---------- Depths (difficulty). Each one adds its rule on top of all the ones below it. ----------
const DEPTHS = [
  null,
  { name: 'Hardened Elites', desc: 'Elites have 20% more HP.' },
  { name: 'Restless Dead', desc: 'Normal enemies have 10% more HP.' },
  { name: 'Tyrants', desc: 'Bosses have 15% more HP.' },
  { name: 'Haunted', desc: 'Start each run with a Dread curse.' },
  { name: 'Cold Hearths', desc: 'Resting heals 25% of your Max HP instead of 30%.' },
  { name: 'Frail', desc: 'Start with 8 less Max HP.' },
  { name: 'Poverty', desc: 'Gain 25% less gold from combat.' },
  { name: 'Savage', desc: 'Normal enemies start each combat with 1 Might.' },
  { name: 'Greedy Peddler', desc: 'The Peddler charges 15% more.' },
  { name: 'Endless Night', desc: 'Between acts, heal only half of your missing HP.' },
];
const MAX_DEPTH = DEPTHS.length - 1;
// Is depth rule n active in the current run?
function depthOn(n) { return !!(Game.run && (Game.run.depth || 0) >= n); }

// ---------- Achievements ----------
const ACHIEVEMENTS = {
  firstBlood:  { icon: '⚔️', name: 'First Blood', desc: 'Win your first combat.' },
  brine:       { icon: '🐙', name: 'Low Tide', desc: 'Defeat Mother Brine.' },
  sovereign:   { icon: '🍄', name: 'Regicide', desc: 'Defeat the Pale Sovereign.' },
  dawn:        { icon: '🌅', name: 'The Dawn Returns', desc: 'Win a run.' },
  winLamp:     { icon: '🏮', name: 'Keeper of the Light', desc: 'Win a run as the Lampwright.' },
  winMoon:     { icon: '🌙', name: 'Last of the Order', desc: 'Win a run as the Moonblade.' },
  winAlch:     { icon: '⚗️', name: 'Magnum Opus', desc: 'Win a run as the Alchemist.' },
  winCass:     { icon: '🖤', name: 'Happily Ever After', desc: 'Win a run as Cassandra.' },
  depth5:      { icon: '🕳️', name: 'Into the Deep', desc: 'Win a run at Depth 5 or higher.' },
  depth10:     { icon: '🌑', name: 'Endless Night', desc: 'Win a run at Depth 10.' },
  bigHit:      { icon: '💥', name: 'Overkill', desc: 'Deal 40 or more damage with a single hit.' },
  lean:        { icon: '🪶', name: 'Travelling Light', desc: 'Win a run with 15 or fewer cards in your deck.' },
  hoarder:     { icon: '🧳', name: 'Collector', desc: 'Hold 10 or more curios at once.' },
  rich:        { icon: '💰', name: 'Dragon\'s Hoard', desc: 'Hold 500 or more gold at once.' },
  pyre:        { icon: '🔥', name: 'Funeral Pyre', desc: 'Finish off an enemy with Burn.' },
  hemorrhage:  { icon: '🩸', name: 'Bloodletter', desc: 'Give a single enemy 20 or more Bleed.' },
  boom:        { icon: '🧨', name: 'Chain Reaction', desc: 'Make 3 enemies explode in one combat.' },
  flawless:    { icon: '✨', name: 'Untouched', desc: 'Win an elite fight without losing any HP.' },
  quick:       { icon: '⚡', name: 'Blink and Miss It', desc: 'Win a combat on your first turn.' },
  tonics:      { icon: '🧪', name: 'Mixologist', desc: 'Use 4 Tonics in a single combat.' },
  daily:       { icon: '📅', name: 'Daily Descent', desc: 'Finish a daily run.' },
  level6:      { icon: '🏆', name: 'Master Lampwright', desc: 'Reach Lantern Level 6.' },
};

// ---------- Profile ----------
const Profile = {
  d: null,
  defaults() {
    return { xp: 0, depth: {}, history: [], ach: {}, tutorialDone: false, daily: {}, seenLevel: 0, wins: {}, runs: {}, streak: {}, bestStreak: {} };
  },
  load() {
    try { this.d = Object.assign(this.defaults(), JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')); } catch (e) { this.d = this.defaults(); }
    return this.d;
  },
  save() { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(this.d)); } catch (e) { /* ignore */ } },
  get() { return this.d || this.load(); },
  level() {
    const xp = this.get().xp;
    let lv = 0;
    for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) lv = i;
    return lv;
  },
  // highest Depth this hero may choose
  maxDepth(charId) { return Math.min(MAX_DEPTH, this.get().depth[charId] || 0); },
};

// Is a card / curio unlocked yet?
function isUnlocked(def) { return !def || !def.unlock || Profile.level() >= def.unlock; }
function heroUnlocked(id) { return isUnlocked(CHARACTERS[id]); }

function unlockAch(id) {
  const p = Profile.get();
  if (!ACHIEVEMENTS[id] || p.ach[id]) return;
  p.ach[id] = Date.now();
  Profile.save();
  if (Game.run) (Game.run.newAch = Game.run.newAch || []).push(id);
  const A = ACHIEVEMENTS[id];
  achToast(`${A.icon} <b>Achievement:</b> ${esc(A.name)}`);
  Sound.play('relic');
}
function achToast(html) {
  const t = el('div', 'ach-toast', html);
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 3000);
  setTimeout(() => t.remove(), 3600);
}

function runScore(run, won) {
  const st = run.stats;
  return Math.round((st.floors * 5 + st.kills * 2 + st.elites * 25 + (won ? 500 : 0) + run.act * 100) * (1 + (run.depth || 0) * 0.1));
}

// Called once when a run ends. Records history, gives experience and unlocks.
function finishRun(won) {
  const run = Game.run;
  if (!run || run.finished) return run && run.result;
  const p = Profile.get();
  const score = runScore(run, won);
  const levelBefore = Profile.level();
  p.xp += score;
  const levelAfter = Profile.level();
  const ch = run.char || 'lampwright';
  p.runs[ch] = (p.runs[ch] || 0) + 1;
  let depthUnlocked = null;
  if (won) {
    p.wins[ch] = (p.wins[ch] || 0) + 1;
    p.streak[ch] = (p.streak[ch] || 0) + 1;
    p.bestStreak[ch] = Math.max(p.bestStreak[ch] || 0, p.streak[ch]);
    const d = run.depth || 0;
    if (!run.daily && !run.seed && d >= (p.depth[ch] || 0) && d < MAX_DEPTH) { p.depth[ch] = d + 1; depthUnlocked = d + 1; }
  } else p.streak[ch] = 0;
  const entry = { date: Date.now(), char: ch, depth: run.depth || 0, won, act: run.act, floor: run.floor, score,
    deck: run.deck.length, relics: run.relics.length, killedBy: won ? null : run.lastFight || null, daily: run.daily || null, seed: run.seed || null };
  p.history.unshift(entry);
  p.history = p.history.slice(0, 60);
  if (run.daily) {
    const prev = p.daily[run.daily];
    if (!prev || score > prev.score) p.daily[run.daily] = { score, won, act: run.act, floor: run.floor, char: ch };
  }
  Profile.save();
  // achievements
  if (won) {
    unlockAch('dawn');
    unlockAch({ lampwright: 'winLamp', moonblade: 'winMoon', alchemist: 'winAlch', cassandra: 'winCass' }[ch]);
    if ((run.depth || 0) >= 5) unlockAch('depth5');
    if ((run.depth || 0) >= 10) unlockAch('depth10');
    if (run.deck.length <= 15) unlockAch('lean');
  }
  if (run.daily) unlockAch('daily');
  if (levelAfter >= 6) unlockAch('level6');
  run.finished = true;
  run.result = { score, levelBefore, levelAfter, xpAfter: p.xp, depthUnlocked, won };
  return run.result;
}

// ---------- Daily runs ----------
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dailyHero(key = todayKey()) {
  const heroes = Object.keys(CHARACTERS).filter(heroUnlocked);
  return heroes[Math.abs(hashSeed('hero' + key)) % heroes.length];
}

// ---------- Progress checks that happen during a run ----------
function checkRunAchievements() {
  const run = Game.run;
  if (!run) return;
  if (run.gold >= 500) unlockAch('rich');
  if (run.relics.length >= 10) unlockAch('hoarder');
}

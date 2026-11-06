// ===== Shared UI: cards, tooltips, overlays, top bar =====
'use strict';

// Every game word that has a special meaning. Wherever one of these appears (cards, curios,
// tonics, statuses, intents, events, menus) it is highlighted and explained on hover.
const KEYWORDS = {
  Burn: 'At the start of its turn, loses HP equal to its Burn (ignores Ward), then Burn decreases by 1.',
  Glow: 'The light of your lantern. Stays between turns. Some cards grow stronger with Glow, others spend it.',
  Ward: 'Blocks incoming damage. Removed at the start of your turn.',
  Might: 'Increases Attack damage by 1 per stack.',
  Fortitude: 'Increases Ward gained from cards by 1 per stack.',
  Exposed: 'Takes 50% more damage from Attacks. Wears off over a few rounds.',
  Sapped: 'Deals 25% less damage with Attacks. Wears off over a few rounds.',
  Brittle: 'Gains 25% less Ward from cards. Wears off over a few rounds.',
  Spines: 'When attacked, deals that much damage back to the attacker.',
  Bleed: 'Whenever it is hit by an Attack, loses extra HP equal to its Bleed. Decreases by 1 at the end of its turn.',
  Evade: 'Completely avoids the next Attack hit. Lasts until used.',
  Unstable: 'When it reaches 10, the enemy explodes and loses 25 HP (ignores Ward). Then it resets.',
  Mending: 'At the end of its turn, heals that much HP. Then Mending decreases by 1.',
  Fervor: 'At the end of its turn, gains that much Might.',
  Shell: 'At the end of its turn, gains Ward. Taking unblocked Attack damage reduces Shell by 1.',
  Nullify: 'Cancels the next debuff applied to it.',
  Wrath: 'Gains Might whenever you play a Skill.',
  Coil: 'The first time it takes Attack damage, it gains Ward.',
  Primed: 'Your next Attack deals extra damage.',
  Exhaust: 'Removed until the end of combat.',
  Ethereal: 'If this is in your hand at the end of your turn, it is Exhausted.',
  Innate: 'Starts each combat in your hand.',
  Unplayable: 'This card cannot be played.',
  'Moon Shard': 'A 0-cost Attack card: deal 4 damage. Exhaust.',
  Tonic: 'A one-use potion. Use it from the top bar. You can carry a limited number.',
  Brew: 'Create a random Tonic in an empty Tonic slot.',
  Curio: 'A relic that gives a lasting bonus for the rest of the run.',
  Energy: 'Spent to play cards. Refills at the start of each turn.',
  Ash: 'A useless Status card. Unplayable. Ethereal.',
  Muck: 'A Status card that costs 1 Energy to clear out. Exhaust.',
  Slag: 'A Status card. If it is in your hand at the end of your turn, take 3 damage.',
  Gloom: 'A Status card. When drawn, lose 1 Energy. Ethereal.',
  Dread: 'A Curse. Unplayable. Clogs your deck.',
  Rot: 'A Curse. If it is in your hand at the end of your turn, lose 2 HP.',
};
const KW_ALIAS = { 'Moon Shards': 'Moon Shard', Tonics: 'Tonic', Curios: 'Curio', Brewed: 'Brew', Burning: 'Burn', Bleeding: 'Bleed', Exhausted: 'Exhaust' };
const KW_WORDS = [...Object.keys(KEYWORDS), ...Object.keys(KW_ALIAS)].sort((x, y) => y.length - x.length);
const KW_RE = new RegExp('\\b(' + KW_WORDS.join('|') + ')\\b', 'g');
const kwKey = (w) => KW_ALIAS[w] || w;
const kwTip = (w) => `<b>${kwKey(w)}</b>: ${KEYWORDS[kwKey(w)]}`;
// Plain text in, HTML out: keywords highlighted, each with its own hover explanation.
function kwText(text) { return esc(text).replace(KW_RE, (w) => `<span class="kw" data-tip="${kwTip(w)}">${w}</span>`); }
// Explanations for every keyword that appears in some text (used by tooltips).
function kwDefsFor(text, skip = []) {
  const found = [];
  for (const m of String(text).replace(/<[^>]*>/g, ' ').matchAll(KW_RE)) { const k = kwKey(m[1]); if (!found.includes(k) && !skip.includes(k)) found.push(k); }
  return found;
}

function costOfCard(card, ctx) { return ctx ? ctx.costOf(card) : cardBaseCost(card); }

function cardDescHTML(card, ctx, target) {
  const d = cardDef(card);
  const v = cardVals(card);
  const upVals = d.up || {};
  let txt = kwText(d.desc);
  txt = txt.replace(/\{(\w+)\}/g, (_, k) => {
    let val = v[k];
    let cls = card.up && upVals[k] != null && upVals[k] !== d.v[k] ? 'upnum' : '';
    if (ctx && typeof val === 'number') {
      let m = val;
      if (k[0] === 'd') m = ctx.previewDamage(val, target);
      else if (k[0] === 'b') m = ctx.previewBlock(val);
      if (m > val) cls = 'buffnum'; else if (m < val) cls = 'debuffnum';
      val = m;
    }
    return `<span class="num ${cls}">${val}</span>`;
  });
  const pre = [], post = [];
  if (d.cost === -1) pre.push(kwText('Unplayable') + '.');
  if (cardFlag(card, 'innate')) pre.push(kwText('Innate') + '.');
  if (cardFlag(card, 'ethereal')) post.push(kwText('Ethereal') + '.');
  if (cardFlag(card, 'exhaust')) post.push(kwText('Exhaust') + '.');
  return [...pre, txt, ...post].join(' ');
}

function cardKeywordTips(card) {
  const d = cardDef(card);
  const found = new Set(kwDefsFor(d.desc));
  if (cardFlag(card, 'exhaust')) found.add('Exhaust');
  if (cardFlag(card, 'ethereal')) found.add('Ethereal');
  if (d.cost === -1) found.add('Unplayable');
  if (d.cost === 'X') return [...found].map((k) => `<b>${k}</b>: ${KEYWORDS[k]}`).concat('<b>X</b>: Spends all your Energy. X is the amount spent.').join('<br>');
  return [...found].map((k) => `<b>${k}</b>: ${KEYWORDS[k]}`).join('<br>');
}

function cardEl(card, opts = {}) {
  const d = cardDef(card);
  const ctx = opts.ctx || null;
  const cost = costOfCard(card, ctx);
  const costTxt = cost === -1 ? '' : cost;
  const base = cardBaseCost(card);
  const costCls = ctx && typeof cost === 'number' && typeof base === 'number' && cost < base ? 'cheaper' : '';
  const e = el('div', `card t-${d.type} r-${d.rarity}${card.up ? ' up' : ''}`);
  const desc = cardDescHTML(card, ctx, opts.target);
  const textLen = desc.replace(/<[^>]*>/g, '').length;
  const lenCls = textLen > 92 ? ' vlong' : textLen > 70 ? ' long' : '';
  e.innerHTML = `
    ${cost === -1 ? '' : `<div class="card-cost ${costCls}">${costTxt}</div>`}
    <div class="card-name">${esc(cardName(card))}</div>
    <div class="card-art">${cardArtHTML(card)}</div>
    <div class="card-type">${d.type}${d.rarity !== 'starter' && d.rarity !== 'special' ? ' · ' + d.rarity : ''}</div>
    <div class="card-desc${lenCls}"><div>${desc}</div></div>`;
  const tips = cardKeywordTips(card);
  if (tips && !opts.noTip) e.dataset.tip = tips;
  return e;
}

// ---------- Tooltip ----------
(function initTooltip() {
  const tip = () => $('#tooltip');
  document.addEventListener('mouseover', (ev) => {
    const t = ev.target.closest('[data-tip]');
    if (!t) { tip().style.display = 'none'; return; }
    let html = t.dataset.tip;
    if (!t.classList.contains('card') && !t.classList.contains('kw')) {
      const already = [...html.matchAll(/<b>([^<]+)<\/b>:/g)].map((m) => m[1]);
      const defs = kwDefsFor(html, already);
      if (defs.length) html += '<div class="tip-kw">' + defs.map((k) => `<b>${k}</b>: ${KEYWORDS[k]}`).join('<br>') + '</div>';
    }
    tip().innerHTML = html;
    tip().style.display = 'block';
  });
  document.addEventListener('mousemove', (ev) => {
    const t = tip();
    if (t.style.display !== 'block') return;
    const w = t.offsetWidth, h = t.offsetHeight;
    let x = ev.clientX + 16, y = ev.clientY + 16;
    if (x + w > window.innerWidth - 8) x = ev.clientX - w - 16;
    if (y + h > window.innerHeight - 8) y = ev.clientY - h - 16;
    t.style.left = Math.max(4, x) + 'px';
    t.style.top = Math.max(4, y) + 'px';
  });
  document.addEventListener('mousedown', () => { tip().style.display = 'none'; });
})();
function hideTip() { $('#tooltip').style.display = 'none'; }

// ---------- Floating text ----------
const floatStack = new WeakMap();
function floatAt(target, text, cls = '') {
  if (!target) return;
  const r = target.getBoundingClientRect();
  // Stagger texts that pop on the same target at nearly the same time
  const now = performance.now();
  const s = floatStack.get(target);
  const n = s && now - s.t < 350 ? s.n + 1 : 0;
  floatStack.set(target, { t: now, n });
  const f = el('div', 'floater ' + cls, esc(text));
  f.style.left = r.left + r.width / 2 + (Math.random() * 30 - 15) + 'px';
  f.style.top = r.top + r.height * 0.35 - (n % 4) * 26 + 'px';
  $('#fx').appendChild(f);
  setTimeout(() => f.remove(), 1200);
}
function toast(msg, ms = 2200) {
  const t = $('#toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), ms);
}

// ---------- Overlay ----------
function openOverlay(content, { onClose, wide } = {}) {
  const ov = $('#overlay');
  ov.innerHTML = '';
  const box = el('div', 'overlay-box' + (wide ? ' wide' : ''));
  box.appendChild(content);
  ov.appendChild(box);
  ov.classList.add('show');
  ov._onClose = onClose;
  hideTip();
}
function closeOverlay() {
  const ov = $('#overlay');
  ov.classList.remove('show');
  ov.innerHTML = '';
  const cb = ov._onClose; ov._onClose = null;
  hideTip();
  if (cb) cb();
}
function overlayOpen() { return $('#overlay').classList.contains('show'); }

// Choose one card from a list. Resolves to the chosen index or -1.
function chooseCards(cards, { title = 'Choose a card', subtitle = '', canSkip = true, skipLabel = 'Skip', preview = null } = {}) {
  return new Promise((resolve) => {
    const wrap = el('div', 'choose');
    wrap.appendChild(el('h2', '', esc(title)));
    if (subtitle) wrap.appendChild(el('p', 'sub', subtitle));
    const grid = el('div', 'card-grid' + (cards.length <= 4 ? ' few' : ''));
    if (preview !== 'upgrade' && cards.some(canUpgrade)) wrap.appendChild(upgradeToggle(grid, cards));
    let done = false;
    const finish = (i) => { if (done) return; done = true; closeOverlay(); resolve(i); };
    cards.forEach((c, i) => {
      const slot = el('div', 'card-slot');
      let ce = cardEl(c);
      slot.appendChild(ce);
      if (preview === 'upgrade' && canUpgrade(c)) {
        slot.addEventListener('mouseenter', () => { const n = cardEl({ ...c, up: true }); n.classList.add('preview'); slot.replaceChild(n, slot.firstChild); });
        slot.addEventListener('mouseleave', () => { slot.replaceChild(cardEl(c), slot.firstChild); });
      }
      slot.addEventListener('click', () => finish(i));
      grid.appendChild(slot);
    });
    if (!cards.length) grid.appendChild(el('p', 'sub', 'No cards.'));
    wrap.appendChild(grid);
    if (canSkip) {
      const b = el('button', 'btn ghost', esc(skipLabel));
      b.onclick = () => finish(-1);
      wrap.appendChild(b);
    }
    openOverlay(wrap, { wide: cards.length > 4 });
  });
}

function viewCards(cards, title) {
  const wrap = el('div', 'choose');
  wrap.appendChild(el('h2', '', esc(title) + ` <small>(${cards.length})</small>`));
  const grid = el('div', 'card-grid');
  if (cards.some(canUpgrade)) wrap.appendChild(upgradeToggle(grid, cards));
  cards.forEach((c) => { const s = el('div', 'card-slot static'); s.appendChild(cardEl(c)); grid.appendChild(s); });
  if (!cards.length) grid.appendChild(el('p', 'sub', 'Empty.'));
  wrap.appendChild(grid);
  const b = el('button', 'btn', 'Close');
  b.onclick = closeOverlay;
  wrap.appendChild(b);
  openOverlay(wrap, { wide: true });
}

// A 'Show upgrades' switch: swaps every card in the grid to its upgraded version and back.
let showUpgrades = false;
function upgradeToggle(grid, cards) {
  const lab = el('label', 'chip toggle up-toggle', `<input type="checkbox" ${showUpgrades ? 'checked' : ''}> Show upgrades`);
  const apply = () => {
    [...grid.querySelectorAll(':scope > .card-slot')].forEach((slot, i) => {
      const c = cards[i]; if (!c) return;
      const show = showUpgrades && canUpgrade(c);
      const n = cardEl(show ? { ...c, up: true } : c);
      if (show) n.classList.add('preview');
      const old = slot.querySelector('.card'); if (old) slot.replaceChild(n, old);
    });
  };
  $('input', lab).onchange = (e) => { showUpgrades = e.target.checked; apply(); };
  if (showUpgrades) setTimeout(apply);
  return lab;
}

function sortDeck(cards) {
  const order = { attack: 0, skill: 1, power: 2, status: 3, curse: 4 };
  return cards.slice().sort((a, b) => order[cardDef(a).type] - order[cardDef(b).type] || cardDef(a).name.localeCompare(cardDef(b).name) || (a.up ? 1 : 0) - (b.up ? 1 : 0));
}

// ---------- Top bar ----------
let topbarSig = '';
function renderTopbar(force = false) {
  const run = Game.run;
  const tb = $('#topbar'), rb = $('#relicbar');
  if (!run) { tb.innerHTML = ''; rb.innerHTML = ''; tb.style.display = rb.style.display = 'none'; topbarSig = ''; return; }
  tb.style.display = rb.style.display = '';
  const c = Game.combat;
  const hp = c ? c.player.hp : run.hp, maxHp = c ? c.player.maxHp : run.maxHp;
  const sig = JSON.stringify([hp, maxHp, run.gold, run.potions, run.act, run.floor, run.deck.length, run.relics]);
  if (!force && sig === topbarSig) return;
  topbarSig = sig;
  const actName = ACTS[run.act - 1].name;
  tb.innerHTML = `
    <div class="tb-left">
      <span class="tb-name">${currentChar().icon} ${currentChar().name}</span>
      <span class="tb-stat hp" data-tip="Hit Points">❤️ ${hp}/${maxHp}</span>
      <span class="tb-stat gold" data-tip="Gold">🪙 ${run.gold}</span>
      <span class="tb-potions">${run.potions.map((p, i) => p
        ? `<button class="potion-slot" data-slot="${i}" data-tip="<b>${POTIONS[p].name}</b><br>${POTIONS[p].desc}"><span style="filter:hue-rotate(${POTIONS[p].hue}deg)">${POTIONS[p].icon}</span></button>`
        : `<span class="potion-slot empty" data-tip="Empty Tonic slot">·</span>`).join('')}</span>
    </div>
    <div class="tb-mid">${ACTS[run.act - 1].subtitle}: ${actName} · Floor ${run.floor}</div>
    <div class="tb-right">
      <button class="btn small" id="tbMap" data-tip="View the map">🗺️ Map</button>
      <button class="btn small" id="tbDeck" data-tip="View your deck">🃏 Deck <b>${run.deck.length}</b></button>
      <button class="btn small ghost" id="tbSound" data-tip="Sound on/off (M)">${Sound.settings.muted ? '🔇' : '🔊'}</button>
      <button class="btn small ghost" id="tbMenu" data-tip="Menu">☰</button>
    </div>`;
  rb.innerHTML = run.relics.map((r) => {
    const R = RELICS[r.id];
    const counter = R.counter != null ? `<i>${r.counter || 0}</i>` : '';
    const used = r.used ? ' used' : '';
    return `<span class="relic${used}" data-relic="${r.id}" data-tip="<b>${esc(R.name)}</b><br>${esc(R.desc)}">${R.icon}${counter}</span>`;
  }).join('');
  $('#tbDeck').onclick = () => viewCards(sortDeck(run.deck), 'Your Deck');
  $('#tbMap').onclick = () => showMapOverlay();
  $('#tbMenu').onclick = () => showMenu();
  $('#tbSound').onclick = () => { Sound.toggleMute(); renderTopbar(true); };
  $$('.potion-slot[data-slot]', tb).forEach((b) => (b.onclick = (ev) => potionMenu(+b.dataset.slot, b)));
}

function flashRelicEl(id) {
  const r = $(`#relicbar [data-relic="${id}"]`);
  if (!r) return;
  r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash');
}

function potionMenu(slot, anchor) {
  const run = Game.run;
  const id = run.potions[slot];
  if (!id) return;
  const P = POTIONS[id];
  const c = Game.combat;
  const canUse = (c && c.phase === 'player' && !c.busy && !c.over) || (!c && P.outside);
  $$('.potion-pop').forEach((p) => p.remove());
  const pop = el('div', 'potion-pop');
  pop.innerHTML = `<b>${P.name}</b><p>${P.desc}</p>`;
  const use = el('button', 'btn small', 'Drink');
  use.disabled = !canUse;
  use.onclick = () => {
    pop.remove();
    if (c) c.selectPotion(slot);
    else { P.use(null); run.potions[slot] = null; renderTopbar(); saveRun(); toast(`Used ${P.name}.`); }
  };
  const dis = el('button', 'btn small ghost', 'Discard');
  dis.onclick = () => { pop.remove(); run.potions[slot] = null; renderTopbar(); if (c) c.render(); };
  pop.append(use, dis);
  document.body.appendChild(pop);
  const r = anchor.getBoundingClientRect();
  pop.style.left = r.left + 'px';
  pop.style.top = r.bottom + 6 + 'px';
  setTimeout(() => document.addEventListener('mousedown', function h(ev) {
    if (!pop.contains(ev.target)) { pop.remove(); document.removeEventListener('mousedown', h); }
  }), 0);
}

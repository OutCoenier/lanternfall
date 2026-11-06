// ===== Shared UI: cards, tooltips, overlays, top bar =====
'use strict';

const KEYWORDS = {
  Burn: 'At the start of its turn, loses HP equal to its Burn (ignores Ward), then Burn decreases by 1.',
  Glow: 'The light of your lantern. Stays between turns. Some cards grow stronger with Glow, others spend it.',
  Ward: 'Blocks incoming damage. Removed at the start of your turn.',
  Might: 'Increases Attack damage by 1 per stack.',
  Exposed: 'Takes 50% more damage from Attacks.',
  Sapped: 'Deals 25% less damage with Attacks.',
  Brittle: 'Gains 25% less Ward from cards.',
  Fortitude: 'Increases Ward gained from cards by 1 per stack.',
  Spines: 'When attacked, deals damage back to the attacker.',
  Exhaust: 'Removed until the end of combat.',
  Ethereal: 'If this is in your hand at the end of your turn, it is Exhausted.',
  Unplayable: 'This card cannot be played.',
  Ash: 'A useless Status card. Unplayable. Ethereal.',
  Innate: 'Starts each combat in your hand.',
  Bleed: 'Whenever it is hit by an Attack, loses extra HP equal to its Bleed. Decreases by 1 at the end of its turn.',
  Evade: 'Completely avoids the next Attack hit. Lasts until used.',
  'Moon Shards': 'A 0-cost Attack: deal 4 damage. Exhaust.',
  'Moon Shard': 'A 0-cost Attack: deal 4 damage. Exhaust.',
};
const KW_RE = new RegExp('\\b(' + Object.keys(KEYWORDS).join('|') + ')\\b', 'g');

function costOfCard(card, ctx) { return ctx ? ctx.costOf(card) : cardBaseCost(card); }

function cardDescHTML(card, ctx, target) {
  const d = cardDef(card);
  const v = cardVals(card);
  const upVals = d.up || {};
  let txt = esc(d.desc).replace(KW_RE, '<span class="kw">$1</span>');
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
  if (d.cost === -1) pre.push('<span class="kw">Unplayable</span>.');
  if (cardFlag(card, 'innate')) pre.push('<span class="kw">Innate</span>.');
  if (cardFlag(card, 'ethereal')) post.push('<span class="kw">Ethereal</span>.');
  if (cardFlag(card, 'exhaust')) post.push('<span class="kw">Exhaust</span>.');
  return [...pre, txt, ...post].join(' ');
}

function cardKeywordTips(card) {
  const d = cardDef(card);
  const found = new Set((d.desc.match(KW_RE) || []));
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
    tip().innerHTML = t.dataset.tip;
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
  cards.forEach((c) => { const s = el('div', 'card-slot static'); s.appendChild(cardEl(c)); grid.appendChild(s); });
  if (!cards.length) grid.appendChild(el('p', 'sub', 'Empty.'));
  wrap.appendChild(grid);
  const b = el('button', 'btn', 'Close');
  b.onclick = closeOverlay;
  wrap.appendChild(b);
  openOverlay(wrap, { wide: true });
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

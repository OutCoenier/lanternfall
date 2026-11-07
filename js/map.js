// ===== Map generation & rendering =====
'use strict';

const MAP_ROWS = 13;
const MAP_COLS = 7;
const NODE_INFO = {
  fight:    { icon: ':swords:', name: 'Enemy', tip: 'Fight a group of monsters.' },
  elite:    { icon: ':devil:', name: 'Elite', tip: 'A dangerous foe. Defeat it to earn a Curio.' },
  rest:     { icon: ':flame:', name: 'Hearth', tip: 'Rest to heal, or Temper (upgrade) a card.' },
  shop:     { icon: ':stall:', name: 'Peddler', tip: 'Buy cards, Curios and Tonics, or remove a card.' },
  treasure: { icon: ':chest:', name: 'Treasure', tip: 'A chest holding a Curio.' },
  event:    { icon: ':question:', name: 'Unknown', tip: 'Something strange awaits.' },
  boss:     { icon: ':skull:', name: 'Boss', tip: 'The master of this act.' },
};

function genMap(act) {
  const rows = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(null));
  const ensure = (r, c) => rows[r][c] || (rows[r][c] = { r, c, type: null, next: [], jx: rng() * 24 - 12, jy: rng() * 18 - 9 });
  const hasEdge = (r, c1, c2) => rows[r][c1] && rows[r][c1].next.includes(c2);
  const starts = [];
  for (let p = 0; p < 6; p++) {
    let c = rand(0, MAP_COLS - 1);
    if (p === 1) while (c === starts[0]) c = rand(0, MAP_COLS - 1);
    starts.push(c);
    for (let r = 0; r < MAP_ROWS; r++) {
      const node = ensure(r, c);
      if (r === MAP_ROWS - 1) break;
      const opts = shuffle([c - 1, c, c + 1].filter((x) => x >= 0 && x < MAP_COLS));
      let nc = opts.find((x) => !(x === c + 1 && hasEdge(r, c + 1, c)) && !(x === c - 1 && hasEdge(r, c - 1, c)));
      if (nc == null) nc = c;
      if (!node.next.includes(nc)) node.next.push(nc);
      c = nc;
    }
  }
  const parents = (n) => (n.r === 0 ? [] : rows[n.r - 1].filter((p) => p && p.next.includes(n.c)));
  for (let r = 0; r < MAP_ROWS; r++) {
    for (const n of rows[r]) {
      if (!n) continue;
      if (r === 0) { n.type = 'fight'; continue; }
      if (r === 6) { n.type = 'treasure'; continue; }
      if (r === MAP_ROWS - 1) { n.type = 'rest'; continue; }
      const ps = parents(n);
      for (let tries = 0; tries < 20; tries++) {
        const w = [['fight', 45], ['event', 22]];
        if (r >= 4) w.push(['elite', act === 1 ? 13 : 16]);
        if (r >= 4 && r !== MAP_ROWS - 2) w.push(['rest', 12]);
        if (r >= 2) w.push(['shop', 6]);
        const t = weighted(w);
        if (['elite', 'rest', 'shop'].includes(t) && ps.some((p) => p.type === t)) continue;
        n.type = t;
        break;
      }
      if (!n.type) n.type = 'fight';
    }
  }
  for (const row of rows) for (const n of row) if (n) n.next.sort((a, b) => a - b);
  return { rows, boss: { type: 'boss', r: MAP_ROWS } };
}

function availableNodes() {
  const run = Game.run, m = run.map;
  if (!run.pos) return m.rows[0].filter(Boolean);
  if (run.pos.r >= MAP_ROWS - 1) return [m.boss];
  const cur = m.rows[run.pos.r][run.pos.c];
  return cur.next.map((c) => m.rows[run.pos.r + 1][c]);
}

function renderMapInto(container, interactive) {
  const run = Game.run, m = run.map;
  const act = ACTS[run.act - 1];
  const big = window.innerHeight > 560;
  const W = big ? 760 : 640, ROW_H = big ? 100 : 84, TOP = big ? 175 : 150, BOTTOM = big ? 80 : 70;
  const H = TOP + (MAP_ROWS - 1) * ROW_H + BOTTOM;
  const pos = (n) => n.type === 'boss' ? { x: W / 2, y: big ? 86 : 70 } : { x: (n.c + 0.5) * (W / MAP_COLS) + n.jx, y: H - BOTTOM - n.r * ROW_H + n.jy };
  const avail = interactive ? availableNodes() : [];
  const visited = new Set(run.path.map((p) => p.r + ',' + p.c));
  const pathEdges = new Set();
  for (let i = 1; i < run.path.length; i++) pathEdges.add(`${run.path[i - 1].r},${run.path[i - 1].c}>${run.path[i].c}`);

  const wrap = el('div', 'map-wrap');
  wrap.style.setProperty('--accent', act.accent);
  const inner = el('div', 'map-inner');
  inner.style.width = W + 'px';
  inner.style.height = H + 'px';
  let svg = `<svg width="${W}" height="${H}" class="map-lines">`;
  for (const row of m.rows) for (const n of row) {
    if (!n) continue;
    const a = pos(n);
    const targets = n.r === MAP_ROWS - 1 ? [m.boss] : n.next.map((c) => m.rows[n.r + 1][c]);
    for (const t of targets) {
      const b = pos(t);
      const walked = t.type !== 'boss' && pathEdges.has(`${n.r},${n.c}>${t.c}`);
      svg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${walked ? 'walked' : ''}"/>`;
    }
  }
  svg += '</svg>';
  inner.innerHTML = svg;

  const addNode = (n) => {
    const p = pos(n);
    const info = NODE_INFO[n.type];
    const b = el('button', `map-node t-${n.type}`);
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    b.innerHTML = `<span>${info.icon}</span>`;
    b.dataset.tip = `<b>${info.name}</b><br>${info.tip}`;
    const isAvail = avail.includes(n);
    if (n.type !== 'boss' && visited.has(n.r + ',' + n.c)) b.classList.add('visited');
    if (run.pos && n.r === run.pos.r && n.c === run.pos.c) b.classList.add('current');
    if (isAvail) { b.classList.add('available'); b.onclick = () => (interactive ? walkTo(n, p) : enterNode(n)); }
    else b.disabled = true;
    inner.appendChild(b);
    return b;
  };
  for (const row of m.rows) for (const n of row) if (n) addNode(n);
  const bossBtn = addNode(m.boss);
  bossBtn.classList.add('boss-node');
  const bossDef = ENEMIES[run.bossEncounter[0]];
  const bossArt = ENEMY_ART[run.bossEncounter[0]];
  bossBtn.innerHTML = bossArt ? `<span class="boss-mini">${bossArt()}</span>` : `<span style="${bossDef.filter ? 'filter:' + bossDef.filter : ''}">${bossDef.sprite}</span>`;
  bossBtn.dataset.tip = `<b>${bossDef.name}</b><br>The master of ${act.name}.`;
  // the hero's token
  let token = null, walking = false;
  if (interactive) {
    const start = run.pos ? pos(m.rows[run.pos.r][run.pos.c]) : { x: W / 2, y: H - 14 };
    token = el('div', 'map-token', `<div class="mt-inner">${currentChar().portrait()}</div>`);
    token.style.left = start.x + 'px';
    token.style.top = start.y + 'px';
    inner.appendChild(token);
  }
  function walkTo(n, p) {
    if (walking || Game.combat || overlayOpen()) return;
    walking = true;
    Sound.play('step');
    token.classList.add('walking');
    token.style.left = p.x + 'px';
    token.style.top = p.y + 'px';
    setTimeout(() => enterNode(n), 650 * Math.max(0.3, Game.speed));
  }
  attachMapInk(inner, W, H);
  container.appendChild(mapTools(inner));
  wrap.appendChild(inner);
  container.appendChild(wrap);
  // scroll to current position
  requestAnimationFrame(() => {
    const y = run.pos ? pos(m.rows[run.pos.r][run.pos.c]).y : H;
    wrap.scrollTop = Math.max(0, y - wrap.clientHeight * 0.65);
  });
  return wrap;
}

function mapLegend() {
  return `<div class="map-legend">${['fight', 'elite', 'event', 'rest', 'shop', 'treasure'].map((t) => `<div><span>${NODE_INFO[t].icon}</span> ${NODE_INFO[t].name}</div>`).join('')}</div>`;
}

function showMap() {
  const run = Game.run;
  Sound.music('map');
  const act = ACTS[run.act - 1];
  const scr = $('#screen');
  scr.innerHTML = '';
  const page = el('div', 'map-screen');
  page.style.setProperty('--bg1', act.bg[0]);
  page.style.setProperty('--bg2', act.bg[1]);
  page.style.setProperty('--accent', act.accent);
  page.innerHTML = `<div class="map-header"><h2>${act.subtitle}</h2><h1>${act.name}</h1><p>Choose your path.</p></div>${mapLegend()}`;
  renderMapInto(page, true);
  scr.appendChild(page);
  renderTopbar(true);
}

function showMapOverlay() {
  if (overlayOpen()) return closeOverlay();
  const box = el('div', 'map-overlay');
  box.appendChild(el('h2', '', ACTS[Game.run.act - 1].name));
  renderMapInto(box, false);
  const b = el('button', 'btn', 'Close');
  b.onclick = closeOverlay;
  box.appendChild(b);
  openOverlay(box, { wide: true });
}

// ---------- Drawing on the map ----------
// Plan your route: hold the right mouse button and draw anywhere on the map,
// or pick the pencil and draw with the left button. Drawings stay with the run
// (one sheet per act) and are saved with it.
const MAP_INK = ['#f4ead2', '#ff6b5a', '#ffd76a', '#6dd3ff', '#8dff8a', '#d89bff'];
const MapInk = { tool: null, color: MAP_INK[0], undo: [], redraw: null };

function mapStrokes() {
  const run = Game.run;
  run.mapDrawings = run.mapDrawings || {};
  return (run.mapDrawings[run.act] = run.mapDrawings[run.act] || []);
}
function inkRemember() {
  MapInk.undo.push({ act: Game.run.act, strokes: JSON.stringify(mapStrokes()) });
  if (MapInk.undo.length > 40) MapInk.undo.shift();
}
function inkUndo() {
  const run = Game.run;
  for (let i = MapInk.undo.length - 1; i >= 0; i--) {
    if (MapInk.undo[i].act !== run.act) continue;
    run.mapDrawings[run.act] = JSON.parse(MapInk.undo.splice(i, 1)[0].strokes);
    saveRun();
    if (MapInk.redraw) MapInk.redraw();
    return;
  }
}
function inkClear() {
  if (!mapStrokes().length) return;
  inkRemember();
  Game.run.mapDrawings[Game.run.act] = [];
  saveRun();
  if (MapInk.redraw) MapInk.redraw();
}

// A smooth path through the points (stored from 0 to 1 so it fits any map size).
function inkPath(pts, W, H) {
  const P = pts.map(([x, y]) => [Math.round(x * W * 10) / 10, Math.round(y * H * 10) / 10]);
  if (!P.length) return '';
  if (P.length === 1) return `M${P[0][0]},${P[0][1]} l0.1,0`;
  let d = `M${P[0][0]},${P[0][1]}`;
  for (let i = 1; i < P.length - 1; i++) {
    const mx = Math.round((P[i][0] + P[i + 1][0]) * 5) / 10, my = Math.round((P[i][1] + P[i + 1][1]) * 5) / 10;
    d += ` Q${P[i][0]},${P[i][1]} ${mx},${my}`;
  }
  const L = P[P.length - 1];
  return d + ` L${L[0]},${L[1]}`;
}

function attachMapInk(inner, W, H) {
  const NS = 'http://www.w3.org/2000/svg';
  const ink = document.createElementNS(NS, 'svg');
  ink.setAttribute('class', 'map-ink');
  ink.setAttribute('width', W); ink.setAttribute('height', H);
  inner.appendChild(ink);
  const redraw = () => {
    ink.innerHTML = mapStrokes().map((st) => `<path d="${inkPath(st.p, W, H)}" stroke="${st.c}"/>`).join('');
  };
  redraw();
  MapInk.redraw = () => { if (ink.isConnected) redraw(); };
  if (MapInk.tool) inner.classList.add('drawing', 'tool-' + MapInk.tool);

  let live = null, mode = null, pts = null, erased = false;
  const at = (ev) => { const r = inner.getBoundingClientRect(); return [(ev.clientX - r.left) / W, (ev.clientY - r.top) / H]; };
  const eraseAt = ([x, y]) => {
    const strokes = mapStrokes(), R = 12;
    const keep = strokes.filter((st) => !st.p.some(([px, py]) => Math.hypot((px - x) * W, (py - y) * H) < R + 3));
    if (keep.length === strokes.length) return;
    if (!erased) { inkRemember(); erased = true; }
    Game.run.mapDrawings[Game.run.act] = keep;
    redraw();
  };
  inner.addEventListener('contextmenu', (ev) => ev.preventDefault());
  inner.addEventListener('pointerdown', (ev) => {
    if (ev.button === 2) mode = MapInk.tool === 'erase' ? 'erase' : 'pen';
    else if (ev.button === 0 && MapInk.tool) mode = MapInk.tool;
    else return;
    ev.preventDefault(); ev.stopPropagation();
    hideTip();
    inner.setPointerCapture(ev.pointerId);
    inner.classList.add('inking');
    if (mode === 'erase') { erased = false; eraseAt(at(ev)); return; }
    pts = [at(ev)];
    live = document.createElementNS(NS, 'path');
    live.setAttribute('stroke', MapInk.color);
    live.setAttribute('d', inkPath(pts, W, H));
    ink.appendChild(live);
  }, true);
  inner.addEventListener('pointermove', (ev) => {
    if (!mode) return;
    const p = at(ev);
    if (mode === 'erase') return eraseAt(p);
    const q = pts[pts.length - 1];
    if (Math.hypot((p[0] - q[0]) * W, (p[1] - q[1]) * H) < 3) return;
    pts.push(p);
    live.setAttribute('d', inkPath(pts, W, H));
  });
  const end = () => {
    if (!mode) return;
    inner.classList.remove('inking');
    if (mode === 'pen' && pts) {
      inkRemember();
      mapStrokes().push({ c: MapInk.color, p: pts.map(([x, y]) => [Math.round(x * 1e4) / 1e4, Math.round(y * 1e4) / 1e4]) });
      redraw();
    }
    saveRun();
    mode = null; pts = null; live = null;
  };
  inner.addEventListener('pointerup', end);
  inner.addEventListener('pointercancel', end);
}

function mapTools(inner) {
  const bar = el('div', 'map-tools');
  const setTool = (t) => {
    MapInk.tool = MapInk.tool === t ? null : t;
    inner.classList.remove('drawing', 'tool-pen', 'tool-erase');
    if (MapInk.tool) inner.classList.add('drawing', 'tool-' + MapInk.tool);
    paint();
  };
  const btn = (ic, tip, fn, cls = '') => { const b = el('button', 'mt-btn ' + cls, icon(ic)); b.dataset.tip = tip; b.onclick = fn; bar.appendChild(b); return b; };
  const pen = btn('pencil', '<b>Draw</b> on the map (D).<br>You can also hold the <b>right mouse button</b> to draw at any time.', () => setTool('pen'));
  const rub = btn('eraser', '<b>Eraser</b>: rub out lines you drew.', () => setTool('erase'));
  const swatches = el('div', 'mt-colors');
  for (const c of MAP_INK) {
    const s = el('button', 'mt-color');
    s.style.setProperty('--c', c);
    s.onclick = () => { MapInk.color = c; if (MapInk.tool !== 'pen') setTool('pen'); else paint(); };
    swatches.appendChild(s);
  }
  bar.appendChild(swatches);
  btn('undo', '<b>Undo</b> (Ctrl+Z)', inkUndo);
  btn('trash', '<b>Clear</b> all drawings on this act', inkClear);
  function paint() {
    pen.classList.toggle('on', MapInk.tool === 'pen');
    rub.classList.toggle('on', MapInk.tool === 'erase');
    [...swatches.children].forEach((s, i) => s.classList.toggle('on', MAP_INK[i] === MapInk.color));
  }
  paint();
  MapInk.setTool = setTool;
  return bar;
}

document.addEventListener('keydown', (ev) => {
  if (/INPUT|TEXTAREA/.test(ev.target.tagName) || !Game.run || Game.combat || !document.querySelector('.map-ink')) return;
  if (document.querySelector('#overlay.show') && !document.querySelector('#overlay.show .map-ink')) return;
  if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'z' || ev.key === 'Z')) { ev.preventDefault(); inkUndo(); }
  else if (!ev.ctrlKey && !ev.metaKey && !ev.altKey && (ev.key === 'd' || ev.key === 'D') && MapInk.setTool) MapInk.setTool('pen');
});

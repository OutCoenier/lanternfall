// ===== Map generation & rendering =====
'use strict';

const MAP_ROWS = 13;
const MAP_COLS = 7;
const NODE_INFO = {
  fight:    { icon: '⚔️', name: 'Enemy', tip: 'Fight a group of monsters.' },
  elite:    { icon: '😈', name: 'Elite', tip: 'A dangerous foe. Defeat it to earn a Curio.' },
  rest:     { icon: '🔥', name: 'Hearth', tip: 'Rest to heal, or Temper (upgrade) a card.' },
  shop:     { icon: '🛒', name: 'Peddler', tip: 'Buy cards, Curios and Tonics, or remove a card.' },
  treasure: { icon: '🧰', name: 'Treasure', tip: 'A chest holding a Curio.' },
  event:    { icon: '❓', name: 'Unknown', tip: 'Something strange awaits.' },
  boss:     { icon: '💀', name: 'Boss', tip: 'The master of this act.' },
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

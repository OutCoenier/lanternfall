// ===== Lanternfall icon set =====
// Every icon in the game is drawn here (no emoji). Each icon is a 64x64 drawing.
//   icon('flame')        -> inline SVG for HTML
//   iconMarkup('flame')  -> the raw drawing (used inside card pictures)
// Text anywhere in the game can say :iconName: (like ':flame:') and it is drawn as that icon.
'use strict';

const ICON_DEFS = `
<linearGradient id="igGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b3"/><stop offset=".5" stop-color="#f4b740"/><stop offset="1" stop-color="#a7621a"/></linearGradient>
<linearGradient id="igSteel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c3cfdc"/><stop offset="1" stop-color="#6b7b8f"/></linearGradient>
<linearGradient id="igFire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d9361a"/><stop offset=".55" stop-color="#ff9a2a"/><stop offset="1" stop-color="#ffe680"/></linearGradient>
<linearGradient id="igRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8e86"/><stop offset=".5" stop-color="#e2333d"/><stop offset="1" stop-color="#8a1222"/></linearGradient>
<linearGradient id="igBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2f0ff"/><stop offset=".5" stop-color="#4fa9ff"/><stop offset="1" stop-color="#1d4aa0"/></linearGradient>
<linearGradient id="igGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ddffb8"/><stop offset=".5" stop-color="#6ccf48"/><stop offset="1" stop-color="#26721c"/></linearGradient>
<linearGradient id="igPurple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecd0ff"/><stop offset=".5" stop-color="#a65cff"/><stop offset="1" stop-color="#521c96"/></linearGradient>
<linearGradient id="igWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0a86e"/><stop offset="1" stop-color="#7f4f22"/></linearGradient>
<linearGradient id="igStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ddd4"/><stop offset=".6" stop-color="#959087"/><stop offset="1" stop-color="#57524b"/></linearGradient>
<linearGradient id="igDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5880"/><stop offset="1" stop-color="#1f1729"/></linearGradient>
<linearGradient id="igMoon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#f3dc8a"/><stop offset="1" stop-color="#c49a3a"/></linearGradient>
<linearGradient id="igBone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfc6b4"/></linearGradient>
<linearGradient id="igPink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd0ea"/><stop offset="1" stop-color="#d84a9a"/></linearGradient>
<radialGradient id="igGlass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".4" stop-color="#d8f4ff" stop-opacity=".45"/><stop offset="1" stop-color="#7fb8d8" stop-opacity=".35"/></radialGradient>
<radialGradient id="igOrb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="#d9b2ff"/><stop offset="1" stop-color="#4a1a8a"/></radialGradient>`;

const ICONS = (() => {
const O = 'stroke="#1c1220" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';
const HI = 'fill="#fff" opacity=".45"';
const f1 = (n) => Math.round(n * 10) / 10;
const pts = (n, cx, cy, r1, r2, rot = -90) => Array.from({ length: n * 2 }, (_, i) => {
  const a = ((rot + (i * 180) / n) * Math.PI) / 180, r = i % 2 ? r2 : r1;
  return `${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)}`;
}).join(' ');
const star = (cx, cy, r1, r2, n, fill, extra = '') => `<polygon points="${pts(n, cx, cy, r1, r2)}" fill="${fill}" ${O} ${extra}/>`;
const gear = (cx, cy, r1, r2, n) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, w = Math.PI / n / 1.6;
    const p = [[a - w, r2], [a - w * 0.7, r1], [a + w * 0.7, r1], [a + w, r2]].map(([t, r]) => `${f1(cx + Math.cos(t) * r)},${f1(cy + Math.sin(t) * r)}`);
    d += (i ? ' L' : 'M') + p.join(' L');
  }
  return d + ' Z';
};
const flameP = (x, y, w, h) => `M${x} ${y} C${x - w} ${y - h * 0.3} ${x - w * 0.6} ${y - h * 0.65} ${x - w * 0.1} ${y - h} C${x + w * 0.1} ${y - h * 0.62} ${x + w * 0.9} ${y - h * 0.55} ${x + w} ${y - h * 0.25} C${x + w} ${y - h * 0.05} ${x + w * 0.4} ${y} ${x} ${y} Z`;
const dropP = (cx, cy, r) => `M${cx} ${cy - r * 2} C${cx + r * 0.9} ${cy - r * 0.8} ${cx + r} ${cy - r * 0.3} ${cx + r} ${cy} A${r} ${r} 0 0 1 ${cx - r} ${cy} C${cx - r} ${cy - r * 0.3} ${cx - r * 0.9} ${cy - r * 0.8} ${cx} ${cy - r * 2} Z`;
const dagger = `<path d="M47 5 L54 12 L27 39 L21 33 Z" fill="url(#igSteel)" ${O}/><path d="M47 5 L50 8 L24 34" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/><path d="M13 31 L33 51 L29 55 L9 35 Z" fill="url(#igGold)" ${O}/><path d="M16 45 L22 51 L13 60 L7 54 Z" fill="url(#igWood)" ${O}/>`;
const heart = (fill) => `<path d="M32 56 C14 44 6 34 6 23 C6 14 13 8 21 8 C26 8 30 11 32 15 C34 11 38 8 43 8 C51 8 58 14 58 23 C58 34 50 44 32 56 Z" fill="${fill}" ${O}/><ellipse cx="19" cy="20" rx="5" ry="3.2" ${HI} transform="rotate(-30 19 20)"/>`;
const flask = (liquid) => `<path d="M26 6 L38 6 M28 6 L28 22 C16 27 10 36 12 46 C14 56 22 60 32 60 C42 60 50 56 52 46 C54 36 48 27 36 22 L36 6" fill="url(#igGlass)" ${O}/><path d="M13.5 42 C14 54 22 58 32 58 C42 58 50 54 50.5 42 Z" fill="${liquid}" stroke="#1c1220" stroke-width="1.6"/><circle cx="25" cy="49" r="2.6" fill="#fff" opacity=".7"/><circle cx="36" cy="46" r="1.8" fill="#fff" opacity=".6"/><rect x="25" y="2" width="14" height="6" rx="2" fill="url(#igWood)" ${O}/><path d="M18 33 C17 37 17 40 18 43" stroke="#fff" stroke-width="2.2" fill="none" opacity=".7"/>`;
const orb = (fill) => `<circle cx="32" cy="32" r="22" fill="${fill}" ${O}/><ellipse cx="25" cy="23" rx="7" ry="4.5" ${HI}/>`;

return {
  // ---------- fire and light ----------
  flame: `<path d="${flameP(32, 60, 22, 56)}" fill="url(#igFire)" ${O}/><path d="${flameP(32, 58, 10, 28)}" fill="#fff4c2"/>`,
  twinFlame: `<path d="${flameP(22, 60, 14, 44)}" fill="url(#igFire)" ${O}/><path d="${flameP(42, 60, 16, 54)}" fill="url(#igFire)" ${O}/><path d="${flameP(42, 58, 7, 24)}" fill="#fff4c2"/><path d="${flameP(22, 58, 6, 18)}" fill="#fff4c2"/>`,
  heartFlame: `${heart('url(#igRed)')}<path d="${flameP(32, 40, 10, 30)}" fill="url(#igFire)" ${O}/>`,
  lantern: `<path d="M32 2 L32 8" stroke="#1c1220" stroke-width="3"/><rect x="22" y="7" width="20" height="6" rx="2" fill="url(#igGold)" ${O}/><ellipse cx="32" cy="34" rx="20" ry="22" fill="url(#igRed)" ${O}/><path d="M16 26 Q32 30 48 26 M14 36 Q32 40 50 36 M16 46 Q32 50 48 46" stroke="#ffd36a" stroke-width="2.2" fill="none" opacity=".85"/><ellipse cx="32" cy="34" rx="8" ry="14" fill="#ffe7a0" opacity=".55"/><rect x="22" y="55" width="20" height="6" rx="2" fill="url(#igGold)" ${O}/>`,
  candle: `<path d="${flameP(32, 22, 8, 20)}" fill="url(#igFire)" ${O}/><rect x="22" y="24" width="20" height="32" rx="3" fill="#f3e7c9" ${O}/><path d="M26 24 C26 30 24 32 24 36" stroke="#d8c8a0" stroke-width="3" fill="none"/><ellipse cx="32" cy="58" rx="18" ry="4" fill="url(#igGold)" ${O}/>`,
  oilLamp: `<path d="${flameP(44, 26, 7, 20)}" fill="url(#igFire)" ${O}/><path d="M6 36 C10 52 24 56 34 54 C46 52 52 44 54 34 L42 36 C36 38 16 38 6 36 Z" fill="url(#igGold)" ${O}/><path d="M42 36 L52 28" stroke="#1c1220" stroke-width="3"/>`,
  sun: `<polygon points="${pts(12, 32, 32, 30, 18)}" fill="url(#igFire)" ${O}/><circle cx="32" cy="32" r="15" fill="url(#igGold)" ${O}/><ellipse cx="27" cy="26" rx="5" ry="3" ${HI}/>`,
  sunrise: `<polygon points="${pts(9, 32, 40, 28, 16, -90)}" fill="url(#igFire)" ${O}/><circle cx="32" cy="40" r="14" fill="url(#igGold)" ${O}/><path d="M2 42 L62 42 L62 62 L2 62 Z" fill="url(#igDark)" ${O}/><path d="M10 49 L26 49 M36 49 L54 49 M18 55 L46 55" stroke="#ffcf7a" stroke-width="2.4" opacity=".7"/>`,
  star: star(32, 33, 28, 12, 5, 'url(#igGold)', ''),
  sparkles: `${star(28, 34, 24, 7, 4, 'url(#igGold)')}${star(50, 13, 10, 3.5, 4, 'url(#igGold)')}${star(50, 50, 8, 3, 4, 'url(#igGold)')}`,
  burst: `<polygon points="${pts(12, 32, 32, 30, 14)}" fill="url(#igFire)" ${O}/><polygon points="${pts(8, 32, 32, 14, 7)}" fill="#fff6c8"/>`,
  shootingStar: `<path d="M6 58 L34 30" stroke="url(#igFire)" stroke-width="9" stroke-linecap="round" opacity=".8"/><path d="M14 58 L36 36" stroke="#ffe8a0" stroke-width="3" stroke-linecap="round"/>${star(42, 22, 18, 7, 5, 'url(#igGold)')}`,
  bolt: `<path d="M38 3 L13 36 L29 36 L22 61 L51 24 L34 24 L44 3 Z" fill="url(#igGold)" ${O}/><path d="M37 8 L20 32" stroke="#fff" stroke-width="2" opacity=".7"/>`,
  bulb: `<path d="M32 6 C18 6 12 18 14 28 C16 36 24 38 24 46 L40 46 C40 38 48 36 50 28 C52 18 46 6 32 6 Z" fill="#fff3a8" ${O}/><path d="M26 46 L26 56 L38 56 L38 46" fill="url(#igSteel)" ${O}/><path d="M26 50 L38 50 M26 53 L38 53" stroke="#1c1220" stroke-width="1.5"/><path d="M28 36 L32 28 L36 36" stroke="#e8a020" stroke-width="2.4" fill="none"/>`,
  torch: `<path d="M30 30 L62 14 L62 50 Z" fill="#fff3a8" opacity=".55"/><rect x="4" y="24" width="30" height="16" rx="4" fill="url(#igSteel)" ${O}/><rect x="30" y="20" width="8" height="24" rx="2" fill="url(#igGold)" ${O}/>`,
  // ---------- body, health and combat ----------
  heart: heart('url(#igRed)'),
  heartGreen: heart('url(#igGreen)'),
  heartDark: heart('url(#igDark)'),
  shield: `<path d="M32 5 L55 13 C55 35 46 50 32 59 C18 50 9 35 9 13 Z" fill="url(#igBlue)" ${O}/><path d="M32 11 L49 17 C49 33 43 45 32 52 Z" fill="#fff" opacity=".25"/><path d="M32 5 L32 59" stroke="#1c1220" stroke-width="1.4" opacity=".5"/>`,
  dagger,
  swords: `<g>${dagger}</g><g transform="translate(64 0) scale(-1 1)">${dagger}</g>`,
  axe: `<path d="M16 60 L42 8" stroke="#1c1220" stroke-width="7" stroke-linecap="round"/><path d="M16 60 L42 8" stroke="url(#igWood)" stroke-width="4" stroke-linecap="round"/><path d="M34 8 C50 2 60 12 58 30 C52 25 44 23 36 26 Z" fill="url(#igSteel)" ${O}/>`,
  hammer: `<path d="M12 58 L36 32" stroke="#1c1220" stroke-width="8" stroke-linecap="round"/><path d="M12 58 L36 32" stroke="url(#igWood)" stroke-width="5" stroke-linecap="round"/><path d="M28 14 L48 34 L58 24 L38 4 Z" fill="url(#igStone)" ${O}/><path d="M33 12 L50 29" stroke="#fff" stroke-width="2" opacity=".5"/>`,
  fist: `<path d="M18 30 C18 20 26 16 34 18 L46 22 C52 24 54 30 52 36 L50 46 C48 54 40 58 32 58 L26 58 C20 58 16 52 16 46 Z" fill="url(#igFire)" ${O}/><path d="M24 26 L44 30 M22 36 L46 40" stroke="#1c1220" stroke-width="2" opacity=".6"/><path d="M28 10 L32 2 L36 10 M18 14 L14 6 M46 14 L50 6" stroke="#ffd76a" stroke-width="3" fill="none"/>`,
  hand: `<path d="M20 58 C14 50 12 42 14 34 L16 24 C16 20 22 20 22 24 L22 12 C22 8 28 8 28 12 L28 8 C28 4 34 4 34 8 L34 10 C34 6 40 6 40 10 L40 18 C40 14 46 14 46 18 L46 40 C46 50 40 58 32 58 Z" fill="url(#igGold)" ${O}/><path d="M28 12 L28 30 M34 10 L34 30 M40 18 L40 32" stroke="#1c1220" stroke-width="1.6" opacity=".55"/>`,
  skull: `<path d="M32 6 C16 6 8 16 8 28 C8 36 12 40 16 42 L16 52 L48 52 L48 42 C52 40 56 36 56 28 C56 16 48 6 32 6 Z" fill="url(#igBone)" ${O}/><ellipse cx="22" cy="30" rx="6" ry="7" fill="#1c1220"/><ellipse cx="42" cy="30" rx="6" ry="7" fill="#1c1220"/><path d="M32 36 L29 43 L35 43 Z" fill="#1c1220"/><path d="M24 52 L24 58 M32 52 L32 58 M40 52 L40 58" stroke="#1c1220" stroke-width="2.6"/><circle cx="23" cy="29" r="2" fill="#ff6a5a"/><circle cx="43" cy="29" r="2" fill="#ff6a5a"/>`,
  bloodDrop: `<path d="${dropP(32, 42, 17)}" fill="url(#igRed)" ${O}/><ellipse cx="25" cy="38" rx="4" ry="6" ${HI}/>`,
  drop: `<path d="${dropP(32, 42, 17)}" fill="url(#igBlue)" ${O}/><ellipse cx="25" cy="38" rx="4" ry="6" ${HI}/>`,
  bubbles: `<circle cx="24" cy="38" r="15" fill="url(#igGlass)" ${O}/><circle cx="46" cy="22" r="10" fill="url(#igGlass)" ${O}/><circle cx="46" cy="50" r="6" fill="url(#igGlass)" ${O}/>`,
  eye: `<path d="M4 32 C16 14 48 14 60 32 C48 50 16 50 4 32 Z" fill="#f6f1ea" ${O}/><circle cx="32" cy="32" r="12" fill="url(#igBlue)" stroke="#1c1220" stroke-width="2"/><circle cx="32" cy="32" r="5.5" fill="#1c1220"/><circle cx="28" cy="28" r="2.6" fill="#fff"/>`,
  nazar: `<circle cx="32" cy="32" r="27" fill="#2a5ad8" ${O}/><circle cx="32" cy="32" r="18" fill="#f4f8ff"/><circle cx="32" cy="32" r="11" fill="#6ab8ff"/><circle cx="32" cy="32" r="5" fill="#1c1220"/>`,
  might: `<path d="M14 54 L14 36 C14 26 22 22 28 26 L28 14 C28 8 36 8 36 14 L36 22 C42 18 50 22 50 30 L50 42 C50 50 44 56 36 56 Z" fill="url(#igFire)" ${O}/><path d="M28 30 C32 28 36 30 38 34" stroke="#1c1220" stroke-width="2" fill="none" opacity=".6"/>`,
  arrowUp: `<path d="M32 4 L56 30 L42 30 L42 58 L22 58 L22 30 L8 30 Z" fill="url(#igGreen)" ${O}/>`,
  arrowDown: `<path d="M32 60 L56 34 L42 34 L42 6 L22 6 L22 34 L8 34 Z" fill="url(#igPurple)" ${O}/>`,
  divide: `<circle cx="32" cy="14" r="6" fill="url(#igGreen)" ${O}/><rect x="8" y="28" width="48" height="8" rx="3" fill="url(#igGreen)" ${O}/><circle cx="32" cy="50" r="6" fill="url(#igGreen)" ${O}/>`,
  plus: `<path d="M24 6 L40 6 L40 24 L58 24 L58 40 L40 40 L40 58 L24 58 L24 40 L6 40 L6 24 L24 24 Z" fill="url(#igGreen)" ${O}/>`,
  check: `<path d="M8 34 L24 50 L56 14" stroke="#1c1220" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 34 L24 50 L56 14" stroke="#7ddc4a" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  question: `<path d="M20 22 C20 10 44 8 44 22 C44 32 32 32 32 42" stroke="#1c1220" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M20 22 C20 10 44 8 44 22 C44 32 32 32 32 42" stroke="#ffd76a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="32" cy="54" r="5.5" fill="#ffd76a" ${O}/>`,
  swirl: `<path d="M32 32 C32 28 38 28 38 32 C38 38 28 40 26 32 C24 22 40 18 44 30 C48 42 32 50 22 44 C10 36 14 14 32 12 C50 10 60 28 54 42" stroke="#1c1220" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M32 32 C32 28 38 28 38 32 C38 38 28 40 26 32 C24 22 40 18 44 30 C48 42 32 50 22 44 C10 36 14 14 32 12 C50 10 60 28 54 42" stroke="#b07cff" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
  egg: `<ellipse cx="32" cy="35" rx="19" ry="25" fill="url(#igBone)" ${O}/><circle cx="26" cy="30" r="2.2" fill="#a8956a"/><circle cx="38" cy="42" r="2.8" fill="#a8956a"/><circle cx="34" cy="22" r="1.8" fill="#a8956a"/>`,
  orbRed: orb('url(#igRed)'), orbGreen: orb('url(#igGreen)'), orbBrown: orb('url(#igWood)'),
  diamondSmall: `<path d="M32 6 L54 32 L32 58 L10 32 Z" fill="url(#igFire)" ${O}/>`,
  triangleDown: `<path d="M8 12 L56 12 L32 56 Z" fill="url(#igRed)" ${O}/>`,
  // ---------- moon and sky ----------
  moon: `<path d="M40 5 A27 27 0 1 0 59 44 A21 21 0 1 1 40 5 Z" fill="url(#igMoon)" ${O}/><circle cx="18" cy="38" r="2.5" fill="#c49a3a" opacity=".6"/><circle cx="24" cy="50" r="1.8" fill="#c49a3a" opacity=".6"/>`,
  moonHalf: `<circle cx="32" cy="32" r="25" fill="url(#igDark)" ${O}/><path d="M32 7 A25 25 0 0 1 32 57 Z" fill="url(#igMoon)" ${O}/>`,
  fullMoon: `<circle cx="32" cy="32" r="25" fill="url(#igMoon)" ${O}/><circle cx="24" cy="26" r="5" fill="#c49a3a" opacity=".45"/><circle cx="40" cy="38" r="7" fill="#c49a3a" opacity=".4"/><circle cx="36" cy="18" r="3" fill="#c49a3a" opacity=".45"/>`,
  newMoon: `<circle cx="32" cy="32" r="25" fill="url(#igDark)" ${O}/><path d="M48 14 A25 25 0 0 1 50 50" stroke="#c9b8ff" stroke-width="3" fill="none" opacity=".8"/>`,
  galaxy: `<ellipse cx="32" cy="32" rx="28" ry="14" fill="url(#igPurple)" ${O} transform="rotate(-25 32 32)"/><circle cx="32" cy="32" r="7" fill="#fff4c8"/><circle cx="16" cy="40" r="1.5" fill="#fff"/><circle cx="46" cy="24" r="1.8" fill="#fff"/><circle cx="40" cy="44" r="1.2" fill="#fff"/>`,
  cloud: `<path d="M17 48 C7 48 5 35 14 31 C14 20 27 16 33 23 C37 14 52 15 53 27 C62 28 62 48 51 48 Z" fill="#ebe7f4" ${O}/><path d="M18 34 C20 28 26 26 30 28" stroke="#fff" stroke-width="3" fill="none"/>`,
  rainCloud: `<path d="M17 38 C7 38 5 25 14 21 C14 10 27 6 33 13 C37 4 52 5 53 17 C62 18 62 38 51 38 Z" fill="#c8c4d8" ${O}/><path d="M18 46 L14 56 M30 46 L26 58 M42 46 L38 56" stroke="#4fa9ff" stroke-width="4" stroke-linecap="round"/>`,
  wind: `<path d="M6 22 L40 22 C48 22 50 12 42 10 M6 34 L50 34 C58 34 60 46 52 48 M10 46 L32 46 C38 46 40 54 34 56" stroke="#1c1220" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M6 22 L40 22 C48 22 50 12 42 10 M6 34 L50 34 C58 34 60 46 52 48 M10 46 L32 46 C38 46 40 54 34 56" stroke="#dff2ff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  tornado: `<path d="M8 8 L56 8 L48 20 L16 20 Z M14 22 L50 22 L42 34 L22 34 Z M20 36 L44 36 L38 46 L26 46 Z M26 48 L38 48 L34 58 L30 58 Z" fill="#cfd6e6" ${O}/>`,
  wave: `<path d="M2 50 C12 22 34 8 52 18 C40 18 34 26 40 34 C46 40 56 36 60 30 C62 44 52 58 32 58 L2 58 Z" fill="url(#igBlue)" ${O}/><path d="M40 34 C34 28 38 20 50 19" stroke="#fff" stroke-width="3" fill="none"/>`,
  volcano: `<path d="M4 58 L22 22 L42 22 L60 58 Z" fill="url(#igStone)" ${O}/><path d="M22 22 L42 22 L38 30 L34 26 L30 32 L26 26 Z" fill="url(#igFire)" stroke="#1c1220" stroke-width="2"/><path d="M26 18 C24 10 30 8 30 2 M36 18 C38 12 34 8 38 4" stroke="#9a9a9a" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  fountain: `<path d="M10 46 L54 46 L50 58 L14 58 Z" fill="url(#igStone)" ${O}/><path d="M32 46 L32 18" stroke="url(#igStone)" stroke-width="6"/><path d="M32 18 C20 18 14 30 12 44 M32 18 C44 18 50 30 52 44 M32 18 L32 6" stroke="#4fa9ff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  hole: `<ellipse cx="32" cy="38" rx="28" ry="14" fill="#0a0610" ${O}/><ellipse cx="32" cy="36" rx="20" ry="8" fill="#1c1220"/>`,
  // ---------- potions, bottles and containers ----------
  flask: flask('url(#igGreen)'),
  flaskRed: flask('url(#igRed)'),
  flaskBlue: flask('url(#igBlue)'),
  bottle: `<path d="M27 4 L37 4 L37 18 C46 22 48 30 48 38 L48 56 C48 60 44 62 40 62 L24 62 C20 62 16 60 16 56 L16 38 C16 30 18 22 27 18 Z" fill="url(#igGreen)" ${O}/><rect x="25" y="2" width="14" height="7" rx="2" fill="url(#igWood)" ${O}/><path d="M22 36 L22 54" stroke="#fff" stroke-width="3" opacity=".6"/><rect x="20" y="40" width="24" height="12" rx="2" fill="#f3e7c9" stroke="#1c1220" stroke-width="1.6"/>`,
  goblet: `<path d="M14 8 L50 8 C50 26 44 34 32 34 C20 34 14 26 14 8 Z" fill="#f6f1ea" ${O}/><path d="M16 16 L48 16 C47 26 42 31 32 31 C22 31 17 26 16 16 Z" fill="url(#igRed)"/><path d="M32 34 L32 52 M20 58 L44 58 L40 52 L24 52 Z" stroke="#1c1220" stroke-width="2.6" fill="url(#igGold)"/>`,
  jar: `<rect x="14" y="14" width="36" height="46" rx="8" fill="url(#igGlass)" ${O}/><rect x="16" y="30" width="32" height="28" rx="6" fill="url(#igGold)" opacity=".85"/><rect x="12" y="6" width="40" height="10" rx="3" fill="url(#igWood)" ${O}/><path d="M20 22 L20 50" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  urn: `<path d="M24 6 L40 6 L38 14 C50 18 54 30 50 42 C46 52 40 56 40 60 L24 60 C24 56 18 52 14 42 C10 30 14 18 26 14 Z" fill="#c8673a" ${O}/><path d="M14 22 C6 22 6 34 14 34 M50 22 C58 22 58 34 50 34" stroke="#1c1220" stroke-width="2.6" fill="none"/><path d="M16 30 L48 30 M18 40 L46 40" stroke="#2a1a10" stroke-width="2.6"/>`,
  teapot: `<ellipse cx="30" cy="40" rx="20" ry="16" fill="url(#igDark)" ${O}/><path d="M48 36 L60 26 L58 34 L50 44" fill="url(#igDark)" ${O}/><path d="M12 32 C2 32 2 48 12 46" stroke="#1c1220" stroke-width="4" fill="none"/><rect x="22" y="20" width="16" height="6" rx="2" fill="url(#igSteel)" ${O}/><circle cx="30" cy="17" r="3" fill="url(#igSteel)" ${O}/>`,
  pour: `<path d="M8 20 L30 6 L40 22 L18 36 Z" fill="url(#igGold)" ${O}/><path d="M38 20 C46 26 48 36 46 58" stroke="#ffb02e" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="44" cy="58" rx="12" ry="3" fill="#ffb02e" ${O}/>`,
  drum: `<rect x="14" y="8" width="36" height="50" rx="5" fill="url(#igBlue)" ${O}/><path d="M14 22 L50 22 M14 44 L50 44" stroke="#1c1220" stroke-width="2.6"/><ellipse cx="32" cy="9" rx="18" ry="4" fill="#9bc8ff" ${O}/>`,
  pill: `<rect x="8" y="22" width="48" height="20" rx="10" fill="url(#igRed)" ${O} transform="rotate(-35 32 32)"/><path d="M32 18 L32 46" stroke="#1c1220" stroke-width="2.6" transform="rotate(-35 32 32)"/><rect x="32" y="22" width="24" height="20" rx="10" fill="#f6f1ea" transform="rotate(-35 32 32)" stroke="#1c1220" stroke-width="2.6"/>`,
  syringe: `<path d="M6 58 L16 48" stroke="#9aa6b4" stroke-width="3"/><rect x="14" y="26" width="34" height="14" rx="3" fill="url(#igGlass)" ${O} transform="rotate(-45 31 33)"/><rect x="16" y="28" width="16" height="10" fill="url(#igRed)" transform="rotate(-45 31 33)"/><path d="M44 20 L54 10 M48 6 L58 16" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/>`,
  petri: `<ellipse cx="32" cy="38" rx="26" ry="14" fill="url(#igGlass)" ${O}/><circle cx="24" cy="38" r="4" fill="#7ddc4a"/><circle cx="36" cy="34" r="3" fill="#ff8ac8"/><circle cx="40" cy="42" r="3.5" fill="#7ddc4a"/>`,
  microscope: `<rect x="10" y="54" width="44" height="6" rx="2" fill="url(#igSteel)" ${O}/><path d="M42 54 C54 46 52 30 40 26" stroke="#1c1220" stroke-width="5" fill="none"/><rect x="24" y="6" width="12" height="30" rx="3" fill="url(#igSteel)" ${O} transform="rotate(-20 30 21)"/><rect x="18" y="40" width="24" height="5" rx="2" fill="url(#igDark)" ${O}/>`,
  magnifier: `<circle cx="26" cy="26" r="18" fill="url(#igGlass)" stroke="#1c1220" stroke-width="5"/><path d="M40 40 L58 58" stroke="#1c1220" stroke-width="10" stroke-linecap="round"/><path d="M40 40 L58 58" stroke="url(#igWood)" stroke-width="6" stroke-linecap="round"/>`,
  crystalBall: `<circle cx="32" cy="28" r="22" fill="url(#igOrb)" ${O}/><path d="M14 56 L50 56 L44 46 L20 46 Z" fill="url(#igGold)" ${O}/>`,
  radioactive: `<circle cx="32" cy="32" r="28" fill="#ffd23a" ${O}/><path d="M32 32 L18 8 A28 28 0 0 1 46 8 Z M32 32 L60 32 A28 28 0 0 1 46 56 Z M32 32 L18 56 A28 28 0 0 1 4 32 Z" fill="#1c1220" transform="scale(.82) translate(7 7)"/><circle cx="32" cy="32" r="5" fill="#1c1220" stroke="#ffd23a" stroke-width="2"/>`,
  mercury: `<circle cx="32" cy="30" r="12" fill="none" stroke="url(#igSteel)" stroke-width="6"/><path d="M32 42 L32 60 M24 52 L40 52 M22 6 C24 14 40 14 42 6" stroke="url(#igSteel)" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  // ---------- treasure ----------
  coin: `<circle cx="32" cy="32" r="25" fill="url(#igGold)" ${O}/><circle cx="32" cy="32" r="17" fill="none" stroke="#a7621a" stroke-width="2.4"/><path d="M32 20 L40 32 L32 44 L24 32 Z" fill="#fff2b3" stroke="#a7621a" stroke-width="2"/>`,
  moneybag: `<path d="M22 16 L42 16 L36 24 C52 30 56 44 50 52 C46 58 40 60 32 60 C24 60 18 58 14 52 C8 44 12 30 28 24 Z" fill="url(#igWood)" ${O}/><path d="M20 12 L44 12 L40 18 L24 18 Z" fill="url(#igWood)" ${O}/><circle cx="32" cy="42" r="9" fill="url(#igGold)" ${O}/>`,
  gem: `<path d="M16 8 L48 8 L60 24 L32 58 L4 24 Z" fill="url(#igBlue)" ${O}/><path d="M4 24 L60 24 M16 8 L24 24 L32 8 L40 24 L48 8 M24 24 L32 58 L40 24" stroke="#1c1220" stroke-width="1.8" fill="none"/><path d="M18 12 L22 22" stroke="#fff" stroke-width="2.4" opacity=".8"/>`,
  ring: `<circle cx="32" cy="40" r="18" fill="none" stroke="#1c1220" stroke-width="10"/><circle cx="32" cy="40" r="18" fill="none" stroke="url(#igGold)" stroke-width="6"/><path d="M24 14 L40 14 L44 20 L32 30 L20 20 Z" fill="url(#igBlue)" ${O}/>`,
  crown: `<path d="M6 48 L10 16 L22 32 L32 10 L42 32 L54 16 L58 48 Z" fill="url(#igGold)" ${O}/><rect x="6" y="46" width="52" height="10" rx="3" fill="url(#igGold)" ${O}/><circle cx="32" cy="38" r="4" fill="#e2333d" stroke="#1c1220" stroke-width="2"/><circle cx="18" cy="40" r="3" fill="#4fa9ff" stroke="#1c1220" stroke-width="2"/><circle cx="46" cy="40" r="3" fill="#4fa9ff" stroke="#1c1220" stroke-width="2"/>`,
  key: `<circle cx="18" cy="20" r="12" fill="none" stroke="#1c1220" stroke-width="10"/><circle cx="18" cy="20" r="12" fill="none" stroke="url(#igGold)" stroke-width="6"/><path d="M27 29 L56 58 M44 46 L50 40 M50 52 L56 46" stroke="#1c1220" stroke-width="9" stroke-linecap="round"/><path d="M27 29 L56 58 M44 46 L50 40 M50 52 L56 46" stroke="url(#igGold)" stroke-width="5" stroke-linecap="round"/>`,
  lock: `<path d="M20 28 L20 18 C20 6 44 6 44 18 L44 28" stroke="#1c1220" stroke-width="9" fill="none"/><path d="M20 28 L20 18 C20 6 44 6 44 18 L44 28" stroke="url(#igSteel)" stroke-width="5" fill="none"/><rect x="12" y="28" width="40" height="30" rx="5" fill="url(#igGold)" ${O}/><circle cx="32" cy="41" r="4" fill="#1c1220"/><path d="M32 43 L32 50" stroke="#1c1220" stroke-width="3"/>`,
  unlock: `<path d="M20 28 L20 16 C20 4 44 4 44 16" stroke="#1c1220" stroke-width="9" fill="none" transform="translate(-10 -4) rotate(-20 32 16)"/><path d="M20 28 L20 16 C20 4 44 4 44 16" stroke="url(#igSteel)" stroke-width="5" fill="none" transform="translate(-10 -4) rotate(-20 32 16)"/><rect x="12" y="28" width="40" height="30" rx="5" fill="url(#igGold)" ${O}/><circle cx="32" cy="41" r="4" fill="#1c1220"/>`,
  chest: `<path d="M6 28 C6 14 58 14 58 28 Z" fill="url(#igWood)" ${O}/><rect x="6" y="28" width="52" height="28" rx="3" fill="url(#igWood)" ${O}/><path d="M6 28 L58 28 M18 18 L18 56 M46 18 L46 56" stroke="url(#igGold)" stroke-width="5"/><rect x="27" y="30" width="10" height="12" rx="2" fill="url(#igGold)" ${O}/>`,
  trophy: `<path d="M18 6 L46 6 L44 26 C42 36 22 36 20 26 Z" fill="url(#igGold)" ${O}/><path d="M18 10 C4 10 6 28 20 26 M46 10 C60 10 58 28 44 26" stroke="#1c1220" stroke-width="3" fill="none"/><path d="M28 34 L36 34 L36 46 L28 46 Z" fill="url(#igGold)" ${O}/><rect x="16" y="46" width="32" height="12" rx="3" fill="url(#igWood)" ${O}/>`,
  bag: `<path d="M12 24 L52 24 L50 58 L14 58 Z" fill="url(#igWood)" ${O}/><path d="M22 24 C22 10 42 10 42 24" stroke="#1c1220" stroke-width="5" fill="none"/><path d="M12 24 L52 24 L44 38 L20 38 Z" fill="#a46a32" ${O}/><circle cx="32" cy="38" r="3.5" fill="url(#igGold)" ${O}/>`,
  basket: `<path d="M8 28 L56 28 L50 58 L14 58 Z" fill="url(#igWood)" ${O}/><path d="M12 38 L52 38 M14 48 L50 48 M22 28 L24 58 M32 28 L32 58 M42 28 L40 58" stroke="#5a3410" stroke-width="2"/><path d="M14 28 C14 6 50 6 50 28" stroke="#1c1220" stroke-width="5" fill="none"/>`,
  box: `<path d="M8 20 L32 10 L56 20 L56 48 L32 58 L8 48 Z" fill="#c9965a" ${O}/><path d="M8 20 L32 30 L56 20 M32 30 L32 58" stroke="#1c1220" stroke-width="2.4" fill="none"/><path d="M20 15 L44 25" stroke="#f3e0b8" stroke-width="4"/>`,
  scroll: `<rect x="14" y="10" width="36" height="44" fill="#f3e2b8" ${O}/><rect x="8" y="6" width="48" height="8" rx="4" fill="url(#igWood)" ${O}/><rect x="8" y="50" width="48" height="8" rx="4" fill="url(#igWood)" ${O}/><path d="M20 22 L44 22 M20 30 L44 30 M20 38 L38 38" stroke="#8a6a3a" stroke-width="2.4"/>`,
  book: `<path d="M4 14 C16 10 26 12 32 18 C38 12 48 10 60 14 L60 54 C48 50 38 52 32 58 C26 52 16 50 4 54 Z" fill="#f3e2b8" ${O}/><path d="M32 18 L32 58" stroke="#1c1220" stroke-width="2.4"/><path d="M10 24 L26 24 M10 32 L26 32 M38 24 L54 24 M38 32 L54 32 M10 40 L24 40" stroke="#8a6a3a" stroke-width="2"/>`,
  calendar: `<rect x="8" y="10" width="48" height="46" rx="5" fill="#f6f1ea" ${O}/><path d="M8 10 L56 10 L56 22 L8 22 Z" fill="url(#igRed)" ${O}/><path d="M20 4 L20 14 M44 4 L44 14" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/>${[0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => `<rect x="${14 + c * 10}" y="${28 + r * 9}" width="6" height="5" fill="#8a6a6a"/>`).join('')).join('')}`,
  clipboard: `<rect x="10" y="8" width="44" height="52" rx="4" fill="url(#igWood)" ${O}/><rect x="16" y="14" width="32" height="40" fill="#f6f1ea" stroke="#1c1220" stroke-width="1.6"/><rect x="22" y="4" width="20" height="10" rx="3" fill="url(#igSteel)" ${O}/><path d="M22 26 L42 26 M22 34 L42 34 M22 42 L36 42" stroke="#8a8a9a" stroke-width="2.4"/>`,
  cards: `<rect x="8" y="12" width="30" height="42" rx="4" fill="url(#igRed)" ${O} transform="rotate(-12 23 33)"/><rect x="26" y="10" width="30" height="42" rx="4" fill="#f6f1ea" ${O} transform="rotate(8 41 31)"/><path d="${dropP(41, 32, 6)}" fill="url(#igRed)" transform="rotate(8 41 31)"/>`,
  cardBack: `<rect x="14" y="6" width="36" height="52" rx="5" fill="url(#igPurple)" ${O}/><rect x="19" y="11" width="26" height="42" rx="3" fill="none" stroke="#ffd76a" stroke-width="2"/><path d="M32 20 L40 32 L32 44 L24 32 Z" fill="#ffd76a"/>`,
  map: `<path d="M4 14 L22 8 L42 14 L60 8 L60 50 L42 56 L22 50 L4 56 Z" fill="#f3e2b8" ${O}/><path d="M22 8 L22 50 M42 14 L42 56" stroke="#1c1220" stroke-width="1.8" opacity=".5"/><path d="M12 42 C18 30 30 34 34 26 C38 20 46 22 50 18" stroke="#c4452c" stroke-width="2.6" fill="none" stroke-dasharray="4 3"/><path d="M46 14 L54 22 M54 14 L46 22" stroke="#c4452c" stroke-width="3"/>`,
  // ---------- tools ----------
  gear: `<path d="${gear(32, 32, 28, 21, 9)}" fill="url(#igSteel)" ${O}/><circle cx="32" cy="32" r="8" fill="#2a2030" ${O}/>`,
  saw: `<path d="M6 44 L44 10 L54 20 L16 54 Z" fill="url(#igSteel)" ${O}/><path d="M6 44 ${Array.from({ length: 8 }, (_, i) => `L${f1(10 + i * 5)} ${f1(52 - i * 4.4)} L${f1(12 + i * 5)} ${f1(46 - i * 4.4)}`).join(' ')}" stroke="#1c1220" stroke-width="1.6" fill="none"/><rect x="44" y="4" width="16" height="12" rx="3" fill="url(#igWood)" ${O} transform="rotate(42 52 10)"/>`,
  scissors: `<path d="M20 44 L50 8 M44 44 L14 8" stroke="#1c1220" stroke-width="8" stroke-linecap="round"/><path d="M20 44 L50 8 M44 44 L14 8" stroke="url(#igSteel)" stroke-width="4.5" stroke-linecap="round"/><circle cx="18" cy="50" r="8" fill="none" stroke="#c4452c" stroke-width="5"/><circle cx="46" cy="50" r="8" fill="none" stroke="#c4452c" stroke-width="5"/>`,
  needle: `<path d="M8 58 L54 8" stroke="#1c1220" stroke-width="7" stroke-linecap="round"/><path d="M8 58 L54 8" stroke="url(#igSteel)" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="49" cy="13" rx="2" ry="4" fill="#1c1220" transform="rotate(42 49 13)"/><path d="M49 13 C60 24 40 40 30 30 C22 22 6 30 10 44" stroke="#e2333d" stroke-width="2.4" fill="none"/>`,
  bolt2: `<path d="M8 40 L40 8 L56 24 L24 56 Z" fill="url(#igSteel)" ${O}/><circle cx="32" cy="32" r="8" fill="url(#igStone)" ${O}/>`,
  chain: `${[0, 1, 2].map((i) => `<rect x="${6 + i * 16}" y="${22 + (i % 2) * 2}" width="24" height="16" rx="8" fill="none" stroke="#1c1220" stroke-width="8"/><rect x="${6 + i * 16}" y="${22 + (i % 2) * 2}" width="24" height="16" rx="8" fill="none" stroke="url(#igSteel)" stroke-width="4"/>`).join('')}`,
  knot: `<path d="M8 40 C20 40 22 16 34 16 C48 16 48 38 34 38 C22 38 26 52 56 52" stroke="#1c1220" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M8 40 C20 40 22 16 34 16 C48 16 48 38 34 38 C22 38 26 52 56 52" stroke="#d9b07a" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  compass: `<circle cx="32" cy="32" r="26" fill="url(#igGold)" ${O}/><circle cx="32" cy="32" r="20" fill="#f6f1ea" stroke="#1c1220" stroke-width="2"/><path d="M32 14 L38 32 L32 50 L26 32 Z" fill="#e2333d" stroke="#1c1220" stroke-width="1.6"/><path d="M32 32 L38 32 L32 50 L26 32 Z" fill="#cfd6e6"/>`,
  mirror: `<ellipse cx="32" cy="26" rx="18" ry="22" fill="url(#igGlass)" stroke="url(#igGold)" stroke-width="6"/><ellipse cx="32" cy="26" rx="18" ry="22" fill="none" ${O}/><path d="M32 48 L32 60 M24 60 L40 60" stroke="#1c1220" stroke-width="5"/><path d="M24 16 L30 10" stroke="#fff" stroke-width="3"/>`,
  fan: `<path d="M32 58 L4 26 C14 8 50 8 60 26 Z" fill="url(#igPurple)" ${O}/><path d="M32 58 L14 14 M32 58 L32 10 M32 58 L50 14" stroke="#1c1220" stroke-width="1.8"/><circle cx="32" cy="56" r="4" fill="url(#igGold)" ${O}/>`,
  accordion: `<rect x="4" y="16" width="14" height="34" rx="3" fill="url(#igRed)" ${O}/><rect x="46" y="16" width="14" height="34" rx="3" fill="url(#igRed)" ${O}/><path d="M18 18 L24 48 L30 18 L36 48 L42 18 L46 48" stroke="#1c1220" stroke-width="2.6" fill="#f3e2b8"/>`,
  trident: `<path d="M32 62 L32 18" stroke="#1c1220" stroke-width="7"/><path d="M32 62 L32 18" stroke="url(#igGold)" stroke-width="4"/><path d="M12 6 L12 22 C12 30 52 30 52 22 L52 6 M32 2 L32 24" stroke="#1c1220" stroke-width="7" fill="none"/><path d="M12 6 L12 22 C12 30 52 30 52 22 L52 6 M32 2 L32 24" stroke="url(#igGold)" stroke-width="4" fill="none"/>`,
  beads: `${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<circle cx="${f1(32 + Math.cos(a) * 20)}" cy="${f1(28 + Math.sin(a) * 20)}" r="5" fill="url(#igWood)" ${O}/>`; }).join('')}<path d="M32 48 L32 60" stroke="#1c1220" stroke-width="3"/><circle cx="32" cy="60" r="3" fill="url(#igGold)"/>`,
  gloves: `<path d="M12 60 L12 36 L8 22 C6 16 14 14 16 20 L18 26 L18 10 C18 6 24 6 24 10 L24 26 L26 6 C26 2 32 2 32 6 L32 26 L34 10 C34 6 40 6 40 10 L40 36 L40 60 Z" fill="url(#igWood)" ${O}/><path d="M12 50 L40 50" stroke="#1c1220" stroke-width="2.4"/>`,
  coat: `<path d="M20 6 L32 14 L44 6 L58 18 L52 30 L48 26 L48 60 L16 60 L16 26 L12 30 L6 18 Z" fill="url(#igDark)" ${O}/><path d="M32 14 L32 60 M26 10 L32 26 L38 10" stroke="#1c1220" stroke-width="2.4" fill="none"/>`,
  yarn: `<circle cx="32" cy="32" r="24" fill="url(#igPink)" ${O}/><path d="M12 22 C28 26 40 40 44 54 M18 14 C34 20 48 34 52 46 M10 34 C22 34 32 46 34 56" stroke="#1c1220" stroke-width="2" fill="none" opacity=".6"/>`,
  // ---------- nature ----------
  mushroom: `<path d="M24 34 L40 34 L42 58 L22 58 Z" fill="#f3e7c9" ${O}/><path d="M4 36 C4 14 60 14 60 36 Z" fill="url(#igRed)" ${O}/><circle cx="20" cy="26" r="4" fill="#fff"/><circle cx="36" cy="22" r="5" fill="#fff"/><circle cx="48" cy="30" r="3" fill="#fff"/>`,
  herb: `<path d="M32 60 L32 18" stroke="#2a5a1a" stroke-width="4"/><path d="M32 46 C18 46 10 36 12 26 C24 26 32 34 32 46 Z M32 34 C46 34 54 24 52 14 C40 14 32 22 32 34 Z M32 22 C24 18 24 8 30 4 C36 8 36 16 32 22 Z" fill="url(#igGreen)" ${O}/>`,
  rose: `<path d="M32 60 L32 30" stroke="#2a6a1a" stroke-width="4"/><path d="M32 48 C22 48 18 40 20 34 C28 36 32 42 32 48 Z" fill="url(#igGreen)" ${O}/><circle cx="32" cy="22" r="16" fill="url(#igRed)" ${O}/><path d="M32 22 C28 18 34 12 38 18 C42 26 30 32 24 26 C18 18 28 8 38 10" stroke="#7a0a1a" stroke-width="2.4" fill="none"/>`,
  wilted: `<path d="M32 60 L32 34 C32 22 40 18 46 22" stroke="#4a3a1a" stroke-width="4" fill="none"/><path d="M46 22 C58 26 58 42 48 46 C40 48 36 40 38 32 C40 26 44 24 46 22 Z" fill="#7a1a2a" ${O}/><path d="M26 40 C18 40 14 32 16 26 C24 28 28 34 26 40 Z" fill="#6a5a2a" ${O}/>`,
  cactus: `<path d="M24 60 L24 10 C24 2 40 2 40 10 L40 60 Z" fill="url(#igGreen)" ${O}/><path d="M24 36 L14 36 C8 36 8 30 8 24 L8 18 C8 14 14 14 14 18 L14 28 L24 28 M40 30 L50 30 C54 30 56 26 56 22 L56 16 C56 12 50 12 50 16 L50 22 L40 22" fill="url(#igGreen)" ${O}/><path d="M30 14 L28 12 M34 24 L36 22 M30 34 L28 32 M34 44 L36 42" stroke="#fff" stroke-width="2"/>`,
  coral: `<path d="M32 60 L32 36 C32 26 20 24 20 12 M32 42 C40 40 44 30 44 20 C44 14 50 12 50 6 M32 48 C24 46 14 40 12 30" stroke="#1c1220" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M32 60 L32 36 C32 26 20 24 20 12 M32 42 C40 40 44 30 44 20 C44 14 50 12 50 6 M32 48 C24 46 14 40 12 30" stroke="#ff7ac8" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  feather: `<path d="M50 4 C30 8 14 26 12 50 L16 52 C24 38 40 24 54 18 C48 18 44 16 50 4 Z" fill="#eaf4ff" ${O}/><path d="M8 60 L46 14" stroke="#1c1220" stroke-width="2.6"/><path d="M22 40 L30 42 M28 32 L36 34 M34 24 L42 26" stroke="#9ab8d8" stroke-width="2"/>`,
  wing: `<path d="M8 50 C8 28 28 8 58 6 C54 14 50 18 44 20 C52 22 50 28 42 30 C48 34 44 40 36 40 C40 46 34 52 26 50 C22 56 14 58 8 50 Z" fill="#f6f1ea" ${O}/><path d="M14 46 C22 36 32 26 50 14" stroke="#d8c8a0" stroke-width="2.4" fill="none"/>`,
  log: `<rect x="6" y="20" width="48" height="26" rx="4" fill="url(#igWood)" ${O}/><ellipse cx="54" cy="33" rx="7" ry="13" fill="#e0b880" ${O}/><ellipse cx="54" cy="33" rx="3" ry="6" fill="none" stroke="#8a5a2a" stroke-width="1.6"/><path d="M12 28 L40 28 M16 38 L44 38" stroke="#5a3410" stroke-width="2"/>`,
  rock: `<path d="M8 50 L14 26 L30 12 L48 16 L58 34 L54 52 Z" fill="url(#igStone)" ${O}/><path d="M18 30 L30 20 L40 22" stroke="#fff" stroke-width="2.4" fill="none" opacity=".6"/>`,
  curlingStone: `<ellipse cx="32" cy="44" rx="26" ry="14" fill="url(#igStone)" ${O}/><ellipse cx="32" cy="38" rx="20" ry="9" fill="#d84a4a" ${O}/><path d="M26 32 L26 20 L44 20" stroke="#1c1220" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  moai: `<path d="M18 60 L16 20 C16 8 48 8 48 20 L46 60 Z" fill="url(#igStone)" ${O}/><path d="M20 22 L30 22 M34 22 L44 22" stroke="#1c1220" stroke-width="4"/><path d="M32 22 L30 40 L36 40" stroke="#1c1220" stroke-width="2.6" fill="none"/><path d="M24 48 L40 48" stroke="#1c1220" stroke-width="3"/>`,
  ice: `<path d="M10 22 L32 10 L54 22 L54 46 L32 58 L10 46 Z" fill="#bfe9ff" ${O}/><path d="M10 22 L32 34 L54 22 M32 34 L32 58" stroke="#1c1220" stroke-width="2" fill="none"/><path d="M18 26 L28 32" stroke="#fff" stroke-width="3"/>`,
  // ---------- food ----------
  bread: `<path d="M6 40 C6 22 58 22 58 40 L58 50 C58 54 54 56 50 56 L14 56 C10 56 6 54 6 50 Z" fill="url(#igWood)" ${O}/><path d="M18 30 L22 38 M30 28 L34 36 M42 30 L46 38" stroke="#5a3410" stroke-width="2.6"/>`,
  stew: `<path d="M8 30 L56 30 C56 48 46 58 32 58 C18 58 8 48 8 30 Z" fill="url(#igDark)" ${O}/><ellipse cx="32" cy="30" rx="24" ry="5" fill="#c8673a" ${O}/><path d="M22 22 C20 16 26 14 24 8 M32 22 C30 16 36 14 34 8 M42 22 C40 16 46 14 44 8" stroke="#dcdcdc" stroke-width="3" fill="none" opacity=".8"/>`,
  bowl: `<path d="M6 32 L58 32 C58 48 46 58 32 58 C18 58 6 48 6 32 Z" fill="url(#igWood)" ${O}/><path d="M40 30 L56 6" stroke="#1c1220" stroke-width="6" stroke-linecap="round"/><path d="M40 30 L56 6" stroke="url(#igSteel)" stroke-width="3" stroke-linecap="round"/>`,
  salt: `<path d="M18 22 L46 22 L50 60 L14 60 Z" fill="url(#igGlass)" ${O}/><path d="M16 40 L48 40 L50 60 L14 60 Z" fill="#f6f1ea" opacity=".9"/><path d="M18 22 C18 8 46 8 46 22 Z" fill="url(#igSteel)" ${O}/><circle cx="28" cy="15" r="1.5" fill="#1c1220"/><circle cx="36" cy="15" r="1.5" fill="#1c1220"/>`,
  // ---------- places and objects ----------
  castle: `<path d="M8 60 L8 24 L14 24 L14 18 L20 18 L20 24 L26 24 L26 30 L38 30 L38 24 L44 24 L44 18 L50 18 L50 24 L56 24 L56 60 Z" fill="url(#igStone)" ${O}/><path d="M26 60 L26 46 C26 38 38 38 38 46 L38 60 Z" fill="#2a1d14" ${O}/><path d="M14 18 L14 6 L22 10 L14 14 M50 18 L50 6 L58 10 L50 14" stroke="#1c1220" stroke-width="2" fill="url(#igRed)"/>`,
  lighthouse: `<path d="M8 22 L-4 6 M56 22 L68 6" stroke="#fff3a8" stroke-width="8" opacity=".55"/><path d="M22 60 L26 22 L38 22 L42 60 Z" fill="#f6f1ea" ${O}/><path d="M24.5 36 L39.5 36 L40.5 46 L23.5 46 Z" fill="url(#igRed)"/><rect x="22" y="12" width="20" height="10" rx="2" fill="#fff3a8" ${O}/><path d="M20 12 L32 4 L44 12 Z" fill="url(#igRed)" ${O}/><path d="M16 60 L48 60" stroke="#1c1220" stroke-width="3"/>`,
  shrine: `<path d="M4 14 C20 18 44 18 60 14 L58 22 L6 22 Z" fill="url(#igRed)" ${O}/><path d="M10 30 L54 30" stroke="#1c1220" stroke-width="7"/><path d="M10 30 L54 30" stroke="#e2333d" stroke-width="4"/><path d="M16 22 L16 60 M48 22 L48 60" stroke="#1c1220" stroke-width="8"/><path d="M16 22 L16 60 M48 22 L48 60" stroke="#e2333d" stroke-width="4.5"/>`,
  stall: `<path d="M6 26 L10 10 L54 10 L58 26 Z" fill="#e2333d" ${O}/><path d="M17 10 L14 26 M28 10 L27 26 M38 10 L39 26 M48 10 L50 26" stroke="#f6f1ea" stroke-width="5"/><path d="M6 26 C10 32 14 32 18 26 C22 32 26 32 30 26 C34 32 38 32 42 26 C46 32 50 32 54 26 C56 30 58 30 58 26" fill="#e2333d" ${O}/><rect x="10" y="40" width="44" height="20" rx="2" fill="url(#igWood)" ${O}/><path d="M12 30 L12 40 M52 30 L52 40" stroke="#1c1220" stroke-width="3"/><circle cx="24" cy="38" r="5" fill="url(#igGold)" ${O}/><circle cx="38" cy="37" r="4" fill="url(#igGreen)" ${O}/>`,
  boat: `<path d="M2 34 C16 52 48 52 62 34 Z" fill="url(#igWood)" ${O}/><path d="M32 34 L32 6 L50 30 Z" fill="#f3e2b8" ${O}/><path d="M8 52 C16 56 24 52 32 56 C40 52 48 56 56 52" stroke="#4fa9ff" stroke-width="3" fill="none"/>`,
  phone: `<rect x="18" y="4" width="28" height="56" rx="5" fill="url(#igDark)" ${O}/><rect x="22" y="10" width="20" height="40" fill="#8fd3ff"/><circle cx="32" cy="55" r="2.5" fill="#fff"/>`,
  trash: `<path d="M14 18 L50 18 L46 60 L18 60 Z" fill="url(#igSteel)" ${O}/><rect x="10" y="12" width="44" height="7" rx="2" fill="url(#igSteel)" ${O}/><path d="M26 8 L38 8 L38 12 L26 12 Z" fill="url(#igSteel)" ${O}/><path d="M24 26 L26 52 M32 26 L32 52 M40 26 L38 52" stroke="#1c1220" stroke-width="2.2"/>`,
  battery: `<rect x="6" y="18" width="46" height="28" rx="4" fill="url(#igDark)" ${O}/><rect x="52" y="26" width="6" height="12" rx="2" fill="url(#igSteel)" ${O}/><rect x="10" y="22" width="30" height="20" rx="2" fill="url(#igGreen)"/>`,
  fuel: `<rect x="12" y="12" width="30" height="48" rx="4" fill="url(#igRed)" ${O}/><rect x="18" y="18" width="18" height="12" fill="#f6f1ea" stroke="#1c1220" stroke-width="1.6"/><path d="M42 24 L52 24 L52 50 C52 54 58 54 58 50 L58 20" stroke="#1c1220" stroke-width="4" fill="none"/>`,
  menu: `<path d="M10 16 L54 16 M10 32 L54 32 M10 48 L54 48" stroke="#1c1220" stroke-width="10" stroke-linecap="round"/><path d="M10 16 L54 16 M10 32 L54 32 M10 48 L54 48" stroke="#ecdfc8" stroke-width="5.5" stroke-linecap="round"/>`,
  speaker: `<path d="M8 24 L20 24 L34 10 L34 54 L20 40 L8 40 Z" fill="url(#igSteel)" ${O}/><path d="M42 22 C48 28 48 36 42 42 M48 14 C58 24 58 40 48 50" stroke="#ecdfc8" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  speakerLow: `<path d="M12 24 L24 24 L38 10 L38 54 L24 40 L12 40 Z" fill="url(#igSteel)" ${O}/><path d="M46 24 C51 29 51 35 46 40" stroke="#ecdfc8" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  speakerOff: `<path d="M8 24 L20 24 L34 10 L34 54 L20 40 L8 40 Z" fill="url(#igSteel)" ${O}/><path d="M42 24 L56 40 M56 24 L42 40" stroke="#e2333d" stroke-width="5" stroke-linecap="round"/>`,
  bell: `<path d="M32 6 C20 6 14 16 14 28 L14 40 L8 48 L56 48 L50 40 L50 28 C50 16 44 6 32 6 Z" fill="url(#igGold)" ${O}/><circle cx="32" cy="54" r="6" fill="url(#igGold)" ${O}/><path d="M22 18 C20 22 20 28 20 34" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`,
  bellOff: `<path d="M32 6 C20 6 14 16 14 28 L14 40 L8 48 L56 48 L50 40 L50 28 C50 16 44 6 32 6 Z" fill="url(#igStone)" ${O}/><circle cx="32" cy="54" r="6" fill="url(#igStone)" ${O}/><path d="M8 8 L56 56" stroke="#e2333d" stroke-width="5" stroke-linecap="round"/>`,
  hourglass: `<path d="M12 4 L52 4 M12 60 L52 60" stroke="#1c1220" stroke-width="7" stroke-linecap="round"/><path d="M12 4 L52 4 M12 60 L52 60" stroke="url(#igWood)" stroke-width="4" stroke-linecap="round"/><path d="M18 8 L46 8 C46 22 36 26 34 32 C36 38 46 42 46 56 L18 56 C18 42 28 38 30 32 C28 26 18 22 18 8 Z" fill="url(#igGlass)" ${O}/><path d="M22 54 C24 46 40 46 42 54 Z M26 16 L38 16 L32 26 Z" fill="url(#igGold)"/>`,
  stopwatch: `<circle cx="32" cy="36" r="24" fill="url(#igSteel)" ${O}/><circle cx="32" cy="36" r="18" fill="#f6f1ea" stroke="#1c1220" stroke-width="2"/><path d="M32 36 L32 22 M32 36 L42 40" stroke="#1c1220" stroke-width="3" stroke-linecap="round"/><rect x="26" y="4" width="12" height="7" rx="2" fill="url(#igSteel)" ${O}/>`,
  target: `<circle cx="30" cy="34" r="26" fill="#e2333d" ${O}/><circle cx="30" cy="34" r="18" fill="#f6f1ea"/><circle cx="30" cy="34" r="10" fill="#e2333d"/><circle cx="30" cy="34" r="4" fill="#f6f1ea"/><path d="M30 34 L58 6" stroke="#1c1220" stroke-width="4"/><path d="M52 4 L60 4 L60 12" stroke="#1c1220" stroke-width="3" fill="none"/>`,
  dice: `<path d="M32 6 L56 18 L56 46 L32 58 L8 46 L8 18 Z" fill="#f6f1ea" ${O}/><path d="M8 18 L32 30 L56 18 M32 30 L32 58" stroke="#1c1220" stroke-width="2.2" fill="none"/><circle cx="32" cy="18" r="3" fill="#e2333d"/><circle cx="18" cy="34" r="3" fill="#1c1220"/><circle cx="22" cy="44" r="3" fill="#1c1220"/><circle cx="44" cy="36" r="3" fill="#1c1220"/><circle cx="48" cy="44" r="3" fill="#1c1220"/>`,
  mask: `<path d="M6 14 C16 8 28 8 34 14 C36 30 30 44 20 46 C10 44 4 30 6 14 Z" fill="#f6f1ea" ${O}/><path d="M12 22 Q16 18 20 22 M24 22 Q28 18 32 22 M12 32 Q20 40 30 32" stroke="#1c1220" stroke-width="2.6" fill="none"/><path d="M30 20 C40 14 52 14 60 20 C62 36 56 50 46 52 C36 50 28 36 30 20 Z" fill="url(#igPurple)" ${O}/><path d="M38 28 Q42 32 46 28 M50 28 Q54 32 58 28 M38 44 Q46 36 56 44" stroke="#1c1220" stroke-width="2.6" fill="none"/>`,
  note: `<path d="M24 50 L24 12 L52 6 L52 42" stroke="#1c1220" stroke-width="5" fill="none"/><path d="M24 12 L52 6 L52 16 L24 22 Z" fill="#1c1220"/><ellipse cx="18" cy="50" rx="9" ry="7" fill="url(#igGold)" ${O}/><ellipse cx="46" cy="44" rx="9" ry="7" fill="url(#igGold)" ${O}/>`,
  windChime: `<path d="M32 4 L32 12" stroke="#1c1220" stroke-width="3"/><path d="M14 30 C14 14 50 14 50 30 Z" fill="url(#igGlass)" ${O}/><path d="M32 30 L32 40" stroke="#1c1220" stroke-width="2"/><rect x="24" y="40" width="16" height="22" rx="2" fill="#f3e2b8" ${O}/>`,
  sigil: `${star(32, 32, 28, 16, 6, 'url(#igPurple)')}<circle cx="32" cy="32" r="6" fill="#fff4c8" ${O}/>`,
  chevronShield: `<path d="M32 5 L55 13 C55 35 46 50 32 59 C18 50 9 35 9 13 Z" fill="url(#igGreen)" ${O}/><path d="M32 16 L44 26 L44 40 L32 30 L20 40 L20 26 Z" fill="url(#igGold)" ${O}/>`,
  recycle: `<path d="M32 8 C46 8 56 18 56 32 L48 32 L58 44 L64 32 L60 32 C60 14 46 2 32 2 Z" fill="url(#igGreen)" ${O}/><path d="M32 56 C18 56 8 46 8 32 L16 32 L6 20 L0 32 L4 32 C4 50 18 62 32 62 Z" fill="url(#igGreen)" ${O}/>`,
  rune: `<circle cx="32" cy="32" r="26" fill="url(#igDark)" ${O}/><path d="M24 16 L24 48 M24 24 L40 16 M24 34 L40 26" stroke="#ffd76a" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  bomb: `<circle cx="28" cy="38" r="21" fill="url(#igDark)" ${O}/><rect x="34" y="12" width="12" height="10" rx="2" fill="url(#igStone)" ${O} transform="rotate(35 40 17)"/><path d="M44 12 C48 6 54 8 56 4" stroke="#8a6a3a" stroke-width="3" fill="none"/>${star(57, 4, 7, 2.5, 5, '#ffd23a', 'stroke-width="1.2"')}<ellipse cx="20" cy="30" rx="6" ry="4" ${HI}/>`,
  firecracker: `<rect x="16" y="18" width="20" height="42" rx="3" fill="url(#igRed)" ${O} transform="rotate(-20 26 39)"/><path d="M18 30 L36 24 M22 46 L40 40" stroke="#ffd36a" stroke-width="3" opacity=".9"/><path d="M30 18 C34 10 40 12 44 6" stroke="#8a6a3a" stroke-width="3" fill="none"/>${star(47, 5, 8, 3, 5, '#ffd23a', 'stroke-width="1.2"')}`,
  scales: `<path d="M32 8 L32 56 M18 58 L46 58 M10 16 L54 16" stroke="#1c1220" stroke-width="6" stroke-linecap="round"/><path d="M32 8 L32 56 M18 58 L46 58 M10 16 L54 16" stroke="url(#igGold)" stroke-width="3" stroke-linecap="round"/><path d="M10 16 L2 36 L18 36 Z M54 16 L46 36 L62 36 Z" stroke="#1c1220" stroke-width="1.6" fill="none"/><path d="M2 36 C2 44 18 44 18 36 Z M46 36 C46 44 62 44 62 36 Z" fill="url(#igGold)" ${O}/><circle cx="32" cy="8" r="4" fill="url(#igGold)" ${O}/>`,
  // ---------- faces ----------
  devil: `<path d="M12 24 L6 6 L22 16 Z M52 24 L58 6 L42 16 Z" fill="url(#igRed)" ${O}/><circle cx="32" cy="36" r="24" fill="url(#igPurple)" ${O}/><path d="M18 30 L28 34 M46 30 L36 34" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="38" r="3" fill="#ffe680"/><circle cx="40" cy="38" r="3" fill="#ffe680"/><path d="M20 46 Q32 54 44 46" stroke="#1c1220" stroke-width="3" fill="none"/>`,
  angry: `<circle cx="32" cy="34" r="25" fill="url(#igRed)" ${O}/><path d="M16 26 L28 32 M48 26 L36 32" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="36" r="3" fill="#1c1220"/><circle cx="40" cy="36" r="3" fill="#1c1220"/><path d="M22 50 Q32 42 42 50" stroke="#1c1220" stroke-width="3.5" fill="none"/>`,
  scream: `<ellipse cx="32" cy="34" rx="22" ry="26" fill="#d8e4ff" ${O}/><ellipse cx="23" cy="28" rx="5" ry="7" fill="#1c1220"/><ellipse cx="41" cy="28" rx="5" ry="7" fill="#1c1220"/><ellipse cx="32" cy="48" rx="7" ry="9" fill="#1c1220"/><path d="M8 34 C2 34 4 50 14 52 M56 34 C62 34 60 50 50 52" stroke="#1c1220" stroke-width="3" fill="none"/>`,
  sleep: `<path d="M40 6 A26 26 0 1 0 58 44 A20 20 0 1 1 40 6 Z" fill="url(#igMoon)" ${O}/><path d="M44 12 L56 12 L44 24 L56 24" stroke="#1c1220" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`,
  silhouette: `<circle cx="32" cy="22" r="13" fill="url(#igDark)" ${O}/><path d="M8 60 C8 42 18 36 32 36 C46 36 56 42 56 60 Z" fill="url(#igDark)" ${O}/><circle cx="27" cy="21" r="2" fill="#9fc3ff"/><circle cx="37" cy="21" r="2" fill="#9fc3ff"/>`,
  ghost: `<path d="M12 60 L12 28 C12 12 52 12 52 28 L52 60 L44 54 L38 60 L32 54 L26 60 L20 54 Z" fill="#eef0ff" ${O}/><ellipse cx="25" cy="30" rx="4" ry="6" fill="#1c1220"/><ellipse cx="39" cy="30" rx="4" ry="6" fill="#1c1220"/><ellipse cx="32" cy="44" rx="4" ry="5" fill="#1c1220"/>`,
  dancer: `<circle cx="34" cy="10" r="6" fill="#e8b88e" ${O}/><path d="M34 16 L30 30 M30 22 L46 14 M30 22 L16 30" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/><path d="M30 28 L46 58 L12 58 Z" fill="url(#igRed)" ${O}/>`,
  footprints: `<ellipse cx="20" cy="38" rx="8" ry="13" fill="url(#igDark)" ${O}/><circle cx="16" cy="20" r="3" fill="url(#igDark)"/><circle cx="23" cy="19" r="3" fill="url(#igDark)"/><ellipse cx="44" cy="26" rx="8" ry="13" fill="url(#igDark)" ${O}/><circle cx="40" cy="8" r="3" fill="url(#igDark)"/><circle cx="47" cy="7" r="3" fill="url(#igDark)"/>`,
  shoes: `<path d="M6 46 C6 36 20 34 30 40 L32 50 L8 52 Z M34 46 C34 36 48 34 58 40 L60 50 L36 52 Z" fill="url(#igPink)" ${O}/><path d="M18 36 C14 24 24 16 30 22 M46 36 C42 24 52 16 58 22" stroke="#d84a9a" stroke-width="2.4" fill="none"/>`,
  // ---------- people and creatures ----------
  mage: `<path d="M32 2 L46 30 L18 30 Z" fill="url(#igPurple)" ${O}/><path d="M12 30 L52 30" stroke="#1c1220" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="38" r="9" fill="#e8b88e" ${O}/><path d="M22 42 C22 54 42 54 42 42 L38 60 L26 60 Z" fill="#eef0ff" ${O}/><path d="M14 60 L22 44 L42 44 L50 60 Z" fill="url(#igPurple)" ${O}/>${star(26, 16, 4, 1.5, 4, '#ffd76a', 'stroke-width="1"')}`,
  fencer: `<circle cx="20" cy="14" r="7" fill="url(#igSteel)" ${O}/><path d="M20 22 L22 40 L14 58 M22 40 L32 58 M18 28 L36 24 L58 8" stroke="#1c1220" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M18 28 L36 24 L58 8" stroke="url(#igSteel)" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M16 24 L26 22 L28 40 L18 42 Z" fill="#f6f1ea" ${O}/>`,
  owl: `<ellipse cx="32" cy="36" rx="22" ry="24" fill="url(#igWood)" ${O}/><path d="M12 18 L18 26 M52 18 L46 26" stroke="#1c1220" stroke-width="4"/><circle cx="23" cy="30" r="9" fill="#f6f1ea" ${O}/><circle cx="41" cy="30" r="9" fill="#f6f1ea" ${O}/><circle cx="23" cy="30" r="4" fill="#1c1220"/><circle cx="41" cy="30" r="4" fill="#1c1220"/><path d="M29 38 L32 44 L35 38 Z" fill="url(#igGold)" ${O}/><path d="M20 48 Q26 52 32 48 Q38 52 44 48" stroke="#5a3410" stroke-width="2" fill="none"/>`,
  butterfly: `<path d="M32 30 C20 8 4 10 6 24 C8 36 22 36 32 32 C22 36 10 48 18 56 C24 60 30 50 32 40 C34 50 40 60 46 56 C54 48 42 36 32 32 C42 36 56 36 58 24 C60 10 44 8 32 30 Z" fill="url(#igPurple)" ${O}/><path d="M32 22 L32 50" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="22" r="3.5" fill="#fff4c8"/><circle cx="48" cy="22" r="3.5" fill="#fff4c8"/>`,
  tooth: `<path d="M14 8 C22 4 26 10 32 8 C38 10 42 4 50 8 C58 14 54 30 50 40 L44 58 C42 60 40 58 39 54 L36 42 C34 38 30 38 28 42 L25 54 C24 58 22 60 20 58 L14 40 C10 30 6 14 14 8 Z" fill="url(#igBone)" ${O}/>`,
  shell: `<path d="M6 46 C6 22 22 6 40 8 C56 10 60 26 54 38 C48 50 32 50 28 40 C24 30 34 22 40 28" fill="url(#igPink)" ${O}/><path d="M40 28 C34 22 24 30 28 40 C32 50 48 50 54 38" stroke="#1c1220" stroke-width="2.4" fill="none"/><path d="M6 46 L58 50 L56 58 L4 54 Z" fill="url(#igPink)" ${O}/>`,
  eagle: `<path d="M32 22 C20 8 6 10 2 20 C14 18 20 24 26 32 C16 32 8 38 6 46 C16 40 24 40 28 44 L32 58 L36 44 C40 40 48 40 58 46 C56 38 48 32 38 32 C44 24 50 18 62 20 C58 10 44 8 32 22 Z" fill="url(#igWood)" ${O}/><circle cx="32" cy="22" r="7" fill="#f6f1ea" ${O}/><path d="M32 22 L40 26 L34 28 Z" fill="url(#igGold)" ${O}/><circle cx="30" cy="20" r="1.6" fill="#1c1220"/>`,
  worm: `<path d="M8 50 C8 30 26 30 30 42 C34 54 52 54 54 34 C56 20 44 12 36 18" stroke="#1c1220" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M8 50 C8 30 26 30 30 42 C34 54 52 54 54 34 C56 20 44 12 36 18" stroke="#e88aa0" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="38" cy="16" r="2" fill="#1c1220"/>`,
  snake: `<path d="M10 54 C26 58 40 52 34 42 C28 32 14 36 16 26 C18 16 34 14 44 18" stroke="#1c1220" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M10 54 C26 58 40 52 34 42 C28 32 14 36 16 26 C18 16 34 14 44 18" stroke="#6ccf48" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="48" cy="18" rx="10" ry="7" fill="#6ccf48" ${O}/><circle cx="50" cy="15" r="1.8" fill="#1c1220"/><path d="M58 19 L63 17 M58 19 L63 22" stroke="#e2333d" stroke-width="1.6"/>`,
  octopus: `<ellipse cx="32" cy="24" rx="20" ry="18" fill="url(#igPink)" ${O}/><path d="M16 36 C10 46 8 54 14 58 M26 40 C24 50 22 56 26 60 M38 40 C40 50 42 56 38 60 M48 36 C54 46 56 54 50 58" stroke="#1c1220" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M16 36 C10 46 8 54 14 58 M26 40 C24 50 22 56 26 60 M38 40 C40 50 42 56 38 60 M48 36 C54 46 56 54 50 58" stroke="#e88ac0" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="25" cy="26" r="4" fill="#fff"/><circle cx="39" cy="26" r="4" fill="#fff"/><circle cx="25" cy="27" r="2" fill="#1c1220"/><circle cx="39" cy="27" r="2" fill="#1c1220"/>`,
  crab: `<ellipse cx="32" cy="40" rx="20" ry="13" fill="url(#igRed)" ${O}/><path d="M12 38 L4 30 M52 38 L60 30 M16 48 L8 56 M48 48 L56 56" stroke="#1c1220" stroke-width="3.5"/><path d="M14 30 C4 26 4 12 12 10 C14 16 18 18 22 18 Z M50 30 C60 26 60 12 52 10 C50 16 46 18 42 18 Z" fill="url(#igRed)" ${O}/><circle cx="26" cy="28" r="3" fill="#1c1220"/><circle cx="38" cy="28" r="3" fill="#1c1220"/>`,
  dragon: `<path d="M8 50 C8 30 22 22 34 24 L44 10 L46 22 C56 24 60 34 54 42 C48 50 38 46 34 52 C30 58 16 58 8 50 Z" fill="url(#igGreen)" ${O}/><path d="M24 26 L18 10 L30 22 Z" fill="url(#igPurple)" ${O}/><circle cx="46" cy="30" r="2.6" fill="#ffe680"/><path d="M14 46 L18 40 M22 50 L26 44 M30 52 L32 46" stroke="#1c1220" stroke-width="2"/>`,
  wolf: `<path d="M12 8 L22 22 L42 22 L52 8 L54 30 C54 46 44 58 32 58 C20 58 10 46 10 30 Z" fill="url(#igStone)" ${O}/><path d="M22 34 L28 36 M42 34 L36 36" stroke="#1c1220" stroke-width="3.5" stroke-linecap="round"/><path d="M26 46 L32 52 L38 46 Z" fill="#1c1220"/><circle cx="25" cy="38" r="2" fill="#ffd23a"/><circle cx="39" cy="38" r="2" fill="#ffd23a"/>`,
  hedgehog: `<path d="M8 50 C8 26 28 14 46 22 L50 14 L52 24 L58 20 L56 30 L62 30 L56 38 C58 46 52 52 46 52 Z" fill="url(#igWood)" ${O}/><path d="M14 40 L8 34 M20 32 L16 24 M28 26 L26 16 M36 24 L38 14" stroke="#1c1220" stroke-width="2.6"/><ellipse cx="14" cy="50" rx="8" ry="5" fill="#e8c8a0" ${O}/><circle cx="10" cy="48" r="1.6" fill="#1c1220"/>`,
  cricket: `<ellipse cx="34" cy="36" rx="20" ry="11" fill="url(#igGreen)" ${O} transform="rotate(-15 34 36)"/><circle cx="14" cy="38" r="8" fill="url(#igGreen)" ${O}/><path d="M10 32 C4 16 14 6 22 8 M14 30 C14 14 28 6 34 10 M36 44 L44 58 L52 58 M24 44 L18 58 M44 30 L60 18 L62 40" stroke="#1c1220" stroke-width="2.6" fill="none"/><circle cx="12" cy="37" r="1.8" fill="#1c1220"/>`,
  beetle: `<ellipse cx="32" cy="38" rx="20" ry="22" fill="url(#igGreen)" ${O}/><path d="M32 16 L32 60" stroke="#1c1220" stroke-width="2.4"/><circle cx="32" cy="14" r="8" fill="url(#igDark)" ${O}/><path d="M26 8 L20 2 M38 8 L44 2 M12 30 L4 26 M12 44 L4 48 M52 30 L60 26 M52 44 L60 48" stroke="#1c1220" stroke-width="3"/><path d="M22 28 C20 34 20 42 22 48" stroke="#fff" stroke-width="2.4" fill="none" opacity=".5"/>`,
  microbe: `<path d="${gear(32, 32, 27, 20, 12)}" fill="url(#igGreen)" ${O}/><circle cx="26" cy="28" r="4" fill="#2a721c"/><circle cx="38" cy="36" r="5" fill="#2a721c"/><circle cx="30" cy="40" r="2.5" fill="#2a721c"/>`,
  ogre: `<path d="M14 22 L8 6 L22 16 M50 22 L56 6 L42 16" fill="#f6f1ea" ${O}/><circle cx="32" cy="36" r="24" fill="url(#igRed)" ${O}/><path d="M18 30 L28 34 M46 30 L36 34" stroke="#1c1220" stroke-width="4"/><circle cx="24" cy="38" r="3" fill="#ffe680"/><circle cx="40" cy="38" r="3" fill="#ffe680"/><path d="M20 48 L44 48 M24 48 L26 54 M40 48 L38 54" stroke="#1c1220" stroke-width="3"/>`,
  troll: `<circle cx="32" cy="34" r="24" fill="url(#igGreen)" ${O}/><ellipse cx="32" cy="38" rx="6" ry="8" fill="#5aa83a" ${O}/><circle cx="22" cy="28" r="3" fill="#1c1220"/><circle cx="42" cy="28" r="3" fill="#1c1220"/><path d="M20 50 Q32 44 44 50 M24 50 L26 44 M40 50 L38 44" stroke="#1c1220" stroke-width="3" fill="none"/>`,
  zombie: `<circle cx="32" cy="32" r="24" fill="#8ab89a" ${O}/><circle cx="23" cy="28" r="5" fill="#f6f1ea" ${O}/><circle cx="41" cy="30" r="3.5" fill="#f6f1ea" ${O}/><path d="M22 46 L42 44" stroke="#1c1220" stroke-width="3"/><path d="M26 44 L26 48 M32 44 L32 48 M38 44 L38 47" stroke="#1c1220" stroke-width="2"/><path d="M44 14 L50 22 L46 22" stroke="#4a6a4a" stroke-width="2" fill="none"/>`,
  pencil: `<path d="M44 6 L58 20 L22 56 L6 58 L8 42 Z" fill="url(#igGold)" ${O}/><path d="M38 12 L52 26" stroke="#1c1220" stroke-width="2.6"/><path d="M44 6 L58 20 L52 26 L38 12 Z" fill="#e2333d" ${O}/><path d="M8 42 L22 56 L6 58 Z" fill="#f3e2b8" ${O}/><path d="M6 58 L9 50 L14 55 Z" fill="#1c1220"/>`,
  eraser: `<path d="M36 8 L58 30 L32 56 L16 56 L6 46 Z" fill="#ff9fc4" ${O}/><path d="M22 22 L44 44 L32 56 L16 56 L6 46 Z" fill="#f6f1ea" ${O}/><path d="M30 14 L50 34" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/><path d="M34 58 L58 58" stroke="#ecdfc8" stroke-width="3" stroke-linecap="round"/>`,
  undo: `<path d="M14 28 L38 28 C50 28 56 36 56 44 C56 52 50 58 40 58 L30 58" fill="none" stroke="#1c1220" stroke-width="11" stroke-linecap="round"/><path d="M14 28 L38 28 C50 28 56 36 56 44 C56 52 50 58 40 58 L30 58" fill="none" stroke="url(#igGold)" stroke-width="6" stroke-linecap="round"/><path d="M22 14 L6 28 L22 42 Z" fill="url(#igGold)" ${O}/>`,
};
})();

// ---------- icon references ----------
// Text anywhere in the game can contain :iconName: (for example ':flame:'); it is shown as that icon.
const ICON_TOKEN_RE = /:([a-zA-Z][a-zA-Z0-9]*):/g;
function iconName(ref) { const m = /^:([a-zA-Z][a-zA-Z0-9]*):$/.exec(String(ref).trim()); return m && ICONS[m[1]] ? m[1] : null; }
function iconMarkup(name) { return ICONS[name] || ICONS.rune; }
function icon(name, cls = '') { return `<svg class="ico ${cls}" viewBox="0 0 64 64" aria-hidden="true"><use href="#ic-${ICONS[name] ? name : 'rune'}"/></svg>`; }

// ---------- turn icon references (and any stray emoji) in the page into drawn icons ----------
const EMOJI_RE = /(?:\p{Extended_Pictographic}|[\u2630\u2713\u271A\u266A\u266B\u2669])(?:\uFE0F|\u200D(?:\p{Extended_Pictographic}|[\u2640\u2642])\uFE0F?)*/gu;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'TITLE']);
function hasIconText(t) {
  ICON_TOKEN_RE.lastIndex = 0; EMOJI_RE.lastIndex = 0;
  if (EMOJI_RE.test(t)) return true;
  for (const m of t.matchAll(ICON_TOKEN_RE)) if (ICONS[m[1]]) return true;
  return false;
}
function swapEmojiIn(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentNode;
      if (!p || SKIP_TAGS.has(p.nodeName) || p.namespaceURI === 'http://www.w3.org/2000/svg') return NodeFilter.FILTER_REJECT;
      return hasIconText(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const tmp = document.createElement('span');
    tmp.innerHTML = esc(n.nodeValue)
      .replace(ICON_TOKEN_RE, (all, name) => (ICONS[name] ? icon(name) : all))
      .replace(EMOJI_RE, () => icon('rune'));
    const frag = document.createDocumentFragment();
    while (tmp.firstChild) frag.appendChild(tmp.firstChild);
    n.parentNode.replaceChild(frag, n);
  }
}
(function startIcons() {
  const go = () => {
    const holder = document.createElement('div');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = `<svg width="0" height="0"><defs>${ICON_DEFS}${Object.entries(ICONS).map(([n, m]) => `<symbol id="ic-${n}" viewBox="0 0 64 64">${m}</symbol>`).join('')}</defs></svg>`;
    document.body.prepend(holder);
    swapEmojiIn(document.body);
    new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'characterData') { if (m.target.parentNode) swapEmojiIn(m.target.parentNode); continue; }
        for (const n of m.addedNodes) {
          if (n.nodeType === 3) { if (n.parentNode) swapEmojiIn(n.parentNode); }
          else if (n.nodeType === 1 && n.namespaceURI !== 'http://www.w3.org/2000/svg') swapEmojiIn(n);
        }
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  };
  if (document.body) go(); else window.addEventListener('DOMContentLoaded', go);
})();

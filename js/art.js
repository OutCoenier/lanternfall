// ===== Card art =====
// Every card gets a small painted scene, drawn in code as SVG (no image files needed).
//
// Each entry in ART below says how to paint a card:
//   pal:   colour palette (see PALETTES)
//   scene: backdrop ('cave', 'night', 'sky', 'sea', 'forge', 'ruins', 'forest', 'void', 'plain')
//   s:     the main picture. Either one emoji, or a list of { e, x, y, size, rot }
//   fx:    effects layered on top (see FX below)
//
// Want to use your own picture instead? Put it in img/cards/ and add
//   img: 'img/cards/yourPicture.png'
// to that card in js/data/cards.js. Any image size works; it is cropped to fit.
'use strict';

const PALETTES = {
  //        sky top,   sky bottom, light colour
  ember:  ['#4a1208', '#120403', '#ff7a2a'],
  flame:  ['#5e2108', '#170602', '#ffb347'],
  gold:   ['#47330f', '#120b03', '#ffd76a'],
  night:  ['#12213f', '#04070f', '#8fc0ff'],
  arcane: ['#2f1450', '#0b0414', '#c690ff'],
  sea:    ['#0c3546', '#03121a', '#6adcff'],
  forest: ['#163a1e', '#050f07', '#a6ff8f'],
  ash:    ['#34302d', '#0d0c0b', '#d8c6b4'],
  blood:  ['#470914', '#120205', '#ff4d5e'],
  void:   ['#170c28', '#020104', '#9a6cff'],
  dawn:   ['#7a3a1c', '#1d0c18', '#ffcf7a'],
  sun:    ['#7a4a0a', '#1f0d02', '#fff1a8'],
  steel:  ['#22303b', '#0a0e12', '#c4e6ff'],
  swamp:  ['#2a3016', '#0b0d05', '#c9d36a'],
  moon:   ['#1d2850', '#05070f', '#dbe7ff'],
  dusk:   ['#3a1c4a', '#0a0612', '#ff9ec4'],
  toxic:  ['#1f3a14', '#060f04', '#a8ff5a'],
};

const ART = {
  // ---- Starter ----
  strike:        { pal: 'ember', scene: 'cave', s: [{ e: '🗡️', rot: -30 }], fx: ['slash', 'embers'] },
  defend:        { pal: 'night', scene: 'ruins', s: [{ e: '🛡️' }, { e: '🏮', x: 138, y: 40, size: 22 }], fx: ['ring', 'motes'] },
  flare:         { pal: 'ember', scene: 'night', s: '🎇', fx: ['burst', 'sparks'] },
  // ---- Common ----
  searingSlash:  { pal: 'ember', scene: 'cave', s: '⚔️', fx: ['flames', 'slash'] },
  cinderToss:    { pal: 'flame', scene: 'night', s: [{ e: '☄️', rot: -10 }], fx: ['fall', 'embers'] },
  twinSparks:    { pal: 'gold', scene: 'cave', s: [{ e: '✨', x: 72, y: 52, size: 36 }, { e: '✨', x: 128, y: 66, size: 36 }], fx: ['bolt', 'sparks'] },
  lampBash:      { pal: 'gold', scene: 'ruins', s: [{ e: '🏮', rot: -20 }], fx: ['burst', 'sparks'] },
  sweepingFlame: { pal: 'ember', scene: 'plain', s: [{ e: '🔥', x: 58, y: 66, size: 32 }, { e: '🔥', x: 100, y: 58, size: 44 }, { e: '🔥', x: 142, y: 66, size: 32 }], fx: ['speed', 'flames'] },
  gleam:         { pal: 'gold', scene: 'night', s: '💡', fx: ['rays', 'motes'] },
  wickerShield:  { pal: 'forest', scene: 'forest', s: '🧺', fx: ['ring', 'motes'] },
  smokeScreen:   { pal: 'ash', scene: 'ruins', s: '💨', fx: ['smoke', 'motes'] },
  brightIdea:    { pal: 'gold', scene: 'ruins', s: [{ e: '📜', y: 66 }, { e: '💡', x: 128, y: 34, size: 24 }], fx: ['rays', 'sparks'] },
  emberJab:      { pal: 'ember', scene: 'cave', s: [{ e: '🗡️', rot: 45, size: 40 }], fx: ['slash1', 'embers'] },
  oilSplash:     { pal: 'gold', scene: 'forge', s: [{ e: '🛢️', rot: -25 }], fx: ['oil', 'drops'], drop: '#1a1208' },
  shiningBeam:   { pal: 'gold', scene: 'cave', s: [{ e: '🔦', x: 52, y: 60, rot: 0 }], fx: ['beam', 'sparks'] },
  anvilBlow:     { pal: 'steel', scene: 'forge', s: [{ e: '🔨', rot: -35, y: 54 }], fx: ['burst', 'sparks'] },
  quickStep:     { pal: 'night', scene: 'ruins', s: '👣', fx: ['speed', 'motes'] },
  counterflame:  { pal: 'ember', scene: 'ruins', s: '🤺', fx: ['ring', 'flames'] },
  sparkShower:   { pal: 'flame', scene: 'night', s: '🎆', fx: ['fall', 'sparks'] },
  rekindle:      { pal: 'flame', scene: 'cave', s: '🕯️', fx: ['swirl', 'embers'] },
  ashenVeil:     { pal: 'ash', scene: 'cave', s: '🌋', fx: ['smoke', 'embers'] },
  lanternSwing:  { pal: 'gold', scene: 'cave', s: [{ e: '🪔', rot: 20 }], fx: ['slash', 'embers'] },
  // ---- Uncommon ----
  infernoLash:   { pal: 'flame', scene: 'plain', s: '🌪️', fx: ['flames', 'swirl', 'embers'] },
  lightBarrage:  { pal: 'sun', scene: 'sky', s: [{ e: '🌟', x: 70, y: 46, size: 28 }, { e: '🌟', x: 104, y: 64, size: 40 }, { e: '🌟', x: 140, y: 42, size: 24 }], fx: ['fall', 'rays'] },
  glowBarrier:   { pal: 'arcane', scene: 'ruins', s: '🔮', fx: ['ring', 'runes'] },
  everStoked:    { pal: 'flame', scene: 'forge', s: '🏮', fx: ['flames', 'embers', 'motes'] },
  pyromancy:     { pal: 'arcane', scene: 'ruins', s: '🧙', fx: ['runes', 'embers'] },
  bastion:       { pal: 'steel', scene: 'sky', s: '🏰', fx: ['rays', 'ring'] },
  fannedFlames:  { pal: 'flame', scene: 'plain', s: [{ e: '🌬️', x: 62, y: 52 }, { e: '🔥', x: 140, y: 64, size: 40 }], fx: ['speed', 'embers'] },
  emberStorm:    { pal: 'ember', scene: 'night', s: '🌀', fx: ['swirl', 'embers', 'fall'] },
  blindingFlash: { pal: 'sun', scene: 'plain', s: '💫', fx: ['rays', 'burst'] },
  bankFire:      { pal: 'ember', scene: 'forge', s: [{ e: '🪵', y: 70 }, { e: '🔥', y: 46, size: 30 }], fx: ['smoke', 'embers'] },
  kindledBurst:  { pal: 'flame', scene: 'cave', s: '💥', fx: ['burst', 'sparks', 'embers'] },
  thornedCage:   { pal: 'forest', scene: 'forest', s: '🌵', fx: ['bars', 'motes'] },
  flickerWard:   { pal: 'arcane', scene: 'night', s: '💫', fx: ['ring', 'sparks'] },
  overcharge:    { pal: 'arcane', scene: 'forge', s: '⚡', fx: ['bolt', 'sparks'] },
  twinFlame:     { pal: 'flame', scene: 'night', s: [{ e: '🔥', x: 78, y: 60, size: 40 }, { e: '🔥', x: 124, y: 56, size: 46 }], fx: ['motes', 'embers'] },
  lighthouse:    { pal: 'sea', scene: 'sea', s: [{ e: '🗼', x: 72, y: 56 }], fx: ['beam', 'waves'] },
  bellows:       { pal: 'ember', scene: 'forge', s: '🪗', fx: ['speed', 'embers'] },
  wardstone:     { pal: 'steel', scene: 'ruins', s: '🗿', fx: ['runes', 'ring'] },
  smolderingHaze:{ pal: 'ash', scene: 'cave', s: [{ e: '☁️' }, { e: '🔥', x: 126, y: 76, size: 22 }], fx: ['smoke', 'embers'] },
  flashpoint:    { pal: 'sun', scene: 'cave', s: '⚡', fx: ['bolt', 'burst'] },
  steadyHands:   { pal: 'gold', scene: 'forge', s: '✋', fx: ['rays', 'motes'] },
  bloodOil:      { pal: 'blood', scene: 'cave', s: '🩸', fx: ['drops', 'flames'], drop: '#9c0f1f' },
  searingGaze:   { pal: 'ember', scene: 'void', s: '👁️', fx: ['rays', 'runes'] },
  temperedEdge:  { pal: 'steel', scene: 'forge', s: [{ e: '🗡️', rot: -45 }], fx: ['flames', 'sparks'] },
  // ---- Rare ----
  supernova:     { pal: 'sun', scene: 'void', s: '🌞', fx: ['burst', 'rays', 'sparks'] },
  eternalFlame:  { pal: 'flame', scene: 'ruins', s: '🔥', fx: ['runes', 'flames', 'motes'] },
  lanternShell:  { pal: 'steel', scene: 'night', s: [{ e: '🏮', size: 40 }, { e: '🔒', x: 132, y: 72, size: 22 }], fx: ['ring', 'shards'] },
  corona:        { pal: 'sun', scene: 'sky', s: '☀️', fx: ['rays', 'ring'] },
  eclipse:       { pal: 'void', scene: 'void', s: [], fx: ['eclipse', 'sparks'] },
  echoingToll:   { pal: 'gold', scene: 'ruins', s: '🔔', fx: ['ripples', 'motes'] },
  sunfall:       { pal: 'dawn', scene: 'sky', s: [{ e: '☀️', x: 128, y: 44, size: 46 }], fx: ['fall', 'flames'] },
  conflagration: { pal: 'ember', scene: 'plain', s: [{ e: '🔥', size: 56 }], fx: ['burst', 'flames', 'embers'] },
  ignition:      { pal: 'flame', scene: 'forge', s: '🧨', fx: ['sparks', 'burst'] },
  wellspring:    { pal: 'sea', scene: 'forest', s: '⛲', fx: ['bubbles', 'motes'] },
  endlessOil:    { pal: 'gold', scene: 'forge', s: '🏺', fx: ['drops', 'motes'], drop: '#e8a92a' },
  phoenixRite:   { pal: 'flame', scene: 'sky', s: '🦅', fx: ['rays', 'flames', 'embers'] },
  // ==== The Moonblade ====
  moonCut:       { pal: 'moon', scene: 'night', s: [{ e: '🌙', rot: 20, size: 46 }], fx: ['slash', 'sparks'] },
  sidestep:      { pal: 'moon', scene: 'ruins', s: '💨', fx: ['speed', 'motes'] },
  crescentCut:   { pal: 'blood', scene: 'night', s: [{ e: '🗡️', rot: -40 }], fx: ['slash1', 'drops'], drop: '#b3122a' },
  moonShard:     { pal: 'moon', scene: 'void', s: [{ e: '🌙', size: 40, rot: -20 }], fx: ['shards', 'sparks'] },
  twinMoons:     { pal: 'moon', scene: 'night', s: [{ e: '🌙', x: 74, y: 56, size: 38, rot: -15 }, { e: '🌙', x: 128, y: 60, size: 38, rot: 165 }], fx: ['slash', 'motes'] },
  shardToss:     { pal: 'moon', scene: 'night', s: [{ e: '✨', size: 40 }], fx: ['shards', 'speed'] },
  lacerate:      { pal: 'blood', scene: 'cave', s: '🩸', fx: ['slash', 'drops'], drop: '#b3122a' },
  feint:         { pal: 'dusk', scene: 'ruins', s: '🎭', fx: ['swirl', 'motes'] },
  riposte:       { pal: 'steel', scene: 'ruins', s: '🤺', fx: ['ring', 'slash1'] },
  moonStep:      { pal: 'moon', scene: 'night', s: '👣', fx: ['ring', 'shards'] },
  flurry:        { pal: 'moon', scene: 'plain', s: '🌪️', fx: ['slash', 'speed', 'sparks'] },
  daggerRain:    { pal: 'night', scene: 'night', s: [{ e: '🗡️', x: 70, y: 40, size: 26, rot: 135 }, { e: '🗡️', x: 104, y: 60, size: 32, rot: 135 }, { e: '🗡️', x: 140, y: 44, size: 26, rot: 135 }], fx: ['fall', 'sparks'] },
  ambush:        { pal: 'void', scene: 'ruins', s: [{ e: '🗡️', rot: -60 }], fx: ['smoke', 'slash1'] },
  openVeins:     { pal: 'blood', scene: 'plain', s: '🥀', fx: ['drops', 'motes'], drop: '#b3122a' },
  glint:         { pal: 'moon', scene: 'void', s: '💎', fx: ['rays', 'sparks'] },
  shroud:        { pal: 'void', scene: 'night', s: '🌒', fx: ['smoke', 'ring'] },
  crescentSweep: { pal: 'moon', scene: 'plain', s: [{ e: '🌙', size: 44, rot: -60 }], fx: ['swirl', 'slash', 'drops'], drop: '#b3122a' },
  serrated:      { pal: 'blood', scene: 'forge', s: [{ e: '🪚', rot: -30 }], fx: ['slash1', 'drops'], drop: '#b3122a' },
  needlepoint:   { pal: 'steel', scene: 'night', s: [{ e: '🪡', rot: 30 }], fx: ['sparks', 'drops'], drop: '#b3122a' },
  honedEdge:     { pal: 'steel', scene: 'forge', s: [{ e: '🔪', rot: -35 }], fx: ['sparks', 'rays'] },
  moonDance:     { pal: 'moon', scene: 'night', s: '💃', fx: ['shards', 'swirl'] },
  crimsonMoon:   { pal: 'blood', scene: 'night', s: [{ e: '🌕', size: 46 }], fx: ['rays', 'drops'], drop: '#b3122a' },
  silverMirage:  { pal: 'moon', scene: 'ruins', s: '🪞', fx: ['ring', 'motes'] },
  fanOfBlades:   { pal: 'moon', scene: 'night', s: [{ e: '🪭', size: 44 }], fx: ['shards', 'rays'] },
  redHarvest:    { pal: 'blood', scene: 'forest', s: '🌾', fx: ['slash', 'drops'], drop: '#b3122a' },
  whirlingSteel: { pal: 'steel', scene: 'plain', s: '🌀', fx: ['swirl', 'slash', 'sparks'] },
  shadowmeld:    { pal: 'void', scene: 'ruins', s: '👤', fx: ['smoke', 'motes'] },
  quicksilver:   { pal: 'steel', scene: 'void', s: '☿️', fx: ['speed', 'sparks'] },
  hemorrhage:    { pal: 'blood', scene: 'cave', s: '💉', fx: ['drops', 'burst'], drop: '#b3122a' },
  lunarLance:    { pal: 'moon', scene: 'sky', s: [{ e: '🔱', rot: 45 }], fx: ['beam', 'shards'] },
  duskParry:     { pal: 'dusk', scene: 'ruins', s: '⚔️', fx: ['ring', 'sparks'] },
  tempo:         { pal: 'moon', scene: 'void', s: '⏱️', fx: ['ripples', 'speed'] },
  cutpurse:      { pal: 'gold', scene: 'ruins', s: '👛', fx: ['slash1', 'sparks'] },
  nightVeil:     { pal: 'void', scene: 'void', s: '🌌', fx: ['ring', 'smoke'] },
  mirrorCut:     { pal: 'moon', scene: 'ruins', s: [{ e: '🗡️', x: 78, rot: -40, size: 40 }, { e: '🗡️', x: 124, rot: 40, size: 40 }], fx: ['slash', 'shards'] },
  phantomStep:   { pal: 'void', scene: 'night', s: '👻', fx: ['speed', 'smoke'] },
  bloodMoon:     { pal: 'blood', scene: 'sky', s: [{ e: '🌕', size: 56 }], fx: ['rays', 'drops'], drop: '#b3122a' },
  whisperingSteel:{ pal: 'steel', scene: 'night', s: '🎐', fx: ['ripples', 'shards'] },
  silverStorm:   { pal: 'moon', scene: 'sky', s: '🌠', fx: ['fall', 'shards', 'sparks'] },
  shardRequiem:  { pal: 'moon', scene: 'ruins', s: '🎼', fx: ['shards', 'runes'] },
  crimsonCrescent:{ pal: 'blood', scene: 'night', s: [{ e: '🌘', size: 52 }], fx: ['slash', 'drops'], drop: '#b3122a' },
  fullMoon:      { pal: 'moon', scene: 'sky', s: [{ e: '🌕', size: 60 }], fx: ['rays', 'shards'] },
  moonfall:      { pal: 'moon', scene: 'sky', s: [{ e: '☄️', size: 52, rot: -15 }], fx: ['fall', 'burst'] },
  // ==== The Alchemist ====
  vialToss:       { pal: 'toxic', scene: 'forge', s: [{ e: '🧪', rot: -35 }], fx: ['speed', 'bubbles'] },
  glassWall:      { pal: 'sea', scene: 'ruins', s: '🫙', fx: ['ring', 'shards'] },
  acidSplash:     { pal: 'toxic', scene: 'cave', s: '🟢', fx: ['drops', 'bubbles'], drop: '#7ddc4a' },
  quickBrew:      { pal: 'toxic', scene: 'forge', s: '⚗️', fx: ['bubbles', 'smoke'] },
  reagentDart:    { pal: 'toxic', scene: 'night', s: [{ e: '🎯', size: 42 }], fx: ['speed', 'drops'], drop: '#7ddc4a' },
  flaskBarrage:   { pal: 'flame', scene: 'night', s: [{ e: '🍾', x: 72, y: 50, size: 30, rot: -40 }, { e: '🧪', x: 112, y: 62, size: 34, rot: 30 }, { e: '🧪', x: 146, y: 44, size: 26, rot: -20 }], fx: ['fall', 'sparks'] },
  smokeFlask:     { pal: 'ash', scene: 'ruins', s: '💨', fx: ['smoke', 'bubbles'] },
  boilOver:       { pal: 'toxic', scene: 'forge', s: '♨️', fx: ['bubbles', 'flames'] },
  distill:        { pal: 'sea', scene: 'forge', s: '💧', fx: ['drops', 'ripples'], drop: '#6adcff' },
  saltWard:       { pal: 'steel', scene: 'ruins', s: '🧂', fx: ['ring', 'runes'] },
  catalystStrike: { pal: 'gold', scene: 'forge', s: '⚡', fx: ['bolt', 'bubbles'] },
  shatter:        { pal: 'sea', scene: 'cave', s: '🫧', fx: ['shards', 'burst'] },
  mixingBowl:     { pal: 'toxic', scene: 'forge', s: '🥣', fx: ['swirl', 'bubbles'] },
  detonate:       { pal: 'flame', scene: 'cave', s: '🧨', fx: ['burst', 'sparks', 'embers'] },
  fumeHood:       { pal: 'swamp', scene: 'forge', s: '☁️', fx: ['smoke', 'bubbles'] },
  catalysis:      { pal: 'arcane', scene: 'forge', s: '🔬', fx: ['runes', 'bubbles'] },
  doubleDose:     { pal: 'dusk', scene: 'ruins', s: [{ e: '💊', x: 80, size: 40, rot: -30 }, { e: '💊', x: 122, size: 40, rot: 30 }], fx: ['sparks', 'motes'] },
  tonicLash:      { pal: 'toxic', scene: 'night', s: '🪢', fx: ['slash', 'drops'], drop: '#7ddc4a' },
  volatileMix:    { pal: 'flame', scene: 'plain', s: '🌋', fx: ['burst', 'bubbles', 'embers'] },
  transmute:      { pal: 'arcane', scene: 'void', s: '🔄', fx: ['swirl', 'runes'] },
  elixirOfVigor:  { pal: 'blood', scene: 'forge', s: '🍷', fx: ['rays', 'bubbles'] },
  stockpile:      { pal: 'gold', scene: 'forge', s: '📦', fx: ['bubbles', 'motes'] },
  reactiveArmor:  { pal: 'steel', scene: 'forge', s: '🛡️', fx: ['ring', 'burst'] },
  philosophersStone: { pal: 'blood', scene: 'void', s: '💎', fx: ['rays', 'runes', 'sparks'] },
  chainReaction:  { pal: 'flame', scene: 'night', s: '⛓️', fx: ['burst', 'bolt'] },
  grandExperiment:{ pal: 'toxic', scene: 'forge', s: '🧫', fx: ['bubbles', 'rays', 'smoke'] },
  magnumOpus:     { pal: 'gold', scene: 'ruins', s: '📜', fx: ['rays', 'runes', 'burst'] },
  panacea:        { pal: 'forest', scene: 'forest', s: '🌿', fx: ['motes', 'rays'] },
  meltdown:       { pal: 'toxic', scene: 'plain', s: [{ e: '☢️', size: 56 }], fx: ['burst', 'flames', 'embers'] },
  acidRain:       { pal: 'toxic', scene: 'night', s: '🌧️', fx: ['fall', 'drops'], drop: '#7ddc4a' },
  alembic:        { pal: 'gold', scene: 'forge', s: '🏺', fx: ['drops', 'bubbles'], drop: '#8fe36a' },
  goldenRatio:    { pal: 'gold', scene: 'void', s: '🌀', fx: ['swirl', 'rays'] },
  // ==== Unlockable cards ====
  kindlingSpark:  { pal: 'ember', scene: 'cave', s: '✨', fx: ['embers', 'sparks'] },
  beaconFire:     { pal: 'flame', scene: 'sea', s: [{ e: '🔥', size: 50 }], fx: ['rays', 'flames'] },
  dawnbreaker:    { pal: 'dawn', scene: 'sky', s: [{ e: '🌅', size: 54 }], fx: ['rays', 'slash'] },
  crimsonFlourish:{ pal: 'blood', scene: 'night', s: '🌹', fx: ['slash', 'drops'], drop: '#b3122a' },
  moonlitWaltz:   { pal: 'moon', scene: 'ruins', s: '🩰', fx: ['swirl', 'shards'] },
  eclipseDance:   { pal: 'void', scene: 'void', s: [{ e: '🌘', size: 50 }], fx: ['swirl', 'slash', 'sparks'] },
  // ---- Status & curse ----
  ash:           { pal: 'ash', scene: 'plain', s: '⚱️', fx: ['smoke'] },
  muck:          { pal: 'swamp', scene: 'cave', s: [{ e: '🟤', size: 34, y: 70 }], fx: ['drops', 'bubbles'], drop: '#4a3a1a' },
  slag:          { pal: 'ash', scene: 'forge', s: '🪨', fx: ['embers'] },
  gloom:         { pal: 'void', scene: 'void', s: '🌑', fx: ['smoke'] },
  dread:         { pal: 'void', scene: 'cave', s: '💀', fx: ['smoke', 'motes'] },
  rot:           { pal: 'swamp', scene: 'forest', s: '🦠', fx: ['bubbles', 'drops'], drop: '#6d8a1f' },
};

// ---------- Drawing ----------
const ART_W = 200, ART_H = 110;
const artCache = new Map();

function artRng(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n) => Math.round(n * 10) / 10;

// Backdrops
const SCENES = {
  cave(r, P) {
    let s = '';
    for (let x = -10; x < ART_W + 10;) {
      const w = 10 + r() * 18, len = 8 + r() * 26;
      s += `<path d="M${f1(x)},0 L${f1(x + w)},0 L${f1(x + w * (0.35 + r() * 0.3))},${f1(len)} Z" fill="#000" opacity="${f1(0.3 + r() * 0.3)}"/>`;
      x += w * (0.7 + r() * 0.5);
    }
    return s + ground(r, 88, 0.6);
  },
  night(r, P) { return stars(r, 26, '#fff') + hills(r, 82, 0.45) + ground(r, 94, 0.65); },
  sky(r, P) {
    let s = '';
    for (let i = 0; i < 4; i++) s += `<ellipse cx="${f1(r() * ART_W)}" cy="${f1(15 + r() * 30)}" rx="${f1(20 + r() * 25)}" ry="${f1(4 + r() * 4)}" fill="${P[2]}" opacity=".12"/>`;
    return s + hills(r, 78, 0.35) + ground(r, 92, 0.6);
  },
  sea(r, P) {
    let s = stars(r, 18, '#fff') + `<rect x="0" y="74" width="${ART_W}" height="${ART_H - 74}" fill="#000" opacity=".45"/>`;
    for (let i = 0; i < 4; i++) {
      const y = 78 + i * 8;
      let d = `M0,${y}`;
      for (let x = 0; x <= ART_W; x += 20) d += ` Q${x + 10},${y - 3 - r() * 2} ${x + 20},${y}`;
      s += `<path d="${d}" stroke="${P[2]}" stroke-width="1" fill="none" opacity="${f1(0.25 - i * 0.04)}"/>`;
    }
    return s;
  },
  forge(r, P) {
    let s = '';
    for (let row = 0; row < 7; row++) {
      const y = row * 13, off = row % 2 ? 13 : 0;
      for (let x = -off; x < ART_W; x += 26) s += `<rect x="${x + 1}" y="${y + 1}" width="24" height="11" rx="2" fill="#000" opacity="${f1(0.12 + r() * 0.16)}"/>`;
    }
    return s + ground(r, 92, 0.7);
  },
  ruins(r, P) {
    let s = '';
    for (const x of [12 + r() * 14, ART_W - 38 - r() * 14]) {
      const top = 14 + r() * 22;
      s += `<rect x="${f1(x)}" y="${f1(top)}" width="22" height="${ART_H}" fill="#000" opacity=".4"/>`
        + `<rect x="${f1(x - 4)}" y="${f1(top - 6)}" width="30" height="7" fill="#000" opacity=".45"/>`;
    }
    return s + ground(r, 92, 0.6);
  },
  forest(r, P) {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const x = r() * ART_W, h = 20 + r() * 30, w = 12 + r() * 16, y = 92 - h;
      s += `<rect x="${f1(x - 2)}" y="${f1(y)}" width="4" height="${f1(h)}" fill="#000" opacity=".4"/>`
        + `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w * 0.45)}" fill="#000" opacity=".4"/>`
        + `<circle cx="${f1(x - w * 0.4)}" cy="${f1(y - 1)}" r="1.4" fill="${P[2]}" opacity=".5"/>`;
    }
    return s + ground(r, 92, 0.65);
  },
  void(r, P) {
    let s = stars(r, 34, P[2]);
    for (let i = 0; i < 3; i++) s += `<ellipse cx="${f1(r() * ART_W)}" cy="${f1(r() * ART_H)}" rx="${f1(30 + r() * 40)}" ry="${f1(12 + r() * 16)}" fill="${P[2]}" opacity=".08" filter="url(#art-blur4)"/>`;
    return s;
  },
  plain(r) { return ground(r, 92, 0.6); },
};
function stars(r, n, col) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${f1(r() * ART_W)}" cy="${f1(r() * 70)}" r="${f1(0.4 + r() * 0.9)}" fill="${col}" opacity="${f1(0.3 + r() * 0.6)}"/>`;
  return s;
}
function hills(r, y, op) {
  let d = `M0,${ART_H} L0,${y}`;
  for (let x = 0; x <= ART_W; x += 40) d += ` Q${x + 20},${f1(y - 8 - r() * 14)} ${x + 40},${f1(y + r() * 4)}`;
  return `<path d="${d} L${ART_W},${ART_H} Z" fill="#000" opacity="${op}"/>`;
}
function ground(r, y, op) {
  let d = `M0,${ART_H} L0,${y}`;
  for (let x = 0; x <= ART_W; x += 25) d += ` L${x},${f1(y + (r() - 0.5) * 6)}`;
  return `<path d="${d} L${ART_W},${ART_H} Z" fill="#000" opacity="${op}"/>`;
}
function flame(x, y, w, h, op = 1) {
  const path = (W, H) => `M${f1(x)},${f1(y)} C${f1(x - W)},${f1(y - H * 0.35)} ${f1(x - W * 0.3)},${f1(y - H * 0.75)} ${f1(x)},${f1(y - H)} C${f1(x + W * 0.3)},${f1(y - H * 0.75)} ${f1(x + W)},${f1(y - H * 0.35)} ${f1(x)},${f1(y)} Z`;
  return `<g class="af" opacity="${op}"><path d="${path(w, h)}" fill="#ff4d12" opacity=".85"/><path d="${path(w * 0.65, h * 0.7)}" fill="#ff9a2a"/><path d="${path(w * 0.32, h * 0.42)}" fill="#ffe27a"/></g>`;
}
function star4(x, y, s, col, op) {
  const k = s * 0.22;
  return `<path d="M${f1(x)},${f1(y - s)} L${f1(x + k)},${f1(y - k)} L${f1(x + s)},${f1(y)} L${f1(x + k)},${f1(y + k)} L${f1(x)},${f1(y + s)} L${f1(x - k)},${f1(y + k)} L${f1(x - s)},${f1(y)} L${f1(x - k)},${f1(y - k)} Z" fill="${col}" opacity="${f1(op)}"/>`;
}

// Effects. back: drawn behind the picture, front: in front of it.
const FX = {
  rays: { back(r, P, cx, cy) {
    let s = '';
    const n = 16, R = 170, off = r() * Math.PI;
    for (let i = 0; i < n; i += 1) {
      const a1 = off + (i / n) * Math.PI * 2, a2 = a1 + Math.PI / n * 0.8;
      s += `<path d="M${cx},${cy} L${f1(cx + Math.cos(a1) * R)},${f1(cy + Math.sin(a1) * R)} L${f1(cx + Math.cos(a2) * R)},${f1(cy + Math.sin(a2) * R)} Z" fill="${P[2]}" opacity="${i % 2 ? 0.07 : 0.15}"/>`;
    }
    return s;
  } },
  burst: { back(r, P, cx, cy) {
    let pts = '';
    const n = 14;
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2, rad = i % 2 ? 16 + r() * 6 : 38 + r() * 14;
      pts += `${f1(cx + Math.cos(a) * rad)},${f1(cy + Math.sin(a) * rad)} `;
    }
    return `<polygon points="${pts}" fill="${P[2]}" opacity=".55"/><circle cx="${cx}" cy="${cy}" r="18" fill="#fff" opacity=".45" filter="url(#art-blur4)"/>`;
  } },
  ring: { back(r, P, cx, cy) {
    return `<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${P[2]}" stroke-width="10" opacity=".18"/>`
      + `<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${P[2]}" stroke-width="2.2" opacity=".85"/>`
      + `<circle cx="${cx}" cy="${cy}" r="27" fill="${P[2]}" opacity=".08"/>`;
  } },
  ripples: { back(r, P, cx, cy) {
    let s = '';
    for (let i = 0; i < 4; i++) s += `<circle cx="${cx}" cy="${cy}" r="${26 + i * 15}" fill="none" stroke="${P[2]}" stroke-width="${2 - i * 0.35}" opacity="${f1(0.7 - i * 0.16)}"/>`;
    return s;
  } },
  swirl: { back(r, P, cx, cy) {
    let d = '';
    const dir = r() < 0.5 ? 1 : -1;
    for (let t = 0; t < Math.PI * 5; t += 0.25) {
      const rad = 4 + t * 4.2, a = t * dir;
      d += `${d ? 'L' : 'M'}${f1(cx + Math.cos(a) * rad)},${f1(cy + Math.sin(a) * rad * 0.7)} `;
    }
    return `<path d="${d}" fill="none" stroke="${P[2]}" stroke-width="2" opacity=".55" stroke-linecap="round"/>`;
  } },
  smoke: { back(r) {
    let s = '';
    for (let i = 0; i < 7; i++) s += `<ellipse cx="${f1(r() * ART_W)}" cy="${f1(30 + r() * 70)}" rx="${f1(18 + r() * 26)}" ry="${f1(9 + r() * 10)}" fill="#a8a29c" opacity="${f1(0.14 + r() * 0.16)}" filter="url(#art-blur4)"/>`;
    return s;
  } },
  motes: { back(r, P) {
    let s = '';
    for (let i = 0; i < 9; i++) s += `<circle cx="${f1(r() * ART_W)}" cy="${f1(r() * ART_H)}" r="${f1(3 + r() * 8)}" fill="${P[2]}" opacity="${f1(0.06 + r() * 0.14)}"/>`;
    return s;
  } },
  beam: { back(r, P, cx, cy) {
    return `<path d="M${cx},${cy - 5} L${ART_W + 10},${cy - 30} L${ART_W + 10},${cy + 26} L${cx},${cy + 5} Z" fill="${P[2]}" opacity=".35"/>`
      + `<path d="M${cx},${cy - 2} L${ART_W + 10},${cy - 10} L${ART_W + 10},${cy + 8} L${cx},${cy + 2} Z" fill="#fff" opacity=".45"/>`;
  } },
  eclipse: { back(r, P, cx, cy) {
    return `<circle cx="${cx}" cy="${cy}" r="40" fill="${P[2]}" opacity=".5" filter="url(#art-blur6)"/>`
      + `<circle cx="${cx}" cy="${cy}" r="31" fill="#ffe9b0" opacity=".9"/>`
      + `<circle cx="${cx + 7}" cy="${cy - 3}" r="30" fill="#050208"/>`;
  } },
  bubbles: { back(r, P) {
    let s = '';
    for (let i = 0; i < 12; i++) s += `<circle cx="${f1(r() * ART_W)}" cy="${f1(20 + r() * 85)}" r="${f1(1.5 + r() * 4)}" fill="none" stroke="${P[2]}" stroke-width=".9" opacity="${f1(0.3 + r() * 0.4)}"/>`;
    return s;
  } },
  oil: { back(r, P, cx) {
    return `<ellipse cx="${cx + 10}" cy="98" rx="70" ry="9" fill="#000" opacity=".7"/><ellipse cx="${cx + 4}" cy="96" rx="40" ry="3" fill="${P[2]}" opacity=".2"/>`;
  } },
  speed: { back(r, P) {
    let s = '';
    for (let i = 0; i < 9; i++) {
      const y = 20 + r() * 75, x = r() * 120, len = 30 + r() * 60;
      s += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x + len)}" y2="${f1(y)}" stroke="${P[2]}" stroke-width="${f1(0.8 + r() * 1.4)}" stroke-linecap="round" opacity="${f1(0.2 + r() * 0.35)}"/>`;
    }
    return s;
  } },
  flames: { front(r) {
    let s = '';
    const n = 8;
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * ART_W + (r() - 0.5) * 12;
      s += flame(x, ART_H + 2, 9 + r() * 6, 18 + r() * 20, 0.9);
    }
    return s;
  } },
  embers: { front(r) {
    let s = '';
    for (let i = 0; i < 16; i++) {
      const x = r() * ART_W, y = 10 + r() * 95;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.7 + r() * 1.5)}" fill="${r() < 0.5 ? '#ffb347' : '#ff7a2a'}" opacity="${f1(0.5 + r() * 0.5)}"/>`;
    }
    return s;
  } },
  sparks: { front(r, P) {
    let s = '';
    for (let i = 0; i < 10; i++) s += star4(r() * ART_W, 8 + r() * 94, 2 + r() * 4.5, r() < 0.4 ? '#fff' : P[2], 0.5 + r() * 0.5);
    return s;
  } },
  slash: { front(r, P, cx, cy) {
    let s = '';
    for (let i = 0; i < 2; i++) {
      const o = i * 12;
      const d = `M${cx - 62},${cy + 30 - o} Q${cx - 4},${cy - 34 - o} ${cx + 64},${cy - 18 - o}`;
      s += `<path d="${d}" fill="none" stroke="${P[2]}" stroke-width="7" opacity=".25" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${2 - i * 0.8}" opacity=".85" stroke-linecap="round"/>`;
    }
    return s;
  } },
  slash1: { front(r, P, cx, cy) {
    const d = `M${cx - 55},${cy + 26} Q${cx},${cy - 28} ${cx + 58},${cy - 22}`;
    return `<path d="${d}" fill="none" stroke="${P[2]}" stroke-width="6" opacity=".25" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".85" stroke-linecap="round"/>`;
  } },
  fall: { front(r, P) {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const x = 20 + r() * 190, y = r() * 60, len = 18 + r() * 26;
      s += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - len)}" y2="${f1(y + len * 0.9)}" stroke="${P[2]}" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>`
        + `<circle cx="${f1(x - len)}" cy="${f1(y + len * 0.9)}" r="2.2" fill="#fff" opacity=".85"/>`;
    }
    return s;
  } },
  bolt: { front(r, P) {
    let s = '';
    for (let k = 0; k < 2; k++) {
      let x = 30 + r() * 140, y = 0, d = `M${f1(x)},0`;
      while (y < ART_H) { y += 10 + r() * 12; x += (r() - 0.5) * 26; d += ` L${f1(x)},${f1(y)}`; }
      s += `<path d="${d}" fill="none" stroke="${P[2]}" stroke-width="5" opacity=".25"/><path d="${d}" fill="none" stroke="#fffbe0" stroke-width="1.5" opacity=".9"/>`;
    }
    return s;
  } },
  drops: { front(r, P, cx, cy, spec) {
    let s = '';
    const col = spec.drop || P[2];
    for (let i = 0; i < 7; i++) {
      const x = r() * ART_W, y = 14 + r() * 80, k = 2 + r() * 2.5;
      s += `<path d="M${f1(x)},${f1(y - k * 2.2)} C${f1(x + k)},${f1(y - k * 0.4)} ${f1(x + k)},${f1(y + k)} ${f1(x)},${f1(y + k)} C${f1(x - k)},${f1(y + k)} ${f1(x - k)},${f1(y - k * 0.4)} ${f1(x)},${f1(y - k * 2.2)} Z" fill="${col}" stroke="#fff" stroke-width=".4" stroke-opacity=".35" opacity=".9"/>`;
    }
    return s;
  } },
  shards: { front(r, P) {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const x = r() * ART_W, y = 14 + r() * 82, h = 6 + r() * 8, w = 2 + r() * 3;
      s += `<path d="M${f1(x)},${f1(y - h)} L${f1(x + w)},${f1(y)} L${f1(x)},${f1(y + h * 0.6)} L${f1(x - w)},${f1(y)} Z" fill="${P[2]}" stroke="#fff" stroke-width=".5" opacity=".7"/>`;
    }
    return s;
  } },
  runes: { front(r, P, cx, cy) {
    const glyphs = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ';
    let s = '';
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r() * 0.2;
      s += `<text x="${f1(cx + Math.cos(a) * 44)}" y="${f1(cy + Math.sin(a) * 32)}" font-size="9" text-anchor="middle" dominant-baseline="central" fill="${P[2]}" opacity=".8">${glyphs[Math.floor(r() * glyphs.length)]}</text>`;
    }
    return s;
  } },
  bars: { front(r, P) {
    let s = '';
    for (let x = 18; x < ART_W; x += 26) {
      s += `<rect x="${x}" y="0" width="3.5" height="${ART_H}" fill="#2a1a0c" opacity=".85"/>`;
      for (let y = 10 + r() * 10; y < ART_H; y += 16 + r() * 8) {
        const side = r() < 0.5 ? -1 : 1;
        s += `<path d="M${x + 1.75},${f1(y)} L${f1(x + 1.75 + side * 6)},${f1(y - 2)} L${x + 1.75},${f1(y + 3)} Z" fill="${P[2]}" opacity=".7"/>`;
      }
    }
    return s;
  } },
  waves: { front(r, P) {
    let s = '';
    for (let i = 0; i < 2; i++) {
      const y = 92 + i * 9;
      let d = `M-10,${y}`;
      for (let x = -10; x <= ART_W; x += 24) d += ` Q${x + 12},${y - 7} ${x + 24},${y}`;
      s += `<path d="${d} L${ART_W},${ART_H} L-10,${ART_H} Z" fill="#06202b" opacity=".85"/><path d="${d}" fill="none" stroke="${P[2]}" stroke-width="1.2" opacity=".6"/>`;
    }
    return s;
  } },
};

function defaultArtSpec(d) {
  const pal = { attack: 'ember', skill: 'night', power: 'arcane', status: 'ash', curse: 'void' }[d.type] || 'ember';
  return { pal, scene: 'plain', s: d.icon || '❔', fx: ['motes'] };
}

function buildArt(id) {
  const d = CARDS[id];
  const spec = ART[id] || defaultArtSpec(d);
  const P = PALETTES[spec.pal] || PALETTES.ember;
  const r = artRng(id);
  const subjects = (typeof spec.s === 'string' ? [{ e: spec.s }] : spec.s).map((x) => ({ x: 100, y: 58, size: 50, rot: 0, ...x }));
  const main = subjects.reduce((a, b) => (b.size > a.size ? b : a), subjects[0] || { x: 100, y: 58, size: 50 });
  const cx = main.x, cy = main.y;
  const fx = (spec.fx || []).filter((k) => FX[k]);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ART_W * 2}" height="${ART_H * 2}" viewBox="0 0 ${ART_W} ${ART_H}" preserveAspectRatio="xMidYMid slice">`
    + `<defs><linearGradient id="as" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P[0]}"/><stop offset="1" stop-color="${P[1]}"/></linearGradient>`
    + `<radialGradient id="ag"><stop offset="0" stop-color="${P[2]}" stop-opacity=".75"/><stop offset=".45" stop-color="${P[2]}" stop-opacity=".2"/><stop offset="1" stop-color="${P[2]}" stop-opacity="0"/></radialGradient>`
    + ART_DEFS + `</defs>`
    + `<rect width="${ART_W}" height="${ART_H}" fill="url(#as)"/>`
    + (SCENES[spec.scene] || SCENES.plain)(r, P)
    + `<ellipse cx="${cx}" cy="${cy}" rx="70" ry="48" fill="url(#ag)"/>`;
  for (const k of fx) if (FX[k].back) svg += FX[k].back(r, P, cx, cy, spec);
  for (const sb of subjects) {
    svg += `<text x="${sb.x}" y="${sb.y}" font-size="${sb.size}" text-anchor="middle" dominant-baseline="central" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif" filter="url(#art-sh)"${sb.rot ? ` transform="rotate(${sb.rot} ${sb.x} ${sb.y})"` : ''}>${sb.e}</text>`;
  }
  for (const k of fx) if (FX[k].front) svg += FX[k].front(r, P, cx, cy, spec);
  svg += `<rect width="${ART_W}" height="${ART_H}" fill="url(#art-vig)"/></svg>`;
  return svg;
}

// Filters and gradients each picture uses (every picture is its own little image).
const ART_DEFS = '<filter id="art-sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2.4" flood-color="#000" flood-opacity=".85"/></filter>'
  + '<filter id="art-blur4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>'
  + '<filter id="art-blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'
  + '<radialGradient id="art-vig" cx=".5" cy=".5" r=".7"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>';

// Returns the inner HTML for a card's picture box.
// Each picture is painted once into a plain bitmap image (PNG) and reused. Bitmaps are
// cheap to move, scale and copy, which keeps every card animation smooth.
const artPng = new Map();
function svgArtUrl(id) {
  let url = artCache.get(id);
  if (!url) { url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(buildArt(id)); artCache.set(id, url); }
  return url;
}
function cardArtHTML(card) {
  const d = cardDef(card);
  if (d.img) return `<img class="art-img" src="${esc(d.img)}" alt="" draggable="false">`;
  const url = artPng.get(card.id) || svgArtUrl(card.id);
  if (!artPng.has(card.id)) rasterizeArt(card.id);
  return `<img class="art-img" src="${url}" alt="" draggable="false">`;
}
const artPending = new Set();
function rasterizeArt(id) {
  if (artPng.has(id) || artPending.has(id)) return;
  artPending.add(id);
  const img = new Image();
  img.onload = () => {
    try {
      const cv = document.createElement('canvas');
      cv.width = ART_W * 2; cv.height = ART_H * 2;
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob((b) => {
        artPending.delete(id);
        if (!b) return;
        const u = URL.createObjectURL(b);
        artPng.set(id, u);
        // swap any pictures of this card already on screen
        const old = svgArtUrl(id);
        document.querySelectorAll('img.art-img').forEach((n) => { if (n.getAttribute('src') === old) n.src = u; });
      }, 'image/png');
    } catch (e) { artPending.delete(id); artPng.set(id, svgArtUrl(id)); }
  };
  img.onerror = () => { artPending.delete(id); };
  img.src = svgArtUrl(id);
}
// Paint all card pictures in the background, a few at a time, while the browser is idle.
(function prepaintArt() {
  const ids = () => Object.keys(CARDS).filter((k) => !CARDS[k].img && !artPng.has(k) && !artPending.has(k));
  const idle = window.requestIdleCallback || ((f) => setTimeout(() => f({ timeRemaining: () => 8 }), 50));
  // Your own hero's cards first, then the rest. One picture at a time with a pause in
  // between, so the game never stutters while this happens.
  const order = () => {
    const mine = Game.run ? Game.run.char : 'lampwright';
    return ids().sort((a, b) => (CARDS[b].char === mine) - (CARDS[a].char === mine));
  };
  const step = (dl) => {
    const list = order();
    if (!list.length) return;
    if (dl.timeRemaining() > 6 && !Game.combat?.busy) rasterizeArt(list[0]);
    setTimeout(() => idle(step), 120);
  };
  window.addEventListener('load', () => setTimeout(() => idle(step), 800));
})();

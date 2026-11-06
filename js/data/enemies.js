// ===== Enemies, encounters and acts =====
// Move fields: name, dmg, hits, block, buff{status:n} (self), buffAll{} (all enemies), debuff{} (on you),
//              cards[{id,n,pile}], summon{id,n,max}, intent (override icon type), fn(ctx, e) for custom logic
// ai(h) picks the next move. h = { e, turn, last(n), lastTwo(k), chance(p), ctx, allies() }
'use strict';

const ENEMIES = {
  // ================= ACT 1: THE DROWNED CATACOMBS =================
  leech: { name: 'Bog Leech', hp: [11, 15], sprite: '🪱', scale: 0.9,
    moves: { bite: { name: 'Bite', dmg: 6 }, swell: { name: 'Swell', buff: { might: 3 } } },
    ai: (h) => (h.last() === 'swell' || h.turn === 0 ? 'bite' : h.chance(0.7) ? 'bite' : 'swell') },
  moth: { name: 'Grave Moth', hp: [9, 12], sprite: '🦋', filter: 'grayscale(0.8) brightness(0.9) sepia(0.5)', scale: 0.8,
    moves: { flutter: { name: 'Flutter', dmg: 3, hits: 2 }, dust: { name: 'Grave Dust', debuff: { sapped: 1 } } },
    ai: (h) => (h.turn === 0 ? (h.chance(0.5) ? 'dust' : 'flutter') : h.last() === 'dust' ? 'flutter' : h.chance(0.6) ? 'dust' : 'flutter') },
  crawler: { name: 'Rot Crawler', hp: [38, 42], sprite: '🐛', filter: 'hue-rotate(60deg) saturate(0.7)', scale: 1.1,
    init: (c, e) => { e.statuses.coil = 7; },
    moves: { gnaw: { name: 'Gnaw', dmg: 11 }, thrash: { name: 'Thrash', dmg: 6, block: 6 }, hiss: { name: 'Hiss', buff: { might: 2 } } },
    ai: (h) => (h.turn === 0 ? 'gnaw' : h.lastTwo('gnaw') ? 'thrash' : h.last() === 'hiss' ? 'gnaw' : weighted([['gnaw', 45], ['thrash', 35], ['hiss', 20]])) },
  rattler: { name: 'Bone Rattler', hp: [24, 28], sprite: '💀', scale: 0.9,
    moves: { clatter: { name: 'Clatter', dmg: 7 }, spur: { name: 'Bone Spur', dmg: 4, debuff: { exposed: 1 } }, brace: { name: 'Brace', block: 8 } },
    ai: (h) => (h.lastTwo('clatter') ? 'spur' : h.last() === 'brace' ? 'clatter' : weighted([['clatter', 50], ['spur', 30], ['brace', 20]])) },
  acolyte: { name: 'Drowned Acolyte', hp: [46, 52], sprite: '🧟', filter: 'hue-rotate(160deg)',
    moves: { chant: { name: 'Sunken Hymn', buff: { fervor: 2 } }, drown: { name: 'Drown', dmg: 6 } },
    ai: (h) => (h.turn === 0 ? 'chant' : 'drown') },
  slimeL: { name: 'Great Brine Slime', hp: [62, 68], sprite: '🦠', filter: 'hue-rotate(80deg)', scale: 1.35, split: 'slimeM',
    init: (c, e) => { e.statuses.splitter = 1; },
    moves: { slosh: { name: 'Slosh', dmg: 10, cards: [{ id: 'muck', n: 2, pile: 'discard' }] }, ooze: { name: 'Ooze', debuff: { sapped: 2 } }, slam: { name: 'Slam', dmg: 14 } },
    ai: (h) => (h.last() === 'ooze' ? (h.chance(0.5) ? 'slam' : 'slosh') : h.lastTwo('slosh') ? 'ooze' : weighted([['slosh', 50], ['ooze', 30], ['slam', 20]])) },
  slimeM: { name: 'Brine Slime', hp: [28, 32], sprite: '🦠', filter: 'hue-rotate(80deg)', scale: 1.0,
    moves: { slosh: { name: 'Slosh', dmg: 8, cards: [{ id: 'muck', n: 1, pile: 'discard' }] }, lick: { name: 'Lick', debuff: { sapped: 1 } } },
    ai: (h) => (h.lastTwo('slosh') ? 'lick' : h.last() === 'lick' ? 'slosh' : h.chance(0.7) ? 'slosh' : 'lick') },
  slimeS: { name: 'Brine Droplet', hp: [9, 13], sprite: '🦠', filter: 'hue-rotate(80deg)', scale: 0.65,
    moves: { tackle: { name: 'Tackle', dmg: 4 }, lick: { name: 'Lick', debuff: { sapped: 1 } } },
    ai: (h) => (h.last() === 'tackle' ? 'lick' : 'tackle') },
  // --- Act 1 elites ---
  warden: { name: 'The Gravewarden', hp: [76, 80], sprite: '👹', scale: 1.35, elite: true,
    moves: { bellow: { name: 'Bellow', buff: { wrath: 1 } }, cleave: { name: 'Cleave', dmg: 13 }, skull: { name: 'Skull Bash', dmg: 6, debuff: { exposed: 2 } } },
    ai: (h) => (h.turn === 0 ? 'bellow' : h.lastTwo('cleave') ? 'skull' : h.chance(0.33) && h.last() !== 'skull' ? 'skull' : 'cleave') },
  brute: { name: 'Barnacle Brute', hp: [96, 102], sprite: '🦀', scale: 1.4, elite: true,
    init: (c, e) => { e.statuses.shell = 8; },
    moves: { crush: { name: 'Crush', dmg: 16 }, pinch: { name: 'Twin Pinch', dmg: 6, hits: 2 }, encrust: { name: 'Encrust', block: 10, buff: { might: 2 } } },
    ai: (h) => ['pinch', 'crush', 'encrust'][h.turn % 3] },
  lamprey: { name: 'Lamprey Sister', hp: [36, 40], sprite: '🐍', filter: 'hue-rotate(200deg)', scale: 1.1, elite: true,
    moves: { bite: { name: 'Bite', dmg: 9 }, venom: { name: 'Venom Fang', dmg: 5, debuff: { burn: 3 } }, coil: { name: 'Coil', block: 10 } },
    ai: (h) => (h.lastTwo('bite') ? 'venom' : h.last() === 'venom' ? (h.chance(0.5) ? 'bite' : 'coil') : weighted([['bite', 55], ['venom', 30], ['coil', 15]])) },
  // --- Act 1 boss ---
  motherBrine: { name: 'Mother Brine', title: 'Queen of the Drowned', hp: [190, 190], sprite: '🐙', scale: 1.8, boss: true,
    moves: {
      tide: { name: 'Tide Call', block: 10, cards: [{ id: 'muck', n: 2, pile: 'discard' }] },
      lash: { name: 'Tentacle Lash', dmg: 8, hits: 2 },
      wave: { name: 'Crushing Wave', dmg: 20 },
      rise: { name: 'Rising Tide', buff: { might: 2 }, intent: 'buff',
        fn: (c, e) => { e.risen = true; for (const k of DURATION_STATUSES) delete e.statuses[k]; delete e.statuses.burn; c.float(e, 'Cleansed!', 'buff'); } },
    },
    ai: (h) => {
      if (!h.e.risen && h.e.hp <= h.e.maxHp / 2) return 'rise';
      const cycle = ['tide', 'lash', 'wave', 'lash'];
      return cycle[(h.e.cycle = (h.e.cycle ?? -1) + 1) % cycle.length];
    } },

  // ================= ACT 2: THE MYCELIUM DEEP =================
  puffer: { name: 'Spore Puffer', hp: [26, 30], sprite: '🍄', scale: 0.95,
    init: (c, e) => { e.statuses.sporeBurst = 2; },
    moves: { spit: { name: 'Spore Spit', dmg: 9 }, puff: { name: 'Puff Up', buff: { might: 3 } } },
    ai: (h) => (h.lastTwo('spit') ? 'puff' : h.last() === 'puff' ? 'spit' : h.chance(0.65) ? 'spit' : 'puff') },
  stalker: { name: 'Mycelid Stalker', hp: [48, 54], sprite: '🦗', filter: 'hue-rotate(250deg)', scale: 1.1,
    moves: { lunge: { name: 'Lunge', dmg: 13 }, stalk: { name: 'Stalk', dmg: 7, block: 7 }, mark: { name: 'Hunting Mark', debuff: { exposed: 2 } } },
    ai: (h) => (h.turn === 0 ? 'mark' : h.lastTwo('lunge') ? 'stalk' : h.last() === 'mark' ? 'lunge' : weighted([['lunge', 45], ['stalk', 40], ['mark', 15]])) },
  capBrute: { name: 'Capstool Brute', hp: [66, 72], sprite: '🧌', filter: 'hue-rotate(-40deg)', scale: 1.3,
    moves: { smash: { name: 'Fungal Smash', dmg: 20 }, bulk: { name: 'Bulk Up', block: 8, buff: { might: 3 } }, stomp: { name: 'Stomp', dmg: 9, debuff: { brittle: 2 } } },
    ai: (h) => (h.last() === 'smash' ? (h.chance(0.5) ? 'bulk' : 'stomp') : h.turn === 0 ? 'stomp' : 'smash') },
  glowworm: { name: 'Glowworm', hp: [16, 20], sprite: '🐛', filter: 'hue-rotate(180deg) brightness(1.3)', scale: 0.8,
    moves: { nip: { name: 'Nip', dmg: 6 }, shine: { name: 'Shine', intent: 'defend',
      fn: (c, e) => { const a = pick(c.alive()); c.gainBlock(a, 7, true); } } },
    ai: (h) => (h.last() === 'shine' ? 'nip' : h.chance(0.65) ? 'nip' : 'shine') },
  rotPriest: { name: 'Rot Priest', hp: [42, 46], sprite: '🧙', filter: 'hue-rotate(90deg) brightness(0.8)',
    moves: { bless: { name: 'Rot Blessing', buffAll: { might: 2 } }, smite: { name: 'Smite', dmg: 10 },
      curse: { name: 'Spread Gloom', dmg: 5, cards: [{ id: 'gloom', n: 1, pile: 'draw' }] } },
    ai: (h) => (h.turn === 0 ? 'bless' : h.last() === 'bless' ? 'smite' : weighted([['smite', 45], ['curse', 35], ['bless', 20]])) },
  thornCrawler: { name: 'Thorn Crawler', hp: [40, 44], sprite: '🦔', filter: 'hue-rotate(90deg)',
    init: (c, e) => { e.statuses.spines = 3; },
    moves: { prick: { name: 'Prickle', dmg: 5, hits: 2 }, brace: { name: 'Curl Up', block: 11 } },
    ai: (h) => (h.lastTwo('prick') ? 'brace' : h.last() === 'brace' ? 'prick' : h.chance(0.7) ? 'prick' : 'brace') },
  sporeling: { name: 'Sporeling', hp: [12, 15], sprite: '🍄', filter: 'hue-rotate(200deg)', scale: 0.6,
    moves: { nibble: { name: 'Nibble', dmg: 5 }, puff: { name: 'Puff', debuff: { sapped: 1 } } },
    ai: (h) => (h.last() === 'puff' ? 'nibble' : h.chance(0.7) ? 'nibble' : 'puff') },
  // --- Act 2 elites ---
  matriarch: { name: 'Fungal Matriarch', hp: [132, 140], sprite: '🪸', filter: 'hue-rotate(260deg)', scale: 1.5, elite: true,
    moves: { spawn: { name: 'Birth Spores', summon: { id: 'sporeling', n: 2, max: 3 } }, crush: { name: 'Crush', dmg: 16 },
      cloud: { name: 'Spore Cloud', debuff: { sapped: 2, exposed: 2 } } },
    ai: (h) => {
      const minions = h.allies().filter((a) => a.id === 'sporeling').length;
      if (h.turn === 0 || (minions === 0 && h.last() !== 'spawn')) return 'spawn';
      if (h.lastTwo('crush')) return 'cloud';
      return h.last() === 'cloud' ? 'crush' : h.chance(0.7) ? 'crush' : 'cloud';
    } },
  gloomKnight: { name: 'Gloom Knight', hp: [140, 148], sprite: '🤺', filter: 'brightness(0.95) hue-rotate(220deg) drop-shadow(0 0 10px #66f)', scale: 1.4, elite: true,
    init: (c, e) => { e.statuses.nullify = 2; },
    moves: { heavy: { name: 'Heavy Blade', dmg: 22 }, bash: { name: 'Shield Bash', dmg: 10, block: 12 }, pact: { name: 'Dark Pact', buff: { might: 3 } } },
    ai: (h) => ['bash', 'heavy', 'pact', 'heavy'][h.turn % 4] },
  beetle: { name: 'Thornback Beetle', hp: [118, 124], sprite: '🪲', scale: 1.5, elite: true,
    init: (c, e) => { e.statuses.spines = 4; e.statuses.shell = 6; },
    moves: { ram: { name: 'Ram', dmg: 18 }, volley: { name: 'Spike Volley', dmg: 5, hits: 3 } },
    ai: (h) => (h.last() === 'ram' ? 'volley' : 'ram') },
  // --- Act 2 boss ---
  paleSovereign: { name: 'The Pale Sovereign', title: 'Lord of the Endless Mycelium', hp: [320, 320], sprite: '🍄', overlay: '👑', filter: 'saturate(0.2) brightness(1.3)', scale: 1.9, boss: true,
    moves: {
      summon: { name: 'Court of Spores', summon: { id: 'sporeling', n: 2, max: 3 }, block: 10 },
      decree: { name: 'Royal Decree', block: 15, debuff: { sapped: 2, brittle: 2 } },
      rain: { name: 'Spore Rain', dmg: 6, hits: 3, cards: [{ id: 'gloom', n: 2, pile: 'draw' }] },
      devour: { name: 'Devour', dmg: 32 },
    },
    ai: (h) => {
      if (h.turn === 0) return 'summon';
      const cycle = ['decree', 'rain', 'devour', 'summon'];
      let m = cycle[(h.e.cycle = (h.e.cycle ?? -1) + 1) % cycle.length];
      if (m === 'summon' && h.allies().filter((a) => a.id === 'sporeling').length >= 2) m = 'rain';
      return m;
    } },

  // ================= ACT 3: THE LIGHTLESS ABYSS =================
  shade: { name: 'Shade', hp: [42, 48], sprite: '👤', filter: 'brightness(0.3) drop-shadow(0 0 8px #a0f)',
    moves: { grasp: { name: 'Cold Grasp', dmg: 14 }, chill: { name: 'Chill', dmg: 7, debuff: { brittle: 2 } }, fade: { name: 'Fade', block: 12 } },
    ai: (h) => (h.lastTwo('grasp') ? 'chill' : h.last() === 'fade' ? 'grasp' : weighted([['grasp', 45], ['chill', 35], ['fade', 20]])) },
  voidHound: { name: 'Void Hound', hp: [52, 58], sprite: '🐺', filter: 'brightness(0.45) hue-rotate(220deg) saturate(2)', scale: 1.15,
    moves: { maul: { name: 'Maul', dmg: 7, hits: 2 }, howl: { name: 'Howl', buffAll: { might: 2 } }, bite: { name: 'Throat Bite', dmg: 13 } },
    ai: (h) => (h.turn === 0 ? 'howl' : h.last() === 'howl' ? 'maul' : h.lastTwo('maul') ? 'bite' : weighted([['maul', 45], ['bite', 40], ['howl', 15]])) },
  watcher: { name: 'Hollow Watcher', hp: [62, 68], sprite: '👁️', scale: 1.2,
    moves: { stare: { name: 'Piercing Stare', debuff: { exposed: 2, sapped: 1 } }, gather: { name: 'Gather Darkness', block: 10, intent: 'unknown' },
      beam: { name: 'Void Beam', dmg: 30 } },
    ai: (h) => ['stare', 'gather', 'beam'][h.turn % 3] },
  wisp: { name: 'Abyssal Wisp', hp: [22, 26], sprite: '👻', filter: 'hue-rotate(200deg) brightness(0.8)', scale: 0.8,
    moves: { drain: { name: 'Drain', dmg: 7 }, flicker: { name: 'Flicker', block: 6, buff: { might: 1 } } },
    ai: (h) => (h.last() === 'flicker' ? 'drain' : h.chance(0.65) ? 'drain' : 'flicker') },
  inkGolem: { name: 'Ink Golem', hp: [92, 98], sprite: '🗿', filter: 'brightness(0.4) contrast(1.4)', scale: 1.4,
    moves: { pound: { name: 'Pound', dmg: 21 }, spray: { name: 'Ink Spray', dmg: 8, cards: [{ id: 'gloom', n: 2, pile: 'draw' }] },
      harden: { name: 'Harden', buff: { shell: 5 } } },
    ai: (h) => (h.turn === 0 ? 'harden' : h.last() === 'pound' ? 'spray' : 'pound') },
  // --- Act 3 elites ---
  singer: { name: 'Shadow Singer', hp: [50, 54], sprite: '🎭', filter: 'brightness(0.5) hue-rotate(260deg)', scale: 1.0, elite: true,
    moves: { dirge: { name: 'Dirge', dmg: 10 }, chorus: { name: 'Chorus', buffAll: { might: 2 } }, lament: { name: 'Lament', dmg: 4, debuff: { sapped: 1, brittle: 1 } } },
    ai: (h) => (h.turn === 0 ? pick(['dirge', 'chorus', 'lament']) : h.last() === 'chorus' ? 'dirge' : weighted([['dirge', 45], ['lament', 30], ['chorus', 25]])) },
  ashWarden: { name: 'Warden of Ash', hp: [200, 210], sprite: '🗡️', overlay: '🔥', scale: 1.5, elite: true,
    moves: { incinerate: { name: 'Incinerate', dmg: 6, hits: 3 }, wall: { name: 'Ash Wall', block: 20, buff: { shell: 5 } },
      brand: { name: 'Brand', dmg: 16, cards: [{ id: 'slag', n: 2, pile: 'discard' }] } },
    ai: (h) => ['incinerate', 'brand', 'wall'][h.turn % 3] },
  serpent: { name: 'Eclipse Serpent', hp: [190, 200], sprite: '🐉', filter: 'brightness(0.55) hue-rotate(180deg)', scale: 1.6, elite: true,
    moves: { coil: { name: 'Tighten Coils', block: 12, buff: { might: 2 } }, strike: { name: 'Eclipse Strike', dmg: 26 },
      venom: { name: 'Black Venom', dmg: 8, debuff: { burn: 5 } } },
    ai: (h) => (h.turn === 0 ? 'venom' : h.last() === 'strike' ? 'coil' : h.last() === 'coil' ? 'venom' : 'strike') },
  // --- Act 3 boss ---
  umbra: { name: 'Umbra, the Devouring Night', title: 'The Hunger Beneath the World', hp: [440, 440], sprite: '🌑', overlay: '👁️', scale: 2.0, boss: true,
    init: (c, e) => { e.statuses.nullify = 2; },
    moves: {
      eclipse: { name: 'Total Eclipse', debuff: { sapped: 2, exposed: 2, brittle: 2 }, intent: 'debuff',
        fn: (c) => { if (c.player.statuses.glow) { delete c.player.statuses.glow; c.float(c.player, 'Light snuffed!', 'debuff'); } } },
      lash: { name: 'Night Lash', dmg: 8, hits: 3 },
      dark: { name: 'Endless Dark', block: 25, buff: { might: 3 } },
      devour: { name: 'Devour the Light', dmg: 40 },
      spawn: { name: 'Shadow Spawn', summon: { id: 'wisp', n: 2, max: 2 } },
    },
    ai: (h) => {
      if (h.turn === 0) return 'eclipse';
      const cycle = ['lash', 'dark', 'devour', 'spawn', 'lash', 'eclipse', 'devour'];
      let m = cycle[(h.e.cycle = (h.e.cycle ?? -1) + 1) % cycle.length];
      if (m === 'spawn' && h.allies().filter((a) => a.minion).length >= 2) m = 'lash';
      return m;
    } },
};

const ACTS = [
  { name: 'The Drowned Catacombs', subtitle: 'Act I', bg: ['#0c1a1f', '#06100f'], accent: '#3fb6a8',
    easy: [['leech'], ['moth', 'moth'], ['slimeM', 'slimeS'], ['rattler']],
    hard: [['crawler'], ['acolyte'], ['slimeL'], ['leech', 'moth', 'moth'], ['rattler', 'leech'], ['slimeS', 'slimeS', 'slimeM'], ['rattler', 'moth']],
    elites: [['warden'], ['brute'], ['lamprey', 'lamprey']],
    bosses: [['motherBrine']] },
  { name: 'The Mycelium Deep', subtitle: 'Act II', bg: ['#1a1024', '#0b0712'], accent: '#c38bff',
    easy: [['puffer', 'puffer'], ['stalker'], ['glowworm', 'glowworm', 'glowworm']],
    hard: [['capBrute'], ['rotPriest', 'puffer'], ['thornCrawler', 'glowworm'], ['stalker', 'puffer'], ['rotPriest', 'stalker'], ['thornCrawler', 'thornCrawler']],
    elites: [['matriarch'], ['gloomKnight'], ['beetle']],
    bosses: [['paleSovereign']] },
  { name: 'The Lightless Abyss', subtitle: 'Act III', bg: ['#221014', '#060304'], accent: '#ff7a3d',
    easy: [['shade', 'wisp'], ['voidHound'], ['wisp', 'wisp', 'wisp']],
    hard: [['watcher', 'wisp'], ['inkGolem'], ['shade', 'voidHound'], ['voidHound', 'wisp', 'wisp'], ['watcher', 'shade'], ['inkGolem', 'wisp']],
    elites: [['singer', 'singer', 'singer'], ['ashWarden'], ['serpent']],
    bosses: [['umbra']] },
];

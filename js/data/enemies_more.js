// ===== More enemies: 6 normal, 2 elites, 1 boss and "?"-room foes for every act =====
// Same format as enemies.js. Every enemy here lives in exactly one act.
'use strict';

Object.assign(ENEMIES, {
  // ================= ACT 1: THE DROWNED CATACOMBS =================
  drownedSailor: { name: 'Drowned Sailor', hp: [34, 38], sprite: ':zombie:', scale: 1.05,
    moves: { anchor: { name: 'Anchor Swing', dmg: 8 }, bilge: { name: 'Bilge Spit', dmg: 4, debuff: { sapped: 1 } } },
    ai: (h) => (h.last() === 'bilge' ? 'anchor' : h.chance(0.6) ? 'anchor' : 'bilge') },
  cryptRat: { name: 'Crypt Rat', hp: [14, 18], sprite: ':worm:', scale: 0.75,
    moves: { bite: { name: 'Bite', dmg: 5 }, gnaw: { name: 'Gnaw', dmg: 2, hits: 2 }, skitter: { name: 'Skitter', block: 5 } },
    ai: (h) => (h.lastTwo('bite') ? 'gnaw' : weighted([['bite', 50], ['gnaw', 30], ['skitter', 20]])) },
  gloomfin: { name: 'Gloomfin', hp: [30, 34], sprite: ':wave:', scale: 1.0,
    moves: { lure: { name: 'Hypnotic Lure', debuff: { exposed: 1 } }, chomp: { name: 'Chomp', dmg: 9 }, thrash: { name: 'Thrash', dmg: 3, hits: 2 } },
    ai: (h) => (h.turn % 4 === 0 ? 'lure' : h.last() === 'chomp' ? 'thrash' : 'chomp') },
  boneArcher: { name: 'Bone Archer', hp: [22, 26], sprite: ':skull:', scale: 0.95,
    moves: { aim: { name: 'Take Aim', buff: { might: 1 } }, volley: { name: 'Volley', dmg: 3, hits: 3 }, pierce: { name: 'Piercing Shot', dmg: 9 } },
    ai: (h) => (h.turn === 0 ? 'aim' : h.last() === 'volley' ? 'pierce' : h.last() === 'pierce' && h.chance(0.3) ? 'aim' : 'volley') },
  tideCrab: { name: 'Tidepool Crab', hp: [26, 30], sprite: ':crab:', scale: 0.9,
    moves: { pinch: { name: 'Pinch', dmg: 7 }, burrow: { name: 'Burrow', block: 9 }, snap: { name: 'Double Snap', dmg: 4, hits: 2 } },
    ai: (h) => (h.last() === 'burrow' ? 'snap' : weighted([['pinch', 45], ['burrow', 30], ['snap', 25]])) },
  tollingBell: { name: 'Tolling Bell', hp: [40, 44], sprite: ':bell:', scale: 1.05,
    moves: { toll: { name: 'Death Knell', debuff: { exposed: 1 }, buffAll: { might: 1 } }, clang: { name: 'Clang', dmg: 8 }, resonate: { name: 'Resonate', block: 8 } },
    ai: (h) => (h.turn === 0 || h.turn % 3 === 0 ? 'toll' : h.last() === 'clang' && h.chance(0.4) ? 'resonate' : 'clang') },
  // --- Act 1 elites ---
  drownedCaptain: { name: 'The Drowned Captain', hp: [88, 92], sprite: ':skull:', scale: 1.4, elite: true,
    moves: {
      crew: { name: 'All Hands!', block: 8, summon: { id: 'drownedSailor', n: 1, max: 1, hp: [20, 24] } },
      cutlass: { name: 'Cutlass', dmg: 12 },
      broadside: { name: 'Broadside', dmg: 4, hits: 3 },
    },
    ai: (h) => (h.turn === 0 || (h.turn % 4 === 0 && h.allies().length < 2) ? 'crew' : h.last() === 'cutlass' ? 'broadside' : 'cutlass') },
  bogHag: { name: 'Bog Hag', hp: [86, 92], sprite: ':mage:', scale: 1.3, elite: true,
    moves: {
      hex: { name: 'Withering Hex', debuff: { sapped: 2, exposed: 2 } },
      ladle: { name: 'Ladle Smash', dmg: 15 },
      cauldron: { name: 'Bubbling Cauldron', buff: { mending: 6 }, cards: [{ id: 'muck', n: 2, pile: 'discard' }] },
    },
    ai: (h) => (h.turn % 4 === 0 ? 'hex' : h.last() === 'ladle' ? 'cauldron' : 'ladle') },
  // --- Act 1 boss ---
  boneColossus: { name: 'The Bone Colossus', title: 'Lord of the Ossuary', hp: [148, 148], sprite: ':skull:', scale: 1.9, boss: true,
    moves: {
      rattle: { name: 'Raise the Dead', block: 12, summon: { id: 'boneArcher', n: 1, max: 2, hp: [14, 16] } },
      smash: { name: 'Ossuary Slam', dmg: 16 },
      rain: { name: 'Bone Rain', dmg: 3, hits: 4 },
      fury: { name: 'Marrow Fury', buff: { might: 2 }, intent: 'buff', fn: (c, e) => { e.raged = true; } },
    },
    ai: (h) => {
      if (!h.e.raged && h.e.hp <= h.e.maxHp / 2) return 'fury';
      const cycle = ['rattle', 'smash', 'rain', 'smash'];
      return cycle[(h.e.cycle = (h.e.cycle ?? -1) + 1) % cycle.length];
    } },
  // --- Act 1 "?" room foes ---
  graveRobber: { name: 'Grave Robber', hp: [30, 34], sprite: ':silhouette:', scale: 1.0,
    moves: {
      pilfer: { name: 'Pilfer', dmg: 7, fn: (c, e) => { const g = Math.min(Game.run.gold, 12); if (g) { Game.run.gold -= g; c.float(c.player, `-${g} gold`, 'debuff'); renderTopbar(true); } } },
      smoke: { name: 'Smoke Bomb', block: 10 },
      stab: { name: 'Backstab', dmg: 10 },
    },
    ai: (h) => (h.turn === 0 ? 'pilfer' : h.last() === 'stab' ? (h.chance(0.5) ? 'smoke' : 'pilfer') : 'stab') },

  // ================= ACT 2: THE MYCELIUM DEEP =================
  mossGolem: { name: 'Moss Golem', hp: [62, 68], sprite: ':moai:', scale: 1.3,
    moves: { slam: { name: 'Slam', dmg: 12 }, overgrow: { name: 'Overgrow', block: 12, buff: { mending: 3 } }, quake: { name: 'Quake', dmg: 6, debuff: { sapped: 1 } } },
    ai: (h) => (h.last() === 'overgrow' ? 'slam' : weighted([['slam', 45], ['overgrow', 25], ['quake', 30]])) },
  sporeBat: { name: 'Spore Bat', hp: [18, 22], sprite: ':butterfly:', scale: 0.8,
    moves: { dive: { name: 'Dive', dmg: 4, hits: 2 }, spores: { name: 'Spore Cloud', debuff: { exposed: 1 } } },
    ai: (h) => (h.last() === 'spores' ? 'dive' : h.chance(0.7) ? 'dive' : 'spores') },
  hyphaeWeaver: { name: 'Hyphae Weaver', hp: [44, 48], sprite: ':cricket:', scale: 1.1,
    moves: { web: { name: 'Choking Web', debuff: { sapped: 1 }, cards: [{ id: 'gloom', n: 1, pile: 'draw' }] }, fang: { name: 'Fang', dmg: 11 }, spin: { name: 'Spin Silk', block: 10 } },
    ai: (h) => (h.turn === 0 ? 'web' : h.last() === 'fang' ? (h.chance(0.5) ? 'spin' : 'web') : 'fang') },
  rotHound: { name: 'Rot Hound', hp: [42, 46], sprite: ':wolf:', scale: 1.05,
    moves: { bite: { name: 'Bite', dmg: 10 }, howl: { name: 'Howl', buffAll: { might: 1 } }, maul: { name: 'Maul', dmg: 5, hits: 2 } },
    ai: (h) => (h.turn === 0 && h.chance(0.5) ? 'howl' : h.lastTwo('bite') ? 'maul' : h.last() === 'howl' ? 'bite' : weighted([['bite', 50], ['maul', 35], ['howl', 15]])) },
  lichenKnight: { name: 'Lichen Knight', hp: [54, 58], sprite: ':fencer:', scale: 1.15,
    moves: { bash: { name: 'Shield Bash', dmg: 8, block: 8 }, thrust: { name: 'Thrust', dmg: 14 }, fortify: { name: 'Fortify', block: 14 } },
    ai: (h) => (h.last() === 'fortify' ? 'thrust' : h.lastTwo('bash') ? 'thrust' : weighted([['bash', 45], ['thrust', 35], ['fortify', 20]])) },
  bloomCaller: { name: 'Bloom Caller', hp: [38, 42], sprite: ':rose:', scale: 1.0,
    moves: { thorns: { name: 'Thorn Skin', buff: { spines: 3 } }, vines: { name: 'Vine Lash', dmg: 9 }, pollen: { name: 'Burning Pollen', debuff: { burn: 3 } } },
    ai: (h) => (h.turn === 0 ? 'thorns' : h.last() === 'vines' ? 'pollen' : 'vines') },
  // --- Act 2 elites ---
  sporeQueen: { name: 'The Spore Queen', hp: [140, 148], sprite: ':butterfly:', scale: 1.5, elite: true,
    moves: {
      brood: { name: 'Call the Brood', summon: { id: 'sporeBat', n: 2, max: 2, hp: [12, 14] } },
      devour: { name: 'Devour', dmg: 16 },
      storm: { name: 'Dust Storm', dmg: 5, hits: 3 },
      cocoon: { name: 'Cocoon', block: 15, buff: { mending: 4 } },
    },
    ai: (h) => {
      if (h.turn === 0) return 'brood';
      const cycle = ['devour', 'storm', 'cocoon'];
      return cycle[(h.e.cycle = (h.e.cycle ?? -1) + 1) % cycle.length];
    } },
  hydra: { name: 'Mycelial Hydra', hp: [128, 134], sprite: ':dragon:', scale: 1.55, elite: true,
    moves: { bites: { name: 'Three Heads Bite', dmg: 5, hits: 3 }, regrow: { name: 'Regrow', block: 8, buff: { mending: 5 } }, roar: { name: 'Roar', buff: { might: 3 } } },
    ai: (h) => (h.turn === 0 ? 'roar' : h.last() === 'bites' ? (h.turn % 5 === 0 ? 'roar' : 'regrow') : 'bites') },
  // --- Act 2 boss ---
  elderOak: { name: 'The Elder Oak', title: 'Heart of the Mycelium', hp: [330, 330], sprite: ':herb:', scale: 2.0, boss: true,
    moves: {
      bloom: { name: 'Spore Bloom', block: 15, summon: { id: 'sporeling', n: 2, max: 3 } },
      roots: { name: 'Root Grasp', dmg: 10, debuff: { sapped: 2 } },
      branch: { name: 'Falling Branch', dmg: 28 },
      wither: { name: 'Withering Rage', buff: { might: 3 }, intent: 'buff', fn: (c, e) => { e.raged = true; } },
    },
    ai: (h) => {
      if (!h.e.raged && h.e.hp <= h.e.maxHp / 2) return 'wither';
      const cycle = ['bloom', 'roots', 'branch', 'roots'];
      return cycle[(h.e.cycle = (h.e.cycle ?? -1) + 1) % cycle.length];
    } },
  // --- Act 2 "?" room foes ---
  infectedExplorer: { name: 'Infected Explorer', hp: [38, 42], sprite: ':zombie:', scale: 1.05,
    moves: { pickaxe: { name: 'Pickaxe', dmg: 9 }, cough: { name: 'Spore Cough', dmg: 4, cards: [{ id: 'gloom', n: 1, pile: 'draw' }] }, delirium: { name: 'Delirium', buff: { might: 2 } } },
    ai: (h) => (h.turn === 0 ? 'cough' : h.last() === 'pickaxe' ? (h.chance(0.4) ? 'delirium' : 'cough') : 'pickaxe') },

  // ================= ACT 3: THE LIGHTLESS ABYSS =================
  abyssalMaw: { name: 'Abyssal Maw', hp: [54, 60], sprite: ':devil:', scale: 1.15,
    moves: { devour: { name: 'Devour', dmg: 13 }, gnash: { name: 'Gnash', dmg: 5, hits: 2 }, gape: { name: 'Gape', block: 10, buff: { might: 1 } } },
    ai: (h) => (h.lastTwo('devour') ? 'gape' : weighted([['devour', 45], ['gnash', 35], ['gape', 20]])) },
  nightWeaver: { name: 'Night Weaver', hp: [46, 50], sprite: ':cricket:', scale: 1.1,
    moves: { web: { name: 'Night Web', debuff: { exposed: 1 }, cards: [{ id: 'gloom', n: 1, pile: 'draw' }] }, fang: { name: 'Venom Fang', dmg: 12 }, lurk: { name: 'Lurk', block: 12 } },
    ai: (h) => (h.turn === 0 ? 'web' : h.last() === 'fang' ? (h.chance(0.5) ? 'lurk' : 'web') : 'fang') },
  hollowPilgrim: { name: 'Hollow Pilgrim', hp: [52, 58], sprite: ':silhouette:', scale: 1.1,
    moves: { prayer: { name: 'Dark Prayer', buffAll: { might: 2 } }, staff: { name: 'Staff Strike', dmg: 11 }, penance: { name: 'Penance', dmg: 6, debuff: { sapped: 1 } } },
    ai: (h) => (h.turn === 0 ? 'prayer' : h.last() === 'prayer' ? 'staff' : weighted([['staff', 45], ['penance', 35], ['prayer', 20]])) },
  starEater: { name: 'Star Eater', hp: [44, 48], sprite: ':ghost:', scale: 1.05,
    moves: { absorb: { name: 'Absorb Light', block: 12, buff: { mending: 4 } }, sting: { name: 'Sting', dmg: 8, debuff: { exposed: 1 } }, flare: { name: 'Starburst', dmg: 4, hits: 3 } },
    ai: (h) => (h.last() === 'absorb' ? 'flare' : weighted([['sting', 40], ['flare', 35], ['absorb', 25]])) },
  umbralImp: { name: 'Umbral Imp', hp: [26, 30], sprite: ':devil:', scale: 0.85,
    moves: { claw: { name: 'Claw', dmg: 5, hits: 2 }, cackle: { name: 'Cackle', debuff: { sapped: 2 } }, blink: { name: 'Blink', block: 8 } },
    ai: (h) => (h.last() === 'cackle' ? 'claw' : weighted([['claw', 55], ['cackle', 25], ['blink', 20]])) },
  lanternThief: { name: 'Lantern Thief', hp: [38, 42], sprite: ':ghost:', scale: 1.0,
    moves: {
      snuff: { name: 'Snuff the Light', debuff: { sapped: 1 }, cards: [{ id: 'gloom', n: 1, pile: 'draw' }] },
      drain: { name: 'Drain', dmg: 9, fn: (c, e) => c.heal(e, 6) },
      flit: { name: 'Flit', block: 8 },
    },
    ai: (h) => (h.turn === 0 ? 'snuff' : h.last() === 'drain' ? (h.chance(0.5) ? 'flit' : 'snuff') : 'drain') },
  // --- Act 3 elites ---
  voidBehemoth: { name: 'Void Behemoth', hp: [208, 216], sprite: ':ogre:', scale: 1.7, elite: true,
    moves: { roar: { name: 'Roar of the Deep', buff: { might: 2 } }, crush: { name: 'Crush', dmg: 22 }, tremor: { name: 'Tremor', dmg: 8, hits: 2, debuff: { exposed: 1 } } },
    ai: (h) => (h.turn === 0 || h.turn % 4 === 0 ? 'roar' : h.last() === 'crush' ? 'tremor' : 'crush') },
  twinWraith: { name: 'Twin Wraith', hp: [100, 106], sprite: ':ghost:', scale: 1.25, elite: true,
    moves: { rend: { name: 'Rend', dmg: 11 }, wail: { name: 'Wail', debuff: { sapped: 1 }, buff: { might: 1 } }, shriek: { name: 'Twin Shriek', dmg: 4, hits: 3 } },
    onAllyDeath: (c, e, dead) => { if (dead.id === 'twinWraith') { c.apply(e, 'might', 5, e); c.float(e, 'Grieving fury!', 'debuff'); } },
    ai: (h) => (h.turn === 0 ? 'wail' : h.last() === 'rend' ? 'shriek' : h.last() === 'shriek' && h.chance(0.35) ? 'wail' : 'rend') },
  // --- Act 3 boss ---
  namelessKing: { name: 'The Nameless King', title: 'Sovereign of the Void Throne', hp: [460, 460], sprite: ':crown:', scale: 2.0, boss: true,
    moves: {
      guard: { name: 'Royal Guard', block: 18, summon: { id: 'hollowPilgrim', n: 2, max: 2, hp: [30, 34] } },
      decree: { name: 'Dark Decree', debuff: { sapped: 2, exposed: 2 } },
      scepter: { name: 'Scepter Strikes', dmg: 7, hits: 3 },
      execute: { name: 'Execution', dmg: 28 },
      crown: { name: 'Crown of Night', buff: { might: 3 }, intent: 'buff', fn: (c, e) => { e.raged = true; } },
    },
    ai: (h) => {
      if (!h.e.raged && h.e.hp <= h.e.maxHp / 2) return 'crown';
      if (h.turn === 0) return 'guard';
      const cycle = ['decree', 'scepter', 'execute', 'scepter', h.allies().length ? 'execute' : 'guard'];
      return cycle[(h.e.cycle = (h.e.cycle ?? -1) + 1) % cycle.length];
    } },
  // --- Act 3 "?" room foes ---
  mirrorWraith: { name: 'Mirror Wraith', hp: [70, 76], sprite: ':mirror:', scale: 1.2,
    init: (c, e) => { e.statuses.spines = 4; },
    moves: { mimic: { name: 'Mirror Strike', dmg: 12 }, shatter: { name: 'Shatter', dmg: 5, hits: 3 }, reflect: { name: 'Reflect', block: 14, buff: { spines: 2 } } },
    ai: (h) => (h.last() === 'reflect' ? 'mimic' : weighted([['mimic', 40], ['shatter', 35], ['reflect', 25]])) },
});

// ---------- add them to each act's encounters ----------
(function () {
  const add = (act, key, list) => { ACTS[act][key] = (ACTS[act][key] || []).concat(list); };
  // Act I
  add(0, 'easy', [['cryptRat', 'cryptRat'], ['boneArcher'], ['tideCrab']]);
  add(0, 'hard', [['drownedSailor', 'cryptRat'], ['gloomfin', 'cryptRat'], ['tollingBell'], ['drownedSailor', 'boneArcher'], ['tideCrab', 'gloomfin'], ['cryptRat', 'cryptRat', 'cryptRat']]);
  add(0, 'elites', [['drownedCaptain'], ['bogHag']]);
  add(0, 'bosses', [['boneColossus']]);
  add(0, 'mystery', [['graveRobber', 'graveRobber'], ['mimic']]);
  // Act II
  add(1, 'easy', [['sporeBat', 'sporeBat'], ['rotHound'], ['bloomCaller']]);
  add(1, 'hard', [['mossGolem'], ['hyphaeWeaver', 'sporeBat'], ['lichenKnight'], ['rotHound', 'rotHound'], ['bloomCaller', 'lichenKnight'], ['sporeBat', 'sporeBat', 'sporeBat']]);
  add(1, 'elites', [['sporeQueen'], ['hydra']]);
  add(1, 'bosses', [['elderOak']]);
  add(1, 'mystery', [['infectedExplorer', 'infectedExplorer']]);
  // Act III
  add(2, 'easy', [['umbralImp', 'umbralImp'], ['lanternThief'], ['starEater']]);
  add(2, 'hard', [['abyssalMaw'], ['nightWeaver', 'umbralImp'], ['hollowPilgrim', 'hollowPilgrim'], ['abyssalMaw', 'lanternThief'], ['starEater', 'nightWeaver'], ['hollowPilgrim', 'umbralImp', 'umbralImp']]);
  add(2, 'elites', [['voidBehemoth'], ['twinWraith', 'twinWraith']]);
  add(2, 'bosses', [['namelessKing']]);
  add(2, 'mystery', [['mirrorWraith']]);
})();

// Every enemy that can appear in an act (encounters, "?" rooms and summoned minions).
function actEnemyIds(ai) {
  const act = ACTS[ai];
  const ids = new Set([...act.easy, ...act.hard, ...act.elites, ...act.bosses, ...(act.mystery || [])].flat());
  for (const id of [...ids]) for (const m of Object.values(ENEMIES[id].moves)) if (m.summon) ids.add(m.summon.id);
  return [...ids];
}

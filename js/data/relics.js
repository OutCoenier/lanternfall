// ===== Curios (relics) =====
// Hooks: onPickup(run, r), onCombatStart(ctx, r), onTurnStart(ctx, r), onTurnEnd(ctx, r),
//        onCardPlayed(ctx, r, card), onEnemyDeath(ctx, r, enemy), onCombatEnd(run, r, ctx)
// Flags: energy (+max energy), noGold, noRest
'use strict';

const RELICS = {
  // ---- Starter ----
  wick: { name: 'Ever-Burning Wick', icon: '🕯️', rarity: 'starter', char: 'lampwright',
    desc: 'At the end of each combat, heal 6 HP.',
    onCombatEnd(run) { healRun(6); } },

  moonCharm: { name: 'Moonstone Charm', icon: '🌙', rarity: 'starter', char: 'moonblade',
    desc: 'At the start of each combat, add 2 Moon Shards to your hand.',
    onCombatStart(c) { c.addCard('moonShard', 'hand', 2); } },

  satchel: { name: "Brewer's Satchel", icon: '👜', rarity: 'starter', char: 'alchemist',
    desc: 'At the start of each elite and boss combat, brew a random Tonic (if you have an empty slot).',
    onCombatStart(c) { if (c.kind !== 'fight') c.brew(1); } },

  // ---- Common ----
  compass: { name: 'Rusty Compass', icon: '🧭', rarity: 'common', unlock: 2, desc: 'Upon pickup, upgrade 2 random cards.',
    onPickup() { const n = upgradeRandomCards(2); if (n.length) toast(`Upgraded ${n.join(' and ')}.`); } },
  snailShell: { name: 'Snail Shell', icon: '🐚', rarity: 'common', unlock: 2, desc: 'At the end of your turn, if you have no Ward, gain 4 Ward.',
    onTurnEnd(c) { if (!c.player.block) c.gainBlock(c.player, 4, false); } },
  ironKettle: { name: 'Iron Kettle', icon: '🫖', rarity: 'common', unlock: 6, desc: 'At the start of each combat, brew a random Tonic (if you have an empty slot).',
    onCombatStart(c) { c.brew(1); } },
  whetstone: { name: 'Silver Whetstone', icon: '🪨', rarity: 'common', char: 'moonblade', desc: 'Moon Shards deal 1 additional damage.',
    onCombatStart(c) { c.selfApply('honed', 1); } },
  gauntlet: { name: 'Rusted Gauntlet', icon: '🧤', rarity: 'common', desc: 'Start each combat with 1 Might.',
    onCombatStart(c) { c.selfApply('might', 1); } },
  smoothStone: { name: 'River Stone', icon: '🥌', rarity: 'common', desc: 'Start each combat with 1 Fortitude.',
    onCombatStart(c) { c.selfApply('fortitude', 1); } },
  flint: { name: 'Flint & Steel', icon: '🔩', rarity: 'common', desc: 'At the start of each combat, apply 2 Burn to ALL enemies.',
    onCombatStart(c) { c.applyAll('burn', 2); } },
  tallow: { name: 'Tallow Candle', icon: '🪔', rarity: 'common', char: 'lampwright', desc: 'Start each combat with 3 Glow.',
    onCombatStart(c) { c.selfApply('glow', 3); } },
  buckler: { name: 'Brass Buckler', icon: '🛡️', rarity: 'common', desc: 'Start each combat with 10 Ward.',
    onCombatStart(c) { c.gainBlock(c.player, 10, false); } },
  stew: { name: 'Hearty Stew', icon: '🍲', rarity: 'common', desc: 'Upon pickup, raise your Max HP by 10.',
    onPickup(run) { run.maxHp += 10; run.hp += 10; } },
  dice: { name: 'Bone Dice', icon: '🎲', rarity: 'common', desc: 'At the start of each combat, draw 2 additional cards.' },
  shard: { name: 'Shard of Dawn', icon: '🔆', rarity: 'common', desc: 'Your first Attack each combat deals 8 additional damage.',
    onCombatStart(c) { c.selfApply('primed', 8); } },
  pillow: { name: 'Feather Pillow', icon: '🪶', rarity: 'common', desc: 'Resting at a Hearth heals an additional 15 HP.' },
  bracelet: { name: 'Thorn Bracelet', icon: '📿', rarity: 'common', desc: 'Start each combat with 3 Spines.',
    onCombatStart(c) { c.selfApply('spines', 3); } },
  spareOil: { name: 'Spare Oil', icon: '🫙', rarity: 'common', desc: 'Gain 1 additional Energy on the first turn of each combat.' },

  // ---- Uncommon ----
  mortar: { name: 'Mortar & Pestle', icon: '🥣', rarity: 'uncommon', char: 'alchemist', desc: 'At the start of each combat, apply 3 Unstable to ALL enemies.',
    onCombatStart(c) { c.applyAll('unstable', 3); } },
  mirrorShard: { name: 'Mirror Shard', icon: '🪞', rarity: 'uncommon', unlock: 2, desc: 'On your first turn of each combat, your first Attack is played twice.',
    onCombatStart(c) { c.selfApply('doubleNext', 1); } },
  bloodstone: { name: 'Bloodstone', icon: '🔻', rarity: 'uncommon', unlock: 5, desc: 'The first time you lose HP each turn, gain 1 Might.' },
  tideCharm: { name: 'Tide Charm', icon: '🌊', rarity: 'uncommon', unlock: 6, desc: 'Whenever you play a Power, heal 3 HP.',
    onCardPlayed(c, r, card) { if (cardDef(card).type === 'power') { c.heal(c.player, 3); c.flashRelic('tideCharm'); } } },
  weaversLoom: { name: "Weaver's Loom", icon: '🧶', rarity: 'uncommon', unlock: 6, desc: 'Whenever you shuffle your draw pile, gain 1 Energy.',
    onShuffle(c) { c.gainEnergy(1); c.flashRelic('weaversLoom'); } },
  wolfFang: { name: 'Wolf Fang', icon: '🦷', rarity: 'uncommon', char: 'moonblade', desc: 'At the start of each combat, apply 3 Bleed to ALL enemies.',
    onCombatStart(c) { c.applyAll('bleed', 3); } },
  mask: { name: 'Bronze Mask', icon: '🎭', rarity: 'uncommon', desc: 'At the start of each combat, apply 1 Sapped to ALL enemies.',
    onCombatStart(c) { c.applyAll('sapped', 1); } },
  sundial: { name: 'Pocket Sundial', icon: '⏳', rarity: 'uncommon', desc: 'Every 3 turns, gain 1 Energy.', counter: 0,
    onTurnStart(c, r) { r.counter = ((r.counter || 0) + 1) % 3; if (r.counter === 0) { c.gainEnergy(1); c.flashRelic('sundial'); } } },
  smithRing: { name: "Smith's Ring", icon: '💍', rarity: 'uncommon', desc: 'Every time you play 3 Attacks in a single turn, gain 1 Might.',
    onCardPlayed(c, r, card) { if (cardDef(card).type === 'attack' && c.turnCounts.attack % 3 === 0) { c.selfApply('might', 1); c.flashRelic('smithRing'); } } },
  mothWing: { name: 'Moth Wing', icon: '🦋', rarity: 'uncommon', desc: 'Every time you play 3 Skills in a single turn, gain 5 Ward.',
    onCardPlayed(c, r, card) { if (cardDef(card).type === 'skill' && c.turnCounts.skill % 3 === 0) { c.gainBlock(c.player, 5, false); c.flashRelic('mothWing'); } } },
  tollBell: { name: 'Toll Bell', icon: '🔕', rarity: 'uncommon', desc: 'Whenever an enemy dies, gain 1 Energy and draw 1 card.',
    async onEnemyDeath(c) { if (c.phase === 'player') { c.gainEnergy(1); await c.drawCards(1); c.flashRelic('tollBell'); } } },
  lens: { name: 'Glass Lens', icon: '🔍', rarity: 'uncommon', desc: 'Enemies that are Exposed take 75% more damage instead of 50%.' },
  bread: { name: 'Hearth Bread', icon: '🍞', rarity: 'uncommon', desc: 'At the end of combat, if your HP is at or below 50%, heal 12 HP.',
    onCombatEnd(run) { if (run.hp <= run.maxHp / 2) healRun(12); } },
  token: { name: "Merchant's Token", icon: '🪙', rarity: 'uncommon', desc: 'Everything at the Peddler is 20% cheaper.' },
  bandolier: { name: 'Tonic Bandolier', icon: '🎒', rarity: 'uncommon', desc: 'Gain 2 additional Tonic slots.',
    onPickup(run) { run.potions.push(null, null); } },
  owl: { name: 'Owl Quill', icon: '🦉', rarity: 'uncommon', desc: 'Card rewards offer 1 additional choice.' },

  // ---- Rare ----
  beaker: { name: 'Bottomless Beaker', icon: '🧫', rarity: 'rare', char: 'alchemist', desc: 'Explosions deal 10 additional damage.',
    onCombatStart(c) { c.selfApply('catalysis', 10); } },
  quill: { name: 'Gilded Quill', icon: '🪶', rarity: 'rare', unlock: 5, desc: 'Card rewards are twice as likely to contain Rare cards.' },
  shadowCloak: { name: 'Shadow Cloak', icon: '🧥', rarity: 'rare', char: 'moonblade', desc: 'Start each combat with 2 Evade.',
    onCombatStart(c) { c.selfApply('evade', 2); } },
  phoenix: { name: 'Phoenix Feather', icon: '🌅', rarity: 'rare', desc: 'When you would die, heal to 50% of your Max HP instead. Works once.' },
  key: { name: "Keeper's Key", icon: '🗝️', rarity: 'rare', char: 'lampwright', desc: 'At the start of your turn, gain 1 Glow.',
    onTurnStart(c) { c.selfApply('glow', 1); } },
  emberCore: { name: 'Ember Core', icon: '❤️‍🔥', rarity: 'rare', char: 'lampwright', desc: 'Whenever you apply Burn, apply 1 additional Burn.' },
  hourglass: { name: 'Sand of Ages', icon: '⌛', rarity: 'rare', desc: 'At the start of turns 2 and 3 of each combat, draw 2 additional cards.' },
  idol: { name: 'Gilded Idol', icon: '🏺', rarity: 'rare', desc: 'Enemies drop 50% more gold.' },

  // ---- Boss ----
  crown: { name: 'Ember Crown', icon: '👑', rarity: 'boss', energy: 1, noRest: true,
    desc: 'Gain 1 additional Energy each turn. You can no longer rest at Hearths.' },
  hollow: { name: 'Hollow Lantern', icon: '🏮', rarity: 'boss', energy: 1, noGold: true,
    desc: 'Gain 1 additional Energy each turn. You can no longer gain gold.' },
  sigil: { name: 'Burning Sigil', icon: '🔯', rarity: 'boss', energy: 1,
    desc: 'Gain 1 additional Energy each turn. Enemies start each combat with 1 Might.',
    onCombatStart(c) { for (const e of c.alive()) c.apply(e, 'might', 1, e); } },
  ashHeart: { name: 'Heart of Ash', icon: '🖤', rarity: 'boss', energy: 1,
    desc: 'Gain 1 additional Energy each turn. At the start of each combat, shuffle 3 Ash into your draw pile.',
    onCombatStart(c) { c.addCard('ash', 'draw', 3); } },
  eyes: { name: 'Many-Eyed Lens', icon: '🧿', rarity: 'boss', desc: 'Draw 1 additional card each turn.' },
};

function hasRelic(id) { return !!(Game.run && Game.run.relics.some((r) => r.id === id)); }
function relicPool(rarity) {
  const owned = new Set(Game.run.relics.map((r) => r.id));
  return Object.keys(RELICS).filter((k) => RELICS[k].rarity === rarity && !owned.has(k) && forChar(RELICS[k]) && isUnlocked(RELICS[k]));
}
function randomRelic(rarityWeights = [['common', 50], ['uncommon', 33], ['rare', 17]]) {
  for (let tries = 0; tries < 10; tries++) {
    const pool = relicPool(weighted(rarityWeights));
    if (pool.length) return pick(pool);
  }
  const any = ['common', 'uncommon', 'rare'].flatMap(relicPool);
  return any.length ? pick(any) : null;
}
function healRun(n) {
  const run = Game.run;
  const before = run.hp;
  run.hp = Math.min(run.maxHp, run.hp + n);
  if (run.hp > before) Sound.play('heal');
}

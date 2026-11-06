// ===== Tonics (potions) =====
'use strict';

const POTIONS = {
  fire:     { name: 'Fire Tonic', icon: '🧪', hue: 0, rarity: 'common', target: 'enemy', desc: 'Deal 20 damage to an enemy.',
              use: (c, t) => c.damage(t, 20, c.player, 'potion') },
  blast:    { name: 'Blast Powder', icon: '💣', hue: 0, rarity: 'common', desc: 'Deal 10 damage to ALL enemies.',
              use: async (c) => { for (const e of c.alive()) await c.damage(e, 10, c.player, 'potion'); } },
  ward:     { name: 'Ward Draught', icon: '🧪', hue: 180, rarity: 'common', desc: 'Gain 12 Ward.',
              use: (c) => c.gainBlock(c.player, 12, false) },
  might:    { name: 'Might Elixir', icon: '🍷', hue: 0, rarity: 'common', desc: 'Gain 2 Might.',
              use: (c) => c.selfApply('might', 2) },
  swift:    { name: 'Swift Brew', icon: '🧪', hue: 90, rarity: 'common', desc: 'Draw 3 cards.',
              use: (c) => c.drawCards(3) },
  energy:   { name: 'Energy Tonic', icon: '⚗️', hue: 40, rarity: 'common', desc: 'Gain 2 Energy.',
              use: (c) => c.gainEnergy(2) },
  oil:      { name: 'Oil Flask', icon: '🫗', hue: 0, rarity: 'common', target: 'enemy', desc: 'Apply 7 Burn to an enemy.',
              use: (c, t) => c.apply(t, 'burn', 7) },
  sapping:  { name: 'Sapping Mist', icon: '🥀', hue: 0, rarity: 'common', target: 'enemy', desc: 'Apply 3 Sapped to an enemy.',
              use: (c, t) => c.apply(t, 'sapped', 3) },
  exposing: { name: 'Exposing Dust', icon: '🧂', hue: 0, rarity: 'common', target: 'enemy', desc: 'Apply 3 Exposed to an enemy.',
              use: (c, t) => c.apply(t, 'exposed', 3) },
  salve:    { name: 'Healing Salve', icon: '🍯', hue: 0, rarity: 'uncommon', outside: true, desc: 'Heal 25% of your Max HP. Can be used outside combat.',
              use: (c) => { const n = Math.floor(Game.run.maxHp * 0.25); if (c) c.heal(c.player, n); else healRun(n); } },
  essence:  { name: 'Glow Essence', icon: '🫧', hue: 0, rarity: 'uncommon', char: 'lampwright', desc: 'Gain 5 Glow.',
              use: (c) => c.selfApply('glow', 5) },
  shards:   { name: 'Vial of Shards', icon: '🧪', hue: 200, rarity: 'common', char: 'moonblade', desc: 'Add 3 Moon Shards to your hand.',
              use: (c) => c.addCard('moonShard', 'hand', 3) },
  leech:    { name: 'Leech Oil', icon: '🩸', hue: 0, rarity: 'common', char: 'moonblade', target: 'enemy', desc: 'Apply 7 Bleed to an enemy.',
              use: (c, t) => c.apply(t, 'bleed', 7) },
  smoke:    { name: 'Smoke Bomb', icon: '💨', hue: 0, rarity: 'uncommon', char: 'moonblade', desc: 'Gain 2 Evade.',
              use: (c) => c.selfApply('evade', 2) },
  volatile: { name: 'Volatile Tonic', icon: '🧪', hue: 90, rarity: 'common', char: 'alchemist', target: 'enemy', desc: 'Apply 8 Unstable to an enemy.',
              use: (c, t) => c.apply(t, 'unstable', 8) },
  fortitude:{ name: 'Liquid Fortitude', icon: '🧪', hue: 260, rarity: 'uncommon', desc: 'Gain 2 Fortitude.',
              use: (c) => c.selfApply('fortitude', 2) },
};

function randomPotion() {
  const ids = Object.keys(POTIONS).filter((k) => forChar(POTIONS[k]));
  return weighted(ids.map((k) => [k, POTIONS[k].rarity === 'common' ? 3 : 1.5]));
}

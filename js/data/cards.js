// ===== Cards =====
// Each card:
//   name, type ('attack'|'skill'|'power'|'status'|'curse'), rarity ('starter'|'common'|'uncommon'|'rare'|'special')
//   cost (number, 'X', or -1 for unplayable), upCost (cost when upgraded, optional)
//   target: 'enemy' if you must pick an enemy, otherwise omitted
//   v: values used in the description, up: values that change when upgraded
//   desc: text. {d...} = damage (shows Might etc.), {b...} = Ward, anything else = plain number
//   exhaust / ethereal / innate (+ upExhaust etc. to change them on upgrade)
//   play(ctx, v, target, card): what the card does
//
// Want to add your own card? Copy one below, give it a new id and tweak it!
'use strict';

const CARDS = {
  // ================= STARTER =================
  strike: { name: 'Ember Strike', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy', icon: ':dagger:',
    v: { d: 6 }, up: { d: 9 }, desc: 'Deal {d} damage.',
    play: (c, v, t) => c.attack(t, v.d) },
  defend: { name: 'Lantern Guard', type: 'skill', rarity: 'starter', cost: 1, icon: ':shield:',
    v: { b: 5 }, up: { b: 8 }, desc: 'Gain {b} Ward.',
    play: (c, v) => c.ward(v.b) },
  flare: { name: 'Flare', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy', icon: ':burst:',
    v: { d: 7, n: 2 }, up: { d: 9, n: 3 }, desc: 'Deal {d} damage. Apply {n} Burn.',
    play: async (c, v, t) => { await c.attack(t, v.d); c.apply(t, 'burn', v.n); } },

  // ================= COMMON =================
  searingSlash: { name: 'Searing Slash', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':swords:',
    v: { d: 8, m: 4 }, up: { d: 10, m: 6 }, desc: 'Deal {d} damage. Deals {m} more if the target is Burning.',
    play: (c, v, t) => c.attack(t, v.d + (t.statuses.burn ? v.m : 0)) },
  cinderToss: { name: 'Cinder Toss', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':shootingStar:',
    v: { d: 4, n: 3 }, up: { d: 5, n: 5 }, desc: 'Deal {d} damage. Apply {n} Burn.',
    play: async (c, v, t) => { await c.attack(t, v.d); c.apply(t, 'burn', v.n); } },
  twinSparks: { name: 'Twin Sparks', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':sparkles:',
    v: { d: 5 }, up: { d: 7 }, desc: 'Deal {d} damage twice.',
    play: (c, v, t) => c.attack(t, v.d, 2) },
  lampBash: { name: 'Lamp Bash', type: 'attack', rarity: 'common', cost: 2, target: 'enemy', icon: ':lantern:',
    v: { d: 11, n: 2 }, up: { d: 14, n: 3 }, desc: 'Deal {d} damage. Apply {n} Exposed.',
    play: async (c, v, t) => { await c.attack(t, v.d); c.apply(t, 'exposed', v.n); } },
  sweepingFlame: { name: 'Sweeping Flame', type: 'attack', rarity: 'common', cost: 1, icon: ':wave:',
    v: { d: 7 }, up: { d: 10 }, desc: 'Deal {d} damage to ALL enemies.',
    play: (c, v) => c.attackAll(v.d) },
  gleam: { name: 'Gleam', type: 'skill', rarity: 'common', cost: 0, icon: ':bulb:',
    v: { n: 2 }, up: { n: 3 }, desc: 'Gain {n} Glow. Draw 1 card.',
    play: async (c, v) => { c.selfApply('glow', v.n); await c.drawCards(1); } },
  wickerShield: { name: 'Wicker Shield', type: 'skill', rarity: 'common', cost: 1, icon: ':basket:',
    v: { b: 7, n: 1 }, up: { b: 10, n: 1 }, desc: 'Gain {b} Ward. Gain {n} Glow.',
    play: async (c, v) => { await c.ward(v.b); c.selfApply('glow', v.n); } },
  smokeScreen: { name: 'Smoke Screen', type: 'skill', rarity: 'common', cost: 1, target: 'enemy', icon: ':wind:',
    v: { b: 6, n: 1 }, up: { b: 8, n: 2 }, desc: 'Gain {b} Ward. Apply {n} Sapped.',
    play: async (c, v, t) => { await c.ward(v.b); c.apply(t, 'sapped', v.n); } },
  brightIdea: { name: 'Bright Idea', type: 'skill', rarity: 'common', cost: 1, icon: ':scroll:',
    v: { n: 2 }, up: { n: 3 }, desc: 'Draw {n} cards.',
    play: (c, v) => c.drawCards(v.n) },
  emberJab: { name: 'Ember Jab', type: 'attack', rarity: 'common', cost: 0, target: 'enemy', icon: ':diamondSmall:',
    v: { d: 3, n: 1 }, up: { d: 5, n: 1 }, desc: 'Deal {d} damage. Gain {n} Glow.',
    play: async (c, v, t) => { await c.attack(t, v.d); c.selfApply('glow', v.n); } },
  oilSplash: { name: 'Oil Splash', type: 'skill', rarity: 'common', cost: 1, icon: ':drum:',
    v: { n: 3 }, up: { n: 5 }, desc: 'Apply {n} Burn to ALL enemies.',
    play: (c, v) => c.applyAll('burn', v.n) },
  shiningBeam: { name: 'Shining Beam', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':torch:',
    v: { d: 5, m: 3 }, up: { d: 6, m: 4 }, desc: 'Deal {d} damage. Deals {m} more for each Glow you have.',
    play: (c, v, t) => c.attack(t, v.d + v.m * c.glow()) },
  anvilBlow: { name: 'Anvil Blow', type: 'attack', rarity: 'common', cost: 2, target: 'enemy', icon: ':hammer:',
    v: { d: 17 }, up: { d: 23 }, desc: 'Deal {d} damage.',
    play: (c, v, t) => c.attack(t, v.d) },
  quickStep: { name: 'Quick Step', type: 'skill', rarity: 'common', cost: 0, icon: ':footprints:',
    v: { b: 3 }, up: { b: 5 }, desc: 'Gain {b} Ward. Draw 1 card.',
    play: async (c, v) => { await c.ward(v.b); await c.drawCards(1); } },
  counterflame: { name: 'Counterflame', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':fencer:',
    v: { d: 6, b: 5 }, up: { d: 8, b: 7 }, desc: 'Deal {d} damage. Gain {b} Ward.',
    play: async (c, v, t) => { await c.attack(t, v.d); await c.ward(v.b); } },
  sparkShower: { name: 'Spark Shower', type: 'attack', rarity: 'common', cost: 1, icon: ':burst:',
    v: { d: 3, n: 3 }, up: { d: 3, n: 4 }, desc: 'Deal {d} damage to a random enemy {n} times.',
    play: (c, v) => c.attackRandom(v.d, v.n) },
  rekindle: { name: 'Rekindle', type: 'skill', rarity: 'common', cost: 1, upCost: 0, icon: ':recycle:',
    v: {}, desc: 'Put a card from your discard pile into your hand.',
    play: async (c) => {
      const card = await c.choosePile('discard', 'Choose a card to return to your hand');
      if (card) c.moveToHand(card, 'discard');
    } },
  ashenVeil: { name: 'Ashen Veil', type: 'skill', rarity: 'common', cost: 1, icon: ':volcano:',
    v: { b: 5, n: 2 }, up: { b: 7, n: 3 }, desc: 'Gain {b} Ward. Apply {n} Burn to ALL enemies.',
    play: async (c, v) => { await c.ward(v.b); c.applyAll('burn', v.n); } },
  lanternSwing: { name: 'Lantern Swing', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':oilLamp:',
    v: { d: 7 }, up: { d: 10 }, desc: 'Deal {d} damage. If you have 3 or more Glow, hit twice.',
    play: (c, v, t) => c.attack(t, v.d, c.glow() >= 3 ? 2 : 1) },

  // ================= UNCOMMON =================
  infernoLash: { name: 'Inferno Lash', type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy', icon: ':tornado:',
    v: { d: 10 }, up: { d: 14 }, desc: "Deal {d} damage. Double the target's Burn.",
    play: async (c, v, t) => { await c.attack(t, v.d); if (!t.dead && t.statuses.burn) t.statuses.burn *= 2; c.render(); } },
  lightBarrage: { name: 'Light Barrage', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy', icon: ':star:',
    v: { d: 5 }, up: { d: 7 }, desc: 'Spend all Glow. Deal {d} damage once for each Glow spent.',
    play: async (c, v, t) => { const g = c.spendGlow(); if (g > 0) await c.attack(t, v.d, g); } },
  glowBarrier: { name: 'Glow Barrier', type: 'skill', rarity: 'uncommon', cost: 1, icon: ':crystalBall:',
    v: { b: 5 }, up: { b: 6 }, desc: 'Spend all Glow. Gain {b} Ward for each Glow spent.',
    play: async (c, v) => { const g = c.spendGlow(); if (g > 0) await c.ward(v.b * g); } },
  everStoked: { name: 'Ever-Stoked', type: 'power', rarity: 'uncommon', cost: 0, icon: ':lantern:',
    v: { n: 1 }, up: { n: 2 }, desc: 'At the start of your turn, gain {n} Glow.',
    play: (c, v) => c.selfApply('everStoked', v.n) },
  pyromancy: { name: 'Pyromancy', type: 'power', rarity: 'uncommon', cost: 1, upCost: 0, icon: ':mage:',
    v: { n: 1 }, desc: 'Whenever you apply Burn, apply {n} more.',
    play: (c, v) => c.selfApply('pyromancy', v.n) },
  bastion: { name: 'Bastion', type: 'power', rarity: 'uncommon', cost: 2, icon: ':castle:',
    v: { n: 4 }, up: { n: 6 }, desc: 'At the end of your turn, gain {n} Ward.',
    play: (c, v) => c.selfApply('bastion', v.n) },
  fannedFlames: { name: 'Fanned Flames', type: 'power', rarity: 'uncommon', cost: 1, icon: ':wind:',
    v: { n: 2 }, up: { n: 3 }, desc: 'Gain {n} Might.',
    play: (c, v) => c.selfApply('might', v.n) },
  emberStorm: { name: 'Ember Storm', type: 'attack', rarity: 'uncommon', cost: 'X', icon: ':swirl:',
    v: { d: 5 }, up: { d: 8 }, desc: 'Deal {d} damage to ALL enemies X times.',
    play: async (c, v) => { for (let i = 0; i < v.x && !c.over; i++) await c.attackAll(v.d); } },
  blindingFlash: { name: 'Blinding Flash', type: 'skill', rarity: 'uncommon', cost: 1, exhaust: true, icon: ':burst:',
    v: { n: 2 }, up: { n: 3 }, desc: 'Apply {n} Sapped and {n} Exposed to ALL enemies.',
    play: (c, v) => { c.applyAll('sapped', v.n); c.applyAll('exposed', v.n); } },
  bankFire: { name: 'Bank the Fire', type: 'skill', rarity: 'uncommon', cost: 1, icon: ':bolt:',
    v: { b: 4, n: 2 }, up: { b: 7, n: 2 }, desc: 'Gain {b} Ward. Next turn, gain {n} Energy.',
    play: async (c, v) => { await c.ward(v.b); c.selfApply('nextEnergy', v.n); } },
  kindledBurst: { name: 'Kindled Burst', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy', icon: ':burst:',
    v: { m: 4 }, up: { m: 5 }, desc: "Deal damage equal to {m}× the target's Burn. Remove its Burn.",
    play: async (c, v, t) => { const b = t.statuses.burn || 0; delete t.statuses.burn; await c.attack(t, b * v.m); } },
  thornedCage: { name: 'Thorned Cage', type: 'power', rarity: 'uncommon', cost: 1, icon: ':cactus:',
    v: { n: 3 }, up: { n: 5 }, desc: 'Gain {n} Spines.',
    play: (c, v) => c.selfApply('spines', v.n) },
  flickerWard: { name: 'Flicker Ward', type: 'power', rarity: 'uncommon', cost: 1, icon: ':sparkles:',
    v: { n: 3 }, up: { n: 4 }, desc: 'Whenever you gain Ward from a card, deal {n} damage to a random enemy.',
    play: (c, v) => c.selfApply('flicker', v.n) },
  overcharge: { name: 'Overcharge', type: 'skill', rarity: 'uncommon', cost: 0, icon: ':battery:',
    v: { n: 2, m: 2 }, up: { n: 2, m: 1 }, desc: 'Gain {n} Energy. Add {m} Ash to your discard pile.',
    play: (c, v) => { c.gainEnergy(v.n); c.addCard('ash', 'discard', v.m); } },
  twinFlame: { name: 'Twin Flame', type: 'skill', rarity: 'uncommon', cost: 1, upCost: 0, icon: ':twinFlame:',
    v: {}, desc: 'This turn, your next Attack is played twice.',
    play: (c) => c.selfApply('doubleNext', 1) },
  lighthouse: { name: 'Lighthouse', type: 'attack', rarity: 'uncommon', cost: 2, icon: ':lighthouse:',
    v: { d: 8, b: 8 }, up: { d: 11, b: 11 }, desc: 'Deal {d} damage to ALL enemies. Gain {b} Ward.',
    play: async (c, v) => { await c.attackAll(v.d); await c.ward(v.b); } },
  bellows: { name: 'Bellows', type: 'skill', rarity: 'uncommon', cost: 0, icon: ':accordion:',
    v: { n: 3 }, up: { n: 5 }, desc: 'Gain {n} Might this turn.',
    play: (c, v) => { c.selfApply('might', v.n); c.selfApply('fadeMight', v.n); } },
  wardstone: { name: 'Wardstone', type: 'skill', rarity: 'uncommon', cost: 2, icon: ':moai:',
    v: { b: 15, n: 2 }, up: { b: 19, n: 3 }, desc: 'Gain {b} Ward. Gain {n} Glow.',
    play: async (c, v) => { await c.ward(v.b); c.selfApply('glow', v.n); } },
  smolderingHaze: { name: 'Smoldering Haze', type: 'power', rarity: 'uncommon', cost: 1, icon: ':cloud:',
    v: { n: 2 }, up: { n: 3 }, desc: 'At the start of your turn, apply {n} Burn to ALL enemies.',
    play: (c, v) => c.selfApply('smolder', v.n) },
  flashpoint: { name: 'Flashpoint', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy', icon: ':bolt:',
    v: { d: 7 }, up: { d: 10 }, desc: 'Deal {d} damage. If the target is Burning, gain 1 Energy and draw 1 card.',
    play: async (c, v, t) => { const burning = !!t.statuses.burn; await c.attack(t, v.d); if (burning) { c.gainEnergy(1); await c.drawCards(1); } } },
  steadyHands: { name: 'Steady Hands', type: 'power', rarity: 'uncommon', cost: 1, icon: ':hand:',
    v: { n: 2 }, up: { n: 3 }, desc: 'Gain {n} Fortitude.',
    play: (c, v) => c.selfApply('fortitude', v.n) },
  bloodOil: { name: 'Blood Oil', type: 'skill', rarity: 'uncommon', cost: 0, icon: ':bloodDrop:',
    v: { n: 3, m: 2 }, up: { n: 1, m: 2 }, desc: 'Lose {n} HP. Gain {m} Energy.',
    play: async (c, v) => { await c.damage(c.player, v.n, null, 'hploss'); c.gainEnergy(v.m); } },
  searingGaze: { name: 'Searing Gaze', type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy', icon: ':eye:',
    v: { n: 3 }, up: { n: 4 }, desc: 'Apply {n} Exposed. Draw 1 card.',
    play: async (c, v, t) => { c.apply(t, 'exposed', v.n); await c.drawCards(1); } },
  temperedEdge: { name: 'Tempered Edge', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy', icon: ':dagger:',
    v: { d: 6, n: 1 }, up: { d: 9, n: 1 }, desc: 'Deal {d} damage. Gain {n} Might.',
    play: async (c, v, t) => { await c.attack(t, v.d); c.selfApply('might', v.n); } },

  // ================= RARE =================
  supernova: { name: 'Supernova', type: 'attack', rarity: 'rare', cost: 3, exhaust: true, icon: ':sun:',
    v: { d: 10, m: 5 }, up: { d: 14, m: 6 }, desc: 'Spend all Glow. Deal {d} damage, plus {m} for each Glow spent, to ALL enemies.',
    play: async (c, v) => { const g = c.spendGlow(); await c.attackAll(v.d + v.m * g); } },
  eternalFlame: { name: 'Eternal Flame', type: 'power', rarity: 'rare', cost: 3, icon: ':flame:',
    v: { n: 2 }, up: { n: 3 }, desc: 'At the start of your turn, gain {n} Might.',
    play: (c, v) => c.selfApply('eternalFlame', v.n) },
  lanternShell: { name: 'Lantern Shell', type: 'power', rarity: 'rare', cost: 2, upCost: 1, icon: ':lock:',
    v: { b: 8 }, up: { b: 8 }, desc: 'Gain {b} Ward. Your Ward is no longer removed at the start of your turn.',
    play: async (c, v) => { await c.ward(v.b); c.selfApply('lanternShell', 1); } },
  corona: { name: 'Corona', type: 'power', rarity: 'rare', cost: 2, upCost: 1, icon: ':sun:',
    v: { n: 3 }, up: { n: 3 }, desc: 'Gain {n} Glow. At the end of your turn, deal damage equal to your Glow to ALL enemies.',
    play: (c, v) => { c.selfApply('glow', v.n); c.selfApply('corona', 1); } },
  eclipse: { name: 'Eclipse', type: 'skill', rarity: 'rare', cost: 2, upCost: 1, icon: ':moon:',
    v: {}, desc: 'Double your Ward.',
    play: (c) => { c.gainBlock(c.player, c.player.block, false); } },
  echoingToll: { name: 'Echoing Toll', type: 'power', rarity: 'rare', cost: 3, upCost: 2, icon: ':bell:',
    v: {}, desc: 'The first Attack you play each turn is played twice.',
    play: (c) => c.selfApply('echoingToll', 1) },
  sunfall: { name: 'Sunfall', type: 'attack', rarity: 'rare', cost: 3, target: 'enemy', icon: ':sunrise:',
    v: { d: 32 }, up: { d: 42 }, desc: 'Deal {d} damage.',
    play: (c, v, t) => c.attack(t, v.d) },
  conflagration: { name: 'Conflagration', type: 'skill', rarity: 'rare', cost: 1, exhaust: true, upExhaust: false, icon: ':flame:',
    v: {}, desc: 'Double the Burn of ALL enemies.',
    play: (c) => { for (const e of c.alive()) if (e.statuses.burn) e.statuses.burn *= 2; c.render(); } },
  ignition: { name: 'Ignition', type: 'skill', rarity: 'rare', cost: 0, exhaust: true, icon: ':firecracker:',
    v: { n: 2 }, up: { n: 3 }, desc: 'Gain {n} Energy. Draw 2 cards.',
    play: async (c, v) => { c.gainEnergy(v.n); await c.drawCards(2); } },
  wellspring: { name: 'Wellspring', type: 'power', rarity: 'rare', cost: 1, upCost: 0, icon: ':fountain:',
    v: {}, desc: 'Draw 1 additional card each turn.',
    play: (c) => c.selfApply('wellspring', 1) },
  endlessOil: { name: 'Endless Oil', type: 'power', rarity: 'rare', cost: 3, upCost: 2, icon: ':fuel:',
    v: {}, desc: 'Gain 1 additional Energy each turn.',
    play: (c) => c.selfApply('endlessOil', 1) },
  phoenixRite: { name: 'Phoenix Rite', type: 'attack', rarity: 'rare', cost: 2, exhaust: true, icon: ':wing:',
    v: { d: 4 }, up: { d: 6 }, desc: 'Deal {d} damage to ALL enemies. Heal HP equal to the unblocked damage dealt.',
    play: async (c, v) => { const dealt = await c.attackAll(v.d); c.heal(c.player, dealt); } },

  // ================= STATUS & CURSE =================
  ash:   { name: 'Ash', type: 'status', rarity: 'special', cost: -1, ethereal: true, icon: ':urn:',
    v: {}, desc: 'Useless cinders clogging your hand.' },
  muck:  { name: 'Muck', type: 'status', rarity: 'special', cost: 1, exhaust: true, icon: ':orbBrown:',
    v: {}, desc: 'Sticky brine. Pay to scrape it off.', play: () => {} },
  slag:  { name: 'Slag', type: 'status', rarity: 'special', cost: -1, icon: ':rock:',
    v: {}, desc: 'At the end of your turn, if this is in your hand, take 3 damage.',
    async onEndTurnInHand(c) { await c.damage(c.player, 3, null, 'hploss'); } },
  gloom: { name: 'Gloom', type: 'status', rarity: 'special', cost: -1, ethereal: true, icon: ':newMoon:',
    v: {}, desc: 'When drawn, lose 1 Energy.',
    onDraw(c) { c.energy = Math.max(0, c.energy - 1); } },
  dread: { name: 'Dread', type: 'curse', rarity: 'special', cost: -1, icon: ':scream:',
    v: {}, desc: 'A creeping fear that will not leave.' },
  rot:   { name: 'Rot', type: 'curse', rarity: 'special', cost: -1, icon: ':microbe:',
    v: {}, desc: 'At the end of your turn, if this is in your hand, lose 2 HP.',
    async onEndTurnInHand(c) { await c.damage(c.player, 2, null, 'hploss'); } },
};

// Everything above belongs to the Lampwright (status cards and curses are shared).
for (const k of Object.keys(CARDS)) if (CARDS[k].rarity !== 'special') CARDS[k].char = 'lampwright';
// (more cards are added by cards_moonblade.js and cards_alchemist.js)

// ---- Card helpers ----
function cardDef(card) { return CARDS[card.id]; }
function cardVals(card) {
  const d = CARDS[card.id];
  return Object.assign({}, d.v, card.up ? d.up || {} : {});
}
function cardBaseCost(card) {
  const d = CARDS[card.id];
  return card.up && d.upCost != null ? d.upCost : d.cost;
}
function cardFlag(card, flag) {
  const d = CARDS[card.id];
  const upKey = 'up' + flag[0].toUpperCase() + flag.slice(1);
  if (card.up && d[upKey] != null) return d[upKey];
  return !!d[flag];
}
function cardName(card) { return CARDS[card.id].name + (card.up ? '+' : ''); }
function canUpgrade(card) { const d = CARDS[card.id]; return !card.up && d.rarity !== 'special'; }
function makeCard(id, up = false) { return { uid: newUid(), id, up }; }

function cardPool(rarity, charId) {
  return Object.keys(CARDS).filter((k) => CARDS[k].rarity === rarity && forChar(CARDS[k], charId) && isUnlocked(CARDS[k]));
}

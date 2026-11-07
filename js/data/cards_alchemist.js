// ===== The Alchemist's cards (plus unlockable cards for the other heroes) =====
// Same format as cards.js.  unlock: N  means the card appears only after Lantern Level N.
'use strict';

(function () {
  const AL = {
    // ================= STARTER =================
    vialToss: { name: 'Vial Toss', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy', icon: ':flask:',
      v: { d: 6 }, up: { d: 9 }, desc: 'Deal {d} damage.',
      play: (c, v, t) => c.attack(t, v.d) },
    glassWall: { name: 'Glass Wall', type: 'skill', rarity: 'starter', cost: 1, icon: ':jar:',
      v: { b: 5 }, up: { b: 8 }, desc: 'Gain {b} Ward.',
      play: (c, v) => c.ward(v.b) },
    acidSplash: { name: 'Acid Splash', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy', icon: ':orbGreen:',
      v: { d: 4, n: 5 }, up: { d: 6, n: 6 }, desc: 'Deal {d} damage. Apply {n} Unstable.',
      play: async (c, v, t) => { await c.attack(t, v.d); c.apply(t, 'unstable', v.n); } },

    // ================= COMMON =================
    quickBrew: { name: 'Quick Brew', type: 'skill', rarity: 'common', cost: 1, icon: ':flask:',
      v: { b: 4 }, up: { b: 7 }, desc: 'Brew a random Tonic. Gain {b} Ward.',
      play: async (c, v) => { c.brew(1); await c.ward(v.b); } },
    reagentDart: { name: 'Reagent Dart', type: 'attack', rarity: 'common', cost: 0, target: 'enemy', icon: ':target:',
      v: { d: 3, n: 3 }, up: { d: 4, n: 4 }, desc: 'Deal {d} damage. Apply {n} Unstable.',
      play: async (c, v, t) => { await c.attack(t, v.d); c.apply(t, 'unstable', v.n); } },
    flaskBarrage: { name: 'Flask Barrage', type: 'attack', rarity: 'common', cost: 1, icon: ':bottle:',
      v: { d: 3, n: 3 }, up: { d: 3, n: 4 }, desc: 'Deal {d} damage to a random enemy {n} times.',
      play: (c, v) => c.attackRandom(v.d, v.n) },
    smokeFlask: { name: 'Smoke Flask', type: 'skill', rarity: 'common', cost: 1, icon: ':wind:',
      v: { b: 7 }, up: { b: 10 }, desc: 'Gain {b} Ward. Apply 1 Sapped to ALL enemies.',
      play: async (c, v) => { await c.ward(v.b); c.applyAll('sapped', 1); } },
    boilOver: { name: 'Boil Over', type: 'attack', rarity: 'common', cost: 1, icon: ':flame:',
      v: { d: 5, n: 2 }, up: { d: 7, n: 3 }, desc: 'Deal {d} damage to ALL enemies. Apply {n} Unstable to ALL enemies.',
      play: async (c, v) => { await c.attackAll(v.d); c.applyAll('unstable', v.n); } },
    distill: { name: 'Distill', type: 'skill', rarity: 'common', cost: 0, exhaust: true, icon: ':drop:',
      v: { n: 2 }, up: { n: 3 }, desc: 'Draw {n} cards.',
      play: (c, v) => c.drawCards(v.n) },
    saltWard: { name: 'Salt Circle', type: 'skill', rarity: 'common', cost: 1, icon: ':salt:',
      v: { b: 6, m: 3 }, up: { b: 8, m: 4 }, desc: 'Gain {b} Ward, plus {m} for each Tonic you are holding.',
      play: (c, v) => c.ward(v.b + v.m * c.run.potions.filter(Boolean).length) },
    catalystStrike: { name: 'Catalyst Strike', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':bolt:',
      v: { d: 7, n: 3 }, up: { d: 10, n: 4 }, desc: 'Deal {d} damage. If the target is Unstable, apply {n} more Unstable.',
      play: async (c, v, t) => { const u = !!t.statuses.unstable; await c.attack(t, v.d); if (u && !t.dead) c.apply(t, 'unstable', v.n); } },
    shatter: { name: 'Shatter', type: 'attack', rarity: 'common', cost: 2, target: 'enemy', icon: ':bubbles:',
      v: { d: 12 }, up: { d: 16 }, desc: 'Deal {d} damage. Brew a random Tonic.',
      play: async (c, v, t) => { await c.attack(t, v.d); c.brew(1); } },
    mixingBowl: { name: 'Mixing Bowl', type: 'skill', rarity: 'common', cost: 1, target: 'enemy', icon: ':bowl:',
      v: { n: 7 }, up: { n: 9 }, desc: 'Apply {n} Unstable.',
      play: (c, v, t) => c.apply(t, 'unstable', v.n) },

    // ================= UNCOMMON =================
    detonate: { name: 'Detonate', type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy', icon: ':firecracker:',
      v: { m: 3 }, up: { m: 4 }, desc: 'The target loses HP equal to {m} times its Unstable. Remove its Unstable.',
      play: async (c, v, t) => {
        const u = t.statuses.unstable || 0;
        if (!u) { c.float(t, 'Not Unstable', 'debuff'); return; }
        delete t.statuses.unstable;
        Fx.at(t, 'fire'); Sound.play('explode');
        await c.damage(t, u * v.m, c.player, 'hploss');
      } },
    fumeHood: { name: 'Fume Hood', type: 'power', rarity: 'uncommon', cost: 1, icon: ':cloud:',
      v: { n: 2 }, up: { n: 3 }, desc: 'At the end of your turn, apply {n} Unstable to ALL enemies.',
      play: (c, v) => c.selfApply('fumeHood', v.n) },
    catalysis: { name: 'Catalysis', type: 'power', rarity: 'uncommon', cost: 1, upCost: 0, icon: ':microscope:',
      v: {}, desc: 'Explosions deal 10 additional damage.',
      play: (c) => c.selfApply('catalysis', 10) },
    doubleDose: { name: 'Double Dose', type: 'skill', rarity: 'uncommon', cost: 1, upCost: 0, icon: ':pill:',
      v: {}, desc: 'The next Tonic you use this combat takes effect twice.',
      play: (c) => c.selfApply('doubleDose', 1) },
    tonicLash: { name: 'Tonic Lash', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy', icon: ':knot:',
      v: { d: 4, m: 5 }, up: { d: 6, m: 7 }, desc: 'Deal {d} damage, plus {m} for each Tonic used this combat.',
      play: (c, v, t) => c.attack(t, v.d + v.m * (c.tonicsUsed || 0)) },
    volatileMix: { name: 'Volatile Mix', type: 'attack', rarity: 'uncommon', cost: 2, icon: ':volcano:',
      v: { d: 8, n: 4 }, up: { d: 11, n: 5 }, desc: 'Deal {d} damage to ALL enemies. Apply {n} Unstable to ALL enemies.',
      play: async (c, v) => { await c.attackAll(v.d); c.applyAll('unstable', v.n); } },
    transmute: { name: 'Transmute', type: 'skill', rarity: 'uncommon', cost: 1, upCost: 0, icon: ':recycle:',
      v: {}, desc: 'Choose a card in your hand. It becomes a random upgraded card.',
      play: async (c) => {
        const card = await c.chooseHand('Choose a card to transmute');
        if (!card) return;
        const pool = ['common', 'uncommon', 'rare'].flatMap((r) => cardPool(r));
        const nc = makeCard(pick(pool), true);
        nc._new = true; nc._made = true;
        c.hand.splice(c.hand.indexOf(card), 1, nc);
        c.float(c.player, `${cardName(card)} → ${cardName(nc)}`, 'buff');
        c.render();
      } },
    elixirOfVigor: { name: 'Elixir of Vigor', type: 'skill', rarity: 'uncommon', cost: 1, exhaust: true, icon: ':goblet:',
      v: { n: 2 }, up: { n: 3 }, desc: 'Gain {n} Might.',
      play: (c, v) => c.selfApply('might', v.n) },
    stockpile: { name: 'Stockpile', type: 'skill', rarity: 'uncommon', cost: 2, upCost: 1, exhaust: true, icon: ':box:',
      v: {}, desc: 'Brew 2 random Tonics.',
      play: (c) => c.brew(2) },
    reactiveArmor: { name: 'Reactive Armor', type: 'power', rarity: 'uncommon', cost: 1, icon: ':shield:',
      v: { n: 8 }, up: { n: 12 }, desc: 'Whenever an enemy explodes, gain {n} Ward.',
      play: (c, v) => c.selfApply('reactiveArmor', v.n) },

    // ================= RARE =================
    philosophersStone: { name: "Philosopher's Stone", type: 'power', rarity: 'rare', cost: 3, upCost: 2, icon: ':gem:',
      v: {}, desc: 'At the start of your turn, brew a random Tonic.',
      play: (c) => c.selfApply('philosophersStone', 1) },
    chainReaction: { name: 'Chain Reaction', type: 'power', rarity: 'rare', cost: 2, icon: ':chain:',
      v: { n: 5 }, up: { n: 8 }, desc: 'Whenever an enemy explodes, apply {n} Unstable to ALL other enemies.',
      play: (c, v) => c.selfApply('chainReaction', v.n) },
    grandExperiment: { name: 'Grand Experiment', type: 'skill', rarity: 'rare', cost: 1, upCost: 0, exhaust: true, icon: ':petri:',
      v: {}, desc: 'Brew Tonics until all your Tonic slots are full.',
      play: (c) => c.brew(c.run.potions.filter((p) => !p).length) },
    magnumOpus: { name: 'Magnum Opus', type: 'attack', rarity: 'rare', cost: 3, target: 'enemy', icon: ':scroll:',
      v: { d: 22, n: 10 }, up: { d: 30, n: 10 }, desc: 'Deal {d} damage. Apply {n} Unstable.',
      play: async (c, v, t) => { await c.attack(t, v.d); c.apply(t, 'unstable', v.n); } },
    panacea: { name: 'Panacea', type: 'skill', rarity: 'rare', cost: 1, exhaust: true, icon: ':herb:',
      v: { n: 8 }, up: { n: 12 }, desc: 'Heal {n} HP. Remove all of your debuffs.',
      play: (c, v) => {
        c.heal(c.player, v.n);
        for (const k of Object.keys(c.player.statuses)) if (STATUSES[k].type === 'debuff' || (STATUSES[k].canNeg && c.player.statuses[k] < 0)) delete c.player.statuses[k];
        c.renderEntity(c.player);
      } },
    meltdown: { name: 'Meltdown', type: 'skill', rarity: 'rare', cost: 2, exhaust: true, icon: ':radioactive:',
      v: {}, up: {}, upCost: 1, desc: 'ALL enemies explode, no matter how much Unstable they have.',
      play: async (c) => { for (const e of c.alive()) { await c.explode(e); await sleep(150); } } },

    // ================= UNLOCKABLE (Lantern Level 5) =================
    acidRain: { name: 'Acid Rain', type: 'attack', rarity: 'common', cost: 1, icon: ':rainCloud:', unlock: 5,
      v: { d: 3, n: 1 }, up: { d: 4, n: 2 }, desc: 'Deal {d} damage to ALL enemies twice. Apply {n} Unstable to ALL enemies.',
      play: async (c, v) => { await c.attackAll(v.d); await sleep(150); await c.attackAll(v.d); c.applyAll('unstable', v.n); } },
    alembic: { name: 'Alembic', type: 'power', rarity: 'uncommon', cost: 1, icon: ':urn:', unlock: 5,
      v: { n: 1 }, up: { n: 2 }, desc: 'Whenever you use a Tonic, draw {n} card(s).',
      play: (c, v) => c.selfApply('alembic', v.n) },
    goldenRatio: { name: 'Golden Ratio', type: 'skill', rarity: 'rare', cost: 1, upCost: 0, exhaust: true, icon: ':swirl:', unlock: 5,
      v: {}, desc: "Double every enemy's Unstable.",
      play: (c) => { for (const e of c.alive()) if (e.statuses.unstable) c.apply(e, 'unstable', e.statuses.unstable); } },
  };
  for (const k of Object.keys(AL)) AL[k].char = 'alchemist';

  // ---- Unlockable cards for the other heroes ----
  const MORE = {
    // Lampwright (Lantern Level 3)
    kindlingSpark: { char: 'lampwright', unlock: 3, name: 'Kindling Spark', type: 'skill', rarity: 'common', cost: 0, icon: ':sparkles:',
      v: { g: 1, n: 2 }, up: { g: 2, n: 3 }, desc: 'Gain {g} Glow. Apply {n} Burn to a random enemy.',
      play: (c, v) => { c.selfApply('glow', v.g); const t = pick(c.alive()); if (t) c.apply(t, 'burn', v.n); } },
    beaconFire: { char: 'lampwright', unlock: 3, name: 'Beacon Fire', type: 'attack', rarity: 'uncommon', cost: 2, icon: ':flame:',
      v: { d: 10, g: 2 }, up: { d: 13, g: 3 }, desc: 'Deal {d} damage to ALL enemies. Gain {g} Glow.',
      play: async (c, v) => { await c.attackAll(v.d); c.selfApply('glow', v.g); } },
    dawnbreaker: { char: 'lampwright', unlock: 3, name: 'Dawnbreaker', type: 'attack', rarity: 'rare', cost: 2, target: 'enemy', icon: ':sunrise:',
      v: { d: 16 }, up: { d: 22 }, desc: 'Deal {d} damage. Apply Burn equal to your Glow.',
      play: async (c, v, t) => { await c.attack(t, v.d); const g = c.glow(); if (g && !t.dead) c.apply(t, 'burn', g); } },
    // Moonblade (Lantern Level 4)
    crimsonFlourish: { char: 'moonblade', unlock: 4, name: 'Crimson Flourish', type: 'attack', rarity: 'common', cost: 1, target: 'enemy', icon: ':rose:',
      v: { d: 4, n: 1 }, up: { d: 5, n: 2 }, desc: 'Deal {d} damage twice. Each hit applies {n} Bleed.',
      play: async (c, v, t) => { for (let k = 0; k < 2 && !t.dead; k++) { await c.attack(t, v.d); if (!t.dead) c.apply(t, 'bleed', v.n); } } },
    moonlitWaltz: { char: 'moonblade', unlock: 4, name: 'Moonlit Waltz', type: 'skill', rarity: 'uncommon', cost: 1, icon: ':shoes:',
      v: { n: 2 }, up: { n: 3 }, desc: 'Gain 1 Evade. Add {n} Moon Shards to your hand.',
      play: (c, v) => { c.selfApply('evade', 1); c.addCard('moonShard', 'hand', v.n); } },
    eclipseDance: { char: 'moonblade', unlock: 4, name: 'Eclipse Dance', type: 'attack', rarity: 'rare', cost: 2, icon: ':moon:',
      v: { d: 3, n: 5 }, up: { d: 4, n: 5 }, desc: 'Deal {d} damage to ALL enemies {n} times.',
      play: async (c, v) => { for (let k = 0; k < v.n && !c.over; k++) { await c.attackAll(v.d); await sleep(110); } } },
  };
  Object.assign(CARDS, AL, MORE);
})();

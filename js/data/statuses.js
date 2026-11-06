// ===== Status effects (buffs, debuffs and powers) =====
// Hooks: onTurnStart(ctx, ent, n), onTurnEnd(ctx, ent, n)   (may be async)
// duration: true  -> decreases by 1 at the end of each round
'use strict';

const STATUSES = {
  // ---- Core stats ----
  might:     { name: 'Might', icon: '💪', type: 'buff', canNeg: true,
               desc: (n) => n >= 0 ? `Attacks deal ${n} additional damage.` : `Attacks deal ${-n} less damage.` },
  fortitude: { name: 'Fortitude', icon: '🪨', type: 'buff', canNeg: true,
               desc: (n) => `Ward gained from cards is increased by ${n}.` },
  glow:      { name: 'Glow', icon: '✨', type: 'buff',
               desc: (n) => `The light of your lantern. Some cards grow stronger with Glow, others spend it. (${n})` },

  // ---- Debuffs ----
  exposed: { name: 'Exposed', icon: '🎯', type: 'debuff', duration: true,
             desc: (n) => `Takes 50% more damage from Attacks for ${n} round(s).` },
  sapped:  { name: 'Sapped', icon: '🥀', type: 'debuff', duration: true,
             desc: (n) => `Deals 25% less Attack damage for ${n} round(s).` },
  brittle: { name: 'Brittle', icon: '🧊', type: 'debuff', duration: true,
             desc: (n) => `Gains 25% less Ward for ${n} round(s).` },
  burn: { name: 'Burn', icon: '🔥', type: 'debuff',
          desc: (n) => `At the start of its turn, loses ${n} HP (ignores Ward). Then Burn decreases by 1.`,
          async onTurnStart(ctx, e, n) {
            await ctx.damage(e, n, null, 'burn');
            if (!e.dead && e.statuses.burn) { e.statuses.burn -= 1; if (e.statuses.burn <= 0) delete e.statuses.burn; }
          } },

  // ---- General buffs ----
  spines:  { name: 'Spines', icon: '🌵', type: 'buff', desc: (n) => `When attacked, deals ${n} damage back to the attacker.` },
  mending: { name: 'Mending', icon: '💚', type: 'buff',
             desc: (n) => `At the end of its turn, heals ${n} HP. Then Mending decreases by 1.`,
             onTurnEnd(ctx, e, n) { ctx.heal(e, n); e.statuses.mending--; if (e.statuses.mending <= 0) delete e.statuses.mending; } },
  fervor:  { name: 'Fervor', icon: '🕯️', type: 'buff', desc: (n) => `At the end of its turn, gains ${n} Might.`,
             onTurnEnd(ctx, e, n) { ctx.apply(e, 'might', n, e); } },
  shell:   { name: 'Shell', icon: '🐚', type: 'buff',
             desc: (n) => `At the end of its turn, gains ${n} Ward. Taking unblocked Attack damage reduces Shell by 1.`,
             onTurnEnd(ctx, e, n) { ctx.gainBlock(e, n, false); } },
  nullify: { name: 'Nullify', icon: '🔰', type: 'buff', desc: (n) => `Negates the next ${n} debuff(s).` },
  wrath:   { name: 'Wrath', icon: '😡', type: 'buff', desc: (n) => `Whenever you play a Skill, gains ${n} Might.` },
  coil:    { name: 'Coil', icon: '🌀', type: 'buff', desc: (n) => `The first time it takes Attack damage, gains ${n} Ward.` },
  sporeBurst: { name: 'Spore Burst', icon: '💨', type: 'buff', desc: (n) => `On death, applies ${n} Exposed to you.` },
  minion:  { name: 'Minion', icon: '⛓️', type: 'info', desc: () => `Flees when its master falls.` },
  splitter:{ name: 'Divide', icon: '➗', type: 'info', desc: () => `When at or below half HP, it splits into two smaller slimes.` },

  // ---- Temporary player effects ----
  fadeMight:  { name: 'Fading Might', icon: '⏬', type: 'debuff', desc: (n) => `At the end of your turn, lose ${n} Might.`,
                onTurnEnd(ctx, e, n) { ctx.apply(e, 'might', -n, e, true); delete e.statuses.fadeMight; } },
  primed:     { name: 'Primed', icon: '🔆', type: 'buff', desc: (n) => `Your next Attack deals ${n} additional damage.` },
  nextEnergy: { name: 'Banked Fire', icon: '⚡', type: 'buff', desc: (n) => `Next turn, gain ${n} Energy.` },
  doubleNext: { name: 'Twin Flame', icon: '♊', type: 'buff', desc: (n) => `Your next ${n} Attack(s) this turn are played twice.`,
                onTurnEnd(ctx, e) { delete e.statuses.doubleNext; } },

  // ---- Player powers ----
  everStoked:  { name: 'Ever-Stoked', icon: '🏮', type: 'power', desc: (n) => `At the start of your turn, gain ${n} Glow.`,
                 onTurnStart(ctx, e, n) { ctx.apply(e, 'glow', n, e); } },
  pyromancy:   { name: 'Pyromancy', icon: '🧙', type: 'power', desc: (n) => `Whenever you apply Burn, apply ${n} more.` },
  bastion:     { name: 'Bastion', icon: '🏰', type: 'power', desc: (n) => `At the end of your turn, gain ${n} Ward.`,
                 onTurnEnd(ctx, e, n) { ctx.gainBlock(e, n, false); } },
  smolder:     { name: 'Smoldering Haze', icon: '☁️', type: 'power', desc: (n) => `At the start of your turn, apply ${n} Burn to ALL enemies.`,
                 onTurnStart(ctx, e, n) { ctx.applyAll('burn', n); } },
  flicker:     { name: 'Flicker Ward', icon: '💫', type: 'power', desc: (n) => `Whenever you gain Ward from a card, deal ${n} damage to a random enemy.` },
  eternalFlame:{ name: 'Eternal Flame', icon: '♨️', type: 'power', desc: (n) => `At the start of your turn, gain ${n} Might.`,
                 onTurnStart(ctx, e, n) { ctx.apply(e, 'might', n, e); } },
  lanternShell:{ name: 'Lantern Shell', icon: '🔒', type: 'power', desc: () => `Your Ward is not removed at the start of your turn.` },
  corona:      { name: 'Corona', icon: '☀️', type: 'power', desc: (n) => `At the end of your turn, deal damage equal to your Glow to ALL enemies${n > 1 ? ` (${n} times)` : ''}.`,
                 async onTurnEnd(ctx, e, n) {
                   const g = e.statuses.glow || 0;
                   for (let i = 0; i < n && g > 0; i++) for (const t of ctx.alive()) await ctx.damage(t, g, e, 'power');
                 } },
  echoingToll: { name: 'Echoing Toll', icon: '🔔', type: 'power', desc: (n) => `The first ${n > 1 ? n + ' Attacks' : 'Attack'} you play each turn ${n > 1 ? 'are' : 'is'} played twice.` },
  wellspring:  { name: 'Wellspring', icon: '⛲', type: 'power', desc: (n) => `Draw ${n} additional card(s) each turn.` },
  endlessOil:  { name: 'Endless Oil', icon: '🛢️', type: 'power', desc: (n) => `Gain ${n} additional Energy each turn.`,
                 onTurnStart(ctx, e, n) { ctx.gainEnergy(n); } },

  // ---- The Moonblade ----
  bleed: { name: 'Bleed', icon: '🩸', type: 'debuff',
           desc: (n) => `Whenever it is hit by an Attack, loses ${n} extra HP. Bleed decreases by 1 at the end of its turn.`,
           onTurnEnd(ctx, e) {
             if (ctx.player.statuses.bloodMoon) return;
             e.statuses.bleed--; if (e.statuses.bleed <= 0) delete e.statuses.bleed;
           } },
  evade: { name: 'Evade', icon: '👤', type: 'buff', desc: (n) => `Completely avoids the next ${n > 1 ? n + ' Attack hits' : 'Attack hit'}.` },
  honed: { name: 'Honed Edge', icon: '🔪', type: 'power', desc: (n) => `Moon Shards deal ${n} additional damage.` },
  moonDance: { name: 'Moonlit Dance', icon: '💃', type: 'power', desc: (n) => `At the start of your turn, add ${n} Moon Shard(s) to your hand.`,
               onTurnStart(ctx, e, n) { ctx.addCard('moonShard', 'hand', n); } },
  shardsNext: { name: 'Dusk Parry', icon: '🌙', type: 'buff', desc: (n) => `Next turn, add ${n} Moon Shards to your hand.`,
                onTurnStart(ctx, e, n) { delete e.statuses.shardsNext; ctx.addCard('moonShard', 'hand', n); } },
  crimsonMoon: { name: 'Crimson Moon', icon: '🔴', type: 'power', desc: (n) => `Whenever you apply Bleed, apply ${n} more.` },
  silverMirage: { name: 'Silver Mirage', icon: '🪞', type: 'power', desc: (n) => `Whenever you play a card that costs 0, gain ${n} Ward.` },
  phantomStep: { name: 'Phantom Step', icon: '👻', type: 'power', desc: (n) => `At the start of your turn, if you have no Evade, gain 1 Evade.`,
                 onTurnStart(ctx, e, n) { if (!e.statuses.evade) ctx.apply(e, 'evade', 1, e); } },
  bloodMoon: { name: 'Blood Moon', icon: '🌕', type: 'power', desc: () => `Enemies' Bleed no longer decreases.` },
  whisperingSteel: { name: 'Whispering Steel', icon: '🎐', type: 'power', desc: (n) => `Whenever you play a card, deal ${n} damage to ALL enemies.` },

  // ---- Cassandra and her Knight ----
  valor: { name: 'Valor', icon: '⚔️', type: 'buff', desc: (n) => `The Knight's attacks deal ${n} more damage.` },
  mark: { name: 'Mark', icon: '🎯', type: 'debuff', desc: (n) => `The next time the Knight hits it, it takes ${n} extra damage. Then the Mark is used up.` },
  vigil: { name: 'Eternal Vigil', icon: '🕯️', type: 'power', desc: (n) => `At the end of your turn, the Knight strikes a random enemy for ${n} damage.`,
           async onTurnEnd(ctx, e, n) { const t = pick(ctx.alive()); if (t && ctx.knightAlive()) await ctx.knightAttack(t, n); } },
  thornCrown: { name: 'Crown of Thorns', icon: '🌵', type: 'power', desc: (n) => `Whenever the Knight takes damage from an attack, he deals ${n} damage back.` },
  blackWedding: { name: 'Black Wedding', icon: '💍', type: 'power', desc: () => `Whenever you Summon, deal that much damage to a random enemy.` },
  darkMajesty: { name: 'Dark Majesty', icon: '👑', type: 'power', desc: (n) => `At the start of your turn, apply ${n} Mark to ALL enemies.`,
                 onTurnStart(ctx, e, n) { ctx.applyAll('mark', n); } },

  // ---- The Alchemist ----
  unstable: { name: 'Unstable', icon: '💥', type: 'debuff',
              desc: (n) => `At 10 Unstable it explodes, losing 25 HP (ignores Ward). (${n}/10)` },
  fumeHood: { name: 'Fume Hood', icon: '☁️', type: 'power', desc: (n) => `At the end of your turn, apply ${n} Unstable to ALL enemies.`,
              onTurnEnd(ctx, e, n) { ctx.applyAll('unstable', n); } },
  catalysis: { name: 'Catalysis', icon: '🔬', type: 'power', desc: (n) => `Explosions deal ${n} additional damage.` },
  doubleDose: { name: 'Double Dose', icon: '💊', type: 'buff', desc: () => `The next Tonic you use takes effect twice.` },
  reactiveArmor: { name: 'Reactive Armor', icon: '🛡️', type: 'power', desc: (n) => `Whenever an enemy explodes, gain ${n} Ward.` },
  philosophersStone: { name: "Philosopher's Stone", icon: '💎', type: 'power', desc: (n) => `At the start of your turn, brew ${n} random Tonic(s).`,
                       onTurnStart(ctx, e, n) { ctx.brew(n); } },
  chainReaction: { name: 'Chain Reaction', icon: '⛓️', type: 'power', desc: (n) => `Whenever an enemy explodes, apply ${n} Unstable to ALL other enemies.` },
  alembic: { name: 'Alembic', icon: '🏺', type: 'power', desc: (n) => `Whenever you use a Tonic, draw ${n} card(s).` },
};

const DURATION_STATUSES = Object.keys(STATUSES).filter((k) => STATUSES[k].duration);

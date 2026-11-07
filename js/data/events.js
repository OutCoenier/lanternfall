// ===== Events ("?" rooms) =====
// options(run) -> [{ label, desc, disabled, action: async () => 'result text' | { text, fight: [enemyIds] } }]
'use strict';

ENEMIES.mimic = { name: 'Hungry Mimic', hp: [58, 62], sprite: ':chest:', scale: 1.3, elite: true,
  init: (c, e) => { const a = Game.run.act; e.maxHp = e.hp = Math.round(e.hp * (1 + 0.7 * (a - 1))); if (a > 1) e.statuses.might = (a - 1) * 3; },
  moves: { chomp: { name: 'Chomp', dmg: 11 }, gulp: { name: 'Gulp Gold', dmg: 6, fn: (c) => { const g = Math.min(Game.run.gold, 15); Game.run.gold -= g; if (g) c.float(c.player, `-${g} gold`, 'debuff'); } },
    snap: { name: 'Snap Shut', block: 10, buff: { might: 2 } } },
  ai: (h) => (h.last() === 'chomp' ? (h.chance(0.5) ? 'gulp' : 'snap') : 'chomp') };

const EVENTS = {
  weepingShrine: { name: 'The Weeping Shrine', art: ':shrine:', acts: [1, 2, 3],
    text: 'A stone saint weeps black water into a cracked basin. Coins glint at the bottom. The air hums with old, tired prayers.',
    options: (run) => [
      { label: 'Pray', desc: 'Remove a card from your deck.', disabled: !removableCards().length,
        action: async () => (await chooseRemoveCard()) ? 'The water takes something from you. You feel lighter.' : 'You change your mind.' },
      { label: 'Desecrate', desc: `Gain ${50 + run.act * 35} gold. Become cursed: Dread.`,
        action: async () => { gainGold(50 + run.act * 35); addCardToDeck('dread'); return 'You scoop up the coins. The saint\'s eyes follow you as you leave.'; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => 'You leave the saint to its grief.' },
    ] },
  sunkenCart: { name: 'The Sunken Cart', art: ':stall:', acts: [1, 2],
    text: 'A merchant\'s cart lies half-buried in silt. Its owner is long gone, but a locked strongbox remains chained to the axle.',
    options: () => [
      { label: 'Break the strongbox', desc: 'Obtain a random Curio. Become cursed: Rot.',
        action: async () => { const r = randomRelic(); if (r) obtainRelic(r); addCardToDeck('rot'); return `Inside you find ${r ? RELICS[r].name : 'nothing'}... and a smell that clings to you.`; } },
      { label: 'Search the pockets', desc: 'Gain 40-60 gold.', action: async () => { const g = rand(40, 60); gainGold(g); return `You find ${g} gold in a rotting coat.`; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => 'Some things are better left buried.' },
    ] },
  fairyRing: { name: 'Ring of Pale Caps', art: ':mushroom:', acts: [2],
    text: 'A perfect circle of glowing mushrooms. Faint music drifts from within, and the caps smell sweet... too sweet.',
    options: (run) => [
      { label: 'Eat a cap', desc: `Heal ${Math.floor(run.maxHp * 0.3)} HP. Become cursed: Rot.`,
        action: async () => { healRun(Math.floor(run.maxHp * 0.3)); addCardToDeck('rot'); return 'Warmth floods you. Something else takes root, too.'; } },
      { label: 'Dance in the ring', desc: 'Upgrade 2 random cards. Lose 8 HP.',
        action: async () => { loseHp(8); const up = upgradeRandomCards(2); return up.length ? `You dance until your feet bleed. ${up.join(' and ')} glow brighter.` : 'You dance until your feet bleed, but nothing changes.'; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => 'The music fades behind you.' },
    ] },
  lostFlame: { name: 'A Lost Flame', art: ':flame:', acts: [1, 2, 3],
    text: 'A tiny flame drifts alone through the dark, flickering weakly. It turns toward your lantern as if recognizing an old friend.',
    options: () => [
      { label: 'Absorb it', desc: 'Raise your Max HP by 7.', action: async () => { gainMaxHp(7); return 'The flame settles into your chest. You feel stronger.'; } },
      { label: 'Shelter it', desc: 'Upgrade a card of your choice.', disabled: !Game.run.deck.some(canUpgrade),
        action: async () => (await chooseUpgradeCard()) ? 'The flame nests in your deck, tempering it.' : 'The flame drifts away.' },
    ] },
  fortuneTeller: { name: 'The Blind Seer', art: ':crystalBall:', acts: [1, 2, 3],
    text: 'An old woman with candle-wax eyes sits before a cloudy orb. "The cards whisper, lantern-bearer. Shall we listen?"',
    options: (run) => [
      { label: 'Read my fate', desc: 'Transform a card into a random card.', disabled: !removableCards().length,
        action: async () => { const r = await chooseTransformCard(); return r ? `Your ${r[0]} becomes ${r[1]}.` : 'You decline.'; } },
      { label: 'Read my fortune', desc: 'Pay 60 gold: choose 1 of 3 rare cards.', disabled: run.gold < 60,
        action: async () => { Game.run.gold -= 60; await offerCards(pickN(cardPool('rare'), 3).map((id) => makeCard(id)), 'Choose a rare card'); return '"Fate favors the bold," she cackles.'; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => '"We will meet again," she whispers.' },
    ] },
  gildedSkull: { name: 'The Gilded Skull', art: ':skull:', acts: [1, 2, 3],
    text: 'On an altar of bones sits a skull plated in gold. It would fetch a fortune. The bones around it look... restless.',
    options: (run) => [
      { label: 'Take the skull', desc: `Gain ${120 + run.act * 30} gold. Lose 8 Max HP.`,
        action: async () => { gainGold(120 + run.act * 30); run.maxHp -= 8; run.hp = Math.min(run.hp, run.maxHp); return 'The bones rattle as you grab it. A chill settles into your bones.'; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => 'You leave the skull to its rest.' },
    ] },
  mimicChest: { name: 'A Suspicious Chest', art: ':chest:', acts: [1],
    text: 'A lonely chest sits in the middle of the corridor. Its lid seems to rise and fall... slowly... like breathing.',
    options: () => [
      { label: 'Open it', desc: 'Could be treasure. Could be teeth.',
        action: async () => {
          if (chance(0.5)) { const r = randomRelic(); if (r) obtainRelic(r); return `It's real! You find ${r ? RELICS[r].name : 'dust'} inside.`; }
          return { text: 'The chest sprouts teeth and lunges at you!', fight: ['mimic'] };
        } },
      { label: 'Kick it and run', desc: 'Lose 3 HP. Gain 25 gold.', action: async () => { loseHp(3); gainGold(25); return 'It bites your boot, but some coins spill out as you flee.'; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => 'You walk carefully around it.' },
    ] },
  alchemist: { name: 'The Wandering Alchemist', art: ':flask:', acts: [1, 2, 3],
    text: 'A hunched figure stirs a bubbling pot. "Tonics! Fresh tonics! Or... try my latest experiment? Free of charge!"',
    options: (run) => [
      { label: 'Buy tonics', desc: 'Pay 35 gold: gain 2 random Tonics.', disabled: run.gold < 35,
        action: async () => { run.gold -= 35; obtainPotion(randomPotion()); obtainPotion(randomPotion()); return '"Pleasure doing business!"'; } },
      { label: 'Drink the experiment', desc: '50%: +6 Max HP. 50%: lose 8 HP.',
        action: async () => { if (chance(0.5)) { gainMaxHp(6); return 'It tastes like starlight. You feel hardier!'; } loseHp(8); return 'You cough up smoke for a full minute. "Hm. Needs work."'; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => '"Your loss!"' },
    ] },
  forge: { name: 'The Abandoned Forge', art: ':hammer:', acts: [1, 2, 3],
    text: 'The forge is cold, but your lantern could rekindle it for a moment. Enough for one piece of work.',
    options: () => [
      { label: 'Temper', desc: 'Upgrade a card of your choice.', disabled: !Game.run.deck.some(canUpgrade),
        action: async () => (await chooseUpgradeCard()) ? 'The hammer rings. Your card is stronger.' : 'You let the forge go cold.' },
      { label: 'Smelt', desc: 'Remove a card from your deck. Gain 30 gold.', disabled: !removableCards().length,
        action: async () => { if (await chooseRemoveCard()) { gainGold(30); return 'You melt it down into coin.'; } return 'You let the forge go cold.'; } },
    ] },
  bloodAltar: { name: 'Altar of Embers', art: ':bloodDrop:', acts: [2, 3],
    text: 'A basin of glowing coals beneath a carved inscription: "Give of yourself, and be given."',
    options: (run) => [
      { label: 'Offer blood', desc: `Lose ${8 + run.act * 3} HP. Obtain a random Curio.`,
        action: async () => { loseHp(8 + run.act * 3); const r = randomRelic(); if (r) obtainRelic(r); return r ? `The coals hiss. ${RELICS[r].name} rises from the ash.` : 'The coals hiss, but nothing comes.'; } },
      { label: 'Leave', desc: 'Nothing happens.', action: async () => 'You keep your blood.' },
    ] },
};

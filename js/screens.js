// ===== Non-combat screens =====
'use strict';

function setScreen(node, cls = '') {
  const scr = $('#screen');
  scr.innerHTML = '';
  scr.className = cls;
  scr.appendChild(node);
  $('#fx').innerHTML = '';
  hideTip();
  if (typeof Tutorial !== 'undefined' && Tutorial.active() && !Game.combat) Tutorial.finish();
}
function actStyle(node) {
  const act = ACTS[(Game.run ? Game.run.act : 1) - 1];
  node.style.setProperty('--bg1', act.bg[0]);
  node.style.setProperty('--bg2', act.bg[1]);
  node.style.setProperty('--accent', act.accent);
  return node;
}
function embers(n = 28) {
  let s = '<div class="embers">';
  for (let i = 0; i < n; i++) s += `<i style="left:${Math.random() * 100}%;animation-delay:${(Math.random() * 8).toFixed(2)}s;animation-duration:${(6 + Math.random() * 6).toFixed(2)}s;--dx:${Math.round(Math.random() * 80 - 40)}px"></i>`;
  return s + '</div>';
}
function button(label, onClick, cls = 'btn') {
  const b = el('button', cls, label);
  b.onclick = onClick;
  return b;
}

// ---------- Lantern Level bar (title screen, game over) ----------
function levelBarHTML(xp = Profile.get().xp) {
  let lv = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) lv = i;
  const next = LEVELS[lv + 1];
  const pct = next ? ((xp - LEVELS[lv].xp) / (next.xp - LEVELS[lv].xp)) * 100 : 100;
  return `<div class="level-bar" data-tip="${next ? `<b>Next unlock:</b> ${esc(next.unlock)}` : 'Everything is unlocked!'}">
    <span class="lv">🏮 Lantern Level <b>${lv}</b></span>
    <div class="lv-track"><div class="lv-fill" style="width:${pct.toFixed(1)}%"></div></div>
    <span class="lv-xp">${next ? `${xp} / ${next.xp} XP` : `${xp} XP · MAX`}</span></div>`;
}

// ---------- Title ----------
function showTitle() {
  Game.run = null;
  Rng.state = null;
  Game.combat = null;
  closeOverlay();
  renderTopbar();
  Sound.music('title');
  const save = loadSave();
  const page = el('div', 'title-screen');
  const heroes = Object.keys(CHARACTERS).length;
  page.innerHTML = `${embers(40)}
    <div class="title-lantern">🏮</div>
    <h1 class="game-title">LANTERNFALL</h1>
    <p class="tagline">Carry the last light into the dark.</p>
    ${levelBarHTML()}
    <div class="menu"></div>
    <p class="credits">A deck-building descent · 3 Acts · ${heroes} Heroes · ${MAX_DEPTH} Depths</p>`;
  const menu = $('.menu', page);
  const confirmAbandon = () => !save || confirm('Starting a new run will abandon your current run. Continue?');
  if (save) menu.appendChild(button(`Continue <small>${CHARACTERS[save.char || 'lampwright'].short} · Act ${save.act} · Floor ${save.floor}${save.depth ? ' · Depth ' + save.depth : ''}</small>`, continueRun, 'btn big primary'));
  menu.appendChild(button('New Run', () => { if (confirmAbandon()) showCharSelect(); }, 'btn big' + (save ? '' : ' primary')));
  const today = Profile.get().daily[todayKey()];
  menu.appendChild(button(`📅 Daily Descent <small>${today ? `Today's best: ${today.score}` : 'Same map for everyone today'}</small>`, () => { if (confirmAbandon()) showDaily(); }, 'btn big'));
  const row = el('div', 'menu-row');
  row.append(button('📖 Journal', showJournal, 'btn'), button('🃏 Library', showLibrary, 'btn'), button('❓ How to Play', showHelp, 'btn ghost'), button('⚙️ Sound', showSoundSettings, 'btn ghost'));
  menu.appendChild(row);
  setScreen(page);
  const p = Profile.get();
  const lv = Profile.level();
  if (lv > (p.seenLevel || 0)) { p.seenLevel = lv; Profile.save(); }
}

// ---------- Character select ----------
function showCharSelect() {
  const page = el('div', 'char-select');
  page.innerHTML = `${embers(30)}<h1>Choose your hero</h1><p class="sub">Who will carry the light into the dark?</p><div class="char-row"></div>
    <div class="seed-row"><label>🌱 Seed <input class="seed-input" maxlength="24" placeholder="optional: play a specific map"></label></div>`;
  const row = $('.char-row', page);
  const p = Profile.get();
  for (const [id, ch] of Object.entries(CHARACTERS)) {
    const R = RELICS[ch.relic];
    const locked = !heroUnlocked(id);
    const card = el('div', 'char-card' + (locked ? ' locked' : ''), `
      <div class="char-portrait" style="--cc:${ch.color}">${ch.portrait()}</div>
      <h2>${esc(ch.name)}</h2>
      <p class="char-tag">${esc(ch.tagline)}</p>
      <div class="char-stats"><span>❤️ ${ch.hp} HP</span><span data-tip="<b>${esc(R.name)}</b><br>${esc(R.desc)}">${R.icon} ${esc(R.name)}</span>
        <span>🏆 ${p.wins[id] || 0} wins</span></div>
      <p class="char-bio">${esc(ch.bio)}</p>
      <ul class="char-mech">${ch.mechanics.map(([i, n, d]) => `<li><span>${i}</span><div><b>${n}</b> ${esc(d)}</div></li>`).join('')}</ul>`);
    card.style.setProperty('--cc', ch.color);
    if (locked) {
      card.appendChild(el('div', 'lock-note', `🔒 Reach <b>Lantern Level ${ch.unlock}</b> to unlock.<br><small>Finish any run to earn experience.</small>`));
    } else {
      // Depth picker
      let depth = Math.min(p.lastDepth && p.lastDepth[id] != null ? p.lastDepth[id] : 0, Profile.maxDepth(id));
      const dp = el('div', 'depth-pick');
      const draw = () => {
        const rules = DEPTHS.slice(1, depth + 1);
        dp.innerHTML = `<button class="dp-btn" data-d="-1" ${depth <= 0 ? 'disabled' : ''}>◀</button>
          <div class="dp-mid" data-tip="${depth ? rules.map((r, i) => `<b>${i + 1}. ${r.name}</b>: ${r.desc}`).join('<br>') : 'The normal descent. Win to unlock Depth 1.'}">
            <b>${depth ? `Depth ${depth}` : 'Normal'}</b><small>${depth ? esc(DEPTHS[depth].name) : `Max Depth unlocked: ${Profile.maxDepth(id)}`}</small></div>
          <button class="dp-btn" data-d="1" ${depth >= Profile.maxDepth(id) ? 'disabled' : ''}>▶</button>`;
        $$('.dp-btn', dp).forEach((b) => (b.onclick = () => { depth = clamp(depth + +b.dataset.d, 0, Profile.maxDepth(id)); draw(); }));
      };
      draw();
      card.appendChild(dp);
      card.appendChild(button(`Play as ${ch.short}`, () => {
        p.lastDepth = Object.assign(p.lastDepth || {}, { [id]: depth });
        Profile.save();
        const seed = $('.seed-input', page).value.trim();
        clearSave();
        newRun(id, { depth, seed: seed || null });
      }, 'btn big primary'));
    }
    row.appendChild(card);
  }
  page.appendChild(button('Back', showTitle, 'btn ghost'));
  setScreen(page);
}

// ---------- Daily Descent ----------
function showDaily() {
  const key = todayKey();
  const hero = dailyHero(key);
  const ch = CHARACTERS[hero];
  const best = Profile.get().daily[key];
  const box = el('div', 'menu-box daily-box');
  box.innerHTML = `<h2>📅 Daily Descent</h2>
    <p class="sub">${key}</p>
    <div class="daily-hero"><div class="mini-portrait">${ch.portrait()}</div><div><b>${ch.name}</b><br><small>Today's hero</small></div></div>
    <p>Everyone who plays today gets the <b>same hero, the same maps and the same rewards</b>. Compare your score with your friends!</p>
    ${best ? `<p class="daily-best">Your best today: <b>${best.score}</b> (${best.won ? 'Victory!' : `Act ${best.act}, floor ${best.floor}`})</p>` : ''}`;
  box.appendChild(button('Begin the descent', () => { closeOverlay(); clearSave(); newRun(hero, { seed: 'daily-' + key, daily: key }); }, 'btn big primary'));
  box.appendChild(button('Back', closeOverlay, 'btn ghost'));
  openOverlay(box);
}

// ---------- Journal: history, achievements, unlocks ----------
function showJournal() {
  const page = el('div', 'library journal');
  let tab = 'history';
  const p = Profile.get();
  const draw = () => {
    page.innerHTML = `<div class="lib-head"><h1>Journal</h1>
      <div class="tabs">${[['history', 'History'], ['ach', 'Achievements'], ['unlocks', 'Unlocks'], ['stats', 'Heroes']].map(([t, n]) => `<button class="tab ${tab === t ? 'on' : ''}" data-tab="${t}">${n}</button>`).join('')}</div></div>
      ${levelBarHTML()}<div class="lib-body"></div>`;
    $$('.tab', page).forEach((b) => (b.onclick = () => { tab = b.dataset.tab; draw(); }));
    const body = $('.lib-body', page);
    if (tab === 'history') {
      if (!p.history.length) body.appendChild(el('p', 'sub', 'No runs yet. Your descents will be recorded here.'));
      const list = el('div', 'history-list');
      p.history.forEach((h) => {
        const ch = CHARACTERS[h.char] || CHARACTERS.lampwright;
        const d = new Date(h.date);
        list.appendChild(el('div', 'history-row ' + (h.won ? 'won' : 'lost'), `
          <span class="h-icon">${ch.icon}</span>
          <div class="h-main"><b>${h.won ? '🌅 Victory' : `Fell in Act ${h.act}, floor ${h.floor}`}</b>
            <small>${ch.short}${h.depth ? ` · Depth ${h.depth}` : ''}${h.daily ? ' · 📅 Daily' : ''}${h.seed && !h.daily ? ` · Seed "${esc(h.seed)}"` : ''}${h.killedBy ? ` · Slain by ${esc(h.killedBy)}` : ''}</small></div>
          <div class="h-score"><b>${h.score}</b><small>${d.toLocaleDateString()}</small></div>`));
      });
      body.appendChild(list);
    } else if (tab === 'ach') {
      const ids = Object.keys(ACHIEVEMENTS);
      const got = ids.filter((k) => p.ach[k]).length;
      body.appendChild(el('p', 'sub', `${got} / ${ids.length} unlocked`));
      const grid = el('div', 'info-grid');
      ids.forEach((k) => {
        const A = ACHIEVEMENTS[k];
        grid.appendChild(el('div', 'info-item ach-item' + (p.ach[k] ? ' got' : ''), `<span class="big-icon">${p.ach[k] ? A.icon : '🔒'}</span><div><b>${esc(A.name)}</b><p>${esc(A.desc)}</p>${p.ach[k] ? `<small>${new Date(p.ach[k]).toLocaleDateString()}</small>` : ''}</div>`));
      });
      body.appendChild(grid);
    } else if (tab === 'unlocks') {
      const lv = Profile.level();
      const list = el('div', 'history-list');
      LEVELS.forEach((L, i) => {
        if (!i) return;
        list.appendChild(el('div', 'history-row ' + (lv >= i ? 'won' : 'lost'), `<span class="h-icon">${lv >= i ? '🔓' : '🔒'}</span>
          <div class="h-main"><b>Lantern Level ${i}</b><small>${esc(L.unlock)}</small></div><div class="h-score"><b>${L.xp}</b><small>XP</small></div>`));
      });
      body.appendChild(list);
      body.appendChild(el('p', 'sub', 'Every run earns experience equal to its score, win or lose. Winning also unlocks the next Depth for that hero.'));
    } else {
      const grid = el('div', 'hero-stats');
      for (const [id, ch] of Object.entries(CHARACTERS)) {
        grid.appendChild(el('div', 'hero-stat', `<div class="mini-portrait">${ch.portrait()}</div><b>${ch.name}</b>
          <div class="hs-row"><span>Runs</span><b>${p.runs[id] || 0}</b></div>
          <div class="hs-row"><span>Wins</span><b>${p.wins[id] || 0}</b></div>
          <div class="hs-row"><span>Win streak</span><b>${p.streak[id] || 0}</b></div>
          <div class="hs-row"><span>Best streak</span><b>${p.bestStreak[id] || 0}</b></div>
          <div class="hs-row"><span>Max Depth</span><b>${Profile.maxDepth(id)}</b></div>`));
      }
      body.appendChild(grid);
    }
    page.appendChild(button('Back', showTitle, 'btn big back'));
  };
  draw();
  setScreen(page);
}

function showHelp() {
  const box = el('div', 'help');
  box.innerHTML = `
    <h2>How to Play</h2>
    <p>Choose a hero and descend through three acts to snuff out the Devouring Night. Pick your path on the map, fight, and build your deck as you go.</p>
    <h3>Combat</h3>
    <ul>
      <li>Each turn you get <b>3 Energy</b> and draw <b>5 cards</b>. Cards cost Energy (top-left number).</li>
      <li><b>Click</b> a card to select it, then click an enemy (or click the card again / the battlefield for cards without a target). You can also <b>drag</b> cards.</li>
      <li>Enemies show their <b>intent</b> above their heads: ⚔️ attack, 🛡️ defend, ⬆️ buff, 🌀 debuff. Plan around it!</li>
      <li><b>Ward</b> blocks damage, but disappears at the start of your next turn.</li>
      <li>Shortcuts: <b>1-9</b> select cards, <b>E</b> ends your turn, <b>Esc</b>/right-click cancels.</li>
    </ul>
    ${Object.values(CHARACTERS).map((ch) => `<h3>${ch.icon} ${ch.name}</h3><ul>${ch.mechanics.map(([i, n, d]) => `<li>${i} <b>${n}</b>: ${d}</li>`).join('')}</ul>`).join('')}
    <ul><li>💪 <b>Might</b> boosts every Attack. 🪨 <b>Fortitude</b> boosts every Ward card.</li></ul>
    <h3>The map</h3>
    <ul>
      <li>⚔️ Enemy · 😈 Elite (drops a Curio) · ❓ Unknown event · 🔥 Hearth (heal or upgrade) · 🛒 Peddler (shop) · 🧰 Treasure.</li>
      <li>Defeat the boss at the top to reach the next act. Win all three acts to bring back the dawn.</li>
    </ul>
    <h3>Progress</h3>
    <ul>
      <li>Every run earns <b>experience</b>, raising your <b>Lantern Level</b> and unlocking new heroes, cards and curios.</li>
      <li>Win a run to unlock the next <b>Depth</b> (difficulty) for that hero. Each Depth adds one new challenge.</li>
      <li>The <b>Daily Descent</b> gives everyone the same hero and map each day. Compare scores with your friends!</li>
    </ul>`;
  box.appendChild(button('Replay the tutorial in my next fight', () => { Tutorial.reset(); toast('The tutorial will show in your next fight.'); }, 'btn ghost'));
  box.appendChild(button('Got it', closeOverlay));
  openOverlay(box);
}

function showSoundSettings() {
  const box = el('div', 'menu-box');
  box.innerHTML = '<h2>Sound</h2>';
  box.appendChild(audioSettingsEl());
  box.appendChild(button('Done', closeOverlay));
  openOverlay(box);
}

function showMenu() {
  const box = el('div', 'menu-box');
  box.innerHTML = '<h2>Menu</h2>';
  box.appendChild(button('Resume', closeOverlay));
  const sp = button(`Animation speed: ${Game.speed < 1 ? 'Fast' : 'Normal'}`, () => { setSpeed(Game.speed < 1 ? 1 : 0.5); sp.textContent = `Animation speed: ${Game.speed < 1 ? 'Fast' : 'Normal'}`; }, 'btn');
  box.appendChild(sp);
  box.appendChild(audioSettingsEl());
  box.appendChild(button('How to Play', () => { closeOverlay(); showHelp(); }, 'btn'));
  box.appendChild(button('Save & Quit to Title', () => { closeOverlay(); saveRun(); showTitle(); }, 'btn'));
  box.appendChild(button('Abandon Run', () => {
    if (!confirm('Abandon this run? All progress will be lost.')) return;
    closeOverlay(); clearSave(); showTitle();
  }, 'btn danger'));
  openOverlay(box);
}

// ---------- Neow-style opening: The Ferryman ----------
function showFerryman() {
  Sound.music('map');
  const run = Game.run;
  run.pending = { type: 'ferryman' };
  saveRun();
  const page = actStyle(el('div', 'event-screen'));
  page.innerHTML = `${embers(16)}<div class="event-art">🛶</div>
    <h1>The Ferryman</h1>
    <p class="event-text">At the edge of the abyss a hooded ferryman waits beside a boat of black wood. He studies your lantern for a long moment.<br><br>
    <i>"Few come this far down. Take a gift, ${currentChar().short}. You will need it."</i></p>
    <div class="event-options"></div>`;
  const opts = $('.event-options', page);
  const done = () => { run.pending = null; saveRun(); showMap(); };
  const choices = [
    { label: 'Choose a card', desc: 'Choose 1 of 3 uncommon cards to add to your deck.',
      act: async () => { await offerCards(pickN(cardPool('uncommon'), 3).map((id) => makeCard(id)), 'Choose a gift'); done(); } },
    { label: 'Lighten your load', desc: 'Remove a card from your deck.',
      act: async () => { if (await chooseRemoveCard()) done(); } },
    { label: 'Ferryman\'s blessing', desc: 'Raise your Max HP by 10.',
      act: async () => { run.maxHp += 10; run.hp += 10; toast('Max HP +10'); done(); } },
    { label: 'A dangerous bargain', desc: 'Lose 10 HP. Choose 1 of 3 rare cards.',
      act: async () => { loseHp(10); await offerCards(pickN(cardPool('rare'), 3).map((id) => makeCard(id)), 'Choose a rare card'); done(); } },
    { label: 'A token from the deep', desc: 'Obtain a random common Curio.',
      act: async () => { obtainRelic(pick(relicPool('common'))); done(); } },
  ];
  pickN(choices.slice(0, 4), 3).concat(choices[4]).forEach((c) => {
    const b = el('button', 'event-option', `<b>${c.label}</b><span>${c.desc}</span>`);
    b.onclick = c.act;
    opts.appendChild(b);
  });
  setScreen(page);
  renderTopbar(true);
}

function showActIntro() {
  Sound.music('map');
  const run = Game.run;
  const act = ACTS[run.act - 1];
  const page = actStyle(el('div', 'act-intro'));
  page.innerHTML = `${embers(30)}<h2>${act.subtitle}</h2><h1>${act.name}</h1><p>Your wounds close as you descend deeper. (HP fully restored)</p>`;
  page.appendChild(button('Descend', showMap, 'btn big primary'));
  setScreen(page);
  renderTopbar(true);
}

// ---------- Rewards ----------
function showRewards(r, onDone, title = 'Victory!') {
  Sound.music('map');
  const page = actStyle(el('div', 'reward-screen'));
  const items = [];
  if (r.gold && !hasRelic('hollow')) items.push({ icon: '🪙', label: `${r.gold} Gold`, take: async () => { gainGold(r.gold); return true; } });
  if (r.potion) items.push({ icon: POTIONS[r.potion].icon, label: POTIONS[r.potion].name, tip: POTIONS[r.potion].desc, take: async () => obtainPotion(r.potion) });
  if (r.relic) items.push({ icon: RELICS[r.relic].icon, label: RELICS[r.relic].name, tip: RELICS[r.relic].desc, take: async () => { obtainRelic(r.relic); return true; } });
  if (r.cards) items.push({ icon: '🃏', label: 'Add a card to your deck', take: async () => !!(await offerCards(r.cards, 'Choose a card')) });
  const draw = () => {
    page.innerHTML = `${embers(14)}<h1>${title}</h1><div class="reward-list"></div>`;
    const list = $('.reward-list', page);
    items.forEach((it, i) => {
      const b = el('button', 'reward-item', `<span class="ri-icon">${it.icon}</span><span>${esc(it.label)}</span>`);
      if (it.tip) b.dataset.tip = esc(it.tip);
      b.onclick = async () => { if (await it.take()) { items.splice(i, 1); saveRun(); draw(); } };
      list.appendChild(b);
    });
    page.appendChild(button(items.length ? 'Skip remaining & Proceed' : 'Proceed', onDone, 'btn big primary'));
  };
  draw();
  setScreen(page);
  renderTopbar(true);
}

function showBossReward() {
  const run = Game.run;
  run.pending = { type: 'bossReward', rewards: {} };
  saveRun();
  const page = actStyle(el('div', 'reward-screen'));
  const pool = pickN(relicPool('boss'), 3);
  page.innerHTML = `${embers(20)}<h1>Boss Treasure</h1><p class="sub">Choose a powerful Boss Curio.</p><div class="boss-relics"></div>`;
  const list = $('.boss-relics', page);
  pool.forEach((id) => {
    const R = RELICS[id];
    const b = el('button', 'boss-relic', `<span class="br-icon">${R.icon}</span><b>${esc(R.name)}</b><span>${esc(R.desc)}</span>`);
    b.onclick = () => { obtainRelic(id); nextAct(); };
    list.appendChild(b);
  });
  page.appendChild(button('Skip', nextAct, 'btn ghost'));
  setScreen(page);
  renderTopbar(true);
}

// ---------- Hearth (rest site) ----------
function showRest() {
  Sound.music('rest');
  const run = Game.run;
  const page = actStyle(el('div', 'rest-screen'));
  const heal = Math.floor(run.maxHp * (depthOn(5) ? 0.25 : 0.3)) + (hasRelic('pillow') ? 15 : 0);
  page.innerHTML = `${embers(36)}<div class="campfire">🔥</div><h1>The Hearth</h1>
    <p class="sub">A rare warm place in the dark. Your lantern drinks in the heat.</p><div class="rest-options"></div>`;
  const opts = $('.rest-options', page);
  const finish = (msg) => {
    opts.innerHTML = `<p class="sub">${msg}</p>`;
    opts.appendChild(button('Proceed', completeNode, 'btn big primary'));
    renderTopbar(true);
  };
  const rest = el('button', 'rest-option', `<span>😴</span><b>Rest</b><small>Heal ${heal} HP</small>`);
  if (hasRelic('crown')) { rest.disabled = true; rest.dataset.tip = 'The Ember Crown forbids rest.'; }
  rest.onclick = () => { const before = run.hp; healRun(heal); finish(`You rest by the fire and recover ${run.hp - before} HP.`); };
  const temper = el('button', 'rest-option', `<span>⚒️</span><b>Temper</b><small>Upgrade a card</small>`);
  if (!run.deck.some(canUpgrade)) temper.disabled = true;
  temper.onclick = async () => { const c = await chooseUpgradeCard(); if (c) finish(`You temper <b>${esc(cardName(c))}</b> in the flames.`); };
  opts.append(rest, temper);
  if (rest.disabled && temper.disabled) opts.appendChild(button('Leave', completeNode, 'btn ghost'));
  setScreen(page);
  renderTopbar(true);
}

// ---------- Treasure ----------
function showTreasure() {
  Sound.music('map');
  const page = actStyle(el('div', 'treasure-screen'));
  page.innerHTML = `${embers(16)}<h1>Treasure</h1><p class="sub">An old chest, sealed with wax and rust.</p>`;
  const chest = el('button', 'chest', '🧰');
  chest.dataset.tip = 'Open the chest';
  chest.onclick = () => {
    chest.disabled = true;
    Sound.play('chest');
    chest.classList.add('open');
    const relic = randomRelic([['common', 49], ['uncommon', 42], ['rare', 9]]);
    const gold = chance(0.5) ? rand(20, 40) : 0;
    setTimeout(() => showRewards({ relic, gold }, completeNode, 'Treasure!'), 500);
  };
  page.appendChild(chest);
  setScreen(page);
}

// ---------- Events ----------
function showEvent(id) {
  Sound.music('map');
  const run = Game.run;
  const ev = EVENTS[id];
  const page = actStyle(el('div', 'event-screen'));
  page.innerHTML = `${embers(12)}<div class="event-art">${ev.art}</div><h1>${esc(ev.name)}</h1><p class="event-text">${esc(ev.text)}</p><div class="event-options"></div>`;
  const opts = $('.event-options', page);
  let busy = false;
  ev.options(run).forEach((o) => {
    const b = el('button', 'event-option', `<b>${esc(o.label)}</b><span>${esc(o.desc)}</span>`);
    b.disabled = !!o.disabled;
    b.onclick = async () => {
      if (busy) return;
      busy = true;
      const res = await o.action();
      busy = false;
      renderTopbar(true);
      const text = typeof res === 'string' ? res : res.text;
      $('.event-text', page).innerHTML = esc(text);
      opts.innerHTML = '';
      if (res && res.fight) {
        run.pending = { type: 'mimic', encounter: res.fight };
        saveRun();
        opts.appendChild(button('Fight!', () => startCombat(res.fight, 'elite'), 'btn big danger'));
      } else {
        run.pending = null;
        saveRun();
        opts.appendChild(button('Continue', completeNode, 'btn big primary'));
      }
    };
    opts.appendChild(b);
  });
  setScreen(page);
  renderTopbar(true);
}

// ---------- Shop ----------
function showShop() {
  Sound.music('shop');
  const run = Game.run;
  if (!run.pending.stock) run.pending.stock = makeShopStock();
  saveRun();
  const stock = run.pending.stock;
  const disc = (hasRelic('token') ? 0.8 : 1) * (depthOn(9) ? 1.15 : 1);
  const price = (p) => Math.round(p * disc);
  const page = actStyle(el('div', 'shop-screen'));
  const buy = (cost, fn) => {
    if (run.gold < cost) { toast('Not enough gold!'); Sound.play('error'); return; }
    if (fn() === false) return;
    Sound.play('spend');
    run.gold -= cost;
    saveRun();
    draw();
  };
  const draw = () => {
    page.innerHTML = `<div class="shop-head"><div class="merchant">🧙‍♂️</div><div><h1>The Wandering Peddler</h1>
      <p class="sub">"Light's dear down here, friend. But I've got just the thing..."</p></div></div>
      <div class="shop-cards"></div><div class="shop-row"><div class="shop-relics"></div><div class="shop-potions"></div><div class="shop-remove"></div></div>`;
    const cards = $('.shop-cards', page);
    stock.cards.forEach((s, i) => {
      const slot = el('div', 'shop-item card-item' + (s.sold ? ' sold' : ''));
      slot.appendChild(cardEl(s.card));
      const p = price(s.price);
      slot.appendChild(el('div', 'price' + (s.sale ? ' sale' : '') + (run.gold < p ? ' poor' : ''), `🪙 ${p}${s.sale ? ' <small>SALE</small>' : ''}`));
      if (!s.sold) slot.onclick = () => buy(p, () => { run.deck.push(s.card); s.sold = true; toast(`Bought <b>${esc(cardName(s.card))}</b>`); });
      cards.appendChild(slot);
    });
    const relics = $('.shop-relics', page);
    relics.innerHTML = '<h3>Curios</h3>';
    stock.relics.forEach((s) => {
      const R = RELICS[s.id];
      const p = price(s.price);
      const b = el('button', 'shop-item relic-item' + (s.sold ? ' sold' : ''), `<span class="big-icon">${R.icon}</span><div class="price${run.gold < p ? ' poor' : ''}">🪙 ${p}</div>`);
      b.dataset.tip = `<b>${esc(R.name)}</b><br>${esc(R.desc)}`;
      if (!s.sold) b.onclick = () => buy(p, () => { obtainRelic(s.id); s.sold = true; });
      relics.appendChild(b);
    });
    const pots = $('.shop-potions', page);
    pots.innerHTML = '<h3>Tonics</h3>';
    stock.potions.forEach((s) => {
      const P = POTIONS[s.id];
      const p = price(s.price);
      const b = el('button', 'shop-item potion-item' + (s.sold ? ' sold' : ''), `<span class="big-icon" style="filter:hue-rotate(${P.hue}deg)">${P.icon}</span><div class="price${run.gold < p ? ' poor' : ''}">🪙 ${p}</div>`);
      b.dataset.tip = `<b>${esc(P.name)}</b><br>${esc(P.desc)}`;
      if (!s.sold) b.onclick = () => buy(p, () => { if (!obtainPotion(s.id)) return false; s.sold = true; });
      pots.appendChild(b);
    });
    const rem = $('.shop-remove', page);
    rem.innerHTML = '<h3>Services</h3>';
    const rp = price(run.removeCost);
    const rb = el('button', 'shop-item remove-item' + (stock.removed ? ' sold' : ''), `<span class="big-icon">✂️</span><b>Remove a card</b><div class="price${run.gold < rp ? ' poor' : ''}">🪙 ${rp}</div>`);
    rb.dataset.tip = 'Remove a card from your deck. Price rises each time.';
    if (!stock.removed) rb.onclick = async () => {
      if (run.gold < rp) return toast('Not enough gold!');
      if (await chooseRemoveCard()) { run.gold -= rp; run.removeCost += 25; stock.removed = true; saveRun(); draw(); }
    };
    rem.appendChild(rb);
    page.appendChild(button('Leave', completeNode, 'btn big primary leave'));
    renderTopbar(true);
  };
  draw();
  setScreen(page);
}

function makeShopStock() {
  const prices = { common: [45, 55], uncommon: [68, 82], rare: [135, 160] };
  const used = new Set();
  const cardOf = (type) => {
    const rarity = weighted([['common', 54], ['uncommon', 37], ['rare', 9]]);
    let pool = cardPool(rarity).filter((id) => CARDS[id].type === type && !used.has(id));
    if (!pool.length) pool = ['common', 'uncommon', 'rare'].flatMap((r) => cardPool(r)).filter((id) => CARDS[id].type === type && !used.has(id));
    const id = pick(pool);
    used.add(id);
    const r = CARDS[id].rarity;
    return { card: makeCard(id), price: rand(...prices[r]) };
  };
  const cards = [cardOf('attack'), cardOf('attack'), cardOf('skill'), cardOf('skill'), cardOf('power')];
  const sale = pick(cards);
  sale.price = Math.round(sale.price / 2);
  sale.sale = true;
  const relicIds = new Set();
  const relics = [];
  for (let i = 0; i < 3; i++) {
    let id = null;
    for (let t = 0; t < 10 && (!id || relicIds.has(id)); t++) id = randomRelic([['common', 50], ['uncommon', 35], ['rare', 15]]);
    if (!id || relicIds.has(id)) continue;
    relicIds.add(id);
    const base = { common: 150, uncommon: 240, rare: 290 }[RELICS[id].rarity];
    relics.push({ id, price: Math.round(base * (0.92 + rng() * 0.16)) });
  }
  const potions = [0, 1, 2].map(() => { const id = randomPotion(); return { id, price: POTIONS[id].rarity === 'common' ? rand(48, 56) : rand(70, 80) }; });
  return { cards, relics, potions, removed: false };
}

// ---------- Game over ----------
function showGameOver(won) {
  Sound.music(won ? 'dawn' : 'gameover');
  const run = Game.run;
  closeOverlay();
  const res = finishRun(won);
  const page = el('div', 'gameover ' + (won ? 'won' : 'lost'));
  const st = run.stats;
  const ch = currentChar();
  const newAch = (run.newAch || []).filter((k, i, a) => a.indexOf(k) === i);
  const unlocks = [];
  for (let i = res.levelBefore + 1; i <= res.levelAfter; i++) unlocks.push(LEVELS[i].unlock);
  page.innerHTML = `${embers(won ? 60 : 10)}
    <div class="go-icon">${won ? '🌅' : '🕯️'}</div>
    <h1>${won ? 'The Dawn Returns' : 'Your Light Fades...'}</h1>
    <p class="sub">${won ? `Umbra is no more. ${ch.name} climbs back toward a sky that is, at last, turning gold.` : `You fell in ${ACTS[run.act - 1].name}, on floor ${run.floor}${run.lastFight ? `, to ${esc(run.lastFight)}` : ''}.`}</p>
    ${run.depth ? `<p class="go-depth">Depth ${run.depth}: ${esc(DEPTHS[run.depth].name)}</p>` : ''}
    <div class="stats">
      <div><b>${st.floors}</b><span>Floors</span></div>
      <div><b>${st.kills}</b><span>Enemies slain</span></div>
      <div><b>${st.elites}</b><span>Elites</span></div>
      <div><b>${st.cardsPlayed}</b><span>Cards played</span></div>
      <div><b>${st.gold}</b><span>Gold earned</span></div>
      <div class="score"><b>${res.score}</b><span>Score</span></div>
    </div>
    <div class="go-xp">+${res.score} XP ${levelBarHTML(res.xpAfter)}</div>
    ${unlocks.map((u) => `<div class="go-unlock">🔓 <b>Unlocked:</b> ${esc(u)}</div>`).join('')}
    ${res.depthUnlocked ? `<div class="go-unlock">🕳️ <b>Depth ${res.depthUnlocked}</b> unlocked for ${ch.short}: ${esc(DEPTHS[res.depthUnlocked].name)}</div>` : ''}
    ${newAch.length ? `<div class="go-ach">${newAch.map((k) => `<span data-tip="${esc(ACHIEVEMENTS[k].desc)}">${ACHIEVEMENTS[k].icon} ${esc(ACHIEVEMENTS[k].name)}</span>`).join('')}</div>` : ''}
    <div class="deck-fan"></div>`;
  // the final deck, fanned out
  const fan = $('.deck-fan', page);
  const deck = sortDeck(run.deck);
  const n = deck.length;
  deck.forEach((c, i) => {
    const off = i - (n - 1) / 2;
    const node = cardEl(c);
    node.classList.add('fan-card');
    node.style.setProperty('--rot', `${off * Math.min(5, 70 / n)}deg`);
    node.style.setProperty('--dy', `${Math.abs(off) * Math.abs(off) * Math.min(1.2, 30 / n)}px`);
    node.style.setProperty('--i', i);
    node.style.marginLeft = i ? `${-Math.max(70, 150 - 900 / n)}px` : '0';
    fan.appendChild(node);
  });
  if (run.daily) {
    const text = `Lanternfall Daily ${run.daily} · ${ch.short} · ${won ? 'Victory!' : `Act ${run.act}, floor ${run.floor}`} · Score ${res.score}`;
    page.appendChild(button('📋 Copy result to share', () => {
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast('Copied! Paste it to your friends.'), () => toast(text, 6000));
    }, 'btn'));
  }
  if (Profile.level() > res.levelBefore) setTimeout(() => Sound.play('levelUp'), 600);
  page.appendChild(button('Return to Title', showTitle, 'btn big primary'));
  setScreen(page);
  renderTopbar(true);
}

// ---------- Library ----------
function showLibrary() {
  const page = el('div', 'library');
  let tab = 'cards', filter = 'all', showUp = false, who = 'lampwright';
  const draw = () => {
    page.innerHTML = `<div class="lib-head"><h1>Library</h1>
      <div class="tabs">${['cards', 'curios', 'tonics', 'bestiary'].map((t) => `<button class="tab ${tab === t ? 'on' : ''}" data-tab="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div></div>
      <div class="lib-filters"></div><div class="lib-body"></div>`;
    $$('.tab', page).forEach((b) => (b.onclick = () => { tab = b.dataset.tab; draw(); }));
    const body = $('.lib-body', page);
    const filters = $('.lib-filters', page);
    if (tab === 'cards') {
      const whoRow = el('div', 'lib-who');
      for (const [id, ch] of Object.entries(CHARACTERS)) {
        const b = el('button', 'chip who' + (who === id ? ' on' : ''), `${ch.icon} ${ch.short}`);
        b.onclick = () => { who = id; draw(); };
        whoRow.appendChild(b);
      }
      filters.before(whoRow);
      ['all', 'starter', 'common', 'uncommon', 'rare', 'attack', 'skill', 'power', 'special'].forEach((f) => {
        const b = el('button', 'chip' + (filter === f ? ' on' : ''), f);
        b.onclick = () => { filter = f; draw(); };
        filters.appendChild(b);
      });
      const up = el('label', 'chip toggle', `<input type="checkbox" ${showUp ? 'checked' : ''}> Show upgraded`);
      $('input', up).onchange = (e) => { showUp = e.target.checked; draw(); };
      filters.appendChild(up);
      const order = { starter: 0, common: 1, uncommon: 2, rare: 3, special: 4 };
      const ids = Object.keys(CARDS).filter((id) => {
        const d = CARDS[id];
        if (d.char && d.char !== who) return false;
        if (id === 'moonShard' && who !== 'moonblade') return false;
        return filter === 'all' || d.rarity === filter || d.type === filter;
      }).sort((a, b) => order[CARDS[a].rarity] - order[CARDS[b].rarity] || CARDS[a].name.localeCompare(CARDS[b].name));
      const grid = el('div', 'card-grid');
      ids.forEach((id) => {
        const s = el('div', 'card-slot static');
        s.appendChild(cardEl({ id, up: showUp && CARDS[id].rarity !== 'special' }));
        if (!isUnlocked(CARDS[id])) { s.classList.add('locked-card'); s.appendChild(el('div', 'lock-badge', `🔒 Lantern Level ${CARDS[id].unlock}`)); }
        grid.appendChild(s);
      });
      body.appendChild(el('p', 'sub', `${ids.length} cards`));
      body.appendChild(grid);
    } else if (tab === 'curios') {
      const grid = el('div', 'info-grid');
      for (const rar of ['starter', 'common', 'uncommon', 'rare', 'boss']) {
        Object.keys(RELICS).filter((k) => RELICS[k].rarity === rar).forEach((k) => {
          const R = RELICS[k];
          const lk = !isUnlocked(R) ? ` <small>🔒 Lantern Level ${R.unlock}</small>` : '';
          grid.appendChild(el('div', 'info-item r-' + rar + (lk ? ' locked' : ''), `<span class="big-icon">${R.icon}</span><div><b>${esc(R.name)}</b> <small>${rar}${R.char ? " · " + CHARACTERS[R.char].short + " only" : ""}</small>${lk}<p>${esc(R.desc)}</p></div>`));
        });
      }
      body.appendChild(grid);
    } else if (tab === 'tonics') {
      const grid = el('div', 'info-grid');
      Object.keys(POTIONS).forEach((k) => {
        const P = POTIONS[k];
        grid.appendChild(el('div', 'info-item', `<span class="big-icon" style="filter:hue-rotate(${P.hue}deg)">${P.icon}</span><div><b>${esc(P.name)}</b>${P.char ? ` <small>${CHARACTERS[P.char].short} only</small>` : ""}<p>${esc(P.desc)}</p></div>`));
      });
      body.appendChild(grid);
    } else {
      ACTS.forEach((act, ai) => {
        body.appendChild(el('h2', 'act-title', `${act.subtitle}: ${act.name}`));
        const ids = [...new Set([...act.easy, ...act.hard, ...act.elites, ...act.bosses].flat())];
        if (ai === 1) ids.push('sporeling');
        const grid = el('div', 'info-grid');
        ids.forEach((id) => {
          const E = ENEMIES[id];
          const tag = E.boss ? 'boss' : E.elite ? 'elite' : 'normal';
          const moves = Object.values(E.moves).map((m) => m.name).join(', ');
          const art = ENEMY_ART[id];
          grid.appendChild(el('div', 'info-item r-' + tag, `${art ? `<span class="big-icon art">${art()}</span>` : `<span class="big-icon" style="${E.filter ? 'filter:' + E.filter : ''}">${E.sprite}</span>`}<div><b>${esc(E.name)}</b> <small>${tag} · ${E.hp[0]}${E.hp[1] !== E.hp[0] ? '-' + E.hp[1] : ''} HP</small><p>${esc(moves)}</p></div>`));
        });
        body.appendChild(grid);
      });
    }
    page.appendChild(button('Back', showTitle, 'btn big back'));
  };
  draw();
  setScreen(page);
}

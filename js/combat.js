// ===== Combat engine =====
'use strict';

class Combat {
  constructor(encounter, kind) {
    const run = Game.run;
    this.run = run;
    this.kind = kind; // 'fight' | 'elite' | 'boss'
    this.player = { isPlayer: true, uid: 'p', name: currentChar().name, hp: run.hp, maxHp: run.maxHp, block: 0, statuses: {} };
    this.enemies = [];
    this.knight = null; // Cassandra's Knight in Shining Armor (summoned during combat)
    this.drawPile = [];
    this.hand = [];
    this.discardPile = [];
    this.exhaustPile = [];
    this.turn = 0;
    this.energy = 0;
    this.phase = 'start';
    this.over = false;
    this.finished = false;
    this.result = null;
    this.busy = true;
    this.turnCounts = { attack: 0, skill: 0, power: 0, cards: 0 };
    this.justApplied = new Set();
    this.cardBonus = 0;
    this.selected = null;
    this.potionSel = null;
    this.chooser = null;
    this.hoverTarget = null;
    this.uidCounter = 0;
    this.root = null;
    for (const id of encounter) this.spawn(id);
    // Build the draw pile (the top of the pile is the END of the array)
    const deck = shuffle(run.deck.map((c) => ({ ...c })));
    const innate = deck.filter((c) => cardFlag(c, 'innate'));
    this.drawPile = deck.filter((c) => !cardFlag(c, 'innate')).concat(innate);
  }

  // ---------- Setup ----------
  spawn(id, opts = {}) {
    const def = ENEMIES[id];
    let hp = opts.hp != null ? opts.hp : rand(def.hp[0], def.hp[1]);
    if (opts.hp == null) {
      const mult = def.boss ? (depthOn(3) ? 1.15 : 1) : def.elite ? (depthOn(1) ? 1.2 : 1) : (depthOn(2) ? 1.1 : 1);
      hp = Math.round(hp * mult);
    }
    const e = { uid: 'e' + (++this.uidCounter), id, def, name: def.name, hp, maxHp: hp, block: 0, statuses: {},
      history: [], turns: 0, dead: false, minion: !!opts.minion, intent: null };
    if (e.minion) e.statuses.minion = 1;
    if (def.init) def.init(this, e);
    if (opts.index != null) this.enemies.splice(opts.index, 0, e); else if (opts.minion) this.enemies.unshift(e); else this.enemies.push(e);
    if (this.root) {
      e.el = this.entityEl(e);
      const side = $('.enemy-side', this.root);
      const next = this.enemies[this.enemies.indexOf(e) + 1];
      if (next && next.el && next.el.parentNode === side) side.insertBefore(e.el, next.el); else side.appendChild(e.el);
      e.el.classList.add('spawned');
      Sound.play(opts.minion ? 'summon' : 'split');
    }
    if (opts.roll) this.rollIntent(e);
    return e;
  }

  async begin() {
    this.mount();
    for (const e of this.enemies) this.rollIntent(e);
    this.startHp = this.player.hp;
    this.tonicsUsed = 0;
    this.explosions = 0;
    if (this.kind === 'boss') await this.bossIntro();
    for (const r of this.run.relics) if (RELICS[r.id].onCombatStart) await RELICS[r.id].onCombatStart(this, r);
    if (depthOn(8)) for (const e of this.alive()) if (!e.def.elite && !e.def.boss) this.apply(e, 'might', 1, e, true);
    this.render();
    await sleep(350);
    if (typeof Tutorial !== 'undefined') Tutorial.maybeStart(this);
    await this.startTurn();
  }

  maxEnergy() { return 3 + this.run.relics.reduce((s, r) => s + (RELICS[r.id].energy || 0), 0); }
  alive() { return this.enemies.filter((e) => !e.dead); }
  glow() { return this.player.statuses.glow || 0; }
  spendGlow() { const g = this.glow(); delete this.player.statuses.glow; this.renderEntity(this.player); return g; }

  // ---------- Turn flow ----------
  async startTurn() {
    if (this.over) return;
    this.turn++;
    this.phase = 'player';
    this.turnCounts = { attack: 0, skill: 0, power: 0, cards: 0 };
    const p = this.player;
    if (this.turn > 1 && !p.statuses.lanternShell) p.block = 0;
    this.energy = this.maxEnergy();
    if (this.turn === 1 && hasRelic('spareOil')) this.energy += 1;
    if (p.statuses.nextEnergy) { this.energy += p.statuses.nextEnergy; delete p.statuses.nextEnergy; }
    this.banner('Your Turn');
    Sound.play('turn');
    await this.tickStart(p);
    if (await this.checkOver()) return;
    for (const r of this.run.relics) if (RELICS[r.id].onTurnStart) await RELICS[r.id].onTurnStart(this, r);
    let n = 5 + (p.statuses.wellspring || 0) + (hasRelic('eyes') ? 1 : 0);
    if (this.turn === 1 && hasRelic('dice')) n += 2;
    if ((this.turn === 2 || this.turn === 3) && hasRelic('hourglass')) n += 2;
    await this.drawCards(n);
    this.busy = false;
    this.render();
    await this.checkOver();
  }

  async endTurn() {
    if (this.busy || this.phase !== 'player' || this.over || this.chooser) return;
    this.busy = true;
    this.selected = null;
    this.potionSel = null;
    this.render();
    await this.tickEnd(this.player);
    for (const r of this.run.relics) if (RELICS[r.id].onTurnEnd) await RELICS[r.id].onTurnEnd(this, r);
    if (await this.checkOver()) return;
    for (const c of this.hand.slice()) {
      const d = cardDef(c);
      if (d.onEndTurnInHand) { await d.onEndTurnInHand(this, c); await sleep(150); if (this.over) break; }
    }
    if (await this.checkOver()) return;
    this.animateDiscardHand();
    for (const c of this.hand) (cardFlag(c, 'ethereal') ? this.exhaustPile : this.discardPile).push(c);
    this.hand = [];
    this.phase = 'enemy';
    this.render();
    this.banner('Enemy Turn');
    Sound.play('enemyTurn');
    await sleep(450);

    for (const e of this.enemies.slice()) {
      if (e.dead) continue;
      e.block = 0;
      this.renderEntity(e);
      await this.tickStart(e);
      if (this.over) break;
      if (e.dead) continue;
      await this.enemyAct(e);
      if (this.over) break;
      if (!e.dead) await this.tickEnd(e);
      if (this.over) break;
    }
    if (await this.checkOver()) return;
    this.endRound();
    for (const e of this.alive()) this.rollIntent(e);
    await this.startTurn();
  }

  async tickStart(ent) {
    for (const k of Object.keys(ent.statuses)) {
      const S = STATUSES[k], n = ent.statuses[k];
      if (!S || !S.onTurnStart || !n) continue;
      await S.onTurnStart(this, ent, n);
      this.renderEntity(ent);
      if (ent.dead || this.over) break;
    }
  }
  async tickEnd(ent) {
    for (const k of Object.keys(ent.statuses)) {
      const S = STATUSES[k], n = ent.statuses[k];
      if (!S || !S.onTurnEnd || !n) continue;
      await S.onTurnEnd(this, ent, n);
      this.renderEntity(ent);
      if (ent.dead || this.over) break;
    }
  }

  endRound() {
    for (const ent of [this.player, ...this.alive()]) {
      for (const k of DURATION_STATUSES) {
        if (!ent.statuses[k]) continue;
        if (this.justApplied.has(ent.uid + ':' + k)) continue;
        ent.statuses[k]--;
        if (ent.statuses[k] <= 0) delete ent.statuses[k];
      }
    }
    this.justApplied.clear();
  }

  // ---------- Enemy AI ----------
  rollIntent(e) {
    if (e.dead) return;
    if (e.splitting) { e.intent = '__split'; return; }
    const h = {
      e, ctx: this, turn: e.turns, chance,
      last: (n = 1) => e.history[e.history.length - n],
      lastTwo: (k) => e.history[e.history.length - 1] === k && e.history[e.history.length - 2] === k,
      allies: () => this.alive().filter((a) => a !== e),
    };
    const k = e.def.ai(h);
    e.intent = k;
    e.history.push(k);
    e.turns++;
  }

  async enemyAct(e) {
    if (e.intent === '__split') return this.doSplit(e);
    const m = e.def.moves[e.intent];
    if (!m) return;
    this.float(e, m.name, 'movename');
    e.el.classList.add('acting');
    await sleep(250);
    if (m.dmg) {
      const hits = m.hits || 1;
      for (let i = 0; i < hits; i++) {
        if (this.over || e.dead) break;
        this.lunge(e);
        await this.damage(this.player, this.calcDamage(e, this.player, m.dmg), e, 'attack');
        await sleep(hits > 1 ? 170 : 220);
      }
    }
    if (!this.over && !e.dead) {
      if (m.block) this.gainBlock(e, m.block, false);
      if (m.buff) for (const k in m.buff) this.apply(e, k, m.buff[k], e);
      if (m.buffAll) for (const a of this.alive()) for (const k in m.buffAll) this.apply(a, k, m.buffAll[k], e);
      if (m.debuff) for (const k in m.debuff) this.apply(this.player, k, m.debuff[k], e);
      if (m.cards) for (const c of m.cards) this.addCard(c.id, c.pile, c.n);
      if (m.summon) {
        const cur = this.alive().filter((a) => a.id === m.summon.id).length;
        const n = Math.min(m.summon.n, m.summon.max - cur);
        for (let i = 0; i < n; i++) this.spawn(m.summon.id, { minion: true, roll: true });
      }
      if (m.fn) await m.fn(this, e);
    }
    if (e.el) e.el.classList.remove('acting');
    this.render();
    await sleep(300);
  }

  async doSplit(e) {
    const hp = e.hp;
    const idx = this.enemies.indexOf(e);
    this.float(e, 'Splits!', 'movename');
    await sleep(300);
    this.enemies.splice(idx, 1);
    e.dead = true;
    e.el.remove();
    for (let i = 0; i < 2; i++) this.spawn(e.def.split, { hp, index: idx, roll: true });
    this.render();
    await sleep(300);
  }

  // ---------- Numbers ----------
  calcDamage(src, tgt, base) {
    let d = base + (src.statuses.might || 0) + (src.isPlayer ? this.cardBonus : 0);
    if (src.statuses.sapped) d *= 0.75;
    if (tgt && tgt.statuses.exposed) d *= !tgt.isPlayer && hasRelic('lens') ? 1.75 : 1.5;
    return Math.max(0, Math.floor(d));
  }
  previewDamage(base, target) {
    const saved = this.cardBonus;
    this.cardBonus = this.player.statuses.primed || 0;
    if (!target) { const a = this.alive(); target = this.hoverTarget && !this.hoverTarget.dead ? this.hoverTarget : a.length === 1 ? a[0] : null; }
    const d = this.calcDamage(this.player, target, base);
    this.cardBonus = saved;
    return d;
  }
  calcBlock(ent, n, fromCard) {
    let b = n + (fromCard ? ent.statuses.fortitude || 0 : 0);
    if (ent.statuses.brittle) b *= 0.75;
    return Math.max(0, Math.floor(b));
  }
  previewBlock(n) { return this.calcBlock(this.player, n, true); }

  // ---------- Actions (used by cards, curios, tonics, enemies) ----------
  async attack(t, base, hits = 1) {
    let total = 0;
    for (let i = 0; i < hits; i++) {
      if (!t || t.dead || this.over) break;
      await this.strikeAnim(t);
      total += await this.damage(t, this.calcDamage(this.player, t, base), this.player, 'attack');
      if (hits > 1) await sleep(140);
    }
    return total;
  }
  async attackAll(base) {
    let total = 0;
    this.lunge(this.player);
    Sound.play('swing');
    for (const t of this.alive()) total += await this.damage(t, this.calcDamage(this.player, t, base), this.player, 'attack');
    return total;
  }
  async attackRandom(base, hits = 1) {
    let total = 0;
    for (let i = 0; i < hits; i++) {
      const t = pick(this.alive());
      if (!t || this.over) break;
      await this.strikeAnim(t);
      total += await this.damage(t, this.calcDamage(this.player, t, base), this.player, 'attack');
      await sleep(140);
    }
    return total;
  }

  gainBlock(ent, n, fromCard) {
    if (!ent || ent.dead) return 0;
    const b = this.calcBlock(ent, n, fromCard);
    if (b <= 0) return 0;
    ent.block += b;
    Sound.play('block');
    Fx.at(ent, 'shield');
    this.float(ent, `+${b} 🛡️`, 'block');
    this.renderEntity(ent);
    return b;
  }
  async ward(n) {
    const b = this.gainBlock(this.player, n, true);
    const f = this.player.statuses.flicker;
    if (f) { const t = pick(this.alive()); if (t) { await sleep(100); await this.damage(t, f, this.player, 'power'); } }
    return b;
  }

  async damage(tgt, amount, src = null, kind = 'attack') {
    if (!tgt || tgt.dead) return 0;
    if (this.over && !tgt.isPlayer) return 0;
    amount = Math.max(0, Math.floor(amount));
    if (kind === 'attack' && tgt.statuses.evade && amount > 0) {
      tgt.statuses.evade--; if (tgt.statuses.evade <= 0) delete tgt.statuses.evade;
      this.float(tgt, 'Evaded!', 'buff');
      Sound.play('evade');
      if (tgt.el) { tgt.el.classList.remove('dodge'); void tgt.el.offsetWidth; tgt.el.classList.add('dodge'); }
      this.renderEntity(tgt);
      return 0;
    }
    if (kind === 'attack' && amount > 0) {
      if (tgt.isPlayer) Fx.at(this.knightAlive() ? this.knight : tgt, 'claw');
      else if (!tgt.isKnight) Fx.at(tgt, src && src.isKnight ? 'slash' : currentCharId() === 'moonblade' ? 'moonSlash' : 'slash', { col: src && src.isKnight ? '#ffe9a0' : currentChar().color });
    }
    let blocked = 0;
    if (kind !== 'burn' && kind !== 'hploss') { blocked = Math.min(tgt.block, amount); tgt.block -= blocked; }
    let hpd = amount - blocked;
    if (tgt.isPlayer && kind === 'attack' && hpd > 0 && this.knightAlive()) {
      const k = this.knight, a = Math.min(hpd, k.hp);
      k.hp -= a; hpd -= a;
      this.float(k, `-${a}`, 'dmg');
      this.hitFx(k); Fx.at(k, 'impact');
      Sound.play('blocked');
      if (k.hp <= 0) this.knightFalls();
      this.renderEntity(k);
      const thorns = this.player.statuses.thornCrown;
      if (thorns && src && !src.dead && !src.isPlayer && !this.over) { await sleep(60); await this.damage(src, thorns, k, 'thorns'); }
    }
    if (hpd > 0) {
      tgt.hp -= hpd;
      this.float(tgt, `-${hpd}`, kind === 'burn' ? 'burn' : 'dmg');
      Sound.play(kind === 'burn' ? 'burn' : tgt.isPlayer ? 'hurt' : hpd >= 15 ? 'hitHeavy' : 'hit', { gap: 20, heavy: hpd >= 12, voice: currentCharId() });
      this.hitFx(tgt);
      if (kind === 'burn') Fx.at(tgt, 'fire');
      else Fx.at(tgt, 'impact', { scale: hpd >= 15 ? 1.3 : 1 });
      if (tgt.isPlayer) {
        this.run.stats.damageTaken += hpd; Fx.hurtFlash(hpd >= 12); Fx.shake(this.root, hpd >= 12 ? 12 : 6);
        if (hasRelic('bloodstone') && this.bloodstoneTurn !== this.turn && tgt.hp > 0) { this.bloodstoneTurn = this.turn; this.apply(tgt, 'might', 1, tgt); this.flashRelic('bloodstone'); }
      }
      if (!tgt.isPlayer && src && (src.isPlayer || src.isKnight) && kind === 'attack' && hpd >= 40) unlockAch('bigHit');
      if (!tgt.isPlayer && kind === 'burn' && tgt.hp <= 0) unlockAch('pyre');
      else if (hpd >= 15) Fx.shake(this.root, 7);
    } else if (blocked > 0) {
      this.float(tgt, 'Blocked', 'block');
      Sound.play('blocked');
      Fx.at(tgt, 'shieldHit');
    }
    if (kind === 'attack' && tgt.statuses.bleed && tgt.hp > 0) {
      const b = tgt.statuses.bleed;
      tgt.hp -= b;
      this.float(tgt, `-${b} 🩸`, 'burn');
      Fx.at(tgt, 'bleed');
    }
    if (kind === 'attack' && hpd > 0 && tgt.statuses.coil) {
      const c = tgt.statuses.coil; delete tgt.statuses.coil;
      if (tgt.hp > 0) this.gainBlock(tgt, c, false);
    }
    if (kind === 'attack' && hpd > 0 && tgt.statuses.shell) { tgt.statuses.shell--; if (tgt.statuses.shell <= 0) delete tgt.statuses.shell; }
    if (!tgt.isPlayer && tgt.def.split && !tgt.splitting && tgt.hp > 0 && tgt.hp <= tgt.maxHp / 2) {
      tgt.splitting = true; tgt.intent = '__split'; this.float(tgt, 'Splitting!', 'debuff');
    }
    if (!tgt.isPlayer && tgt.def.boss && !tgt.phase2 && tgt.hp > 0 && tgt.hp <= tgt.maxHp / 2) this.bossPhase2(tgt);
    if (tgt.hp <= 0) {
      if (tgt.isPlayer) await this.playerDying(); else if (tgt.isKnight) this.knightFalls(); else await this.kill(tgt);
    }
    this.renderEntity(tgt);
    if (tgt.isPlayer) renderTopbar();
    if (kind === 'attack' && src && !src.dead && tgt.statuses.spines && !this.over) {
      await sleep(80);
      await this.damage(src, tgt.statuses.spines, tgt, 'thorns');
    }
    return hpd;
  }

  async playerDying() {
    const r = this.run.relics.find((x) => x.id === 'phoenix' && !x.used);
    if (r) {
      r.used = true;
      this.player.hp = Math.floor(this.player.maxHp * 0.5);
      this.float(this.player, 'Reborn from the ashes!', 'heal');
      Sound.play('phoenix');
      renderTopbar(true);
      flashRelicEl('phoenix');
      return;
    }
    this.player.hp = 0;
    this.player.dead = true;
    this.over = true;
    this.result = 'defeat';
  }

  async kill(e) {
    e.dead = true; e.hp = 0; e.block = 0;
    Fx.at(e, 'death');
    if (e.el) { e.el.classList.add('dead'); const node = e.el; setTimeout(() => { if (node.classList.contains('dead')) node.classList.add('gone'); this.fitEnemies(); }, 900); }
    Sound.play('death');
    this.run.stats.kills++;
    if (e.statuses.sporeBurst) this.apply(this.player, 'exposed', e.statuses.sporeBurst, e);
    if (!e.minion && !this.enemies.some((x) => !x.dead && !x.minion)) {
      for (const m of this.alive()) { m.dead = true; if (m.el) m.el.classList.add('dead', 'fled'); this.float(m, 'Flees!', 'movename'); }
    }
    for (const a of this.alive()) if (a.def.onAllyDeath) a.def.onAllyDeath(this, a, e);
    if (!this.alive().length) { this.over = true; this.result = 'victory'; return; }
    for (const r of this.run.relics) if (RELICS[r.id].onEnemyDeath) await RELICS[r.id].onEnemyDeath(this, r, e);
  }

  apply(tgt, id, n, src = this.player, silent = false) {
    if (!tgt || tgt.dead || !n) return;
    const S = STATUSES[id];
    const isDebuff = S.type === 'debuff' || (S.canNeg && n < 0);
    if (isDebuff && tgt.statuses.nullify && !silent && src !== tgt) {
      tgt.statuses.nullify--;
      if (tgt.statuses.nullify <= 0) delete tgt.statuses.nullify;
      this.float(tgt, 'Nullified', 'buff');
      this.renderEntity(tgt);
      return;
    }
    if (id === 'bleed' && src && src.isPlayer && !tgt.isPlayer) n += this.player.statuses.crimsonMoon || 0;
    if (id === 'burn' && src && src.isPlayer && !tgt.isPlayer) n += (this.player.statuses.pyromancy || 0) + (hasRelic('emberCore') ? 1 : 0);
    tgt.statuses[id] = (tgt.statuses[id] || 0) + n;
    if (tgt.statuses[id] === 0 || (tgt.statuses[id] < 0 && !S.canNeg)) delete tgt.statuses[id];
    if (src && !src.isPlayer && tgt.isPlayer && this.phase === 'enemy' && S.duration) this.justApplied.add('p:' + id);
    if (id === 'bleed' && tgt.statuses.bleed >= 20) unlockAch('hemorrhage');
    if (id === 'unstable' && tgt.statuses.unstable >= 10 && !tgt.isPlayer) { this.renderEntity(tgt); this.explode(tgt); return; }
    if (!silent && S.type !== 'info') Sound.play(isDebuff ? (id === 'burn' ? 'ignite' : 'debuff') : S.type === 'power' ? 'power' : 'buff');
    if (!silent && S.type !== 'info') Fx.at(tgt, id === 'burn' ? 'fire' : id === 'bleed' ? 'bleed' : isDebuff ? 'debuff' : S.type === 'power' ? 'power' : 'buff',
      { col: tgt.isPlayer ? currentChar().color : '#ffd76a', glyph: S.icon });
    if (!silent && S.type !== 'info') this.float(tgt, `${S.icon} ${n > 0 && !isDebuff ? '+' : ''}${n} ${S.name}`, isDebuff ? 'debuff' : 'buff');
    this.renderEntity(tgt);
  }
  selfApply(id, n) { this.apply(this.player, id, n, this.player); }
  applyAll(id, n) { for (const e of this.alive()) this.apply(e, id, n, this.player); }

  heal(ent, n) {
    if (!ent || ent.dead || n <= 0) return;
    const before = ent.hp;
    ent.hp = Math.min(ent.maxHp, ent.hp + n);
    if (ent.hp > before) { this.float(ent, `+${ent.hp - before}`, 'heal'); Sound.play('heal'); Fx.at(ent, 'heal'); }
    this.renderEntity(ent);
    if (ent.isPlayer) renderTopbar();
  }
  gainEnergy(n) {
    this.energy += n;
    if (n > 0) { Sound.play('energy'); Fx.at(this.player, 'energy'); const o = this.root && $('.energy-orb', this.root); if (o) { o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); } }
    this.render();
  }

  addCard(id, pile, n = 1, up = false) {
    for (let i = 0; i < n; i++) {
      const c = makeCard(id, up);
      if (pile === 'draw') { this.drawPile.splice(rand(0, this.drawPile.length), 0, c); this.flyNewCard(c, '.draw-pile', i); }
      else if (pile === 'hand' && this.hand.length < 10) { c._new = true; c._made = true; this.hand.push(c); }
      else { this.discardPile.push(c); this.flyNewCard(c, '.discard-pile', i); }
    }
    const where = pile === 'draw' ? 'draw pile' : pile === 'hand' ? 'hand' : 'discard pile';
    const bad = ['status', 'curse'].includes(CARDS[id].type);
    this.float(this.player, `+${n} ${CARDS[id].name}${n > 1 && !bad ? 's' : ''} (${where})`, bad ? 'debuff' : 'buff');
    this.render();
  }

  async drawCards(n) {
    for (let i = 0; i < n; i++) {
      if (this.hand.length >= 10) break;
      if (!this.drawPile.length) {
        if (!this.discardPile.length) break;
        this.drawPile = shuffle(this.discardPile);
        Sound.play('shuffle');
        this.animateShuffle(Math.min(8, this.drawPile.length));
        for (const r of this.run.relics) if (RELICS[r.id].onShuffle) RELICS[r.id].onShuffle(this, r);
        this.discardPile = [];
      }
      const c = this.drawPile.pop();
      c._new = true;
      this.hand.push(c);
      const d = cardDef(c);
      if (d.onDraw) d.onDraw(this, c);
    }
    this.render();
  }

  moveToHand(card, from) {
    const pile = this[from + 'Pile'];
    const i = pile.indexOf(card);
    if (i < 0) return;
    pile.splice(i, 1);
    if (this.hand.length < 10) { card._new = true; this.hand.push(card); } else this.discardPile.push(card);
    this.render();
  }

  async choosePile(from, prompt) {
    const pile = this[from + 'Pile'];
    if (!pile.length) { toast('No cards to choose from.'); return null; }
    const i = await chooseCards(pile, { title: prompt, canSkip: true });
    return i >= 0 ? pile[i] : null;
  }

  chooseHand(prompt, filter = () => true) {
    if (!this.hand.some(filter)) return Promise.resolve(null);
    return new Promise((resolve) => { this.chooser = { prompt, filter, resolve }; this.render(); });
  }

  costOf(card) {
    const b = cardBaseCost(card);
    if (b === 'X' || b === -1) return b;
    return Math.max(0, b + (card.costMod || 0));
  }
  canPlay(card) {
    const d = cardDef(card);
    if (d.cost === -1 || !d.play) return false;
    if (d.needsKnight && !this.knightAlive()) return false;
    const c = this.costOf(card);
    return c === 'X' || c <= this.energy;
  }

  // ---------- Playing cards & tonics ----------
  async playCard(i, target) {
    const card = this.hand[i];
    if (!card || this.busy || this.over || this.phase !== 'player' || !this.canPlay(card)) return;
    const d = cardDef(card);
    if (d.target === 'enemy' && (!target || target.dead)) return;
    this.busy = true;
    this.selected = null;
    hideTip();
    const cost = this.costOf(card);
    let x = 0;
    if (cost === 'X') { x = this.energy; this.energy = 0; } else this.energy -= cost;
    const cardNode = $$('.hand .card', this.root)[i];
    Sound.play('card');
    if (d.type === 'skill') Fx.at(this.player, 'cast', { col: currentChar().color });
    this.hand.splice(i, 1);
    this.animatePlayed(cardNode, d.type === 'power' ? 'power' : cardFlag(card, 'exhaust') ? 'exhaust' : 'discard');
    this.render();
    this.turnCounts.cards++;
    this.turnCounts[d.type] = (this.turnCounts[d.type] || 0) + 1;
    this.run.stats.cardsPlayed++;
    const v = cardVals(card);
    v.x = x;
    let times = 1;
    const p = this.player;
    if (d.type === 'attack') {
      if (p.statuses.primed) { this.cardBonus = p.statuses.primed; delete p.statuses.primed; }
      if (p.statuses.doubleNext) { times++; p.statuses.doubleNext--; if (p.statuses.doubleNext <= 0) delete p.statuses.doubleNext; }
      if (p.statuses.echoingToll && this.turnCounts.attack <= p.statuses.echoingToll) times++;
    }
    for (let k = 0; k < times && !this.over; k++) {
      const t = target;
      // A repeated card (Twin Flame, Echoing Toll...) only ever hits the enemy you chose.
      // If that enemy is already dead, the extra copy is simply lost.
      if (d.target === 'enemy' && (!t || t.dead)) break;
      if (k > 0) { this.float(this.player, 'Again!', 'buff'); await sleep(300); }
      await d.play(this, v, t, card);
    }
    this.cardBonus = 0;
    if (d.type !== 'power') (cardFlag(card, 'exhaust') ? this.exhaustPile : this.discardPile).push(card);
    if (d.type === 'skill') for (const e of this.alive()) if (e.statuses.wrath) this.apply(e, 'might', e.statuses.wrath, e);
    if (cost === 0 && p.statuses.silverMirage) this.gainBlock(p, p.statuses.silverMirage, false);
    if (p.statuses.whisperingSteel && !this.over) for (const e of this.alive()) await this.damage(e, p.statuses.whisperingSteel, p, 'power');
    for (const r of this.run.relics) if (RELICS[r.id].onCardPlayed) await RELICS[r.id].onCardPlayed(this, r, card);
    this.busy = false;
    this.render();
    await this.checkOver();
  }

  selectPotion(slot) {
    const P = POTIONS[this.run.potions[slot]];
    if (!P || this.busy || this.phase !== 'player' || this.over) return;
    this.selected = null;
    if (P.target === 'enemy') {
      const a = this.alive();
      if (a.length === 1) return this.usePotion(slot, a[0]);
      this.potionSel = slot;
      this.render();
    } else this.usePotion(slot, null);
  }
  async usePotion(slot, target) {
    const id = this.run.potions[slot];
    if (!id) return;
    this.busy = true;
    this.potionSel = null;
    this.run.potions[slot] = null;
    renderTopbar(true);
    this.float(this.player, POTIONS[id].name, 'movename');
    Sound.play('potion');
    this.tonicsUsed = (this.tonicsUsed || 0) + 1;
    if (this.tonicsUsed >= 4) unlockAch('tonics');
    await POTIONS[id].use(this, target);
    if (this.player.statuses.doubleDose && !this.over) {
      delete this.player.statuses.doubleDose;
      this.float(this.player, 'Double Dose!', 'buff');
      await sleep(250);
      await POTIONS[id].use(this, target && !target.dead ? target : pick(this.alive()));
    }
    if (this.player.statuses.alembic && !this.over) await this.drawCards(this.player.statuses.alembic);
    this.busy = false;
    this.render();
    await this.checkOver();
  }

  async checkOver() {
    if (!this.over) return false;
    if (this.finished) return true;
    this.finished = true;
    this.busy = true;
    this.render();
    Sound.play(this.result === 'victory' ? 'win' : 'defeat');
    await sleep(700);
    this.run.hp = Math.max(0, this.player.hp);
    if (this.result === 'victory') {
      unlockAch('firstBlood');
      if (this.turn === 1) unlockAch('quick');
      if (this.kind === 'elite' && this.player.hp >= this.startHp) unlockAch('flawless');
      if (this.enemies.some((e) => e.id === 'motherBrine')) unlockAch('brine');
      if (this.enemies.some((e) => e.id === 'paleSovereign')) unlockAch('sovereign');
      for (const r of this.run.relics) if (RELICS[r.id].onCombatEnd) RELICS[r.id].onCombatEnd(this.run, r, this);
      Game.combat = null;
      combatWon(this.kind);
    } else {
      Game.combat = null;
      runLost();
    }
    return true;
  }

  // ---------- Rendering ----------
  mount() {
    const act = ACTS[this.run.act - 1];
    const root = el('div', 'combat');
    root.style.setProperty('--bg1', act.bg[0]);
    root.style.setProperty('--bg2', act.bg[1]);
    root.style.setProperty('--accent', act.accent);
    root.innerHTML = `
      <div class="battlefield">
        <div class="side player-side"></div>
        <div class="side enemy-side"></div>
        <div class="banner"></div>
      </div>
      <div class="combat-prompt"></div>
      <div class="combat-bottom">
        <div class="cb-left">
          <div class="energy-orb" data-tip="<b>Energy</b><br>Spend Energy to play cards. Refills each turn."><span></span></div>
          <button class="pile-btn draw-pile" data-tip="<b>Draw pile</b><br>Click to view (order hidden).">🂠 <b></b></button>
        </div>
        <div class="hand"></div>
        <div class="cb-right">
          <button class="btn end-turn">End Turn</button>
          <div class="piles">
            <button class="pile-btn discard-pile" data-tip="<b>Discard pile</b>">🗑️ <b></b></button>
            <button class="pile-btn exhaust-pile" data-tip="<b>Exhausted</b><br>Removed for this combat.">💨 <b></b></button>
          </div>
        </div>
      </div>`;
    root.insertAdjacentHTML('afterbegin', embers(14));
    const scr = $('#screen');
    scr.innerHTML = '';
    scr.appendChild(root);
    this.root = root;
    this.player.el = this.entityEl(this.player);
    $('.player-side', root).appendChild(this.player.el);
    if (currentChar().duo) $('.player-side', root).classList.add('duo');
    for (const e of this.enemies) { e.el = this.entityEl(e); $('.enemy-side', root).appendChild(e.el); }

    $('.end-turn', root).onclick = () => this.endTurn();
    $('.draw-pile', root).onclick = () => viewCards(sortDeck(this.drawPile), 'Draw Pile');
    $('.discard-pile', root).onclick = () => viewCards(this.discardPile.slice().reverse(), 'Discard Pile');
    $('.exhaust-pile', root).onclick = () => viewCards(this.exhaustPile, 'Exhausted');
    $('.battlefield', root).addEventListener('click', (ev) => {
      if (ev.target.closest('.entity.enemy')) return;
      if (this.selected != null) {
        const c = this.hand[this.selected];
        if (c && cardDef(c).target !== 'enemy') this.playCard(this.selected, null);
        else { this.selected = null; this.render(); }
      } else if (this.potionSel != null) { this.potionSel = null; this.render(); }
    });
    root.addEventListener('contextmenu', (ev) => { ev.preventDefault(); this.selected = null; this.potionSel = null; this.render(); });
    this.arrowEl = el('div', '', `<svg class="target-arrow" style="display:none"><path class="ta-glow"/><path class="ta-line"/><polygon class="ta-head"/></svg>`).firstChild;
    root.appendChild(this.arrowEl);
    let mraf = 0;
    root.addEventListener('pointermove', (ev) => {
      this.mouse = { x: ev.clientX, y: ev.clientY };
      if (!mraf && (this.selected != null || this.potionSel != null)) mraf = requestAnimationFrame(() => { mraf = 0; this.updateSelectArrow(); });
    });
  }

  entityEl(ent) {
    const ally = ent.isPlayer || ent.isKnight;
    const e = el('div', 'entity ' + (ent.isPlayer ? 'player' : ent.isKnight ? 'knight ally' : 'enemy'));
    const def = ent.def || {};
    const scale = ent.isPlayer ? 1.45 : def.scale || 1;
    const art = !ally && typeof ENEMY_ART !== 'undefined' && ENEMY_ART[ent.id];
    const sprite = ent.isPlayer ? currentChar().portrait() : ent.isKnight ? KNIGHT.portrait() : art ? art() : def.sprite;
    const title = ent.isKnight ? KNIGHT.title : ent.isPlayer && currentChar().titles ? currentChar().titles[0] : '';
    const overlay = ent.isPlayer || art ? '' : def.overlay ? `<span class="overlay">${def.overlay}</span>` : '';
    e.innerHTML = `
      ${ally ? '' : '<div class="intent"></div>'}
      <div class="sprite-wrap" style="--s:${scale}">
        <div class="aura"></div>
        <div class="sprite${ally || art ? ' portrait' : ''}" style="${def.filter && !art ? `filter:${def.filter}` : ''}">${sprite}</div>${overlay}
      </div>
      <div class="ent-name">${esc(ent.name)}${title ? `<small class="ent-title">${esc(title)}</small>` : ''}${def.elite ? ' <span class="tag elite">Elite</span>' : ''}${def.boss ? ' <span class="tag boss">Boss</span>' : ''}</div>
      <div class="hpbar"><div class="hpfill"></div><div class="ward"><span></span></div><div class="hptext"></div></div>
      <div class="statuses"></div>`;
    if (!ally) {
      e.addEventListener('click', () => this.onEnemyClick(ent));
      e.addEventListener('mouseenter', () => { this.hoverTarget = ent; if (this.selected != null) this.renderHand(); });
      e.addEventListener('mouseleave', () => { if (this.hoverTarget === ent) { this.hoverTarget = null; if (this.selected != null) this.renderHand(); } });
    }
    return e;
  }

  renderEntity(ent) {
    const e = ent.el;
    if (!e) return;
    const pct = clamp(ent.hp / ent.maxHp, 0, 1) * 100;
    $('.hpfill', e).style.width = pct + '%';
    $('.hptext', e).textContent = `${Math.max(0, ent.hp)}/${ent.maxHp}`;
    const w = $('.ward', e);
    w.style.display = ent.block > 0 ? 'flex' : 'none';
    $('span', w).textContent = ent.block;
    $('.hpbar', e).classList.toggle('warded', ent.block > 0);
    $('.statuses', e).innerHTML = Object.keys(ent.statuses).map((k) => {
      const S = STATUSES[k];
      if (!S) return '';
      const n = ent.statuses[k];
      const cls = S.type === 'debuff' || n < 0 ? 'debuff' : S.type;
      const showN = S.type !== 'info' && !(S.type === 'power' && n === 1 && ['lanternShell'].includes(k));
      return `<span class="st ${cls}" data-tip="<b>${esc(S.name)}</b><br>${esc(S.desc(n))}">${S.icon}${showN ? `<i>${n}</i>` : ''}</span>`;
    }).join('');
    if (ent.isPlayer) {
      const g = ent.statuses.glow || 0;
      $('.aura', e).style.opacity = Math.min(1, 0.25 + g * 0.12);
      $('.aura', e).style.transform = `scale(${1 + Math.min(g, 10) * 0.06})`;
    } else if (ent.isKnight) {
      e.classList.toggle('dead', !!ent.dead);
    } else {
      const sel = this.selected != null && this.hand[this.selected] && cardDef(this.hand[this.selected]).target === 'enemy';
      e.classList.toggle('targetable', !ent.dead && (sel || this.potionSel != null));
      $('.intent', e).innerHTML = ent.dead || this.over ? '' : this.intentHTML(ent);
      e.classList.toggle('dead', ent.dead);
    }
  }

  intentHTML(e) {
    if (e.intent === '__split') return `<div class="intent-inner" data-tip="<b>Split</b><br>Will split into two smaller slimes.">➗</div>`;
    const m = e.def.moves[e.intent];
    if (!m) return '';
    if (m.intent === 'unknown') return `<div class="intent-inner unknown" data-tip="<b>???</b><br>Its intent is unknown.">❓</div>`;
    const parts = [], tip = [];
    if (m.dmg) {
      const d = this.calcDamage(e, this.player, m.dmg);
      const h = m.hits || 1;
      parts.push(`<span class="i-atk">${d >= 25 ? '🪓' : '⚔️'}<b>${d}${h > 1 ? '×' + h : ''}</b></span>`);
      tip.push(`Intends to <b>attack</b> for ${d} damage${h > 1 ? ` ${h} times` : ''}.`);
    }
    const fx = (obj) => Object.entries(obj).map(([k, n]) => `${n} ${STATUSES[k] ? STATUSES[k].icon + ' ' + STATUSES[k].name : k}`).join(', ');
    if (m.block || m.intent === 'defend') { parts.push('🛡️'); tip.push(m.block ? `Gains <b>${m.block} Ward</b>.` : 'Intends to <b>defend</b>.'); }
    if (m.buff || m.buffAll || m.intent === 'buff') {
      parts.push('⬆️');
      if (m.buff) tip.push(`Gains <b>${fx(m.buff)}</b>.`);
      if (m.buffAll) tip.push(`Gives itself and its allies <b>${fx(m.buffAll)}</b>.`);
      if (!m.buff && !m.buffAll) tip.push('Intends to <b>strengthen</b> itself.');
    }
    if (m.debuff || m.cards || m.intent === 'debuff') {
      parts.push('🌀');
      if (m.debuff) tip.push(`Gives you <b>${fx(m.debuff)}</b>.`);
      if (m.cards) for (const c of m.cards) tip.push(`Shuffles <b>${c.n} ${CARDS[c.id].name}</b> into your ${c.pile === 'draw' ? 'draw' : 'discard'} pile.`);
      if (!m.debuff && !m.cards) tip.push('Intends to <b>hinder</b> you.');
    }
    if (m.summon) { parts.push('🥚'); tip.push(`Summons <b>${ENEMIES[m.summon.id].name}</b>.`); }
    if (!parts.length) { parts.push('❓'); tip.push('Its intent is unknown.'); }
    return `<div class="intent-inner" data-tip="<b>${esc(m.name)}</b><br>${tip.join(' ')}">${parts.join(' ')}</div>`;
  }

  renderHand() {
    const h = $('.hand', this.root);
    if (!h || this.dragging) return;
    if (!this.cardNodes) this.cardNodes = new Map();
    const n = this.hand.length;
    const overlap = n <= 5 ? -14 : -14 - (n - 5) * 11;
    const keep = new Set(this.hand);
    // When cards are added or removed, the others slide (not jump) to their new places.
    // Positions are remembered from the last change, so nothing has to be measured now.
    const handSig = this.hand.map((c) => c.uid).join(',');
    const reflow = handSig !== this._handSig;
    this._handSig = handSig;
    const prevLeft = new Map();
    if (reflow) for (const node of this.cardNodes.values()) if (node._left != null && node.isConnected && !node.classList.contains('dragging')) prevLeft.set(node, node._left);
    for (const [card, node] of this.cardNodes) if (!keep.has(card)) { node.remove(); this.cardNodes.delete(card); }
    const arriving = [];
    this.hand.forEach((card, i) => {
      // Reuse the same element for the same card, so animations are never cut short.
      const fresh = cardEl(card, { ctx: this, target: this.selected === i ? null : undefined });
      let ce = this.cardNodes.get(card);
      if (!ce) { ce = fresh; this.cardNodes.set(card, ce); }
      else {
        if (ce.innerHTML !== fresh.innerHTML) ce.innerHTML = fresh.innerHTML;
        if (fresh.dataset.tip) ce.dataset.tip = fresh.dataset.tip; else delete ce.dataset.tip;
        ce.className = fresh.className;
        ce.removeAttribute('style');
      }
      const off = i - (n - 1) / 2;
      const rot = off * 3, ty = Math.abs(off) * Math.abs(off) * 2.5;
      ce.style.setProperty('--rot', `${rot}deg`);
      ce.style.setProperty('--ty', `${ty}px`);
      ce.style.marginLeft = i === 0 ? '0' : overlap + 'px';
      ce.style.zIndex = 10 + i;
      ce.classList.add('in-hand');
      if (this.chooser) ce.classList.toggle('choosable', this.chooser.filter(card));
      else if (this.phase === 'player' && !this.busy && this.canPlay(card)) ce.classList.add('playable');
      if (this.selected === i) ce.classList.add('selected');
      ce.onpointerdown = (ev) => this.onCardPointerDown(ev, this.hand.indexOf(card), ce);
      if (h.children[i] !== ce) h.insertBefore(ce, h.children[i] || null);
      if (card._new) { arriving.push({ ce, rot, ty, made: card._made }); delete card._new; delete card._made; }
    });
    if (reflow) {
      for (const node of this.cardNodes.values()) {
        const now = node.offsetLeft;
        const l0 = prevLeft.get(node);
        if (l0 != null && Math.abs(l0 - now) > 1) node.animate([{ translate: `${l0 - now}px 0` }, { translate: '0 0' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.3,1)' });
        node._left = now;
      }
    }
    if (arriving.length) this.animateArrivals(arriving);
    this.updateSelectArrow();
  }

  // Cards fly out of the draw pile (or appear from the middle of the screen when created).
  animateArrivals(list) {
    const pile = $('.draw-pile', this.root).getBoundingClientRect();
    const sp = Math.max(0.35, Game.speed);
    list.forEach(({ ce, rot, ty, made }, k) => {
      const r = ce.getBoundingClientRect();
      const fromX = made ? window.innerWidth / 2 : pile.left + pile.width / 2;
      const fromY = made ? window.innerHeight * 0.4 : pile.top + pile.height / 2;
      const dx = fromX - (r.left + r.width / 2), dy = fromY - (r.top + r.height / 2);
      const start = made ? `translate(${dx}px, ${dy}px) scale(.3)` : `translate(${dx}px, ${dy}px) rotate(-80deg) scale(.18)`;
      ce.animate([
        { transform: start, opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { transform: `translateY(${ty - 30}px) rotate(${rot}deg) scale(1.05)`, offset: 0.75 },
        { transform: `translateY(${ty}px) rotate(${rot}deg)`, opacity: 1 }],
      { duration: 480 * sp, delay: k * 90 * sp, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' });
      if (!made) setTimeout(() => Sound.play('draw', { gap: 0 }), k * 90 * sp);
    });
    $('.draw-pile', this.root).classList.remove('bump'); void pile.width;
  }

  onCardPointerDown(ev, i, ce) {
    if (ev.button !== 0 || i < 0) return;
    const sx = ev.clientX, sy = ev.clientY;
    const card = this.hand[i];
    const needsTarget = cardDef(card).target === 'enemy';
    let dragging = false, W = 0, H = 0, grabX = 0, grabY = 0, handTop = 0, park = null, targets = [], hovered = null;
    // While a card is held, the other cards stay put (no hover pop-up) and fade as it rises.
    const handEl = $('.hand', this.root);
    handEl.classList.add('holding');
    const setFade = (f) => handEl.style.setProperty('--fade', f.toFixed(2));
    const place = (x, y, s) => { ce.style.transform = `translate3d(${x - W / 2}px, ${y - H / 2}px, 0) scale(${s})`; };
    const startDrag = () => {
      dragging = true; this.dragging = true; this.selected = i;
      hideTip();
      this.hideArrow();
      const r = ce.getBoundingClientRect();
      W = ce.offsetWidth; H = ce.offsetHeight;
      grabX = sx - (r.left + r.width / 2); grabY = sy - (r.top + r.height / 2);
      handTop = $('.combat-bottom', this.root).getBoundingClientRect().top;
      const hb = $('.hand', this.root).getBoundingClientRect();
      park = { x: hb.left + hb.width / 2, y: handTop - H * 0.25 };
      targets = this.alive().map((e) => ({ e, r: $('.sprite-wrap', e.el).getBoundingClientRect() }));
      // Lift the card out of the hand so it moves smoothly on its own layer.
      ce.classList.add('dragging');
      ce.style.position = 'fixed'; ce.style.left = '0'; ce.style.top = '0'; ce.style.margin = '0';
      place(r.left + r.width / 2, r.top + r.height / 2, 1.05);
    };
    let raf = 0, last = null;
    const update = () => {
      raf = 0;
      const { clientX: x, clientY: y } = last;
      // 0 = still in the hand, 1 = far enough up to be played
      const p = clamp((sy - y) / Math.max(60, sy - (handTop - 30)), 0, 1);
      const ease = p * (2 - p);
      if (needsTarget && y < handTop - 20) {
        // Hold the card above the hand and aim with the arrow.
        place(park.x, park.y, 1.2);
        setFade(0.35);
        const hit = targets.find(({ r }) => x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 40 && y <= r.bottom + 50);
        hovered = hit ? hit.e : null;
        this.drawArrow(park.x, park.y - H * 0.54, x, y, hovered);
      } else {
        hovered = null;
        this.hideArrow();
        // The card grows as it rises out of the hand, and the rest of the hand fades away.
        place(x - grabX, y - grabY, 1.05 + 0.4 * ease);
        setFade(1 - 0.65 * ease);
        ce.classList.toggle('will-play', !needsTarget && p >= 1);
      }
    };
    const move = (e2) => {
      if (!dragging) {
        if (Math.hypot(e2.clientX - sx, e2.clientY - sy) > 10 && !this.chooser && !this.busy && this.phase === 'player' && this.canPlay(this.hand[i])) startDrag();
        else return;
      }
      last = e2;
      if (!raf) raf = requestAnimationFrame(update);
    };
    const up = (e2) => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if (raf) cancelAnimationFrame(raf);
      handEl.classList.remove('holding');
      handEl.style.removeProperty('--fade');
      if (!dragging) { this.onCardClick(i); return; }
      this.dragging = false;
      this.hideArrow();
      if (needsTarget && hovered && !hovered.dead) return this.playCard(i, hovered);
      if (!needsTarget && e2.clientY < handTop - 30) return this.playCard(i, null);
      this.selected = null;
      this.render();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  // ---------- Targeting arrow ----------
  drawArrow(x1, y1, x2, y2, target) {
    const svg = this.arrowEl;
    if (!svg) return;
    if (target) { const r = $('.sprite-wrap', target.el).getBoundingClientRect(); x2 = r.left + r.width / 2; y2 = r.top + r.height * 0.45; }
    svg.style.display = 'block';
    svg.classList.toggle('locked', !!target);
    const mx = x1 + (x2 - x1) * 0.25, my = Math.min(y1, y2) - Math.max(80, Math.abs(x2 - x1) * 0.25);
    const ang = Math.atan2(y2 - my, x2 - mx);
    const ex = x2 - Math.cos(ang) * 16, ey = y2 - Math.sin(ang) * 16;
    const d = `M${x1},${y1} Q${mx},${my} ${ex},${ey}`;
    svg.querySelector('.ta-glow').setAttribute('d', d);
    svg.querySelector('.ta-line').setAttribute('d', d);
    const s = 32;
    const pts = [[x2, y2], [x2 - Math.cos(ang - 0.5) * s, y2 - Math.sin(ang - 0.5) * s], [x2 - Math.cos(ang) * s * 0.6, y2 - Math.sin(ang) * s * 0.6], [x2 - Math.cos(ang + 0.5) * s, y2 - Math.sin(ang + 0.5) * s]];
    svg.querySelector('.ta-head').setAttribute('points', pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '));
    for (const e of this.enemies) if (e.el) e.el.classList.toggle('targeted', e === target);
  }
  hideArrow() {
    if (this.arrowEl && this.arrowEl.style.display !== 'none') this.arrowEl.style.display = 'none';
    for (const e of this.enemies) if (e.el && e.el.classList.contains('targeted')) e.el.classList.remove('targeted');
  }
  // When a card (or tonic) that needs a target is selected by clicking, the arrow follows the mouse.
  updateSelectArrow() {
    if (this.dragging || !this.root) return;
    const card = this.selected != null ? this.hand[this.selected] : null;
    const aiming = (card && cardDef(card).target === 'enemy') || this.potionSel != null;
    if (!aiming || this.phase !== 'player' || !this.mouse) { this.hideArrow(); return; }
    let x1, y1;
    if (this.potionSel != null) { const r = $('.sprite-wrap', this.player.el).getBoundingClientRect(); x1 = r.left + r.width / 2; y1 = r.top + r.height * 0.3; }
    else { const node = $('.hand .card.selected', this.root); if (!node) return; const r = node.getBoundingClientRect(); x1 = r.left + r.width / 2; y1 = r.top + 4; }
    const t = this.hoverTarget && !this.hoverTarget.dead ? this.hoverTarget : null;
    this.drawArrow(x1, y1, this.mouse.x, this.mouse.y, t);
  }

  onCardClick(i) {
    const card = this.hand[i];
    if (!card) return;
    if (this.chooser) {
      if (this.chooser.filter(card)) { const r = this.chooser.resolve; this.chooser = null; r(card); this.render(); }
      return;
    }
    if (this.busy || this.phase !== 'player' || this.over) return;
    this.potionSel = null;
    const d = cardDef(card);
    if (!this.canPlay(card)) {
      const msg = d.cost === -1 || !d.play ? 'This card cannot be played.' : d.needsKnight && !this.knightAlive() ? 'Your Knight has fallen.' : 'Not enough Energy.';
      floatAt($$('.hand .card', this.root)[i], msg, 'debuff');
      Sound.play('error');
      return;
    }
    if (this.selected === i) {
      if (d.target !== 'enemy') return this.playCard(i, null);
      const a = this.alive();
      if (a.length === 1) return this.playCard(i, a[0]);
      return;
    }
    this.selected = i;
    this.render();
  }

  onEnemyClick(e) {
    if (e.dead || this.busy) return;
    if (this.potionSel != null) return this.usePotion(this.potionSel, e);
    if (this.selected != null) {
      const c = this.hand[this.selected];
      if (c && cardDef(c).target === 'enemy') return this.playCard(this.selected, e);
      if (c) return this.playCard(this.selected, null);
    }
  }

  renderEnemies() { for (const e of this.enemies) this.renderEntity(e); this.fitEnemies(); }
  // Shrink the enemies a little when many are on screen, so they always fit.
  fitEnemies() {
    const side = this.root && $('.enemy-side', this.root);
    if (!side) return;
    const shown = this.enemies.filter((e) => e.el && !e.el.classList.contains('gone'));
    const want = shown.reduce((s, e) => s + Math.max(1, (e.def.scale || 1)) * 0.95, 0);
    const room = side.clientWidth / Math.max(1, parseFloat(getComputedStyle(this.root).getPropertyValue('--base')) || 158);
    side.style.setProperty('--squeeze', Math.min(1, room / Math.max(want, 0.01)).toFixed(3));
  }

  render() {
    if (!this.root) return;
    this.renderEntity(this.player);
    if (this.knight) this.renderEntity(this.knight);
    this.renderEnemies();
    this.renderHand();
    $('.energy-orb span', this.root).textContent = `${this.energy}/${this.maxEnergy()}`;
    $('.energy-orb', this.root).classList.toggle('empty', this.energy === 0);
    $('.draw-pile b', this.root).textContent = this.drawPile.length;
    $('.discard-pile b', this.root).textContent = this.discardPile.length;
    $('.exhaust-pile b', this.root).textContent = this.exhaustPile.length;
    const et = $('.end-turn', this.root);
    et.disabled = this.busy || this.phase !== 'player' || this.over || !!this.chooser;
    et.classList.toggle('pulse', !et.disabled && !this.hand.some((c) => this.canPlay(c)));
    let prompt = '';
    if (this.chooser) prompt = this.chooser.prompt;
    else if (this.potionSel != null) prompt = 'Choose an enemy for the Tonic (right-click to cancel)';
    else if (this.selected != null) {
      const c = this.hand[this.selected];
      if (c) prompt = cardDef(c).target === 'enemy' ? 'Click an enemy to target it' + (this.alive().length === 1 ? ' (or click the card again)' : '') : 'Click the card again or the battlefield to play it';
    }
    const pr = $('.combat-prompt', this.root);
    pr.textContent = prompt;
    pr.classList.toggle('show', !!prompt);
    renderTopbar();
  }

  // ---------- Effects ----------
  float(ent, text, cls) { if (ent && ent.el) floatAt($('.sprite-wrap', ent.el), text, cls); }
  flashRelic(id) { flashRelicEl(id); }
  lunge(ent) {
    if (!ent.el) return;
    const dir = ent.isPlayer ? 1 : -1;
    $('.sprite-wrap', ent.el).animate([
      { transform: 'translateX(0) rotate(0)' },
      { transform: `translateX(${-dir * 14}px) rotate(${-dir * 4}deg) scale(.96)`, offset: 0.25 },
      { transform: `translateX(${dir * 70}px) rotate(${dir * 6}deg) scale(1.06)`, offset: 0.55 },
      { transform: 'translateX(0) rotate(0)' }], { duration: 380 * Math.max(0.35, Game.speed), easing: 'ease-out' });
  }
  hitFx(ent) {
    if (!ent.el) return;
    $('.sprite', ent.el).animate([
      { transform: 'translateX(0)', filter: 'brightness(3) saturate(0)' },
      { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 280 * Game.speed });
    if (ent.isPlayer) this.root.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-4px,3px)' }, { transform: 'translate(3px,-2px)' }, { transform: 'translate(0,0)' }], { duration: 200 });
  }
  banner(text) {
    const b = $('.banner', this.root);
    if (!b) return;
    b.textContent = text;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  }
  async strikeAnim(t) {
    Sound.play('swing');
    if (currentCharId() === 'moonblade') { await Fx.projectile(this.player, t, 'moon'); return; }
    this.lunge(this.player);
    await sleep(120);
  }
  // ---------- Cassandra's Knight ----------
  knightAlive() { return !!(this.knight && !this.knight.dead && this.knight.hp > 0); }
  // Summon n: the Knight rises with n HP, or gains n HP (and Max HP) if he is already here.
  summon(n) {
    if (n <= 0 || this.over) return;
    let k = this.knight;
    if (!k) {
      k = this.knight = { isKnight: true, uid: 'k', id: 'knight', name: KNIGHT.name, def: { scale: 1.3 }, hp: 0, maxHp: 0, block: 0, statuses: {}, dead: true };
      if (this.root) { k.el = this.entityEl(k); k.el.classList.add('dead'); $('.player-side', this.root).appendChild(k.el); }
    }
    if (k.dead || k.hp <= 0) {
      k.dead = false; k.hp = n; k.maxHp = n;
      if (k.el) { k.el.classList.remove('dead', 'gone', 'spawned'); void k.el.offsetWidth; k.el.classList.add('spawned'); }
      this.float(k, 'The Knight rises!', 'buff');
    } else { k.hp += n; k.maxHp += n; this.float(k, `+${n} HP`, 'heal'); }
    Sound.play('power');
    Fx.at(k, 'shield');
    this.renderEntity(k);
    if (this.player.statuses.blackWedding) { const t = pick(this.alive()); if (t) this.damage(t, n, this.player, 'power'); }
  }
  // Sacrifice n: the Knight loses n HP. Whatever he cannot pay, Cassandra pays herself.
  async sacrifice(n) {
    let rest = n;
    const k = this.knight;
    if (this.knightAlive() && n > 0) {
      const a = Math.min(n, k.hp);
      k.hp -= a; rest -= a;
      this.float(k, `-${a}`, 'dmg');
      Fx.at(k, 'bleed'); Sound.play('debuff');
      if (k.hp <= 0) this.knightFalls();
      this.renderEntity(k);
    }
    if (rest > 0) await this.damage(this.player, rest, null, 'hploss');
  }
  knightFalls() {
    const k = this.knight;
    if (!k || k.dead) return;
    k.hp = 0; k.dead = true;
    this.float(k, 'The Knight falls!', 'debuff');
    Fx.at(k, 'death'); Sound.play('death');
    if (k.el) k.el.classList.add('dead');
    this.renderEntity(k);
  }
  // Damage of one Knight hit: base + Valor + any Mark on the target.
  knightDamage(t, base, consume) {
    let b = base + (this.player.statuses.valor || 0);
    if (t && t.statuses.mark) { b += t.statuses.mark; if (consume) { delete t.statuses.mark; this.renderEntity(t); } }
    return this.calcDamage(this.knight || { statuses: {} }, t, b);
  }
  previewKnightDamage(base, target) {
    if (!target) { const a = this.alive(); target = this.hoverTarget && !this.hoverTarget.dead ? this.hoverTarget : a.length === 1 ? a[0] : null; }
    return this.knightDamage(target, base, false);
  }
  async knightAttack(t, base, hits = 1) {
    if (!this.knightAlive()) { this.float(this.player, 'Your Knight has fallen', 'debuff'); return 0; }
    let total = 0;
    for (let i = 0; i < hits; i++) {
      if (!t || t.dead || this.over || !this.knightAlive()) break;
      Sound.play('swing');
      this.lunge(this.knight);
      await sleep(140);
      total += await this.damage(t, this.knightDamage(t, base, true), this.knight, 'attack');
      if (hits > 1) await sleep(140);
    }
    return total;
  }
  async knightAttackAll(base) {
    if (!this.knightAlive()) { this.float(this.player, 'Your Knight has fallen', 'debuff'); return 0; }
    Sound.play('swing');
    this.lunge(this.knight);
    await sleep(140);
    let total = 0;
    for (const t of this.alive()) total += await this.damage(t, this.knightDamage(t, base, true), this.knight, 'attack');
    return total;
  }

  // ---------- The Alchemist ----------
  brew(n = 1) {
    for (let k = 0; k < n; k++) {
      if (!this.run.potions.includes(null)) { this.float(this.player, 'No room for more Tonics', 'debuff'); break; }
      const id = randomPotion();
      obtainPotion(id);
      this.float(this.player, `Brewed ${POTIONS[id].name}`, 'buff');
      Fx.at(this.player, 'buff', { col: '#8fe36a', glyph: '🧪' });
    }
    renderTopbar(true);
  }
  async explode(e) {
    if (!e || e.dead) return;
    delete e.statuses.unstable;
    this.explosions = (this.explosions || 0) + 1;
    if (this.explosions >= 3) unlockAch('boom');
    const p = this.player.statuses;
    Fx.at(e, 'impact', { scale: 1.8 }); Fx.at(e, 'fire', { scale: 1.4 }); Fx.shake(this.root, 9);
    Sound.play('explode');
    this.float(e, '💥 BOOM!', 'dmg');
    await this.damage(e, 25 + (p.catalysis || 0), null, 'hploss');
    if (p.reactiveArmor) this.gainBlock(this.player, p.reactiveArmor, false);
    if (p.chainReaction) for (const o of this.alive()) if (o !== e) this.apply(o, 'unstable', p.chainReaction);
  }

  // ---------- Bosses ----------
  async bossIntro() {
    const b = this.enemies.find((e) => e.def.boss);
    if (!b) return;
    Sound.play('bossIntro');
    const card = el('div', 'boss-intro', `<div class="bi-name">${esc(b.name)}</div><div class="bi-title">${esc(b.def.title || '')}</div>`);
    this.root.appendChild(card);
    Fx.shake(this.root, 10);
    await sleep(2100);
    card.classList.add('out');
    setTimeout(() => card.remove(), 600);
  }
  bossPhase2(e) {
    e.phase2 = true;
    if (e.el) e.el.classList.add('phase2');
    Sound.play('roar');
    Fx.shake(this.root, 14);
    Fx.at(e, 'power', { col: '#ff3b3b', scale: 1.6 });
    this.banner(`${e.name.split(',')[0]} is enraged!`);
  }

  // ---------- Card movement animations ----------
  ghostOf(node) {
    const r = node.getBoundingClientRect();
    const g = node.cloneNode(true);
    g.className = node.className.replace(/\b(selected|dragging|will-play|playable)\b/g, '') + ' ghost';
    g.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;z-index:500;pointer-events:none;transform:none`;
    $('#fx').appendChild(g);
    return { g, r };
  }
  pileTarget(sel) {
    const b = $(sel, this.root);
    return b ? b.getBoundingClientRect() : { left: window.innerWidth - 80, top: window.innerHeight - 60, width: 40, height: 40 };
  }
  bumpPile(sel) {
    const b = this.root && $(sel, this.root);
    if (!b) return;
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }
  // Ghost flies from where it is now to a pile button, shrinking and spinning.
  flyTo(g, r, sel, from = 'translate(0px, 0px) scale(1)', delay = 0) {
    const to = this.pileTarget(sel);
    const dx = to.left + to.width / 2 - (r.left + r.width / 2), dy = to.top + to.height / 2 - (r.top + r.height / 2);
    const sp = Math.max(0.35, Game.speed);
    const a = g.animate([{ transform: from, opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) rotate(${sel === '.discard-pile' ? 35 : -35}deg) scale(.12)`, opacity: 0.4 }],
      { duration: 380 * sp, delay, easing: 'cubic-bezier(.5,0,.8,.6)', fill: 'forwards' });
    a.onfinish = () => { g.remove(); this.bumpPile(sel); };
    setTimeout(() => g.remove(), 380 * sp + delay + 800);
  }
  // Exhaust: the card burns away from the bottom up, shedding embers.
  dissolve(g, from = 'none') {
    const sp = Math.max(0.35, Game.speed);
    const dur = 700 * sp;
    if (from !== 'none') g.style.transform = from;
    g.animate([
      { clipPath: 'inset(0 0 0% 0)', filter: 'brightness(1)', opacity: 1 },
      { clipPath: 'inset(0 0 0% 0)', filter: 'brightness(1.7) sepia(.5) saturate(1.6)', opacity: 1, offset: 0.2 },
      { clipPath: 'inset(0 0 100% 0)', filter: 'brightness(.5) grayscale(1)', opacity: 0.6 }], { duration: dur, easing: 'ease-in', fill: 'forwards' })
      .onfinish = () => { g.remove(); this.bumpPile('.exhaust-pile'); };
    const r = g.getBoundingClientRect();
    for (let k = 0; k < 22; k++) {
      const p = el('i', 'ash-ember');
      const t = Math.random();
      p.style.left = r.left + Math.random() * r.width + 'px';
      p.style.top = r.bottom - t * r.height + 'px';
      p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      p.style.animationDelay = (t * dur * 0.9) + 'ms';
      p.style.animationDuration = (600 + Math.random() * 500) * sp + 'ms';
      $('#fx').appendChild(p);
      setTimeout(() => p.remove(), dur + 1400 * sp);
    }
    Sound.play('exhaust');
    setTimeout(() => g.remove(), dur + 600);
  }
  animateDiscardHand() {
    const sp = Math.max(0.35, Game.speed);
    this.hand.forEach((card, i) => {
      const node = this.cardNodes && this.cardNodes.get(card);
      if (!node || !node.isConnected) return;
      const { g, r } = this.ghostOf(node);
      if (cardFlag(card, 'ethereal')) this.dissolve(g);
      else this.flyTo(g, r, '.discard-pile', 'translate(0px, 0px) scale(1)', i * 45 * sp);
    });
  }
  animatePlayed(node, mode = 'discard') {
    if (!node) return;
    const { g, r } = this.ghostOf(node);
    const sp = Math.max(0.35, Game.speed);
    const cx = window.innerWidth / 2 - r.width / 2 - r.left, cy = window.innerHeight * 0.36 - r.top;
    const shown = `translate(${cx}px, ${cy}px) scale(1.12)`;
    // 1) the card jumps to the middle of the screen so you can see what was played
    g.animate([{ transform: 'translate(0px, 0px) scale(1)' }, { transform: shown }], { duration: 230 * sp, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'forwards' })
      .onfinish = () => setTimeout(() => {
        if (!g.isConnected) return;
        // 2) then it goes where it belongs
        if (mode === 'exhaust') this.dissolve(g, shown);
        else if (mode === 'power') {
          g.animate([{ transform: shown, opacity: 1, filter: 'brightness(1)' }, { transform: `translate(${cx}px, ${cy - 90}px) scale(1.35)`, opacity: 0, filter: 'brightness(2.5)' }],
            { duration: 480 * sp, easing: 'ease-out', fill: 'forwards' }).onfinish = () => g.remove();
        } else this.flyTo(g, r, '.discard-pile', shown);
      }, 260 * sp);
    setTimeout(() => g.remove(), 3000);
  }
  // A newly created card (e.g. a status card from an enemy) pops up, then flies into its pile.
  flyNewCard(card, sel, k = 0) {
    if (!this.root) return;
    const node = cardEl(card, { noTip: true });
    node.style.cssText = `position:fixed;left:${window.innerWidth / 2 - 75 + k * 30}px;top:${window.innerHeight * 0.3}px;margin:0;z-index:500;pointer-events:none`;
    node.classList.add('ghost');
    $('#fx').appendChild(node);
    const sp = Math.max(0.35, Game.speed);
    node.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 220 * sp, delay: k * 120 * sp, fill: 'both', easing: 'ease-out' })
      .onfinish = () => setTimeout(() => this.flyTo(node, node.getBoundingClientRect(), sel), 380 * sp);
  }
  // Discard pile shuffled back into the draw pile.
  animateShuffle(n) {
    if (!this.root) return;
    const from = this.pileTarget('.discard-pile'), to = this.pileTarget('.draw-pile');
    const sp = Math.max(0.35, Game.speed);
    for (let k = 0; k < n; k++) {
      const b = el('div', 'card-back-mini');
      b.style.left = from.left + from.width / 2 - 18 + 'px';
      b.style.top = from.top - 10 + 'px';
      $('#fx').appendChild(b);
      const dx = to.left - from.left, lift = -120 - Math.random() * 60;
      b.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 0 }, { opacity: 1, offset: 0.1 },
        { transform: `translate(${dx / 2}px, ${lift}px) rotate(-180deg)`, offset: 0.5 }, { transform: `translate(${dx}px, 0) rotate(-360deg)`, opacity: 0.6 }],
      { duration: 520 * sp, delay: k * 50 * sp, easing: 'ease-in-out', fill: 'both' }).onfinish = () => b.remove();
      setTimeout(() => b.remove(), 2000);
    }
    setTimeout(() => this.bumpPile('.draw-pile'), 520 * sp + n * 50 * sp);
  }
}

// Keyboard shortcuts in combat
document.addEventListener('keydown', (ev) => {
  const c = Game.combat;
  if (!c || overlayOpen()) return;
  if (ev.key === 'e' || ev.key === 'E') c.endTurn();
  else if (ev.key === 'Escape') { c.selected = null; c.potionSel = null; c.render(); }
  else if (/^[0-9]$/.test(ev.key)) {
    const i = ev.key === '0' ? 9 : +ev.key - 1;
    if (c.hand[i]) c.onCardClick(i);
  }
});

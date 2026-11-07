// ===== Sound & music =====
// Everything is synthesized live with the Web Audio API, so there are no audio files.
//   Sound.play('hit')      plays a sound effect (see SFX below)
//   Sound.music('combat')  switches the background music (see TRACKS below)
'use strict';

const Sound = (() => {
  const SETTINGS_KEY = 'lanternfall_audio';
  const settings = { sfx: 0.8, music: 0.5, muted: false };
  try { Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); } catch (e) { /* ignore */ }
  const saveSettings = () => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* ignore */ } };

  let ctx = null, master, sfxBus, musicBus, reverbIn, noiseBuf;
  let wanted = null;   // music track that should be playing
  let current = null;  // { key, gain, timer, ... }
  const lastPlayed = {};

  // ---------- Setup (browsers only allow audio after the first click or key press) ----------
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    comp.connect(ctx.destination);
    master = ctx.createGain(); master.connect(comp);
    sfxBus = ctx.createGain(); sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.connect(master);
    const reverb = ctx.createConvolver();
    reverb.buffer = impulse(2.6, 2.4);
    const revOut = ctx.createGain(); revOut.gain.value = 0.5;
    reverbIn = ctx.createGain();
    reverbIn.connect(reverb); reverb.connect(revOut); revOut.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    applyVolumes();
    if (wanted) startTrack(wanted);
  }
  for (const ev of ['pointerdown', 'keydown']) window.addEventListener(ev, init, true);

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function applyVolumes() {
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.setTargetAtTime(settings.muted ? 0 : 1, t, 0.05);
    sfxBus.gain.setTargetAtTime(settings.sfx, t, 0.05);
    musicBus.gain.setTargetAtTime(settings.music * 0.55, t, 0.05);
  }

  // ---------- Building blocks ----------
  // tone: one oscillator note. noise: a burst of filtered noise.
  function tone({ f = 440, f2 = 0, type = 'sine', t = 0, a = 0.005, d = 0.2, v = 0.2, out = sfxBus, rev = 0, lp = 0, q = 0.7, detune = 0 }) {
    const T = ctx.currentTime + t;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, T);
    if (detune) o.detune.value = detune;
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, T + a + d);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, T);
    g.gain.exponentialRampToValueAtTime(v, T + a);
    g.gain.exponentialRampToValueAtTime(0.0001, T + a + d);
    let node = o;
    if (lp) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; fl.Q.value = q; o.connect(fl); node = fl; }
    node.connect(g);
    g.connect(out);
    if (rev) { const s = ctx.createGain(); s.gain.value = rev; g.connect(s); s.connect(reverbIn); }
    o.start(T);
    o.stop(T + a + d + 0.05);
  }
  function noise({ t = 0, a = 0.003, d = 0.15, v = 0.2, ft = 'lowpass', f = 2000, f2 = 0, q = 1, out = sfxBus, rev = 0 }) {
    const T = ctx.currentTime + t;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const fl = ctx.createBiquadFilter();
    fl.type = ft; fl.frequency.setValueAtTime(f, T); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, T + a + d);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, T);
    g.gain.exponentialRampToValueAtTime(v, T + a);
    g.gain.exponentialRampToValueAtTime(0.0001, T + a + d);
    src.connect(fl); fl.connect(g); g.connect(out);
    if (rev) { const s = ctx.createGain(); s.gain.value = rev; g.connect(s); s.connect(reverbIn); }
    src.start(T, Math.random() * 1.5);
    src.stop(T + a + d + 0.05);
  }
  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

  // ---------- Sound effects ----------
  const SFX = {
    click: () => tone({ f: 620, f2: 520, type: 'triangle', d: 0.05, v: 0.09 }),
    step: () => { tone({ f: 110, f2: 55, d: 0.14, v: 0.35 }); noise({ f: 500, d: 0.08, v: 0.15 }); },
    card: () => { noise({ ft: 'bandpass', f: 500, f2: 3500, q: 1.4, d: 0.17, v: 0.28 }); },
    draw: () => noise({ ft: 'highpass', f: 2800, d: 0.04, v: 0.07 }),
    shuffle: () => { for (let i = 0; i < 7; i++) noise({ t: i * 0.035, ft: 'highpass', f: 2200 + Math.random() * 1500, d: 0.035, v: 0.09 }); },
    hit: () => { noise({ f: 2200, f2: 300, d: 0.16, v: 0.45 }); tone({ f: 150, f2: 50, d: 0.16, v: 0.5 }); },
    hitHeavy: () => { noise({ f: 1800, f2: 120, d: 0.35, v: 0.6 }); tone({ f: 110, f2: 35, d: 0.38, v: 0.7 }); tone({ f: 70, f2: 30, t: 0.02, d: 0.4, v: 0.4, type: 'triangle' }); },
    // Getting hit: a body blow, a fleshy smack, and a pained grunt from your hero.
    hurt: (o) => {
      const heavy = !!o.heavy;
      tone({ f: heavy ? 110 : 140, f2: 38, d: heavy ? 0.4 : 0.25, v: heavy ? 0.9 : 0.7 });
      noise({ ft: 'bandpass', f: 900, f2: 300, q: 1.2, d: 0.12, v: heavy ? 0.7 : 0.5 });
      noise({ f: 3000, f2: 400, d: 0.08, v: 0.35 });
      grunt(o.voice === 'moonblade' ? 1.45 : 1, heavy, 0.03);
    },
    swing: () => noise({ ft: 'bandpass', f: 400, f2: 2600, q: 2.5, a: 0.04, d: 0.14, v: 0.22 }),
    evade: () => { noise({ ft: 'bandpass', f: 2600, f2: 500, q: 2, a: 0.02, d: 0.22, v: 0.25 }); tone({ f: 1200, f2: 2400, d: 0.15, v: 0.04, rev: 0.4 }); },
    blocked: () => { tone({ f: 420, type: 'square', lp: 1800, d: 0.07, v: 0.08 }); tone({ f: 1250, d: 0.28, v: 0.12, rev: 0.3 }); tone({ f: 1870, d: 0.2, v: 0.05 }); noise({ ft: 'bandpass', f: 3200, d: 0.05, v: 0.25 }); },
    block: () => { tone({ f: 880, type: 'triangle', d: 0.25, v: 0.1, rev: 0.3 }); tone({ f: 1320, t: 0.03, d: 0.3, v: 0.07, rev: 0.3 }); noise({ ft: 'highpass', f: 4500, d: 0.06, v: 0.08 }); },
    ignite: () => { noise({ ft: 'bandpass', f: 300, f2: 2500, q: 0.8, a: 0.05, d: 0.3, v: 0.3 }); crackle(0.05, 4); },
    burn: () => { crackle(0, 6); noise({ f: 900, d: 0.25, v: 0.12 }); },
    buff: () => [523, 659, 784].forEach((f, i) => tone({ f, t: i * 0.06, d: 0.25, v: 0.09, type: 'triangle', rev: 0.35 })),
    power: () => { [262, 392, 523, 784].forEach((f, i) => tone({ f, t: i * 0.07, d: 0.6, v: 0.08, type: 'triangle', rev: 0.5 })); noise({ ft: 'bandpass', f: 800, f2: 4000, a: 0.1, d: 0.4, v: 0.08 }); },
    debuff: () => { tone({ f: 420, f2: 190, type: 'sawtooth', lp: 1200, d: 0.32, v: 0.09 }); tone({ f: 400, f2: 180, d: 0.32, v: 0.08, detune: 30 }); },
    heal: () => [659, 880, 1047, 1319].forEach((f, i) => tone({ f, t: i * 0.07, d: 0.4, v: 0.08, rev: 0.5 })),
    energy: () => { tone({ f: 660, f2: 1760, d: 0.2, v: 0.08, rev: 0.3 }); tone({ f: 2640, t: 0.12, d: 0.2, v: 0.04 }); },
    gold: () => { tone({ f: 1976, type: 'triangle', d: 0.1, v: 0.11 }); tone({ f: 2637, type: 'triangle', t: 0.07, d: 0.3, v: 0.11, rev: 0.2 }); },
    spend: () => { for (let i = 0; i < 3; i++) tone({ f: 1800 + i * 300, type: 'triangle', t: i * 0.05, d: 0.08, v: 0.08 }); },
    potion: () => { for (let i = 0; i < 4; i++) tone({ f: 300 + Math.random() * 150, f2: 900 + Math.random() * 400, t: i * 0.06, d: 0.07, v: 0.1 }); tone({ f: 200, f2: 120, t: 0.28, d: 0.15, v: 0.15 }); },
    potionGet: () => { for (let i = 0; i < 3; i++) tone({ f: 400 + i * 120, f2: 1000 + i * 200, t: i * 0.07, d: 0.07, v: 0.1 }); },
    relic: () => { [784, 988, 1175, 1568, 1976].forEach((f, i) => tone({ f, t: i * 0.05, d: 0.9, v: 0.06, rev: 0.6 })); },
    cardGet: () => { noise({ ft: 'bandpass', f: 600, f2: 3000, d: 0.18, v: 0.15 }); tone({ f: 1047, t: 0.1, d: 0.35, v: 0.08, rev: 0.4 }); tone({ f: 1568, t: 0.16, d: 0.35, v: 0.06, rev: 0.4 }); },
    upgrade: () => { for (let k = 0; k < 2; k++) { tone({ f: 1760, t: k * 0.22, d: 0.5, v: 0.1, rev: 0.4 }); tone({ f: 2420, t: k * 0.22, d: 0.35, v: 0.06 }); noise({ t: k * 0.22, ft: 'bandpass', f: 5000, d: 0.05, v: 0.3 }); } SFX.buff(); },
    remove: () => { noise({ ft: 'bandpass', f: 3000, f2: 250, d: 0.4, v: 0.18 }); tone({ f: 600, f2: 140, d: 0.35, v: 0.06 }); },
    exhaust: () => noise({ ft: 'highpass', f: 1200, f2: 7000, d: 0.35, v: 0.1 }),
    death: () => { noise({ f: 1800, f2: 90, d: 0.7, v: 0.35, rev: 0.3 }); tone({ f: 240, f2: 50, type: 'sawtooth', lp: 700, d: 0.7, v: 0.14 }); },
    summon: () => { tone({ f: 90, f2: 380, type: 'sawtooth', lp: 900, a: 0.05, d: 0.45, v: 0.1, rev: 0.4 }); noise({ ft: 'bandpass', f: 400, f2: 2000, a: 0.1, d: 0.4, v: 0.12 }); },
    split: () => { tone({ f: 320, f2: 80, d: 0.22, v: 0.25 }); noise({ f: 700, d: 0.18, v: 0.2 }); tone({ f: 260, f2: 70, t: 0.12, d: 0.2, v: 0.2 }); },
    turn: () => { tone({ f: 659, d: 1.2, v: 0.1, rev: 0.6 }); tone({ f: 1648, d: 0.7, v: 0.035, rev: 0.5 }); tone({ f: 988, t: 0.01, d: 0.9, v: 0.04 }); },
    enemyTurn: () => { tone({ f: 98, d: 1.1, v: 0.2, rev: 0.5 }); tone({ f: 147, d: 0.8, v: 0.07, type: 'triangle' }); noise({ f: 300, d: 0.3, v: 0.12 }); },
    error: () => { tone({ f: 150, type: 'square', lp: 900, d: 0.08, v: 0.08 }); tone({ f: 130, type: 'square', lp: 900, t: 0.1, d: 0.1, v: 0.08 }); },
    chest: () => { tone({ f: 120, f2: 190, type: 'sawtooth', lp: 600, a: 0.05, d: 0.35, v: 0.06 }); noise({ f: 900, t: 0.32, d: 0.15, v: 0.2 }); setTimeout(() => ctx && SFX.relic(), 380); },
    win: () => { [523, 659, 784, 1047].forEach((f, i) => tone({ f, t: i * 0.1, d: i === 3 ? 0.9 : 0.25, v: 0.12, type: 'triangle', rev: 0.5 })); tone({ f: 262, t: 0.3, d: 1, v: 0.1, rev: 0.4 }); },
    defeat: () => { [440, 349, 294, 220].forEach((f, i) => tone({ f, t: i * 0.35, d: 0.9, v: 0.1, type: 'triangle', rev: 0.6 })); tone({ f: 55, t: 1.05, d: 2, v: 0.25, rev: 0.5 }); },
    phoenix: () => { noise({ ft: 'bandpass', f: 200, f2: 4000, a: 0.2, d: 0.6, v: 0.25, rev: 0.5 }); SFX.heal(); },
    page: () => noise({ ft: 'bandpass', f: 1800, f2: 900, d: 0.12, v: 0.08 }),
    explode: () => {
      noise({ f: 3000, f2: 80, a: 0.005, d: 0.9, v: 0.9, rev: 0.4 });
      tone({ f: 90, f2: 28, d: 0.8, v: 0.9 });
      tone({ f: 60, f2: 25, t: 0.05, d: 0.9, v: 0.6, type: 'triangle' });
      crackle(0.15, 10);
    },
    bossIntro: () => {
      tone({ f: 55, d: 2.4, v: 0.5, rev: 0.6, type: 'sawtooth', lp: 300, a: 0.3 });
      tone({ f: 82.4, d: 2.2, v: 0.3, rev: 0.6, type: 'sawtooth', lp: 400, a: 0.4 });
      tone({ f: 41, d: 2.6, v: 0.6, a: 0.05 });
      noise({ f: 400, a: 0.4, d: 1.6, v: 0.25, rev: 0.5 });
      [0, 0.6, 1.2].forEach((t) => tone({ f: 65, f2: 40, t, d: 0.5, v: 0.5 }));
    },
    roar: () => {
      const T = 0;
      tone({ f: 120, f2: 60, t: T, a: 0.1, d: 1.1, v: 0.35, type: 'sawtooth', lp: 900, q: 3, rev: 0.4 });
      tone({ f: 180, f2: 85, t: T, a: 0.1, d: 1.0, v: 0.25, type: 'square', lp: 700, rev: 0.4, detune: 20 });
      noise({ ft: 'bandpass', f: 600, f2: 250, q: 1.5, a: 0.1, d: 1.1, v: 0.45, rev: 0.4 });
      tone({ f: 50, f2: 30, t: T, d: 0.9, v: 0.6 });
    },
    levelUp: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone({ f, t: i * 0.08, d: 0.5, v: 0.1, type: 'triangle', rev: 0.5 })); },
  };
  // A short vocal "ugh!": a buzzy voice shaped by vowel formants, with the pitch falling.
  function grunt(pitch, heavy, t0) {
    const T = ctx.currentTime + t0;
    const len = heavy ? 0.42 : 0.28;
    const src = ctx.createOscillator();
    src.type = 'sawtooth';
    const f0 = 165 * pitch;
    src.frequency.setValueAtTime(f0 * 1.25, T);
    src.frequency.linearRampToValueAtTime(f0, T + 0.05);
    src.frequency.exponentialRampToValueAtTime(f0 * 0.62, T + len);
    // a little roughness in the throat
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = 32; lfoG.gain.value = f0 * 0.06;
    lfo.connect(lfoG); lfoG.connect(src.frequency);
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, T);
    out.gain.exponentialRampToValueAtTime(heavy ? 0.55 : 0.4, T + 0.02);
    out.gain.setValueAtTime(heavy ? 0.5 : 0.35, T + len * 0.45);
    out.gain.exponentialRampToValueAtTime(0.0001, T + len);
    // vowel formants for "uh" sliding toward "oh"
    for (const [f1, f2, q, g] of [[700, 560, 7, 1], [1220, 950, 9, 0.6], [2600, 2400, 12, 0.25]]) {
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
      bp.frequency.setValueAtTime(f1 * (0.9 + pitch * 0.1), T); bp.frequency.linearRampToValueAtTime(f2 * (0.9 + pitch * 0.1), T + len);
      const gg = ctx.createGain(); gg.gain.value = g * 2.2;
      src.connect(bp); bp.connect(gg); gg.connect(out);
    }
    // breath
    const br = ctx.createBufferSource(); br.buffer = noiseBuf;
    const brf = ctx.createBiquadFilter(); brf.type = 'bandpass'; brf.frequency.value = 1500; brf.Q.value = 0.8;
    const brg = ctx.createGain(); brg.gain.setValueAtTime(0.0001, T); brg.gain.exponentialRampToValueAtTime(0.08, T + 0.02); brg.gain.exponentialRampToValueAtTime(0.0001, T + len);
    br.connect(brf); brf.connect(brg); brg.connect(out);
    out.connect(sfxBus);
    const s = ctx.createGain(); s.gain.value = 0.15; out.connect(s); s.connect(reverbIn);
    src.start(T); lfo.start(T); br.start(T, Math.random());
    src.stop(T + len + 0.05); lfo.stop(T + len + 0.05); br.stop(T + len + 0.05);
  }

  function crackle(t0, n) {
    for (let i = 0; i < n; i++) noise({ t: t0 + Math.random() * 0.3, ft: 'bandpass', f: 1500 + Math.random() * 3500, q: 3, a: 0.001, d: 0.02 + Math.random() * 0.03, v: 0.18 + Math.random() * 0.15 });
  }

  function play(name, opts = {}) {
    if (!ctx || settings.muted || !SFX[name]) return;
    if (ctx.state !== 'running') return;
    const now = performance.now();
    const gap = opts.gap != null ? opts.gap : 35;
    if (lastPlayed[name] && now - lastPlayed[name] < gap) return;
    lastPlayed[name] = now;
    try { SFX[name](opts); } catch (e) { /* never let audio break the game */ }
  }

  // ---------- Music ----------
  // A tiny generative composer: pads, bass, a melody and drums, built from a scale.
  const SCALES = {
    aeolian: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10],
    harmonic: [0, 2, 3, 5, 7, 8, 11], ionian: [0, 2, 4, 5, 7, 9, 11], lydian: [0, 2, 4, 6, 7, 9, 11],
  };
  const ACT_KEYS = [
    { root: 45, scale: 'aeolian', chords: [0, 5, 3, 4] },   // Act 1: A minor, drowned & melancholy
    { root: 50, scale: 'dorian', chords: [0, 3, 6, 4] },    // Act 2: D dorian, eerie fungal glow
    { root: 40, scale: 'phrygian', chords: [0, 1, 5, 0] },  // Act 3: E phrygian, the abyss
  ];
  const TRACKS = {
    title:    { bpm: 58, key: { root: 45, scale: 'aeolian', chords: [0, 5, 2, 4] }, pad: 1, bells: 0.14, bassEvery: 16 },
    map:      { bpm: 66, pad: 1, pluck: 0.16, bassEvery: 16 },
    combat:   { bpm: 100, pad: 0.6, pluck: 0.18, arp: 0.45, bass: 'eighths', kick: [0, 8], hat: [2, 6, 10, 14] },
    elite:    { bpm: 112, pad: 0.6, pluck: 0.22, arp: 0.6, bass: 'drive', kick: [0, 7, 8], snare: [4, 12], hat: [2, 6, 10, 14], scale: 'harmonic' },
    boss:     { bpm: 124, pad: 0.7, pluck: 0.28, arp: 0.7, bass: 'sixteenths', kick: [0, 3, 8, 11], snare: [4, 12], hat: [2, 6, 10, 14, 15], toms: true, scale: 'harmonic' },
    shop:     { bpm: 84, key: { root: 53, scale: 'ionian', chords: [0, 3, 5, 4] }, pad: 0.6, pluck: 0.3, arp: 0.3, bassEvery: 8, hat: [4, 12] },
    rest:     { bpm: 54, key: { root: 48, scale: 'lydian', chords: [0, 1, 0, 4] }, pad: 1, bells: 0.12, bassEvery: 16, fire: true },
    dawn:     { bpm: 70, key: { root: 48, scale: 'ionian', chords: [0, 5, 3, 4] }, pad: 1, bells: 0.25, pluck: 0.15, bassEvery: 8 },
    gameover: { bpm: 48, key: { root: 45, scale: 'aeolian', chords: [0, 5, 3, 0] }, pad: 1, bells: 0.08, bassEvery: 16 },
  };

  function music(name) {
    const act = Game.run ? Game.run.act : 1;
    const key = name ? name + ':' + act : null;
    if (wanted && wanted.key === key) return;
    wanted = name ? { key, name, act } : null;
    if (ctx) startTrack(wanted);
  }

  function stopCurrent(fade = 1.2) {
    if (!current) return;
    const c = current;
    current = null;
    clearInterval(c.timer);
    c.gain.gain.setTargetAtTime(0, ctx.currentTime, fade / 4);
    setTimeout(() => c.gain.disconnect(), fade * 1000 + 500);
  }

  function startTrack(w) {
    if (current && w && current.key === w.key) return;
    stopCurrent();
    if (!w) return;
    const T = TRACKS[w.name];
    const base = { ...ACT_KEYS[w.act - 1] };
    const key = T.key || { ...base, scale: T.scale || base.scale };
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.gain.setTargetAtTime(1, ctx.currentTime + 0.3, 0.6);
    gain.connect(musicBus);
    const send = ctx.createGain(); send.gain.value = 0.45; gain.connect(send); send.connect(reverbIn);
    const tr = { key: w.key, T, k: key, gain, step: 0, next: ctx.currentTime + 0.35, motif: null, timer: null };
    tr.timer = setInterval(() => schedule(tr), 40);
    current = tr;
  }

  function scaleNote(k, degree, octave = 0) {
    const sc = SCALES[k.scale];
    const o = Math.floor(degree / sc.length);
    const d = ((degree % sc.length) + sc.length) % sc.length;
    return k.root + sc[d] + 12 * (o + octave);
  }
  function makeMotif(chordDeg) {
    const m = [];
    let deg = chordDeg + [0, 2, 4][Math.floor(Math.random() * 3)];
    for (let i = 0; i < 16; i++) {
      deg += [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
      deg = Math.max(chordDeg - 2, Math.min(chordDeg + 9, deg));
      m.push({ deg, on: Math.random() });
    }
    return m;
  }

  function schedule(tr) {
    if (!ctx || current !== tr) return;
    const spb = 60 / tr.T.bpm / 4; // seconds per 16th note
    while (tr.next < ctx.currentTime + 0.15) {
      if (tr.next < ctx.currentTime - 0.2) tr.next = ctx.currentTime + 0.05; // tab was asleep: skip ahead
      playStep(tr, tr.step, tr.next, spb);
      tr.step++;
      tr.next += spb;
    }
  }

  function playStep(tr, step, when, spb) {
    const T = tr.T, k = tr.k, out = tr.gain;
    const s16 = step % 16, bar = Math.floor(step / 16);
    const chordBars = T.bpm < 90 ? 2 : 1;
    const chordDeg = k.chords[Math.floor(bar / chordBars) % k.chords.length];
    const t = Math.max(0, when - ctx.currentTime);
    if (s16 === 0 && bar % 4 === 0) tr.motif = makeMotif(chordDeg);
    // Pad: soft detuned chord, renewed each chord change
    if (T.pad && s16 === 0 && bar % chordBars === 0) {
      const len = spb * 16 * chordBars;
      for (const deg of [0, 2, 4]) {
        const f = midi(scaleNote(k, chordDeg + deg, 0));
        for (const dt of [-7, 7]) tone({ f, type: 'sawtooth', lp: 750, t, a: len * 0.35, d: len * 0.75, v: 0.022 * T.pad, detune: dt, out });
      }
    }
    // Bass
    const root = midi(scaleNote(k, chordDeg, -1));
    if (T.bassEvery && s16 % T.bassEvery === 0) tone({ f: root, type: 'triangle', t, a: 0.02, d: spb * T.bassEvery * 0.9, v: 0.16, out });
    if (T.bass === 'eighths' && s16 % 2 === 0) tone({ f: s16 % 8 === 6 ? root * 1.5 : root, type: 'triangle', t, d: spb * 1.6, v: 0.15, out });
    if (T.bass === 'drive' && s16 % 2 === 0) tone({ f: s16 === 14 ? root * 1.5 : root, type: 'sawtooth', lp: 420, q: 4, t, d: spb * 1.5, v: 0.11, out });
    if (T.bass === 'sixteenths') tone({ f: s16 % 4 === 3 ? root * 2 : root, type: 'sawtooth', lp: 380 + (s16 % 4) * 60, q: 5, t, d: spb * 0.9, v: 0.1, out });
    // Arpeggio over the chord
    if (T.arp && Math.random() < T.arp && s16 % 2 === 1) {
      const deg = chordDeg + [0, 2, 4, 7][Math.floor(Math.random() * 4)];
      tone({ f: midi(scaleNote(k, deg, 1)), type: 'triangle', t, d: spb * 1.4, v: 0.035, out });
    }
    // Melody from the current motif
    const m = tr.motif && tr.motif[s16];
    if (m && T.pluck && m.on < T.pluck * 2 && s16 % 2 === 0) {
      tone({ f: midi(scaleNote(k, m.deg, 1)), type: 'triangle', t, a: 0.005, d: spb * 5, v: 0.06, out });
    }
    if (m && T.bells && m.on < T.bells * 2 && s16 % 4 === 0) {
      const f = midi(scaleNote(k, m.deg, 2));
      tone({ f, t, a: 0.005, d: spb * 10, v: 0.045, out });
      tone({ f: f * 2.76, t, a: 0.005, d: spb * 4, v: 0.012, out });
    }
    // Drums
    if (T.kick && T.kick.includes(s16)) { tone({ f: 140, f2: 42, t, d: 0.22, v: 0.4, out }); }
    if (T.snare && T.snare.includes(s16)) { noise({ ft: 'bandpass', f: 1800, q: 0.8, t, d: 0.13, v: 0.12, out }); tone({ f: 190, f2: 140, t, d: 0.08, v: 0.08, out }); }
    if (T.hat && T.hat.includes(s16)) noise({ ft: 'highpass', f: 7000, t, d: 0.03, v: 0.045, out });
    if (T.toms && s16 === 14 && bar % 2 === 1) { tone({ f: 120, f2: 70, t, d: 0.25, v: 0.25, out }); tone({ f: 90, f2: 55, t: t + spb, d: 0.3, v: 0.25, out }); }
    // Hearth: crackling fire
    if (T.fire && Math.random() < 0.35) noise({ ft: 'bandpass', f: 1500 + Math.random() * 3000, q: 3, t: t + Math.random() * spb, a: 0.001, d: 0.02, v: 0.05 + Math.random() * 0.06, out });
    if (T.fire && s16 === 0) noise({ f: 500, t, a: spb * 6, d: spb * 10, v: 0.025, out });
  }

  // ---------- Settings ----------
  function set(key, val) { settings[key] = val; saveSettings(); applyVolumes(); }
  function toggleMute() { set('muted', !settings.muted); return settings.muted; }

  return { play, music, set, toggleMute, settings, init, state: () => (ctx ? ctx.state : 'not started'), track: () => (current ? current.key : null) };
})();

// Volume controls, used in the in-game menu and the title screen.
function audioSettingsEl() {
  const box = el('div', 'audio-settings');
  const row = (label, key) => {
    const r = el('label', 'audio-row', `<span>${label}</span><input type="range" min="0" max="100" step="5" value="${Math.round(Sound.settings[key] * 100)}"><b>${Math.round(Sound.settings[key] * 100)}%</b>`);
    const input = $('input', r), out = $('b', r);
    input.oninput = () => { Sound.set(key, input.value / 100); out.textContent = input.value + '%'; };
    input.onchange = () => { if (key === 'sfx') Sound.play('hit'); };
    return r;
  };
  box.appendChild(row(':note: Music', 'music'));
  box.appendChild(row(':speaker: Sounds', 'sfx'));
  const mute = el('button', 'btn small' + (Sound.settings.muted ? ' danger' : ''), Sound.settings.muted ? ':speakerOff: Sound is off (M)' : ':speakerLow: Mute all (M)');
  mute.onclick = () => {
    const m = Sound.toggleMute();
    mute.className = 'btn small' + (m ? ' danger' : '');
    mute.textContent = m ? ':speakerOff: Sound is off (M)' : ':speakerLow: Mute all (M)';
    renderTopbar(true);
  };
  box.appendChild(mute);
  return box;
}

// Generic UI clicks and the M (mute) key.
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('.btn, .tab, .chip, .event-option, .rest-option, .card-slot, .potion-slot, .boss-relic, .reward-item');
  if (t && !t.disabled) Sound.play('click');
}, true);
document.addEventListener('keydown', (ev) => {
  if ((ev.key === 'm' || ev.key === 'M') && !ev.ctrlKey && !ev.metaKey && !/INPUT|TEXTAREA/.test(ev.target.tagName)) {
    const m = Sound.toggleMute();
    toast(m ? ':speakerOff: Sound off' : ':speaker: Sound on', 1200);
    if (Game.run) renderTopbar(true);
  }
});

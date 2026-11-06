// ===== Core helpers & global game state =====
'use strict';

const Game = {
  run: null,      // the current run (saved between sessions)
  combat: null,   // the active Combat instance (or null)
  speed: 1,       // animation speed multiplier (lower = faster)
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

// ---- Randomness ----
// Game logic uses rng(). Normally it is just Math.random, but daily and seeded runs
// switch it to a repeatable generator so everyone gets the same maps and rewards.
const Rng = { state: null };
function rng() {
  if (Rng.state == null) return Math.random();
  let t = (Rng.state = (Rng.state + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h | 0;
}

const rand = (a, b) => a + Math.floor(rng() * (b - a + 1));
const chance = (p) => rng() < p;
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function pickN(arr, n) { return shuffle(arr.slice()).slice(0, n); }
function weighted(entries) { // [[value, weight], ...]
  const total = entries.reduce((s, e) => s + e[1], 0);
  let r = rng() * total;
  for (const [v, w] of entries) { if ((r -= w) < 0) return v; }
  return entries[entries.length - 1][0];
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms * Game.speed));

function newUid() {
  const run = Game.run;
  if (!run) return Math.floor(Math.random() * 1e9);
  run.nextUid = (run.nextUid || 1) + 1;
  return run.nextUid;
}

// Escape plain text for innerHTML
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ===== Accounts and cloud saves (Supabase) =====
// Sign in with an email and password, and your profile (Lantern Level, unlocks,
// Journal, achievements) and your unfinished run are kept on your account, so you
// can play from any browser.
//
// The browser keeps its own copy as well. The first time you sign in, whatever this
// browser already has is uploaded to your account. Nothing local is ever deleted.
//
// Setup: put your project's URL and anon (publishable) key below.
// Supabase dashboard > Project Settings > API. The SQL for the table is in README.md.
'use strict';

const CLOUD_CONFIG = {
  url: 'https://husuyogzkuwmgyanotqp.supabase.co',   // like 'https://abcdefgh.supabase.co'
  key: 'sb_publishable_jSh7tz6SI44II-nRGQecMw_YLUwl4o2',   // the anon / publishable key (safe to publish; the table rules protect each account)
};
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js';

// Two profiles (for example this browser and your account) become one, keeping the best of both.
function mergeProfiles(a, b) {
  a = a || {}; b = b || {};
  const newer = (a.savedAt || 0) >= (b.savedAt || 0) ? a : b;
  const out = Object.assign(Profile.defaults(), b, a, newer);
  const maxMap = (x = {}, y = {}) => { const o = { ...x }; for (const k in y) o[k] = Math.max(o[k] || 0, y[k] || 0); return o; };
  out.xp = Math.max(a.xp || 0, b.xp || 0);
  out.seenLevel = Math.max(a.seenLevel || 0, b.seenLevel || 0);
  out.tutorialDone = !!(a.tutorialDone || b.tutorialDone);
  for (const k of ['depth', 'wins', 'runs', 'bestStreak']) out[k] = maxMap(a[k], b[k]);
  out.streak = { ...(newer.streak || {}) };
  out.ach = { ...(b.ach || {}) };
  for (const k in a.ach || {}) out.ach[k] = Math.min(a.ach[k], out.ach[k] || Infinity);
  out.daily = { ...(b.daily || {}) };
  for (const k in a.daily || {}) if (!out.daily[k] || a.daily[k].score > out.daily[k].score) out.daily[k] = a.daily[k];
  const seen = new Map();
  for (const h of [...(a.history || []), ...(b.history || [])]) {
    const id = `${h.date}|${h.char}|${h.score}`;
    if (!seen.has(id) || (h.maps && !seen.get(id).maps)) seen.set(id, h);
  }
  out.history = [...seen.values()].sort((x, y) => y.date - x.date).slice(0, 60);
  out.history.forEach((h, i) => { if (i >= 15) delete h.maps; });
  out.savedAt = Math.max(a.savedAt || 0, b.savedAt || 0);
  return out;
}

const Cloud = (() => {
  const RUN_AT = 'lanternfall_run_at';
  let sb = null, user = null, timer = null, busy = false, state = 'off', lastSync = 0, lastError = '', loading = null;
  const listeners = new Set();

  const configured = () => !!(CLOUD_CONFIG.url && CLOUD_CONFIG.key);
  const setState = (s, err = '') => { state = s; lastError = err; listeners.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); };
  const runAt = () => +localStorage.getItem(RUN_AT) || 0;

  function load() {
    if (loading) return loading;
    loading = new Promise((resolve) => {
      if (!configured()) return resolve(false);
      if (window.supabase) return resolve(true);
      const s = document.createElement('script');
      s.src = SUPABASE_JS;
      s.onload = () => resolve(!!window.supabase);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
    return loading;
  }

  async function init() {
    if (!configured()) return;
    if (!(await load())) { setState('error', 'Could not reach the account service. Check your internet connection.'); return; }
    sb = window.supabase.createClient(CLOUD_CONFIG.url, CLOUD_CONFIG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    sb.auth.onAuthStateChange((event, session) => {
      const before = user && user.id;
      user = session ? session.user : null;
      if (!user) { setState('signedOut'); return; }
      // run outside the callback (Supabase asks for this)
      if (user.id !== before) setTimeout(sync, 0);
    });
  }

  // Pull the account's save, merge it with this browser, and push the result back.
  async function sync() {
    if (!sb || !user || busy) return;
    busy = true;
    setState('syncing');
    try {
      const { data, error } = await sb.from('saves').select('profile, run, run_at').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      if (data) {
        if (data.profile) { Profile.d = mergeProfiles(Profile.get(), data.profile); Profile.save(true); }
        const cloudAt = data.run_at ? Date.parse(data.run_at) : 0;
        // The newer unfinished run wins, unless a run is being played on this page right now.
        if (cloudAt > runAt() && !Game.run) {
          try {
            if (data.run) localStorage.setItem(SAVE_KEY, JSON.stringify(data.run)); else localStorage.removeItem(SAVE_KEY);
            localStorage.setItem(RUN_AT, String(cloudAt));
          } catch (e) { /* ignore */ }
        }
      }
      busy = false;
      await push();
      if (document.querySelector('.title-screen') && !Game.run) refreshTitle();
    } catch (e) {
      busy = false;
      setState('error', e.message || String(e));
    }
  }

  async function push() {
    if (!sb || !user || busy) return;
    clearTimeout(timer); timer = null;
    busy = true;
    try {
      if (!runAt()) localStorage.setItem(RUN_AT, String(Date.now()));
      const { error } = await sb.from('saves').upsert({
        user_id: user.id, profile: Profile.get(), run: loadSave(),
        run_at: new Date(runAt()).toISOString(), updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      lastSync = Date.now();
      busy = false;
      setState('synced');
    } catch (e) {
      busy = false;
      setState('error', e.message || String(e));
    }
  }

  // Called whenever the profile or the run is saved. Uploads a moment later.
  function changed(runChanged) {
    if (runChanged) { try { localStorage.setItem(RUN_AT, String(Date.now())); } catch (e) { /* ignore */ } }
    if (!sb || !user) return;
    clearTimeout(timer);
    timer = setTimeout(push, 2500);
    if (state === 'synced') setState('pending');
  }

  // upload right away when the tab is hidden or closed
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && timer) push(); });

  async function signIn(email, password) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }
  async function signUp(email, password) {
    const opts = /^https?:/.test(location.protocol) ? { emailRedirectTo: location.href.split('#')[0] } : {};
    const { data, error } = await sb.auth.signUp({ email, password, options: opts });
    if (error) throw error;
    return !!data.session; // false: a confirmation email was sent
  }
  async function signOut() {
    if (timer) await push();
    await sb.auth.signOut();
    user = null;
    setState('signedOut');
  }

  return {
    init, sync, changed, signIn, signUp, signOut, configured,
    ready: () => !!sb,
    user: () => user,
    state: () => state,
    error: () => lastError,
    lastSync: () => lastSync,
    onChange: (f) => { listeners.add(f); return () => listeners.delete(f); },
  };
})();

function refreshTitle() {
  const accountOpen = !!document.querySelector('#overlay.show .account-box');
  showTitle();
  if (accountOpen) showAccount();
}

// One line on the title screen saying where progress is kept.
function cloudLineHTML() {
  if (!Cloud.configured()) return '';
  const u = Cloud.user();
  if (!u) return `<p class="cloud-line">:cloud: Progress is saved in this browser only. <a href="#" class="cloud-link">Sign in</a> to keep it on your account.</p>`;
  const st = Cloud.state();
  const text = st === 'error' ? `<span class="bad">Could not sync</span>` : st === 'syncing' ? 'Syncing...' : st === 'pending' ? 'Saving...' : 'Saved to your account';
  return `<p class="cloud-line">:cloud: ${text} · <a href="#" class="cloud-link">${esc(u.email || 'Account')}</a></p>`;
}

function showAccount() {
  const box = el('div', 'menu-box account-box');
  let off = null;
  const paint = () => {
    if (!box.isConnected && box.dataset.drawn) { if (off) off(); return; }
    box.dataset.drawn = '1';
    box.innerHTML = '<h2>:cloud: Account</h2>';
    if (!Cloud.configured()) {
      box.appendChild(el('p', '', 'Accounts are not set up yet. Your progress is saved in this browser.'));
    } else if (!Cloud.ready()) {
      box.appendChild(el('p', '', Cloud.error() || 'Connecting...'));
    } else if (!Cloud.user()) {
      box.insertAdjacentHTML('beforeend', `<p class="sub">Sign in to keep your progress on your account and play from any browser.<br>
        Everything this browser already has (your levels, Journal and the run you are on) is uploaded the first time. Nothing is deleted.</p>
        <form class="account-form">
          <label>Email <input type="email" name="email" autocomplete="email" required></label>
          <label>Password <input type="password" name="password" autocomplete="current-password" minlength="6" required></label>
          <p class="account-msg"></p>
          <div class="menu-row"><button class="btn primary" value="in">Sign in</button><button class="btn" value="up">Create account</button></div>
        </form>`);
      const form = $('.account-form', box), msg = $('.account-msg', box);
      form.onsubmit = async (ev) => {
        ev.preventDefault();
        const which = ev.submitter && ev.submitter.value;
        const email = form.email.value.trim(), password = form.password.value;
        msg.className = 'account-msg'; msg.textContent = which === 'up' ? 'Creating your account...' : 'Signing in...';
        [...form.querySelectorAll('button')].forEach((b) => { b.disabled = true; });
        try {
          if (which === 'up') {
            const now = await Cloud.signUp(email, password);
            if (!now) { msg.textContent = 'Check your email and click the link to confirm your account, then sign in here.'; }
          } else await Cloud.signIn(email, password);
        } catch (e) { msg.className = 'account-msg bad'; msg.textContent = e.message || String(e); }
        [...form.querySelectorAll('button')].forEach((b) => { b.disabled = false; });
      };
    } else {
      const st = Cloud.state(), last = Cloud.lastSync();
      box.insertAdjacentHTML('beforeend', `<p>Signed in as <b>${esc(Cloud.user().email || '')}</b></p>
        <p class="sub">${st === 'error' ? `<span class="bad">Could not sync: ${esc(Cloud.error())}</span>`
          : st === 'syncing' ? 'Syncing...' : last ? `Last saved to your account at ${new Date(last).toLocaleTimeString()}.` : ''}</p>`);
      const row = el('div', 'menu-row');
      row.append(button('Sync now', () => Cloud.sync(), 'btn'), button('Sign out', async () => { await Cloud.signOut(); }, 'btn ghost'));
      box.appendChild(row);
    }
    box.appendChild(button('Close', () => { closeOverlay(); if (document.querySelector('.title-screen')) showTitle(); }, 'btn ghost'));
  };
  paint();
  off = Cloud.onChange(paint);
  openOverlay(box);
}

Cloud.onChange(() => {
  const line = document.querySelector('.title-screen .cloud-line');
  if (line) { line.outerHTML = cloudLineHTML(); bindCloudLink(); }
});
function bindCloudLink() {
  const a = document.querySelector('.title-screen .cloud-link');
  if (a) a.onclick = (ev) => { ev.preventDefault(); showAccount(); };
}

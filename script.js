// ══════════════════════════════════════════
//  AgriSmart — script.js
//  Auth, Session, Validation, Navigation
// ══════════════════════════════════════════

const AgriSmart = {

  // ─── Storage Keys ─────────────────────
  KEYS: {
    USERS:   'agrismart_users',
    SESSION: 'agrismart_session',
  },

  // ─── Get users array ──────────────────
  getUsers() {
    return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
  },

  // ─── Save users array ─────────────────
  saveUsers(users) {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  },

  // ─── Get current session ──────────────
  getSession() {
    return JSON.parse(sessionStorage.getItem(this.KEYS.SESSION) || 'null');
  },

  // ─── Set session ──────────────────────
  setSession(user) {
    sessionStorage.setItem(this.KEYS.SESSION, JSON.stringify(user));
  },

  // ─── Clear session ────────────────────
  clearSession() {
    sessionStorage.removeItem(this.KEYS.SESSION);
  },

  // ─── Guard: must be logged in ─────────
  requireAuth() {
    if (!this.getSession()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // ─── Guard: must NOT be logged in ─────
  requireGuest() {
    if (this.getSession()) {
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  },

  // ─── Validate email format ────────────
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  },

  // ─── Show field error ─────────────────
  showFieldError(fieldId, msgId, msg) {
    const field = document.getElementById(fieldId);
    const msgEl = document.getElementById(msgId);
    if (field) field.classList.add('error-field');
    if (msgEl) { msgEl.textContent = msg; msgEl.classList.add('show'); }
  },

  // ─── Clear field error ────────────────
  clearFieldError(fieldId, msgId) {
    const field = document.getElementById(fieldId);
    const msgEl = document.getElementById(msgId);
    if (field) field.classList.remove('error-field');
    if (msgEl) msgEl.classList.remove('show');
  },

  // ─── Show global message ──────────────
  showGlobal(elId, msg, type = 'error') {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.className = type === 'success' ? 'global-success show' : 'global-error show';
  },

  // ─── Hide global message ──────────────
  hideGlobal(elId) {
    const el = document.getElementById(elId);
    if (el) el.className = el.className.replace(' show', '');
  },

  // ─── SIGNUP ───────────────────────────
  handleSignup(e) {
    e.preventDefault();
    const name    = document.getElementById('signup-name');
    const email   = document.getElementById('signup-email');
    const pass    = document.getElementById('signup-pass');
    const confirm = document.getElementById('signup-confirm');
    let valid = true;

    // Clear all errors
    ['signup-name','signup-email','signup-pass','signup-confirm'].forEach((id, i) => {
      AgriSmart.clearFieldError(id, ['err-name','err-email','err-pass','err-confirm'][i]);
    });
    AgriSmart.hideGlobal('signup-global');

    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
      AgriSmart.showFieldError('signup-name', 'err-name', 'Please enter your full name (min 2 characters).');
      valid = false;
    }
    // Validate email
    if (!AgriSmart.isValidEmail(email.value)) {
      AgriSmart.showFieldError('signup-email', 'err-email', 'Please enter a valid email address.');
      valid = false;
    }
    // Validate password
    if (pass.value.length < 6) {
      AgriSmart.showFieldError('signup-pass', 'err-pass', 'Password must be at least 6 characters.');
      valid = false;
    }
    // Confirm password
    if (pass.value !== confirm.value) {
      AgriSmart.showFieldError('signup-confirm', 'err-confirm', 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    // Check if email exists
    const users = AgriSmart.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.value.toLowerCase().trim())) {
      AgriSmart.showGlobal('signup-global', 'An account with this email already exists. Please login.');
      return;
    }

    // Save user
    const newUser = {
      id:        Date.now(),
      name:      name.value.trim(),
      email:     email.value.toLowerCase().trim(),
      password:  pass.value,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    AgriSmart.saveUsers(users);

    AgriSmart.showGlobal('signup-global', '✓ Account created! Redirecting to login…', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 1400);
  },

  // ─── LOGIN ────────────────────────────
  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email');
    const pass  = document.getElementById('login-pass');
    let valid = true;

    ['login-email','login-pass'].forEach((id, i) => {
      AgriSmart.clearFieldError(id, ['err-login-email','err-login-pass'][i]);
    });
    AgriSmart.hideGlobal('login-global');

    if (!AgriSmart.isValidEmail(email.value)) {
      AgriSmart.showFieldError('login-email', 'err-login-email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!pass.value) {
      AgriSmart.showFieldError('login-pass', 'err-login-pass', 'Please enter your password.');
      valid = false;
    }
    if (!valid) return;

    const users = AgriSmart.getUsers();
    const user  = users.find(u =>
      u.email === email.value.toLowerCase().trim() && u.password === pass.value
    );

    if (!user) {
      AgriSmart.showGlobal('login-global', 'Incorrect email or password. Please try again.');
      return;
    }

    // Set session (don't store password in session)
    const { password: _, ...safeUser } = user;
    AgriSmart.setSession(safeUser);
    window.location.href = 'dashboard.html';
  },

  // ─── LOGOUT ───────────────────────────
  logout() {
    AgriSmart.clearSession();
    window.location.href = 'index.html';
  },

  // ─── Password strength ────────────────
  checkPasswordStrength(value) {
    const fill  = document.getElementById('ps-fill');
    const label = document.getElementById('ps-label');
    if (!fill || !label) return;
    let score = 0;
    if (value.length >= 6)  score++;
    if (value.length >= 10) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    const levels = [
      { w: '0%',   c: '#e5e5e5', t: '' },
      { w: '25%',  c: '#e63946', t: 'Weak' },
      { w: '50%',  c: '#f4a261', t: 'Fair' },
      { w: '75%',  c: '#e9c46a', t: 'Good' },
      { w: '100%', c: '#52b788', t: 'Strong' },
    ];
    const l = levels[Math.min(score, 4)];
    fill.style.width      = l.w;
    fill.style.background = l.c;
    label.textContent     = value ? `Strength: ${l.t}` : '';
  },

  // ─── Populate dashboard ───────────────
  initDashboard() {
    const session = AgriSmart.getSession();
    if (!session) { window.location.href = 'login.html'; return; }

    // Welcome
    const el = document.getElementById('dash-user-name');
    if (el) el.textContent = session.name.split(' ')[0];

    const avatarEl = document.getElementById('dash-avatar');
    if (avatarEl) avatarEl.textContent = session.name.charAt(0).toUpperCase();

    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) sidebarName.textContent = session.name;

    // Date
    const dateEl = document.getElementById('top-date');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  },
};

// ══════════════════════════════════════════
//  Page-specific init on DOMContentLoaded
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'home') {
    // Redirect if already logged in
    if (AgriSmart.getSession()) {
      const loginBtn = document.getElementById('nav-login-btn');
      if (loginBtn) loginBtn.textContent = '→ Dashboard';
    }
  }

  if (page === 'signup') {
    AgriSmart.requireGuest();
    const form = document.getElementById('signup-form');
    if (form) form.addEventListener('submit', e => AgriSmart.handleSignup(e));

    const passInput = document.getElementById('signup-pass');
    if (passInput) passInput.addEventListener('input', e => AgriSmart.checkPasswordStrength(e.target.value));
  }

  if (page === 'login') {
    AgriSmart.requireGuest();
    const form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', e => AgriSmart.handleLogin(e));
  }

  if (page === 'dashboard') {
    AgriSmart.initDashboard();

    // Sidebar nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Sidebar mobile toggle
    const toggle  = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
      });
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }
  }
});

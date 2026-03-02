// ══════════════════════════════════════════════════
// STUDWEB AI — SYSTÈME ADMINISTRATEUR
// ══════════════════════════════════════════════════

const ADMIN_PASSWORD = "AdminStudWebAI2026"; // Changez ce mot de passe

// ─── State ───────────────────────────────────────
let adminOpen = false;
let adminAuthenticated = false;

// ─── Default config (fallback si rien en storage) ─
const defaultConfig = {
  prices: {
    Basic: 200,
    Premium: 300,
    Ultimate: 400
  },
  packs: {
    Basic: {
      name: "Basic",
      features: ["1 à 3 pages", "Design responsive", "Formulaire de contact", "Hébergement 1 mois offert", "Livraison en 48h"]
    },
    Premium: {
      name: "Premium",
      features: ["3 à 6 pages", "SEO technique complet", "Intégration paiement", "Analytics intégré", "Support 30 jours", "Livraison en 48h"]
    },
    Ultimate: {
      name: "Ultimate",
      features: ["Pages illimitées", "E-commerce complet", "Automatisation IA", "Chatbot intégré", "Maintenance 3 mois", "Support prioritaire"]
    }
  },
  hero: {
    eyebrow: "Tarifs transparents",
    title: "Des prix clairs, des résultats concrets",
    subtitle: "Sans abonnement caché, sans mauvaise surprise. Vous payez une fois, votre site vous appartient."
  },
  contact: {
    email: "studweb.ai@gmail.com"
  }
};

// ─── Load / Save config ───────────────────────────
function loadConfig() {
  try {
    const stored = localStorage.getItem("studweb_admin_config");
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultConfig));
  } catch(e) { return JSON.parse(JSON.stringify(defaultConfig)); }
}

function saveConfig(config) {
  localStorage.setItem("studweb_admin_config", JSON.stringify(config));
}

// ─── Apply config to page ─────────────────────────
function applyConfigToPage() {
  const config = loadConfig();

  // Prices
  document.querySelectorAll(".pack-price").forEach(el => {
    const card = el.closest(".pack-card");
    if (!card) return;
    const nameEl = card.querySelector(".pack-name");
    if (!nameEl) return;
    const packName = nameEl.textContent.trim();
    if (config.prices[packName] !== undefined) {
      el.innerHTML = `<span class="pack-currency">€</span>${config.prices[packName]}`;
    }
  });

  // Pack buttons
  document.querySelectorAll(".btn-pack").forEach(btn => {
    const card = btn.closest(".pack-card");
    if (!card) return;
    const nameEl = card.querySelector(".pack-name");
    if (!nameEl) return;
    const packName = nameEl.textContent.trim();
    if (config.prices[packName] !== undefined) {
      btn.setAttribute("onclick", `addToCart('${packName}', ${config.prices[packName]})`);
    }
  });

  // Features
  document.querySelectorAll(".pack-card").forEach(card => {
    const nameEl = card.querySelector(".pack-name");
    if (!nameEl) return;
    const packName = nameEl.textContent.trim();
    const featList = card.querySelector(".pack-features");
    if (featList && config.packs[packName]) {
      featList.innerHTML = config.packs[packName].features.map(f => `<li>${f}</li>`).join("");
    }
  });

  // Hero (offres page)
  const heroEyebrow = document.querySelector(".page-hero .section-eyebrow");
  const heroSub = document.querySelector(".page-hero p");
  if (heroEyebrow) heroEyebrow.textContent = config.hero.eyebrow;
  if (heroSub) heroSub.textContent = config.hero.subtitle;
}

// ─── Admin Panel HTML ─────────────────────────────
function injectAdminPanel() {
  if (document.getElementById("adminPanel")) return;

  const panel = document.createElement("div");
  panel.id = "adminPanel";
  panel.innerHTML = `
    <div id="adminOverlay" onclick="closeAdmin()"></div>
    <div id="adminDrawer">
      <div id="adminLock" class="admin-screen">
        <div class="admin-lock-inner">
          <div class="admin-logo">⚙</div>
          <h2 class="admin-title">Zone Administrateur</h2>
          <p class="admin-sub">Entrez le mot de passe pour accéder au panneau de contrôle.</p>
          <div class="admin-input-wrap">
            <input type="password" id="adminPasswordInput" placeholder="Mot de passe..." class="admin-input" onkeydown="if(event.key==='Enter') checkAdminPassword()">
            <button class="admin-btn-primary" onclick="checkAdminPassword()">Entrer →</button>
          </div>
          <p id="adminError" class="admin-error" style="display:none;">Mot de passe incorrect.</p>
        </div>
      </div>

      <div id="adminDashboard" class="admin-screen" style="display:none;">
        <div class="admin-header">
          <div class="admin-header-left">
            <span class="admin-logo-small">⚙</span>
            <span class="admin-header-title">Administration</span>
          </div>
          <button class="admin-close-btn" onclick="closeAdmin()">✕</button>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab active" onclick="switchTab('prices', this)">💰 Tarifs</button>
          <button class="admin-tab" onclick="switchTab('features', this)">📋 Fonctionnalités</button>
          <button class="admin-tab" onclick="switchTab('general', this)">⚙ Général</button>
          <button class="admin-tab" onclick="switchTab('security', this)">🔒 Sécurité</button>
        </div>

        <div class="admin-content">

          <!-- TAB: PRICES -->
          <div id="tab-prices" class="admin-tab-content active">
            <div class="admin-section-title">Modifier les prix des packs</div>
            <div class="admin-prices-grid">
              <div class="admin-price-card">
                <div class="admin-price-icon">⚡</div>
                <label>Pack Basic</label>
                <div class="admin-price-input-wrap">
                  <span class="euro">€</span>
                  <input type="number" id="priceBasic" class="admin-price-input" min="0" placeholder="200">
                </div>
              </div>
              <div class="admin-price-card featured">
                <div class="admin-price-icon">✦</div>
                <label>Pack Premium</label>
                <div class="admin-price-input-wrap">
                  <span class="euro">€</span>
                  <input type="number" id="pricePremium" class="admin-price-input" min="0" placeholder="300">
                </div>
              </div>
              <div class="admin-price-card">
                <div class="admin-price-icon">🚀</div>
                <label>Pack Ultimate</label>
                <div class="admin-price-input-wrap">
                  <span class="euro">€</span>
                  <input type="number" id="priceUltimate" class="admin-price-input" min="0" placeholder="400">
                </div>
              </div>
            </div>
            <div class="admin-actions">
              <button class="admin-btn-primary" onclick="savePrices()">Sauvegarder les prix</button>
              <button class="admin-btn-ghost" onclick="resetPrices()">Réinitialiser</button>
            </div>
          </div>

          <!-- TAB: FEATURES -->
          <div id="tab-features" class="admin-tab-content" style="display:none;">
            <div class="admin-section-title">Modifier les fonctionnalités des packs</div>
            <div class="admin-features-tabs">
              <button class="admin-feat-tab active" onclick="switchFeatureTab('Basic', this)">Basic</button>
              <button class="admin-feat-tab" onclick="switchFeatureTab('Premium', this)">Premium</button>
              <button class="admin-feat-tab" onclick="switchFeatureTab('Ultimate', this)">Ultimate</button>
            </div>
            <div id="featureEditorBasic" class="feature-editor active">
              <div id="featListBasic" class="feat-list"></div>
              <button class="admin-btn-add" onclick="addFeature('Basic')">+ Ajouter une fonctionnalité</button>
            </div>
            <div id="featureEditorPremium" class="feature-editor" style="display:none;">
              <div id="featListPremium" class="feat-list"></div>
              <button class="admin-btn-add" onclick="addFeature('Premium')">+ Ajouter une fonctionnalité</button>
            </div>
            <div id="featureEditorUltimate" class="feature-editor" style="display:none;">
              <div id="featListUltimate" class="feat-list"></div>
              <button class="admin-btn-add" onclick="addFeature('Ultimate')">+ Ajouter une fonctionnalité</button>
            </div>
            <div class="admin-actions">
              <button class="admin-btn-primary" onclick="saveFeatures()">Sauvegarder</button>
            </div>
          </div>

          <!-- TAB: GENERAL -->
          <div id="tab-general" class="admin-tab-content" style="display:none;">
            <div class="admin-section-title">Paramètres généraux</div>
            <div class="admin-field">
              <label>Email de contact</label>
              <input type="email" id="adminEmail" class="admin-input-text" placeholder="votre@email.com">
            </div>
            <div class="admin-field">
              <label>Texte accroche (page Offres)</label>
              <input type="text" id="adminEyebrow" class="admin-input-text" placeholder="Tarifs transparents">
            </div>
            <div class="admin-field">
              <label>Sous-titre (page Offres)</label>
              <textarea id="adminSubtitle" class="admin-textarea" rows="3" placeholder="Description..."></textarea>
            </div>
            <div class="admin-actions">
              <button class="admin-btn-primary" onclick="saveGeneral()">Sauvegarder</button>
            </div>

            <div class="admin-divider"></div>
            <div class="admin-section-title" style="color:#ff6b6b;">Zone dangereuse</div>
            <div class="admin-danger-box">
              <p>Réinitialiser toute la configuration du site aux valeurs par défaut.</p>
              <button class="admin-btn-danger" onclick="resetAll()">⚠ Réinitialiser tout</button>
            </div>
          </div>

          <!-- TAB: SECURITY -->
          <div id="tab-security" class="admin-tab-content" style="display:none;">
            <div class="admin-section-title">Changer le mot de passe</div>
            <div class="admin-field">
              <label>Mot de passe actuel</label>
              <input type="password" id="secOldPass" class="admin-input-text" placeholder="••••••••">
            </div>
            <div class="admin-field">
              <label>Nouveau mot de passe</label>
              <input type="password" id="secNewPass" class="admin-input-text" placeholder="••••••••">
            </div>
            <div class="admin-field">
              <label>Confirmer le nouveau mot de passe</label>
              <input type="password" id="secConfirmPass" class="admin-input-text" placeholder="••••••••">
            </div>
            <div class="admin-actions">
              <button class="admin-btn-primary" onclick="changePassword()">Changer le mot de passe</button>
            </div>
            <p id="secMsg" class="admin-sec-msg" style="display:none;"></p>

            <div class="admin-divider"></div>
            <div class="admin-section-title">Session</div>
            <button class="admin-btn-ghost" onclick="logoutAdmin()">Se déconnecter</button>
          </div>

        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  injectAdminStyles();
}

// ─── Admin Styles ─────────────────────────────────
function injectAdminStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #adminOverlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 99998;
    }
    #adminOverlay.visible { display: block; }

    #adminDrawer {
      position: fixed;
      top: 0; right: -560px;
      width: min(540px, 100vw);
      height: 100vh;
      background: #0a0a12;
      border-left: 1px solid rgba(124,92,252,0.25);
      z-index: 99999;
      transition: right 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #adminDrawer.open { right: 0; }

    .admin-screen { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

    /* LOCK SCREEN */
    .admin-lock-inner {
      margin: auto;
      display: flex; flex-direction: column; align-items: center;
      padding: 48px 32px; max-width: 360px; width: 100%; text-align: center;
    }
    .admin-logo {
      font-size: 48px; margin-bottom: 24px;
      width: 80px; height: 80px;
      background: rgba(124,92,252,0.12);
      border: 1px solid rgba(124,92,252,0.3);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .admin-title {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: 24px; color: #f0f0f8; margin-bottom: 10px;
    }
    .admin-sub { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.6; margin-bottom: 32px; }
    .admin-input-wrap { display: flex; flex-direction: column; gap: 12px; width: 100%; }
    .admin-input {
      width: 100%; padding: 14px 18px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; color: #f0f0f8;
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      outline: none; transition: border-color 0.2s;
    }
    .admin-input:focus { border-color: rgba(124,92,252,0.6); }
    .admin-error { color: #ff6b6b; font-size: 13px; margin-top: 12px; }

    /* DASHBOARD */
    .admin-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }
    .admin-header-left { display: flex; align-items: center; gap: 12px; }
    .admin-logo-small { font-size: 20px; }
    .admin-header-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #f0f0f8; }
    .admin-close-btn {
      width: 32px; height: 32px; background: rgba(255,255,255,0.05);
      border: none; border-radius: 8px; cursor: pointer;
      color: rgba(255,255,255,0.6); font-size: 14px; transition: all 0.2s;
    }
    .admin-close-btn:hover { background: rgba(255,80,80,0.2); color: #ff6b6b; }

    .admin-tabs {
      display: flex; gap: 4px; padding: 12px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0; overflow-x: auto;
    }
    .admin-tab {
      padding: 8px 14px; background: transparent;
      border: 1px solid transparent; border-radius: 8px;
      color: rgba(255,255,255,0.45); font-family: 'DM Sans', sans-serif;
      font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .admin-tab.active, .admin-tab:hover {
      background: rgba(124,92,252,0.15); border-color: rgba(124,92,252,0.3);
      color: #a78bfa;
    }
    .admin-tab.active { font-weight: 600; }

    .admin-content { flex: 1; overflow-y: auto; padding: 24px; }
    .admin-tab-content { display: none; }
    .admin-tab-content.active { display: block; }

    .admin-section-title {
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: rgba(255,255,255,0.5); margin-bottom: 20px;
    }

    /* PRICES */
    .admin-prices-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
    @media (max-width: 500px) { .admin-prices-grid { grid-template-columns: 1fr; } }
    .admin-price-card {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px; padding: 20px 16px; text-align: center; transition: all 0.2s;
    }
    .admin-price-card.featured { border-color: rgba(124,92,252,0.35); background: rgba(124,92,252,0.08); }
    .admin-price-icon { font-size: 24px; margin-bottom: 10px; }
    .admin-price-card label { display: block; font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 12px; font-family: 'Syne', sans-serif; font-weight: 600; }
    .admin-price-input-wrap { display: flex; align-items: center; gap: 6px; justify-content: center; }
    .euro { color: rgba(124,92,252,0.9); font-weight: 700; font-size: 16px; }
    .admin-price-input {
      width: 80px; padding: 8px 10px; text-align: center;
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; color: #f0f0f8; font-size: 20px; font-family: 'Syne', sans-serif; font-weight: 800;
      outline: none; transition: border-color 0.2s;
    }
    .admin-price-input:focus { border-color: rgba(124,92,252,0.6); }

    /* FEATURES */
    .admin-features-tabs { display: flex; gap: 6px; margin-bottom: 16px; }
    .admin-feat-tab {
      padding: 7px 16px; border-radius: 8px; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5);
      font-size: 13px; cursor: pointer; transition: all 0.2s;
    }
    .admin-feat-tab.active { background: rgba(124,92,252,0.2); border-color: rgba(124,92,252,0.4); color: #a78bfa; }
    .feature-editor { display: none; }
    .feature-editor.active { display: block; }
    .feat-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .feat-item {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 10px 14px;
    }
    .feat-item input {
      flex: 1; background: transparent; border: none; color: #f0f0f8;
      font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
    }
    .feat-item-drag { color: rgba(255,255,255,0.2); cursor: grab; font-size: 14px; }
    .feat-item-del { background: none; border: none; color: rgba(255,80,80,0.5); cursor: pointer; font-size: 16px; padding: 0 4px; transition: color 0.2s; }
    .feat-item-del:hover { color: #ff6b6b; }
    .admin-btn-add {
      width: 100%; padding: 10px; background: rgba(255,255,255,0.04);
      border: 1px dashed rgba(255,255,255,0.15); border-radius: 10px;
      color: rgba(255,255,255,0.4); font-size: 13px; cursor: pointer; transition: all 0.2s;
    }
    .admin-btn-add:hover { border-color: rgba(124,92,252,0.4); color: #a78bfa; background: rgba(124,92,252,0.06); }

    /* FIELDS */
    .admin-field { margin-bottom: 18px; }
    .admin-field label { display: block; font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 8px; font-family: 'Syne', sans-serif; font-weight: 600; letter-spacing: 0.04em; }
    .admin-input-text, .admin-textarea {
      width: 100%; padding: 12px 14px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: #f0f0f8; font-family: 'DM Sans', sans-serif; font-size: 14px;
      outline: none; transition: border-color 0.2s; resize: vertical; box-sizing: border-box;
    }
    .admin-input-text:focus, .admin-textarea:focus { border-color: rgba(124,92,252,0.6); }

    /* BUTTONS */
    .admin-btn-primary {
      padding: 12px 24px; border-radius: 10px; border: none; cursor: pointer;
      background: linear-gradient(135deg, #7c5cfc, #a78bfa); color: #fff;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
      transition: all 0.2s; 
    }
    .admin-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
    .admin-btn-ghost {
      padding: 12px 24px; border-radius: 10px; cursor: pointer;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.6); font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px;
      transition: all 0.2s;
    }
    .admin-btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .admin-btn-danger {
      padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer;
      background: rgba(255,60,60,0.15); border: 1px solid rgba(255,60,60,0.3);
      color: #ff6b6b; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
      transition: all 0.2s;
    }
    .admin-btn-danger:hover { background: rgba(255,60,60,0.25); }
    .admin-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
    .admin-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 28px 0; }
    .admin-danger-box {
      background: rgba(255,60,60,0.06); border: 1px solid rgba(255,60,60,0.2);
      border-radius: 12px; padding: 20px;
    }
    .admin-danger-box p { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 14px; }
    .admin-sec-msg { font-size: 13px; margin-top: 12px; padding: 10px 14px; border-radius: 8px; }
    .admin-sec-msg.success { background: rgba(80,220,100,0.1); border: 1px solid rgba(80,220,100,0.3); color: #6ee7b7; }
    .admin-sec-msg.error { background: rgba(255,60,60,0.1); border: 1px solid rgba(255,60,60,0.3); color: #ff6b6b; }

    /* FOOTER TRIGGER */
    .admin-footer-trigger {
      cursor: pointer; color: rgba(255,255,255,0.15) !important;
      font-size: 11px; text-decoration: none !important;
      transition: color 0.3s; user-select: none;
    }
    .admin-footer-trigger:hover { color: rgba(124,92,252,0.6) !important; }

    /* Scrollbar */
    .admin-content::-webkit-scrollbar { width: 4px; }
    .admin-content::-webkit-scrollbar-track { background: transparent; }
    .admin-content::-webkit-scrollbar-thumb { background: rgba(124,92,252,0.3); border-radius: 4px; }
  `;
  document.head.appendChild(style);
}

// ─── Open / Close ─────────────────────────────────
function openAdmin() {
  injectAdminPanel();
  adminOpen = true;
  const drawer = document.getElementById("adminDrawer");
  const overlay = document.getElementById("adminOverlay");
  overlay.classList.add("visible");
  requestAnimationFrame(() => drawer.classList.add("open"));

  const storedPass = localStorage.getItem("studweb_admin_pass");
  const currentPassword = storedPass || ADMIN_PASSWORD;

  if (!adminAuthenticated) {
    document.getElementById("adminLock").style.display = "flex";
    document.getElementById("adminDashboard").style.display = "none";
    setTimeout(() => document.getElementById("adminPasswordInput")?.focus(), 300);
  } else {
    document.getElementById("adminLock").style.display = "none";
    document.getElementById("adminDashboard").style.display = "flex";
    populateDashboard();
  }
}

function closeAdmin() {
  const drawer = document.getElementById("adminDrawer");
  const overlay = document.getElementById("adminOverlay");
  if (!drawer) return;
  drawer.classList.remove("open");
  overlay.classList.remove("visible");
  adminOpen = false;
}

// ─── Auth ─────────────────────────────────────────
function checkAdminPassword() {
  const input = document.getElementById("adminPasswordInput");
  const errEl = document.getElementById("adminError");
  const storedPass = localStorage.getItem("studweb_admin_pass");
  const currentPassword = storedPass || ADMIN_PASSWORD;

  if (input.value === currentPassword) {
    adminAuthenticated = true;
    errEl.style.display = "none";
    input.value = "";
    document.getElementById("adminLock").style.display = "none";
    document.getElementById("adminDashboard").style.display = "flex";
    populateDashboard();
  } else {
    errEl.style.display = "block";
    input.value = "";
    input.focus();
    input.parentElement.style.animation = "none";
    requestAnimationFrame(() => {
      input.style.borderColor = "rgba(255,60,60,0.6)";
      setTimeout(() => input.style.borderColor = "", 1200);
    });
  }
}

function logoutAdmin() {
  adminAuthenticated = false;
  closeAdmin();
}

// ─── Tab switching ────────────────────────────────
function switchTab(tabId, btn) {
  document.querySelectorAll(".admin-tab-content").forEach(t => { t.style.display = "none"; t.classList.remove("active"); });
  document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
  const target = document.getElementById("tab-" + tabId);
  if (target) { target.style.display = "block"; target.classList.add("active"); }
  btn.classList.add("active");
}

function switchFeatureTab(packName, btn) {
  document.querySelectorAll(".feature-editor").forEach(e => { e.style.display = "none"; e.classList.remove("active"); });
  document.querySelectorAll(".admin-feat-tab").forEach(b => b.classList.remove("active"));
  const editor = document.getElementById("featureEditor" + packName);
  if (editor) { editor.style.display = "block"; editor.classList.add("active"); }
  btn.classList.add("active");
}

// ─── Populate dashboard with current values ───────
function populateDashboard() {
  const config = loadConfig();

  // Prices
  document.getElementById("priceBasic").value = config.prices.Basic;
  document.getElementById("pricePremium").value = config.prices.Premium;
  document.getElementById("priceUltimate").value = config.prices.Ultimate;

  // Features
  ["Basic", "Premium", "Ultimate"].forEach(pack => {
    renderFeatureList(pack, config.packs[pack].features);
  });

  // General
  document.getElementById("adminEmail").value = config.contact?.email || "";
  document.getElementById("adminEyebrow").value = config.hero?.eyebrow || "";
  document.getElementById("adminSubtitle").value = config.hero?.subtitle || "";
}

// ─── Feature list rendering ───────────────────────
function renderFeatureList(packName, features) {
  const list = document.getElementById("featList" + packName);
  if (!list) return;
  list.innerHTML = features.map((f, i) => `
    <div class="feat-item">
      <span class="feat-item-drag">⠿</span>
      <input type="text" value="${f.replace(/"/g, '&quot;')}" data-pack="${packName}" data-index="${i}">
      <button class="feat-item-del" onclick="deleteFeature('${packName}', ${i})">✕</button>
    </div>
  `).join("");
}

function addFeature(packName) {
  const config = loadConfig();
  config.packs[packName].features.push("Nouvelle fonctionnalité");
  saveConfig(config);
  renderFeatureList(packName, config.packs[packName].features);
}

function deleteFeature(packName, index) {
  const config = loadConfig();
  config.packs[packName].features.splice(index, 1);
  saveConfig(config);
  renderFeatureList(packName, config.packs[packName].features);
  applyConfigToPage();
}

// ─── Save functions ───────────────────────────────
function savePrices() {
  const config = loadConfig();
  const b = parseInt(document.getElementById("priceBasic").value);
  const p = parseInt(document.getElementById("pricePremium").value);
  const u = parseInt(document.getElementById("priceUltimate").value);
  if (isNaN(b) || isNaN(p) || isNaN(u) || b < 0 || p < 0 || u < 0) {
    showToast("Veuillez entrer des prix valides"); return;
  }
  config.prices.Basic = b; config.prices.Premium = p; config.prices.Ultimate = u;
  saveConfig(config);
  applyConfigToPage();
  showToast("Prix mis à jour avec succès ✦");
}

function resetPrices() {
  const config = loadConfig();
  config.prices = { Basic: 200, Premium: 300, Ultimate: 400 };
  saveConfig(config);
  document.getElementById("priceBasic").value = 200;
  document.getElementById("pricePremium").value = 300;
  document.getElementById("priceUltimate").value = 400;
  applyConfigToPage();
  showToast("Prix réinitialisés");
}

function saveFeatures() {
  const config = loadConfig();
  ["Basic", "Premium", "Ultimate"].forEach(pack => {
    const inputs = document.querySelectorAll(`#featList${pack} input`);
    config.packs[pack].features = Array.from(inputs).map(i => i.value.trim()).filter(v => v);
  });
  saveConfig(config);
  applyConfigToPage();
  showToast("Fonctionnalités mises à jour ✦");
}

function saveGeneral() {
  const config = loadConfig();
  config.contact.email = document.getElementById("adminEmail").value;
  config.hero.eyebrow = document.getElementById("adminEyebrow").value;
  config.hero.subtitle = document.getElementById("adminSubtitle").value;
  saveConfig(config);
  applyConfigToPage();
  showToast("Paramètres sauvegardés ✦");
}

function resetAll() {
  if (!confirm("Réinitialiser toute la configuration ? Cette action est irréversible.")) return;
  localStorage.removeItem("studweb_admin_config");
  applyConfigToPage();
  populateDashboard();
  showToast("Configuration réinitialisée");
}

// ─── Security ─────────────────────────────────────
function changePassword() {
  const oldPass = document.getElementById("secOldPass").value;
  const newPass = document.getElementById("secNewPass").value;
  const confirmPass = document.getElementById("secConfirmPass").value;
  const msgEl = document.getElementById("secMsg");
  const storedPass = localStorage.getItem("studweb_admin_pass");
  const currentPassword = storedPass || ADMIN_PASSWORD;

  msgEl.style.display = "block";
  if (oldPass !== currentPassword) {
    msgEl.className = "admin-sec-msg error"; msgEl.textContent = "Mot de passe actuel incorrect."; return;
  }
  if (newPass.length < 6) {
    msgEl.className = "admin-sec-msg error"; msgEl.textContent = "Le nouveau mot de passe doit contenir au moins 6 caractères."; return;
  }
  if (newPass !== confirmPass) {
    msgEl.className = "admin-sec-msg error"; msgEl.textContent = "Les mots de passe ne correspondent pas."; return;
  }
  localStorage.setItem("studweb_admin_pass", newPass);
  msgEl.className = "admin-sec-msg success"; msgEl.textContent = "Mot de passe changé avec succès !";
  document.getElementById("secOldPass").value = "";
  document.getElementById("secNewPass").value = "";
  document.getElementById("secConfirmPass").value = "";
}

// ─── Footer trigger injection ─────────────────────
function injectAdminTrigger() {
  const footer = document.querySelector("footer p");
  if (!footer) return;
  const trigger = document.createElement("span");
  trigger.textContent = " · Admin";
  trigger.className = "admin-footer-trigger";
  trigger.onclick = openAdmin;
  trigger.title = "Accès administrateur";
  footer.appendChild(trigger);
}

// ─── Init ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  injectAdminTrigger();
  applyConfigToPage();
});

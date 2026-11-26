// Supabase Configuration
const SUPABASE_URL = "https://supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jnJt6-2gsHXdbMdQEEWL5w_00k4bsE1";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CUSTOM_WARD_VALUE = "__CUSTOM__";
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

// 3-Level Gambian Location Directory (Banjul, GBA, West Coast & Kombo)
const GAMBIA_LOCATIONS = {
  "Banjul": [
    "Banjul Central",
    "Half-Die",
    "Tobacco Road",
    "Campama",
    "Soldier Town",
    "Portuguese Town",
    "New Town (Banjul)",
    "Box Bar / Marina",
    "Denton Bridge / Bond Road"
  ],
  "Serrekunda / KM": [
    "Serrekunda Central / Market",
    "Latrikunda German",
    "Latrikunda Sabiji",
    "Churchill's Town",
    "Tallinding",
    "London Corner",
    "Ebo Town",
    "New Jeshwang",
    "Old Jeshwang",
    "Kanifing Estate / Layout",
    "Bundung",
    "Dippa Kunda",
    "Fajikunda",
    "Tabakoto",
    "Abuko",
    "Sanchaba Sulay Jobe",
    "Kerr Serign",
    "Kotu",
    "Kololi",
    "Sara Job Kunda",
    "Manjai Kunda",
    "Bakoteh"
  ],
  "Bakau": [
    "Bakau Central / Kachikally",
    "Bakau New Town",
    "Bakau Wasulung",
    "Cape Point",
    "Fajara",
    "Mile 7"
  ],
  "Brusubi / Sukuta / Kombo North": [
    "Brusubi Phase 1",
    "Brusubi Phase 2",
    "Turntable",
    "Tranquil",
    "Bijilo",
    "Sukuta Central",
    "Sukuta Nema",
    "Mariama Kunda",
    "Nema Kunku",
    "Wellingara",
    "Sinchu Balia",
    "Sinchu Alhagie / Sorry",
    "Kunkujang Keitaya"
  ],
  "Brikama & Surroundings": [
    "Brikama Nyambai",
    "Brikama Gidda",
    "Brikama Daru",
    "Brikama Kabafita",
    "Brikama Suma Kunda",
    "Brikama Perseverance",
    "Brikama Sanneh Kunda",
    "Brikama Jalambang",
    "Brikama Jamisa",
    "Brikama Wellingara",
    "Brikama Mansaring Su",
    "Brikama Missira",
    "Brikama Santasu",
    "Brikama Nema",
    "Brikama Medina",
    "Brikama Darsilameh",
    "Brikama Town Center / Sanchaba",
    "Brikama New Town",
    "Brikama Bojang Kunda",
    "Brikama Touray Kunda",
    "Brikama Manneh Kunda",
    "Kembujeh",
    "Kembujeh Madina",
    "Manduar",
    "Kiti",
    "Busuranding",
    "Marakissa",
    "Busura",
    "Penjem",
    "Basori",
    "Tubakuta",
    "Busumbala",
    "Farato",
    "Yarambamba"
  ],
  "Lamin / Yundum": [
    "Lamin Central",
    "Lamin Wayeto",
    "Banjulinding",
    "Yundum",
    "Kunkujang Mariama"
  ],
  "Kombo South (Gunjur / Sanyang)": [
    "Sanyang",
    "Gunjur Central",
    "Gunjur Kunkujang",
    "Gunjur Taboto",
    "Gunjur Taneneh",
    "Sifoe",
    "Sambouya Amanson",
    "Sambouya Konoto",
    "Kaachumeh",
    "Samabung (Sinchu Wuri)",
    "Nyonfeleh",
    "Sandally",
    "Kasa Kunda",
    "Deya Manchi / Nyima"
  ],
  "Other Regions (NBR / LRR / CRR / URR)": [
    "Barra / Essau",
    "Farafenni",
    "Kerewan",
    "Soma / Mansakonko",
    "Bansang",
    "Janjanbureh",
    "Basse Santa Su"
  ]
};

// NAWEC Power Stations & Key Substations Directory
const NAWEC_STATIONS = [
  {
    name: "Brikama Power Station (I & II)",
    type: "Heavy Fuel Oil / Thermal Generation",
    serves: "Brikama, Yundum, Lamin, Banjulinding, and West Coast feeders",
    mapUrl: "https://google.com"
  },
  {
    name: "Kotu Power Station",
    type: "Main GBA Thermal Generation & Dispatch",
    serves: "Serrekunda, Kotu, Kololi, Bakau, Brusubi, Sukuta",
    mapUrl: "https://google.com"
  },
  {
    name: "Banjul (Half-Die) Power Station",
    type: "Generation & Capital Feeder Hub",
    serves: "Banjul Central, Half-Die, Port of Banjul, Denton Bridge",
    mapUrl: "https://google.com"
  },
  {
    name: "Jabang / Brusubi Substation",
    type: "33kV Transmission & Distribution Substation",
    serves: "Brusubi Phase 1 & 2, Jabang, Sukuta, Turntable, Tranquil",
    mapUrl: "https://google.com"
  }
];

let selectedUtility = "electricity";
let recentReports = [];
let activeAlerts = [];
let currentAdminProfile = null;
let deferredPrompt = null;

// --- SECURITY HELPERS ---

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getReporterHash() {
  let seed = localStorage.getItem("nawec_device_seed");
  if (!seed) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    seed = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem("nawec_device_seed", seed);
  }
  const msgUint8 = new TextEncoder().encode("nawec-gm-salt-v1:" + seed);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function formatTimeAgo(isoString) {
  const diffSec = Math.max(1, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ${diffMin % 60}m ago`;
}

// --- INITIALIZATION ---

document.addEventListener("DOMContentLoaded", async () => {
  initPWAInstall();
  initTabs();
  initLocationPickers();
  initReportControls();
  initCashpowerCalculator();
  renderStations();
  await initAdminMode();

  await Promise.all([fetchReports(), fetchAlerts()]);
  subscribeRealtime();

  // Auto-prune reports older than 24 hours from the user portal every minute
  setInterval(() => {
    recentReports = recentReports.filter(
      (r) => Date.now() - new Date(r.created_at).getTime() < TWENTY_FOUR_HOURS_MS
    );
    renderConsensusAndFeed();
  }, 60 * 1000);
});

function initPWAInstall() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  const installBtn = document.getElementById("installBtn");
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("hidden");
  });
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.add("hidden");
  });
  window.addEventListener("appinstalled", () => {
    installBtn.classList.add("hidden");
  });
}

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.add("hidden"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.remove("hidden");
    });
  });
}

function getActiveWardName() {
  const wardSelect = document.getElementById("wardSelect");
  const customWardInput = document.getElementById("customWardInput");
  if (wardSelect.value === CUSTOM_WARD_VALUE) {
    return customWardInput.value.trim() || "Custom Area";
  }
  return wardSelect.value;
}

function initLocationPickers() {
  const citySelect = document.getElementById("citySelect");
  const wardSelect = document.getElementById("wardSelect");
  const customWardInput = document.getElementById("customWardInput");

  Object.keys(GAMBIA_LOCATIONS).forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  function populateWards() {
    const city = citySelect.value;
    wardSelect.innerHTML = "";
    GAMBIA_LOCATIONS[city].forEach((ward) => {
      const opt = document.createElement("option");
      opt.value = ward;
      opt.textContent = ward;
      wardSelect.appendChild(opt);
    });

    const customOpt = document.createElement("option");
    customOpt.value = CUSTOM_WARD_VALUE;
    customOpt.textContent = "➕ Other (Type Custom Town/Area)";
    wardSelect.appendChild(customOpt);

    customWardInput.classList.add("hidden");
    customWardInput.value = "";
    updateLocationLabels();
    renderConsensusAndFeed();
  }

  citySelect.addEventListener("change", populateWards);
  wardSelect.addEventListener("change", () => {
    const isCustom = wardSelect.value === CUSTOM_WARD_VALUE;
    customWardInput.classList.toggle("hidden", !isCustom);
    if (isCustom) customWardInput.focus();
    updateLocationLabels();
    renderConsensusAndFeed();
  });

  customWardInput.addEventListener("input", () => {
    updateLocationLabels();
    renderConsensusAndFeed();
  });

  populateWards();
}

function updateLocationLabels() {
  const city = document.getElementById("citySelect").value;
  const ward = getActiveWardName();
  document.getElementById("citySummaryTitle").textContent = `${city} Overview`;
  document.getElementById("selectedWardName1").textContent = ward;
  document.getElementById("selectedWardName2").textContent = ward;
  document.getElementById("reportLocationLabel").textContent = `${ward}, ${city}`;
}

function initReportControls() {
  const utilBtns = document.querySelectorAll(".util-btn");
  const statusBtns = document.querySelectorAll(".btn-status");

  utilBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      utilBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedUtility = btn.dataset.utility;

      const labelWord = selectedUtility === "electricity" ? "Light" : "Water";
      document.querySelector('[data-status="ON"]').textContent = `🟢 ${labelWord} is ON`;
      document.querySelector('[data-status="LOW_VOLTAGE"]').textContent =
        selectedUtility === "electricity" ? "🟡 Low Voltage" : "🟡 Low Pressure";
      document.querySelector('[data-status="OFF"]').textContent = `🔴 ${labelWord} is OFF`;
    });
  });

  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => submitReport(btn.dataset.status, btn.textContent.trim()));
  });

  document.getElementById("refreshFeedBtn").addEventListener("click", fetchReports);
}

// --- DATA FETCHING & CONSENSUS ENGINE ---

async function fetchReports() {
  const since = new Date(Date.now() - TWENTY_FOUR_HOURS_MS).toISOString();
  const { data, error } = await sb
    .from("nawec_reports")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(250);

  if (!error && Array.isArray(data)) {
    recentReports = data;
    renderConsensusAndFeed();
    renderAdminBlackouts();
  }
}

async function fetchAlerts() {
  const nowIso = new Date().toISOString();
  const { data, error } = await sb
    .from("nawec_alerts")
    .select("*")
    .eq("is_active", true)
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false });

  if (!error && Array.isArray(data)) {
    activeAlerts = data;
    renderOfficialAlerts();
    renderAdminActiveAlerts();
  }
}

async function submitReport(status, clickedLabel) {
  const feedback = document.getElementById("reportFeedback");
  const city = document.getElementById("citySelect").value;
  const ward = getActiveWardName();
  const landmark = document.getElementById("landmarkInput").value.trim();

  if (!ward || ward === "Custom Area") {
    feedback.textContent = "⚠️ Please select or type your town/ward first.";
    feedback.style.color = "#f59e0b";
    return;
  }

  // Immediate click confirmation to user
  feedback.textContent = `⏳ You clicked "${clickedLabel}" for ${ward}, ${city} — submitting...`;
  feedback.style.color = "#38bdf8";

  try {
    const reporter_hash = await getReporterHash();
    const { error } = await sb.from("nawec_reports").insert([
      {
        city,
        ward,
        landmark: landmark || null,
        utility_type: selectedUtility,
        status,
        reporter_hash
      }
    ]);

    if (error) {
      feedback.textContent = `⚠️ ${error.message}`;
      feedback.style.color = "#ef4444";
      return;
    }

    const escalationNote =
      status === "OFF"
        ? " 🚨 Blackout alert also forwarded to NAWEC Admin Portal."
        : "";
    feedback.textContent = `✅ Confirmed: You reported "${clickedLabel}" in ${ward}, ${city}.${escalationNote}`;
    feedback.style.color = "#22c55e";
    await fetchReports();
  } catch (err) {
    feedback.textContent = "⚠️ Network error while submitting report.";
    feedback.style.color = "#ef4444";
  }
}

function summarizeStatus(reports) {
  if (!reports.length) return { text: "No Data", meta: "No reports in last 24h" };
  const latest = reports[0];
  const map = {
    ON: "🟢 ON",
    LOW_VOLTAGE: "🟡 Low / Partial",
    OFF: "🔴 OFF (Outage)"
  };
  return {
    text: map[latest.status] || latest.status,
    meta: `${reports.length} report(s) • Latest ${formatTimeAgo(latest.created_at)}`
  };
}

function renderConsensusAndFeed() {
  const city = document.getElementById("citySelect").value;
  const ward = getActiveWardName();
  const cutoff = Date.now() - TWENTY_FOUR_HOURS_MS;

  // Enforce 24-hour user portal expiry + hide flagged reports from public users
  const validUserReports = recentReports.filter(
    (r) => new Date(r.created_at).getTime() >= cutoff && !r.is_flagged
  );

  const cityReports = validUserReports.filter((r) => r.city === city);
  const wardElec = cityReports.filter((r) => r.ward === ward && r.utility_type === "electricity");
  const wardWater = cityReports.filter((r) => r.ward === ward && r.utility_type === "water");

  const citySum = summarizeStatus(cityReports);
  document.getElementById("citySummaryStatus").textContent = citySum.text;
  document.getElementById("citySummaryMeta").textContent = citySum.meta;

  const elecSum = summarizeStatus(wardElec);
  document.getElementById("wardElecStatus").textContent = elecSum.text;
  document.getElementById("wardElecMeta").textContent = elecSum.meta;

  const waterSum = summarizeStatus(wardWater);
  document.getElementById("wardWaterStatus").textContent = waterSum.text;
  document.getElementById("wardWaterMeta").textContent = waterSum.meta;

  // Render Recent Alerts (Last 24h)
  const feedEl = document.getElementById("reportsFeed");
  if (!validUserReports.length) {
    feedEl.innerHTML = `<li class="muted">No recent alerts in the last 24 hours.</li>`;
    return;
  }

  feedEl.innerHTML = validUserReports
    .slice(0, 30)
    .map((r) => {
      const icon = r.utility_type === "electricity" ? "⚡" : "💧";
      const statusBadge =
        r.status === "ON"
          ? "🟢 ON"
          : r.status === "LOW_VOLTAGE"
          ? "🟡 Low Voltage/Pressure"
          : "🔴 OFF (Blackout)";
      const landmarkTxt = r.landmark ? ` • Near ${escapeHTML(r.landmark)}` : "";
      return `<li>
        <strong>${icon} ${statusBadge}</strong> — ${escapeHTML(r.ward)}, ${escapeHTML(r.city)}${landmarkTxt}
        <br /><small class="muted">${formatTimeAgo(r.created_at)} • Auto-expires after 24h</small>
      </li>`;
    })
    .join("");
}

function renderOfficialAlerts() {
  const box = document.getElementById("officialAlertsSection");
  if (!activeAlerts.length) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }
  box.classList.remove("hidden");
  box.innerHTML = activeAlerts
    .map(
      (a) => `<div class="card" style="border-left: 4px solid #f59e0b; margin-bottom: 0.75rem;">
        <strong>🛡️ OFFICIAL NAWEC NOTICE (${escapeHTML(a.override_status)}) — ${escapeHTML(a.city)}${a.ward ? " (" + escapeHTML(a.ward) + ")" : ""}</strong>
        <p style="margin: 0.35rem 0 0;">${escapeHTML(a.message)}</p>
      </div>`
    )
    .join("");
}

// --- CASHPOWER CALCULATOR & STATIONS ---

function initCashpowerCalculator() {
  const dalasiInput = document.getElementById("dalasiInput");
  const tariffSelect = document.getElementById("tariffSelect");
  const customRateWrap = document.getElementById("customRateWrap");
  const customRateInput = document.getElementById("customRateInput");
  const kwhOutput = document.getElementById("kwhOutput");
  const calcBreakdown = document.getElementById("calcBreakdown");

  function recalc() {
    const amount = Math.max(0, parseFloat(dalasiInput.value) || 0);
    const rate =
      tariffSelect.value === "custom"
        ? Math.max(0.01, parseFloat(customRateInput.value) || 13.85)
        : parseFloat(tariffSelect.value);
    const exact = amount / rate;
    const rounded = exact.toFixed(1);
    kwhOutput.textContent = `${rounded} kWh`;
    calcBreakdown.textContent = `D${amount.toLocaleString()} ÷ D${rate.toFixed(2)}/kWh = ${exact.toFixed(2)} kWh → ${rounded} kWh on receipt`;
  }

  dalasiInput.addEventListener("input", recalc);
  customRateInput.addEventListener("input", recalc);
  tariffSelect.addEventListener("change", () => {
    customRateWrap.classList.toggle("hidden", tariffSelect.value !== "custom");
    recalc();
  });

  document.querySelectorAll(".pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      dalasiInput.value = btn.dataset.amount;
      recalc();
    });
  });

  recalc();
}

function renderStations() {
  const list = document.getElementById("stationsList");
  list.innerHTML = NAWEC_STATIONS.map(
    (s) => `<div class="status-box">
      <strong>🏭 ${escapeHTML(s.name)}</strong>
      <small class="muted">${escapeHTML(s.type)}</small>
      <p style="margin: 0.4rem 0;">${escapeHTML(s.serves)}</p>
      <a href="${escapeHTML(s.mapUrl)}" target="_blank" rel="noopener noreferrer" class="btn-outline btn-sm">Open Map</a>
    </div>`
  ).join("");
}

// --- TWO-TIER ADMIN PORTAL (MAIN ADMIN vs STANDARD ADMIN) ---

async function initAdminMode() {
  const adminPanel = document.getElementById("adminPanel");
  const toggleBtn = document.getElementById("toggleAdminBtn");
  const params = new URLSearchParams(window.location.search);

  if (params.get("admin") === "1") {
    adminPanel.classList.remove("hidden");
  }

  toggleBtn.addEventListener("click", () => {
    adminPanel.classList.toggle("hidden");
  });

  // Populate admin target city & ward dropdowns
  const adminCity = document.getElementById("adminCity");
  const adminWard = document.getElementById("adminWard");
  Object.keys(GAMBIA_LOCATIONS).forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    adminCity.appendChild(opt);
  });
  adminCity.addEventListener("change", () => {
    adminWard.innerHTML = `<option value="">All Wards (City-Wide)</option>`;
    (GAMBIA_LOCATIONS[adminCity.value] || []).forEach((w) => {
      const opt = document.createElement("option");
      opt.value = w;
      opt.textContent = w;
      adminWard.appendChild(opt);
    });
  });

  document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const msg = document.getElementById("adminLoginMsg");
    msg.textContent = "Authenticating...";
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      msg.textContent = `⚠️ ${error ? error.message : "Login failed."}`;
      msg.style.color = "#ef4444";
      return;
    }

    const ok = await loadAdminProfile(data.user.email);
    if (!ok) {
      await sb.auth.signOut();
      msg.textContent = "⛔ Access denied: Not an active NAWEC admin.";
      msg.style.color = "#ef4444";
      return;
    }

    msg.textContent = "";
    document.getElementById("adminLoginForm").reset();
  });

  document.getElementById("adminLogoutBtn").addEventListener("click", async () => {
    await sb.auth.signOut();
    currentAdminProfile = null;
    document.getElementById("adminControls").classList.add("hidden");
    document.getElementById("adminLoginForm").classList.remove("hidden");
    document.getElementById("mainAdminUserSection").classList.add("hidden");
  });

  document.getElementById("alertBroadcastForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById("adminBroadcastMsg");
    const city = document.getElementById("adminCity").value;
    const ward = document.getElementById("adminWard").value || null;
    const utility_type = document.getElementById("adminUtility").value;
    const override_status = document.getElementById("adminStatus").value;
    const message = document.getElementById("adminMessage").value.trim();

    if (!message) return;
    msgEl.textContent = "Broadcasting alert...";
    msgEl.style.color = "#38bdf8";

    const expires_at = new Date(Date.now() + TWENTY_FOUR_HOURS_MS).toISOString();
    const { error } = await sb.from("nawec_alerts").insert([
      {
        city,
        ward,
        utility_type,
        override_status,
        message,
        is_active: true,
        expires_at,
        created_by: currentAdminProfile?.email || "admin"
      }
    ]);

    if (error) {
      msgEl.textContent = `⚠️ ${error.message}`;
      msgEl.style.color = "#ef4444";
      return;
    }

    msgEl.textContent = "✅ Official NAWEC alert broadcasted!";
    msgEl.style.color = "#22c55e";
    document.getElementById("adminMessage").value = "";
    await fetchAlerts();
  });

  document.getElementById("addAdminForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const addMsg = document.getElementById("addAdminMsg");
    const newEmail = document.getElementById("newAdminEmail").value.trim();
    const newName = document.getElementById("newAdminName").value.trim();

    addMsg.textContent = "Adding admin...";
    addMsg.style.color = "#38bdf8";

    const { error } = await sb.rpc("add_nawec_admin", {
      target_email: newEmail,
      target_name: newName
    });

    if (error) {
      addMsg.textContent = `⚠️ ${error.message}`;
      addMsg.style.color = "#ef4444";
      return;
    }

    addMsg.textContent = `✅ Added ${newEmail} as Standard Admin.`;
    addMsg.style.color = "#22c55e";
    document.getElementById("addAdminForm").reset();
    await loadAdminUsersList();
  });

  // Restore existing Supabase session if already signed in
  const { data: sessionData } = await sb.auth.getSession();
  if (sessionData?.session?.user?.email) {
    await loadAdminProfile(sessionData.session.user.email);
  }
}

async function loadAdminProfile(email) {
  const { data, error } = await sb
    .from("nawec_admins")
    .select("*")
    .ilike("email", email)
    .eq("is_blocked", false)
    .maybeSingle();

  if (error || !data) return false;

  currentAdminProfile = data;
  document.getElementById("adminLoginForm").classList.add("hidden");
  document.getElementById("adminControls").classList.remove("hidden");
  document.getElementById("adminUserLabel").textContent = `${data.email} (${data.role})`;
  document.getElementById("adminRoleBadge").textContent =
    data.role === "main_admin" ? "Main Admin" : "Standard Admin";

  if (data.role === "main_admin") {
    document.getElementById("mainAdminUserSection").classList.remove("hidden");
    await loadAdminUsersList();
  } else {
    document.getElementById("mainAdminUserSection").classList.add("hidden");
  }

  renderAdminBlackouts();
  renderAdminActiveAlerts();
  return true;
}

function renderAdminActiveAlerts() {
  const container = document.getElementById("activeAdminAlertsList");
  if (!container) return;
  if (!activeAlerts.length) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML =
    `<h4>Active Broadcasts</h4>` +
    activeAlerts
      .map(
        (a) => `<div class="status-box" style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
          <div>
            <strong>${escapeHTML(a.city)}${a.ward ? " (" + escapeHTML(a.ward) + ")" : ""} — ${escapeHTML(a.override_status)}</strong>
            <p class="muted" style="margin:0.2rem 0 0;">${escapeHTML(a.message)}</p>
          </div>
          <button type="button" class="btn-outline btn-sm" onclick="deactivateAlert('${a.id}')">End</button>
        </div>`
      )
      .join("");
}

window.deactivateAlert = async function (alertId) {
  await sb.from("nawec_alerts").update({ is_active: false }).eq("id", alertId);
  await fetchAlerts();
};

function renderAdminBlackouts() {
  const list = document.getElementById("adminBlackoutList");
  if (!list) return;
  const escalations = recentReports.filter((r) => r.status === "OFF" || r.escalated_to_admin);

  if (!escalations.length) {
    list.innerHTML = `<li class="muted">No blackout escalations in the last 24h.</li>`;
    return;
  }

  list.innerHTML = escalations
    .map((r) => {
      const flagBadge = r.is_flagged ? ` <span class="badge-sec">🚩 Flagged</span>` : "";
      return `<li>
        <strong>🔴 ${escapeHTML(r.utility_type.toUpperCase())} OFF</strong> — ${escapeHTML(r.ward)}, ${escapeHTML(r.city)}${flagBadge}
        <br /><small class="muted">${formatTimeAgo(r.created_at)}</small>
        <div style="margin-top:0.35rem;display:flex;gap:0.5rem;">
          <button type="button" class="btn-outline btn-sm" onclick="toggleFlagReport('${r.id}', ${!r.is_flagged})">
            ${r.is_flagged ? "Unflag" : "🚩 Flag"}
          </button>
          <button type="button" class="btn-outline btn-sm" onclick="deleteReport('${r.id}')">🗑️ Delete</button>
        </div>
      </li>`;
    })
    .join("");
}

window.toggleFlagReport = async function (id, flagState) {
  await sb
    .from("nawec_reports")
    .update({
      is_flagged: flagState,
      flagged_by: flagState ? currentAdminProfile?.email : null,
      flagged_at: flagState ? new Date().toISOString() : null
    })
    .eq("id", id);
  await fetchReports();
};

window.deleteReport = async function (id) {
  await sb.from("nawec_reports").delete().eq("id", id);
  await fetchReports();
};

async function loadAdminUsersList() {
  const list = document.getElementById("adminUsersList");
  if (!list) return;
  const { data, error } = await sb.from("nawec_admins").select("*").order("created_at", { ascending: true });
  if (error || !Array.isArray(data)) return;

  list.innerHTML = data
    .map((u) => {
      const isMain = u.role === "main_admin";
      const actionBtn = isMain
        ? `<span class="badge-sec">Main Admin</span>`
        : `<button type="button" class="btn-outline btn-sm" onclick="toggleBlockAdmin('${escapeHTML(u.email)}', ${!u.is_blocked})">
            ${u.is_blocked ? "Unblock" : "Block"}
          </button>`;
      return `<li style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
        <div>
          <strong>${escapeHTML(u.full_name || u.email)}</strong>
          <br /><small class="muted">${escapeHTML(u.email)} • ${u.is_blocked ? "🔴 Blocked" : "🟢 Active"}</small>
        </div>
        ${actionBtn}
      </li>`;
    })
    .join("");
}

window.toggleBlockAdmin = async function (targetEmail, blockState) {
  await sb.rpc("set_nawec_admin_blocked", {
    target_email: targetEmail,
    blocked: blockState
  });
  await loadAdminUsersList();
};

// --- REALTIME SUBSCRIPTIONS ---

function subscribeRealtime() {
  sb.channel("nawec-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "nawec_reports" }, () => {
      fetchReports();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "nawec_alerts" }, () => {
      fetchAlerts();
    })
    .subscribe();
}


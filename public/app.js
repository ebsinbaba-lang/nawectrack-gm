// Supabase Configuration
const SUPABASE_URL = "https://supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jnJt6-2gsHXdbMdQEEWL5w_00k4bsE1";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CUSTOM_WARD_VALUE = "__CUSTOM__";
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

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

const NAWEC_STATIONS = [
  {
    name: "Kotu Power Station",
    type: "Thermal Generation & Grid Hub",
    serves: "Serrekunda, Kotu, Kololi, Bakau & Fajara",
    lat: 13.4494,
    lng: -16.7019,
    mapUrl: "https://google.com"
  },
  {
    name: "Brikama Power Station (IPP & NAWEC)",
    type: "Heavy Fuel Oil Generation Plant",
    serves: "Brikama, Yundum, Lamin, Kombo North & South",
    lat: 13.2719,
    lng: -16.6494,
    mapUrl: "https://google.com"
  },
  {
    name: "Banjul (Half-Die) Power Station",
    type: "Generation & Distribution Substation",
    serves: "Banjul Island, Marina & Port Area",
    lat: 13.4472,
    lng: -16.5758,
    mapUrl: "https://google.com"
  },
  {
    name: "Kanifing Industrial Substation",
    type: "33kV / 11kV Primary Substation",
    serves: "Kanifing Estate, Jeshwang, Churchill's Town & Tallinding",
    lat: 13.4411,
    lng: -16.6789,
    mapUrl: "https://google.com"
  },
  {
    name: "Brusubi / Jabang Substation (OMVG)",
    type: "225kV Regional Interconnector & Substation",
    serves: "Brusubi, Bijilo, Sukuta, Turntable & Wellingara",
    lat: 13.3842,
    lng: -16.7192,
    mapUrl: "https://google.com"
  },
  {
    name: "Farafenni Power Station",
    type: "Regional Generation Plant",
    serves: "Farafenni, Barra, Essau & North Bank Region",
    lat: 13.5667,
    lng: -15.6000,
    mapUrl: "https://google.com"
  },
  {
    name: "Soma Power Station",
    type: "Regional Generation & OMVG Node",
    serves: "Soma, Mansakonko & Lower River Region",
    lat: 13.4333,
    lng: -15.5333,
    mapUrl: "https://google.com"
  },
  {
    name: "Basse Power Station",
    type: "Regional Generation Plant",
    serves: "Basse Santa Su & Upper River Region",
    lat: 13.3099,
    lng: -14.2137,
    mapUrl: "https://google.com"
  }
];

let selectedUtility = "electricity";
let recentReports = [];
let activeAlerts = [];
let currentAdminProfile = null;
let deferredPrompt = null;

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
  if (!installBtn) return;

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
      document.getElementById(tab.dataset.tab)?.classList.remove("hidden");
    });
  });

  const homeBrandBtn = document.getElementById("homeBrandBtn");
  if (homeBrandBtn) {
    homeBrandBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("adminPanel")?.classList.add("hidden");
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.add("hidden"));
      document.querySelector('[data-tab="trackerTab"]')?.classList.add("active");
      document.getElementById("trackerTab")?.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
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

  document.getElementById("refreshFeedBtn")?.addEventListener("click", fetchReports);
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
  const amountInput = document.getElementById("dalasiInput");
  const bandSelect = document.getElementById("tariffSelect");
  const customRateWrap = document.getElementById("customRateWrap");
  const customRateInput = document.getElementById("customRateInput");
  const outputEl = document.getElementById("kwhOutput");
  const breakdownEl = document.getElementById("calcBreakdown");
  const presetBtns = document.querySelectorAll("[data-amount]");

  if (!amountInput || !bandSelect || !outputEl) return;

  function calculate() {
    const amount = Math.max(0, parseFloat(amountInput.value) || 0);
    const isCustom = bandSelect.value === "custom";
    if (customRateWrap) {
      customRateWrap.classList.toggle("hidden", !isCustom);
    }
    const rate = isCustom
      ? Math.max(0.01, parseFloat(customRateInput?.value) || 13.85)
      : parseFloat(bandSelect.value) || 13.85;

    const units = amount / rate;
    outputEl.textContent = `${units.toFixed(1)} kWh`;
    if (breakdownEl) {
      breakdownEl.textContent = `D${amount.toLocaleString()} ÷ D${rate.toFixed(2)}/kWh`;
    }
  }

  amountInput.addEventListener("input", calculate);
  bandSelect.addEventListener("change", calculate);
  customRateInput?.addEventListener("input", calculate);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      amountInput.value = btn.dataset.amount;
      calculate();
    });
  });

  calculate();
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;

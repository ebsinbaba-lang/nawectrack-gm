// Replace YOUR_SUPABASE_ANON_KEY with your Publishable key from Supabase Project Settings -> API Keys
const SUPABASE_URL = "https://supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CUSTOM_WARD_VALUE = "__CUSTOM__";

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

    // Add Custom Area option at the bottom
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
    btn.addEventListener("click", () => submitReport(btn.dataset.status));
  });

  document.getElementById("refreshFeedBtn").addEventListener("click", fetchReports);
}

// --- DATA FETCHING & CONSENSUS ENGINE ---

async function fetchReports() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await sb

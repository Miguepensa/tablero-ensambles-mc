const PROCESS_DEFS = [
  { id: "estructurales", name: "Estructural", sheet: "ESTRUCTURALES", activities: 25, color: "#1f78b8" },
  { id: "talleres", name: "Talleres", sheet: "TALLERES", activities: 148, color: "#6f7f8c" },
  { id: "electrico", name: "Electricos", sheet: "ENSAMBLE ELECTRICO", activities: 65, color: "#0d3f66" },
  { id: "hidraulico", name: "Ensamble inferior", sheet: "ENSAMBLE HIDRAULICO INFERIOR", activities: 38, color: "#155f95" },
  { id: "pedestal", name: "Pedest/Tornam.", sheet: "PEDESTAL-TORNAMESA", activities: 28, color: "#77bde5" },
  { id: "brazos", name: "Brz. sis. nivel", sheet: "ENSAMBLE BRZ. SIS. DE NIVELACIO", activities: 75, color: "#3998d3" },
  { id: "pruebas_iniciales", name: "Pruebas iniciales", sheet: "PRUEBAS INICIALES", activities: 32, color: "#4aaee8" },
  { id: "acabado_inicial", name: "Acabado inicial", sheet: "ACABADO INICIAL", activities: 35, color: "#9bb0bf" },
  { id: "pintura_detalles", name: "Pintura detalles", sheet: "PINTURA DETALLES", activities: 12, color: "#f08a24" },
  { id: "acabado_final", name: "Acabado final", sheet: "ACABADO FINAL", activities: 16, color: "#2aa96b" },
  { id: "calidad_final", name: "Pruebas calidad/finales", sheet: "PRUEBAS CALIDADFINALES", activities: 105, color: "#003f73" },
];

const VIEWS = [
  { id: "dashboard", label: "Dashboard", icon: "D" },
  { id: "operacion", label: "Control operativo", icon: "O" },
  { id: "divisiones", label: "Divisiones", icon: "V" },
  { id: "equipos", label: "Equipos", icon: "E" },
  { id: "detalle", label: "Detalle", icon: "U" },
  { id: "captura", label: "Captura", icon: "C" },
  { id: "horas_general", label: "Horas general", icon: "G" },
  { id: "horas", label: "Horas por VIN", icon: "H" },
  { id: "finanzas", label: "Finanzas", icon: "F" },
  { id: "config", label: "Conexion", icon: "X" },
];

const STATUS = {
  terminado: { label: "Terminado", className: "terminado", color: "#2aa96b" },
  en_proceso: { label: "En proceso", className: "en-proceso", color: "#1f78b8" },
  detenido: { label: "Detenido", className: "detenido", color: "#d63c32" },
  correccion: { label: "Correccion", className: "correccion", color: "#f08a24" },
  pendiente: { label: "Pendiente", className: "pendiente", color: "#6f7f8c" },
};

const SOURCE_FIELDS = [
  { key: "equipos", label: "LISTA EQUIPOS / lista de chasis", sheets: ["LISTA EQUIPOS", "LISTA DE CHASIS", "lista de chasis"] },
  { key: "avance", label: "% POR UNIDAD / AVANCE GENERAL", sheets: ["% POR UNIDAD", "AVANCE GENERAL", "% POR UNIDAD / AVANCE GENERAL"] },
  { key: "planning", label: "Planeacion de ensambles", sheets: ["PLANEACION_ENSAMBLES"] },
  { key: "materiales", label: "Materiales", sheets: ["MATERIALES", "Materiales"] },
  { key: "finanzas", label: "Finanzas / Copia de Hoja 1", sheets: ["Copia de Hoja 1", "FINANZAS", "Finanzas"] },
];

const FINANCE_DEFAULT_COLUMNS = [
  "almacen",
  "vin",
  "division_zona",
  "oficio_de_aceptacion_de_curso",
  "fforma_de_pago",
  "promesa_de_pago",
  "total_factura",
  "pagada_no_pagada",
  "saldo_pendiente",
  "estatus_de_garantias",
];

const DEMO_SOURCE = "Datos demo";
const BUNDLED_ADVANCE_CSV = "data/avance-general.csv";
const BUNDLED_UNIT_ADVANCE_CSV = "data/avance-por-unidad.csv";
const BUNDLED_QUALITY_FINAL_CSV = "data/pruebas-calidad-finales.csv";
const PUBLIC_SOURCES_URL = "data/sources.json";
const DEFAULT_AUTO_REFRESH_MINUTES = 5;
const DAILY_CUTOFF_HOUR = 23;
const DAILY_CUTOFF_MINUTE = 55;
const INITIAL_BALANCE_DATE = "2026-10-02";
const PROJECT_TOTAL_AMOUNT = 608197933;
const STRUCTURAL_ACTIVITY_TIMES = [
  { name: "Barrenar angulos de defensa", minutes: 30 },
  { name: "Corte de chasis", minutes: 20 },
  { name: "Montaje de defensa", minutes: 60 },
  { name: "Barrenar chasis para placas de sujecion de carroceria", minutes: 90 },
  { name: "Instalacion y torque de tornillos de placas de sujecion de carroceria", minutes: 60 },
  { name: "Montaje de carroceria", minutes: 30 },
  { name: "Soldar placas de sujecion a la carroceria", minutes: 90 },
  { name: "Pintar las placas y angulos despues de soldar", minutes: 10 },
  { name: "Barrenar chasis de angulo de sujecion de estabilizadores", minutes: 60 },
  { name: "Instalacion y torque de tornillos de angulo de sujecion de estabilizadores", minutes: 20 },
  { name: "Recorrer eje trasero y alargar cardan", minutes: 180 },
  { name: "Soldar placas de valvulas estabilizadores", minutes: 20 },
  { name: "Instalacion de camisas y zapatas delanteros", minutes: 60 },
  { name: "Instalacion de camisas y zapatas traseros", minutes: 60 },
  { name: "Ensamble de cilindro con camisa, zapatas y perno inferior (lado chofer y copiloto)", minutes: 30 },
  { name: "Ensamble de cilindros en base de estabilizador tipo A e instalacion de perno superior", minutes: 30 },
  { name: "Instalacion rack placas de sustentacion", minutes: 30 },
  { name: "Montaje de bisagras para caja de muerto (2 piezas)", minutes: 20 },
  { name: "Soldar tornillos a soporte brazo inferior para matraca", minutes: 5 },
  { name: "Instalacion angulo tornamesa sujecion mangueras", minutes: 30 },
  { name: "Soldar protector de valvula de control en tornamesa", minutes: 20 },
];
const STRUCTURAL_TOTAL_MINUTES = STRUCTURAL_ACTIVITY_TIMES.reduce((sum, activity) => sum + activity.minutes, 0);
const STORAGE_KEY = "tablero-ensambles-config-v1";
const DAILY_PRODUCTION_STORAGE_KEY = "tablero-ensambles-produccion-diaria-v1";
const DATA_CACHE_DB_NAME = "tablero-ensambles-cache-v1";
const DATA_CACHE_STORE = "datasets";
const DATA_CACHE_KEY = "latest-drive-data";
const app = document.getElementById("app");
let autoRefreshTimer = null;
let dailyCutoffTimer = null;

let state = {
  view: "dashboard",
  operationalProcess: "",
  query: "",
  selectedId: null,
  captureProcess: "estructurales",
  captureStatus: "todos",
  hoursProcess: "estructurales",
  hoursVinQuery: "",
  hoursActivityQuery: "",
  filters: {
    status: "todos",
    division: "todos",
    delivery: "todos",
  },
  financeQuery: "",
  financeFilters: {
    zona: "todos",
    pago: "todos",
    pagada: "todos",
    match: "todos",
  },
  financeVisibleColumns: [],
  config: loadConfig(),
  data: getInitialData(),
  loading: false,
  bundledLoaded: false,
  toast: "",
};

state.selectedId = state.data.equipos[0]?.id || null;
render();
bootstrapData();
scheduleDailyCutoff();

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  if (action === "view") {
    state.view = target.dataset.view;
    render();
  }

  if (action === "open-hours-process") {
    const process = PROCESS_DEFS.find((item) => item.id === target.dataset.process);
    if (process) {
      state.hoursProcess = process.id;
      state.hoursActivityQuery = "";
      state.view = "horas_general";
      render();
    }
  }

  if (action === "open-operational-process") {
    const process = PROCESS_DEFS.find((item) => item.id === target.dataset.process);
    if (process) {
      state.operationalProcess = process.id;
      state.view = "operacion";
      render();
      requestAnimationFrame(() => {
        const selectedCard = document.querySelector(`[data-operational-process="${process.id}"]`);
        selectedCard?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  if (action === "select-equipo") {
    state.selectedId = target.dataset.id;
    state.view = "detalle";
    render();
  }

  if (action === "reset-demo") {
    state.data = createDemoData();
    state.selectedId = state.data.equipos[0]?.id || null;
    state.toast = "Datos demo restaurados.";
    render();
  }

  if (action === "save-config") {
    state.config = readConfigFromDom();
    saveConfig(state.config);
    startAutoRefresh(state.config.autoRefreshMinutes || DEFAULT_AUTO_REFRESH_MINUTES);
    state.toast = "Conexion guardada.";
    render();
  }

  if (action === "load-drive") {
    state.config = readConfigFromDom();
    saveConfig(state.config);
    if (isFileProtocolWithGoogleSources(state.config)) {
      state.toast = "Drive no carga si abres el tablero como Archivo. Abre http://127.0.0.1:8765/index.html o usa Importar CSV.";
      render();
      return;
    }
    loadDriveData();
    startAutoRefresh(state.config.autoRefreshMinutes || DEFAULT_AUTO_REFRESH_MINUTES);
  }

  if (action === "load-local-advance") {
    state.data = createEmptyDataset();
    state.selectedId = null;
    state.financeVisibleColumns = [];
    state.bundledLoaded = false;
    loadBundledAdvanceData(true);
  }

  if (action === "load-finance-drive") {
    state.config = readConfigFromDom();
    saveConfig(state.config);
    loadFinanceDrive();
  }

  if (action === "apply-bulk-sources") {
    state.config = readConfigFromDom();
    applyBulkSourcesToConfig(state.config, document.querySelector("[data-bulk-sources]")?.value || "");
    saveConfig(state.config);
    state.toast = "Enlaces aplicados. Revisa los campos y presiona Guardar y cargar.";
    render();
  }

  if (action === "clear-config") {
    state.config = createEmptyConfig();
    saveConfig(state.config);
    state.toast = "Campos de conexion limpiados.";
    render();
  }

  if (action === "clear-platform-data") {
    state.config = createEmptyConfig();
    saveConfig(state.config);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DAILY_PRODUCTION_STORAGE_KEY);
    clearCachedDataset();
    state.data = createEmptyDataset();
    state.selectedId = null;
    state.financeVisibleColumns = [];
    state.bundledLoaded = false;
    state.toast = "Datos locales del tablero borrados. Drive no se modifico.";
    render();
  }

  if (action === "set-capture-state") {
    updateActivityState(target.dataset.activity, target.dataset.state);
  }
});

app.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("[data-filter]")) {
    state.filters[target.dataset.filter] = target.value;
    render();
  }

  if (target.matches("[data-query]")) {
    state.query = target.value;
    render();
  }

  if (target.matches("[data-finance-query]")) {
    state.financeQuery = target.value;
    render();
  }

  if (target.matches("[data-finance-filter]")) {
    state.financeFilters[target.dataset.financeFilter] = target.value;
    render();
  }

  if (target.matches("[data-capture-process]")) {
    state.captureProcess = target.value;
    render();
  }

  if (target.matches("[data-capture-status]")) {
    state.captureStatus = target.value;
    render();
  }

  if (target.matches("[data-hours-process]")) {
    state.hoursProcess = target.value;
    render();
  }

  if (target.matches("[data-hours-vin]")) {
    state.hoursVinQuery = target.value;
    const query = normalizeText(target.value);
    const equipo = state.data.equipos.find((item) =>
      [item.vin, item.control, item.id].some((value) => normalizeText(value) === query)
    );
    if (equipo && equipo.id !== state.selectedId) {
      state.selectedId = equipo.id;
      render();
    }
  }

  if (target.matches("[data-hours-activity-query]")) {
    state.hoursActivityQuery = target.value;
    render();
  }
});

app.addEventListener("keydown", (event) => {
  if (!event.target.matches('[data-action="open-hours-process"], [data-action="open-operational-process"]')) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  event.target.click();
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-finance-column]")) {
    updateFinanceVisibleColumns(target.dataset.financeColumn, target.checked);
    render();
  }

  if (target.matches("[data-hours-vin]")) {
    const query = normalizeText(target.value);
    const equipo = state.data.equipos.find((item) =>
      [item.vin, item.control, item.id].some((value) => normalizeText(value) === query)
    );
    if (equipo) {
      state.selectedId = equipo.id;
      state.hoursVinQuery = equipo.vin || equipo.control;
      render();
    }
  }

  if (target.matches("[data-file-import]")) {
    const file = target.files?.[0];
    const kind = document.querySelector("[data-import-kind]")?.value || "equipos";
    if (file) importCsvFile(file, kind);
    target.value = "";
  }
});

async function bootstrapData() {
  const [publicConfig, cachedRecord] = await Promise.all([
    loadPublicSourceConfig(),
    loadCachedDataset(),
  ]);

  const hasCachedData = Boolean(cachedRecord?.data?.equipos?.length);

  if (hasCachedData) {
    state.data = normalizeDataset(cachedRecord.data);
    recordDailyProductionSnapshot("cached");
    state.selectedId = state.data.equipos[0]?.id || null;
    state.toast = "Mostrando la ultima informacion guardada.";
    render();
  }

  if (publicConfig) {
    state.config = mergeSourceConfigs(publicConfig, state.config);
  }

  await loadBundledAdvanceData();

  if (hasConfiguredSources(state.config)) {
    const cacheIsFresh = hasCachedData && isCachedDatasetFresh(
      cachedRecord,
      state.config.autoRefreshMinutes || DEFAULT_AUTO_REFRESH_MINUTES,
      state.config,
    );

    if (cacheIsFresh) {
      state.toast = "Informacion guardada al dia. Drive se actualizara automaticamente.";
      render();
    } else {
      await loadDriveData({
        background: hasCachedData,
        keepView: true,
        mergeWithCurrent: true,
      });
    }
    startAutoRefresh(state.config.autoRefreshMinutes || DEFAULT_AUTO_REFRESH_MINUTES);
    return;
  }
}

async function loadDriveData(options = {}) {
  const { background = false, keepView = false, mergeWithCurrent = true } = options;
  const snapshotType = options.snapshotType || (background ? "automatic" : "manual");
  const snapshotDateKey = options.snapshotDateKey || "";
  const previousView = state.view;
  const previousSelectedId = state.selectedId;
  state.loading = !background;
  if (!background) {
    state.toast = "Cargando datos desde Drive...";
    render();
  }

  try {
    const imported = await buildDatasetFromConfig(state.config, mergeWithCurrent ? state.data : createEmptyDataset());
    state.data = imported;
    recordDailyProductionSnapshot(snapshotType, snapshotDateKey);
    await saveCachedDataset(imported, state.config);
    state.selectedId = imported.equipos.some((equipo) => equipo.id === previousSelectedId)
      ? previousSelectedId
      : imported.equipos[0]?.id || null;
    state.view = keepView ? previousView : "dashboard";
    state.toast = imported.loadErrors?.length
      ? `Datos actualizados con avisos: ${imported.loadErrors.join(" / ")}`
      : `${background ? "Actualizacion automatica" : "Datos actualizados"}: ${imported.equipos.length} equipos.`;
  } catch (error) {
    state.toast = `No se pudieron cargar los CSV: ${error.message}`;
  } finally {
    state.loading = false;
    render();
  }
}

async function loadPublicSourceConfig() {
  try {
    const response = await fetch(PUBLIC_SOURCES_URL, { cache: "no-store" });
    if (!response.ok) return null;
    const config = await response.json();
    return normalizeSourceConfig(config);
  } catch {
    return null;
  }
}

function normalizeSourceConfig(config) {
  const clean = createEmptyConfig();
  if (!config || typeof config !== "object") return clean;
  clean.workbook = String(config.workbook || "").trim();
  clean.equipos = String(config.equipos || "").trim();
  clean.avance = String(config.avance || "").trim();
  clean.planning = String(config.planning || "").trim();
  clean.materiales = String(config.materiales || "").trim();
  clean.finanzas = String(config.finanzas || "").trim();
  clean.autoRefreshMinutes = Number(config.autoRefreshMinutes) || DEFAULT_AUTO_REFRESH_MINUTES;
  clean.processSheets = { ...clean.processSheets, ...(config.processSheets || {}) };
  Object.keys(clean.processSheets).forEach((key) => {
    clean.processSheets[key] = String(clean.processSheets[key] || "").trim();
  });
  return clean;
}

function mergeSourceConfigs(...configs) {
  const merged = createEmptyConfig();
  configs.forEach((config) => {
    if (!config) return;
    ["workbook", "equipos", "avance", "planning", "materiales", "finanzas"].forEach((key) => {
      if (isUsableSourceUrl(config[key])) merged[key] = config[key];
    });
    if (Number(config.autoRefreshMinutes)) merged.autoRefreshMinutes = Number(config.autoRefreshMinutes);
    Object.entries(config.processSheets || {}).forEach(([key, value]) => {
      if (isUsableSourceUrl(value)) merged.processSheets[key] = value;
    });
  });
  return merged;
}

function hasConfiguredSources(config) {
  return [
    config.workbook,
    config.equipos,
    config.avance,
    config.planning,
    config.materiales,
    config.finanzas,
    ...Object.values(config.processSheets || {}),
  ].some(isUsableSourceUrl);
}

function startAutoRefresh(minutes = DEFAULT_AUTO_REFRESH_MINUTES) {
  const safeMinutes = Math.max(1, Number(minutes) || DEFAULT_AUTO_REFRESH_MINUTES);
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => {
    if (!state.loading && hasConfiguredSources(state.config)) {
      loadDriveData({ background: true, keepView: true, snapshotType: "automatic" });
    }
  }, safeMinutes * 60 * 1000);
}

function scheduleDailyCutoff() {
  if (dailyCutoffTimer) clearTimeout(dailyCutoffTimer);
  const now = new Date();
  let target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    DAILY_CUTOFF_HOUR,
    DAILY_CUTOFF_MINUTE,
    0,
    0,
  );
  const todayRecordExists = hasDailyCutoffRecord(localDateKey(now));
  if (now >= target && todayRecordExists) target.setDate(target.getDate() + 1);
  const delay = Math.max(target.getTime() - now.getTime(), 1000);
  const cutoffDateKey = localDateKey(target);

  dailyCutoffTimer = setTimeout(async () => {
    if (!state.loading && hasConfiguredSources(state.config)) {
      await loadDriveData({
        background: true,
        keepView: true,
        snapshotType: "daily-cutoff",
        snapshotDateKey: cutoffDateKey,
      });
    }
    scheduleDailyCutoff();
  }, delay);
}

function hasDailyCutoffRecord(dateKey) {
  const history = loadDailyProductionHistory();
  return Object.values(history.processes || {}).some((processHistory) => (
    processHistory?.[dateKey]?.snapshotType === "daily-cutoff"
  ));
}

async function loadFinanceDrive() {
  const url = state.config.finanzas;
  if (!isUsableSourceUrl(url)) {
    state.toast = "Pega el enlace CSV de Finanzas antes de cargar.";
    render();
    return;
  }

  state.loading = true;
  state.toast = "Cargando Finanzas desde Drive...";
  render();

  try {
    const text = await fetchCsv(url);
    const data = createEmptyDataset();
    applyCsvToDataset(data, "finanzas", text);
    data.source = "Drive / Finanzas";
    data.updatedAt = new Date().toISOString();
    state.data = normalizeDataset(data);
    state.selectedId = state.data.equipos[0]?.id || null;
    state.view = "finanzas";
    state.toast = `Finanzas cargado: ${state.data.finanzas.length} registros.`;
  } catch (error) {
    state.toast = `No se pudo cargar Finanzas: ${error.message}`;
  } finally {
    state.loading = false;
    render();
  }
}

async function loadBundledAdvanceData(force = false) {
  if (!force && (state.bundledLoaded || state.loading || state.data.equipos.length || state.data.finanzas.length || state.data.materiales.length)) return;
  state.bundledLoaded = true;

  try {
    const response = await fetch(BUNDLED_ADVANCE_CSV, { cache: "no-store" });
    if (!response.ok) return;
    const text = await response.text();
    const data = createEmptyDataset();
    applyCsvToDataset(data, "equipos", text);
    applyCsvToDataset(data, "avance", text);
    await loadBundledAdvanceByUnitCsv(data, BUNDLED_UNIT_ADVANCE_CSV);
    await loadBundledDeliveredCsv(data, "calidad_final", BUNDLED_QUALITY_FINAL_CSV);
    data.source = "CSV local: AVANCE DE ENSAMBLE EH150_ABR.2026";
    data.updatedAt = new Date().toISOString();
    state.data = normalizeDataset(data);
    state.selectedId = state.data.equipos[0]?.id || null;
    state.toast = `Avance local cargado: ${state.data.equipos.length} unidades.`;
    render();
  } catch (error) {
    if (force) {
      state.toast = "No pude leer el CSV local guardado. Si estas en Archivo, usa Importar CSV o abre http://127.0.0.1:8765/index.html.";
      render();
    }
  }
}

async function loadBundledDeliveredCsv(data, processId, url) {
  const process = PROCESS_DEFS.find((item) => item.id === processId);
  if (!process) return;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return;
  const text = await response.text();
  const parsed = parseProcessCsv(text, process);
  data.deliveredChecks = { ...(data.deliveredChecks || {}), ...(parsed.delivered || {}) };
}

async function loadBundledAdvanceByUnitCsv(data, url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return;
  const text = await response.text();
  const parsed = parseMcAvanceRows(nonEmptyCsvRows(text));
  if (!parsed.equipos.length) return;
  data.equipos = mergeEquipoRows(data.equipos, parsed.equipos);
  data.progress = parsed.progress;
}

function render() {
  const currentView = VIEWS.find((view) => view.id === state.view) || VIEWS[0];
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <main class="main">
        <section class="topbar">
          <div>
            <h1 class="page-title">${currentView.label}</h1>
            <p class="page-kicker">${renderKicker(state.view)}</p>
          </div>
          <div class="toolbar">
            <button class="ghost-button" data-action="view" data-view="config">Conexion Drive</button>
            <button class="solid-button" data-action="load-drive" ${state.loading ? "disabled" : ""}>${state.loading ? "Cargando..." : "Actualizar"}</button>
          </div>
        </section>
        ${renderCurrentView()}
      </main>
    </div>
    ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
  `;

  if (state.toast) {
    window.clearTimeout(render.toastTimer);
    render.toastTimer = window.setTimeout(() => {
      state.toast = "";
      render();
    }, 3600);
  }
}

function renderSidebar() {
  const summary = getSummary(state.data);
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo-panel">
          <img class="brand-logo" src="assets/ehmc-logo.png" alt="Equipos Hidromecanicos MC" />
        </div>
        <div class="brand-row">
          <img class="brand-mark" src="assets/mc-mark.jpg" alt="" />
          <div>
            <h2 class="brand-title">Tablero Ensambles</h2>
            <p class="brand-subtitle">EH150 / avance operativo</p>
          </div>
        </div>
      </div>
      <nav class="nav">
        ${VIEWS.map((view) => `
          <button class="nav-button ${state.view === view.id ? "active" : ""}" data-action="view" data-view="${view.id}">
            <span class="nav-icon">${view.icon}</span>
            <span>${view.label}</span>
            ${view.id === "equipos" ? `<span class="badge">${summary.total}</span>` : ""}
          </button>
        `).join("")}
      </nav>
      <div class="source-card">
        <p class="source-label">Fuente activa</p>
        <p class="source-name">${escapeHtml(state.data.source || DEMO_SOURCE)}</p>
        <div class="chip-row">
          <span class="chip">${formatPercent(summary.global)} global</span>
          <span class="chip">${summary.alerts} alertas</span>
        </div>
      </div>
    </aside>
  `;
}

function renderKicker(view) {
  const summary = getSummary(state.data);
  const source = escapeHtml(state.data.source || DEMO_SOURCE);
  const copy = {
    dashboard: `${summary.total} unidades activas, ${summary.finished} terminadas y avance global de ${formatPercent(summary.global)}. Fuente: ${source}.`,
    operacion: "Planeado contra operativo, capacidad de personal y cumplimiento por ensamble.",
    divisiones: "Unidades creadas, pendientes y horas-hombre faltantes agrupadas por division.",
    equipos: "Busqueda por unidad, VIN, division, entrega o estatus.",
    detalle: "Avance por proceso, cobertura de actividades y datos principales de la unidad.",
    captura: "Registro rapido de actividades por proceso para la unidad seleccionada.",
    horas_general: "Horas realizadas y pendientes acumuladas para todas las unidades.",
    horas: "Horas realizadas y pendientes de la unidad seleccionada por VIN.",
    finanzas: `${(state.data.finanzas || []).length} registros financieros vinculados por VIN, almacen y zona. Fuente: ${escapeHtml(state.data.financeSource || "Excel local")}.`,
    config: "URLs CSV publicadas desde Drive y carga manual de archivos CSV.",
  };
  return copy[view] || "";
}

function renderCurrentView() {
  if (state.view === "operacion") return renderOperationalControlView();
  if (state.view === "divisiones") return renderDivisionesView();
  if (state.view === "equipos") return renderEquiposView();
  if (state.view === "detalle") return renderDetalleView();
  if (state.view === "captura") return renderCapturaView();
  if (state.view === "horas_general") return renderHorasGeneralView();
  if (state.view === "horas") return renderHorasView();
  if (state.view === "finanzas") return renderFinanzasView();
  if (state.view === "config") return renderConfigView();
  return renderDashboardView();
}

function renderDashboardView() {
  const summary = getSummary(state.data);
  const processStats = getProcessStats(state.data);
  const assemblyTimeStats = getDashboardAssemblyTimeStats();
  const planningStats = getDashboardPlanningStats(assemblyTimeStats);
  const statusStats = getDashboardStatusStats(summary);
  const deliveryStats = getFinishedDeliveryStats(summary);

  return `
    <div class="grid metrics">
      ${renderMetric("Unidades", summary.fixedTotal, "", "en-proceso")}
      ${renderMetric("Terminadas", summary.finished, "", "terminado")}
      ${renderMetric("En proceso", summary.inProgress, "", "en-proceso")}
    </div>

    <div class="grid dashboard-grid overview-dashboard-grid" style="margin-top: 14px;">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Avance total</p>
            <h2 class="panel-title">Cobertura general</h2>
          </div>
          <span class="badge">${summary.doneActivities} / ${summary.totalActivities} actividades</span>
        </div>
        <div class="ring-layout">
          ${renderProgressRing(summary.global, "Global")}
          <div class="legend">
            ${statusStats.map((item) => renderLegendRow(item.label, item.count, item.color)).join("")}
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Unidades terminadas</p>
            <h2 class="panel-title">Estatus de entrega</h2>
          </div>
        </div>
        <div class="donut-wrap">
          ${renderDonut(deliveryStats, "TERMINADAS", "Estatus de entrega de gruas terminadas")}
          <div class="legend">
            ${deliveryStats.map((item) => renderLegendRow(item.label, `${item.count} unidades`, item.color)).join("")}
          </div>
        </div>
      </section>
    </div>

    <div class="grid process-dashboard-stack" style="margin-top: 14px;">
      <section class="panel process-focus-panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Procesos</p>
            <h2 class="panel-title">Avance por area</h2>
          </div>
          <span class="badge">${formatPercent(summary.global)} global</span>
        </div>
        ${renderProcessFocus(processStats)}
      </section>
    </div>

    ${renderDashboardPlanning(planningStats)}

    ${renderDashboardAssemblyTimes(assemblyTimeStats)}
  `;
}

function renderOperationalControlView() {
  const items = getDashboardPlanningStats(getDashboardAssemblyTimeStats())
    .filter((item) => item.planned);
  if (!items.length) {
    return `<div class="empty-state">No hay ensambles activos configurados en PLANEACION_ENSAMBLES.</div>`;
  }

  const validCompliance = items.filter((item) => Number.isFinite(item.operationalCompliance));
  const requiredDailyTotal = validCompliance.reduce((sum, item) => sum + (item.requiredDailyMinutes || 0), 0);
  const operationalDailyTotal = validCompliance.reduce((sum, item) => sum + (item.operationalDailyMinutes || 0), 0);
  const globalCompliance = requiredDailyTotal > 0 ? (operationalDailyTotal / requiredDailyTotal) * 100 : null;
  const assignedWorkers = items.reduce((sum, item) => sum + (item.workers || 0), 0);
  const requiredWorkers = items.reduce((sum, item) => sum + (item.requiredWorkers || 0), 0);
  const ontime = items.filter((item) => item.status === "ontime").length;
  const risk = items.filter((item) => item.status === "risk").length;
  const late = items.filter((item) => item.status === "late").length;
  const complianceMetricStatus = globalCompliance === null
    ? "en-proceso"
    : globalCompliance >= 100 ? "terminado" : globalCompliance >= 90 ? "correccion" : "detenido";

  return `
    <div class="grid metrics operation-metrics">
      ${renderMetric("Cumplimiento global", globalCompliance === null ? "-" : `${Math.round(globalCompliance)}%`, "operativo contra requerido", complianceMetricStatus)}
      ${renderMetric("En tiempo", ontime, `de ${items.length} ensambles`, "terminado")}
      ${renderMetric("Atencion", risk + late, `${risk} en riesgo · ${late} atrasados`, risk + late ? "correccion" : "terminado")}
      ${renderMetric("Personal", assignedWorkers, `${requiredWorkers} personas requeridas`, assignedWorkers >= requiredWorkers ? "terminado" : "detenido")}
    </div>

    <section class="panel operation-panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Direccion de ensambles</p>
          <h2 class="panel-title">Planeado contra operativo</h2>
          <p class="panel-subtitle">Meta fija desde el saldo inicial contra el avance operativo actualizado desde Drive.</p>
        </div>
        <span class="badge">${items.length} ensambles activos</span>
      </div>
      <div class="operation-control-grid">
        ${items.map((item, index) => renderOperationalControlCard(item, index)).join("")}
      </div>
      <p class="planning-footnote">El saldo inicial queda fijado al 02/10/2026 con HORAS_PENDIENTES. FECHA_INICIO conserva el comienzo formal del plan. Actualizar Captura cambia el saldo actual y el pronostico, pero no modifica el saldo inicial ni la meta diaria original.</p>
    </section>
  `;
}

function renderOperationalControlCard(item, index = 0) {
  const statusLabels = { ontime: "En tiempo", risk: "En riesgo", late: "Atrasado", missing: "Dato incompleto" };
  const dailyTarget = Number.isFinite(item.requiredDailyMinutes) ? formatWorkDuration(item.requiredDailyMinutes) : "-";
  const operationalDaily = Number.isFinite(item.operationalDailyMinutes) ? formatWorkDuration(item.operationalDailyMinutes) : "-";
  const dailyCapacity = item.capacityMinutes > 0 ? formatWorkDuration(item.capacityMinutes) : "-";
  const compliance = Number.isFinite(item.operationalCompliance) ? Math.max(0, item.operationalCompliance) : null;
  const complianceWidth = compliance === null ? 0 : clamp(compliance, 0, 100);
  const staffingDifference = Number.isFinite(item.requiredWorkers) ? item.workers - item.requiredWorkers : null;
  const staffingMessage = staffingDifference === null
    ? "Falta completar jornada o fechas"
    : staffingDifference < 0
      ? `Faltan ${Math.abs(staffingDifference)} ${Math.abs(staffingDifference) === 1 ? "persona" : "personas"}`
      : staffingDifference === 0
        ? "Personal justo para la meta"
        : `Margen de ${staffingDifference} ${staffingDifference === 1 ? "persona" : "personas"}`;

  return `
    <article class="operation-card ${item.status} ${item.id === state.operationalProcess ? "selected" : ""}" data-operational-process="${escapeAttr(item.id)}">
      <div class="operation-card-header">
        <div>
          <div class="operation-title-line">
            <span class="operation-order">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(item.name)}</h3>
          </div>
          <p>${escapeHtml(item.calendar)} · ${item.hoursPerDay} h por jornada</p>
        </div>
        <span class="planning-status ${item.status}">${statusLabels[item.status]}</span>
      </div>

      <div class="operation-schedule">
        <div><span>Fecha del saldo</span><strong>${formatShortDate(item.baselineDate)}</strong></div>
        <div><span>Inicio del plan</span><strong>${formatShortDate(parseIsoLocalDate(item.startDate))}</strong></div>
        <div><span>Limite</span><strong>${formatShortDate(item.deadlineDate)}</strong></div>
        <div><span>Dias trabajados</span><strong>${item.elapsedScheduleDays ?? "-"}</strong></div>
        <div><span>Dias restantes</span><strong>${item.remainingDays === null ? "-" : Math.max(item.remainingDays, 0)}</strong></div>
      </div>

      <div class="operation-output-grid">
        <div><span>Meta diaria</span><strong class="mono">${dailyTarget}/dia</strong></div>
        <div><span>Producción diaria</span><strong class="mono">${operationalDaily}/dia</strong></div>
        <div><span>Capacidad diaria</span><strong class="mono">${dailyCapacity}/dia</strong></div>
        <div><span>Saldo inicial</span><strong class="mono">${formatWorkDuration(item.planningPendingMinutes)}</strong></div>
        <div><span>Saldo actual</span><strong class="mono">${formatWorkDuration(item.currentPendingMinutes)}</strong></div>
        <div><span>Avance desde el saldo</span><strong class="mono">${item.progressSinceBaselineMinutes === null ? "-" : formatWorkDuration(item.progressSinceBaselineMinutes)}</strong></div>
      </div>

      <div class="operation-staffing ${staffingDifference !== null && staffingDifference < 0 ? "short" : "covered"}">
        <div><span>Personal asignado</span><strong>${item.workers}</strong></div>
        <div><span>Personal requerido</span><strong>${item.requiredWorkers ?? "-"}</strong></div>
        <p>${staffingMessage}</p>
      </div>

      <div class="operation-compliance ${item.status}">
        <div><span>Cumplimiento operativo</span><strong>${compliance === null ? "-" : `${Math.round(compliance)}%`}</strong></div>
        <div class="operation-compliance-track" role="img" aria-label="Cumplimiento operativo ${compliance === null ? "sin dato" : `${Math.round(compliance)} por ciento`}">
          <span style="width: ${complianceWidth}%"></span>
        </div>
      </div>

      ${renderDailyProductionIndicators(item)}
    </article>
  `;
}

function renderDailyProductionIndicators(item) {
  const days = getPlanningWorkdayDates(item);
  if (!days.length) return "";
  const history = loadDailyProductionHistory();
  const processHistory = history.processes?.[item.id] || {};
  const todayKey = localDateKey(new Date());
  const todayRecord = processHistory[todayKey];
  const cutoffLabel = todayRecord?.observedAt
    ? `Ultimo corte: ${formatCutoffTime(todayRecord.observedAt)} · ${snapshotTypeLabel(todayRecord.snapshotType)}`
    : "Sin corte registrado hoy";

  return `
    <div class="daily-production">
      <div class="daily-production-header">
        <div>
          <span>Semáforo diario</span>
          <strong>Producción contra meta</strong>
          <small>${escapeHtml(cutoffLabel)}</small>
        </div>
        <div class="daily-production-legend" aria-label="Criterio del semaforo diario">
          <span class="green">Meta cumplida</span>
          <span class="yellow">80% a 99%</span>
          <span class="red">Menos de 80%</span>
        </div>
      </div>
      <div class="daily-production-grid">
        ${days.map((date) => renderDailyProductionDay(date, todayKey, processHistory, item.requiredDailyMinutes)).join("")}
      </div>
      <p>Se calcula con la diferencia del saldo acumulado de Drive entre el inicio y la ultima actualizacion de cada dia.</p>
    </div>
  `;
}

function renderDailyProductionDay(date, todayKey, processHistory, targetMinutes) {
  const dateKey = localDateKey(date);
  const record = processHistory[dateKey];
  const isFuture = dateKey > todayKey;
  const productionMinutes = record
    ? Math.max(Number(record.startPendingMinutes) - Number(record.latestPendingMinutes), 0)
    : null;
  const percent = productionMinutes !== null && targetMinutes > 0
    ? (productionMinutes / targetMinutes) * 100
    : null;
  const status = isFuture
    ? "future"
    : percent === null
      ? "missing"
      : percent >= 100
        ? "green"
        : percent >= 80
          ? "yellow"
          : "red";
  const statusText = isFuture
    ? "Pendiente"
    : percent === null
      ? "Sin dato"
      : `${Math.round(percent)}%`;
  const weekday = date.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "").slice(0, 3);
  const detail = `${weekday} ${formatShortDate(date)} · ${statusText} · ${productionMinutes === null ? "sin lectura" : `${formatWorkDuration(productionMinutes)} producidas`}`;
  const cutoffDetail = record?.observedAt
    ? ` · corte ${formatCutoffTime(record.observedAt)} (${snapshotTypeLabel(record.snapshotType)})`
    : "";

  return `
    <div class="daily-production-day ${status} ${dateKey === todayKey ? "today" : ""}" title="${escapeAttr(detail + cutoffDetail)}" aria-label="${escapeAttr(detail + cutoffDetail)}">
      <span>${escapeHtml(weekday)}</span>
    </div>
  `;
}

function getPlanningWorkdayDates(item) {
  const start = parseIsoLocalDate(item.startDate);
  const deadline = item.deadlineDate;
  if (!start || !deadline || start > deadline) return [];
  const dates = [];
  for (let date = startOfLocalDay(start); date <= deadline; date = addCalendarDays(date, 1)) {
    if (isPlanningWorkday(date, item.calendar)) dates.push(date);
  }
  return dates;
}

function recordDailyProductionSnapshot(snapshotType = "automatic", requestedDateKey = "") {
  if (!state.data?.planning?.length || !state.data?.equipos?.length) return;
  if (snapshotType === "automatic") return;
  const history = loadDailyProductionHistory();
  const dateKey = requestedDateKey || localDateKey(new Date());
  const items = getDashboardPlanningStats(getDashboardAssemblyTimeStats()).filter((item) => item.planned);

  history.processes = history.processes || {};
  items.forEach((item) => {
    const processHistory = history.processes[item.id] || {};
    const existing = processHistory[dateKey];
    if (snapshotType === "cached" && existing) return;
    const priorRecord = Object.entries(processHistory)
      .filter(([key]) => key < dateKey)
      .sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
    const startPendingMinutes = existing?.startPendingMinutes
      ?? priorRecord?.latestPendingMinutes
      ?? item.planningPendingMinutes;

    processHistory[dateKey] = {
      startPendingMinutes,
      latestPendingMinutes: item.currentPendingMinutes,
      observedAt: new Date().toISOString(),
      snapshotType,
    };
    history.processes[item.id] = processHistory;
  });

  try {
    localStorage.setItem(DAILY_PRODUCTION_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // El tablero sigue funcionando aunque el navegador no permita guardar historial local.
  }
}

function loadDailyProductionHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(DAILY_PRODUCTION_STORAGE_KEY) || "null");
    return history && typeof history === "object" ? history : { processes: {} };
  } catch {
    return { processes: {} };
  }
}

function localDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatCutoffTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function snapshotTypeLabel(value) {
  if (value === "manual") return "actualizacion manual";
  if (value === "daily-cutoff") return "corte automatico";
  if (value === "cached") return "ultima lectura guardada";
  return "actualizacion automatica";
}

function renderDivisionesView() {
  const divisions = getDivisionCompletionStats();
  const totalUnits = divisions.reduce((sum, item) => sum + item.total, 0);
  const createdUnits = divisions.reduce((sum, item) => sum + item.created, 0);
  const missingUnits = divisions.reduce((sum, item) => sum + item.missing, 0);
  const pendingMinutes = divisions.reduce((sum, item) => sum + item.pendingMinutes, 0);

  return `
    <div class="grid metrics division-metrics">
      ${renderMetric("Divisiones", divisions.length, "con unidades", "en-proceso")}
      ${renderMetric("Creadas", createdUnits, `de ${totalUnits} unidades`, "terminado")}
      ${renderMetric("Faltan", missingUnits, "unidades por completar", missingUnits ? "correccion" : "terminado")}
      ${renderMetric("Tiempo faltante", formatWorkDuration(pendingMinutes), `${Math.ceil(pendingMinutes / 480)} jornadas de 8 h`, missingUnits ? "en-proceso" : "terminado")}
    </div>

    <section class="panel division-panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Avance por division</p>
          <h2 class="panel-title">Unidades creadas y tiempo por completar</h2>
          <p class="panel-subtitle">Una unidad se considera creada al alcanzar 99.5% de sus actividades. El tiempo se expresa en horas-hombre y jornadas de una persona.</p>
        </div>
        <span class="badge">Jornada base: 8 horas</span>
      </div>
      ${divisions.length ? `
        <div class="division-grid">
          ${divisions.map(renderDivisionCard).join("")}
        </div>
      ` : `<div class="empty-state">No hay divisiones disponibles en la fuente de equipos.</div>`}
    </section>
  `;
}

function getDivisionCompletionStats() {
  const grouped = new Map();

  (state.data.equipos || []).forEach((equipo) => {
    const division = String(equipo.division || "Sin division").trim() || "Sin division";
    const totals = progressTotals(getEquipmentProgress(state.data, equipo.id));
    const created = totals.percent >= 99.5;
    const current = grouped.get(division) || {
      division,
      total: 0,
      created: 0,
      missing: 0,
      pendingMinutes: 0,
    };

    current.total += 1;
    if (created) {
      current.created += 1;
    } else {
      current.missing += 1;
      current.pendingMinutes += getEquipmentPendingMinutes(equipo);
    }
    grouped.set(division, current);
  });

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      percent: item.total ? (item.created / item.total) * 100 : 0,
      averagePendingMinutes: item.missing ? item.pendingMinutes / item.missing : 0,
      workdays: item.pendingMinutes ? Math.ceil(item.pendingMinutes / 480) : 0,
    }))
    .sort((a, b) => b.missing - a.missing || b.pendingMinutes - a.pendingMinutes || a.division.localeCompare(b.division, "es"));
}

function getEquipmentPendingMinutes(equipo) {
  return PROCESS_DEFS.reduce((total, process) => {
    const definitions = getHoursDefinitions(process);
    const activities = state.data.activities?.[`${equipo.id}:${process.id}`] || [];
    const processPending = definitions.reduce((sum, definition, index) => {
      const activity = activities[index] || activities.find((item) => activityNameKey(item.name) === activityNameKey(definition.name));
      if (activity?.state === "hecho") return sum;
      const minutes = getValidatedActivityMinutes(process.id, definition.name, definition.minutes, index);
      return Number.isFinite(minutes) && minutes >= 0 ? sum + minutes : sum;
    }, 0);
    return total + processPending;
  }, 0);
}

function renderDivisionCard(item) {
  const percent = clamp(item.percent, 0, 100);
  return `
    <article class="division-card">
      <div class="division-card-heading">
        <div>
          <h3>${escapeHtml(item.division)}</h3>
          <p>${item.created} de ${item.total} unidades creadas</p>
        </div>
        <strong>${formatPercent(percent)}</strong>
      </div>
      <div class="division-progress" role="img" aria-label="${escapeAttr(`${item.division}: ${item.created} de ${item.total} unidades creadas`)}">
        <span style="width: ${percent}%"></span>
      </div>
      <div class="division-card-stats">
        <div>
          <span>Creadas</span>
          <strong>${item.created}</strong>
        </div>
        <div class="missing">
          <span>Faltan</span>
          <strong>${item.missing}</strong>
        </div>
      </div>
      <div class="division-time-summary">
        <div>
          <span>Tiempo faltante</span>
          <strong class="mono">${formatWorkDuration(item.pendingMinutes)}</strong>
        </div>
        <div>
          <span>Jornadas de 8 h</span>
          <strong>${item.workdays}</strong>
        </div>
        <div>
          <span>Promedio por unidad faltante</span>
          <strong class="mono">${formatWorkDuration(item.averagePendingMinutes)}</strong>
        </div>
      </div>
    </article>
  `;
}

function getDashboardPlanningStats(assemblyTimeStats) {
  const planningByProcess = new Map((state.data.planning || []).map((item) => [item.processId, item]));
  const today = startOfLocalDay(new Date());

  return assemblyTimeStats.map((hours) => {
    const plan = planningByProcess.get(hours.id);
    if (!plan || !plan.active) return { ...hours, planned: false };

    const plannedStart = parseIsoLocalDate(plan.startDate);
    const deadline = parseIsoLocalDate(plan.deadline);
    const baselineDate = parseIsoLocalDate(INITIAL_BALANCE_DATE);
    const effectiveStart = plannedStart || today;
    const hasFixedBaseline = Boolean(baselineDate && Number.isFinite(plan.manualPendingMinutes));
    const planningPendingMinutes = Number.isFinite(plan.manualPendingMinutes)
      ? plan.manualPendingMinutes
      : hours.pendingMinutes;
    const capacityMinutes = plan.workers * plan.hoursPerDay * 60;
    const requiredDays = capacityMinutes > 0 ? Math.ceil(planningPendingMinutes / capacityMinutes) : null;
    const availableDays = plannedStart && deadline
      ? countWorkdaysInclusive(plannedStart, deadline, plan.calendar)
      : null;
    const remainingDays = !deadline
      ? null
      : today > deadline
        ? 0
        : countWorkdaysInclusive(today < effectiveStart ? effectiveStart : today, deadline, plan.calendar);
    const requiredDailyMinutes = availableDays > 0
      ? planningPendingMinutes / availableDays
      : null;
    const elapsedScheduleDays = !plannedStart || !deadline
      ? null
      : today < plannedStart
        ? 0
        : countWorkdaysInclusive(plannedStart, today > deadline ? deadline : today, plan.calendar);
    const progressSinceBaselineMinutes = hasFixedBaseline
      ? Math.max(planningPendingMinutes - hours.pendingMinutes, 0)
      : null;
    const operationalDailyMinutes = elapsedScheduleDays > 0 && progressSinceBaselineMinutes !== null
      ? progressSinceBaselineMinutes / elapsedScheduleDays
      : null;
    const operationalCompliance = requiredDailyMinutes > 0 && operationalDailyMinutes !== null
      ? (operationalDailyMinutes / requiredDailyMinutes) * 100
      : requiredDailyMinutes === 0 ? 100 : null;
    const requiredWorkers = requiredDailyMinutes > 0 && plan.hoursPerDay > 0
      ? Math.ceil(requiredDailyMinutes / (plan.hoursPerDay * 60))
      : requiredDailyMinutes === 0 ? 0 : null;
    const forecastDate = requiredDays === null
      ? null
      : requiredDays === 0
        ? effectiveStart
        : addWorkdays(effectiveStart, requiredDays - 1, plan.calendar);
    const bufferDays = forecastDate && deadline && forecastDate <= deadline
      ? Math.max(countWorkdaysInclusive(addCalendarDays(forecastDate, 1), deadline, plan.calendar), 0)
      : null;
    const capacityStatus = !deadline || requiredDays === null
      ? "missing"
      : forecastDate > deadline
        ? "late"
        : bufferDays <= 2
          ? "risk"
          : "ontime";
    const status = operationalCompliance === null
      ? capacityStatus
      : operationalCompliance >= 100
        ? "ontime"
        : operationalCompliance >= 90
          ? "risk"
          : "late";
    const ratio = availableDays > 0 && requiredDays !== null
      ? requiredDays / availableDays
      : requiredDays > 0 ? 1.2 : 0;

    return {
      ...hours,
      ...plan,
      planned: true,
      baselineDate,
      effectiveStart,
      deadlineDate: deadline,
      forecastDate,
      planningPendingMinutes,
      hasFixedBaseline,
      currentPendingMinutes: hours.pendingMinutes,
      progressSinceBaselineMinutes,
      capacityMinutes,
      requiredDailyMinutes,
      operationalDailyMinutes,
      operationalCompliance,
      requiredWorkers,
      elapsedScheduleDays,
      requiredDays,
      availableDays,
      remainingDays,
      bufferDays,
      ratio,
      capacityStatus,
      status,
    };
  });
}

function renderDashboardPlanning(items) {
  const planned = items.filter((item) => item.planned);
  if (!planned.length) return "";
  const complete = planned.filter((item) => item.capacityStatus !== "missing");
  const ontime = complete.filter((item) => item.capacityStatus === "ontime").length;
  const risk = complete.filter((item) => item.capacityStatus === "risk").length;
  const late = complete.filter((item) => item.capacityStatus === "late").length;

  return `
    <section class="panel planning-panel" style="margin-top: 14px;">
      <div class="panel-header planning-header">
        <div>
          <p class="panel-label">Planeacion de ensambles</p>
          <h2 class="panel-title">Pronostico de cumplimiento</h2>
          <p class="panel-subtitle">Jornadas necesarias contra jornadas disponibles hasta la fecha limite.</p>
        </div>
        <div class="planning-summary" aria-label="Resumen de cumplimiento">
          <span class="planning-summary-item ontime"><strong>${ontime}</strong> en tiempo</span>
          <span class="planning-summary-item risk"><strong>${risk}</strong> en riesgo</span>
          <span class="planning-summary-item late"><strong>${late}</strong> atrasados</span>
        </div>
      </div>
      <div class="planning-chart" role="img" aria-label="Comparacion por ensamble entre jornadas necesarias y disponibles">
        ${planned.map(renderDashboardPlanningRow).join("")}
      </div>
      <p class="planning-footnote">El saldo inicial queda fijado al 02/10/2026. La meta usa ese saldo y los dias entre FECHA_INICIO y FECHA_LIMITE; no se vuelve a repartir cada dia. Selecciona un ensamble para abrir su analisis operativo.</p>
    </section>
  `;
}

function renderDashboardPlanningRow(item) {
  const status = item.capacityStatus || "missing";
  const statusLabels = { ontime: "En tiempo", risk: "En riesgo", late: "Fuera de fecha", missing: "Dato incompleto" };
  const required = item.requiredDays === null ? "-" : item.requiredDays;
  const available = item.availableDays === null ? "-" : Math.max(item.availableDays, 0);
  const width = clamp(item.ratio * 100, 0, 100);
  const dailyTarget = item.requiredDailyMinutes === null ? "-" : formatWorkDuration(item.requiredDailyMinutes);
  const dailyCapacity = item.capacityMinutes > 0 ? formatWorkDuration(item.capacityMinutes) : "-";

  return `
    <article class="planning-row planning-row-link ${status}" data-action="open-operational-process" data-process="${escapeAttr(item.id)}" role="button" tabindex="0" aria-label="Abrir control operativo de ${escapeAttr(item.name)}">
      <div class="planning-name">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${item.workers} ${item.workers === 1 ? "trabajador" : "trabajadores"} · ${item.hoursPerDay} h/jornada</span>
        <span class="planning-baseline">
          <span>Linea base fija</span>
          <strong>Saldo al ${formatShortDate(item.baselineDate)}</strong>
          <strong class="mono">Saldo ${formatWorkDuration(item.planningPendingMinutes)}</strong>
        </span>
      </div>
      <div class="planning-bar-area">
        <div class="planning-bar-labels">
          <span><strong>${required}</strong> jornadas necesarias</span>
          <span><strong>${available}</strong> disponibles</span>
        </div>
        <div class="planning-bar-track" aria-hidden="true">
          <span class="planning-bar-value" style="width: ${width}%"></span>
        </div>
        <div class="planning-summary-output">
          <span>Meta diaria del ensamble <strong class="mono">${dailyTarget}</strong></span>
          <span>Capacidad actual <strong class="mono">${dailyCapacity}</strong></span>
        </div>
      </div>
      <div class="planning-dates">
        <span>Estimada <strong>${formatShortDate(item.forecastDate)}</strong></span>
        <span>Limite <strong>${formatShortDate(item.deadlineDate)}</strong></span>
      </div>
      <span class="planning-status ${status}">${statusLabels[status]}</span>
    </article>
  `;
}

function renderPlanningRow(item) {
  const statusLabels = { ontime: "En tiempo", risk: "En riesgo", late: "Atrasado", missing: "Dato incompleto" };
  const required = item.requiredDays === null ? "-" : item.requiredDays;
  const available = item.availableDays === null ? "-" : Math.max(item.availableDays, 0);
  const width = clamp(item.ratio * 100, 0, 100);
  const dailyTarget = item.requiredDailyMinutes === null
    ? "-"
    : formatWorkDuration(item.requiredDailyMinutes);
  const dailyCapacity = item.capacityMinutes > 0
    ? formatWorkDuration(item.capacityMinutes)
    : "-";
  const operationalDaily = Number.isFinite(item.operationalDailyMinutes)
    ? formatWorkDuration(item.operationalDailyMinutes)
    : "-";
  const operationalCompliance = Number.isFinite(item.operationalCompliance)
    ? Math.max(0, item.operationalCompliance)
    : null;
  const complianceWidth = operationalCompliance === null
    ? 0
    : clamp(operationalCompliance, 0, 100);

  return `
    <article class="planning-row ${item.status}">
      <div class="planning-name">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${item.workers} ${item.workers === 1 ? "trabajador" : "trabajadores"} · ${item.hoursPerDay} h/jornada</span>
        ${Number.isFinite(item.manualPendingMinutes) ? `
          <span class="planning-pending-hours">
            Horas pendientes <strong class="mono">${formatWorkDuration(item.manualPendingMinutes)}</strong>
          </span>
        ` : ""}
      </div>
      <div class="planning-bar-area">
        <div class="planning-bar-labels">
          <span><strong>${required}</strong> jornadas necesarias</span>
          <span><strong>${available}</strong> disponibles</span>
        </div>
        <div class="planning-bar-track" aria-hidden="true">
          <span class="planning-bar-value" style="width: ${width}%"></span>
        </div>
        <div class="planning-daily-output">
          <span>Meta diaria<strong class="mono">${dailyTarget}/dia</strong></span>
          <span>Producción diaria<strong class="mono">${operationalDaily}/dia</strong></span>
          <span>Capacidad diaria<strong class="mono">${dailyCapacity}/dia</strong></span>
        </div>
        <div class="planning-compliance ${item.status}">
          <div class="planning-compliance-label">
            <span>Cumplimiento operativo</span>
            <strong>${operationalCompliance === null ? "-" : `${Math.round(operationalCompliance)}%`}</strong>
          </div>
          <div class="planning-compliance-track" role="img" aria-label="Cumplimiento operativo ${operationalCompliance === null ? "sin dato" : `${Math.round(operationalCompliance)} por ciento`}">
            <span style="width: ${complianceWidth}%"></span>
          </div>
        </div>
      </div>
      <div class="planning-dates">
        <span>Estimada <strong>${formatShortDate(item.forecastDate)}</strong></span>
        <span>Limite <strong>${formatShortDate(item.deadlineDate)}</strong></span>
      </div>
      <span class="planning-status ${item.status}">${statusLabels[item.status]}</span>
    </article>
  `;
}

function getDashboardAssemblyTimeStats() {
  return PROCESS_DEFS.map((process) => {
    const activities = getHoursActivityStats(process);
    const validActivities = activities.filter((item) => item.timeValid);
    const workedMinutes = validActivities.reduce((sum, item) => sum + item.doneMinutes, 0);
    const pendingMinutes = validActivities.reduce((sum, item) => sum + item.pendingMinutes, 0);
    const minutesPerUnit = validActivities.reduce((sum, item) => sum + item.minutes, 0);
    return {
      ...process,
      activityCount: activities.length,
      timedActivities: validActivities.length,
      missingTimes: Math.max(activities.length - validActivities.length, 0),
      workedMinutes,
      pendingMinutes,
      totalMinutes: workedMinutes + pendingMinutes,
      minutesPerUnit,
    };
  }).filter((item) => item.activityCount > 0);
}

function renderDashboardAssemblyTimes(items) {
  if (!items.length) return "";

  return `
    <section class="panel assembly-time-panel" style="margin-top: 14px;">
      <div class="panel-header assembly-time-header">
        <div>
          <p class="panel-label">Horas por ensamble</p>
          <h2 class="panel-title">Horas trabajadas y pendientes</h2>
          <p class="panel-subtitle">Acumulado general de las 171 grúas para cada ensamble.</p>
        </div>
        <span class="badge">${items.length} áreas con tiempos</span>
      </div>
      <div class="assembly-time-grid">
        ${items.map((item) => renderAssemblyTimeGauge(item)).join("")}
      </div>
      <p class="assembly-time-footnote">Selecciona un ensamble para abrir su resumen general de todas las unidades. Azul: horas ya trabajadas. Gris: horas que faltan.</p>
    </section>
  `;
}

function renderAssemblyTimeGauge(item) {
  const percent = item.totalMinutes > 0
    ? clamp((item.workedMinutes / item.totalMinutes) * 100, 0, 100)
    : 0;
  const completeness = item.activityCount > 0 ? item.timedActivities / item.activityCount : 0;
  const title = item.name;

  return `
    <article class="assembly-time-card assembly-time-link" data-action="open-hours-process" data-process="${escapeAttr(item.id)}" role="button" tabindex="0" aria-label="Abrir resumen general de ${escapeAttr(title)}">
      <div class="assembly-time-card-top">
        <div>
          <p class="assembly-time-name">${escapeHtml(title)}</p>
          <p class="assembly-time-count">${item.timedActivities} de ${item.activityCount} actividades con tiempo</p>
          <p class="assembly-time-per-unit"><span>Tiempo por ensamble</span><strong class="mono">${formatClockMinutes(item.minutesPerUnit)}</strong></p>
        </div>
        ${item.missingTimes ? `<span class="badge warning">${item.missingTimes} sin tiempo</span>` : ""}
      </div>
      <div class="assembly-gauge" role="img" aria-label="${escapeAttr(`${title}: ${formatWorkDuration(item.workedMinutes)} trabajadas y ${formatWorkDuration(item.pendingMinutes)} pendientes`)}">
        <svg viewBox="0 0 120 66" aria-hidden="true">
          <path class="assembly-gauge-track" pathLength="100" d="M10 58 A50 50 0 0 1 110 58"></path>
          <path class="assembly-gauge-value" pathLength="100" stroke-dasharray="${percent} 100" d="M10 58 A50 50 0 0 1 110 58"></path>
        </svg>
        <div class="assembly-gauge-reading">
          <strong>${Math.round(percent)}%</strong>
          <span>trabajado</span>
        </div>
      </div>
      <div class="assembly-time-breakdown">
        <div class="assembly-time-line worked">
          <span><i></i>Horas trabajadas</span>
          <strong class="mono">${formatWorkDuration(item.workedMinutes)}</strong>
        </div>
        <div class="assembly-time-line pending">
          <span><i></i>Horas pendientes</span>
          <strong class="mono">${formatWorkDuration(item.pendingMinutes)}</strong>
        </div>
        <div class="assembly-time-total">
          <span>Total estimado</span>
          <strong class="mono">${formatWorkDuration(item.totalMinutes)}</strong>
        </div>
      </div>
      ${completeness < 1 ? `<p class="assembly-time-warning">El total no incluye actividades sin duración.</p>` : ""}
    </article>
  `;
}

function renderMetric(label, value, note, statusClass) {
  return `
    <article class="metric-card">
      <div class="metric-top">
        <span class="metric-label">${label}</span>
        <span class="status-dot ${statusClass}"></span>
      </div>
      <div>
        <p class="metric-value">${value}</p>
        ${note ? `<p class="metric-note">${note}</p>` : ""}
      </div>
    </article>
  `;
}

function renderEquiposView() {
  const rows = getFilteredEquipos();
  const divisions = getUniqueValues(state.data.equipos, "division");
  const deliveries = getUniqueValues(state.data.equipos, "entrega");

  return `
    <section class="panel">
      <div class="filters">
        <label class="field">
          <span class="field-label">Buscar</span>
          <input class="input" data-query value="${escapeAttr(state.query)}" placeholder="Control, VIN, division..." />
        </label>
        <label class="field">
          <span class="field-label">Estatus</span>
          <select class="select" data-filter="status">${renderOptions(["todos", ...Object.keys(STATUS)], state.filters.status, statusLabel)}</select>
        </label>
        <label class="field">
          <span class="field-label">Division</span>
          <select class="select" data-filter="division">${renderOptions(["todos", ...divisions], state.filters.division)}</select>
        </label>
        <label class="field">
          <span class="field-label">Entrega</span>
          <select class="select" data-filter="delivery">${renderOptions(["todos", ...deliveries], state.filters.delivery)}</select>
        </label>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>VIN</th>
              <th>Division</th>
              <th>Entrega</th>
              <th>Estatus</th>
              <th>Avance</th>
              <th>Actualizado</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((equipo) => `
              <tr data-action="select-equipo" data-id="${escapeAttr(equipo.id)}">
                <td><strong>${escapeHtml(equipo.control)}</strong><br><span class="small">${escapeHtml(equipo.serie_grua || equipo.id)}</span></td>
                <td class="mono">${escapeHtml(equipo.vin || "-")}</td>
                <td>${escapeHtml(equipo.division || "-")}</td>
                <td>${escapeHtml(equipo.entrega || "-")}</td>
                <td>${renderStatusBadge(equipo.status)}</td>
                <td>${renderMiniBar(equipo.overall, statusColor(equipo.status))}</td>
                <td class="small">${formatDate(equipo.updatedAt)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderDetalleView() {
  const equipo = getSelectedEquipo();
  if (!equipo) return `<div class="empty-state">Selecciona una unidad en la lista de equipos.</div>`;

  const progress = getEquipmentProgress(state.data, equipo.id);
  const processStats = PROCESS_DEFS.map((process) => {
    const item = progress[process.id] || emptyProgress(process);
    return { ...process, ...item, percent: progressPercent(item) };
  });

  return `
    <div class="grid detail-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Unidad</p>
            <h2 class="panel-title">${escapeHtml(equipo.control)}</h2>
            <p class="panel-subtitle">${renderStatusBadge(equipo.status)}</p>
          </div>
          ${renderProgressRing(equipo.overall, "Unidad")}
        </div>
        <div class="equipment-identity">
          ${renderIdentity("VIN", equipo.vin)}
          ${renderIdentity("Serie grua", equipo.serie_grua)}
          ${renderIdentity("Division", equipo.division)}
          ${renderIdentity("Entrega", equipo.entrega)}
          ${renderIdentity("Modelo", equipo.modelo)}
          ${renderIdentity("Plazo", equipo.plazo)}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Cobertura</p>
            <h2 class="panel-title">Grafica por proceso</h2>
          </div>
        </div>
        ${renderDetailProcessChart(processStats)}
      </section>
    </div>

    <section class="panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Procesos</p>
          <h2 class="panel-title">Actividades por area</h2>
        </div>
      </div>
      <div class="grid process-grid">
        ${processStats.map((process) => `
          <article class="process-tile">
            <h3 class="process-title">${escapeHtml(process.name)}</h3>
            ${renderMiniBar(process.percent, process.color)}
            <p class="process-count">${process.done} de ${process.total} hechas ${process.corrections ? ` / ${process.corrections} correcciones` : ""}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCapturaView() {
  const equipo = getSelectedEquipo();
  if (!equipo) return `<div class="empty-state">Selecciona una unidad en la lista de equipos.</div>`;

  const process = PROCESS_DEFS.find((item) => item.id === state.captureProcess) || PROCESS_DEFS[0];
  const activities = getCaptureActivities(equipo.id, process);
  const filtered = activities.filter((activity) => state.captureStatus === "todos" || activity.state === state.captureStatus);

  return `
    <div class="grid split-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Captura</p>
            <h2 class="panel-title">${escapeHtml(equipo.control)}</h2>
            <p class="panel-subtitle">${escapeHtml(process.name)}</p>
          </div>
          ${renderStatusBadge(equipo.status)}
        </div>
        <div class="source-fields">
          <label class="field">
            <span class="field-label">Proceso</span>
            <select class="select" data-capture-process>
              ${PROCESS_DEFS.map((item) => `<option value="${item.id}" ${item.id === state.captureProcess ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span class="field-label">Filtro</span>
            <select class="select" data-capture-status>
              ${renderOptions(["todos", "pendiente", "hecho", "correccion"], state.captureStatus, captureLabel)}
            </select>
          </label>
          <div class="panel" style="box-shadow:none;">
            <p class="panel-label">Avance del proceso</p>
            ${renderProgressRing(progressPercent(getEquipmentProgress(state.data, equipo.id)[process.id] || emptyProgress(process)), "Proceso")}
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Actividades</p>
            <h2 class="panel-title">${filtered.length} registros</h2>
          </div>
        </div>
        <div class="activity-list">
          ${filtered.map((activity) => `
            <div class="activity-row">
              <div class="activity-name">
                <strong>${escapeHtml(activity.name)}</strong>
                <span>${escapeHtml(activity.subprocess)}</span>
              </div>
              <div class="segmented">
                ${["pendiente", "hecho", "correccion"].map((stateName) => `
                  <button data-action="set-capture-state" data-activity="${escapeAttr(activity.id)}" data-state="${stateName}" class="${activity.state === stateName ? "active" : ""}">${captureShortLabel(stateName)}</button>
                `).join("")}
              </div>
              <span class="badge ${activity.state === "hecho" ? "terminado" : activity.state}">${captureLabel(activity.state)}</span>
              <span class="small">${activity.minutes} min</span>
            </div>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderHorasGeneralView() {
  const process = PROCESS_DEFS.find((item) => item.id === state.hoursProcess) || PROCESS_DEFS[0];
  const allStats = getHoursActivityStats(process);
  const activityQuery = normalizeText(state.hoursActivityQuery);
  const rows = activityQuery
    ? allStats.filter((item) => normalizeText(`${item.name} ${item.subprocess}`).includes(activityQuery))
    : allStats;
  const totalDoneMinutes = allStats.reduce((sum, item) => sum + item.doneMinutes, 0);
  const totalPendingMinutes = allStats.reduce((sum, item) => sum + item.pendingMinutes, 0);
  const minutesPerAssembly = allStats.filter((item) => item.timeValid).reduce((sum, item) => sum + item.minutes, 0);
  const missingTimeCount = allStats.filter((item) => !item.timeValid).length;

  return `
    <section class="panel hours-control-panel">
      <div class="hours-filters hours-general-filters">
        <label class="field">
          <span class="field-label">Area</span>
          <select class="select" data-hours-process>
            ${PROCESS_DEFS.map((item) => {
              const available = getHoursDefinitions(item).length > 0;
              return `<option value="${item.id}" ${item.id === process.id ? "selected" : ""} ${available ? "" : "disabled"}>${escapeHtml(item.name)}${available ? "" : " (sin datos)"}</option>`;
            }).join("")}
          </select>
        </label>
        <label class="field">
          <span class="field-label">Buscar actividad</span>
          <input class="input" data-hours-activity-query value="${escapeAttr(state.hoursActivityQuery)}" placeholder="Ej. barrenado, chasis..." />
        </label>
      </div>
    </section>

    <section class="panel hours-summary-panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Resumen de horas</p>
          <h2 class="panel-title">${escapeHtml(process.name)}</h2>
        </div>
        <div class="hours-summary-badges">
          <span class="badge hours-per-assembly-badge">Tiempo por ensamble <strong class="mono">${formatClockMinutes(minutesPerAssembly)}</strong></span>
          <span class="badge">${rows.length} actividades</span>
          ${missingTimeCount ? `<span class="badge warning">${missingTimeCount} sin tiempo</span>` : ""}
        </div>
      </div>
      ${renderHoursGauge(totalDoneMinutes, totalPendingMinutes, `${process.name}: avance general de todas las unidades`)}
    </section>

    <section class="panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Actividades</p>
          <h2 class="panel-title">Horas generales por actividad</h2>
        </div>
      </div>
      ${rows.length ? `
        <div class="hours-activity-list">
          ${rows.map((item) => renderHoursActivityGauge(item, "general")).join("")}
        </div>
      ` : `<div class="empty-state">No hay actividades detalladas para esta area.</div>`}
    </section>
  `;
}

function renderHorasView() {
  const process = PROCESS_DEFS.find((item) => item.id === state.hoursProcess) || PROCESS_DEFS[0];
  const selected = getSelectedEquipo();
  const allStats = getHoursActivityStats(process);
  const activityQuery = normalizeText(state.hoursActivityQuery);
  const rows = activityQuery
    ? allStats.filter((item) => normalizeText(`${item.name} ${item.subprocess}`).includes(activityQuery))
    : allStats;
  const unitDoneMinutes = allStats.reduce((sum, item) => sum + (item.timeValid && item.selectedState === "hecho" ? item.minutes : 0), 0);
  const unitPendingMinutes = allStats.reduce((sum, item) => sum + (item.timeValid && item.selectedState !== "hecho" ? item.minutes : 0), 0);
  const minutesPerAssembly = allStats.filter((item) => item.timeValid).reduce((sum, item) => sum + item.minutes, 0);
  const missingTimeCount = allStats.filter((item) => !item.timeValid).length;

  return `
    <section class="panel hours-control-panel">
      <div class="hours-filters">
        <label class="field">
          <span class="field-label">Buscar VIN o equipo</span>
          <input class="input" data-hours-vin list="hours-vin-list" value="${escapeAttr(state.hoursVinQuery || selected?.vin || selected?.control || "")}" placeholder="Escribe o selecciona un VIN" />
          <datalist id="hours-vin-list">
            ${state.data.equipos.map((equipo) => `<option value="${escapeAttr(equipo.vin || equipo.control)}">${escapeHtml(equipo.control)}</option>`).join("")}
          </datalist>
        </label>
        <label class="field">
          <span class="field-label">Area</span>
          <select class="select" data-hours-process>
            ${PROCESS_DEFS.map((item) => {
              const available = getHoursDefinitions(item).length > 0;
              return `<option value="${item.id}" ${item.id === process.id ? "selected" : ""} ${available ? "" : "disabled"}>${escapeHtml(item.name)}${available ? "" : " (sin datos)"}</option>`;
            }).join("")}
          </select>
        </label>
        <label class="field">
          <span class="field-label">Buscar actividad</span>
          <input class="input" data-hours-activity-query value="${escapeAttr(state.hoursActivityQuery)}" placeholder="Ej. barrenado, chasis..." />
        </label>
      </div>
      ${selected ? `<p class="hours-selected-line"><strong>${escapeHtml(selected.control)}</strong> · <span class="mono">${escapeHtml(selected.vin || "-")}</span> · ${escapeHtml(selected.division || "-")}</p>` : ""}
    </section>

    <section class="panel hours-summary-panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Resumen por unidad</p>
          <h2 class="panel-title">${escapeHtml(process.name)} · ${escapeHtml(selected?.control || "Sin unidad")}</h2>
        </div>
        <div class="hours-summary-badges">
          <span class="badge hours-per-assembly-badge">Tiempo por ensamble <strong class="mono">${formatClockMinutes(minutesPerAssembly)}</strong></span>
          <span class="badge">${rows.length} actividades</span>
          ${missingTimeCount ? `<span class="badge warning">${missingTimeCount} sin tiempo</span>` : ""}
        </div>
      </div>
      ${selected
        ? renderHoursGauge(unitDoneMinutes, unitPendingMinutes, `${process.name}: avance de la unidad ${selected.control || selected.vin}`)
        : `<div class="empty-state hours-unit-empty">Selecciona una unidad para ver su resumen.</div>`}
    </section>

    <section class="panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Actividades por unidad</p>
          <h2 class="panel-title">Horas del VIN seleccionado</h2>
        </div>
      </div>
      ${rows.length ? `
        <div class="hours-activity-list">
          ${rows.map((item) => renderHoursActivityGauge(item, "unit")).join("")}
        </div>
      ` : `<div class="empty-state">No hay actividades detalladas para esta area.</div>`}
    </section>
  `;
}

function getHoursActivityStats(process) {
  const equipment = state.data.equipos || [];
  const definitions = getHoursDefinitions(process);
  const selected = getSelectedEquipo();

  return definitions.map((definition, index) => {
    let done = 0;
    let corrections = 0;
    let selectedState = "sin_dato";

    equipment.forEach((equipo) => {
      const activities = state.data.activities?.[`${equipo.id}:${process.id}`] || [];
      const activity = activities[index] || activities.find((item) => normalizeText(item.name) === normalizeText(definition.name));
      if (activity?.state === "hecho") done += 1;
      if (activity?.state === "correccion") corrections += 1;
      if (selected && equipo.id === selected.id && activity) selectedState = activity.state;
    });

    const minutes = getValidatedActivityMinutes(process.id, definition.name, definition.minutes, index);
    const timeValid = Number.isFinite(minutes) && minutes >= 0;
    const pending = Math.max(equipment.length - done, 0);
    return {
      ...definition,
      minutes,
      done,
      pending,
      corrections,
      selectedState,
      timeValid,
      doneMinutes: timeValid ? done * minutes : 0,
      pendingMinutes: timeValid ? pending * minutes : 0,
    };
  });
}

function getHoursDefinitions(process) {
  const configured = state.data.activityDefinitions?.[process.id] || [];
  if (configured.length) {
    if (process.id === "estructurales") {
      return STRUCTURAL_ACTIVITY_TIMES.map((validated, index) => {
        const exact = configured.find((item) => activityNameKey(item.name) === activityNameKey(validated.name));
        const definition = exact || configured[index] || {};
        return {
          ...definition,
          id: definition.id || `estructurales-${index + 1}`,
          name: definition.name || validated.name,
          subprocess: definition.subprocess || process.name,
          minutes: validated.minutes,
        };
      });
    }
    return configured;
  }
  const firstKey = Object.keys(state.data.activities || {}).find((key) => key.endsWith(`:${process.id}`));
  return firstKey ? state.data.activities[firstKey].map(({ id, name, subprocess, minutes }) => ({ id, name, subprocess, minutes })) : [];
}

function getValidatedActivityMinutes(processId, name, fallback, index = -1) {
  if (processId === "estructurales") {
    const match = STRUCTURAL_ACTIVITY_TIMES.find((item) => activityNameKey(item.name) === activityNameKey(name)) || STRUCTURAL_ACTIVITY_TIMES[index];
    if (match) return match.minutes;
  }
  return Number.isFinite(Number(fallback)) ? Number(fallback) : Number.NaN;
}

function activityNameKey(value) {
  return normalizeText(value)
    .replace(/sujeccion/g, "sujecion")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function renderHoursActivityGauge(item, scope = "general") {
  const selected = getSelectedEquipo();
  const selectedLabel = {
    hecho: "Hecha",
    pendiente: "Pendiente",
    correccion: "Correccion",
    sin_dato: "Sin dato",
  }[item.selectedState] || "Sin dato";
  const selectedClass = item.selectedState === "hecho" ? "terminado" : item.selectedState === "correccion" ? "correccion" : "pendiente";
  const isUnitView = scope === "unit";
  const doneMinutes = isUnitView
    ? (item.timeValid && item.selectedState === "hecho" ? item.minutes : 0)
    : item.doneMinutes;
  const pendingMinutes = isUnitView
    ? (item.timeValid && item.selectedState !== "hecho" ? item.minutes : 0)
    : item.pendingMinutes;
  const scopeLabel = isUnitView
    ? (selected?.control || selected?.vin || "Sin unidad")
    : `${state.data.equipos.length} unidades`;
  return `
    <article class="hours-activity-item">
      <div class="hours-activity-heading">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${item.timeValid ? `${formatClockMinutes(item.minutes)} por unidad` : "Tiempo sin definir en Drive"}</p>
        </div>
        <span class="badge hours-activity-scope-label">${escapeHtml(scopeLabel)}</span>
        <span class="status ${selectedClass} hours-vin-state" aria-hidden="true">VIN: ${selectedLabel}</span>
      </div>
      ${item.timeValid ? `
        ${isUnitView && !selected
          ? `<div class="empty-state hours-activity-unit-empty">Selecciona una unidad.</div>`
          : renderHoursGauge(
              doneMinutes,
              pendingMinutes,
              isUnitView
                ? `${item.name}: avance de la unidad ${selected?.control || selected?.vin || "sin unidad"}`
                : `${item.name}: avance general de todas las unidades`,
              true,
            )}
      ` : `<p class="hours-missing-time">No se incluye en los totales hasta que Drive tenga un tiempo válido.</p>`}
    </article>
  `;
}

function renderHoursGauge(doneMinutes, pendingMinutes, label, compact = false) {
  const totalMinutes = doneMinutes + pendingMinutes;
  const percent = totalMinutes > 0 ? clamp((doneMinutes / totalMinutes) * 100, 0, 100) : 0;
  return `
    <div class="hours-gauge-layout ${compact ? "compact" : ""}">
      <div class="assembly-gauge hours-gauge" role="img" aria-label="${escapeAttr(`${label}: ${formatWorkDuration(doneMinutes)} hechas y ${formatWorkDuration(pendingMinutes)} pendientes`)}">
        <svg viewBox="0 0 120 66" aria-hidden="true">
          <path class="assembly-gauge-track" pathLength="100" d="M10 58 A50 50 0 0 1 110 58"></path>
          <path class="assembly-gauge-value" pathLength="100" stroke-dasharray="${percent} 100" d="M10 58 A50 50 0 0 1 110 58"></path>
        </svg>
        <div class="assembly-gauge-reading">
          <strong>${Math.round(percent)}%</strong>
          <span>hecho</span>
        </div>
      </div>
      <div class="assembly-time-breakdown hours-gauge-breakdown">
        <div class="assembly-time-line worked">
          <span><i></i>Horas hechas</span>
          <strong class="mono">${formatWorkDuration(doneMinutes)}</strong>
        </div>
        <div class="assembly-time-line pending">
          <span><i></i>Horas por hacer</span>
          <strong class="mono">${formatWorkDuration(pendingMinutes)}</strong>
        </div>
        <div class="assembly-time-total">
          <span>Total estimado</span>
          <strong class="mono">${formatWorkDuration(totalMinutes)}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderMaterialesView() {
  const materialSummary = getMaterialSummary(state.data.materiales);
  const materials = [...state.data.materiales].sort((a, b) => b.pendiente - a.pendiente);

  return `
    <div class="grid metrics">
      ${renderMetric("Materiales", materialSummary.total, "registros activos", "en-proceso")}
      ${renderMetric("Faltantes", materialSummary.shortage, "con pendiente", "detenido")}
      ${renderMetric("Cobertura", formatPercent(materialSummary.coverage), "entregado vs requerido", "terminado")}
      ${renderMetric("OC abiertas", materialSummary.purchaseOrders, "ordenes vinculadas", "correccion")}
    </div>
    <section class="panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Inventario</p>
          <h2 class="panel-title">Materiales y entregas</h2>
        </div>
      </div>
      <div class="material-list">
        ${materials.map((material) => {
          const coverage = material.requerido ? clamp((material.entregado / material.requerido) * 100, 0, 100) : 100;
          const badge = material.pendiente > 0 ? "detenido" : coverage < 100 ? "correccion" : "terminado";
          return `
            <div class="material-row">
              <div class="material-name">
                <strong>${escapeHtml(material.descripcion)}</strong>
                <span>${escapeHtml(material.codigo || material.proceso || "-")}</span>
              </div>
              <div>${renderMiniBar(coverage, material.pendiente > 0 ? STATUS.detenido.color : STATUS.terminado.color)}</div>
              <div class="mono">${material.entregado} / ${material.requerido}</div>
              <span class="badge ${badge}">${material.pendiente > 0 ? `${material.pendiente} faltan` : "Completo"}</span>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderFinanzasView() {
  const columns = getFinanceColumns();
  ensureFinanceVisibleColumns(columns);
  const visibleColumns = getVisibleFinanceColumns(columns);
  const rows = getFilteredFinanceRows();
  const financeCharts = getFinanceChartData(rows);
  const financeSummary = getDashboardFinanceSummary(rows);
  const warrantySummary = getFinanceWarrantySummary(state.data.finanzas || []);
  const moneyTotals = getFinanceMoneyTotals(rows, visibleColumns);
  const zones = getUniqueValues(state.data.finanzas || [], "zona");
  const paymentOptions = getUniqueFinanceFieldValues("fforma_de_pago");
  const paidOptions = getUniqueFinanceFieldValues("pagada_no_pagada");

  return `
    <div class="grid finance-dashboard-metrics">
      ${renderMetric("Monto total del proyecto", formatCurrency(PROJECT_TOTAL_AMOUNT), "monto contratado", "en-proceso")}
      ${renderMetric("Total factura", formatCompactMoney(financeSummary.invoice), "filtrado actual", "en-proceso")}
      ${renderMetric("Saldo pendiente de la factura", formatCompactMoney(financeSummary.balance), "total del proyecto - total factura", financeSummary.balance > 0 ? "correccion" : "terminado")}
      ${renderMetric("Monto penalizado", formatCompactMoney(financeSummary.penalized), "filtrado actual", financeSummary.penalized > 0 ? "detenido" : "terminado")}
      ${renderMetric("Monto pagado", formatCompactMoney(financeSummary.paid), "filtrado actual", "terminado")}
      ${renderMetric("Estatus atendido", warrantySummary.attended, "garantias atendidas · total general", "terminado")}
      ${renderMetric("Estatus no atendido", warrantySummary.unattended, "garantias por atender · total general", warrantySummary.unattended > 0 ? "correccion" : "terminado")}
    </div>

    <section class="panel finance-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title finance-title">Estatus financiero por unidad</h2>
        </div>
        <span class="badge">${rows.length} visibles</span>
      </div>
      ${renderFinanceCharts(financeCharts)}
      <div class="filters finance-filters">
        <label class="field">
          <span class="field-label">Buscar</span>
          <input class="input" data-finance-query value="${escapeAttr(state.financeQuery)}" placeholder="VIN, almacen, zona..." />
        </label>
        <label class="field">
          <span class="field-label">Zona</span>
          <select class="select" data-finance-filter="zona">${renderOptions(["todos", ...zones], state.financeFilters.zona)}</select>
        </label>
        <label class="field">
          <span class="field-label">Forma pago</span>
          <select class="select" data-finance-filter="pago">${renderOptions(["todos", ...paymentOptions], state.financeFilters.pago)}</select>
        </label>
        <label class="field">
          <span class="field-label">Pago</span>
          <select class="select" data-finance-filter="pagada">${renderOptions(["todos", ...paidOptions], state.financeFilters.pagada)}</select>
        </label>
        <label class="field">
          <span class="field-label">Vinculo</span>
          <select class="select" data-finance-filter="match">
            ${renderOptions(["todos", "vinculadas", "sin_vinculo"], state.financeFilters.match, financeMatchLabel)}
          </select>
        </label>
      </div>
      <div class="column-picker-block">
        <p class="field-label">Filtra por columna</p>
        <div class="column-picker">
          ${columns.map((column) => {
            const active = state.financeVisibleColumns.includes(column.key);
            return `
              <label class="check-chip ${active ? "active" : ""}">
                <input type="checkbox" data-finance-column="${escapeAttr(column.key)}" ${active ? "checked" : ""} />
                <span>${escapeHtml(column.label)}</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>
      <div class="table-wrap finance-table-wrap">
        <table class="data-table finance-table">
          <thead>
            <tr>
              ${visibleColumns.map((column) => `
                <th>${escapeHtml(column.label)}</th>
                ${column.key === "vin" ? `<th>Avance</th>` : ""}
              `).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map((row) => {
              const equipo = getFinanceEquipo(row);
              return `
                <tr>
                  ${visibleColumns.map((column) => `
                    <td>${formatFinanceValue(row.fields?.[column.key], column)}</td>
                    ${column.key === "vin" ? `<td>${equipo ? renderMiniBar(equipo.overall, statusColor(equipo.status)) : `<span class="small">-</span>`}</td>` : ""}
                  `).join("")}
                </tr>
              `;
            }).join("") : `<tr><td colspan="${visibleColumns.length + (visibleColumns.some((column) => column.key === "vin") ? 1 : 0)}" class="empty-state">Sin registros con esos filtros.</td></tr>`}
          </tbody>
          <tfoot>
            <tr class="money-total-row">
              ${visibleColumns.map((column, index) => `
                <td>${moneyTotals[column.key] !== undefined ? formatCurrency(moneyTotals[column.key]) : index === 0 ? "Totales" : ""}</td>
                ${column.key === "vin" ? `<td></td>` : ""}
              `).join("")}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  `;
}

function renderConfigView() {
  return `
    <div class="grid config-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Drive</p>
            <h2 class="panel-title">Hojas principales</h2>
          </div>
        </div>
        <div class="quick-source-box">
          <label class="field">
            <span class="field-label">Archivo completo AVANCE DE ENSAMBLE</span>
            <input class="input" data-workbook-source value="${escapeAttr(state.config.workbook || "")}" placeholder="Pega aqui un solo enlace publicado del Google Sheet completo" />
          </label>
          <label class="field">
            <span class="field-label">Carga rapida</span>
            <textarea class="textarea" data-bulk-sources placeholder="Opcional: pega varios enlaces solo si necesitas ajustar hojas con nombre distinto."></textarea>
          </label>
          <button class="ghost-button" data-action="apply-bulk-sources">Aplicar enlaces</button>
        </div>
        <div class="source-fields">
          ${SOURCE_FIELDS.map((field) => `
            <label class="field">
              <span class="field-label">${field.label}</span>
              <input class="input" data-source-key="${field.key}" value="${escapeAttr(state.config[field.key] || "")}" placeholder="https://docs.google.com/spreadsheets/..." />
            </label>
          `).join("")}
          <div class="toolbar" style="justify-content:flex-start;">
            <button class="solid-button" data-action="load-drive">Guardar y cargar</button>
            <button class="ghost-button" data-action="load-finance-drive">Cargar solo Finanzas</button>
            <button class="ghost-button" data-action="save-config">Guardar</button>
            <button class="ghost-button" data-action="clear-config">Limpiar</button>
            <button class="ghost-button danger-button" data-action="clear-platform-data">Borrar datos del tablero</button>
            <button class="ghost-button" data-action="reset-demo">Demo</button>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Procesos</p>
            <h2 class="panel-title">Hojas de captura</h2>
          </div>
        </div>
        <div class="process-fields">
          ${PROCESS_DEFS.map((process) => `
            <label class="field">
              <span class="field-label">${escapeHtml(process.sheet)}</span>
              <input class="input" data-process-source="${process.id}" value="${escapeAttr(state.config.processSheets[process.id] || "")}" placeholder="URL CSV" />
            </label>
          `).join("")}
        </div>
      </section>
    </div>

    <section class="panel" style="margin-top: 14px;">
      <div class="panel-header">
        <div>
          <p class="panel-label">Archivo local</p>
          <h2 class="panel-title">Importar CSV</h2>
        </div>
      </div>
      <div class="file-row">
        <label class="field">
          <span class="field-label">Tipo</span>
          <select class="select" data-import-kind>
            <option value="equipos">Equipos</option>
            <option value="avance">Avance general</option>
            <option value="materiales">Materiales</option>
            <option value="finanzas">Finanzas</option>
            ${PROCESS_DEFS.map((process) => `<option value="process:${process.id}">${escapeHtml(process.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span class="field-label">CSV</span>
          <input class="input" type="file" accept=".csv,.txt" data-file-import />
        </label>
        <div class="field file-actions">
          <span class="field-label">Avance guardado</span>
          <button class="solid-button" data-action="load-local-advance">Cargar AVANCE local</button>
        </div>
      </div>
    </section>
  `;
}

function createDemoData() {
  const divisions = ["JALISCO", "NORTE", "BAJIO", "PACIFICO", "CENTRO", "SURESTE"];
  const deliveries = ["Entrega 1", "Entrega 2", "Entrega 3", "Entrega 4"];
  const equipos = [];
  const progress = {};

  for (let i = 1; i <= 48; i += 1) {
    const id = `EH150-${String(i).padStart(4, "0")}`;
    const base = clamp(14 + ((i * 19) % 91), 6, 100);
    const blocked = i % 17 === 0 || i % 29 === 0;
    const equipo = {
      id,
      control: `150-${String(320 + i).padStart(3, "0")}`,
      vin: `3HAEUMMR${String(145000 + i * 37).padStart(8, "0")}`,
      serie_grua: `EH-150-14.3-${String(2400 + i)}`,
      division: divisions[i % divisions.length],
      consecutivo: String(i).padStart(3, "0"),
      modelo: i % 4 === 0 ? "2025" : "2024",
      plazo: `${12 + (i % 18)} dias`,
      entrega: deliveries[i % deliveries.length],
      blocked,
      updatedAt: demoDate(i),
    };
    equipos.push(equipo);

    progress[id] = {};
    PROCESS_DEFS.forEach((process, processIndex) => {
      const drift = pseudoRandom(i, processIndex) * 24 - 12;
      const processPct = clamp(base - processIndex * 4 + drift, 0, 100);
      const done = Math.round((process.activities * processPct) / 100);
      const corrections = done > 0 && (i + processIndex) % 11 === 0 ? 1 + ((i + processIndex) % 4) : 0;
      progress[id][process.id] = {
        done: clamp(done, 0, process.activities),
        total: process.activities,
        corrections,
        updatedAt: demoDate(i + processIndex),
      };
    });
  }

  const materiales = createDemoMaterials();
  const data = { source: DEMO_SOURCE, equipos, progress, materiales, finanzas: [], financeColumns: [], activities: {}, updatedAt: new Date().toISOString() };
  return normalizeDataset(data);
}

function createEmptyDataset() {
  return normalizeDataset({
    source: "Sin datos cargados",
    equipos: [],
    progress: {},
    planning: [],
    materiales: [],
    finanzas: [],
    financeColumns: [],
    activities: {},
    activityDefinitions: {},
    activityStates: {},
    deliveredChecks: {},
    processTimes: {},
    updatedAt: new Date().toISOString(),
    meta: { equipos: 170 },
  });
}

function cloneDataset(data) {
  return normalizeDataset(JSON.parse(JSON.stringify(data || createEmptyDataset())));
}

function getInitialData() {
  return createEmptyDataset();
}

function createDemoMaterials() {
  const names = [
    ["Valvula solenoide", "0503-12-12", "Ensamble hidraulico"],
    ["Bomba hidraulica", "BOM-EH150", "Ensamble hidraulico"],
    ["Arnes principal", "ARN-150-MC", "Ensamble electrico"],
    ["Panel de cabina", "PNL-CAB-02", "Ensamble electrico"],
    ["Cilindro brazo superior", "CIL-BS-44", "Brazos"],
    ["Manguera alta presion", "MNG-HP-38", "Talleres"],
    ["Engrane tornamesa", "TRN-ENG-01", "Pedestal"],
    ["Deposito de aceite", "DEP-OIL-150", "Pedestal"],
    ["Kit calcomanias", "KIT-CAL-EH", "Acabados"],
    ["Guardafangos", "GDF-02", "Acabados"],
    ["Sensor estabilidad", "SNS-EST-4", "Calidad"],
    ["Aceite hidraulico", "OIL-H46", "Pruebas"],
  ];

  return names.map(([descripcion, codigo, proceso], index) => {
    const requerido = 80 + ((index * 13) % 95);
    const pendiente = index % 4 === 0 ? 8 + index * 2 : index % 5 === 0 ? 3 : 0;
    const entregado = Math.max(0, requerido - pendiente);
    return {
      id: `MAT-${String(index + 1).padStart(3, "0")}`,
      descripcion,
      codigo,
      proceso,
      requerido,
      stock: 18 + ((index * 9) % 43),
      inventario: 90 + index * 11,
      requisicion: `REQ-${2400 + index}`,
      orden_compra: index % 3 === 0 ? `OC-${1880 + index}` : "",
      entregado,
      pendiente,
    };
  });
}

async function buildDatasetFromConfig(config, baseData = createEmptyDataset()) {
  const urls = [];
  if (isUsableSourceUrl(config.workbook)) {
    SOURCE_FIELDS.forEach((field) => {
      (field.sheets || [field.label]).forEach((sheet) => {
        urls.push({
          kind: field.key,
          label: `${field.label} (${sheet})`,
          url: sheetCsvUrl(config.workbook, sheet),
          optional: true,
        });
      });
    });
    PROCESS_DEFS.forEach((process) => {
      urls.push({
        kind: `process:${process.id}`,
        label: `${process.name} (${process.sheet})`,
        url: sheetCsvUrl(config.workbook, process.sheet),
        process,
        optional: true,
      });
    });
  }
  SOURCE_FIELDS.forEach((field) => {
    if (isUsableSourceUrl(config[field.key])) urls.push({ kind: field.key, label: field.label, url: config[field.key] });
  });
  PROCESS_DEFS.forEach((process) => {
    const url = config.processSheets[process.id];
    if (isUsableSourceUrl(url)) urls.push({ kind: `process:${process.id}`, label: process.name, url, process });
  });

  const data = cloneDataset(baseData);
  if (!urls.length) return normalizeDataset(data);

  data.source = "Drive / CSV";
  data.updatedAt = new Date().toISOString();

  const loadErrors = [];
  let loadedCount = 0;
  const loadedKinds = new Set();
  for (const item of urls) {
    if (item.optional && loadedKinds.has(item.kind)) continue;
    try {
      const text = await fetchCsv(item.url);
      applyCsvToDataset(data, item.kind, text);
      loadedCount += 1;
      loadedKinds.add(item.kind);
    } catch (error) {
      if (!item.optional) loadErrors.push(`${item.label}: ${error.message}`);
    }
  }

  if (!loadedCount && loadErrors.length) throw new Error(loadErrors.join(" / "));
  if (!loadedCount && urls.length) throw new Error("No pude leer ninguna hoja del archivo completo. Revisa que el Google Sheet este publicado en la web y que el enlace abra en el navegador.");

  const normalized = normalizeDataset(data);
  normalized.loadErrors = loadErrors;
  return normalized;
}

async function fetchCsv(inputUrl) {
  const url = normalizeGoogleCsvUrl(inputUrl);
  const requestUrl = isGoogleSheetsUrl(url) ? appendCacheBuster(url) : url;
  try {
    const response = await fetch(requestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status} en ${url}`);
    return await response.text();
  } catch (error) {
    if (isGoogleSheetsUrl(inputUrl)) return fetchGoogleSheetCsvViaJsonp(inputUrl);
    throw error;
  }
}

function appendCacheBuster(inputUrl) {
  const separator = String(inputUrl).includes("?") ? "&" : "?";
  return `${inputUrl}${separator}_tablero=${Date.now()}`;
}

function applyCsvToDataset(data, kind, text) {
  if (kind === "equipos") {
    data.equipos = parseEquiposCsv(text);
    return;
  }

  if (kind === "materiales") {
    data.materiales = parseMaterialesCsv(text);
    return;
  }

  if (kind === "planning") {
    data.planning = parsePlanningCsv(text);
    return;
  }

  if (kind === "finanzas") {
    const parsed = parseFinanceCsv(text);
    data.finanzas = parsed.records;
    data.financeColumns = parsed.columns;
    data.financeSource = "Drive / Finanzas";
    return;
  }

  if (kind === "avance") {
    const mcGeneral = parseMcGeneralRows(nonEmptyCsvRows(text));
    if (mcGeneral.equipos.length) {
      data.equipos = mcGeneral.equipos;
      data.progress = mcGeneral.progress;
      data.activities = mcGeneral.activities;
      data.activityDefinitions = mcGeneral.activityDefinitions;
      data.activityStates = {};
      data.deliveredChecks = mcGeneral.delivered || {};
      return;
    }
    const mcAvance = parseMcAvanceRows(nonEmptyCsvRows(text));
    if (mcAvance.equipos.length) {
      data.equipos = mergeEquipoRows(data.equipos, mcAvance.equipos);
      data.progress = mcAvance.progress;
      data.processTimes = mcAvance.processTimes || {};
      data.activityStates = {};
      return;
    }
    const parsed = parseProgressSummaryCsv(text);
    mergeProgress(data.progress, parsed);
    return;
  }

  if (kind.startsWith("process:")) {
    const processId = kind.split(":")[1];
    const process = PROCESS_DEFS.find((item) => item.id === processId);
    const parsed = parseProcessCsv(text, process);
    mergeProgress(data.progress, parsed.progress);
    data.activities = { ...data.activities, ...parsed.activities };
    if (parsed.activityDefinitions?.length) {
      data.activityDefinitions = { ...data.activityDefinitions, [processId]: parsed.activityDefinitions };
    }
    data.deliveredChecks = { ...(data.deliveredChecks || {}), ...(parsed.delivered || {}) };
  }
}

function importCsvFile(file, kind) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      applyCsvToDataset(state.data, kind, String(reader.result || ""));
      state.data.source = `Archivo local: ${file.name}`;
      state.data = normalizeDataset(state.data);
      state.toast = `${file.name} importado.`;
      render();
    } catch (error) {
      state.toast = `No se pudo importar: ${error.message}`;
      render();
    }
  };
  reader.readAsText(file, "utf-8");
}

function parseEquiposCsv(text) {
  const rows = nonEmptyCsvRows(text);
  const mcGeneral = parseMcGeneralRows(rows);
  if (mcGeneral.equipos.length) return mcGeneral.equipos;
  const mcAvance = parseMcAvanceRows(rows);
  if (mcAvance.equipos.length) return mcAvance.equipos;
  if (looksLikeListaChasis(rows)) return parseListaChasisRows(rows);

  return csvToRecords(text).map((row, index) => {
    const id =
      readField(row, ["id_equipo", "equipo", "numero", "no", "num", "control", "n_control", "numero_control", "no_control", "almacen", "n_almacen", "numero_almacen"]) ||
      `EQ-${index + 1}`;
    return {
      id: uniqueId(id, index),
      control: readField(row, ["control", "n_control", "numero_control", "no_control", "numero", "equipo", "almacen", "n_almacen"]) || String(id),
      vin: readField(row, ["vin", "serie_vin", "numero_serie_chasis"]),
      serie_grua: readField(row, ["serie_grua", "numero_serie_grua", "grua", "serie"]),
      division: readField(row, ["division", "zona", "region"]),
      consecutivo: readField(row, ["consecutivo", "cons"]),
      modelo: readField(row, ["modelo", "anio", "ano"]),
      plazo: readField(row, ["plazo", "fecha_entrega", "fecha", "programa"]),
      entrega: readField(row, ["entrega", "lote", "cantidad_estatus", "estatus_entrega"]),
      entregado: readField(row, ["entregado", "entregada", "check", "check_entregado", "unidad_entregada", "equipo_entregado"]),
      rawStatus: readField(row, ["estatus", "estatus_general", "estado", "cantidad"]),
      blocked: isStoppedCheckValue(readField(row, ["detenido", "detenida", "bloqueado", "bloqueada", "paro", "hold"])),
      updatedAt: new Date().toISOString(),
    };
  }).filter((equipo) => equipo.control && equipo.control !== "EQ-1");
}

function parsePlanningCsv(text) {
  return csvToRecords(text).map((row) => {
    const processId = normalizeKey(readField(row, ["id_ensamble", "id", "proceso"]));
    const process = PROCESS_DEFS.find((item) => item.id === processId);
    const manualPendingMinutes = parseHoursMinutesInput(readField(row, ["horas_pendientes", "horas_pendiente"]));
    return {
      processId,
      name: readField(row, ["ensamble", "nombre"]) || process?.name || processId,
      startDate: parseSheetDate(readField(row, ["fecha_inicio", "inicio"])),
      deadline: parseSheetDate(readField(row, ["fecha_limite", "limite", "fecha_fin"])),
      workers: Math.max(0, toNumber(readField(row, ["trabajadores", "personas", "operadores"]))),
      hoursPerDay: Math.max(0, toNumber(readField(row, ["horas_jornada", "jornada", "horas_dia"]))),
      calendar: normalizePlanningCalendar(readField(row, ["calendario"])),
      active: ["si", "sí", "true", "1", "x", "activo"].includes(normalizeText(readField(row, ["activo", "activa"]))),
      notes: readField(row, ["observaciones", "notas"]),
      manualPendingMinutes,
    };
  }).filter((item) => item.processId && PROCESS_DEFS.some((process) => process.id === item.processId));
}

function parseMaterialesCsv(text) {
  const mcMaterials = parseMcMaterialesRows(nonEmptyCsvRows(text));
  if (mcMaterials.length) return mcMaterials;

  return csvToRecords(text).map((row, index) => {
    const requerido =
      toNumber(readField(row, ["requerido", "cantidad_requerida", "cantidad", "cantidad_por_equipo"])) ||
      toNumber(readField(row, ["inventario"])) ||
      0;
    const entregado = toNumber(readField(row, ["entregado", "cantidad_entregada", "surtido"])) || 0;
    const pendiente =
      toNumber(readField(row, ["pendiente", "faltante", "faltantes"])) ||
      Math.max(requerido - entregado, 0);
    return {
      id: readField(row, ["id_material", "id", "codigo"]) || `MAT-${index + 1}`,
      descripcion: readField(row, ["descripcion", "material", "concepto", "nombre"]) || `Material ${index + 1}`,
      codigo: readField(row, ["codigo", "clave", "parte", "no_parte"]),
      proceso: readField(row, ["proceso", "area"]),
      requerido,
      stock: toNumber(readField(row, ["stock", "existencia"])) || 0,
      inventario: toNumber(readField(row, ["inventario"])) || 0,
      requisicion: readField(row, ["requisicion", "req"]),
      orden_compra: readField(row, ["orden_compra", "oc", "po"]),
      entregado,
      pendiente,
    };
  });
}

function parseFinanceCsv(text) {
  const rows = nonEmptyCsvRows(text);
  if (!rows.length) return { columns: [], records: [] };
  const headerIndex = detectFinanceHeaderIndex(rows);
  const columns = uniqueFinanceColumns(rows[headerIndex]);
  const records = rows.slice(headerIndex + 1).map((row, index) => {
    const fields = {};
    columns.forEach((column, columnIndex) => {
      fields[column.key] = String(row[columnIndex] ?? "").trim();
    });
    const almacen = readFinanceField(fields, ["almacen", "numero_almacen", "n_almacen", "no_almacen"]);
    const vin = readFinanceField(fields, ["vin"]);
    const zona = readFinanceField(fields, ["division_zona", "division", "zona"]);
    if (!almacen && !vin && !zona) return null;
    return {
      id: `FIN-${String(index + 1).padStart(4, "0")}`,
      almacen,
      vin,
      zona,
      fields,
    };
  }).filter(Boolean);
  return { columns, records };
}

function parseProgressSummaryCsv(text) {
  const mcGeneral = parseMcGeneralRows(nonEmptyCsvRows(text));
  if (Object.keys(mcGeneral.progress).length) return mcGeneral.progress;

  const mcAvance = parseMcAvanceRows(nonEmptyCsvRows(text));
  if (Object.keys(mcAvance.progress).length) return mcAvance.progress;

  const records = csvToRecords(text);
  const progress = {};

  records.forEach((row, rowIndex) => {
    const equipoId =
      readField(row, ["id_equipo", "equipo", "numero", "control", "n_control", "numero_control", "no_control", "almacen", "n_almacen"]);
    if (!equipoId) return;
    progress[equipoId] = progress[equipoId] || {};

    PROCESS_DEFS.forEach((process) => {
      const value = readField(row, processHeaderCandidates(process));
      if (value === "") return;
      const percent = parseProgressValue(value);
      if (Number.isNaN(percent)) return;
      progress[equipoId][process.id] = {
        done: Math.round((process.activities * clamp(percent, 0, 100)) / 100),
        total: process.activities,
        corrections: 0,
        updatedAt: new Date().toISOString(),
      };
    });
  });

  return progress;
}

function parseMcGeneralRows(rows) {
  const progress = {};
  const activities = {};
  const activityDefinitions = {};
  const delivered = {};
  const dataStart = rows.findIndex((row) => findEquipmentColumn(row) >= 0);
  if (dataStart < 0) return { equipos: [], progress, activities, activityDefinitions, delivered };

  const headerIndex = findMcGeneralHeaderIndex(rows, dataStart);
  if (headerIndex < 0) return { equipos: [], progress, activities, activityDefinitions, delivered };

  const headerRow = rows[headerIndex] || [];
  const groupRow = rows[Math.max(0, headerIndex - 1)] || [];
  const statusColumn = findMcStatusColumn(rows, dataStart);
  const deliveredColumn = findDeliveredColumn(headerRow, groupRow);
  const dataRows = rows.slice(dataStart).filter((row) => findEquipmentColumn(row) >= 0);
  const maxColumns = Math.max(headerRow.length, groupRow.length, ...dataRows.map((row) => row.length));
  const processColumns = {};
  let currentProcessId = "";

  for (let col = 6; col < maxColumns; col += 1) {
    const groupLabel = String(groupRow[col] || "").trim();
    const mapped = groupLabel ? mcGeneralGroupProcess(groupLabel) : "";
    if (mapped) currentProcessId = mapped;
    if (!currentProcessId) continue;

    const label = String(headerRow[col] || "").trim();
    if (!isActivityHeaderLabel(label)) continue;
    const hasActivityValue = dataRows.some((row) => isMcGeneralActivityValue(row[col]));
    if (!hasActivityValue) continue;

    processColumns[currentProcessId] = processColumns[currentProcessId] || [];
    processColumns[currentProcessId].push({ col, label });
  }

  if (!Object.keys(processColumns).length) {
    return { equipos: [], progress, activities, activityDefinitions, delivered };
  }

  Object.entries(processColumns).forEach(([processId, columns]) => {
    activityDefinitions[processId] = columns.map(({ label }, index) => ({
      id: `${processId}-${index + 1}`,
      name: label,
      subprocess: PROCESS_DEFS.find((process) => process.id === processId)?.name || processId,
    }));
  });

  const equipos = dataRows.map((row, index) => {
    const control = String(row[1] || "").trim();
    const vin = String(row[2] || "").trim();
    const id = control || `EQ-${index + 1}`;
    const statusValue = statusColumn.index >= 0 ? String(row[statusColumn.index] || "").trim() : "";
    const rawStatus = statusColumn.kind === "detenido" && isStoppedCheckValue(statusValue) ? "detenido" : statusValue;
    if (deliveredColumn >= 0) delivered[id] = isDeliveredCheckValue(row[deliveredColumn]);

    progress[id] = progress[id] || {};

    PROCESS_DEFS.forEach((process) => {
      const columns = processColumns[process.id] || [];
      let done = 0;
      let corrections = 0;
      const rowActivities = columns.map(({ col, label }, activityIndex) => {
        const stateName = activityState(row[col]);
        if (stateName === "hecho") done += 1;
        if (stateName === "correccion") corrections += 1;
        return {
          id: `${process.id}-${activityIndex + 1}`,
          name: label,
          subprocess: process.name,
          state: stateName,
          minutes: 15 + (activityIndex % 7) * 5,
        };
      });

      progress[id][process.id] = {
        done,
        total: columns.length || process.activities,
        corrections,
        updatedAt: new Date().toISOString(),
      };
      activities[`${id}:${process.id}`] = rowActivities;
    });

    return {
      id,
      control: id,
      vin,
      serie_grua: "",
      division: String(row[5] || "").trim(),
      consecutivo: String(row[4] || row[0] || index + 1).trim(),
      modelo: "",
      plazo: "",
      entrega: "",
      entregado: "",
      rawStatus,
      blocked: statusColumn.kind === "detenido" && isStoppedCheckValue(statusValue),
      updatedAt: new Date().toISOString(),
    };
  }).filter((equipo) => equipo.control || equipo.vin);

  return { equipos, progress, activities, activityDefinitions, delivered };
}

function findMcGeneralHeaderIndex(rows, dataStart) {
  for (let index = 0; index < dataStart; index += 1) {
    const keys = rows[index].map(normalizeKey);
    const hasAlmacen = keys.some((key) => key.includes("almacen"));
    const hasVin = keys.includes("vin");
    if (hasAlmacen && hasVin) return index;
  }

  let best = { index: -1, score: -1 };
  rows.slice(0, dataStart).forEach((row, index) => {
    const keys = row.map(normalizeKey);
    const score =
      (keys.some((key) => key.includes("almacen")) ? 5 : 0) +
      (keys.includes("vin") ? 5 : 0) +
      keys.reduce((sum, key) => sum + (isActivityHeaderLabel(key) ? 1 : 0), 0);
    if (score > best.score) best = { index, score };
  });
  return best.score >= 12 ? best.index : -1;
}

function mcGeneralGroupProcess(value) {
  const key = normalizeKey(value);
  if (!key) return "";
  if (key.includes("estructural")) return "estructurales";
  if (key.includes("electrico")) return "electrico";
  if (key.includes("hidraulico") || key.includes("inferior")) return "hidraulico";
  if (key.includes("pedestal") || key.includes("tornamesa")) return "pedestal";
  if (key.includes("brazo") || key.includes("nivelacion")) return "brazos";
  if (key.includes("acabados_procesos") || key.includes("acabado_inicial")) return "acabado_inicial";
  if (key.includes("pintura")) return "pintura_detalles";
  if (key.includes("acabado_final")) return "acabado_final";
  if (key.includes("taller")) return "talleres";
  if (key.includes("pruebas_iniciales")) return "pruebas_iniciales";
  if (key.includes("pruebas_finales") || key.includes("calidad")) return "calidad_final";
  return "";
}

function isMcGeneralActivityValue(value) {
  const text = normalizeText(value).replace(",", ".");
  if (!text || text === "#ref!") return false;
  if (["0", "0.0", "1", "1.0", "c", "x", "ok", "si", "no"].includes(text)) return true;
  const numeric = Number(text.replace("%", ""));
  return !Number.isNaN(numeric) && numeric >= 0 && numeric <= 100;
}

function parseMcAvanceRows(rows) {
  const dataStart = rows.findIndex((row) => row.some(isEquipmentCode));
  if (dataStart < 0) return { equipos: [], progress: {}, processTimes: {} };
  const statusColumn = findMcStatusColumn(rows, dataStart);

  const processColumns = {
    estructurales: [19],
    talleres: [20],
    electrico: [21],
    hidraulico: [22],
    pedestal: [23],
    brazos: [24],
    pruebas_iniciales: [25],
    acabado_inicial: [26],
    pintura_detalles: [27],
    acabado_final: [28],
    calidad_final: [29],
  };

  const equipos = [];
  const progress = {};

  rows.slice(dataStart).forEach((row, index) => {
    const control = String(row[1] || "").trim();
    const vin = String(row[2] || "").trim();
    if (!isEquipmentCode(control) && !vin) return;

    const id = control || `EQ-${index + 1}`;
    const statusValue = statusColumn.index >= 0 ? String(row[statusColumn.index] || "").trim() : "";
    const rawStatus = statusColumn.kind === "detenido" && isStoppedCheckValue(statusValue) ? "detenido" : statusValue;
    equipos.push({
      id,
      control: id,
      vin,
      serie_grua: "",
      division: String(row[4] || "").trim(),
      consecutivo: String(row[3] || row[0] || index + 1).trim(),
      modelo: "",
      plazo: "",
      entrega: "",
      entregado: "",
      rawStatus,
      blocked: statusColumn.kind === "detenido" && isStoppedCheckValue(statusValue),
      updatedAt: new Date().toISOString(),
    });

    progress[id] = progress[id] || {};
    PROCESS_DEFS.forEach((process) => {
      const columns = processColumns[process.id] || [];
      const values = columns
        .map((column) => parseProgressValue(row[column]))
        .filter((value) => !Number.isNaN(value));
      const percent = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
      progress[id][process.id] = {
        done: Math.round((process.activities * clamp(percent, 0, 100)) / 100),
        total: process.activities,
        corrections: 0,
        updatedAt: new Date().toISOString(),
      };
    });
  });

  return { equipos, progress, processTimes: parseMcProcessTimes(rows.slice(0, dataStart)) };
}

function parseMcProcessTimes(headerRows) {
  const hoursRowIndex = headerRows.findIndex((row) => row.some((value) => normalizeKey(value) === "horas"));
  if (hoursRowIndex <= 0) return {};

  const labelRow = headerRows[hoursRowIndex - 1] || [];
  const hoursRow = headerRows[hoursRowIndex] || [];
  const result = {};

  labelRow.forEach((label, column) => {
    const processId = processIdFromSummaryLabel(label);
    if (!processId) return;
    const raw = String(hoursRow[column] || "").trim();
    const minutes = parseDriveDurationMinutes(raw);
    const suspicious = Number.isFinite(minutes) && minutes > 1000 * 60;
    result[processId] = { raw, minutes, valid: Number.isFinite(minutes) && !suspicious, suspicious };
  });

  result.estructurales = {
    raw: formatClockMinutes(STRUCTURAL_TOTAL_MINUTES),
    minutes: STRUCTURAL_TOTAL_MINUTES,
    valid: true,
    suspicious: false,
    source: "detalle_actividades",
  };

  return result;
}

function processIdFromSummaryLabel(value) {
  const key = normalizeKey(value);
  if (key.includes("estructural")) return "estructurales";
  if (key.includes("taller")) return "talleres";
  if (key.includes("electric")) return "electrico";
  if (key.includes("inferior")) return "hidraulico";
  if (key.includes("pedest") || key.includes("tornam")) return "pedestal";
  if (key.includes("brz") || key.includes("nivel")) return "brazos";
  if (key.includes("pruebas_inicial")) return "pruebas_iniciales";
  if (key.includes("acabado_inicial")) return "acabado_inicial";
  if (key.includes("pintura")) return "pintura_detalles";
  if (key.includes("acabado_final")) return "acabado_final";
  if (key.includes("calidad") || key.includes("finales")) return "calidad_final";
  return "";
}

function parseDriveDurationMinutes(value) {
  const match = String(value || "").trim().match(/^(\d+):(\d{1,2})(?:[:.]\d{1,2})?$/);
  if (!match) return Number.NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

function findMcStatusColumn(rows, dataStart) {
  const headerRows = rows.slice(Math.max(0, dataStart - 8), dataStart);
  let genericStatus = -1;

  for (const row of headerRows) {
    for (let index = 0; index < row.length; index += 1) {
      const key = normalizeKey(row[index]);
      if (!key) continue;
      if (key.includes("deten") || key.includes("bloq") || key.includes("paro") || key.includes("hold")) {
        return { index, kind: "detenido" };
      }
      if (genericStatus < 0 && (key.includes("estatus") || key.includes("estado") || key.includes("status"))) {
        genericStatus = index;
      }
    }
  }

  return { index: genericStatus, kind: genericStatus >= 0 ? "estatus" : "" };
}

function parseProcessCsv(text, process) {
  const mcProcess = parseMcProcessRows(nonEmptyCsvRows(text), process);
  if (Object.keys(mcProcess.progress).length) return mcProcess;

  const records = csvToRecords(text);
  const progress = {};
  const activities = {};
  const delivered = {};

  records.forEach((row, rowIndex) => {
    const equipoId =
      readField(row, ["id_equipo", "equipo", "numero", "control", "numero_control", "no_control", "almacen"]) ||
      `EQ-${rowIndex + 1}`;
    const deliveredValue = readField(row, ["entregado", "entregada", "check_entregado", "unidad_entregada", "equipo_entregado"]);
    if (deliveredValue !== "") delivered[equipoId] = isDeliveredCheckValue(deliveredValue);
    const activityKeys = Object.keys(row).filter((key) => !isMetaKey(key));
    let done = 0;
    let corrections = 0;
    const rowActivities = [];

    activityKeys.forEach((key, index) => {
      const value = String(row[key] || "").trim();
      const stateName = activityState(value);
      if (stateName === "hecho") done += 1;
      if (stateName === "correccion") corrections += 1;
      rowActivities.push({
        id: `${process.id}-${index + 1}`,
        name: denormalizeHeader(key),
        subprocess: process.name,
        state: stateName,
        minutes: 15 + (index % 7) * 5,
      });
    });

    const total = activityKeys.length || process.activities;
    progress[equipoId] = progress[equipoId] || {};
    progress[equipoId][process.id] = {
      done,
      total,
      corrections,
      updatedAt: new Date().toISOString(),
    };
    activities[`${equipoId}:${process.id}`] = rowActivities;
  });

  return { progress, activities, delivered };
}

function applyFinanceData(data, financeData) {
  data.finanzas = financeData.records || financeData.finanzas || [];
  data.financeColumns = financeData.columns || financeData.financeColumns || [];
  data.financeSource = financeData.source || data.financeSource || "Finanzas";
}

function normalizeDataset(data) {
  data.progress = data.progress || {};
  data.planning = data.planning || [];
  data.materiales = data.materiales || [];
  data.finanzas = data.finanzas || [];
  data.financeColumns = data.financeColumns || [];
  data.activities = data.activities || {};
  data.activityDefinitions = data.activityDefinitions || {};
  data.activityStates = data.activityStates || {};
  data.deliveredChecks = data.deliveredChecks || {};
  data.processTimes = data.processTimes || {};

  syncEquiposFromFinance(data);

  data.equipos = (data.equipos || []).map((equipo, index) => {
    const id = equipo.id || `EQ-${index + 1}`;
    const progress = getEquipmentProgress(data, id);
    const totals = progressTotals(progress);
    const rawStatus = normalizeStatus(equipo.rawStatus);
    const status = rawStatus || computedStatus(equipo, totals);
    return {
      ...equipo,
      id,
      control: equipo.control || id,
      status,
      overall: totals.percent,
      updatedAt: newestDate(progress) || equipo.updatedAt || data.updatedAt,
    };
  });

  data.equipos.forEach((equipo) => {
    data.progress[equipo.id] = data.progress[equipo.id] || {};
    PROCESS_DEFS.forEach((process) => {
      data.progress[equipo.id][process.id] = data.progress[equipo.id][process.id] || {
        done: 0,
        total: process.activities,
        corrections: 0,
        updatedAt: data.updatedAt,
      };
    });
  });

  linkFinanceRows(data);

  return data;
}

function mergeEquipoRows(baseRows = [], updateRows = []) {
  if (!baseRows.length) return updateRows;
  if (!updateRows.length) return baseRows;

  const updatesById = new Map(updateRows.map((equipo) => [matchKey(equipo.id || equipo.control), equipo]));
  const merged = baseRows.map((equipo) => {
    const update = updatesById.get(matchKey(equipo.id || equipo.control));
    return update ? { ...equipo, ...update, id: equipo.id || update.id, control: equipo.control || update.control } : equipo;
  });
  const seen = new Set(merged.map((equipo) => matchKey(equipo.id || equipo.control)));
  updateRows.forEach((equipo) => {
    const key = matchKey(equipo.id || equipo.control);
    if (!seen.has(key)) merged.push(equipo);
  });
  return merged;
}

function syncEquiposFromFinance(data) {
  if ((data.equipos || []).length || !(data.finanzas || []).length) return;

  const seen = new Set();
  data.equipos = data.finanzas.map((row, index) => {
    const fields = row.fields || {};
    const almacen = row.almacen || readFinanceField(fields, ["almacen", "numero_almacen", "n_almacen", "no_almacen"]);
    const vin = row.vin || readFinanceField(fields, ["vin"]);
    const zona = row.zona || readFinanceField(fields, ["division_zona", "division", "zona"]);
    const baseId = almacen || vin || `FIN-${index + 1}`;
    let id = String(baseId).trim() || `FIN-${index + 1}`;
    if (seen.has(matchKey(id))) id = `${id}-${index + 1}`;
    seen.add(matchKey(id));

    return {
      id,
      control: almacen || id,
      vin,
      serie_grua: "",
      division: zona,
      consecutivo: String(index + 1).padStart(3, "0"),
      modelo: "",
      plazo: "",
      entrega: "",
      entregado: readFinanceField(fields, ["entregado", "entregada", "check", "unidad_entregada"]),
      rawStatus: "",
      updatedAt: data.updatedAt,
    };
  }).filter((equipo) => equipo.control || equipo.vin || equipo.division);
}

function linkFinanceRows(data) {
  const byVin = new Map();
  const byControl = new Map();
  (data.equipos || []).forEach((equipo) => {
    if (equipo.vin) byVin.set(matchKey(equipo.vin), equipo);
    if (equipo.control) byControl.set(matchKey(equipo.control), equipo);
    if (equipo.id) byControl.set(matchKey(equipo.id), equipo);
  });

  data.finanzas = (data.finanzas || []).map((row, index) => {
    const fields = row.fields || {};
    const almacen = row.almacen || readFinanceField(fields, ["almacen", "numero_almacen", "n_almacen", "no_almacen"]);
    const vin = row.vin || readFinanceField(fields, ["vin"]);
    const zona = row.zona || readFinanceField(fields, ["division_zona", "division", "zona"]);
    const byVinMatch = vin ? byVin.get(matchKey(vin)) : null;
    const byControlMatch = almacen ? byControl.get(matchKey(almacen)) : null;
    const zoneMatches = byControlMatch && zona && normalizeText(byControlMatch.division) === normalizeText(zona);
    const equipo = byVinMatch || byControlMatch || null;
    const matchBy = byVinMatch ? "vin" : zoneMatches ? "almacen_zona" : byControlMatch ? "almacen" : "";
    return {
      ...row,
      id: row.id || `FIN-${String(index + 1).padStart(4, "0")}`,
      almacen,
      vin,
      zona,
      equipoId: equipo?.id || "",
      matchBy,
    };
  });
}

function getSummary(data) {
  const equipos = data.equipos || [];
  let doneActivities = 0;
  let totalActivities = 0;
  let corrections = 0;
  equipos.forEach((equipo) => {
    const totals = progressTotals(getEquipmentProgress(data, equipo.id));
    doneActivities += totals.done;
    totalActivities += totals.total;
    corrections += totals.corrections;
  });

  const vinTotal = new Set(
    equipos
      .map((equipo) => matchKey(equipo.vin))
      .filter(Boolean)
  ).size;
  const fixedTotal = vinTotal || equipos.length || Number(data.meta?.equipos) || 170;
  const finishedIds = new Set(
    equipos
      .filter((equipo) => progressTotals(getEquipmentProgress(data, equipo.id)).percent >= 99.5)
      .map((equipo) => equipo.id)
  );
  const finished = finishedIds.size;
  const stopped = equipos.filter((equipo) => !finishedIds.has(equipo.id) && equipo.status === "detenido").length;
  const inProgress = equipos.filter((equipo) => {
    if (finishedIds.has(equipo.id) || equipo.status === "detenido") return false;
    return equipo.status === "en_proceso" || equipo.status === "correccion";
  }).length;
  const pending = Math.max(fixedTotal - finished - inProgress - stopped, 0);
  const delivered = getDeliveredCount(data);
  return {
    total: fixedTotal,
    fixedTotal,
    activeRows: equipos.length,
    finished,
    stopped,
    delivered,
    pending,
    inProgress,
    corrections: equipos.filter((equipo) => equipo.status === "correccion").length,
    materialShortage: (data.materiales || []).filter((item) => item.pendiente > 0).length,
    doneActivities,
    totalActivities,
    global: totalActivities ? (doneActivities / totalActivities) * 100 : 0,
    finishedRate: fixedTotal ? (finished / fixedTotal) * 100 : 0,
    alerts: getAlerts(data).length,
  };
}

function getDeliveredCount(data) {
  const delivered = new Set();

  Object.entries(data.deliveredChecks || {}).forEach(([id, value]) => {
    if (isDeliveredCheckValue(value)) delivered.add(id);
  });

  (data.finanzas || []).forEach((row) => {
    if (!hasDeliveredCheck(row.fields || row)) return;
    delivered.add(row.equipoId || row.almacen || row.vin || row.id);
  });

  (data.equipos || []).forEach((equipo) => {
    if (!hasDeliveredCheck(equipo)) return;
    delivered.add(equipo.id || equipo.control || equipo.vin);
  });

  return delivered.size;
}

function hasDeliveredCheck(fields) {
  return Object.entries(fields || {}).some(([key, value]) => {
    const normalizedKey = normalizeKey(key);
    const looksDelivered =
      normalizedKey === "entregado" ||
      normalizedKey === "entregada" ||
      normalizedKey === "check" ||
      normalizedKey.includes("check_entreg") ||
      normalizedKey.includes("entregad_check") ||
      normalizedKey.includes("unidad_entreg") ||
      normalizedKey.includes("equipo_entreg");
    return looksDelivered && isDeliveredCheckValue(value);
  });
}

function isDeliveredCheckValue(value) {
  const text = normalizeText(value);
  return ["1", "si", "sí", "x", "ok", "true", "hecho", "entregado", "entregada"].includes(text);
}

function isStoppedCheckValue(value) {
  const text = normalizeText(value);
  return ["1", "si", "sÃ­", "x", "ok", "true", "detenido", "detenida", "bloqueado", "bloqueada", "paro", "hold"].includes(text);
}

function getProcessStats(data) {
  return PROCESS_DEFS.map((process) => {
    let done = 0;
    let total = 0;
    let corrections = 0;
    data.equipos.forEach((equipo) => {
      const item = getEquipmentProgress(data, equipo.id)[process.id] || emptyProgress(process);
      done += item.done;
      total += item.total;
      corrections += item.corrections || 0;
    });
    return { ...process, done, total, corrections, percent: total ? (done / total) * 100 : 0 };
  });
}

function getStatusStats(data) {
  const counts = data.equipos.reduce((acc, equipo) => {
    acc[equipo.status] = (acc[equipo.status] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(STATUS)
    .map((key) => ({ key, label: STATUS[key].label, count: counts[key] || 0, color: STATUS[key].color }))
    .filter((item) => item.count > 0);
}

function getAlerts(data) {
  const alerts = [];
  data.equipos.forEach((equipo) => {
    const totals = progressTotals(getEquipmentProgress(data, equipo.id));
    if (equipo.status === "detenido") {
      alerts.push({ type: "detenido", title: `${equipo.control} detenido`, meta: `${equipo.division || "Sin division"} / ${formatPercent(totals.percent)} avance`, color: STATUS.detenido.color });
    }
    if (totals.corrections > 0) {
      alerts.push({ type: "correccion", title: `${equipo.control} con correcciones`, meta: `${totals.corrections} actividades por revisar`, color: STATUS.correccion.color });
    }
  });

  data.materiales
    .filter((material) => material.pendiente > 0)
    .forEach((material) => {
      alerts.push({ type: "material", title: `Faltante: ${material.descripcion}`, meta: `${material.pendiente} pendientes / ${material.codigo || material.proceso || "sin codigo"}`, color: STATUS.detenido.color });
    });

  return alerts;
}

function getFilteredEquipos() {
  const query = normalizeText(state.query);
  return state.data.equipos.filter((equipo) => {
    const matchesQuery =
      !query ||
      [equipo.id, equipo.control, equipo.vin, equipo.serie_grua, equipo.division, equipo.entrega, STATUS[equipo.status]?.label]
        .some((value) => normalizeText(value).includes(query));
    const matchesStatus = state.filters.status === "todos" || equipo.status === state.filters.status;
    const matchesDivision = state.filters.division === "todos" || equipo.division === state.filters.division;
    const matchesDelivery = state.filters.delivery === "todos" || equipo.entrega === state.filters.delivery;
    return matchesQuery && matchesStatus && matchesDivision && matchesDelivery;
  });
}

function getFilteredFinanceRows() {
  const query = normalizeText(state.financeQuery);
  return (state.data.finanzas || []).filter((row) => {
    const fields = row.fields || {};
    const values = [
      row.almacen,
      row.vin,
      row.zona,
      row.matchBy,
      ...Object.values(fields),
    ];
    const matchesQuery = !query || values.some((value) => normalizeText(value).includes(query));
    const matchesZone = state.financeFilters.zona === "todos" || row.zona === state.financeFilters.zona;
    const matchesPayment = state.financeFilters.pago === "todos" || fields.fforma_de_pago === state.financeFilters.pago;
    const matchesPaid = state.financeFilters.pagada === "todos" || fields.pagada_no_pagada === state.financeFilters.pagada;
    const matchesLink =
      state.financeFilters.match === "todos" ||
      (state.financeFilters.match === "vinculadas" && row.equipoId) ||
      (state.financeFilters.match === "sin_vinculo" && !row.equipoId);
    return matchesQuery && matchesZone && matchesPayment && matchesPaid && matchesLink;
  });
}

function getFinanceColumns() {
  return state.data.financeColumns || [];
}

function ensureFinanceVisibleColumns(columns) {
  const available = new Set(columns.map((column) => column.key));
  state.financeVisibleColumns = state.financeVisibleColumns.filter((key) => available.has(key));
  if (state.financeVisibleColumns.length) return;
  state.financeVisibleColumns = FINANCE_DEFAULT_COLUMNS.filter((key) => available.has(key));
  if (!state.financeVisibleColumns.length) state.financeVisibleColumns = columns.slice(0, 8).map((column) => column.key);
}

function getVisibleFinanceColumns(columns) {
  const selected = new Set(state.financeVisibleColumns);
  return columns.filter((column) => selected.has(column.key));
}

function updateFinanceVisibleColumns(key, visible) {
  const selected = new Set(state.financeVisibleColumns);
  if (visible) selected.add(key);
  else selected.delete(key);
  state.financeVisibleColumns = [...selected];
}

function getUniqueFinanceFieldValues(key) {
  return [...new Set((state.data.finanzas || []).map((row) => row.fields?.[key]).filter(Boolean))].sort();
}

function getFinanceSummary(rows) {
  return {
    total: rows.length,
    matched: rows.filter((row) => row.equipoId).length,
    unmatched: rows.filter((row) => !row.equipoId).length,
    withBalance: rows.filter((row) => toNumber(row.fields?.saldo_pendiente) > 0 || normalizeText(row.fields?.saldo_pendiente).includes("pend")).length,
    warranty: rows.filter((row) => String(row.fields?.unidades_en_garantia || row.fields?.estatus_de_garantias || "").trim()).length,
  };
}

function getFinanceChartData(rows) {
  const balanceKey = getFinanceBalanceKey();
  const totalBalance = rows.reduce((sum, row) => sum + toNumber(row.fields?.[balanceKey]), 0);
  const financeSummary = getDashboardFinanceSummary(rows);
  const invoiceAfterPenalty = Math.max(financeSummary.invoice - financeSummary.penalized, 0);
  return {
    totalBalance,
    byZone: groupFinanceMoney(rows, "zona", balanceKey, "Sin zona").slice(0, 8),
    invoiceComposition: [
      { label: "Factura sin penalizacion", value: invoiceAfterPenalty },
      { label: "Monto penalizado", value: financeSummary.penalized },
    ],
  };
}

function getDashboardStatusStats(summary) {
  return [
    { key: "terminado", label: "Terminado", count: summary.finished, color: STATUS.terminado.color },
    { key: "en_proceso", label: "En proceso", count: summary.inProgress, color: STATUS.en_proceso.color },
    { key: "pendiente", label: "Pendiente", count: summary.pending, color: STATUS.pendiente.color },
    { key: "detenido", label: "Detenido", count: summary.stopped, color: STATUS.detenido.color },
  ].filter((item) => item.count > 0);
}

function getFinishedDeliveryStats(summary) {
  const delivered = Math.min(summary.delivered, summary.finished);
  return [
    { key: "por_entregar", label: "Terminadas por entregar", count: Math.max(summary.finished - delivered, 0), color: STATUS.en_proceso.color },
    { key: "entregadas", label: "Entregadas", count: delivered, color: STATUS.terminado.color },
  ];
}

function getFinanceBalanceKey() {
  const columns = getFinanceColumns();
  const saldo = columns.find((column) => column.key.includes("saldo") && column.key.includes("pend"));
  if (saldo) return saldo.key;
  const balance = columns.find((column) => column.key.includes("saldo"));
  if (balance) return balance.key;
  const amount = columns.find(isFinanceMoneyColumn);
  return amount?.key || "saldo_pendiente";
}

function groupFinanceMoney(rows, groupKey, moneyKey, fallbackLabel) {
  const groups = new Map();
  rows.forEach((row) => {
    const label = groupKey === "zona" ? row.zona || fallbackLabel : row.fields?.[groupKey] || fallbackLabel;
    groups.set(label, (groups.get(label) || 0) + toNumber(row.fields?.[moneyKey]));
  });
  return [...groups.entries()]
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

function getFinanceMoneyTotals(rows, columns) {
  return columns.reduce((totals, column) => {
    if (!isFinanceMoneyColumn(column)) return totals;
    totals[column.key] = rows.reduce((sum, row) => sum + toNumber(row.fields?.[column.key]), 0);
    return totals;
  }, {});
}

function getDashboardFinanceSummary(rows) {
  const invoice = sumFinanceByColumnMatch(rows, ["factura"]);
  return {
    balance: Math.max(PROJECT_TOTAL_AMOUNT - invoice, 0),
    invoice,
    penalized: sumFinanceByColumnMatch(rows, ["penal"]),
    paid: sumFinancePaidAmount(rows),
  };
}

function getFinanceWarrantySummary(rows) {
  return rows.reduce((summary, row) => {
    const status = normalizeText(row.fields?.estatus_de_garantias);
    if (!status) return summary;

    if (status.includes("por atender") || status.includes("no atend")) {
      summary.unattended += 1;
    } else if (status.includes("atendid")) {
      summary.attended += 1;
    }
    return summary;
  }, { attended: 0, unattended: 0 });
}

function sumFinanceByColumnMatch(rows, terms) {
  const columns = getFinanceColumns().filter((column) => terms.every((term) => column.key.includes(term)));
  if (!columns.length) return 0;
  return rows.reduce((sum, row) => {
    return sum + columns.reduce((columnSum, column) => columnSum + toNumber(row.fields?.[column.key]), 0);
  }, 0);
}

function sumFinancePaidAmount(rows) {
  const columns = getFinanceColumns().filter((column) => {
    const key = column.key || "";
    if (key.includes("pagada_no_pagada")) return false;
    if (key.includes("promesa")) return false;
    return (key.includes("pagado") || key.includes("pagada") || key.includes("pago")) && isFinanceMoneyColumn(column);
  });
  if (columns.length) {
    return rows.reduce((sum, row) => {
      return sum + columns.reduce((columnSum, column) => columnSum + toNumber(row.fields?.[column.key]), 0);
    }, 0);
  }

  const invoiceKey = getFinanceColumns().find((column) => column.key.includes("factura"))?.key;
  const balanceKey = getFinanceBalanceKey();
  if (!invoiceKey || !balanceKey) return 0;
  return rows.reduce((sum, row) => {
    const invoice = toNumber(row.fields?.[invoiceKey]);
    const balance = toNumber(row.fields?.[balanceKey]);
    return sum + Math.max(invoice - balance, 0);
  }, 0);
}

function isFinanceMoneyColumn(column) {
  const key = column.key || "";
  return ["factura", "saldo", "monto", "penalizacion", "precio", "costo", "importe", "total"].some((term) => key.includes(term));
}

function getFinanceEquipo(row) {
  return state.data.equipos.find((equipo) => equipo.id === row.equipoId || equipo.control === row.equipoId);
}

function getSelectedEquipo() {
  return state.data.equipos.find((equipo) => equipo.id === state.selectedId) || state.data.equipos[0];
}

function getEquipmentProgress(data, equipoId) {
  const direct = data.progress[equipoId];
  if (direct) return direct;
  const equipo = data.equipos.find((item) => item.id === equipoId || item.control === equipoId);
  return equipo ? data.progress[equipo.id] || {} : {};
}

function getCaptureActivities(equipoId, process) {
  const key = `${equipoId}:${process.id}`;
  if (state.data.activities[key]?.length) return state.data.activities[key];

  const definitions = state.data.activityDefinitions?.[process.id];
  if (definitions?.length) {
    const states = state.data.activityStates?.[key] || "";
    const activities = definitions.map((activity, index) => ({
      id: activity.id || `${process.id}-${index + 1}`,
      name: activity.name || `Actividad ${String(index + 1).padStart(2, "0")}`,
      subprocess: activity.subprocess || process.name,
      state: decodeActivityState(states[index]),
      minutes: activity.minutes || 15 + (index % 7) * 5,
    }));
    state.data.activities[key] = activities;
    return activities;
  }

  const progress = getEquipmentProgress(state.data, equipoId)[process.id] || emptyProgress(process);
  const total = Math.max(progress.total || process.activities, 1);
  const activities = [];
  for (let i = 1; i <= Math.min(total, 80); i += 1) {
    let stateName = i <= progress.done ? "hecho" : "pendiente";
    if (i > progress.done - (progress.corrections || 0) && i <= progress.done && progress.corrections) stateName = "correccion";
    activities.push({
      id: `${process.id}-${i}`,
      name: `Actividad ${String(i).padStart(2, "0")}`,
      subprocess: process.name,
      state: stateName,
      minutes: 15 + (i % 8) * 5,
    });
  }
  state.data.activities[key] = activities;
  return activities;
}

function updateActivityState(activityId, nextState) {
  const equipo = getSelectedEquipo();
  const process = PROCESS_DEFS.find((item) => item.id === state.captureProcess);
  if (!equipo || !process) return;

  const activities = getCaptureActivities(equipo.id, process);
  const activity = activities.find((item) => item.id === activityId);
  if (!activity) return;
  activity.state = nextState;

  const done = activities.filter((item) => item.state === "hecho").length;
  const corrections = activities.filter((item) => item.state === "correccion").length;
  state.data.progress[equipo.id][process.id] = {
    done,
    total: activities.length,
    corrections,
    updatedAt: new Date().toISOString(),
  };
  state.data = normalizeDataset(state.data);
  state.toast = "Actividad actualizada.";
  render();
}

function renderProgressRing(percent, label) {
  const value = clamp(percent, 0, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  return `
    <svg class="progress-ring" viewBox="0 0 180 180" role="img" aria-label="${escapeAttr(label)} ${formatPercent(value)}">
      <circle class="ring-track" cx="90" cy="90" r="${radius}"></circle>
      <circle class="ring-value" cx="90" cy="90" r="${radius}" stroke-dasharray="${dash} ${circumference}"></circle>
      <text class="ring-number" x="90" y="88" text-anchor="middle">${Math.round(value)}%</text>
      <text class="ring-label" x="90" y="110" text-anchor="middle">${escapeHtml(label).toUpperCase()}</text>
    </svg>
  `;
}

function renderDonut(items, centerLabel = "UNIDADES", ariaLabel = "Distribucion por estatus") {
  const itemTotal = items.reduce((sum, item) => sum + item.count, 0);
  const total = itemTotal || 1;
  let offset = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const segments = items.map((item) => {
    const length = (item.count / total) * circumference;
    const segment = `<circle cx="100" cy="100" r="${radius}" fill="none" stroke="${item.color}" stroke-width="22" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" transform="rotate(-90 100 100)" stroke-linecap="butt"></circle>`;
    offset += length;
    return segment;
  }).join("");
  return `
    <svg class="donut" viewBox="0 0 200 200" role="img" aria-label="${escapeAttr(ariaLabel)}">
      <circle class="donut-bg" cx="100" cy="100" r="${radius}"></circle>
      ${segments}
      <text class="ring-number" x="100" y="98" text-anchor="middle">${itemTotal}</text>
      <text class="ring-label" x="100" y="120" text-anchor="middle">${escapeHtml(centerLabel)}</text>
    </svg>
  `;
}

function renderRadar(processStats) {
  const size = 330;
  const center = size / 2;
  const radius = 120;
  const points = processStats.map((process, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / processStats.length;
    const valueRadius = radius * (clamp(process.percent, 0, 100) / 100);
    return {
      label: process.name,
      axis: `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`,
      point: `${center + Math.cos(angle) * valueRadius},${center + Math.sin(angle) * valueRadius}`,
      textX: center + Math.cos(angle) * (radius + 24),
      textY: center + Math.sin(angle) * (radius + 24),
    };
  });

  const rings = [0.25, 0.5, 0.75, 1]
    .map((scale) => {
      const ringPoints = processStats.map((_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / processStats.length;
        return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
      });
      return `<polygon points="${ringPoints.join(" ")}" fill="none" stroke="rgba(16,20,24,0.12)" stroke-width="1"></polygon>`;
    })
    .join("");

  return `
    <svg class="radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="Radar de procesos">
      ${rings}
      ${points.map((point) => `<line x1="${center}" y1="${center}" x2="${point.axis.split(",")[0]}" y2="${point.axis.split(",")[1]}" stroke="rgba(16,20,24,0.12)" />`).join("")}
      <polygon points="${points.map((point) => point.point).join(" ")}" fill="rgba(31,120,184,0.22)" stroke="#1f78b8" stroke-width="2"></polygon>
      ${points.map((point, index) => `<circle cx="${point.point.split(",")[0]}" cy="${point.point.split(",")[1]}" r="4" fill="${processStats[index].color}"></circle>`).join("")}
      ${points.map((point, index) => `<text x="${point.textX}" y="${point.textY}" text-anchor="${point.textX > center + 10 ? "start" : point.textX < center - 10 ? "end" : "middle"}" fill="#64707b" font-size="10">${index + 1}</text>`).join("")}
    </svg>
  `;
}

function renderProcessFocus(processStats) {
  const average = processStats.length
    ? processStats.reduce((sum, process) => sum + Number(process.percent || 0), 0) / processStats.length
    : 0;
  const sorted = [...processStats].sort((a, b) => b.percent - a.percent);
  const top = sorted[0];
  const lagging = [...processStats].sort((a, b) => a.percent - b.percent)[0];

  return `
    <div class="process-focus">
      <div class="process-summary-strip">
        <div class="process-summary-card primary">
          <span>Promedio areas</span>
          <strong>${formatPercent(average)}</strong>
          <small>avance general de los 11 ensambles</small>
        </div>
        <div class="process-summary-card">
          <span>Mas avanzado</span>
          <strong>${top ? formatPercent(top.percent) : "-"}</strong>
          <small>${escapeHtml(top?.name || "-")}</small>
        </div>
        <div class="process-summary-card warning">
          <span>Mayor rezago</span>
          <strong>${lagging ? formatPercent(lagging.percent) : "-"}</strong>
          <small>${escapeHtml(lagging?.name || "-")}</small>
        </div>
      </div>
      <div class="bar-list process-bar-list">
        ${processStats.map((process) => renderProcessBarRow(process)).join("")}
      </div>
    </div>
  `;
}

function renderProcessTimeTable(processStats, processTimes) {
  return `
    <div class="process-time-section">
      <div class="process-time-heading">
        <div>
          <p class="panel-label">Carga pendiente</p>
          <h3 class="process-time-title">Tiempo estimado por area</h3>
        </div>
        <span class="badge">Jornada base: 8 horas</span>
      </div>
      <div class="table-wrap process-time-table-wrap">
        <table class="data-table process-time-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Avance</th>
              <th>Pendientes</th>
              <th>Tiempo por ensamble</th>
              <th>Horas pendientes</th>
              <th>Dias de trabajo</th>
            </tr>
          </thead>
          <tbody>
            ${processStats.map((process) => renderProcessTimeRow(process, processTimes[process.id])).join("")}
          </tbody>
        </table>
      </div>
      <p class="process-time-note">Calculo: pendientes x tiempo por ensamble. Los dias se redondean hacia arriba usando jornadas de 8 horas.</p>
      ${renderStructuralTimeDetail()}
    </div>
  `;
}

function renderStructuralTimeDetail() {
  return `
    <details class="structural-time-detail" open>
      <summary>
        <span>Validacion de tiempo estructural</span>
        <strong>${STRUCTURAL_ACTIVITY_TIMES.length} actividades · ${formatClockMinutes(STRUCTURAL_TOTAL_MINUTES)} por estructura</strong>
      </summary>
      <div class="table-wrap structural-time-table-wrap">
        <table class="data-table structural-time-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Actividad</th>
              <th>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            ${STRUCTURAL_ACTIVITY_TIMES.map((activity, index) => `
              <tr>
                <td class="mono">${index + 1}</td>
                <td>${escapeHtml(activity.name)}</td>
                <td class="mono">${formatClockMinutes(activity.minutes)}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"><strong>Tiempo total por estructura</strong></td>
              <td class="mono"><strong>${formatClockMinutes(STRUCTURAL_TOTAL_MINUTES)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  `;
}

function renderProcessTimeRow(process, time) {
  const pending = Math.max(Number(process.total || 0) - Number(process.done || 0), 0);
  const validTime = Boolean(time?.valid && Number.isFinite(time.minutes));
  const pendingMinutes = validTime ? pending * time.minutes : Number.NaN;
  const workDays = validTime ? Math.ceil(pendingMinutes / (8 * 60)) : Number.NaN;
  const timeLabel = validTime
    ? formatClockMinutes(time.minutes)
    : `<span class="time-source-error">Dato por revisar${time?.raw ? ` (${escapeHtml(time.raw)})` : ""}</span>`;

  return `
    <tr class="${process.id === "estructurales" ? "process-time-highlight" : ""}">
      <td><strong>${escapeHtml(process.name)}</strong></td>
      <td class="mono">${process.done} / ${process.total}</td>
      <td class="mono">${pending}</td>
      <td class="mono">${timeLabel}</td>
      <td class="mono">${validTime ? formatWorkDuration(pendingMinutes) : "-"}</td>
      <td><strong>${validTime ? `${workDays.toLocaleString("es-MX")} dias` : "-"}</strong></td>
    </tr>
  `;
}

function formatClockMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60);
  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function formatWorkDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60);
  return `${hours.toLocaleString("es-MX")} h ${String(remainder).padStart(2, "0")} min`;
}

function renderProcessBarRow(process) {
  return `
    <div class="bar-row process-bar-row process-bar-link" data-action="open-hours-process" data-process="${escapeAttr(process.id)}" role="button" tabindex="0" aria-label="Abrir resumen general de ${escapeAttr(process.name)}">
      <span class="bar-label" title="${escapeAttr(process.name)}">${escapeHtml(process.name)}</span>
      <div class="bar-track"><div class="bar-fill" style="--value:${clamp(process.percent, 0, 100)}%; --bar-color:${process.color};"></div></div>
      <span class="bar-value">${formatPercent(process.percent)}</span>
      <span class="process-count-inline">${process.done} / ${process.total}</span>
    </div>
  `;
}

function renderProcessPiePanel(processStats, title) {
  return `
    <div class="process-pie-layout">
      ${renderProcessPie(processStats)}
      <div class="legend process-pie-legend">
        ${processStats.map((process) => renderLegendRow(process.name, formatPercent(process.percent), process.color)).join("")}
      </div>
    </div>
  `;
}

function renderProcessPie(processStats) {
  const values = processStats.map((process) => Math.max(Number(process.percent) || 0, 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!total) {
    return `
      <svg class="process-pie" viewBox="0 0 200 200" role="img" aria-label="Sin avance por proceso">
        <circle cx="100" cy="100" r="78" fill="#e9eff4"></circle>
        <text class="ring-number" x="100" y="98" text-anchor="middle">0%</text>
        <text class="ring-label" x="100" y="120" text-anchor="middle">AVANCE</text>
      </svg>
    `;
  }

  let startAngle = -90;
  const segments = processStats.map((process, index) => {
    const angle = (values[index] / total) * 360;
    const segment = pieSegmentPath(100, 100, 82, startAngle, startAngle + angle);
    startAngle += angle;
    return `<path d="${segment}" fill="${process.color}"></path>`;
  }).join("");
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  return `
    <svg class="process-pie" viewBox="0 0 200 200" role="img" aria-label="Pastel de avance por proceso">
      ${segments}
      <circle cx="100" cy="100" r="42" fill="#ffffff"></circle>
      <text class="ring-number" x="100" y="98" text-anchor="middle">${formatPercent(average)}</text>
      <text class="ring-label" x="100" y="120" text-anchor="middle">PROMEDIO</text>
    </svg>
  `;
}

function pieSegmentPath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function polarToCartesian(cx, cy, radius, angleDegrees) {
  const angle = (angleDegrees - 90) * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function renderDetailProcessChart(processStats) {
  const width = 760;
  const height = 380;
  const leftPad = 44;
  const rightPad = 22;
  const topPad = 42;
  const bottomPad = 86;
  const chartWidth = width - leftPad - rightPad;
  const chartHeight = height - topPad - bottomPad;
  const step = chartWidth / processStats.length;
  const barWidth = Math.min(42, step * 0.68);
  const maxValue = 100;
  const yFor = (value) => topPad + chartHeight - (clamp(value, 0, maxValue) / maxValue) * chartHeight;
  const metaValues = processStats.map(() => 100);
  const linePoints = metaValues.map((value, index) => {
    const x = leftPad + step * index + step / 2;
    return `${x},${yFor(value)}`;
  }).join(" ");
  const bars = processStats.map((process, index) => {
    const x = leftPad + step * index + (step - barWidth) / 2;
    const y = yFor(process.percent);
    const barHeight = topPad + chartHeight - y;
    const label = process.name.length > 12 ? `${process.name.slice(0, 10)}.` : process.name;
    return `
      <g>
        <rect class="detail-chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="2"></rect>
        <text class="detail-chart-value" x="${x + barWidth / 2}" y="${Math.max(y - 7, 18)}" text-anchor="middle">${formatPercent(process.percent)}</text>
        <text class="detail-chart-axis-label" x="${x + barWidth / 2}" y="${height - 48}" text-anchor="end" transform="rotate(-35 ${x + barWidth / 2} ${height - 48})">${escapeHtml(label)}</text>
      </g>
    `;
  }).join("");
  const grid = [0, 25, 50, 75, 100].map((tick) => {
    const y = yFor(tick);
    return `
      <g>
        <line class="detail-chart-grid" x1="${leftPad}" y1="${y}" x2="${width - rightPad}" y2="${y}"></line>
        <text class="detail-chart-tick" x="${leftPad - 10}" y="${y + 4}" text-anchor="end">${tick}</text>
      </g>
    `;
  }).join("");

  return `
    <div class="detail-chart-wrap">
      <svg class="detail-process-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafica de avance por proceso">
        <text class="detail-chart-kpi" x="${leftPad}" y="22">${formatPercent(processStats.reduce((sum, process) => sum + process.percent, 0) / Math.max(processStats.length, 1))}</text>
        <text class="detail-chart-subtitle" x="${leftPad + 72}" y="22">Avance promedio</text>
        <g class="detail-chart-legend">
          <circle cx="${width - 174}" cy="20" r="6"></circle>
          <text x="${width - 160}" y="24">Avance</text>
          <circle class="meta" cx="${width - 90}" cy="20" r="6"></circle>
          <text x="${width - 76}" y="24">Meta</text>
        </g>
        ${grid}
        ${bars}
        <polyline class="detail-chart-line" points="${linePoints}"></polyline>
        ${metaValues.map((value, index) => `<circle class="detail-chart-line-point" cx="${leftPad + step * index + step / 2}" cy="${yFor(value)}" r="3.5"></circle>`).join("")}
      </svg>
    </div>
  `;
}

function renderBarRow(label, percent, color) {
  return `
    <div class="bar-row">
      <span class="bar-label" title="${escapeAttr(label)}">${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="--value:${clamp(percent, 0, 100)}%; --bar-color:${color};"></div></div>
      <span class="bar-value">${formatPercent(percent)}</span>
    </div>
  `;
}

function renderMiniBar(percent, color) {
  return `
    <div class="bar-row" style="grid-template-columns:minmax(120px,1fr) 52px; gap:8px;">
      <div class="bar-track"><div class="bar-fill" style="--value:${clamp(percent, 0, 100)}%; --bar-color:${color};"></div></div>
      <span class="bar-value">${formatPercent(percent)}</span>
    </div>
  `;
}

function renderLegendRow(label, value, color) {
  return `
    <div class="legend-row">
      <span class="status-dot" style="background:${color};"></span>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `;
}

function renderAlert(alert) {
  return `
    <div class="alert-item">
      <span class="alert-stripe" style="background:${alert.color};"></span>
      <div>
        <p class="alert-title">${escapeHtml(alert.title)}</p>
        <p class="alert-meta">${escapeHtml(alert.meta)}</p>
      </div>
      <span class="badge ${alert.type === "detenido" || alert.type === "material" ? "detenido" : "correccion"}">${escapeHtml(alert.type)}</span>
    </div>
  `;
}

function renderIdentity(label, value) {
  return `
    <div class="identity-line">
      <span>${label}</span>
      <strong>${escapeHtml(value || "-")}</strong>
    </div>
  `;
}

function renderStatusBadge(status) {
  const meta = STATUS[status] || STATUS.pendiente;
  return `<span class="badge ${meta.className}"><span class="status-dot ${meta.className}"></span>${meta.label}</span>`;
}

function renderFinanceMatch(row, equipo) {
  if (!equipo) return `<span class="badge correccion">Sin vinculo</span>`;
  const label = row.matchBy === "vin" ? "VIN" : row.matchBy === "almacen_zona" ? "Almacen + zona" : "Almacen";
  return `
    <div class="finance-link">
      <span class="badge terminado">${escapeHtml(label)}</span>
      <span class="small">${escapeHtml(equipo.control)} / ${escapeHtml(equipo.division || "-")}</span>
    </div>
  `;
}

function renderFinanceCharts(data) {
  return `
    <div class="finance-charts">
      <section class="finance-chart">
        <div class="panel-header">
          <div>
            <p class="panel-label">Saldo pendiente</p>
            <h3 class="finance-chart-title">Sumatoria por zona</h3>
          </div>
          <strong class="finance-total">${formatCurrency(data.totalBalance)}</strong>
        </div>
        ${renderFinanceBalanceBars(data.byZone)}
      </section>
      <section class="finance-chart">
        <div class="panel-header">
          <div>
            <p class="panel-label">Total factura</p>
            <h3 class="finance-chart-title">Factura y monto penalizado</h3>
          </div>
        </div>
        <div class="finance-donut-layout">
          ${renderFinanceMoneyDonut(data.invoiceComposition)}
          <div class="legend">
            ${data.invoiceComposition.map((item, index) => renderLegendRow(item.label, formatCurrency(item.value), financeChartColor(index))).join("")}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderFinanceBalanceBars(items) {
  if (!items.length) return `<div class="empty-state">Sin saldos con los filtros actuales.</div>`;
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  return `
    <div class="finance-bar-list">
      ${items.map((item, index) => `
        <div class="finance-money-row">
          <span class="bar-label" title="${escapeAttr(item.label)}">${escapeHtml(item.label)}</span>
          <div class="bar-track"><div class="bar-fill" style="--value:${(item.value / maxValue) * 100}%; --bar-color:${financeChartColor(index)};"></div></div>
          <strong class="bar-value">${formatCurrency(item.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderFinanceMoneyDonut(items) {
  const filtered = items.filter((item) => item.value > 0);
  const total = filtered.reduce((sum, item) => sum + item.value, 0);
  if (!total) {
    return `
      <svg class="finance-donut" viewBox="0 0 200 200" role="img" aria-label="Sin facturas ni penalizaciones">
        <circle class="donut-bg" cx="100" cy="100" r="70"></circle>
        <text class="ring-number" x="100" y="102" text-anchor="middle">$0</text>
      </svg>
    `;
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = filtered.map((item, index) => {
    const length = (item.value / total) * circumference;
    const segment = `<circle cx="100" cy="100" r="${radius}" fill="none" stroke="${financeChartColor(index)}" stroke-width="22" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" transform="rotate(-90 100 100)"></circle>`;
    offset += length;
    return segment;
  }).join("");

  return `
    <svg class="finance-donut" viewBox="0 0 200 200" role="img" aria-label="Distribucion de factura y monto penalizado">
      <circle class="donut-bg" cx="100" cy="100" r="${radius}"></circle>
      ${segments}
      <text class="ring-number finance-donut-number" x="100" y="96" text-anchor="middle">${formatCompactMoney(total)}</text>
      <text class="ring-label" x="100" y="116" text-anchor="middle">FACTURA</text>
    </svg>
  `;
}

function financeChartColor(index) {
  const colors = ["#1f78b8", "#2aa96b", "#f08a24", "#d63c32", "#6f7f8c", "#0d3f66", "#77bde5", "#2b2f33"];
  return colors[index % colors.length];
}

function renderOptions(values, selected, labeler = (value) => value === "todos" ? "Todos" : value) {
  return values.map((value) => `<option value="${escapeAttr(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(labeler(value))}</option>`).join("");
}

function financeMatchLabel(value) {
  const labels = { todos: "Todos", vinculadas: "Vinculadas", sin_vinculo: "Sin vinculo" };
  return labels[value] || value;
}

function statusLabel(value) {
  if (value === "todos") return "Todos";
  return STATUS[value]?.label || value;
}

function captureLabel(value) {
  const labels = { todos: "Todos", pendiente: "Pendiente", hecho: "Hecho", correccion: "Correccion" };
  return labels[value] || value;
}

function captureShortLabel(value) {
  const labels = { pendiente: "P", hecho: "H", correccion: "C" };
  return labels[value] || value;
}

function getMaterialSummary(materiales) {
  const totalRequired = materiales.reduce((sum, item) => sum + Number(item.requerido || 0), 0);
  const totalDelivered = materiales.reduce((sum, item) => sum + Number(item.entregado || 0), 0);
  return {
    total: materiales.length,
    shortage: materiales.filter((item) => item.pendiente > 0).length,
    coverage: totalRequired ? (totalDelivered / totalRequired) * 100 : 100,
    purchaseOrders: materiales.filter((item) => item.orden_compra).length,
  };
}

function progressTotals(progress) {
  const values = PROCESS_DEFS.map((process) => progress[process.id] || emptyProgress(process));
  const done = values.reduce((sum, item) => sum + Number(item.done || 0), 0);
  const total = values.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const corrections = values.reduce((sum, item) => sum + Number(item.corrections || 0), 0);
  return { done, total, corrections, percent: total ? (done / total) * 100 : 0 };
}

function progressPercent(item) {
  return item?.total ? (Number(item.done || 0) / Number(item.total || 0)) * 100 : 0;
}

function emptyProgress(process) {
  return { done: 0, total: process.activities, corrections: 0, updatedAt: "" };
}

function computedStatus(equipo, totals) {
  if (totals.percent >= 99.5) return "terminado";
  if (equipo.blocked) return "detenido";
  if (totals.corrections > 4) return "correccion";
  if (totals.percent <= 1) return "pendiente";
  return "en_proceso";
}

function normalizeStatus(value) {
  const text = normalizeText(value);
  if (!text) return "";
  if (text.includes("termin")) return "terminado";
  if (text.includes("deten") || text.includes("bloq")) return "detenido";
  if (text.includes("corr") || text.includes("rech")) return "correccion";
  if (text.includes("pend")) return "pendiente";
  if (text.includes("proc") || text.includes("avance")) return "en_proceso";
  return "";
}

function statusColor(status) {
  return STATUS[status]?.color || STATUS.pendiente.color;
}

function newestDate(progress) {
  const dates = Object.values(progress || {})
    .map((item) => Date.parse(item.updatedAt))
    .filter(Boolean)
    .sort((a, b) => b - a);
  return dates[0] ? new Date(dates[0]).toISOString() : "";
}

function getUniqueValues(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort();
}

function formatPercent(value) {
  return `${Math.round(clamp(Number(value) || 0, 0, 100))}%`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function formatShortDate(value) {
  if (!value) return "-";
  const date = value instanceof Date ? value : parseIsoLocalDate(value);
  if (!date || Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}

function parseSheetDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseIsoLocalDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfLocalDay(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addCalendarDays(value, days) {
  const date = startOfLocalDay(value);
  date.setDate(date.getDate() + days);
  return date;
}

function normalizePlanningCalendar(value) {
  const calendar = normalizeKey(value);
  if (calendar.includes("dom")) return "LUN-DOM";
  if (calendar.includes("sab")) return "LUN-SAB";
  return "LUN-VIE";
}

function isPlanningWorkday(date, calendar) {
  const day = date.getDay();
  if (calendar === "LUN-DOM") return true;
  return day !== 0 && (calendar === "LUN-SAB" || day !== 6);
}

function countWorkdaysInclusive(start, end, calendar) {
  if (!start || !end || start > end) return 0;
  let total = 0;
  for (let date = startOfLocalDay(start); date <= end; date = addCalendarDays(date, 1)) {
    if (isPlanningWorkday(date, calendar)) total += 1;
  }
  return total;
}

function addWorkdays(start, workdays, calendar) {
  let date = startOfLocalDay(start);
  let remaining = Math.max(0, Number(workdays) || 0);
  while (!isPlanningWorkday(date, calendar)) date = addCalendarDays(date, 1);
  while (remaining > 0) {
    date = addCalendarDays(date, 1);
    if (isPlanningWorkday(date, calendar)) remaining -= 1;
  }
  return date;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
}

function formatCompactMoney(value) {
  const number = Number(value || 0);
  if (Math.abs(number) >= 1000000) return `$${(number / 1000000).toLocaleString("es-MX", { maximumFractionDigits: 1 })}M`;
  if (Math.abs(number) >= 1000) return `$${(number / 1000).toLocaleString("es-MX", { maximumFractionDigits: 0 })}K`;
  return formatCurrency(number);
}

function formatFinanceValue(value, column) {
  const raw = String(value ?? "").trim();
  if (!raw) return `<span class="small">-</span>`;
  const key = column.key || "";
  if (key.includes("factura") || key.includes("saldo") || key.includes("monto")) {
    const numeric = toNumber(raw);
    if (numeric) return `<span class="mono">${formatCurrency(numeric)}</span>`;
  }
  if (key.includes("fecha") || key.includes("promesa") || key.includes("oficio")) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) return `<span class="mono">${formatDate(raw)}</span>`;
  }
  return escapeHtml(raw);
}

function demoDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() - (offset % 18));
  return date.toISOString();
}

function pseudoRandom(seed, salt) {
  const raw = Math.sin(seed * 999 + salt * 37) * 10000;
  return raw - Math.floor(raw);
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

function nonEmptyCsvRows(text) {
  return parseCsv(text)
    .map((row) => row.map((cell) => String(cell ?? "").trim()))
    .filter((row) => row.some((cell) => cell !== ""));
}

function csvToRecords(text) {
  const rows = nonEmptyCsvRows(text);
  if (!rows.length) return [];
  const headerIndex = detectCsvHeaderIndex(rows);
  const headers = uniqueHeaders(rows[headerIndex]);
  return rows.slice(headerIndex + 1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = String(row[index] ?? "").trim();
    });
    return record;
  }).filter((record) => Object.values(record).some((value) => value !== ""));
}

function detectCsvHeaderIndex(rows) {
  let best = { index: 0, score: -1 };
  rows.slice(0, 15).forEach((row, index) => {
    const normalized = row.map(normalizeKey);
    const score = normalized.reduce((sum, key) => {
      if (!key) return sum;
      if (["vin", "division", "entrega", "estatus", "estado", "cantidad", "plazo", "modelo"].includes(key)) return sum + 3;
      if (key.includes("control") || key.includes("almacen") || key.includes("consecutivo")) return sum + 3;
      if (key.includes("descripcion") || key.includes("codigo") || key.includes("material")) return sum + 3;
      if (key.includes("requisicion") || key.includes("entregado") || key.includes("inventario")) return sum + 3;
      if (key.includes("avance") || key.includes("ensamble") || key.includes("proceso")) return sum + 2;
      return sum;
    }, 0);
    if (score > best.score) best = { index, score };
  });
  return best.score > 0 ? best.index : 0;
}

function detectFinanceHeaderIndex(rows) {
  let best = { index: 0, score: -1 };
  rows.slice(0, 15).forEach((row, index) => {
    const keys = row.map(normalizeKey);
    const score = keys.reduce((sum, key) => {
      if (key === "vin") return sum + 5;
      if (key.includes("almacen")) return sum + 5;
      if (key.includes("division") || key.includes("zona")) return sum + 4;
      if (key.includes("factura") || key.includes("pago") || key.includes("saldo")) return sum + 3;
      if (key.includes("garantia") || key.includes("garantias")) return sum + 2;
      return sum;
    }, 0);
    if (score > best.score) best = { index, score };
  });
  return best.index;
}

function uniqueHeaders(row) {
  const counts = {};
  return row.map((header, index) => {
    const base = normalizeKey(header) || `col_${index + 1}`;
    counts[base] = (counts[base] || 0) + 1;
    return counts[base] === 1 ? base : `${base}_${counts[base]}`;
  });
}

function uniqueFinanceColumns(row) {
  const counts = {};
  return row.map((header, index) => {
    const label = String(header || `Columna ${index + 1}`).trim() || `Columna ${index + 1}`;
    const base = normalizeKey(label) || `col_${index + 1}`;
    counts[base] = (counts[base] || 0) + 1;
    const key = counts[base] === 1 ? base : `${base}_${counts[base]}`;
    return { key, label };
  });
}

function readFinanceField(fields, candidates) {
  for (const candidate of candidates) {
    const key = normalizeKey(candidate);
    if (Object.prototype.hasOwnProperty.call(fields, key)) return fields[key];
  }
  const keys = Object.keys(fields);
  for (const candidate of candidates) {
    const key = normalizeKey(candidate);
    const found = keys.find((fieldKey) => fieldKey.includes(key) || key.includes(fieldKey));
    if (found) return fields[found];
  }
  return "";
}

function matchKey(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  rows.push(row);
  return rows;
}

function readField(row, candidates) {
  for (const candidate of candidates) {
    const key = normalizeKey(candidate);
    if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
  }

  const rowKeys = Object.keys(row);
  for (const candidate of candidates) {
    const key = normalizeKey(candidate);
    const found = rowKeys.find((rowKey) => rowKey.includes(key) || key.includes(rowKey));
    if (found) return row[found];
  }

  return "";
}

function looksLikeListaChasis(rows) {
  return rows.some((row) => {
    const keys = row.map(normalizeKey);
    return keys.some((key) => key === "vin") && keys.some((key) => key.includes("serie_grua"));
  });
}

function parseListaChasisRows(rows) {
  const headerIndex = rows.findIndex((row) => {
    const keys = row.map(normalizeKey);
    return keys.some((key) => key === "vin") && keys.some((key) => key.includes("division"));
  });
  if (headerIndex < 0) return [];

  const header = rows[headerIndex].map(normalizeKey);
  const vinCol = findHeaderColumn(header, ["vin"]);
  const serieGruaCol = findHeaderColumn(header, ["n_serie_grua", "serie_grua"]);
  const divisionCol = findHeaderColumn(header, ["division_r", "division"]);
  const consecutivoCol = findHeaderColumn(header, ["n_consecutivos", "consecutivos", "consecutivo"]);

  return rows.slice(headerIndex + 1).map((row, index) => {
    const controlCol = row.findIndex((cell) => isEquipmentCode(cell));
    if (controlCol < 0) return null;
    const control = row[controlCol];
    return {
      id: control,
      control,
      vin: row[vinCol] || row[controlCol + 1] || "",
      serie_grua: row[serieGruaCol] || "",
      division: row[divisionCol] || "",
      consecutivo: row[consecutivoCol] || "",
      modelo: "2024",
      plazo: "",
      entrega: "",
      rawStatus: "",
      updatedAt: new Date().toISOString(),
    };
  }).filter(Boolean);
}

function parseMcMaterialesRows(rows) {
  const headerIndex = rows.findIndex((row) => {
    const keys = row.map(normalizeKey);
    return keys.includes("ensamble") && keys.some((key) => key.includes("descripcion")) && keys.includes("cantidad");
  });
  if (headerIndex < 0) return [];

  const processRow = rows.find((row) => normalizeKey(row[0]) === "proceso");
  const proceso = processRow?.find((cell, index) => index > 0 && cell) || "Materiales";
  const materials = [];
  let currentAssembly = "";

  rows.slice(headerIndex + 2).forEach((row, index) => {
    if (row[0]) currentAssembly = row[0];
    const codeOrDescription = row[1] || "";
    const hasQuantities = [2, 4, 5, 6, 9, 12, 15, 18, 19].some((col) => toNumber(row[col]) > 0);
    if (!codeOrDescription && !currentAssembly && !hasQuantities) return;
    if (normalizeText(codeOrDescription).includes("descripcion") || normalizeText(codeOrDescription).includes("almacen")) return;

    const requerido = toNumber(row[5]) || toNumber(row[4]) || toNumber(row[2]);
    const entregado = toNumber(row[18]) || toNumber(row[12]);
    const pendiente = toNumber(row[19]) || Math.max(requerido - entregado, 0);
    const descripcion = [currentAssembly, codeOrDescription].filter(Boolean).join(" / ");

    if (!descripcion || (!hasQuantities && !codeOrDescription)) return;
    materials.push({
      id: `MAT-${String(materials.length + 1).padStart(3, "0")}`,
      descripcion,
      codigo: codeOrDescription,
      proceso,
      requerido,
      stock: toNumber(row[6]),
      inventario: toNumber(row[15]) || toNumber(row[9]),
      requisicion: row[17] || row[11] || "",
      orden_compra: row[16] || row[10] || "",
      entregado,
      pendiente,
    });
  });

  return materials;
}

function parseMcProcessRows(rows, process) {
  const progress = {};
  const activities = {};
  const activityDefinitions = [];
  const delivered = {};
  if (!process || !rows.length) return { progress, activities, activityDefinitions, delivered };

  const firstDataIndex = findProcessDataStartIndex(rows);
  if (firstDataIndex < 0) return { progress, activities, activityDefinitions, delivered };

  const headerIndex = findActivityHeaderIndex(rows, firstDataIndex);
  const headerRow = rows[headerIndex] || [];
  const groupRow = rows[Math.max(0, headerIndex - 1)] || [];
  const dataRows = rows.slice(firstDataIndex).filter((row) => findEquipmentColumn(row) >= 0);
  const activityStart = findActivityStartColumn(headerRow, dataRows);
  const deliveredColumn = findDeliveredColumn(headerRow, groupRow);
  const activityColumns = [];
  const maxColumns = Math.max(headerRow.length, groupRow.length, ...dataRows.map((row) => row.length));

  for (let col = activityStart; col < maxColumns; col += 1) {
    if (col === deliveredColumn) continue;
    const label = headerRow[col] || groupRow[col] || "";
    const hasActivityValue = dataRows.some((row) => isActivityCellValue(row[col]));
    if (isActivityHeaderLabel(label) || hasActivityValue) {
      activityColumns.push({ col, label: label || `Actividad ${activityColumns.length + 1}` });
    }
  }

  const scopedActivityColumns = getProcessActivityColumns(process.id, activityColumns);
  const timeRow = findProcessTimeRow(rows.slice(0, firstDataIndex), scopedActivityColumns);

  scopedActivityColumns.forEach(({ col, label }, index) => {
    const driveMinutes = parseDriveDurationMinutes(timeRow[col]);
    activityDefinitions.push({
      id: `${process.id}-${index + 1}`,
      name: label,
      subprocess: groupRow[col] || process.name,
      minutes: getValidatedActivityMinutes(process.id, label, driveMinutes, index),
    });
  });

  dataRows.forEach((row) => {
    const equipoCol = findEquipmentColumn(row);
    const equipoId = row[equipoCol];
    if (!isEquipmentCode(equipoId)) return;
    if (deliveredColumn >= 0) delivered[equipoId] = isDeliveredCheckValue(row[deliveredColumn]);

    let done = 0;
    let corrections = 0;
    const rowActivities = scopedActivityColumns.map(({ col, label }, index) => {
      const stateName = activityState(row[col]);
      if (stateName === "hecho") done += 1;
      if (stateName === "correccion") corrections += 1;
      return {
        id: `${process.id}-${index + 1}`,
        name: label,
        subprocess: groupRow[col] || process.name,
        state: stateName,
        minutes: activityDefinitions[index]?.minutes,
      };
    });

    progress[equipoId] = progress[equipoId] || {};
    progress[equipoId][process.id] = {
      done,
      total: scopedActivityColumns.length || process.activities,
      corrections,
      updatedAt: new Date().toISOString(),
    };
    activities[`${equipoId}:${process.id}`] = rowActivities;
  });

  return { progress, activities, activityDefinitions, delivered };
}

function findProcessDataStartIndex(rows) {
  for (let index = 0; index < rows.length; index += 1) {
    if (findEquipmentColumn(rows[index]) < 0) continue;
    const nearbyEquipmentRows = rows
      .slice(index, index + 4)
      .filter((row) => findEquipmentColumn(row) >= 0).length;
    if (nearbyEquipmentRows >= 2) return index;
  }
  return rows.findIndex((row) => findEquipmentColumn(row) >= 0);
}

function getProcessActivityColumns(processId, columns) {
  if (processId === "acabado_inicial") return columns.slice(0, 35);
  if (processId === "pintura_detalles") return columns.slice(35, 47);
  if (processId === "acabado_final") return columns.slice(47, 63);
  return columns;
}

function findProcessTimeRow(candidateRows, activityColumns) {
  let best = { row: [], score: 0 };
  candidateRows.forEach((row) => {
    const named = row.some((value) => normalizeKey(value).includes("tiempo_por_ensamble"));
    const durations = activityColumns.reduce((count, { col }) => (
      Number.isFinite(parseDriveDurationMinutes(row[col])) ? count + 1 : count
    ), 0);
    const score = durations + (named ? activityColumns.length + 1 : 0);
    if (score > best.score) best = { row, score };
  });
  return best.row;
}

function findDeliveredColumn(...headerRows) {
  const maxColumns = Math.max(...headerRows.map((row) => row.length), 0);
  for (let col = 0; col < maxColumns; col += 1) {
    const key = normalizeKey(headerRows.map((row) => row[col]).filter(Boolean).join(" "));
    if (
      key === "entregado" ||
      key === "entregada" ||
      key.includes("entregado") ||
      key.includes("entregada") ||
      key.includes("check_entreg") ||
      key.includes("unidad_entreg") ||
      key.includes("equipo_entreg")
    ) {
      return col;
    }
  }
  return -1;
}

function findHeaderColumn(header, candidates) {
  for (const candidate of candidates) {
    const index = header.findIndex((key) => key === candidate || key.includes(candidate) || candidate.includes(key));
    if (index >= 0) return index;
  }
  return -1;
}

function findEquipmentColumn(row) {
  return row.findIndex((cell) => isEquipmentCode(cell));
}

function isEquipmentCode(value) {
  return /^150-\d{3,}$/.test(String(value || "").trim());
}

function findActivityHeaderIndex(rows, firstDataIndex) {
  let best = { index: Math.max(0, firstDataIndex - 3), score: -1 };
  rows.slice(0, firstDataIndex).forEach((row, index) => {
    const score = row.reduce((sum, cell) => sum + (isActivityHeaderLabel(cell) ? 1 : 0), 0);
    if (score > best.score) best = { index, score };
  });
  return best.index;
}

function findActivityStartColumn(headerRow, dataRows) {
  const maxColumns = Math.max(headerRow.length, ...dataRows.map((row) => row.length));
  for (let col = 0; col < maxColumns; col += 1) {
    if (!isActivityHeaderLabel(headerRow[col])) continue;
    const sampleValues = dataRows.slice(0, 20).map((row) => row[col]);
    if (sampleValues.some(isActivityCellValue)) return col;
  }
  return 6;
}

function isActivityHeaderLabel(value) {
  const raw = String(value || "").trim();
  if (/^#?ref!?$/i.test(raw) || raw.includes("%")) return false;
  if (/^\d+([.,:]\d+)*$/.test(raw)) return false;
  const text = normalizeText(value);
  if (!text || text.length < 3) return false;
  if (text.includes("consecutivo")) return false;
  if (/^\d+([\.:]\d+)*$/.test(text) || text.includes("0:")) return false;
  const exactBlocked = [
    "almacen", "avance", "cantidad", "chasis", "consecutivo", "control", "division",
    "entrega", "entregado", "entregada", "estatus", "estado", "fecha", "hecho", "marca", "modelo", "notas", "orden", "pendiente",
    "serie", "sin hacer", "tiempo", "total", "unidad", "vin",
  ];
  const partialBlocked = ["corregir", "rectificar"];
  if (exactBlocked.includes(text)) return false;
  return !partialBlocked.some((term) => text.includes(term));
}

function isActivityCellValue(value) {
  const text = normalizeText(value).replace(",", ".");
  if (!text) return false;
  if (["0", "0.0", "1", "1.0", "c", "x", "ok", "si", "no"].includes(text)) return true;
  const number = Number(text.replace("%", ""));
  return !Number.isNaN(number) && number >= 0 && number <= 1;
}

function processHeaderCandidates(process) {
  const base = [process.id, process.name, process.sheet];
  if (process.id === "estructurales") base.push("estructural");
  if (process.id === "hidraulico") base.push("hidraulico inferior", "hidraulica");
  if (process.id === "electrico") base.push("electrico", "electricos", "electricidad");
  if (process.id === "pedestal") base.push("pedest tornam", "pedestal tornamesa", "tornamesa");
  if (process.id === "brazos") base.push("brz sis nivel", "brazos sistema nivelacion");
  if (process.id === "acabado_inicial") base.push("acabado inicial");
  if (process.id === "pintura_detalles") base.push("pintura detalles");
  if (process.id === "acabado_final") base.push("acabado final");
  if (process.id === "calidad_final") base.push("calidad finales", "pruebas finales", "pruebas calidad finales", "pruebas calidad/finales");
  if (process.id === "pruebas_iniciales") base.push("pruebas iniciales");
  return base;
}

function isMetaKey(key) {
  const meta = [
    "id", "id_equipo", "equipo", "numero", "no", "num", "control", "numero_control", "no_control",
    "almacen", "vin", "division", "entrega", "estatus", "estado", "fecha", "observaciones",
    "serie", "serie_grua", "consecutivo", "modelo", "plazo", "entregado", "entregada",
  ];
  return meta.includes(key);
}

function activityState(value) {
  const text = normalizeText(value);
  if (!text || text === "0" || text === "no" || text === "pendiente" || text === "p") return "pendiente";
  if (text === "1" || text === "x" || text === "ok" || text === "si" || text.includes("hecho") || text.includes("termin")) return "hecho";
  if (text === "c" || text.includes("corr") || text.includes("rech") || text.includes("detalle")) return "correccion";
  const numeric = Number(text.replace("%", ""));
  if (!Number.isNaN(numeric) && numeric > 0) return "hecho";
  return "pendiente";
}

function decodeActivityState(value) {
  if (value === "H") return "hecho";
  if (value === "C") return "correccion";
  return "pendiente";
}

function parseProgressValue(value) {
  const text = String(value || "").trim().replace("%", "").replace(",", ".");
  if (!text) return Number.NaN;
  if (activityState(text) === "hecho" && Number.isNaN(Number(text))) return 100;
  const number = Number(text);
  if (Number.isNaN(number)) return Number.NaN;
  return number <= 1 ? number * 100 : number;
}

function toNumber(value) {
  const number = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isNaN(number) ? 0 : number;
}

function parseHoursMinutesInput(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;

  const normalized = text.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const [hoursText, minutesText = ""] = normalized.split(".");
  const hours = Number(hoursText);
  const minutes = minutesText ? Number(minutesText) : 0;

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes > 59) return null;
  return (hours * 60) + minutes;
}

function mergeProgress(target, source) {
  Object.entries(source).forEach(([equipoId, processes]) => {
    target[equipoId] = target[equipoId] || {};
    Object.entries(processes).forEach(([processId, item]) => {
      target[equipoId][processId] = item;
    });
  });
}

function normalizeGoogleCsvUrl(inputUrl) {
  const url = String(inputUrl || "").trim();
  if (!url) return url;
  if (!url.includes("docs.google.com/spreadsheets")) return url;
  if (url.includes("/gviz/tq")) return url;
  const gidMatch = url.match(/[?#&]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : "0";

  const publishedMatch = url.match(/\/spreadsheets\/d\/e\/([^/]+)/);
  if (publishedMatch) {
    if (/[?&]output=csv\b/.test(url)) return url;
    return `https://docs.google.com/spreadsheets/d/e/${publishedMatch[1]}/pub?gid=${gid}&single=true&output=csv`;
  }

  const match = url.match(/\/spreadsheets\/d\/([^/]+)/);
  if (!match) return url;
  return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;
}

function sheetCsvUrl(inputUrl, sheetName) {
  const url = String(inputUrl || "").trim();
  const encodedSheet = encodeURIComponent(sheetName);
  if (!url.includes("docs.google.com/spreadsheets")) return url;

  const publishedMatch = url.match(/\/spreadsheets\/d\/e\/([^/]+)/);
  if (publishedMatch) {
    return `https://docs.google.com/spreadsheets/d/e/${publishedMatch[1]}/pub?single=true&output=csv&sheet=${encodedSheet}`;
  }

  const match = url.match(/\/spreadsheets\/d\/([^/]+)/);
  if (match) {
    return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv&sheet=${encodedSheet}`;
  }

  return url;
}

function isUsableSourceUrl(inputUrl) {
  const url = String(inputUrl || "").trim();
  if (!url) return false;
  if (url.endsWith("...") || url.includes("docs.google.com/spreadsheets/...")) return false;
  if (!/^https?:\/\//i.test(url) && !/^data\//i.test(url)) return false;
  return true;
}

function isGoogleSheetsUrl(inputUrl) {
  return String(inputUrl || "").includes("docs.google.com/spreadsheets");
}

function isFileProtocolWithGoogleSources(config) {
  if (window.location.protocol !== "file:") return false;
  const urls = [
    config.workbook,
    ...SOURCE_FIELDS.map((field) => config[field.key]),
    ...PROCESS_DEFS.map((process) => config.processSheets?.[process.id]),
  ];
  return urls.some((url) => isUsableSourceUrl(url) && isGoogleSheetsUrl(url));
}

function isPublishedGoogleSheetsUrl(inputUrl) {
  return /docs\.google\.com\/spreadsheets\/d\/e\//.test(String(inputUrl || ""));
}

function googleSheetsGvizUrl(inputUrl) {
  const url = String(inputUrl || "").trim();
  const gidMatch = url.match(/[?#&]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : "0";
  const publishedMatch = url.match(/\/spreadsheets\/d\/e\/([^/]+)/);
  if (publishedMatch) {
    return `https://docs.google.com/spreadsheets/d/e/${publishedMatch[1]}/gviz/tq?gid=${gid}&tqx=out:json`;
  }
  const match = url.match(/\/spreadsheets\/d\/([^/]+)/);
  if (!match) return "";
  return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?gid=${gid}&tqx=out:json`;
}

function fetchGoogleSheetCsvViaJsonp(inputUrl) {
  const url = googleSheetsGvizUrl(inputUrl);
  if (!url || typeof document === "undefined" || !document.createElement) return Promise.reject(new Error("No se pudo preparar Google Sheets."));

  return new Promise((resolve, reject) => {
    const previousGoogle = window.google;
    const previousSetResponse = window.google?.visualization?.Query?.setResponse;
    const script = document.createElement("script");
    const cleanup = () => {
      script.remove();
      if (previousGoogle) {
        window.google = previousGoogle;
        if (previousSetResponse) window.google.visualization.Query.setResponse = previousSetResponse;
      }
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Tiempo agotado al leer Google Sheets."));
    }, 15000);

    window.google = window.google || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};
    window.google.visualization.Query.setResponse = (response) => {
      window.clearTimeout(timer);
      cleanup();
      if (response?.status === "error") {
        reject(new Error(response.errors?.[0]?.detailed_message || "Google Sheets regreso un error."));
        return;
      }
      resolve(gvizResponseToCsv(response));
    };

    script.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      reject(new Error("No se pudo cargar Google Sheets publicado."));
    };
    script.src = url;
    document.head.appendChild(script);
  });
}

function gvizResponseToCsv(response) {
  const table = response?.table;
  if (!table?.cols?.length) return "";
  const headers = table.cols.map((column, index) => column.label || column.id || `Columna ${index + 1}`);
  const rows = (table.rows || []).map((row) => (row.c || []).map((cell) => cell?.f ?? cell?.v ?? ""));
  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizeKey(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function denormalizeHeader(key) {
  return key
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function uniqueId(id, index) {
  const clean = String(id || "").trim();
  return clean || `EQ-${index + 1}`;
}

function createEmptyConfig() {
  return {
    autoRefreshMinutes: DEFAULT_AUTO_REFRESH_MINUTES,
    workbook: "",
    equipos: "",
    avance: "",
    planning: "",
    materiales: "",
    finanzas: "",
    processSheets: PROCESS_DEFS.reduce((acc, process) => {
      acc[process.id] = "";
      return acc;
    }, {}),
  };
}

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return { ...createEmptyConfig(), ...(saved || {}), processSheets: { ...createEmptyConfig().processSheets, ...(saved?.processSheets || {}) } };
  } catch {
    return createEmptyConfig();
  }
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function openDataCacheDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB no disponible"));
      return;
    }

    const request = indexedDB.open(DATA_CACHE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(DATA_CACHE_STORE)) {
        database.createObjectStore(DATA_CACHE_STORE, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("No se pudo abrir la cache"));
    request.onblocked = () => reject(new Error("La cache esta bloqueada por otra pestaña"));
  });
}

async function loadCachedDataset() {
  try {
    const database = await openDataCacheDatabase();
    const record = await new Promise((resolve, reject) => {
      const transaction = database.transaction(DATA_CACHE_STORE, "readonly");
      const request = transaction.objectStore(DATA_CACHE_STORE).get(DATA_CACHE_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("No se pudo leer la cache"));
    });
    database.close();
    return record;
  } catch {
    return null;
  }
}

function getSourceConfigSignature(config) {
  return JSON.stringify({
    workbook: String(config?.workbook || "").trim(),
    equipos: String(config?.equipos || "").trim(),
    avance: String(config?.avance || "").trim(),
    materiales: String(config?.materiales || "").trim(),
    finanzas: String(config?.finanzas || "").trim(),
    processSheets: PROCESS_DEFS.map((process) => [
      process.id,
      String(config?.processSheets?.[process.id] || "").trim(),
    ]),
  });
}

function isCachedDatasetFresh(record, minutes, config) {
  const savedAt = Date.parse(record?.savedAt || "");
  if (!Number.isFinite(savedAt)) return false;
  if (record?.sourceSignature !== getSourceConfigSignature(config)) return false;
  const maxAge = Math.max(1, Number(minutes) || DEFAULT_AUTO_REFRESH_MINUTES) * 60 * 1000;
  return Date.now() - savedAt < maxAge;
}

async function saveCachedDataset(data, config) {
  try {
    const database = await openDataCacheDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(DATA_CACHE_STORE, "readwrite");
      transaction.objectStore(DATA_CACHE_STORE).put({
        key: DATA_CACHE_KEY,
        savedAt: new Date().toISOString(),
        sourceSignature: getSourceConfigSignature(config),
        data,
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("No se pudo guardar la cache"));
      transaction.onabort = () => reject(transaction.error || new Error("Se cancelo el guardado de la cache"));
    });
    database.close();
  } catch {
    // El tablero puede seguir funcionando sin cache si el navegador la restringe.
  }
}

async function clearCachedDataset() {
  try {
    const database = await openDataCacheDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(DATA_CACHE_STORE, "readwrite");
      transaction.objectStore(DATA_CACHE_STORE).delete(DATA_CACHE_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("No se pudo limpiar la cache"));
      transaction.onabort = () => reject(transaction.error || new Error("Se cancelo la limpieza de la cache"));
    });
    database.close();
  } catch {
    // No bloquea el borrado del resto de los datos locales.
  }
}

function readConfigFromDom() {
  const config = createEmptyConfig();
  const workbookInput = document.querySelector("[data-workbook-source]");
  config.workbook = workbookInput?.value.trim() || "";
  document.querySelectorAll("[data-source-key]").forEach((input) => {
    config[input.dataset.sourceKey] = input.value.trim();
  });
  document.querySelectorAll("[data-process-source]").forEach((input) => {
    config.processSheets[input.dataset.processSource] = input.value.trim();
  });
  return config;
}

function applyBulkSourcesToConfig(config, text) {
  const entries = parseBulkSourceEntries(text);
  entries.forEach((entry) => {
    const target = detectSourceTarget(entry.label || entry.url);
    if (!target) {
      config.workbook = entry.url;
      return;
    }
    if (target === "workbook") {
      config.workbook = entry.url;
      return;
    }
    if (target.startsWith("process:")) {
      config.processSheets[target.split(":")[1]] = entry.url;
    } else {
      config[target] = entry.url;
    }
  });
}

function parseBulkSourceEntries(text) {
  const entries = [];
  const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  lines.forEach((line) => {
    const urls = line.match(/https?:\/\/\S+/g) || [];
    if (!urls.length) return;
    const label = line.slice(0, line.indexOf(urls[0])).replace(/[:=-]+$/g, "").trim();
    urls.forEach((url) => entries.push({ label, url: url.replace(/[),.;]+$/g, "") }));
  });
  if (!entries.length) {
    const urls = String(text || "").match(/https?:\/\/\S+/g) || [];
    urls.forEach((url) => entries.push({ label: "", url: url.replace(/[),.;]+$/g, "") }));
  }
  return entries;
}

function detectSourceTarget(text) {
  const key = normalizeKey(text);
  if (!key) return "";
  if (key.includes("avance_de_ensamble") || key.includes("archivo_completo") || key.includes("libro_completo")) return "workbook";
  if (key.includes("finanza") || key.includes("copia_de_hoja_1") || key.includes("estatus")) return "finanzas";
  if (key.includes("planeacion") || key.includes("fecha_limite")) return "planning";
  if (key.includes("material")) return "materiales";
  if (key.includes("avance_general") || key.includes("por_unidad") || key.includes("unidad")) return "avance";
  if (key.includes("chasis") || key.includes("lista_equipo") || key.includes("equipo")) return "equipos";
  const process = PROCESS_DEFS.find((item) => {
    const processKeys = [item.id, item.name, item.sheet].map(normalizeKey);
    return processKeys.some((processKey) => key.includes(processKey) || processKey.includes(key));
  });
  return process ? `process:${process.id}` : "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

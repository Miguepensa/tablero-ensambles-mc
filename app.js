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
  { id: "equipos", label: "Equipos", icon: "E" },
  { id: "detalle", label: "Detalle", icon: "U" },
  { id: "captura", label: "Captura", icon: "C" },
  { id: "materiales", label: "Materiales", icon: "M" },
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
const PROJECT_TOTAL_AMOUNT = 608197933;
const STORAGE_KEY = "tablero-ensambles-config-v1";
const app = document.getElementById("app");
let autoRefreshTimer = null;

let state = {
  view: "dashboard",
  query: "",
  selectedId: null,
  captureProcess: "estructurales",
  captureStatus: "todos",
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

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  if (action === "view") {
    state.view = target.dataset.view;
    render();
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
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-finance-column]")) {
    updateFinanceVisibleColumns(target.dataset.financeColumn, target.checked);
    render();
  }

  if (target.matches("[data-file-import]")) {
    const file = target.files?.[0];
    const kind = document.querySelector("[data-import-kind]")?.value || "equipos";
    if (file) importCsvFile(file, kind);
    target.value = "";
  }
});

async function bootstrapData() {
  const publicConfig = await loadPublicSourceConfig();
  if (publicConfig) {
    state.config = mergeSourceConfigs(publicConfig, state.config);
  }

  await loadBundledAdvanceData();

  if (hasConfiguredSources(state.config)) {
    await loadDriveData({ keepView: true, mergeWithCurrent: true });
    startAutoRefresh(state.config.autoRefreshMinutes || DEFAULT_AUTO_REFRESH_MINUTES);
    return;
  }
}

async function loadDriveData(options = {}) {
  const { background = false, keepView = false, mergeWithCurrent = true } = options;
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
    ["workbook", "equipos", "avance", "materiales", "finanzas"].forEach((key) => {
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
      loadDriveData({ background: true, keepView: true });
    }
  }, safeMinutes * 60 * 1000);
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
    equipos: "Busqueda por unidad, VIN, division, entrega o estatus.",
    detalle: "Avance por proceso, cobertura de actividades y datos principales de la unidad.",
    captura: "Registro rapido de actividades por proceso para la unidad seleccionada.",
    materiales: "Inventario, requisiciones, entregas, faltantes y cobertura por material.",
    finanzas: `${(state.data.finanzas || []).length} registros financieros vinculados por VIN, almacen y zona. Fuente: ${escapeHtml(state.data.financeSource || "Excel local")}.`,
    config: "URLs CSV publicadas desde Drive y carga manual de archivos CSV.",
  };
  return copy[view] || "";
}

function renderCurrentView() {
  if (state.view === "equipos") return renderEquiposView();
  if (state.view === "detalle") return renderDetalleView();
  if (state.view === "captura") return renderCapturaView();
  if (state.view === "materiales") return renderMaterialesView();
  if (state.view === "finanzas") return renderFinanzasView();
  if (state.view === "config") return renderConfigView();
  return renderDashboardView();
}

function renderDashboardView() {
  const summary = getSummary(state.data);
  const processStats = getProcessStats(state.data);
  const statusStats = getDashboardStatusStats(summary);
  const deliveryStats = getFinishedDeliveryStats(summary);
  const alerts = getAlerts(state.data).slice(0, 6);

  return `
    <div class="grid metrics">
      ${renderMetric("Unidades", summary.fixedTotal, "", "en-proceso")}
      ${renderMetric("Terminadas", summary.finished, "", "terminado")}
      ${renderMetric("En proceso", summary.inProgress, "", "en-proceso")}
      ${renderMetric("Por hacer", summary.pending, "", "pendiente")}
      ${renderMetric("Detenidas", summary.stopped, "", "detenido")}
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

      <section class="panel alert-panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Alertas</p>
            <h2 class="panel-title">Puntos de atencion</h2>
          </div>
          <span class="badge">${summary.alerts}</span>
        </div>
        <div class="alert-list">
          ${alerts.length ? alerts.map(renderAlert).join("") : `<div class="empty-state">Sin alertas abiertas.</div>`}
        </div>
      </section>
    </div>
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
    materiales: [],
    finanzas: [],
    financeColumns: [],
    activities: {},
    activityDefinitions: {},
    activityStates: {},
    deliveredChecks: {},
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
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status} en ${url}`);
    return await response.text();
  } catch (error) {
    if (isGoogleSheetsUrl(inputUrl)) return fetchGoogleSheetCsvViaJsonp(inputUrl);
    throw error;
  }
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
  if (dataStart < 0) return { equipos: [], progress: {} };
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

  return { equipos, progress };
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
  data.materiales = data.materiales || [];
  data.finanzas = data.finanzas || [];
  data.financeColumns = data.financeColumns || [];
  data.activities = data.activities || {};
  data.activityDefinitions = data.activityDefinitions || {};
  data.activityStates = data.activityStates || {};
  data.deliveredChecks = data.deliveredChecks || {};

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

  const fixedTotal = Number(data.meta?.equipos) || equipos.length || 170;
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

function renderProcessBarRow(process) {
  return `
    <div class="bar-row process-bar-row">
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
  const delivered = {};
  if (!process || !rows.length) return { progress, activities, delivered };

  const firstDataIndex = rows.findIndex((row) => findEquipmentColumn(row) >= 0);
  if (firstDataIndex < 0) return { progress, activities, delivered };

  const headerIndex = findActivityHeaderIndex(rows, firstDataIndex);
  const headerRow = rows[headerIndex] || [];
  const groupRow = rows[Math.max(0, headerIndex - 1)] || [];
  const dataRows = rows.slice(firstDataIndex).filter((row) => findEquipmentColumn(row) >= 0);
  const activityStart = findActivityStartColumn(headerRow, dataRows);
  const deliveredColumn = findDeliveredColumn(headerRow, groupRow);
  const activityColumns = [];
  const maxColumns = Math.max(headerRow.length, groupRow.length, ...dataRows.map((row) => row.length));

  for (let col = activityStart; col < maxColumns; col += 1) {
    const label = headerRow[col] || groupRow[col] || "";
    const hasActivityValue = dataRows.some((row) => isActivityCellValue(row[col]));
    if (isActivityHeaderLabel(label) || hasActivityValue) {
      activityColumns.push({ col, label: label || `Actividad ${activityColumns.length + 1}` });
    }
  }

  dataRows.forEach((row) => {
    const equipoCol = findEquipmentColumn(row);
    const equipoId = row[equipoCol];
    if (!isEquipmentCode(equipoId)) return;
    if (deliveredColumn >= 0) delivered[equipoId] = isDeliveredCheckValue(row[deliveredColumn]);

    let done = 0;
    let corrections = 0;
    const rowActivities = activityColumns.map(({ col, label }, index) => {
      const stateName = activityState(row[col]);
      if (stateName === "hecho") done += 1;
      if (stateName === "correccion") corrections += 1;
      return {
        id: `${process.id}-${index + 1}`,
        name: label,
        subprocess: process.name,
        state: stateName,
        minutes: 15 + (index % 7) * 5,
      };
    });

    progress[equipoId] = progress[equipoId] || {};
    progress[equipoId][process.id] = {
      done,
      total: activityColumns.length || process.activities,
      corrections,
      updatedAt: new Date().toISOString(),
    };
    activities[`${equipoId}:${process.id}`] = rowActivities;
  });

  return { progress, activities, delivered };
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

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const noop = () => {};
const storage = new Map();
const context = vm.createContext({
  console, URL, AbortSignal, crypto: require('node:crypto').webcrypto,
  setTimeout, clearTimeout, setInterval: noop, clearInterval: noop,
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  document: { getElementById: () => ({ addEventListener: noop }), querySelectorAll: () => [], querySelector: () => null, addEventListener: noop },
  window: { location: { protocol: 'http:' }, setTimeout: noop, clearTimeout: noop, addEventListener: noop },
});
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace('render();\nbootstrapData();\nscheduleDailyCutoff();', '');
vm.runInContext(source, context);
const run = code => vm.runInContext(code, context);
const json = code => JSON.parse(run('JSON.stringify(' + code + ')'));

(async () => {
  run(`initialBalances = { estructurales: { minutes: 9610, workdays: 8 } };
    state.data.planning = [{processId:'estructurales',active:true,startDate:'2026-10-03',deadline:'2026-10-10',workers:6,hoursPerDay:10,calendar:'LUN-DOM',manualPendingMinutes:999999}];
    var hours = [{id:'estructurales',pendingMinutes:8000}];`);
  let plan = json('getDashboardPlanningStats(hours)[0]');
  assert.equal(plan.planningPendingMinutes, 9610);
  assert.equal(plan.requiredDailyMinutes, 9610 / 8);
  run(`hours[0].pendingMinutes = 7000; state.data.planning[0].manualPendingMinutes = 0; state.data.planning[0].deadline = '2026-10-30';`);
  plan = json('getDashboardPlanningStats(hours)[0]');
  assert.equal(plan.planningPendingMinutes, 9610);
  assert.equal(plan.requiredDailyMinutes, 9610 / 8);
  assert.equal(plan.progressSinceBaselineMinutes, 2610);
  run('initialBalances = {}');
  plan = json('getDashboardPlanningStats(hours)[0]');
  assert.equal(plan.planningPendingMinutes, null);
  assert.equal(plan.requiredDailyMinutes, null);
  assert.equal(plan.operationalCompliance, null);
  assert.equal(plan.status, 'missing');

  // Duplicate warehouse/VIN must not overwrite each other's progress.
  run(String.raw`var rows = nonEmptyCsvRows('\n171,150-512,3HAEUMMR7VL306693,8,CENTRO SUR\n\n171,150-512,3HAEUMMR7VL306693,8,BAJA CALIFORNIA');
    var parsed = parseMcAvanceRows(rows);`);
  const units = json('parsed.equipos');
  assert.equal(units.length, 2);
  assert.equal(units[0].sourceRow, 2);
  assert.equal(units[1].sourceRow, 4);
  assert.notEqual(units[0].id, units[1].id);
  assert.equal(units[0].damaged, true);
  assert.equal(units[1].damaged, false);
  assert.equal(json('Object.keys(parsed.progress)').length, 2);
  run(`rows[0][4]='BAJA CALIFORNIA'`);
  assert.notEqual(run('equipmentRowId(rows[0], "150-512", rows)'), run('equipmentRowId(rows[1], "150-512", rows)'));
  run(`var summaryData = normalizeDataset({...createEmptyDataset(),equipos:parsed.equipos,progress:parsed.progress});`);
  const summary = json('getSummary(summaryData)');
  assert.equal(summary.total, 2);
  assert.equal(summary.damaged, 1);
  assert.equal(summary.finished + summary.inProgress + summary.stopped + summary.pending + summary.damaged, summary.total);

  assert.match(run('googleSheetsGvizUrl("https://docs.google.com/spreadsheets/d/e/example/pub?sheet=PLANEACION_ENSAMBLES")'), /sheet=PLANEACION_ENSAMBLES/);
  assert.match(run('googleSheetsGvizUrl("https://docs.google.com/spreadsheets/d/e/example/pub?gid=42")'), /gid=42/);
  const cell = run(`renderDailyProductionDay(parseIsoLocalDate('2026-10-07'),'2026-10-07',{'2026-10-07':{startPendingMinutes:300,latestPendingMinutes:150}},100)`);
  assert.match(cell, /150%/);
  assert.match(cell, /2 h 30 min/);
  const unknownCell = run(`renderDailyProductionDay(parseIsoLocalDate('2026-10-07'),'2026-10-07',{'2026-10-07':{startPendingMinutes:null,latestPendingMinutes:150}},100)`);
  assert.match(unknownCell, /Sin dato/);
  assert.doesNotMatch(unknownCell, /class="daily-production-day red/);

  context.recoveredFixture = JSON.parse(fs.readFileSync(path.join(root, 'data/recovered-daily-history.json'), 'utf8'));
  const restoredBaseline = JSON.parse(fs.readFileSync(path.join(root, 'data/initial-balances.json'), 'utf8'));
  assert.equal(Object.keys(restoredBaseline.processes).length, 11);
  for (const [id, baseline] of Object.entries(restoredBaseline.processes)) {
    assert.equal(baseline.minutes, context.recoveredFixture.processes[id]['2026-10-02'].startPendingMinutes);
    assert.ok(Number.isFinite(baseline.minutes));
  }
  run('recoveredDailyHistory = recoveredFixture');
  const history = json('loadDailyProductionHistory()');
  assert.equal(history.processes.estructurales['2026-10-03'].dailyValid, true);
  assert.equal(history.processes.estructurales['2026-10-04'].dateValid, false);
  assert.equal(history.processes.estructurales['2026-10-04'].dailyValid, false);
  assert.equal(history.processes.estructurales['2026-10-07'].dailyValid, false);
  assert.equal(history.processes.calidad_final['2026-10-07'].latestPendingMinutes, 26975);
  assert.match(run('renderDailyProductionDay(parseIsoLocalDate("2026-10-04"),"2026-10-07",loadDailyProductionHistory().processes.estructurales,100)'), /Sin dato/);
  assert.equal(run('projectDateKey("2026-10-03T05:03:33.624Z")'), '2026-10-02');
  run(`state.data.planning = [{processId:'estructurales'}]; state.data.equipos = [{id:'test'}];
    getDashboardPlanningStats = () => [{id:'estructurales',planned:true,currentPendingMinutes:8000,planningPendingMinutes:9610}];
    getDashboardAssemblyTimeStats = () => [];
    recordDailyProductionSnapshot('daily-cutoff', '2026-10-04');`);
  const stored = JSON.parse(storage.get('tablero-ensambles-produccion-diaria-v1'));
  const today = run('projectDateKey(new Date())');
  assert.equal(stored.processes.estructurales[today].latestPendingMinutes, 8000);
  if (today !== '2026-10-04') assert.equal(stored.processes.estructurales['2026-10-04'].observedAt, '2026-10-07T14:33:48.807Z');

  // Historical cuts override browser records and count activity transitions, not roster changes.
  context.archiveFixture = JSON.parse(fs.readFileSync(path.join(root, 'data/historical-cuts.json'), 'utf8'));
  run('historicalCuts = archiveFixture');
  const archived = json('loadDailyProductionHistory()');
  assert.equal(archived.processes.electrico['2026-10-03'].productionMinutes, 680);
  assert.equal(archived.processes.electrico['2026-10-05'].productionMinutes, 745);
  assert.equal(archived.processes.estructurales['2026-10-05'].productionMinutes, 0);
  assert.equal(archived.processes.estructurales['2026-10-05'].pendingAdjustmentMinutes, 240);
  assert.equal(archived.processes.talleres['2026-10-06'].productionMinutes, 2045);
  assert.equal(archived.processes.electrico['2026-10-02'].dailyValid, false);
  assert.equal(archived.processes.electrico['2026-10-07'].dailyValid, true);
  assert.equal(archived.processes.electrico['2026-10-07'].productionMinutes, 0);
  assert.equal(archived.processes.pedestal['2026-10-07'].productionMinutes, 1275);
  assert.equal(archived.processes.pedestal['2026-10-07'].excludesDamaged, true);
  assert.match(run('renderDailyProductionDay(parseIsoLocalDate("2026-10-07"),"2026-10-07",loadDailyProductionHistory().processes.electrico,100)'), /Archivo del día/);
  for (const records of Object.values(context.archiveFixture.processes)) {
    for (const [date, record] of Object.entries(records)) {
      if (date === '2026-10-02') continue;
      assert.equal(record.startPendingMinutes - record.productionMinutes + record.pendingAdjustmentMinutes, record.latestPendingMinutes);
      assert.equal(record.reopenedActivities, date === '2026-10-08' && /\((4|5)\)/.test(record.sourceFile) && record.latestPendingMinutes === 6160 ? 36 : 0);
    }
  }
  assert.equal(archived.processes.electrico['2026-10-08'].productionMinutes, 1775);
  assert.equal(archived.processes.estructurales['2026-10-08'].productionMinutes, 360);
  assert.equal(archived.processes.acabado_inicial['2026-10-08'].productionMinutes, 7705);
  assert.equal(archived.processes.electrico['2026-10-08'].partial, true);
  assert.equal(archived.processes.electrico['2026-10-08'].excludesDamaged, true);
  assert.match(run('renderDailyProductionDay(parseIsoLocalDate("2026-10-08"),"2026-10-08",loadDailyProductionHistory().processes.electrico,100)'), /Corte parcial/);
  const archiveCell = run('renderDailyProductionDay(parseIsoLocalDate("2026-10-05"),"2026-10-07",loadDailyProductionHistory().processes.electrico,100)');
  assert.match(archiveCell, /12 h 25 min/);
  assert.match(archiveCell, /Corte 21:35/);
  assert.match(archiveCell, /Entre cortes/);
  assert.match(run('renderDailyProductionDay(parseIsoLocalDate("2026-10-02"),"2026-10-07",loadDailyProductionHistory().processes.electrico,100)'), /Base/);
  storage.set('tablero-ensambles-produccion-diaria-v1', JSON.stringify({processes:{electrico:{'2026-10-03':{observedAt:'2026-10-03T23:59:00-06:00',startPendingMinutes:1,latestPendingMinutes:0}}}}));
  assert.equal(json('loadDailyProductionHistory()').processes.electrico['2026-10-03'].productionMinutes, 680);

  // Failure must preserve the previous complete dataset and must not record a cutoff.
  run(`render = () => {}; recordDailyProductionSnapshot = () => { throw new Error('Should not write a snapshot on failure'); };
    loadPublicSourceConfig = async () => ({avance:'https://example.org/current.csv',processSheets:{}});
    buildDatasetFromConfig = async () => { throw new Error('Hoja de prueba indisponible'); };
    state.data = summaryData; var before = state.data;`);
  await run('loadDriveData({keepView:true})');
  assert.equal(run('state.data === before'), true);
  assert.match(run('state.syncError'), /Hoja de prueba indisponible/);
  assert.equal(run('driveLoadInFlight'), false);
  assert.equal(run('state.loading'), false);
  console.log('PASS: saldo inmutable, meta fija, ausencia de históricos, identidad duplicada, contadores, JSONP, semáforo y fallo de sincronización.');
})().catch(error => { console.error(error); process.exitCode = 1; });

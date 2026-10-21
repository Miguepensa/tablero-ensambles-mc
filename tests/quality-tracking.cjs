const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const noop=()=>{},root=path.resolve(__dirname,'..');
const ctx=vm.createContext({console,URL,AbortSignal,setTimeout,clearTimeout,setInterval:noop,localStorage:{getItem:()=>null,setItem:noop},document:{getElementById:()=>({addEventListener:noop}),querySelectorAll:()=>[],querySelector:()=>null,addEventListener:noop},window:{location:{protocol:'http:'},addEventListener:noop,setTimeout:noop,clearTimeout:noop}});
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8').replace(/\r\n/g,'\n').replace('render();\nbootstrapData();\nscheduleDailyCutoff();',''),ctx);
const run=s=>vm.runInContext(s,ctx),json=s=>JSON.parse(run(`JSON.stringify(${s})`));
run(`var columns=['N°','N° ALMACEN','VIN','% Avance','Estatus','','','División','Actividad','Llenado de documentos prueba externa','ENTREGADO',...QUALITY_TRACKING_FIELDS.map(f=>f.header)];
var fixture=[columns,['001','150-342','VIN1','','','','','Jalisco','1','1','1','TRUE','1','0','1','0','1','0'],['002','150-343','VIN2','','','','','Jalisco','0','0','0','0','x','0','0','1','0','0'],['075','150-416','3HAEUMMR9TL494534','','','','','Jalisco','1','1','1','1','1','1','1','1','1','1'],['171','150-512','3HAEUMMR7VL306693','','','','','CENTRO SUR','1','1','1','1','1','1','1','1','1','1'],['171','150-512','3HAEUMMR7VL306693','','','','','BAJA CALIFORNIA','0','0','0','0','0','0','0','0','0','0']].map(r=>r.join(',')).join('\\n');
var d=createEmptyDataset();d.equipos=[{id:'150-342',control:'150-342'},{id:'150-343',control:'150-343'},{id:'150-416',control:'150-416',vin:'3HAEUMMR9TL494534'},{id:'150-512::siniestrado-centro-sur',control:'150-512'},{id:'150-512',control:'150-512'},{id:'150-513',control:'150-513'}]; applyCsvToDataset(d,'process:calidad_final',fixture);state.data=normalizeDataset(d);`);
assert.equal(run('state.data.activityDefinitions.calidad_final.length'),2,'new checks must not increase production activities');
assert.deepEqual(json("getQualityTrackingSummary('liberacion').items.map(i=>i.count)"),[0,1,1]);
assert.equal(run("getQualityTrackingSummary('liberacion').counts.mexico"),1);
assert.equal(run("getQualityTrackingSummary('liberacion').counts.irapuato"),2);
assert.deepEqual(json("getQualityTrackingSummary('entrega').items.map(i=>i.count)"),[1,1,1,0]);
assert.equal(run("getQualityTrackingSummary('entrega').marked"),2);
assert.equal(run("getQualityTrackingSummary('entrega').missing"),1);
assert.equal(run("getQualityTrackingSummary('liberacion').unmarked"),1);
run("state.trackingFilter='ambas'");
let html=run("renderQualityTrackingView('liberacion')");assert.match(html,/150-342/);assert.doesNotMatch(html,/150-343|tracking-pie|<svg/);
run("state.trackingFilter='curso'");html=run("renderQualityTrackingView('entrega')");assert.match(html,/150-342/);assert.doesNotMatch(html,/150-343|tracking-pie|<svg/);
run("applyCsvToDataset(state.data,'process:calidad_final',fixture.replace('lapem_mexico','Inspección LAPEM México'));state.data=normalizeDataset(state.data)");
assert.equal(run('state.data.activityDefinitions.calidad_final.length'),2,'inspection heading must not add a production activity');
assert.equal(run("getQualityTrackingSummary('liberacion').counts.ambas"),1);
assert.equal(run('getDeliveredCount(state.data)'),1,'delivery stays independent of LAPEM headings');

run("state.data.equipos=Array.from({length:76},(_,i)=>({id:'unit-'+i,control:'unit-'+i}));state.data.qualityTracking={available:['transito','almacen','curso','acuse'],units:Object.fromEntries(state.data.equipos.map((u,i)=>[u.id,{transito:true,almacen:i<6,curso:i===0,acuse:i===0}]))}");
assert.deepEqual(json("getQualityTrackingSummary('entrega').items.map(i=>i.count)"),[70,6,1,1]);
assert.equal(run("state.data.qualityTracking.units['unit-0'].transito"),true,'source check must remain unchanged');
run("state.trackingFilter='transito';state.trackingQuery=''");
assert.equal((run("renderQualityTrackingView('entrega')").match(/data-action="select-equipo"/g)||[]).length,70);
run("state.trackingFilter='almacen'");
assert.equal((run("renderQualityTrackingView('entrega')").match(/data-action="select-equipo"/g)||[]).length,6);
run("state.data.qualityTracking.units['unit-0'].transito=false");
assert.deepEqual(json("getQualityTrackingSummary('entrega').items.map(i=>i.count)"),[70,6,1,1],'warehouse counts with either transit checkbox value');

run("state.data.qualityTracking=null");assert.equal(run("getQualityTrackingSummary('entrega').available"),false);
assert.match(run("renderQualityTrackingView('entrega')"),/todavía no están disponibles/);
console.log('PASS: checks independientes, ambas calculado, siniestradas y VIN duplicado, sin registro, filtros y actividades sin cambios.');


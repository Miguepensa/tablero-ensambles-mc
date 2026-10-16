const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),noop=()=>{};
const ctx=vm.createContext({console,URL,AbortSignal,setTimeout,clearTimeout,setInterval:noop,clearInterval:noop,
 localStorage:{getItem:()=>null,setItem:noop},document:{getElementById:()=>({addEventListener:noop}),querySelectorAll:()=>[],querySelector:()=>null,addEventListener:noop},
 window:{location:{protocol:'http:'},addEventListener:noop,setTimeout:noop,clearTimeout:noop}});
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8').replace(/\r\n/g,'\n').replace('render();\nbootstrapData();\nscheduleDailyCutoff();',''),ctx);
const run=s=>vm.runInContext(s,ctx),json=s=>JSON.parse(run(`JSON.stringify(${s})`));
run(`var fixture=createEmptyDataset(); fixture.equipos=[
 {id:'150-416',control:'150-416',vin:'3HAEUMMR9TL494534'},
 {id:'150-512::siniestrado-centro-sur',control:'150-512',vin:'duplicate'},
 {id:'150-512',control:'150-512',vin:'duplicate'},
 {id:'150-513',control:'150-513',vin:'PENDIENTE'}];
 PROCESS_DEFS.forEach(p=>{fixture.activityDefinitions[p.id]=[{id:p.id+'-1',name:p.id==='calidad_final'?'Llenado de documentos prueba externa':'Actividad',minutes:10}];
   if(p.id==='estructurales')fixture.activityDefinitions[p.id]=STRUCTURAL_ACTIVITY_TIMES.map((d,i)=>({...d,id:p.id+'-'+(i+1)})); fixture.equipos.slice(0,3).forEach(u=>{fixture.activities[u.id+':'+p.id]=fixture.activityDefinitions[p.id].map(d=>({...d,state:'hecho'}));fixture.progress[u.id]||={};fixture.progress[u.id][p.id]={done:fixture.activityDefinitions[p.id].length,total:fixture.activityDefinitions[p.id].length,corrections:0};});});
 fixture.qualityDeliveredChecks={'150-416':true,'150-512::siniestrado-centro-sur':true,'150-512':true};
 fixture.deliveredChecks={...fixture.qualityDeliveredChecks};
 fixture.finanzas=[{equipoId:'150-416',fields:{entregado:1}}];
 state.data=normalizeDataset(fixture);`);
assert.deepEqual(json('state.data.equipos.map(u=>u.id)'),['150-512','150-513']);
assert.deepEqual(json('state.data.excludedEquipos.map(u=>u.id)'),['150-416','150-512::siniestrado-centro-sur']);
const s=json('getSummary(state.data)');
assert.equal(s.total,4);assert.equal(s.finished,1);assert.equal(s.pending,1);assert.equal(s.damaged,2);assert.equal(s.delivered,1);
assert.deepEqual(json('state.data.qualityMilestones'),{released:1,delivered:1});
assert.equal(run('state.data.equipos[1].missingProcessRows.length'),11);
assert.ok(json('getProcessStats(state.data)').every(p=>p.done>0&&p.total===2*p.done));
assert.ok(json('getDashboardAssemblyTimeStats()').every(p=>p.pendingMinutes===p.minutesPerUnit));
assert.equal(run('getDivisionCompletionStats().reduce((n,d)=>n+d.total,0)'),2);
assert.equal(run('buildGeneralPendingActivitiesReport().units'),2);
assert.ok(json('buildGeneralPendingActivitiesReport().groups').every(g=>g.pendingUnits.length===1&&g.pendingUnits[0].control==='150-513'));
run('state.data=normalizeDataset(state.data)');
assert.equal(run('state.data.equipos.length'),2);assert.equal(run('state.data.excludedEquipos.length'),2);
// Once a real process row exists, it must replace the inferred pending activities.
run(`state.data.activities['150-513:electrico']=[{id:'electrico-1',name:'Actividad',minutes:10,state:'hecho'}];state.data.progress['150-513'].electrico={done:1,total:1,corrections:0};state.data=normalizeDataset(state.data);`);
assert.equal(run("state.data.progress['150-513'].electrico.done"),1);
assert.equal(run("state.data.equipos.find(u=>u.id==='150-513').missingProcessRows.includes('electrico')"),false);
console.log('PASS: exclusión por identidad, reemplazo sin iniciar, horas, calidad, entregas, divisiones, reportes e importación posterior.');

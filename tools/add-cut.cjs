const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const setup=fs.readFileSync('tools/parse-cut.cjs','utf8').split("const kinds=")[0];
// Reuse the dashboard's validated duration rules.
eval(setup.replace('const ctx=', 'globalThis.cutContext=').replace(/\bctx\b/g,'cutContext'));
const [inputFile,cutDate,previousDate]=process.argv.slice(2); const cuts=[[cutDate,cutDate.slice(-2),'12:00:00']];
const result=JSON.parse(fs.readFileSync('data/historical-cuts.json'));
let prev={dataset:JSON.parse(fs.readFileSync('.local/corte-'+previousDate+'/dataset.json')),stats:JSON.parse(fs.readFileSync('.local/corte-'+previousDate+'/comparison.json')),observedAt:previousDate+'T12:00:00-06:00'};
for(const [folder,day,time] of cuts){
 const dir='.local/corte-'+cutDate;
 const dataset=JSON.parse(fs.readFileSync(dir+'/dataset.json'));
 const stats=JSON.parse(fs.readFileSync(dir+'/comparison.json'));
 const filename=require('path').basename(inputFile);
 const date=cutDate,observedAt=date+'T'+time+'-06:00';
 result.sources.push({date,observedAt,filename,sha256:crypto.createHash('sha256').update(fs.readFileSync(inputFile)).digest('hex'),units:dataset.equipos.length});
 cutContext.fixture=dataset;vm.runInContext('state.data=fixture',cutContext);
 for(const stat of stats){
  const id=stat.id;result.processes[id]??={};
  const record={startPendingMinutes:prev?prev.stats.find(x=>x.id===id).minutes:null,latestPendingMinutes:stat.minutes,observedAt,snapshotType:'historical-file',intervalValidated:true,dailyValid:!!prev,sourceFile:filename,periodStart:prev?.observedAt||null,productionMinutes:prev?0:null,completedActivities:0,reopenedActivities:0,baselineOnly:!prev};
  if(prev){
   cutContext.pid=id;
   const definitions=JSON.parse(vm.runInContext('JSON.stringify(getHoursDefinitions(PROCESS_DEFS.find(p=>p.id===pid)))',cutContext));

   cutContext.fixture=prev.dataset;vm.runInContext('state.data=fixture',cutContext);
   const previousDefinitions=JSON.parse(vm.runInContext('JSON.stringify(getHoursDefinitions(PROCESS_DEFS.find(p=>p.id===pid)))',cutContext));
   cutContext.fixture=dataset;vm.runInContext('state.data=fixture',cutContext);
   const activityMap=(snapshot,unit,defs)=>{
    const activities=snapshot.activities[unit.id+':'+id];if(!activities)throw Error('Missing activities '+unit.id+':'+id);
    const occurrences=new Map(),map=new Map();
    defs.forEach((def,i)=>{
     const activity=activities.find(a=>a.id===def.id);if(!activity)throw Error('Missing activity '+def.id);
     const name=def.name.replace('CORROCERIA','CARROCERIA');const ordinal=(occurrences.get(name)||0)+1;occurrences.set(name,ordinal);
     cutContext.def=def;cutContext.idx=i;const minutes=vm.runInContext('getValidatedActivityMinutes(pid,def.name,def.minutes,idx)',cutContext);
     if(!Number.isFinite(minutes))throw Error('Invalid duration '+def.id);
     map.set(name+'::'+ordinal,{...activity,minutes});
    });return map;
   };
   record.schemaAdjustmentMinutes=0;
   for(const unit of dataset.equipos){
    const previousUnit=prev.dataset.equipos.find(u=>u.id===unit.id && u.vin===unit.vin);if(!previousUnit)continue;
    const excluded=unit.damaged||previousUnit.damaged;
    const before=activityMap(prev.dataset,previousUnit,previousDefinitions),after=activityMap(dataset,unit,definitions);
    for(const [key,a] of after){
     const b=before.get(key);
     if(!b){record.schemaAdjustmentMinutes+=a.state==='hecho'?0:a.minutes;continue;}
     if(a.minutes!==b.minutes)throw Error('Activity duration changed '+unit.id+':'+key);
     if(excluded){record.excludedDamagedProductionMinutes??=0;if(a.state==='hecho'&&b.state!=='hecho')record.excludedDamagedProductionMinutes+=a.minutes;if(b.state==='hecho'&&a.state!=='hecho')record.excludedDamagedProductionMinutes-=a.minutes;continue;}
     if(a.state==='hecho'&&b.state!=='hecho'){record.productionMinutes+=a.minutes;record.completedActivities++;}
     if(b.state==='hecho'&&a.state!=='hecho'){record.productionMinutes-=a.minutes;record.reopenedActivities++;}
    }
    for(const [key,b] of before)if(!after.has(key))record.schemaAdjustmentMinutes-=b.state==='hecho'?0:b.minutes;
   }
   record.pendingAdjustmentMinutes=record.latestPendingMinutes-record.startPendingMinutes+record.productionMinutes;
   const identity = unit => unit.id+'|'+unit.vin;
   const previousKeys = new Set(prev.dataset.equipos.map(identity));
   const currentKeys = new Set(dataset.equipos.map(identity));
   const added = dataset.equipos.filter(unit => !previousKeys.has(identity(unit)));
   const removed = prev.dataset.equipos.filter(unit => !currentKeys.has(identity(unit)));
   const pendingFor = (snapshot, unit) => [...activityMap(snapshot,unit,snapshot===dataset?definitions:previousDefinitions).values()].reduce((sum,a)=>sum+(a.state==='hecho'?0:a.minutes),0);
   record.compositionAdjustmentMinutes=added.reduce((sum,unit)=>sum+pendingFor(dataset,unit),0)-removed.reduce((sum,unit)=>sum+pendingFor(prev.dataset,unit),0);
   record.addedUnitIds=added.map(unit=>unit.id);
   record.removedUnitIds=removed.map(unit=>unit.id);
   if(record.pendingAdjustmentMinutes!==record.compositionAdjustmentMinutes+record.schemaAdjustmentMinutes-(record.excludedDamagedProductionMinutes||0))throw Error('Unreconciled pending change '+id);
  }
  record.partial=true; record.periodStartTimeUnknown=true; record.cutoffTimeUnknown=true; record.timestampBasis="Archivo asignado por el usuario a la fecha del corte. Hora 12:00 usada solo como referencia técnica de fecha, no como hora de cierre."; record.excludesDamaged=true; result.processes[id][date]=record;
 }
 prev={dataset,stats,observedAt};
}
fs.writeFileSync('data/historical-cuts.json',JSON.stringify(result,null,2)+'\n');
for(const src of result.sources)console.log(src.date,Object.entries(result.processes).map(([id,rows])=>id+':'+rows[src.date].productionMinutes).join(' '));










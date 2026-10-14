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
   for(const unit of dataset.equipos){
    const excluded = unit.damaged || prev.dataset.equipos.find(u=>u.id===unit.id)?.damaged;
    if(!prev.dataset.equipos.some(u=>u.id===unit.id && u.vin===unit.vin))continue;
    const key=unit.id+':'+id, before=prev.dataset.activities[key], after=dataset.activities[key];
    if(!before||!after)throw Error('Missing activity sheet '+key);
    definitions.forEach((def,i)=>{
     const a=after[i],b=before[i];
     if(!a||!b||a.id!==b.id||a.name.replace('CORROCERIA','CARROCERIA')!==b.name.replace('CORROCERIA','CARROCERIA')||a.minutes!==b.minutes)throw Error('Activity schema changed '+key);
     cutContext.def=def;cutContext.idx=i;
     const minutes=vm.runInContext('getValidatedActivityMinutes(pid,def.name,def.minutes,idx)',cutContext);
     if(!Number.isFinite(minutes))throw Error('Invalid duration');
     if(excluded){ record.excludedDamagedProductionMinutes ??= 0; if(a.state==='hecho' && b.state!=='hecho')record.excludedDamagedProductionMinutes+=minutes; if(b.state==='hecho' && a.state!=='hecho')record.excludedDamagedProductionMinutes-=minutes; return; }
     if(a.state==='hecho' && b.state!=='hecho'){record.productionMinutes+=minutes;record.completedActivities++;}
     if(b.state==='hecho' && a.state!=='hecho'){record.productionMinutes-=minutes;record.reopenedActivities++;}
    });
   }
   record.pendingAdjustmentMinutes=record.latestPendingMinutes-record.startPendingMinutes+record.productionMinutes;
  }
  record.partial=true; record.periodStartTimeUnknown=true; record.cutoffTimeUnknown=true; record.timestampBasis="Archivo asignado por el usuario a la fecha del corte. Hora 12:00 usada solo como referencia técnica de fecha, no como hora de cierre."; record.excludesDamaged=true; result.processes[id][date]=record;
 }
 prev={dataset,stats,observedAt};
}
fs.writeFileSync('data/historical-cuts.json',JSON.stringify(result,null,2)+'\n');
for(const src of result.sources)console.log(src.date,Object.entries(result.processes).map(([id,rows])=>id+':'+rows[src.date].productionMinutes).join(' '));










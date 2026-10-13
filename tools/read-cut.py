import openpyxl,csv,json,datetime,pathlib,sys
p=pathlib.Path(sys.argv[1])
w=openpyxl.load_workbook(p,read_only=True,data_only=True)
out=pathlib.Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
def val(v):
 if v is None:return ''
 if isinstance(v,datetime.timedelta):
  n=round(v.total_seconds());return f'{n//3600}:{n//60%60:02}:{n%60:02}'
 if isinstance(v,(datetime.time,datetime.datetime,datetime.date)):return v.isoformat()
 return v
names=['PLANEACION_ENSAMBLES','% POR UNIDAD','ESTRUCTURALES','TALLERES','ENSAMBLE ELECTRICO','ENSAMBLE HIDRAULICO INFERIOR','PEDESTAL-TORNAMESA','ENSAMBLE BRZ. SIS. DE NIVELACIO','PRUEBAS INICIALES','ACABADOS','PRUEBAS CALIDADFINALES']
for i,name in enumerate(names):
 rows=[[val(v) for v in r] for r in w[name].iter_rows(values_only=True)]
 with (out/f'{i}.csv').open('w',newline='',encoding='utf-8') as f:csv.writer(f).writerows(rows)
 print(name,len(rows),max(map(len,rows),default=0))




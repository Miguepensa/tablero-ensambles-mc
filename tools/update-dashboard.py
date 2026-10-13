"""Asistente local: selecciona un corte, valida y publica en el tablero existente."""
import datetime, json, pathlib, subprocess, sys, os, re, time
import tkinter as tk
from tkinter import filedialog, simpledialog, messagebox

ROOT = pathlib.Path(__file__).resolve().parents[1]
os.chdir(ROOT)
RUNTIME = pathlib.Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies'
NODE = str(RUNTIME/'node/bin/node.exe')
GIT = 'git'
FILES = ['app.js', 'index.html', 'data/historical-cuts.json']

def run(*args):
    return subprocess.check_output(args, text=True, encoding='utf-8', errors='replace', stderr=subprocess.STDOUT, timeout=180)

def prepare(source, date):
    datetime.date.fromisoformat(date)
    history = json.loads((ROOT/FILES[2]).read_text(encoding='utf-8'))
    dates = sorted(set(s['date'] for s in history['sources']))
    if date <= dates[-1]:
        raise ValueError('La fecha debe ser posterior al último corte ('+dates[-1]+'). No se reemplazan cortes existentes.')
    if datetime.date.fromisoformat(date) > datetime.date.today():
        raise ValueError('No se permiten cortes futuros.')
    previous = dates[-1]
    folder = ROOT/'.local'/('corte-'+date)
    for name in ['dataset.json', 'comparison.json']:
        if not (ROOT/'.local'/('corte-'+previous)/name).exists():
            raise ValueError('Falta el respaldo del corte anterior. Conserva la carpeta .local de esta computadora.')
    print(run(sys.executable, 'tools/read-cut.py', str(source), str(folder)))
    print(run(NODE, 'tools/parse-cut.cjs', str(folder)))
    before = {name:(ROOT/name).read_bytes() for name in FILES}
    try:
        print(run(NODE, 'tools/add-cut.cjs', str(source), date, previous))
        after = json.loads((ROOT/FILES[2]).read_text(encoding='utf-8'))
        assert after['sources'][:-1] == history['sources']
        assert len(after['processes']) == 11
        for pid, records in after['processes'].items():
            assert {d:r for d,r in records.items() if d != date} == history['processes'][pid]
            r = records[date]
            assert r['pendingAdjustmentMinutes'] == 0, 'Cambió el listado o saldo sin actividad comparable: '+pid
        app = (ROOT/'app.js').read_text(encoding='utf-8')
        app = re.sub(r'Cortes de Excel del 02 al \d{2}/\d{2}/\d{4}\.', 'Cortes de Excel del 02 al '+datetime.date.fromisoformat(date).strftime('%d/%m/%Y')+'.', app)
        app = app.replace('El corte del lunes 12 tampoco confirma hora de cierre.', 'Los cortes posteriores tampoco confirman hora de cierre.')
        (ROOT/'app.js').write_text(app, encoding='utf-8')
        html = (ROOT/'index.html').read_text(encoding='utf-8')
        html = re.sub(r'(app\.js|styles\.css)\?v=[^\"]+', lambda m:m[1]+'?v='+date.replace('-','')+'-corte', html)
        (ROOT/'index.html').write_text(html, encoding='utf-8')
        print(run(NODE, '--check', 'app.js'))
        print(run(NODE, 'tests/regression.cjs'))
        return after
    except Exception:
        for name, content in before.items():
            (ROOT/name).write_bytes(content)
        raise

def main():
    if len(sys.argv) == 4 and sys.argv[1] == '--prepare':
        prepare(pathlib.Path(sys.argv[2]).resolve(), sys.argv[3]); return
    root = tk.Tk(); root.withdraw()
    try:
        if run(GIT, 'status', '--porcelain').strip():
            raise ValueError('Hay cambios locales pendientes. No se publicará hasta revisarlos.')
        if run(GIT, 'rev-parse', '--abbrev-ref', 'HEAD').strip() != 'main':
            raise ValueError('La carpeta debe estar en la rama main.')
        remote = run(GIT, 'remote', 'get-url', 'origin').strip()
        if remote != 'https://github.com/Miguepensa/tablero-ensambles-mc.git':
            raise ValueError('El destino de publicación no coincide con el tablero.')
        print(run(GIT, '-c', 'http.sslBackend=openssl', 'pull', '--ff-only', 'origin', 'main'))
        # A prior successful commit with a failed push can be retried without reimporting.
        if run(GIT, 'log', 'origin/main..HEAD', '--oneline').strip():
            if messagebox.askyesno('Publicación pendiente', 'Hay un corte validado pendiente de subir. ¿Publicarlo ahora?'):
                print(run(GIT, '-c', 'http.sslBackend=openssl', 'push', 'origin', 'main'))
                messagebox.showinfo('Enviado', 'La publicación fue enviada. Espera uno o dos minutos y actualiza el tablero con Ctrl + F5.')
            return
        source = filedialog.askopenfilename(title='Selecciona el Excel del corte', filetypes=[('Excel', '*.xlsx')], initialdir=str(pathlib.Path.home()/'Downloads'))
        if not source: return
        date = simpledialog.askstring('Fecha del corte', 'Fecha de los datos (AAAA-MM-DD):', initialvalue=datetime.date.today().isoformat())
        if not date: return
        if not messagebox.askyesno('Publicar corte', 'Se publicará el corte '+date+' en el tablero público de Ensambles MC. ¿Continuar?'): return
        prepare(pathlib.Path(source), date)
        print(run(GIT, 'add', '--', *FILES))
        print(run(GIT, 'commit', '-m', 'Actualiza corte '+date))
        print(run(GIT, '-c', 'http.sslBackend=openssl', 'push', 'origin', 'main'))
        messagebox.showinfo('Corte enviado', 'Corte '+date+' enviado correctamente. Espera uno o dos minutos y abre Control operativo. Actualiza con Ctrl + F5.')
    except Exception as error:
        detail = getattr(error, 'output', '') or str(error)
        print(detail)
        messagebox.showerror('No se completó la publicación', detail+'\n\nNo borres los respaldos ni repitas la importación si el corte ya quedó guardado.')
        raise

if __name__ == '__main__': main()

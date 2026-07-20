# Tablero Ensambles MC

App web estatica para visualizar el avance de ensamble EH150 usando datos demo, CSV locales o URLs CSV publicadas desde Google Drive / Google Sheets.

## Abrir

Abre `index.html` en el navegador. No requiere instalacion ni servidor.

## Conectar con Drive

1. Abre el Excel en Google Sheets.
2. En cada hoja necesaria usa `Archivo > Compartir > Publicar en la web`.
3. Elige formato CSV y copia el enlace.
4. En la vista `Conexion` pega los enlaces de:
   - `lista de chasis` para las 170 unidades activas con VIN y serie de grua.
   - `% POR UNIDAD / AVANCE GENERAL`
   - `Materiales`
   - `Finanzas / Copia de Hoja 1`
   - Hojas de proceso, si quieres calcular avance desde actividades.
5. Pulsa `Guardar y cargar`.

## Publicar con actualizacion automatica

Para publicar el tablero y que ya no tengas que subir archivos manuales:

1. Sube esta carpeta completa a GitHub.
2. En GitHub entra al repositorio y ve a `Settings > Pages`.
3. En `Build and deployment`, selecciona `Deploy from a branch`.
4. Selecciona la rama `main` y carpeta `/root`, luego `Save`.
5. GitHub te dara una liga tipo `https://usuario.github.io/repositorio/`.

El tablero busca automaticamente `data/sources.json` al abrir. Si ese archivo tiene enlaces publicados de Google Sheets, carga esos datos y se actualiza cada 5 minutos.

Puedes usar un solo enlace del archivo completo si las hojas estan publicadas y conservan sus nombres:

```json
{
  "autoRefreshMinutes": 5,
  "workbook": "https://docs.google.com/spreadsheets/d/ID_DEL_ARCHIVO/edit#gid=0"
}
```

O puedes pegar enlaces CSV por hoja cuando alguna pestana necesite su propio `gid`:

```json
{
  "autoRefreshMinutes": 5,
  "avance": "https://docs.google.com/spreadsheets/d/e/ID_PUBLICADO/pub?gid=123&single=true&output=csv",
  "processSheets": {
    "calidad_final": "https://docs.google.com/spreadsheets/d/e/ID_PUBLICADO/pub?gid=456&single=true&output=csv"
  }
}
```

Para que el recuadro `Entregado` se actualice solo, publica la pestana `PRUEBAS CALIDADFINALES` como CSV y pega ese enlace en `processSheets.calidad_final`.

Para el archivo `AVANCE DE ENSAMBLE EH150_ABR.2026`, conviene usar `lista de chasis` como fuente de equipos. `LISTA EQUIPOS` es un catalogo mas amplio y no coincide uno a uno con las unidades activas de proceso.

La app tambien acepta enlaces tipo:

```text
https://docs.google.com/spreadsheets/d/ID_DEL_ARCHIVO/edit#gid=123456
```

y los convierte internamente a:

```text
https://docs.google.com/spreadsheets/d/ID_DEL_ARCHIVO/export?format=csv&gid=123456
```

## Estructura esperada

La app intenta reconocer nombres de columnas comunes aunque no sean exactos.

Equipos:

- `equipo`, `numero`, `control`, `numero_control`, `no_control`
- `vin`
- `serie_grua`
- `division`
- `entrega`
- `estatus`
- `modelo`
- `plazo`

Avance general:

- Una columna de equipo/control.
- Columnas con porcentajes por proceso, por ejemplo `Estructurales`, `Ensamble electrico`, `Pruebas finales`.

Hojas de proceso:

- Una columna de equipo/control.
- Las demas columnas se tratan como actividades.
- Valores reconocidos como hecho: `1`, `x`, `ok`, `si`, `hecho`, `terminado`.
- Valores reconocidos como correccion: `c`, `correccion`, `rechazo`, `detalle`.

Materiales:

- `descripcion`, `codigo`, `proceso`
- `requerido` o `cantidad`
- `entregado`
- `pendiente` o `faltantes`
- `stock`, `inventario`, `requisicion`, `orden_compra`

Finanzas:

- Usa la hoja `Copia de Hoja 1` del archivo `EH150_Estatus.xlsx`.
- Columnas principales: `# ALMACEN`, `VIN`, `DIVISION/ ZONA`, fechas de entrega/curso, forma de pago, promesa de pago, factura, pagada/no pagada, penalizacion, saldo, observaciones y garantias.
- El tablero vincula cada fila financiera con la unidad de ensamble por VIN, numero de almacen y zona.
- En Drive basta publicar esa hoja como CSV y pegar el enlace en `Conexion > Finanzas / Copia de Hoja 1`.

## Lectura del Excel EH150

El archivo `data/excel-data.js` se genero desde `AVANCE DE ENSAMBLE EH150_ABR.2026 (2).xlsx`.

- Las unidades salen de `lista de chasis`, usando el bloque activo de 170 unidades.
- Los KPIs principales usan 170 como total fijo del programa.
- `En proceso` cuenta unidades que ya tienen al menos una actividad iniciada.
- `Por hacer` se calcula como `170 - unidades iniciadas`.
- `Terminadas` y `Detenidas` salen del estatus calculado por avance/estado de cada unidad.

Materiales se lee de la hoja `Materiales`, tomando el bloque de `170 EQUIPOS`:

- Columna A: ensamble o grupo del material.
- Columna B: descripcion o codigo Parker.
- Columna F: cantidad requerida para 170 equipos.
- Columna G: stock.
- Columna P: inventario almacen.
- Columna Q: orden de compra.
- Columna R: requisicion.
- Columna S: entregado.
- Columna T: pendiente/faltante para 170 equipos.

La vista `Materiales` convierte esas columnas en filas de inventario. La cobertura se calcula como `entregado / requerido`; si `pendiente` es mayor que cero, el material aparece como faltante o en riesgo.

En `Captura`, los nombres de actividades salen de la fila de encabezados de cada hoja de proceso (`ESTRUCTURALES`, `ENSAMBLE ELECTRICO`, `PRUEBAS INICIALES`, etc.). Los valores de cada unidad se interpretan asi:

- `1`, `x`, `ok`, `si`: hecho.
- `0`, vacio, `no`, `pendiente`: pendiente.
- `c`, `correccion`, `rechazo`, `detalle`: correccion.

## Nota de acceso

Un archivo privado de Drive no puede leerse desde esta app estatica sin autenticacion. Para datos reales usa CSV publicado, permiso publico con enlace, o un proxy/API de Google Apps Script.

# Conversión de informes del Registro Entidades y Laboratorios de control de calidad de la edificación

Estas herramientas permiten la conversión de los informes del registro de entidades y laboratorios de control de calidad de la edificación en formato de hoja de cálculo `.xls`
al formato JSON, para su procesado automático.

La herramienta `labs2json.js` convierte un archivo `.xls` de informe de laboratorios a JSON

La herramienta `ents2json.js` convierte un archivo `.xls` de informe de entidades a JSON

## Instalación

Los script se han probado con `Node.js` v8.9.4 y el intérprete debe estar instalado para el uso de las herramientas.

También deben estar disponibles la herramienta `unoconv`, a la que se llama internamente para realizar conversiones de formato, y la herramienta `unzip`.

Las herramientas se han probado con `unoconv` v0.7 y `unzip` v6.00.

## Uso

Para la conversión de un archivo `.xls` de informe de laboratorios:

    $ node labs2json.js "ruta/a/Informe Laboratorios.xls"

Para la conversión de un archivo `.xls` de informe de entidades:

    $ node ents2json.js "ruta/a/Informe Entidades.xls"

Estas llamadas generan, respectivamente, los archivos `datalabs.json` y `dataents.json`.

## Tests

Se puede probar el funcionamiento de la herramienta usando

    $ make

## Licencia

Estas herramientas son software libre y su código se distribuye bajo licencia MIT.

Consulte el archivo LICENSE para más detalles.

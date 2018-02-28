/* -*- coding: utf-8 -*-

Copyright (c) 2018 Rafael Villar Burke <pachi@ietcc.csic.es>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

/* *** Convierte archivo .xls de datos de laboratorios a JSON

Genera el archivo de datos de laboratorios data_labs.json al ejecutar:

   $ node labscsv2json.js "Informe Laboratorios.xls"

 ****/

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const utils = require("./utils");

function findXML(args) {
  if (args.length < 3) {
    console.error(`Debe indicar un archivo xml de datos de laboratorios:\n\n\tnode labs2json "Informe Laboratorios.xls"\n`);
    process.exit();
  }
  let xlsname = args[2];
  if (!xlsname.endsWith(".xls")) {
    console.error(`Debe indicar un archivo xml de datos de laboratorios.`);
    process.exit();
  }
  let xmlpath = path.resolve(__dirname, xlsname);
  if (!fs.existsSync(xmlpath)) {
    console.error(`No se encuentra el archivo "${xlsname}"`);
    process.exit();
  }
  return xmlpath;
}

// Crea archivos csv, xlsx y extrae .xml y .rels para sacar URLs de registros
function generateAuxFiles(xmlpath) {
  console.log("Generando archivos temporales: .csv, .xslx y .refs");
  child_process.execSync("mkdir -p ./process/labs/");
  //  Filtro para que entrecomille todos los campos y alguna cosa más. Ver opciones de unoconv
  child_process.execSync(
    `unoconv --listener && unoconv -f csv -e FilterOptions=44,34,0,1,1/5/2/1/3/1/4/1,,true,,false -o ./process/labs/salida_labs.csv "${xmlpath}"`
  );
  child_process.execSync(
    `unoconv --listener && unoconv -f xlsx -o ./process/labs/salida_labs.xlsx "${xmlpath}"`
  );
  child_process.execSync(
    `unzip -oj ./process/labs/salida_labs.xlsx "xl/worksheets/_rels/*.rels" -d ./process/labs/`
  );
}

// Convierte lista de campos a objeto
function lst2obj(lst) {
  const [
    cod,
    empresa,
    nif,
    cp,
    direccion,
    web,
    observaciones,
    municipio,
    telefono1,
    inscripcion_ccaa,
    referencia,
    provincia,
    telefono2,
    fecha_alta,
    baja,
    fecha_baja,
    email,
    fax,
    declaraciones
  ] = lst;
  return {
    cod,
    empresa,
    nif,
    cp,
    direccion,
    web,
    observaciones,
    municipio,
    telefono1,
    inscripcion_ccaa,
    referencia,
    provincia,
    telefono2,
    fecha_alta,
    baja,
    fecha_baja,
    email,
    fax,
    declaraciones
  };
}

// Une líneas CSV no válidas que resultan de saltos de línea en los campos de texto
function fixnewlines(lines) {
  let fixedlines = [];
  for (let line of lines) {
    if (line.startsWith(",,") || fixedlines.length === 0) {
      fixedlines.push(line);
    } else {
      const last = fixedlines[fixedlines.length - 1] + ". " + line;
      fixedlines.splice(-1, 1, last);
    }
  }
  return fixedlines;
}

// Convierte datos en formato CSV a lista de objetos
function parseCSV() {
  console.log("Leyendo datos desde archivo csv");
  let csvpath = path.resolve(__dirname, "./process/labs/salida_labs.csv");
  if (!fs.existsSync(csvpath)) {
    console.error(`No se encuentra el archivo ${csvname}.`);
    process.exit();
  }
  let lines = fs
    .readFileSync(csvpath, "utf8")
    .replace("\n\r", "\n")
    .split("\n");
  lines = fixnewlines(lines);

  // Realiza comprobaciones básicas de formato
  const CSVNCOLS = lines[0].split(",").length;
  const CSVEXPECTEDCOLS = 21;
  if (CSVNCOLS !== CSVEXPECTEDCOLS) {
    console.error(
      `Formato de archivo desconocido de ${CSVNCOLS} columna (se esperan ${CSVEXPECTEDCOLS} columnas).\n${
        lines[0]
      }`
    );
    process.exit();
  }

  // Separa campos con comas que no estén en cadenas entrecomilladas
  let valuelines = lines.map(line =>
    line
      .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/) // Dividir por comas, respetando comas entrecomilladas
      .slice(2)
      .map(val => {
        let newval = val.trim();
        if (newval.startsWith('"') && newval.endsWith('"')) {
          newval = newval.slice(1, -1).trim(); // Eliminar entrecomillados de cadenas
        }
        return newval;
      })
  );
  valuelines = valuelines.slice(1);
  // Agrupa declaración responsable
  return agrupaLineasAdicionales(valuelines);
}

// Agrupa líneas adicionales con datos de declaracion responsable y cuadro combinado
function agrupaLineasAdicionales(valuelines) {
  function collected2fields(collected) {
    return collected
      .reduce((acc, val) => acc.concat(val), [])
      .filter(v => v !== "" && v !== "DECLARACION_RESPONSABLE");
  }

  const objs = [];
  let currlines = [];
  for (const dataline of valuelines) {
    const datalineIsId = dataline[0] !== "";
    if (datalineIsId) {
      const lastobj = objs.pop();
      if (lastobj) {
        const coll = collected2fields(currlines);
        lastobj.declaraciones = coll;
        objs.push(lastobj);
      }
      objs.push(lst2obj(dataline.slice(0, -1)));
      currlines = [];
    } else {
      currlines.push(dataline);
    }
  }
  return objs;
}

// Empareja URLs con textos
function urlFix(datalist) {
  console.log("Recreando hiperenlaces desde archivos .xslx y .refs");
  // Lista de URLs
  let relspath = path.resolve(__dirname, "./process/labs/sheet1.xml.rels");
  const lines = fs.readFileSync(relspath, "utf8");
  const urlrefs = lines
    .match(/Target="([^"]*)"/gm)
    .filter(s => !s.includes("@"))
    .map(s => s.split("=")[1].slice(1, -1));
  // Lista de etiquetas
  const urllabels = datalist.map(d => d.web).filter(s => s !== "");
  // Comprobación de consistencia
  if (urlrefs.length !== urllabels.length) {
    console.error(
      `El número de etiquetas (${urllabels.length}) y de URLs (${
        urlrefs.length
      }) de los hiperenlaces no coincide`
    );
    process.exit(1);
  } else {
    console.log(`Localizados ${urllabels.length} hiperenlaces`);
  }
  // Diccionario de etiquetas y URLS
  const mymap = {};
  for (let idx = 0; idx < urlrefs.length; idx++) {
    key = urllabels[idx];
    value = urlrefs[idx];
    if (key in mymap) {
      if (mymap[key] !== value) {
        console.error(
          `Valor inconsistente para la etiqueta (${key}) con URLs ${value} y ${
            mymap[key]
          }`
        );
        process.exit(1);
      }
    }
    mymap[key] = value;
  }
  // Añade URLS a datalist
  for (let obj of datalist) {
    obj.web_url = mymap[obj.web] || "";
  }
  return datalist;
}

function addCcaa(datalist) {
  for (let obj of datalist) {
    const comunidad = utils.prov2ca[obj.provincia.replace(' / ', '/')];
    if (!comunidad) {
      console.log("No se ha encontrado la comunidad para la provincia ", obj.provincia);
    }
    obj.comunidad = utils.prov2ca[obj.provincia];
  }
  return datalist;
}

generateAuxFiles(findXML(process.argv));
const datalist = parseCSV();
urlFix(datalist);
addCcaa(datalist);

console.log(`Localizados ${datalist.length} laboratorios`);
const jsonstring = JSON.stringify(datalist, null, " ");
fs.writeFile("datalabs.json", jsonstring, err => {
  if (err) throw err;
  console.log("Resultados guardados en el archivo datalabs.json");
});

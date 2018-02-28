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

/* *** Functiones y constantes auxiliares ****/

ca2prov = {
  "Andalucía" : ["Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla"],
  "Aragón": ["Huesca", "Teruel", "Zaragoza"],
  "Asturias, Principado de": ["Asturias"],
  "Balears, Illes": ["Balears, Illes"],
  "Canarias": ["Palmas, Las", "Santa Cruz de Tenerife" ],
  "Cantabria": ["Cantabria"],
  "Castilla y León": ["Ávila", "Burgos", "León", "Palencia", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
  "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
  "Cataluña": ["Barcelona", "Girona", "Lleida", "Tarragona"],
  "Comunitat Valenciana": ["Alicante/Alacant", "Castellón/Castelló", "Valencia/València"],
  "Extremadura": ["Badajoz", "Cáceres"],
  "Galicia": ["Coruña, A", "Lugo", "Ourense", "Pontevedra"],
  "Madrid, Comunidad de": ["Madrid"],
  "Murcia, Región de": ["Murcia"],
  "Navarra, Comunidad Foral de": ["Navarra"],
  "País Vasco": ["Araba/Álava", "Bizkaia", "Gipuzkoa"],
  "Rioja, La": ["Rioja, La"],
  "Ceuta": ["Ceuta"],
  "Melilla": ["Melilla"]
};

prov2ca = {
  "Almería": "Andalucía",
  "Cádiz": "Andalucía",
  "Córdoba": "Andalucía",
  "Granada": "Andalucía",
  "Huelva": "Andalucía",
  "Jaén": "Andalucía",
  "Málaga": "Andalucía",
  "Sevilla": "Andalucía",
  "Huesca": "Aragón",
  "Teruel": "Aragón",
  "Zaragoza": "Aragón",
  "Asturias": "Asturias, Principado de",
  "Balears, Illes": "Balears, Illes",
  "Palmas, Las": "Canarias",
  "Santa Cruz de Tenerife": "Canarias",
  "Cantabria": "Cantabria",
  "Ávila": "Castilla y León",
  "Burgos": "Castilla y León",
  "León": "Castilla y León",
  "Palencia": "Castilla y León",
  "Salamanca": "Castilla y León",
  "Segovia": "Castilla y León",
  "Soria": "Castilla y León",
  "Valladolid": "Castilla y León",
  "Zamora": "Castilla y León",
  "Albacete": "Castilla-La Mancha",
  "Ciudad Real": "Castilla-La Mancha",
  "Cuenca": "Castilla-La Mancha",
  "Guadalajara": "Castilla-La Mancha",
  "Toledo": "Castilla-La Mancha",
  "Barcelona": "Cataluña",
  "Girona": "Cataluña",
  "Lleida": "Cataluña",
  "Tarragona": "Cataluña",
  "Alicante/Alacant": "Comunitat Valenciana",
  "Castellón/Castelló": "Comunitat Valenciana",
  "Valencia/València": "Comunitat Valenciana",
  "Badajoz": "Extremadura",
  "Cáceres": "Extremadura",
  "Coruña, A": "Galicia",
  "Lugo": "Galicia",
  "Ourense": "Galicia",
  "Pontevedra": "Galicia",
  "Madrid": "Madrid, Comunidad de",
  "Murcia": "Murcia, Región de",
  "Navarra": "Navarra, Comunidad Foral de",
  "Araba/Álava": "País Vasco",
  "Bizkaia": "País Vasco",
  "Gipuzkoa": "País Vasco",
  "Rioja, La": "Rioja, La",
  "Ceuta": "Ceuta",
  "Melilla": "Melilla"
};

module.exports = { prov2ca, ca2prov };
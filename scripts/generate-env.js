// Genera src/environments/environment.ts antes del build.
// En Netlify lee las env vars configuradas en la UI (apiUrl, production).
// Localmente usa los valores de fallback (localhost).
const fs   = require('fs');
const path = require('path');

// Elimina comillas simples o dobles que Netlify pueda incluir en el valor
function stripQuotes(str) {
  return str.replace(/^['"]|['"]$/g, '').trim();
}

const apiUrl     = stripQuotes(process.env.apiUrl || 'http://localhost:8080/api');
const production = process.env.production === 'true';

const content = `export const environment = {
  production: ${production},
  apiUrl: ${JSON.stringify(apiUrl)},
};\n`;

const dest = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
fs.writeFileSync(dest, content, 'utf8');
console.log(`✔ environment.ts generado (production=${production}, apiUrl=${apiUrl})`);

import fs from 'fs';
const h = fs.readFileSync('dist/index.html', 'utf8');
const types = ['Organization', 'WebSite', 'BreadcrumbList', 'Service', 'FAQPage', 'ListItem', 'Question'];
const counts = {};
for (const t of types) {
  counts[t] = (h.match(new RegExp('@type":"' + t + '"', 'g')) || []).length;
}
const ldScripts = (h.match(/application\/ld\+json/g) || []).length;
const tableTags = (h.match(/<table[\s>]/g) || []).length;
const stepN = (h.match(/Step\s+\d+:/g) || []).length;
const cpkMatch = (h.match(/Cpk\s*[≥>=]\s*1\.\d+/g) || []).length;
const lookingFor = (h.match(/Looking for/i) || []).length;
const vsLine = (h.match(/vs\.\s+typical/i) || []).length;
const since1998 = (h.match(/since\s+1998/gi) || []).length;
const yieldMatch = (h.match(/\byield\b/gi) || []).length;
const scrapMatch = (h.match(/scrap\s+rate/gi) || []).length;

console.log('=== Schema types in dist/index.html ===');
for (const t of types) console.log(t.padEnd(18), counts[t]);
console.log('---');
console.log('JSON-LD <script> tags:', ldScripts);
console.log('<table> tags:', tableTags);
console.log('"Step N:" patterns:', stepN);
console.log('"Cpk >= 1.x" patterns:', cpkMatch);
console.log('"Looking for" patterns:', lookingFor);
console.log('"vs. typical" patterns:', vsLine);
console.log('"since 1998" patterns:', since1998);
console.log('"yield" patterns:', yieldMatch);
console.log('"scrap rate" patterns:', scrapMatch);
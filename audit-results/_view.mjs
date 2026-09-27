#!/usr/bin/env node
/** Read _analysis.jsonl and print sections in a compact, scannable form. */
import { readFileSync } from 'node:fs';
const which = process.argv[2];
const raw = readFileSync('c:/Users/User/Desktop/machineknives/audit-results/_analysis.jsonl', 'utf8').trim().split('\n');
const map = {};
for (let i = 0; i < raw.length; i += 2) {
  const key = raw[i].match(/<<<SECTION:([A-Z_]+)>>>/)[1];
  map[key] = JSON.parse(raw[i + 1]);
}
if (which === 'all') {
  for (const k of Object.keys(map)) {
    console.log(`\n===== ${k} =====`);
    const v = map[k];
    if (v.hits || v.posts) {
      console.log(`total: ${v.total ?? v.posts?.length}`);
      const list = v.hits ?? v.staleTop30 ?? v.missingImageSamples ?? [];
      for (const it of list.slice(0, 30)) console.log(JSON.stringify(it));
      if ((v.hits?.length ?? 0) > 30) console.log(`... (${v.hits.length - 30} more)`);
    } else {
      console.log(JSON.stringify(v, null, 2).slice(0, 5000));
    }
  }
} else {
  console.log(JSON.stringify(map[which], null, 2));
}
import { statSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const path = 'C:/Users/User/Desktop/machineknives/build-fix3.log';

for (let i = 0; i < 90; i++) {
  let stat;
  try { stat = statSync(path); } catch { stat = null; }
  if (stat) {
    const ageMs = Date.now() - stat.mtime.getTime();
    console.log(`[${i}s] size=${stat.size} mtime_age=${(ageMs/1000).toFixed(1)}s`);
    if (stat.size > 1000 && ageMs > 4000) break;
  } else {
    console.log(`[${i}s] waiting for log file...`);
  }
  await sleep(1000);
}
console.log('done waiting');
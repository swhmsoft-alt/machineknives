#!/usr/bin/env node
/**
 * Smoke test for the deployed inquiry API.
 *
 * Runs a GET against https://custommachineknives.com/api/inquiry and
 * asserts the response is 200 with a JSON `{ success: true, ... }` body.
 * Exits non-zero on any failure so CI fails fast — a dropped Worker
 * route (the Oct 9 outage root cause) is caught here instead of by
 * customers trying to submit the contact form.
 *
 * Why shell out to `curl` instead of using Node's `fetch` or `https`?
 * ───────────────────────────────────────────────────────────────────
 * On this Windows host, Node's `fetch` (undici / BoringSSL) and
 * `https` (OpenSSL) both time out at 12s and ECONNRESET on retry,
 * while the same `curl` command from the same PowerShell window
 * returns 200 in <500ms. The exact same OpenSSL stack — but with a
 * separate process and its own socket lifecycle — works.
 *
 * We therefore spawn `curl.exe` (built into Windows 10 1803+ and
 * PowerShell 5+) as a child process. Curl is cross-platform enough
 * for this single call: on Linux/macOS the same `curl` binary is in
 * PATH and the flags below are identical. This is a deliberate
 * trade-off: we accept a process-spawn dependency in exchange for
 * a smoke test that *actually* runs in this environment.
 *
 * Usage:
 *   node scripts/verify-inquiry-api.mjs
 *   npm run verify:inquiry
 *   npm run deploy:verify   # wrangler deploy + this script
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const pExecFile = promisify(execFile);

const API_URL = 'https://custommachineknives.com/api/inquiry';
const TIMEOUT_S = 12; // --max-time for curl, also our outer timeout + 3s grace
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Run `curl` once. Resolves to:
 *   { ok: true,  status, body, stderr }
 *   { ok: false, error }   — process spawn / non-zero exit / timeout
 */
async function curlOnce() {
  try {
    // -sS  : silent but still print errors to stderr
    // -i   : include response headers in stdout (so we can read status line)
    // --max-time : per-try connection + read timeout in seconds
    //
    // We deliberately avoid `--no-progress-meter` — that flag is curl
    // 7.78+ only and not present in older curl builds (notably the one
    // shipped with Windows 10 1809 and some CI images). `-sS` already
    // silences the progress bar; the meter flag would just break on
    // older hosts.
    const { stdout, stderr } = await pExecFile(
      'curl',
      ['-sS', '-i', '--max-time', String(TIMEOUT_S), API_URL],
      { timeout: (TIMEOUT_S + 3) * 1000, windowsHide: true },
    );
    return { ok: true, stdout, stderr };
  } catch (err) {
    return { ok: false, error: err };
  }
}

/**
 * Parse `curl -i` output. The first CRLFCRLF (or LFLF) separates
 * headers from body. The status code is on the first header line.
 */
function parseCurlOutput(raw) {
  // Headers may end with \r\n\r\n or \n\n depending on platform.
  const split = raw.split(/\r?\n\r?\n/);
  const headerBlock = split[0] ?? '';
  const body = split.slice(1).join('\n\n');
  const statusMatch = headerBlock.match(/^HTTP\/[\d.]+\s+(\d+)/);
  const status = statusMatch ? parseInt(statusMatch[1], 10) : 0;
  return { status, body };
}

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  // process.stdout.write flushes immediately, so the user sees this
  // even when npm buffers console.log until the child exits.
  process.stdout.write(`→ curl ${API_URL} (attempt ${attempt}/${MAX_ATTEMPTS})…\n`);

  const result = await curlOnce();

  if (!result.ok) {
    const err = result.error;
    // execFile error.message is "Command failed: curl …" with stderr
    // usually attached. Print what we have.
    console.error(`✗ attempt ${attempt}/${MAX_ATTEMPTS}: ${err.message ?? err}`);
    if (err.stderr) {
      const trimmed = err.stderr.toString().trim();
      if (trimmed) console.error(`    stderr: ${trimmed}`);
    }
    if (err.code !== undefined) console.error(`    code: ${err.code}`);
    if (err.signal) console.error(`    signal: ${err.signal}`);
    if (err.killed) console.error(`    killed: timeout exceeded`);

    if (attempt < MAX_ATTEMPTS) {
      console.error(`    retrying in ${RETRY_DELAY_MS / 1000}s…`);
      await sleep(RETRY_DELAY_MS);
      continue;
    }
    console.error('');
    console.error(`✗ verify-inquiry-api: ${MAX_ATTEMPTS} curl attempts failed.`);
    console.error(`  → Even the system curl couldn't reach ${API_URL}. This is a`);
    console.error(`    network/firewall/DNS issue on the host, not the Worker.`);
    console.error(`    Cross-check manually from the same shell:`);
    console.error(`      curl -I ${API_URL}`);
    process.exit(1);
  }

  const { status, body } = parseCurlOutput(result.stdout);

  if (status !== 200) {
    console.error(`✗ verify-inquiry-api: HTTP ${status} from ${API_URL}`);
    if (body) console.error(`  body: ${body.slice(0, 200)}`);
    console.error(`  → Worker route is probably missing. Re-add the routes block in`);
    console.error(`    wrangler.toml and run \`wrangler deploy\` again.`);
    console.error(`    (See AGENTS.md → "Contact Form Inquiry Pipeline".)`);
    process.exit(1);
  }

  let json;
  try {
    json = JSON.parse(body);
  } catch {
    console.error(`✗ verify-inquiry-api: non-JSON response (first 200 bytes):`);
    console.error(`  ${body.slice(0, 200)}`);
    process.exit(1);
  }

  if (!json.success) {
    console.error(`✗ verify-inquiry-api: unexpected body ${JSON.stringify(json)}`);
    process.exit(1);
  }

  console.log(`✓ verify-inquiry-api: ${API_URL} → ${status} ${json.message ?? ''}`);
  process.exit(0);
}


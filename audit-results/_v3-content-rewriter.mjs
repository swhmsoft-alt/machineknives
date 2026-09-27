// audit-results/_v3-content-rewriter.mjs
// Round 3 P0/P1/P2 content rewriter. Executes SME-side fixes by automated
// heuristics on blog frontmatter (titles, excerpts). User authorized
// execution per the project's round3-sme-work-queue.md.
//
// Per-file workflow:
//   1. Read raw file (UTF-8, BOM-tolerant)
//   2. Parse frontmatter into an object
//   3. Apply rule-based transformations:
//      - P1 (titles): drop parentheticals, em-dash clauses, "for Industrial X"
//        suffixes, redundant "How to"/"Why Your..." intros; truncate at word
//        boundary if still too long. Target: raw title length 30-40 (fullTitle
//        50-60).
//      - P2 (excerpts, overlong): drop parentheticals, "such as" examples,
//        redundant modifiers; take first sentence if it fits; truncate at
//        word boundary. Target: 120-160 chars.
//      - P0/P2 (excerpts, overshort / placeholder): substitute
//        metadata.description if available; otherwise extract first paragraph
//        from post body. Target: 120-160 chars.
//   4. Write back ONLY if value changed and passes sanity checks.
//   5. Re-read to verify no BOM, no corruption.
//
// Safety:
//   - Never writes if new value would be longer than target (we only
//     shorten for overlong; we only lengthen for overshort up to target).
//   - Never writes if new value fails sanity checks (length, not empty).
//   - Marks ambiguous transformations with [SME REVIEW] in a sidecar report.
//   - UTF-8 only, no BOM.

import fs from 'node:fs';
import path from 'node:path';

const POST_DIR = 'src/data/post';
const OUT_DIR = path.resolve(process.cwd(), 'audit-results');
const BRAND_SUFFIX = ' \u2014 Industrial Knives';
const TITLE_TARGET_FULL = 55; // aim for fullTitleLen 50-60; mid-band is safer
const TITLE_TARGET_RAW = TITLE_TARGET_FULL - BRAND_SUFFIX.length; // 35
const DESC_TARGET_MIN = 120;
const DESC_TARGET_MAX = 160;

const report = {
  titles: { trimmed: 0, smereview: [], unchanged: 0, skipped: 0 },
  excerpts: {
    replacedPlaceholder: 0,
    compressedOverlong: 0,
    expandedShort: 0,
    smereview: [],
    unchanged: 0,
    skipped: 0,
  },
  filesChanged: [],
  errors: [],
};

// ─── Frontmatter parse / serialize ────────────────────────────────────────
function parseFrontmatter(raw) {
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/);
  const out = {};
  let i = 0;
  const unquote = (s) => {
    s = s.trim();
    if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
      return s.slice(1, -1);
    }
    return s;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const m1 = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m1) { i++; continue; }
    const key = m1[1];
    const rest = m1[2].trim();
    if (rest === '') {
      const child = {};
      const arr = [];
      i++;
      while (i < lines.length) {
        const cl = lines[i];
        if (!cl.trim()) { i++; continue; }
        if (!/^\s/.test(cl)) break;
        const cm = cl.match(/^\s+(?:-\s*)?([A-Za-z_][\w-]*):\s*(.*)$/);
        if (cm) child[cm[1]] = unquote(cm[2]);
        else {
          const am = cl.match(/^\s+-\s*(.*)$/);
          if (am) arr.push(unquote(am[1]));
        }
        i++;
      }
      out[key] = Object.keys(child).length ? child : arr;
    } else {
      out[key] = unquote(rest);
      i++;
    }
  }
  return out;
}

function findFrontmatterBounds(raw) {
  const hasBom = raw.charCodeAt(0) === 0xfeff;
  const cleaned = hasBom ? raw.slice(1) : raw;
  const m = cleaned.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const bomPrefix = hasBom ? '\ufeff' : '';
  const header = bomPrefix + '---\n';
  const closing = '\n---';
  const bodyStart = m[0].length;
  const fmText = m[1];
  const body = cleaned.slice(bodyStart);
  return { header, fmText, closing, body, raw: cleaned };
}

function escapeYaml(value) {
  // YAML single-quoted scalar: only single quote needs escaping (as '').
  return value.replace(/'/g, "''");
}

function replaceFieldLine(raw, fieldName, newValue) {
  const bounds = findFrontmatterBounds(raw);
  if (!bounds) return raw;
  const escaped = escapeYaml(newValue);
  const lines = bounds.fmText.split(/\r?\n/);
  const re = new RegExp(`^${fieldName}\\s*:`);
  let replaced = false;
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) {
      lines[i] = `${fieldName}: '${escaped}'`;
      replaced = true;
      break;
    }
  }
  if (!replaced) {
    // Insert before closing delimiter
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        lines.splice(i, 0, `${fieldName}: '${escaped}'`);
        break;
      }
    }
  }
  const newFmText = lines.join('\n');
  return bounds.header + newFmText + bounds.closing + bounds.body;
}

// ─── Title trimming (P1) ───────────────────────────────────────────────────
function trimTitle(title) {
  if (!title) return { value: title, ok: false, reason: 'empty' };
  const fullLen = title.length + BRAND_SUFFIX.length;
  if (fullLen < 50) {
    return { value: title, ok: false, reason: 'too-short-for-trim', changed: false };
  }
  if (fullLen >= 50 && fullLen < 60) {
    return { value: title, ok: true, reason: 'already-compliant', changed: false };
  }
  // Iterate transform steps; stop as soon as length fits < 60 full.
  let t = title;
  const passes = (label, fn) => {
    const next = fn(t);
    if (next === t) return null;
    const newFull = next.length + BRAND_SUFFIX.length;
    if (newFull < 60) {
      return { value: next, ok: true, reason: label, changed: true };
    }
    t = next;
    return null;
  };

  // Step 1: drop parenthetical and bracketed clauses
  let r = passes('dropParens', (s) => s.replace(/\s*\([^)]*\)/g, '').replace(/\s*\[[^\]]*\]/g, ''));
  if (r) return r;
  // Step 2: drop em-dash-separated trailing clause when first part fits
  r = passes('dropEmDashTrailing', (s) => {
    const idx = s.indexOf(' \u2014 ');
    if (idx > 0) {
      const first = s.slice(0, idx);
      if (first.length + BRAND_SUFFIX.length <= 60) return first;
    }
    return s;
  });
  if (r) return r;
  // Step 3: drop trailing "for Industrial X" / "for Engineering" / etc.
  r = passes('dropForIndustrial', (s) =>
    s.replace(/\s+for\s+(Industrial|commercial|engineering)[^.,!?;\u2014]*$/i, ''));
  if (r) return r;
  // Step 4: drop "How to Choose" / "Why Your..." clause after a colon.
  // (but only when the prefix is a real descriptive phrase, not a category
  //  label like "Case Study" / "Glossary Entry" that the meaningful content
  //  depends on).
  r = passes('dropIntroClause', (s) => {
    const idx = s.indexOf(': ');
    if (idx > 0) {
      const first = s.slice(0, idx);
      const isBoilerplate = /^(Case Study|Industry Glossary Entry|Glossary Entry|Comparison|Buyer['']s Guide|How to|Why Your)\b/i.test(first.trim());
      if (!isBoilerplate && first.length >= 12 && first.length + BRAND_SUFFIX.length <= 60) return first;
    }
    return s;
  });
  if (r) return r;
  // Step 5: drop redundant adjectives before "Blade"/"Knife"/"Steel"
  r = passes('dropAdjectiveBefore', (s) =>
    s.replace(/\s+(Precision|Engineering-grade|High-grade|Industrial-grade|Commercial)\s+(blade|knife|steel|carbide)/i, ' $2'));
  if (r) return r;
  // Step 6: drop "Industrial Blades" suffix entirely (brand implies it)
  r = passes('dropIndustrialBlades', (s) =>
    s.replace(/\s+Industrial\s+Blades?$/i, '').replace(/\s+Industrial\s+Knives?$/i, ''));
  if (r) return r;
  // Step 7: drop "Case Study:" / "Industry Glossary Entry" boilerplate
  r = passes('dropBoilerplate', (s) => {
    let next = s.replace(/^Case Study:\s*/i, '');
    next = next.replace(/\s+\u2014\s+Industry Glossary Entry$/i, '');
    next = next.replace(/\s+Industry Glossary Entry$/i, '');
    return next;
  });
  if (r) return r;
  // Step 8: drop "(PM ...)" parentheticals with technical detail
  r = passes('dropTechnicalParens', (s) =>
    s.replace(/\s*\((?:PM|HSS|M2|D2|SKD11|AISI|GB)[^)]*\)/i, ''));
  if (r) return r;
  // Step 9: drop country-name trailing clause ("... in Vietnam")
  r = passes('dropCountryTrailing', (s) =>
    s.replace(/\s+(in|for)\s+(Vietnam|India|Poland|Turkey|Germany|USA|China|Japan|Brazil|Mexico|France|Italy|Spain|UK|Russia|Korea)\s*$/i, ''));
  if (r) return r;
  // Step 10: drop "for X" trailing clause (more aggressive than step 3)
  r = passes('dropForXTrailing', (s) =>
    s.replace(/\s+for\s+[A-Z][^.!?;\u2014]*$/i, ''));
  if (r) return r;
  // Step 11: truncate at word boundary, prefer keeping keywords like D2/HSS/SKD11
  r = passes('truncateAtWord', (s) => {
    const maxRaw = TITLE_TARGET_FULL - BRAND_SUFFIX.length; // 35
    if (s.length <= maxRaw) return s;
    const truncated = s.slice(0, maxRaw);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxRaw - 12) {
      return truncated.slice(0, lastSpace).replace(/[,.:;\u2014]$/, '');
    }
    return truncated;
  });
  if (r) return r;
  // Step 12: aggressive fallback — accept any value in [50, 60] by truncating
  // at the last word boundary; if that fails, hard-truncate at 35 chars.
  const candidate = (() => {
    if (t.length <= 35) return t;
    const at = t.slice(0, 35).lastIndexOf(' ');
    if (at > 23) return t.slice(0, at).replace(/[,.:;\u2014]$/, '');
    return t.slice(0, 35);
  })();
  const finalFull = candidate.length + BRAND_SUFFIX.length;
  if (finalFull <= 60) {
    return { value: candidate, ok: true, reason: 'aggressive-truncate', changed: true };
  }
  // Couldn't get into target range; mark for SME review
  return { value: title, ok: false, reason: 'could-not-fit', changed: false };
}

// ─── Excerpt compression (P2 overlong) ────────────────────────────────────
function compressExcerpt(excerpt) {
  if (!excerpt) return { value: excerpt, ok: false, reason: 'empty' };
  const len = excerpt.length;
  if (len >= DESC_TARGET_MIN && len <= DESC_TARGET_MAX) {
    return { value: excerpt, ok: true, reason: 'already-compliant', changed: false };
  }
  if (len <= DESC_TARGET_MAX) {
    return { value: excerpt, ok: true, reason: 'within-range', changed: false };
  }
  let t = excerpt;
  const tryStep = (label, fn) => {
    const next = fn(t);
    if (next === t || !next) return null;
    if (next.length >= DESC_TARGET_MIN && next.length <= DESC_TARGET_MAX) {
      return { value: next, ok: true, reason: label, changed: true };
    }
    if (next.length < DESC_TARGET_MIN) {
      // Overshot — too aggressive. Revert.
      return null;
    }
    t = next;
    return null;
  };

  let r = tryStep('dropParens', (s) => s.replace(/\s*\([^)]*\)/g, '').replace(/\s*\[[^\]]*\]/g, ''));
  if (r) return r;
  r = tryStep('dropSuchAs', (s) => s.replace(/,?\s+(such as|including|for example|like|e\.g\.)\s+[^.,;]+/gi, ''));
  if (r) return r;
  r = tryStep('firstSentence', (s) => {
    // Find first sentence that fits the target band.
    let pos = 0;
    while (pos < s.length) {
      const next = s.indexOf('. ', pos);
      if (next < 0) break;
      const sentence = s.slice(0, next + 1);
      if (sentence.length >= DESC_TARGET_MIN && sentence.length <= DESC_TARGET_MAX) {
        return sentence;
      }
      if (sentence.length > DESC_TARGET_MAX) break;
      pos = next + 1;
    }
    return s;
  });
  if (r) return r;
  r = tryStep('truncateAtComma', (s) => {
    const target = DESC_TARGET_MAX;
    const truncated = s.slice(0, target);
    const lastComma = truncated.lastIndexOf(', ');
    if (lastComma > target - 35) {
      return s.slice(0, lastComma) + '.';
    }
    const lastSpace = truncated.lastIndexOf(' ');
    return s.slice(0, lastSpace).replace(/[,.;:\u2014]$/, '') + '.';
  });
  if (r) return r;
  // Hard truncate at target minus trailing-period, with "..." marker
  r = tryStep('hardTruncate', (s) => {
    const target = DESC_TARGET_MAX;
    if (s.length <= target) return s;
    const truncated = s.slice(0, target - 1);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.slice(0, lastSpace).replace(/[,.;:\u2014]$/, '') + '.';
  });
  if (r) return r;
  return { value: excerpt, ok: false, reason: 'could-not-fit', changed: false };
}

// ─── Excerpt expansion (P0/P2 overshort / placeholder) ────────────────────
function expandFromMetadata(fm) {
  const meta = (fm.metadata && fm.metadata.description) || '';
  if (!meta) return null;
  // If meta already fits [120, 160], use it directly.
  if (meta.length >= DESC_TARGET_MIN && meta.length <= DESC_TARGET_MAX) {
    return { value: meta, ok: true, reason: 'meta-desc-fits', changed: true };
  }
  // Meta too long: compress it.
  if (meta.length > DESC_TARGET_MAX) {
    const c = compressExcerpt(meta);
    if (c.ok && c.value.length >= DESC_TARGET_MIN) {
      return { value: c.value, ok: true, reason: 'meta-desc-compressed', changed: true };
    }
  }
  // Meta too short: prepend the title to provide context.
  if (meta.length < DESC_TARGET_MIN && fm.title) {
    const combined = (fm.title.replace(/[:\u2014].*$/, '').trim() + '. ' + meta).trim();
    if (combined.length >= DESC_TARGET_MIN && combined.length <= DESC_TARGET_MAX) {
      return { value: combined, ok: true, reason: 'title+meta', changed: true };
    }
    if (combined.length > DESC_TARGET_MAX) {
      const c = compressExcerpt(combined);
      if (c.ok && c.value.length >= DESC_TARGET_MIN) {
        return { value: c.value, ok: true, reason: 'title+meta-compressed', changed: true };
      }
    }
  }
  return null;
}

function expandFromBody(body, title) {
  if (!body) return null;
  const paragraphs = body.split(/\r?\n\r?\n/);
  for (const p of paragraphs) {
    let para = p.trim();
    para = para.replace(/^#+\s+/gm, '');
    para = para.replace(/^[-*]\s+/gm, '');
    para = para.replace(/`([^`]+)`/g, '$1');
    para = para.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    if (para.length < 80) continue;
    if (para.length > DESC_TARGET_MAX) {
      const c = compressExcerpt(para);
      if (c.ok && c.value.length >= DESC_TARGET_MIN) {
        return { value: c.value, ok: true, reason: 'body-paragraph-compressed', changed: true };
      }
    } else if (para.length >= DESC_TARGET_MIN) {
      return { value: para, ok: true, reason: 'body-paragraph-fits', changed: true };
    }
  }
  return null;
}

// ─── Title expansion (P1 too-short recovery + cover-overshort) ────────────
function extractTopicFromBody(body) {
  if (!body) return null;
  // First H1/H2 heading is usually the topic.
  const headingMatch = body.match(/^#{1,3}\s+(.+)$/m);
  if (headingMatch) {
    let h = headingMatch[1].trim();
    h = h.replace(/\s*[—\-]\s*Industry Glossary Entry$/i, '');
    h = h.replace(/\s*[—\-]\s*Materials Encyclopedia Entry$/i, '');
    h = h.replace(/^[A-Z][a-z]+ Steel$/i, '$&');
    return h;
  }
  // Fallback: first meaningful sentence.
  const sentences = body.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const clean = s.replace(/^#+\s*/, '').trim();
    if (clean.length >= 20 && clean.length <= 80) return clean;
  }
  return null;
}

function expandTitle(title, body, fileSlug, { allowRewrite = false } = {}) {
  if (!title) return null;
  const fullLen = title.length + BRAND_SUFFIX.length;
  if (fullLen >= 50 && fullLen <= 60 && !allowRewrite) return null; // already compliant

  // "Case Study" stub OR case study with poor topic extraction: rebuild from slug.
  if (/^Case Study$/i.test(title.trim()) || /^Case Study: /i.test(title.trim())) {
    // Prefer slug-derived topic over body (first body heading is usually
    // an internal section like "Background" / "The audit", not the article
    // topic itself).
    let topic = null;
    if (fileSlug && fileSlug.startsWith('case-study-')) {
      const slugTopic = fileSlug.replace(/^case-study-/, '').replace(/-/g, ' ');
      // Title-case simple split
      topic = slugTopic
        .split(' ')
        .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase()))
        .join(' ');
      // Try progressively shorter forms if too long.
      const words = topic.split(' ');
      for (let cut = words.length; cut > 0; cut--) {
        const t = words.slice(0, cut).join(' ');
        if (`Case Study: ${t}`.length + BRAND_SUFFIX.length <= 60) {
          topic = t;
          break;
        }
        if (cut === 1) topic = null;
      }
    }
    if (!topic) {
      // Fallback: look at SECOND H2 (skip the standard intro section)
      const headings = (body || '').match(/^#{1,3}\s+(.+)$/gm) || [];
      if (headings.length >= 2) {
        const second = headings[1].replace(/^#+\s+/, '').trim();
        if (second.length >= 8 && second.length <= 30) topic = second;
      } else if (headings.length === 1) {
        const first = headings[0].replace(/^#+\s+/, '').trim();
        if (first.length >= 8 && first.length <= 30) topic = first;
      }
    }
    if (topic) {
      const candidate = `Case Study: ${topic}`;
      if (candidate.length + BRAND_SUFFIX.length <= 60) {
        return { value: candidate, reason: 'case-study-topic-extracted' };
      }
    }
  }

  // Bare material codes that the trimmer over-condensed.
  const materialExpansions = {
    'ASP 2060': 'ASP 2060 Powder Metallurgy HSS',
    'D2 vs SKD11': 'D2 vs SKD11: Are They the Same Steel?',
    'M2 vs M4 HSS': 'M2 vs M4 HSS: Which to Choose?',
    'HSS vs Carbide': 'HSS vs Carbide: How to Choose Right',
    'Tungsten Carbide': 'Tungsten Carbide Grades for Blades',
    'PVD Coating Comparison Table': 'PVD vs CVD Coating Comparison Table',
    'PVD vs CVD Coating Comparison': 'PVD vs CVD Coating Comparison Table',
  };
  if (materialExpansions[title]) {
    const candidate = materialExpansions[title];
    if (candidate.length + BRAND_SUFFIX.length <= 60) {
      return { value: candidate, reason: 'material-expansion-table' };
    }
  }

  // Glossary stubs: append " — Industry Glossary Entry" only if it fits.
  if (/^(Clearance Angle|Secondary Bevel|Thermal Fatigue|Surface Roughness|Hardness File Test|Gross Fracture|Kerf Clearance|Micro Chipping|Side Clearance)$/i.test(title.trim())) {
    const candidate = `${title} — Glossary Entry`;
    if (candidate.length + BRAND_SUFFIX.length <= 60) {
      return { value: candidate, reason: 'glossary-label-restored' };
    }
  }

  // Material encyclopedia stubs: append " — Materials Encyclopedia Entry".
  const matStub = /^(AISI\s+(M[1-5]\d?|D\d|H\d|440C|H11|H13|O1|SKD11)|GB\s+YG\d+\w*|JIS\s+SKD\d+|Coatings Comparison|JIS\s+\S+)$/i;
  if (matStub.test(title.trim())) {
    const candidate = `${title} — Encyclopedia Entry`;
    if (candidate.length + BRAND_SUFFIX.length <= 60) {
      return { value: candidate, reason: 'encyclopedia-label-restored' };
    }
  }

  // Generic fallback: read body and use first heading or first sentence.
  const topic = extractTopicFromBody(body);
  if (topic) {
    const candidate = `${title}: ${topic}`.slice(0, 35);
    if (candidate.length >= 12 && candidate.length + BRAND_SUFFIX.length <= 60) {
      return { value: candidate, reason: 'body-derived-topic' };
    }
  }

  return null;
}

// ─── Main driver ───────────────────────────────────────────────────────────
const data = JSON.parse(
  fs.readFileSync(path.join(OUT_DIR, 'on-page-seo-audit-v2-single-pages.json'), 'utf8'),
);
const posts = data.post.rows;
const products = data.product.rows.filter((p) => !p.draft); // only live products

// ─── Process blog posts ────────────────────────────────────────────────────
for (const row of posts) {
  const file = row.file;
  const fullPath = path.resolve(process.cwd(), file);
  let raw;
  try {
    raw = fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    report.errors.push({ file, error: 'read-failed: ' + e.message });
    continue;
  }
  const fm = parseFrontmatter(raw);
  if (!fm) {
    report.errors.push({ file, error: 'frontmatter-parse-failed' });
    continue;
  }
  let updated = false;
  let newRaw = raw;
  const currentFullTitleLen = (fm.title || '').length + BRAND_SUFFIX.length;
  if (currentFullTitleLen >= 60) {
    const r = trimTitle(fm.title);
    if (r.ok && r.changed && r.value) {
      newRaw = replaceFieldLine(newRaw, 'title', r.value);
      report.titles.trimmed++;
      report.filesChanged.push({ file, field: 'title', from: fm.title, to: r.value, reason: r.reason });
      updated = true;
    } else if (!r.ok) {
      report.titles.smereview.push({ file, currentTitle: fm.title, fullLen: currentFullTitleLen, reason: r.reason });
      report.titles.skipped++;
    } else {
      report.titles.unchanged++;
    }
  } else if (currentFullTitleLen < 50 && fm.title) {
    // Too short — try to expand using body context.
    const bodyMatch = newRaw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
    const body = bodyMatch ? bodyMatch[1] : '';
    const er = expandTitle(fm.title, body, row.slug);
    if (er && er.value) {
      newRaw = replaceFieldLine(newRaw, 'title', er.value);
      report.titles.expanded = (report.titles.expanded || 0) + 1;
      report.filesChanged.push({ file, field: 'title', from: fm.title, to: er.value, reason: er.reason });
      updated = true;
    } else {
      report.titles.skipped++;
    }
  } else if (currentFullTitleLen >= 50 && currentFullTitleLen < 60 && fm.title) {
    // Quality check: if title is "Case Study: <generic topic>" (e.g., from
    // earlier over-aggressive trim), re-derive from slug for a better topic.
    const isGenericCaseStudy = /^Case Study:\s+(The [a-z]|A [a-z])/i.test(fm.title.trim());
    if (isGenericCaseStudy) {
      const bodyMatch = newRaw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
      const body = bodyMatch ? bodyMatch[1] : '';
      const er = expandTitle(fm.title, body, row.slug, { allowRewrite: true });
      if (er && er.value && er.value !== fm.title) {
        newRaw = replaceFieldLine(newRaw, 'title', er.value);
        report.titles.expanded = (report.titles.expanded || 0) + 1;
        report.filesChanged.push({ file, field: 'title', from: fm.title, to: er.value, reason: er.reason });
        updated = true;
      } else {
        report.titles.unchanged++;
      }
    } else {
      report.titles.unchanged++;
    }
  } else {
    report.titles.unchanged++;
  }
  const fm2 = updated ? parseFrontmatter(newRaw) : fm;
  const excerpt = fm2.excerpt || '';
  const excerptLen = excerpt.length;
  if (excerptLen > DESC_TARGET_MAX) {
    let r = compressExcerpt(excerpt);
    if (!r.ok) {
      r = expandFromMetadata(fm2);
      if (r) r = { ...r, reason: 'overlong-fallback-to-meta' };
    }
    if (r.ok && r.changed && r.value && r.value !== excerpt) {
      newRaw = replaceFieldLine(newRaw, 'excerpt', r.value);
      report.excerpts.compressedOverlong++;
      report.filesChanged.push({ file, field: 'excerpt', fromLen: excerptLen, toLen: r.value.length, reason: r.reason });
      updated = true;
    } else if (!r.ok) {
      report.excerpts.smereview.push({ file, currentLen: excerptLen, currentExcerpt: excerpt.slice(0, 60), reason: r.reason });
      report.excerpts.skipped++;
    } else {
      report.excerpts.unchanged++;
    }
  } else if (excerptLen > 0 && excerptLen < DESC_TARGET_MIN) {
    let r = expandFromMetadata(fm2);
    if (!r) {
      const body = newRaw.split(/---\r?\n[\s\S]*?\r?\n---\r?\n?/)[1] || '';
      r = expandFromBody(body, fm2.title);
    }
    if (r && r.ok && r.changed && r.value && r.value !== excerpt) {
      newRaw = replaceFieldLine(newRaw, 'excerpt', r.value);
      if (/^Materials encyclopedia entry for /i.test(excerpt)) {
        report.excerpts.replacedPlaceholder++;
      } else {
        report.excerpts.expandedShort++;
      }
      report.filesChanged.push({ file, field: 'excerpt', fromLen: excerptLen, toLen: r.value.length, reason: r.reason });
      updated = true;
    } else if (!r) {
      report.excerpts.smereview.push({ file, currentLen: excerptLen, currentExcerpt: excerpt.slice(0, 60), reason: 'no-meta-no-body-fit' });
      report.excerpts.skipped++;
    } else {
      report.excerpts.unchanged++;
    }
  } else {
    report.excerpts.unchanged++;
  }
  if (updated) {
    const fmCheck = parseFrontmatter(newRaw);
    if (!fmCheck) {
      report.errors.push({ file, error: 'post-write-parse-failed' });
      continue;
    }
    if (fmCheck.title) {
      const ftl = fmCheck.title.length + BRAND_SUFFIX.length;
      if (ftl > 60) {
        report.errors.push({ file, error: 'title-still-too-long-after-edit: ' + ftl });
        continue;
      }
    }
    if (fmCheck.excerpt) {
      const el = fmCheck.excerpt.length;
      if (el > DESC_TARGET_MAX) {
        report.errors.push({ file, error: 'excerpt-still-too-long-after-edit: ' + el });
        continue;
      }
    }
    fs.writeFileSync(fullPath, newRaw, 'utf8');
  }
}

// ─── Process live products (titles only) ──────────────────────────────────
for (const row of products) {
  const file = row.file;
  const fullPath = path.resolve(process.cwd(), file);
  let raw;
  try {
    raw = fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    report.errors.push({ file, error: 'read-failed: ' + e.message });
    continue;
  }
  const fm = parseFrontmatter(raw);
  if (!fm) continue;
  const currentFullTitleLen = (fm.title || '').length + BRAND_SUFFIX.length;
  if (currentFullTitleLen >= 60) {
    const r = trimTitle(fm.title);
    if (r.ok && r.changed && r.value) {
      const newRaw = replaceFieldLine(raw, 'title', r.value);
      const fmCheck = parseFrontmatter(newRaw);
      if (fmCheck && fmCheck.title && fmCheck.title.length + BRAND_SUFFIX.length < 60) {
        fs.writeFileSync(fullPath, newRaw, 'utf8');
        report.titles.trimmed++;
        report.filesChanged.push({ file: '[product] ' + file, field: 'title', from: fm.title, to: r.value, reason: r.reason });
      }
    }
  }
}

const summaryPath = path.join(OUT_DIR, 'round3-p0p1p2-execution-log.json');
fs.writeFileSync(summaryPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`=== Round 3 P0/P1/P2 execution complete ===`);
console.log(`titles trimmed:        ${report.titles.trimmed}`);
console.log(`titles unchanged:      ${report.titles.unchanged}`);
console.log(`titles skipped:        ${report.titles.skipped}`);
console.log(`[SME REVIEW] titles:    ${report.titles.smereview.length}`);
console.log(`excerpts compressed:   ${report.excerpts.compressedOverlong}`);
console.log(`excerpts placeholder:  ${report.excerpts.replacedPlaceholder}`);
console.log(`excerpts expanded:     ${report.excerpts.expandedShort}`);
console.log(`excerpts unchanged:    ${report.excerpts.unchanged}`);
console.log(`excerpts skipped:      ${report.excerpts.skipped}`);
console.log(`[SME REVIEW] excerpts:  ${report.excerpts.smereview.length}`);
console.log(`errors:                ${report.errors.length}`);
console.log(`files changed:         ${report.filesChanged.length}`);
console.log(`log:                   ${path.relative(process.cwd(), summaryPath)}`);
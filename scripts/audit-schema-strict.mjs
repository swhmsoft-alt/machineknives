// scripts/audit-schema-strict.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Zero-Trust Schema Architecture — CI/CD 反向审计 (Phase 0: BASELINE ONLY)
// 阶段 0 只打印基线数据，process.exit(0)；阶段 1 启用 process.exit(1) 严格阻断。
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { glob } from 'glob';

// ─── 路由白名单（基于 src/pages 实际目录）─────────────────────────────────
const SCHEMA_PERMISSIONS = {
  '/products/':   ['Product', 'CollectionPage', 'BreadcrumbList', 'FAQPage', 'HowTo', 'WebPage', 'ItemList'],
  '/services/':   ['Service', 'Article', 'CollectionPage', 'BreadcrumbList', 'FAQPage', 'HowTo', 'WebPage', 'ItemList'],
  '/industries/': ['Article', 'CollectionPage', 'BreadcrumbList', 'FAQPage', 'WebPage', 'ItemList'],
};

// 未知路径的兜底白名单（绝对禁止 Product / Offer / Service 等高危商业实体）
const SAFE_FALLBACK_TYPES = ['WebPage', 'Article', 'BreadcrumbList', 'FAQPage', 'ItemList', 'AboutPage', 'ContactPage'];

// 通用全局实体 + 常见嵌套类型（任何页面都允许）
// - Organization/WebSite/ImageObject/SearchAction：顶层全局实体
// - ListItem/HowToStep/Question/Answer/Offer/ContactPoint/ContactPage：
//   这些是作为 @graph 内嵌套实体出现的，不应被算作越权
const GLOBAL_TYPES = [
  'Organization', 'WebSite', 'ImageObject', 'SearchAction',
  'ListItem', 'HowToStep', 'Question', 'Answer', 'Offer',
  'ContactPoint', 'ContactPage', 'Brand', 'Person', 'Country',
  'PostalAddress', 'GeoCoordinates', 'OpeningHoursSpecification',
];

// 阈值（基线后调整）
const EXPECTED_MAX_PRODUCTS = 300;

// 模式开关（true = 严格阻断；false = 仅打印基线）
const STRICT_MODE = false; // ← 阶段 0：false ；阶段 1 切换为 true

const JSON_LD_RE = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
const AT_TYPE_RE = /"@type"\s*:\s*"([^"]+)"/g;

function extractTypes(jsonText) {
  const types = [];
  let m;
  while ((m = AT_TYPE_RE.exec(jsonText)) !== null) types.push(m[1]);
  return types;
}

function classifyRoute(relPath) {
  // 兼容 Windows 反斜杠：先把 \ 全部转成 /
  const normalizedInput = relPath.replace(/\\/g, '/');
  // 去掉第一段（如 dist/ 或 dist-test/）
  const stripped = normalizedInput.replace(/^[^/]+\//, '');
  const normalized = '/' + stripped
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '');
  for (const prefix of Object.keys(SCHEMA_PERMISSIONS)) {
    if (normalized.includes(prefix)) {
      return { matched: prefix, allowed: SCHEMA_PERMISSIONS[prefix], isKnown: true };
    }
  }
  return { matched: null, allowed: SAFE_FALLBACK_TYPES, isKnown: false };
}
function audit() {
  // 支持 DIST_DIR 环境变量，便于本地测试驱动（如 DIST_DIR=dist-test node scripts/audit-schema-strict.mjs）
  const DIST_DIR = process.env.DIST_DIR || 'dist';

  if (!fs.existsSync(DIST_DIR)) {
    console.warn(`⚠️  ${DIST_DIR}/ 目录不存在，请先运行 \`npm run build\`。本次跳过审计。`);
    process.exit(0);
  }

  const htmlFiles = glob.sync(`${DIST_DIR}/**/*.html`, { ignore: [`${DIST_DIR}/_astro/**`] });
  if (htmlFiles.length === 0) {
    console.warn(`⚠️  未在 ${DIST_DIR}/ 找到任何 HTML 产物。`);
    process.exit(0);
  }

  console.log('🔍 [Schema 零信任反向审计] 启动...');
  console.log(`   扫描目标: dist/**/*.html  (共 ${htmlFiles.length} 个文件)\n`);

  const stats = {
    totalFiles: htmlFiles.length,
    filesWithSchema: 0,
    typeCounts: {},
    productRoutes: new Map(),
    productOutOfWhitelist: [],
    fallbackUsed: new Map(),
  };

  let errors = 0;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const jsonLdBlocks = [...html.matchAll(JSON_LD_RE)].map(m => m[1]);
    if (jsonLdBlocks.length === 0) continue;

    stats.filesWithSchema++;
    const { allowed, isKnown } = classifyRoute(file);

    for (const block of jsonLdBlocks) {
      const types = extractTypes(block);
      for (const type of types) {
        stats.typeCounts[type] = (stats.typeCounts[type] || 0) + 1;

        if (type === 'Product') {
          stats.productRoutes.set(file, (stats.productRoutes.get(file) || 0) + 1);
          if (!isKnown || !allowed.includes('Product')) {
            stats.productOutOfWhitelist.push({ file, type, allowed, isKnown });
            errors++;
          }
        }

        if (GLOBAL_TYPES.includes(type)) continue;

        if (!isKnown) {
          if (!SAFE_FALLBACK_TYPES.includes(type)) {
            stats.fallbackUsed.set(file, (stats.fallbackUsed.get(file) || 0) + 1);
          }
        } else if (!allowed.includes(type)) {
          stats.productOutOfWhitelist.push({ file, type, allowed, isKnown });
          errors++;
        }
      }
    }
  }

  console.log('📊 基线数据报告');
  console.log('─────────────────────────────────────────────');
  console.log(`扫描文件总数       : ${stats.totalFiles}`);
  console.log(`含 JSON-LD 文件数  : ${stats.filesWithSchema}`);
  console.log(`\n📈 实体 @type 出现频次:`);
  const sortedTypes = Object.entries(stats.typeCounts).sort((a, b) => b[1] - a[1]);
  for (const [t, n] of sortedTypes) console.log(`   ${t.padEnd(22)} ${n}`);
  console.log(`\n🛍  Product 实体总数: ${[...stats.productRoutes.values()].reduce((a, b) => a + b, 0)}`);
  console.log(`   合法 Product 路径数: ${stats.productRoutes.size}`);
  console.log(`   越权 Product 实体数: ${stats.productOutOfWhitelist.length}`);

  if (stats.productOutOfWhitelist.length > 0) {
    console.log('\n❌ 越权实体明细 (前 10 条):');
    for (const v of stats.productOutOfWhitelist.slice(0, 10)) {
      console.log(`   - ${v.file}`);
      console.log(`     @type=${v.type}  allowed=${v.allowed.join(',')}`);
    }
  }

  if (stats.fallbackUsed.size > 0) {
    console.log(`\n⚠️  兜底路径中使用了非 SAFE 类型 (${stats.fallbackUsed.size} 个文件，前 5 条):`);
    let i = 0;
    for (const f of stats.fallbackUsed.keys()) {
      if (i++ >= 5) break;
      console.log(`   - ${f}`);
    }
  }

  const totalProducts = [...stats.productRoutes.values()].reduce((a, b) => a + b, 0);
  console.log('\n─────────────────────────────────────────────');

  if (STRICT_MODE) {
    if (errors > 0) {
      console.error(`\n❌ [CI 拦截] 检测到 ${errors} 处非法 @type 实体！请修复后重新构建。`);
      process.exit(1);
    }
    if (totalProducts > EXPECTED_MAX_PRODUCTS) {
      console.error(`\n❌ [CI 拦截] Product 实体总数 ${totalProducts} 超出警戒水位 ${EXPECTED_MAX_PRODUCTS}！`);
      process.exit(1);
    }
    console.log(`\n✅ CI 审计通过 (STRICT MODE)。Product 实体数: ${totalProducts}`);
  } else {
    console.log(`\nℹ️  当前为 BASELINE 模式 (STRICT_MODE=false)，仅打印数据，不阻断 build。`);
    console.log(`   下一步: 确认基线无异常后，将 STRICT_MODE 改为 true 即可启用部署熔断。`);
  }
}

audit();
// 临时测试文件 — 验证 generatePageSchema / validateSchemaGraph 的拦截逻辑
import {
  generatePageSchema,
  validateSchemaGraph,
  buildProductDetail,
  buildBreadcrumb,
  buildFaqPage,
} from './src/lib/schema.ts';

let passed = 0;
let failed = 0;

function expectThrow(label: string, fn: () => unknown): void {
  try {
    fn();
    console.error(`❌ ${label}: 期望抛错但没抛`);
    failed++;
  } catch (e) {
    const msg = (e as Error).message;
    if (msg.includes('Schema 拦截')) {
      console.log(`✅ ${label}: 抛错符合预期`);
      passed++;
    } else {
      console.error(`❌ ${label}: 抛了错但不是 Schema 拦截：${msg}`);
      failed++;
    }
  }
}

function expectOk(label: string, fn: () => unknown): void {
  try {
    fn();
    console.log(`✅ ${label}: 通过`);
    passed++;
  } catch (e) {
    console.error(`❌ ${label}: 不应抛错但抛了：${(e as Error).message}`);
    failed++;
  }
}

// ── 场景 1：合法 product 详情页 ──
expectOk('合法 product 详情页', () => {
  generatePageSchema('product-detail', '/products/slitter-blade/', () => [
    buildBreadcrumb([{ name: 'Home', url: '/' }, { name: 'Slitter', url: '/products/slitter-blade/' }]),
    buildProductDetail({ name: 'Slitter Blade', sku: 'SB-001', price: 1250 }),
  ]);
});

// ── 场景 2：合法 product hub ──
expectOk('合法 product hub', () => {
  generatePageSchema('product-hub', '/products/', () => [
    buildBreadcrumb([{ name: 'Home', url: '/' }, { name: 'Products', url: '/products/' }]),
    { '@type': 'CollectionPage', name: 'Products Hub' },
  ]);
});

// ── 场景 3：合法 service ──
expectOk('合法 service', () => {
  generatePageSchema('service-detail', '/services/consulting/', () => [
    { '@type': 'Service', name: 'Consulting' },
  ]);
});

// ── 场景 4：越权 — /services/ 路径出现 Product ──
expectThrow('越权 — /services/ 出现 Product', () => {
  generatePageSchema('service-detail', '/services/consulting/', () => [
    { '@type': 'Service', name: 'Consulting' },
    buildProductDetail({ name: 'Mispriced Service', price: 100 }),  // 越权！
  ]);
});

// ── 场景 5：未注册路径出现 Product ──
expectThrow('未注册路径 /merch/ 出现 Product', () => {
  generatePageSchema('webpage', '/merch/', () => [
    buildProductDetail({ name: 'Branded Mug', price: 25 }),  // 兜底路径禁 Product
  ]);
});

// ── 场景 6：未注册路径用安全类型 ──
expectOk('未注册路径用安全 Article', () => {
  generatePageSchema('blog-post', '/blog/foo/', () => [
    { '@type': 'BlogPosting', headline: 'Foo' },
    buildFaqPage([{ q: 'A', a: 'B' }]),
  ]);
});

// ── 场景 7：直接调用 validateSchemaGraph ──
expectThrow('validateSchemaGraph 拦截 Product 在 /about/', () => {
  validateSchemaGraph('/about/', [{ '@type': 'Product', name: 'X' }]);
});

console.log(`\n📊 测试结果: ${passed} 通过 / ${failed} 失败`);
process.exit(failed > 0 ? 1 : 0);
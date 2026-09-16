# Prompt: bed-knife-tissue page

## 约束（硬规则）

仅基于 `src/data/facts/bed-knife-tissue.yaml` 生成内容。
禁止添加未定义的材料、工艺、认证、客户、产能数据。
禁止营销套话（"industry-leading", "best-in-class", "world-class" 等）。
禁止虚构尺寸、HRC、寿命数据（缺失时使用 `[MISSING SPECIFICATION]` 而非编造）。
每个 H2 下 2-4 句事实，然后跟表格或列表。
必须包含 facts.yaml 中 info_gain 的全部条目。
FAQ 必须 5-8 个 Q/A，全部从 facts.yaml 的 process_controls / compliance_controls 派生。

## 页面路径

`/products/straight/bed-knife-tissue/`

## H2 结构（固定 5 段）

1. Material Specification: D2 (HRC 60)
2. Manufacturing Process: Precision Grinding
3. Edge Geometry for 1200 m/min Tissue Lines
4. Quality and Traceability: ISO 9001:2015
5. FAQ

## 必含事实（来自 facts.yaml）

- D2 = high-carbon, high-chromium cold-work tool steel
- HRC 60（位于 HRC 58-62 区间内）
- Secondary hardening near 500 °C tempering
- Density ~7.7 g/cm³
- Elastic modulus ~200 GPa
- Thermal conductivity ~20-25 W/(m·K)（low）
- Austenitization 1000-1050 °C → air/oil quench → double temper
- Vacuum furnace prevents decarburization
- Inter-process datum: post-temper Rockwell C before precision grinding
- Distortion allowance 0.1-0.3 mm per side
- Sharp edge (<5μm) → thermal fatigue micro-cracking at 180 °C / 1200 m/min
- 15 μm micro-hone + 18° clearance → 11→34 days at 1200 m/min on 4-ply tissue
- Burr control ≤ 50 µm
- ISO 9001:2015 §8.5.2 traceability chain: incoming steel → mill cert → heat-treatment batch → final inspection

## 必查 forbidden 清单

- ASTM A681 / DIN 1.2379 / JIS G4404 / GB/T 1299 / EN ISO 4957 等标准编号
- SKD11 / M2 / tungsten carbide / H13 / A2 / O1 / S7 / W1 / 粉末冶金工具钢
- TiN / TiCN / TiAlN / AlCrN / CrN / DLC / 氮化 / 发黑 / 镀硬铬 / 化学镀镍
- Mazak / Okuma / DMG MORI / Haas / Makino / Studer / Walter / Jung / Okamoto / Ipsen / Seco/Warwick / Zeiss / Mitutoyo / Renishaw
- 营销套话（industry-leading / best-in-class / world-class / cutting-edge 等）
- 客户名、产能数字、地理分布细节（除 "four continents" / "since 1998"）

## 审核 checklist（部署前必跑）

- [ ] 全文事实可在 facts.yaml info_gain 中找到出处
- [ ] 无 forbidden 词汇出现
- [ ] FAQ Q/A 数量 5-8
- [ ] 含具体数字（HRC 60, 15μm, 18°, 1200 m/min, 180°C, 11→34 days, ≤50μm）
- [ ] ISO 9001:2015 §8.5.2 引用准确
- [ ] 无营销套话
- [ ] Schema.org: Product + FAQPage + BreadcrumbList 均注入

## 输出格式

Astro markdown body（写入 `src/data/product/bed-knife-tissue.md`）。
frontmatter 字段：title / excerpt / category / subcategories / bladeMaterial / hardness / applications / image / draft / metadata。
FAQ 数据来源：硬编码于 `src/data/_product-faqs.ts`（条件：`product.id === 'bed-knife-tissue'`）。
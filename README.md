# The AI Capital Buildout — Bilingual Paper Explainer / 论文解读站

An interactive, bilingual (English / 中文) reading companion for **NBER Working Paper 35865, "Financing the AI Buildout"** by Stijn Van Nieuwerburgh (Columbia Business School; forthcoming in *Brookings Papers on Economic Activity*, Fall 2026).

**Live:** <https://coffee-man666.github.io/financing-ai-buildout/> · Mirror: <https://financing-ai-buildout-production.up.railway.app/>

The paper's one-line claim: AI is not only a software story — it is the largest physical-capital investment cycle in U.S. history. A 1 GW AI campus costs about $41 billion; a 188 GW buildout through 2032 implies roughly $9 trillion of investment (3.2% of GDP per year), and as hyperscaler capex outruns operating cash flow, the financing is migrating into leases, joint ventures, project debt and special-purpose vehicles that move leverage off the operating companies' balance sheets.

## What this site does

- **Follows the paper's own narrative** — physical scale → historical comparison → the financing shift → the Hyperion/Beignet anatomy → off-balance-sheet leverage → risks → the revenue hurdle — while every number can be traced back to the source.
- **¶ provenance popups** — click any ¶ marker to see the verbatim English quote, PDF page and table number the figure comes from.
- **13 structured datasets** extracted from the paper (all 7 tables, Figure 1's series, and the quantitative facts scattered through the text and footnotes), downloadable as JSON.
- **Hand-rolled interactive charts** (zero dependencies, no chart library): historical boom comparison, capex-vs-OCF crossover, the 188.3 / 114.9 / 213.5 GW capacity decomposition, the Hyperion capital structure, CDS repricing, and more.
- **A scenario slider** for the paper's revenue-hurdle arithmetic (Appendix D): move required return, cash-flow margin and IT-equipment life, and watch the breakeven revenue and per-GPU-hour price recompute live.
- **8 derived insights** — cross-dataset computations the paper does not state outright (e.g. the 2026 capex–OCF gap is 1/26 of the off-balance-sheet stock; breakeven utilization ≈ 84% at Aug-2026 GPU prices). These live in a clearly-labeled "our exploration" section and are separated from the paper's own claims.

## Data integrity

Every number on the site went through a four-stage pipeline before publication:

1. **Extraction** — five parallel extractors transcribe the paper's tables and in-text figures into raw JSON, each value carrying a verbatim source quote and PDF page.
2. **Cleaning** — the raw files are normalized into 13 typed views (`data/*.json`).
3. **Independent verification** — five verifiers re-compared every numeric cell against the original text over two rounds (516 cells in round one), plus a deterministic gate of 29 invariants (table totals and key cells of Tables 1–7 and Figure 1). The site's appendix discloses the outcome.
4. **Recomputation** — each derived insight's arithmetic was independently recomputed from the verified views before being published.

Known limitation: Figure 1's per-company capex split is colored in the original figure but its values are not printed in the text, so `hyperscaler_capex` carries the aggregate series only.

## Repo structure

```
index.html   self-contained page (all site data inlined; works offline via file://)
app.js       rendering + interactions + charts (native SVG, no dependencies)
data/        the 16 JSON files: 13 verified datasets + insights + logic bus + manifest
.nojekyll    serve everything as-is
```

No build step, no dependencies, no network calls — open `index.html` directly in any browser, or serve the folder with any static server (`npx serve .`, `python3 -m http.server`).

## Disclaimer

This is an independent reading companion, not affiliated with, endorsed by, or reviewed by the paper's author or NBER. All paper data are transcribed from the public working paper for research and educational purposes; the paper is © 2026 by Stijn Van Nieuwerburgh. The "derived insights" section reflects this project's own computations from the paper's numbers, not claims made in the paper.

---

# 中文说明

本项目是 **NBER 工作论文 35865 号《Financing the AI Buildout》**（Stijn Van Nieuwerburgh，哥伦比亚商学院；即将刊于 *Brookings Papers on Economic Activity* 2026 年秋季刊）的**中英双语交互式解读站**。

论文一句话：AI 不只是软件故事，而是美国历史上最大的实体资本投资周期——1 GW AI 校区造价约 410 亿美元，2025–2032 年建成 188 GW 意味着近 9 万亿美元投资（年均占 GDP 3.2%）；随着超大规模厂商资本开支超过经营现金流，融资正迁移到租赁、合资、项目债与特殊目的载体，把杠杆移出经营公司报表。

## 站点功能

- **保留论文自身脉络**：物理规模 → 历史对比 → 融资转向 → Hyperion/Beignet 解剖 → 表外杠杆 → 风险 → 收入门槛，且每个数字都可回溯原文。
- **¶ 原文回溯**：点击任意 ¶ 角标，弹出该数字的英文原文引句、PDF 页码与表格编号。
- **13 个结构化数据集**：论文全部 7 张表格、图 1 序列以及散布在正文与脚注中的量化事实，JSON 可下载。
- **手写交互图表**（零依赖、无图表库）：历史热潮对比、capex 与 OCF 交叉点、188.3 / 114.9 / 213.5 GW 容量三去向分解、Hyperion 资本结构、CDS 重定价等。
- **收入门槛情景滑杆**（论文附录 D 算术）：调节要求回报率、现金流利润率与 IT 设备寿命，盈亏平衡收入与每 GPU 小时价格实时重算。
- **8 个衍生观点**：论文没有明说、但由已核对数据交叉算出的结论（如 2026 年 capex–OCF 缺口仅为表外存量的 1/26；按 2026 年 8 月租金价格的盈亏平衡利用率约 84%）。全部放在明确标注的"我们的探索"栏目，与论文原观点严格区隔。

## 数据可信度

每个数字发布前经过四段管线：**提取**（5 路并行，逐值带原文引句与页码）→ **清洗**（13 个类型化视图）→ **独立核对**（5 名核对员两轮逐格比对共 516 个单元格，另有 29 项确定性不变量门控；结果在站点附录披露）→ **复算**（每个衍生观点的算式独立重算后才上线）。

已知限制：图 1 的各公司分量在原图中分色但文本未给出数值，`hyperscaler_capex` 仅含合计序列。

## 本地运行

无构建、无依赖、无网络请求：浏览器直接打开 `index.html` 即可，或用任意静态服务器（`npx serve .`、`python3 -m http.server`）。

## 免责声明

本项目是独立的论文阅读 companion，与论文作者及 NBER 无从属或认可关系。论文数据转录自公开工作论文，仅供研究学习；论文版权归作者所有（© 2026 Stijn Van Nieuwerburgh）。"衍生观点"栏目为本项目基于论文数字的计算，非论文主张。

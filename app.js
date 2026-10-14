/* ============================================================
   AI CAPITAL BUILDOUT · 论文解读站 — site/app.js（唯一 JS）
   模块：parseData → i18n → provPop(¶) → viz-tip → 13 视图渲染
        → 8 insights → appendix → slider lab → boot
   约定：ES5、零依赖、零 fetch/XHR、事件委托挂 document。
   ============================================================ */
(function () {
'use strict';

/* ---------------- 1. 数据 ---------------- */
var DATA = (function () {
  var el = document.getElementById('site-data');
  return JSON.parse(el.textContent);
})();
var V = DATA.views;            // viewId -> view object
var MANIFEST = DATA.manifest;  // {views:[...]}
var INSIGHTS = DATA.insights;  // {selected:[...], rejected:[...]}
var LOGIC = DATA.logic_bus;

/* ---------------- 2. i18n ---------------- */
var lang = 'zh';
try {
  var saved = null;
  try { saved = window.localStorage.getItem('acbl-lang'); } catch (e1) { saved = null; }
  if (saved === 'en' || saved === 'zh') lang = saved;
} catch (e2) { lang = 'zh'; }

var T = {
  'observed': { en: 'Observed (Cleanview)', zh: '观测（Cleanview）' },
  'imputed': { en: 'Imputed (model)', zh: '插补（模型）' },
  'gw': { en: 'GW', zh: 'GW' },
  'pct_of_total': { en: '% of 557.1 GW total', zh: '占 557.1 GW 总额 %' },
  'y_axis_unit': { en: 'y-axis unit', zh: 'y 轴单位' },
  'projects': { en: 'projects', zh: '项目数' },
  'nodate': { en: 'Planned, no date', zh: '规划，无日期' },
  'by2032': { en: 'Completed by 2032', zh: '2032 年前完工' },
  'after2032': { en: 'Completed after 2032', zh: '2032 年后完工' },
  'never': { en: 'Never completed', zh: '永不完工' },
  'mode_100': { en: '100% composition', zh: '100% 构成' },
  'mode_gw': { en: 'absolute GW', zh: '绝对 GW' },
  'click_filter': { en: 'click a Panel A segment to filter Panel B · click again to clear', zh: '点击面板 A 段可过滤面板 B · 再点一次取消' },
  'avg': { en: 'Average (solid)', zh: '年均（实心）' },
  'peak': { en: 'Peak (hollow)', zh: '峰值（空心）' },
  'x_scale': { en: 'x-axis scale', zh: 'x 轴标尺' },
  'avg_scale': { en: 'average', zh: '年均' },
  'peak_scale': { en: 'peak', zh: '峰值' },
  'scenario': { en: 'SCENARIO', zh: '情景' },
  'measured': { en: 'MEASURED', zh: '测量' },
  'capex': { en: 'Capex', zh: '资本开支' },
  'ocf': { en: 'Operating cash flow', zh: '经营现金流' },
  'ratio_line': { en: 'Capex/OCF ratio (derived)', zh: 'Capex/OCF 比率线（衍生）' },
  'show_ratio': { en: 'ratio line', zh: '比率线' },
  'gdp_scenario': { en: 'GDP growth', zh: 'GDP 增速' },
  'cum_ratio': { en: 'cumulative investment / cumulative GDP', zh: '累计投资 / 累计 GDP' },
  'equity': { en: 'Equity ~60%', zh: '股权 ~60%' },
  'debt': { en: 'Debt ~40%', zh: '债务 ~40%' },
  'private_credit': { en: 'Private credit', zh: '私募信贷' },
  'corporate_debt': { en: 'Corporate debt', zh: '公司债' },
  'structured': { en: 'Structured finance', zh: '结构化融资' },
  'source_wsj': { en: 'WSJ tally (fn5)', zh: 'WSJ 统计（脚注 5）' },
  'source_moodys': { en: "Moody's (2026a)", zh: 'Moody\'s（2026a）' },
  'src_toggle': { en: 'data source', zh: '数据源' },
  'onbalance': { en: 'On balance sheet', zh: '表内' },
  'off_lease': { en: 'Future lease commitments', zh: '未来租赁承诺' },
  'off_purchase': { en: 'Purchase commitments (mostly chips)', zh: '采购承诺（多为芯片）' },
  'reported': { en: 'reported', zh: '已报口径' },
  'plus_lease': { en: '+ uncommenced leases ×0.75 PV', zh: '+ 未生效租约 ×0.75 现值' },
  'bp': { en: 'bp', zh: 'bp' },
  'cds_window': { en: '2025-11-21 → 2026-07-22 (endpoints only)', zh: '2025-11-21 → 2026-07-22（仅两端点）' },
  'reit_beta': { en: 'REIT beta vs S&P 500', zh: 'REIT 对标普 500 的 beta' },
  'lab_r': { en: 'Required unlevered return r', zh: '无杠杆要求回报率 r' },
  'lab_mu': { en: 'OCF margin μ', zh: '经营现金流利润率 μ' },
  'lab_life': { en: 'IT economic life', zh: 'IT 经济寿命' },
  'lab_u': { en: 'Billing utilization', zh: '计费利用率' },
  'lab_reqrev': { en: 'Required mature annual revenue', zh: '所需成熟期年收入' },
  'lab_gpuhr': { en: 'Required price per GPU-hr', zh: '所需每 GPU 时价格' },
  'lab_gap': { en: 'vs Ornn $6.07 benchmark', zh: '对 Ornn $6.07 基准' },
  'lab_of_gdp': { en: 'of 2032 GDP ($40,481B)', zh: '占 2032 年 GDP（$40,481B）' },
  'lab_reset': { en: 'reset → 10% / 50% / 6y / 100%', zh: '复位 → 10% / 50% / 6 年 / 100%' },
  'lab_current': { en: 'current scenario', zh: '当前情景' },
  'derived': { en: 'derived', zh: '衍生' },
  'yr': { en: 'y', zh: '年' },
  'reset': { en: 'Reset', zh: '复位' },
  'single_year': { en: 'single year', zh: '单年' },
  'cum3': { en: '2024–26 cumulative', zh: '2024–26 累计' },
  'below_market': { en: 'market rent insufficient', zh: '市价不足以回本' },
  'breakeven_u': { en: 'breakeven billed utilization', zh: '盈亏平衡计费利用率' },
  'rent_price': { en: 'market rent $/GPU-hr', zh: '市价租金 $/GPU 时' },
  'notch': { en: '1 notch', zh: '差一档' },
  'sub_de': { en: 'D/E (log scale)', zh: '债务/股本（对数）' },
  'sub_buf': { en: 'cash-flow buffer', zh: '现金流缓冲' },
  'sub_tl': { en: 'bond vs leases timeline', zh: '债券-租约时间轴' },
  'realization_slider': { en: 'undated realized by 2032', zh: '无日期档 2032 年前实现率' },
  'implied_gdp': { en: 'implied average % of GDP', zh: '隐含年均 GDP 占比' },
  'rail_threshold': { en: 'railroads 2.24% threshold', zh: '铁路 2.24% 阈值线' },
  'rank_flip': { en: 'historical ranking flips here', zh: '历史排名在此翻转' },
  'margin_above': { en: 'margin above railroads', zh: '高于铁路的余量' },
  'pv_lease': { en: 'leases ×0.75 PV', zh: '租约 ×0.75 现值' },
  'cap_purchase': { en: 'capitalize purchases ×0.75', zh: '采购承诺按 0.75 资本化' },
  'gdp_equiv': { en: 'annual-GDP equivalents', zh: '折合年度 GDP 当量' },
  'issue_detail': { en: 'Issuance details', zh: '发行细节' },
  'close': { en: 'Close', zh: '关闭' },
  'paper_quote': { en: 'PAPER QUOTE', zh: '论文原文' },
  'prov_src': { en: 'Source', zh: '出处' },
  'lab_title': { en: 'Slider Lab — revenue requirement experiment bench', zh: '滑杆实验台 — 收入要求实验' },
  'lab_sub': {
    en: 'req_rev = 8,762.2 × φ(r) × w / μ ; φ(r) per eq.(3) — the capital base is recomputed for each r, exactly as Table 7 does (at r=10%, φ=1.04527 → $9,158.8B) ; w = 0.68·a(r, N_it) + 0.32·a(r, 20) ; a(r,n) = r / (1 − (1+r)^−n). The only "experiment bench" on this site — every number is recomputed live from paper parameters.',
    zh: 'req_rev = 8,762.2 × φ(r) × w / μ ；φ(r) 按式(3)随 r 重算资本基座——与表 7 同法（r=10% 时 φ=1.04527 → $9,158.8B）；w = 0.68·a(r, N_it) + 0.32·a(r, 20) ；a(r,n) = r / (1 − (1+r)^−n)。全站唯一「实验台」——所有读数由论文参数实时重算。'
  },
  'verify_col_view': { en: 'View', zh: '视图' },
  'verify_col_rows': { en: 'Rows', zh: '行数' },
  'verify_col_src': { en: 'Source', zh: '来源' },
  'verify_col_status': { en: 'Status', zh: '状态' },
  'verify_ok': { en: '✓ validate_views pass (2026-10-12)', zh: '✓ validate_views 通过（2026-10-12）' },
  'click_hint_flow': { en: 'click for issuance details', zh: '点击查看发行细节' },
  'visit_lab': { en: 'not a forecast — open the slider lab', zh: '非预测——打开滑杆实验台' }
};
function t(key) {
  var e = T[key];
  if (!e) return key;
  return e[lang] || e.en;
}

/* ---------------- 3. 小工具 ---------------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmt(n, d) {
  if (d === undefined) d = 1;
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtI(n) { return Math.round(n).toLocaleString('en-US'); }
function el(id) { return document.getElementById(id); }
function mount(figId) {
  var f = el(figId);
  if (!f) return null;
  var b = f.querySelector('.viz-body');
  b.innerHTML = '';
  return b;
}
var SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs, parent) {
  var n = document.createElementNS(SVG_NS, tag);
  if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
function sText(parent, x, y, str, cls, anchor) {
  var n = svgEl('text', { x: x, y: y, 'class': cls || 'lab' }, parent);
  if (anchor) n.setAttribute('text-anchor', anchor);
  n.textContent = str;
  return n;
}
function sLine(parent, x1, y1, x2, y2, attrs) {
  var a = { x1: x1, y1: y1, x2: x2, y2: y2 };
  if (attrs) for (var k in attrs) a[k] = attrs[k];
  return svgEl('line', a, parent);
}
function sRect(parent, x, y, w, h, attrs) {
  var a = { x: x, y: y, width: Math.max(0, w), height: Math.max(0, h) };
  if (attrs) for (var k in attrs) a[k] = attrs[k];
  return svgEl('rect', a, parent);
}
function mkFig(figId, w, h) {
  var body = mount(figId);
  if (!body) return null;
  var s = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, width: '100%', preserveAspectRatio: 'xMidYMid meet', role: 'img' }, null);
  body.appendChild(s);
  return s;
}
function hatchDef(svg, id, color, angle) {
  var defs = svg.querySelector('defs') || svgEl('defs', {}, svg);
  var p = svgEl('pattern', { id: id, width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(' + (angle || 45) + ')' }, defs);
  svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 7, stroke: color, 'stroke-width': 1.6 }, p);
  return defs;
}
var C = {
  accent: '#2563eb', muted: '#93a4c4', light: '#e5e7eb', ink: '#1a1a2e',
  border: '#e5e7eb', borderS: '#d1d5db', green: '#059669', amber: '#b45309',
  bgCard: '#ffffff', accentLight: '#eff4ff'
};

/* tip 单例存储：渲染时登记，悬停时查找 */
var tipStore = {};
var tipSeq = 0;
function tip(text) { tipSeq++; var k = 'tp' + tipSeq; tipStore[k] = text; return k; }
function attachTip(node, text) { node.setAttribute('data-tipref', tip(text)); node.setAttribute('tabindex', '0'); }

/* ¶ SVG 角标（键盘可达：tabindex + role=button + Enter/Space 在全局 keydown 处理） */
function svgPilcrow(parent, x, y, viewId, idx) {
  var g = svgEl('text', {
    x: x, y: y, 'class': 'ax', 'data-prov': viewId + ':' + idx,
    'font-weight': '700', 'font-size': '12px', cursor: 'pointer',
    tabindex: 0, role: 'button',
    'aria-label': bi('provenance quote', '论文原文引句') + ' ¶'
  }, parent);
  g.style.fill = C.accent; /* 内联样式，避免被 .ax 的 CSS fill 覆盖 */
  g.textContent = '¶';
  return g;
}

/* ---------------- 4. ¶ 回溯浮层（全站单例） ---------------- */
var provIndex = {};
var provCount = 0;
(function buildProv() {
  for (var id in V) {
    var pv = (V[id] && V[id].provenance) || [];
    provIndex[id] = pv;
    provCount += pv.length;
  }
})();
function provTag(locator) {
  var m = /(Table|Figure|Appendix)\s+[A-Z0-9]/.exec(locator || '');
  return m ? m[0] : (locator || '');
}
var provPop = null;
function closeProv() {
  if (provPop && provPop.parentNode) provPop.parentNode.removeChild(provPop);
  provPop = null;
}
function openProv(key, anchorEl) {
  var parts = String(key).split(':');
  var viewId = parts[0];
  var idx = parseInt(parts[1], 10);
  var arr = provIndex[viewId];
  if (!arr || !(idx >= 0 && idx < arr.length)) return;
  var p = arr[idx];
  closeProv();
  provPop = document.createElement('div');
  provPop.className = 'prov-pop';
  provPop.setAttribute('role', 'dialog');
  var head = provTag(p.locator);
  var html = '<div class="pp-head"><span>' + esc(t('paper_quote')) + ' · ' + esc(head) + '</span>' +
    '<button class="pp-close" type="button" aria-label="' + esc(bi('Close', '关闭')) + '">×</button></div>' +
    '<div class="pp-quote">“' + esc(p.quote_en) + '”</div>' +
    '<div class="pp-src">' + esc(t('prov_src')) + ': ' + esc(p.locator) + ' · PDF p.' + esc(p.pdf_page) + '</div>';
  provPop.innerHTML = html;
  document.body.appendChild(provPop);
  var closeBtn = provPop.querySelector('.pp-close');
  closeBtn.addEventListener('click', function (ev) { ev.stopPropagation(); closeProv(); });
  /* 定位：锚点附近，自动避让视口 */
  var r = anchorEl.getBoundingClientRect();
  var pw = provPop.offsetWidth, ph = provPop.offsetHeight;
  var x = r.left + r.width / 2 - pw / 2;
  var y = r.bottom + 10;
  if (y + ph > window.innerHeight - 12) y = Math.max(12, r.top - ph - 10);
  if (x < 12) x = 12;
  if (x + pw > window.innerWidth - 12) x = window.innerWidth - pw - 12;
  provPop.style.left = x + 'px';
  provPop.style.top = y + 'px';
  try { closeBtn.focus(); } catch (e3) { /* focus 不可用时静默 */ }
}

/* ---------------- 5. viz-tip 悬停浮层（单例） ---------------- */
var vizTip = null;
function hideTip() { if (vizTip) vizTip.style.display = 'none'; }
function showTipFor(node, cx, cy) {
  if (!vizTip) {
    vizTip = document.createElement('div');
    vizTip.className = 'viz-tip';
    document.body.appendChild(vizTip);
  }
  var key = node.getAttribute('data-tipref');
  var content = tipStore[key];
  if (content === undefined) return;
  vizTip.innerHTML = content;
  vizTip.style.display = 'block';
  moveTip(cx, cy);
}
function moveTip(cx, cy) {
  if (!vizTip || vizTip.style.display === 'none') return;
  var w = vizTip.offsetWidth, h = vizTip.offsetHeight;
  var x = cx + 14, y = cy + 16;
  if (x + w > window.innerWidth - 10) x = Math.max(10, cx - w - 14);
  if (y + h > window.innerHeight - 10) y = Math.max(10, cy - h - 14);
  vizTip.style.left = x + 'px';
  vizTip.style.top = y + 'px';
}

/* 全局事件委托 */
document.addEventListener('click', function (e) {
  var tgt = e.target;
  var pvNode = tgt.closest ? tgt.closest('[data-prov]') : null;
  if (pvNode) {
    e.preventDefault();
    e.stopPropagation();
    openProv(pvNode.getAttribute('data-prov'), pvNode);
    return;
  }
  if (provPop && !(tgt.closest && tgt.closest('.prov-pop'))) closeProv();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeProv();
  /* 键盘触发 ¶（SVG 角标与按钮统一）：Enter / Space */
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
    var n2 = e.target.closest ? e.target.closest('[data-prov]') : null;
    if (n2) {
      e.preventDefault();
      openProv(n2.getAttribute('data-prov'), n2);
    }
  }
});
document.addEventListener('mouseover', function (e) {
  var n = e.target.closest ? e.target.closest('[data-tipref]') : null;
  if (n) showTipFor(n, e.clientX, e.clientY); else hideTip();
});
/* 键盘聚焦/失焦同样弹出/收起 tooltip（attachTip 已设 tabindex=0） */
document.addEventListener('focusin', function (e) {
  var n = e.target.closest ? e.target.closest('[data-tipref]') : null;
  if (!n) return;
  var r = n.getBoundingClientRect();
  showTipFor(n, r.left + r.width / 2, r.bottom);
});
document.addEventListener('focusout', function (e) {
  var n = e.target.closest ? e.target.closest('[data-tipref]') : null;
  if (n) hideTip();
});
document.addEventListener('mousemove', function (e) {
  if (!vizTip || vizTip.style.display === 'none') return;
  moveTip(e.clientX, e.clientY);
});
document.addEventListener('mouseout', function (e) {
  var n = e.target.closest ? e.target.closest('[data-tipref]') : null;
  if (n) hideTip();
});

/* ---------------- 6. 渲染注册表与语言切换 ---------------- */
var RENDERS = [];
function reg(fn) { RENDERS.push(fn); }
function renderAll() {
  tipStore = {};
  for (var i = 0; i < RENDERS.length; i++) {
    try { RENDERS[i](); } catch (err) {
      if (window.console && console.warn) console.warn('render failed:', i, err);
    }
  }
  /* 可访问性后处理：所有图表 SVG 统一 role="img" + 按当前语言取 caption 作 aria-label */
  var svgs = document.querySelectorAll('figure.viz svg');
  for (var j = 0; j < svgs.length; j++) {
    svgs[j].setAttribute('role', 'img');
    var fig = svgs[j].closest('figure');
    var label = '';
    if (fig) {
      var cap = fig.querySelector('figcaption');
      if (cap) {
        var sp = cap.querySelector('span.' + (lang === 'zh' ? 'zh' : 'en'));
        if (sp) label = sp.textContent;
      }
    }
    if (!label && fig && fig.id) label = fig.id.replace(/^viz-/, '');
    svgs[j].setAttribute('aria-label', (label || 'chart').slice(0, 220));
  }
}
function applyLang(l) {
  lang = l;
  document.documentElement.lang = lang;
  document.body.className = 'lang-' + lang;
  var btn = el('lang-toggle');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中文';
  try { window.localStorage.setItem('acbl-lang', lang); } catch (e4) { /* 静默降级 */ }
  renderAll();
}

/* 双语拼接快捷：h2标题行 */
function bi(en, zh) { return lang === 'zh' ? zh : en; }
function L(pair) { return pair ? (pair[lang] || pair.en || '') : ''; }

/* ============================================================
   7. 视图渲染器（13 个，全部原生 SVG）
   ============================================================ */

/* ---- 7.0 hero：63 vs 494 + 情景三分 ---- */
(function () {
  var facts = V.paper_facts;
  function fk(key) {
    for (var i = 0; i < facts.rows.length; i++) if (facts.rows[i].fact_key === key) return facts.rows[i];
    return null;
  }
  reg(function renderHero() {
    var s = mkFig('viz-hero', 700, 320);
    if (!s) return;
    var x0 = 118, x1 = 660;
    var scale = function (v) { return x0 + (x1 - x0) * (v / 494); };
    /* 双条 */
    var rows = [
      { key: 'us_operating_capacity_gw', lab: bi('Operating', '在运'), color: C.muted, prov: 0 },
      { key: 'development_pipeline_gw', lab: bi('Dev pipeline', '开发管道'), color: C.accent, prov: 0 }
    ];
    rows.forEach(function (r, i) {
      var f = fk(r.key);
      var y = 44 + i * 52;
      sText(s, x0 - 8, y + 20, r.lab, 'lab', 'end');
      var bar = sRect(s, x0, y, scale(f.value) - x0, 30, { fill: r.color, rx: 3, 'class': 'hoverable' });
      attachTip(bar, esc(f.detail) + '\n' + fmt(f.value, 1) + ' GW');
      sText(s, x0 + 8, y + 20, fmt(f.value, 0) + ' GW', 'lab', 'start').style.fill = '#fff';
      svgPilcrow(s, scale(f.value) + 10, y + 21, 'paper_facts', r.prov);
    });
    /* ×7.8 衍生 */
    sText(s, (scale(63) + scale(494)) / 2, 68, '≈×7.8', 'lab-sm', 'middle').style.fill = C.accent;
    sText(s, (scale(63) + scale(494)) / 2, 80, bi('derived', '衍生'), 'lab-sm', 'middle');
    /* 情景三分 */
    var scen = [
      { key: 'scenario_capacity_by_2032_gw', lab: bi('by 2032', '2032 年前'), color: C.accent, prov: 1 },
      { key: 'scenario_capacity_after_2032_gw', lab: bi('after 2032', '2032 年后'), color: C.muted, prov: 2 },
      { key: 'scenario_never_completed_gw', lab: bi('never', '永不完工'), color: C.light, prov: 2 }
    ];
    var y = 168, h = 40, cur = x0, total = 516.7;
    hatchDef(s, 'h-hero', '#cbd5e1');
    scen.forEach(function (r) {
      var f = fk(r.key);
      var w = (x1 - x0) * (f.value / total);
      var attrs = { 'class': 'hoverable', stroke: C.borderS, 'stroke-width': 0.6 };
      if (r.color === C.light) attrs.fill = 'url(#h-hero)'; else attrs.fill = r.color;
      var seg = sRect(s, cur, y, w, h, attrs);
      attachTip(seg, esc(factDesc(r.key)) + '\n' + fmt(f.value, 1) + ' GW · ' + fmt(f.value / total * 100, 1) + '%');
      sText(s, cur + w / 2, y + 16, fmt(f.value, 1), 'lab', 'middle').style.fill = r.color === C.light ? C.ink : '#fff';
      sText(s, cur + w / 2, y + 31, fmt(f.value / total * 100, 1) + '% ' + r.lab, 'lab-sm', 'middle').style.fill = r.color === C.light ? C.ink : '#fff';
      svgPilcrow(s, cur + w - 6, y + 12, 'paper_facts', r.prov);
      cur += w;
    });
    sText(s, x0 - 8, y + 20, bi('516.7 GW gross', '毛管道 516.7 GW'), 'lab', 'end');
    /* 支出时序细条（式1） */
    var shares = [5.122, 5.122, 17.561, 72.195];
    var labs = ['t−3', 't−2', 't−1', 't'];
    var y2 = 262, h2 = 18, cur2 = x0;
    shares.forEach(function (v, i) {
      var w = (x1 - x0) * (v / 100);
      var seg = sRect(s, cur2, y2, w, h2, { fill: i === 3 ? C.accent : C.muted, 'class': 'hoverable' });
      attachTip(seg, bi('equation (1): ', '式(1)：') + v + '% → ' + bi('year', '年') + ' ' + labs[i]);
      if (v > 9) sText(s, cur2 + w / 2, y2 + 13, v + '%', 'lab-sm', 'middle').style.fill = '#fff';
      cur2 += w;
    });
    sText(s, x0 - 8, y2 + 14, bi('Spend profile (1)', '支出分摊 式(1)'), 'lab-sm', 'end');
    sText(s, x0, 302, bi('Scenario split: “a scenario rather than a forecast” — click ¶ for the verbatim quote.', '情景三分：「是情景而非预测」——点击 ¶ 看原句。'), 'lab-sm', 'start');
    function factDesc(key) { var f = fk(key); return f ? f.detail : key; }
  });
})();

/* ---- 7.1 campus_cost：两层 100% 堆叠 + 基准卡 ---- */
(function () {
  var st = { drill: true };
  reg(function renderCampusCost() {
    var vw = V.campus_cost;
    var body = mount('viz-campus_cost');
    if (!body) return;
    var W = 700, H = st.drill ? 224 : 150;
    var s = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%' }, null);
    body.appendChild(s);
    var x0 = 12, x1 = 560;
    var colors = [C.muted, '#d1d5db', C.accent];
    var subColors = [C.accent, 'rgba(37,99,235,0.7)', 'rgba(37,99,235,0.45)', 'rgba(37,99,235,0.45)'];
    function row(y, arr, isSub) {
      var cur = x0;
      arr.forEach(function (r, i) {
        var w = (x1 - x0) * (r.share_pct / 100);
        var seg = sRect(s, cur + (isSub ? 34 : 0), y, w, 34, { fill: isSub ? subColors[i] : colors[i], stroke: '#fff', 'stroke-width': 1.2, 'class': 'hoverable', rx: 2 });
        attachTip(seg, esc(r.component) + '\n' + esc(r.assumption) + '\n$' + fmt(r.cost_bn, 3) + 'B · ' + fmt(r.share_pct, 1) + '%' + (isSub ? '' : '\n' + (i === 2 ? bi('click to toggle drill-down', '点击收起/展开下钻') : '')));
        if (r.share_pct > 8) {
          sText(s, cur + (isSub ? 34 : 0) + w / 2, y + 15, fmt(r.share_pct, 1) + '%', 'lab', 'middle').style.fill = isSub || i === 2 ? '#fff' : C.ink;
          sText(s, cur + (isSub ? 34 : 0) + w / 2, y + 28, '$' + fmt(r.cost_bn, w > 60 ? 2 : 1) + 'B', 'lab-sm', 'middle').style.fill = isSub || i === 2 ? '#dbeafe' : C.ink;
        }
        cur += w;
      });
    }
    row(16, vw.rows);
    sText(s, x0, 12, bi('Top level · total $8.216B (Table 2)', '第一层 · 合计 $8.216B（表 2）'), 'lab-sm');
    if (st.drill) {
      row(78, vw.subrows, true);
      sText(s, x0 + 34, 74, bi('IT equipment drill-down (sums to $5.616B)', 'IT 设备下钻（合计 $5.616B）'), 'lab-sm');
      sText(s, x0, 138, bi('Shares print 26.8 + 4.9 + 68.4 = 100.1 (paper rounding); sub-rows 57.0+5.7+2.8+2.8 = 68.3 ≈ 68.4.', '占比印为 26.8+4.9+68.4=100.1（论文四舍五入）；子行 57.0+5.7+2.8+2.8=68.3≈68.4。'), 'lab-sm');
    }
    if (H > 200) {
      svgPilcrow(s, x1 - 10, 34, 'campus_cost', 3);
      svgPilcrow(s, x1 - 10, 96, 'campus_cost', 28);
    }
    /* 交互：点 IT 段切换下钻 */
    var segs = s.querySelectorAll('rect.hoverable');
    if (segs.length >= 3) {
      segs[2].style.cursor = 'pointer';
      segs[2].addEventListener('click', function () { st.drill = !st.drill; renderCampusCost(); });
    }
    /* 基准小卡 */
    var cards = document.createElement('div');
    cards.className = 'viz-legend';
    cards.style.marginTop = '10px';
    var bm = [
      { n: 'JLL (2026)', v: '$11.3m/MW', d: bi('close to $11m benchmark', '接近 $11m 基准'), prov: 13 },
      { n: 'Cleanview', v: '$8.9m/MW', d: bi('2025–26 completions avg', '2025–26 建成均值'), prov: 14 },
      { n: "Moody's", v: '$2.44m/MW power', d: bi('“likely conservative” +7–10% liquid cooling', '「很可能偏保守」液冷 +7–10%'), prov: 18 },
      { n: 'Turner & Townsend', v: '+7–10%', d: bi('liquid-cooled premium', '液冷溢价'), prov: 15 }
    ];
    bm.forEach(function (b) {
      var d = document.createElement('span');
      d.className = 'key';
      d.innerHTML = '<span class="sw" style="background:var(--bar-bg);border:1px solid var(--border-strong)"></span>' +
        '<b>' + b.n + '</b> ' + b.v + ' <span style="color:var(--text-secondary)">· ' + esc(b.d) +
        ' <button class="pilcrow" data-prov="campus_cost:' + b.prov + '" type="button">¶</button></span>';
      cards.appendChild(d);
    });
    body.appendChild(cards);
  });
})();

/* ---- 7.2 capacity_pipeline：堆叠柱 + 无日期侧板 ---- */
(function () {
  var st = { showObs: true, showImp: true, unit: 'gw' };
  reg(function renderPipeline() {
    var vw = V.capacity_pipeline;
    var body = mount('viz-capacity_pipeline');
    if (!body) return;
    /* 控件 */
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML =
      '<span class="ctl-label">' + esc(bi('legend', '图例')) + '</span>' +
      '<button class="switch' + (st.showObs ? ' on' : '') + '" data-a="obs">' + esc(t('observed')) + '</button>' +
      '<button class="switch' + (st.showImp ? ' on' : '') + '" data-a="imp">' + esc(t('imputed')) + '</button>' +
      '<span class="ctl-label" style="margin-left:10px">' + esc(t('y_axis_unit')) + '</span>' +
      '<button class="switch' + (st.unit === 'gw' ? ' on' : '') + '" data-a="gw">GW</button>' +
      '<button class="switch' + (st.unit === 'pct' ? ' on' : '') + '" data-a="pct">%</button>';
    body.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (!a) return;
      if (a === 'obs') st.showObs = !st.showObs;
      else if (a === 'imp') st.showImp = !st.showImp;
      else st.unit = a;
      renderPipeline();
    });
    var s = svgEl('svg', { viewBox: '0 0 700 330', width: '100%' }, null);
    body.appendChild(s);
    hatchDef(s, 'h-imp', '#6b7280');
    var x0 = 40, x1 = 560, y0 = 268, yTop = 30;
    var dated = vw.rows.filter(function (r) { return r.completion_year !== 'Planned, no date'; });
    var nod = vw.rows.filter(function (r) { return r.completion_year === 'Planned, no date'; })[0];
    var ymax = st.unit === 'gw' ? 330 : 56.3;
    var nx = dated.length;
    var bw = 30;
    var step = (x1 - x0 - 20) / nx;
    function yScale(v) { return y0 - (y0 - yTop) * (v / ymax); }
    /* 网格 */
    var ticks = st.unit === 'gw' ? [0, 100, 200, 300] : [0, 20, 40, 56.3];
    ticks.forEach(function (tv) {
      var y = yScale(tv);
      sLine(s, x0, y, 596, y, { 'class': 'grid' });
      sText(s, x0 - 6, y + 3, tv === 56.3 ? '56.3%' : (st.unit === 'pct' ? tv + '%' : tv), 'ax-tick', 'end');
    });
    sText(s, 14, 18, st.unit === 'gw' ? 'GW' : '%', 'ax');
    dated.forEach(function (r, i) {
      var cx = x0 + 14 + i * step;
      var obs = st.showObs ? r.observed_gw : 0;
      var imp = st.showImp ? r.imputed_gw : 0;
      var val = function (v) { return st.unit === 'gw' ? v : v / 557.1 * 100; };
      var yImp = yScale(val(obs + imp));
      if (st.showImp) {
        var segI = sRect(s, cx, yImp, bw, y0 - yScale(val(obs)) - yImp, { fill: 'url(#h-imp)', stroke: C.muted, 'stroke-width': 0.8, 'class': 'hoverable' });
        attachTip(segI, tipRow(r));
      }
      var yObs = yScale(val(obs));
      var segO = sRect(s, cx, yObs, bw, y0 - yObs, { fill: C.accent, 'class': 'hoverable' });
      attachTip(segO, tipRow(r));
      var tot = val(obs + imp);
      if (tot > ymax * 0.07) sText(s, cx + bw / 2, yScale(tot) - 5, fmt(tot, 1), 'lab-sm', 'middle');
      sText(s, cx + bw / 2, y0 + 14, r.completion_year === 'Before 2025' ? '<25' : (r.completion_year === 'After 2032' ? '>32' : r.completion_year.slice(2)), 'ax-tick', 'middle');
      sText(s, cx + bw / 2, y0 + 26, fmtI(r.projects), 'lab-sm', 'middle');
    });
    /* 无日期面板 */
    var px = 576, pw = 66;
    sLine(s, 568, yTop - 8, 568, y0, { stroke: C.borderS, 'stroke-dasharray': '4 4' });
    sRect(s, px - 4, yTop - 22, pw + 34, y0 - yTop + 46, { fill: 'none', stroke: C.borderS, 'stroke-dasharray': '5 4', rx: 4 });
    var val2 = function (v) { return st.unit === 'gw' ? v : v / 557.1 * 100; };
    var yI = yScale(val2(nod.observed_gw + nod.imputed_gw));
    sRect(s, px, yI, pw, y0 - yScale(val2(nod.observed_gw)) - yI, { fill: 'url(#h-imp)', stroke: C.muted, 'stroke-width': 0.8, 'class': 'hoverable' });
    var yO = yScale(val2(nod.observed_gw));
    var segO2 = sRect(s, px, yO, pw, y0 - yO, { fill: C.accent, 'class': 'hoverable' });
    attachTip(segO2, tipRow(nod) + '\n' + bi('largest source of uncertainty in the central scenario', '中心情景最大不确定性来源') + '\n' + bi('2027+2028 cohorts peak at 93.6 GW', '2027+2028 队列峰值 93.6 GW'));
    sText(s, px + pw / 2, yScale(val2(nod.total_gw)) - 6, fmt(val2(nod.total_gw), 1), 'lab', 'middle');
    sText(s, px + pw / 2, yTop - 28, bi('no date', '无日期'), 'lab', 'middle');
    sText(s, px + pw / 2, yTop - 8, '56.3% · 717', 'lab-sm', 'middle').style.fill = C.accent;
    sText(s, px + pw / 2, y0 + 14, 'n/d', 'ax-tick', 'middle');
    sText(s, px + pw / 2, y0 + 26, fmtI(nod.projects), 'lab-sm', 'middle');
    sText(s, x0, y0 + 44, bi('projects below each column · imputation adds 118.2 GW (21.2%, derived), capped at 2,000 MW/project', '柱下为项目数 · 模型插补 118.2 GW（21.2%，衍生），单项目封顶 2,000 MW'), 'lab-sm');
    svgPilcrow(s, 690, 20, 'capacity_pipeline', 0);
    function tipRow(r) {
      return esc(r.completion_year) + '\n' +
        t('observed') + ': ' + fmt(r.observed_gw, 1) + ' GW\n' +
        t('imputed') + ': ' + fmt(r.imputed_gw, 1) + ' GW\n' +
        bi('total', '合计') + ': ' + fmt(r.total_gw, 1) + ' GW · ' + t('projects') + ': ' + fmtI(r.projects);
    }
  });
})();

/* ---- 7.3 capacity_outcomes：Panel A 全宽三分 + Panel B 分队列 ---- */
(function () {
  var st = { mode: 'pct', filter: null };
  /* 表4 实现率假设（论文原值，见 view notes[8]） */
  var RATES = {
    '2026': [90, 0, 80, 0], '2027': [80, 5, 65, 10], '2028': [70, 10, 55, 15],
    '2029': [60, 15, 45, 20], '2030': [50, 20, 35, 25], '2031': [40, 25, 25, 30],
    '2032': [30, 30, 20, 30], 'After 2032': [0, 50, 0, 50], 'Planned, no date': [20, 30, 10, 25]
  };
  reg(function renderOutcomes() {
    var vw = V.capacity_outcomes;
    var body = mount('viz-capacity_outcomes');
    if (!body) return;
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML =
      '<span class="ctl-label">Panel B:</span>' +
      '<button class="switch' + (st.mode === 'pct' ? ' on' : '') + '" data-a="pct">' + esc(t('mode_100')) + '</button>' +
      '<button class="switch' + (st.mode === 'gw' ? ' on' : '') + '" data-a="gw">' + esc(t('mode_gw')) + '</button>' +
      (st.filter ? '<button class="switch on" data-a="clear">× ' + esc(t(bi('clear filter', '取消过滤'))) + '</button>' : '') +
      '<span class="ctl-label" style="margin-left:auto">' + esc(t('click_filter')) + '</span>';
    body.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (!a) return;
      if (a === 'clear') st.filter = null; else st.mode = a;
      renderOutcomes();
    });
    var s = svgEl('svg', { viewBox: '0 0 700 400', width: '100%' }, null);
    body.appendChild(s);
    hatchDef(s, 'h-never', '#9ca3af');
    var colors = { by: C.accent, after: C.muted, never: '#e5e7eb' };
    /* Panel A */
    var ax0 = 12, ax1 = 688, ay = 46, ah = 44;
    var tot = vw.totals;
    var parts = [
      { k: 'by', v: tot.gw_by_2032, lab: t('by2032') },
      { k: 'after', v: tot.gw_after_2032, lab: t('after2032') },
      { k: 'never', v: tot.gw_never, lab: t('never') }
    ];
    var sum = 516.7;
    sText(s, ax0, 18, 'Panel A · 516.7 GW ' + bi('gross pipeline → three outcomes (Table 4)', '毛管道三分（表 4）'), 'lab');
    var cur = ax0;
    parts.forEach(function (p) {
      var w = (ax1 - ax0) * (p.v / sum);
      var dimmed = st.filter && st.filter !== p.k;
      var seg = sRect(s, cur, ay, w, ah, {
        fill: p.k === 'never' ? 'url(#h-never)' : colors[p.k], stroke: C.borderS, 'stroke-width': 0.5,
        'class': 'hoverable' + (dimmed ? ' dim' : ''), rx: 2
      });
      attachTip(seg, p.lab + '\n' + fmt(p.v, 1) + ' GW · ' + fmt(p.v / sum * 100, 1) + '%' +
        (p.k === 'by' ? '\n' + bi('13.8 (2025 full) + 134.4 dated + 54.0 no-date ≈ 188.4 ≈ 188.3 (rounding)', '13.8（2025 全额）+ 134.4 有日期 + 54.0 无日期 ≈ 188.4 ≈ 188.3（四舍五入）') : '') +
        (p.k === 'never' ? '\n' + bi('43.2% of 494.1 GW under-construction+planned (cancellation + downsizing)', '在建+规划 494.1 GW 的 43.2%（含取消与缩规模）') : '') +
        '\n“a scenario rather than a forecast”');
      seg.style.cursor = 'pointer';
      seg.addEventListener('click', function () { st.filter = (st.filter === p.k) ? null : p.k; renderOutcomes(); });
      sText(s, cur + w / 2, ay + 18, fmt(p.v, 1) + ' · ' + fmt(p.v / sum * 100, 1) + '%', 'lab', 'middle')
        .style.fill = p.k === 'never' ? C.ink : '#fff';
      sText(s, cur + w / 2, ay + 34, p.lab, 'lab-sm', 'middle').style.fill = p.k === 'never' ? C.ink : '#e0e7ff';
      cur += w;
    });
    svgPilcrow(s, ax1 - 6, ay - 6, 'capacity_outcomes', 0);
    /* Panel B */
    var bx0 = 46, bx1 = 610, by0 = 340, byTop = 130;
    sText(s, bx0 - 30, 112, 'Panel B · ' + bi('by completion cohort', '按完工年份队列'), 'lab');
    var rows = vw.rows;
    var n = rows.length;
    var step = (bx1 - bx0) / n;
    var bw = Math.min(34, step - 10);
    rows.forEach(function (r, i) {
      var cx = bx0 + i * step + (step - bw) / 2;
      var isNd = r.completion_year === 'Planned, no date';
      if (isNd) sLine(s, cx - 14, byTop - 6, cx - 14, by0 + 8, { stroke: C.borderS, 'stroke-dasharray': '4 4' });
      var tt = r.gw_by_2032 + r.gw_after_2032 + r.gw_never;
      var segs = [
        { k: 'by', v: r.gw_by_2032 }, { k: 'after', v: r.gw_after_2032 }, { k: 'never', v: r.gw_never }
      ];
      var y = by0;
      segs.forEach(function (sg) {
        if (sg.v <= 0) return;
        var hgt = st.mode === 'pct' ? (by0 - byTop) * (sg.v / tt) : (by0 - byTop) * (sg.v / 313.9);
        var dimmed = st.filter && st.filter !== sg.k;
        var rc = sRect(s, cx, y - hgt, bw, hgt, {
          fill: sg.k === 'never' ? 'url(#h-never)' : colors[sg.k], stroke: '#fff', 'stroke-width': 0.7,
          'class': 'hoverable' + (dimmed ? ' dim' : '')
        });
        var rate = RATES[r.completion_year];
        attachTip(rc, esc(r.completion_year) + ' · total ' + fmt(tt, 1) + ' GW\n' +
          t('by2032') + ': ' + fmt(r.gw_by_2032, 1) + '\n' +
          t('after2032') + ': ' + fmt(r.gw_after_2032, 1) + '\n' +
          t('never') + ': ' + fmt(r.gw_never, 1) +
          (rate ? '\n' + bi('realization (obs by/after · imp by/after)', '实现率（观测 前/后 · 插补 前/后）') + ': ' + rate.join('/') + '%' : '\n' + bi('included in full (no rates)', '全额计入（无实现率）')) +
          (r.completion_year === '2025' ? '\n' + bi('32.6% project-count rate ≈ Brandsaas 33%', '32.6% 项目数口径取消率 ≈ Brandsaas 33%') : ''));
        y -= hgt;
      });
      sText(s, cx + bw / 2, y - 6, fmt(tt, 1), 'lab-sm', 'middle');
      var lab = r.completion_year === 'Planned, no date' ? bi('n/d', '无日期') : (r.completion_year === 'After 2032' ? '>32' : r.completion_year.slice(2));
      sText(s, cx + bw / 2, by0 + 14, lab, 'ax-tick', 'middle');
      if (isNd) sText(s, cx + bw / 2, byTop - 14, bi('never 54%', '永不建成 54%'), 'lab-sm', 'middle').style.fill = C.ink;
    });
    sText(s, bx0 - 34, by0 + 34, bi('column totals in GW on top · 0.1 GW rounding vs printed 188.3/114.9/213.5 (col sums 188.4/115.0/213.4, derived)', '柱顶为合计 GW · 与印刷值 188.3/114.9/213.5 差 0.1 GW 系四舍五入（列和 188.4/115.0/213.4，衍生）'), 'lab-sm');
  });
})();

/* ---- 7.4 paper_facts 换算链 ---- */
(function () {
  reg(function renderChain() {
    var body = mount('viz-paper_chain');
    if (!body) return;
    var rows = [
      { a: '79.3M GPUs', op: '÷', b: '1.10M racks', r: bi('= 72 GPUs/rack (NVL72)', '= 72 卡/架（NVL72）'), d: bi('188.3 GW build-out, Appendix D', '188.3 GW 建设规模，附录 D'), prov: 'paper_facts:15' },
      { a: '188,300 MW', op: '÷1.2 ÷', b: '142 kW/rack', r: bi('≈ 1,105k racks (reverse check)', '≈ 110.5 万架（反推校验）'), d: bi('PUE 1.2 critical IT · cluster-equivalent', 'PUE 1.2 关键 IT · 集群当量口径'), prov: 'paper_facts:17' },
      { a: '200 MW', op: '≈', b: '', r: '170,000 households', d: bi('continuous load, annual electricity', '连续负荷年用电当量'), prov: 'paper_facts:12' },
      { a: '1,515 TWh', op: '=', b: '', r: bi('entire U.S. residential sector (2025)', '全美居民部门（2025）'), d: bi('capacity completed by 2032 at full utilization', '2032 年前建成容量满负荷口径'), prov: 'paper_facts:11' },
      { a: '5–10 kW', op: '→', b: 'well above 100 kW', r: bi('CPU rack → AI rack power density', 'CPU 机架 → AI 机架功率密度'), d: bi('liquid cooling increasingly direct-to-chip', '液冷日益直触芯片'), prov: 'paper_facts:16' }
    ];
    var html = '<div class="data-table-wrap" style="margin:6px 0"><table class="data-table"><thead><tr>' +
      '<th>' + esc(bi('Conversion', '换算')) + '</th><th>' + esc(bi('Reading', '读法')) + '</th><th></th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td class="num" style="white-space:normal">' + esc(r.a) + ' ' + esc(r.op) + ' ' + esc(r.b) + ' <b>' + esc(r.r) + '</b></td>' +
        '<td>' + esc(r.d) + '</td>' +
        '<td><button class="pilcrow" data-prov="' + r.prov + '" type="button">¶</button></td></tr>';
    });
    html += '</tbody></table></div>';
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    body.appendChild(wrap.firstChild);
    /* 情景三分迷你条：点击跳表5 */
    var jump = document.createElement('p');
    jump.className = 'viz-note';
    jump.innerHTML = '<a href="#viz-investment_annual" style="color:var(--accent)">' +
      esc(bi('Scenario → investment shape: jump to Table 5 (§02)', '情景 → 投资形态：跳到表 5（§02）')) + ' ↗</a>';
    body.appendChild(jump);
  });
})();

/* ---- 7.5 investment_annual：柱+线双轴 + GDP 情景 ---- */
(function () {
  var st = { g: 4 };
  reg(function renderInvestment() {
    var vw = V.investment_annual;
    var body = mount('viz-investment_annual');
    if (!body) return;
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML = '<span class="ctl-label">' + esc(t('gdp_scenario')) + ':</span>' +
      [4, 6, 8].map(function (g) {
        return '<button class="switch' + (st.g === g ? ' on' : '') + '" data-g="' + g + '">' + g + '%</button>';
      }).join('') +
      '<span class="ctl-label" style="margin-left:10px">' + esc(t('cum_ratio')) + ': ' +
      (st.g === 4 ? '3.17%' : st.g === 6 ? '2.95%' : '2.74%') + '</span>';
    body.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var g = e.target.getAttribute && e.target.getAttribute('data-g');
      if (g) { st.g = parseInt(g, 10); renderInvestment(); }
    });
    var s = svgEl('svg', { viewBox: '0 0 700 340', width: '100%' }, null);
    body.appendChild(s);
    var x0 = 52, x1 = 650, y0 = 282, yTop = 40;
    var rows = vw.rows;
    var n = rows.length;
    var step = (x1 - x0) / n;
    var bw = 40;
    var ymax = 1800;
    var yA = function (v) { return y0 - (y0 - yTop) * (v / ymax); };
    var yB = function (v) { return y0 - (y0 - yTop) * (v / 5.5); };
    [0, 600, 1200, 1800].forEach(function (tv) {
      sLine(s, x0, yA(tv), x1, yA(tv), { 'class': 'grid' });
      sText(s, x0 - 8, yA(tv) + 3, fmtI(tv), 'ax-tick', 'end');
    });
    [1, 2, 3, 4, 5].forEach(function (tv) {
      sText(s, x1 + 8, yB(tv) + 3, tv + '%', 'ax-tick', 'start').style.fill = C.ink;
    });
    sText(s, x0 - 40, 18, '$B', 'ax');
    sText(s, x1 + 8, 18, '%GDP', 'ax');
    /* 情景线数据：4% 用表值；6/8% 由 30762×(1+g)^(y-2025) 重算（衍生） */
    var gdpPath = function (y) { return 30762 * Math.pow(1 + st.g / 100, y - 2025); };
    var pts = [];
    rows.forEach(function (r, i) {
      var cx = x0 + i * step + step / 2;
      var pct = st.g === 4 ? r.investment_gdp_pct : r.investment_bn / gdpPath(r.year) * 100;
      pts.push({ x: cx, y: yB(pct), pct: pct, r: r });
      var isPeak = r.year === 2028;
      var bar = sRect(s, cx - bw / 2, yA(r.investment_bn), bw, y0 - yA(r.investment_bn), {
        fill: isPeak ? C.accent : 'rgba(37,99,235,0.75)',
        stroke: isPeak ? C.borderS : 'none', 'stroke-width': isPeak ? 1.6 : 0, 'class': 'hoverable', rx: 2
      });
      attachTip(bar, r.year + '\n' +
        bi('investment', '投资') + ': $' + fmtI(r.investment_bn) + 'B\n' +
        bi('nominal GDP', '名义 GDP') + ' (4%): $' + fmtI(r.gdp_bn) + 'B\n' +
        bi('investment/GDP', '投资/GDP') + ': ' + (st.g === 4 ? fmt(r.investment_gdp_pct, 1) : fmt(pct, 1) + '% (' + st.g + '% ' + bi('scenario, derived', '情景重算，衍生') + ')') + '\n' +
        bi('equation (1) shares: 5.122/5.122/17.561/72.195 across t−3..t', '式(1) 分摊：t−3..t 按 5.122/5.122/17.561/72.195'));
      sText(s, cx, yA(r.investment_bn) - 24, fmtI(r.investment_bn), 'lab-sm', 'middle');
      if (isPeak) sText(s, cx, yA(r.investment_bn) - 10, '▼ ' + bi('peak 5.0% (4.96%)', '峰 5.0%（精确 4.96%）'), 'lab', 'middle').style.fill = C.accent;
      sText(s, cx, y0 + 14, String(r.year).slice(2), 'ax-tick', 'middle');
    });
    /* 折线 */
    var d = pts.map(function (p) { return (p.x + ',' + p.y); }).join(' ');
    svgEl('polyline', { points: d, fill: 'none', stroke: C.ink, 'stroke-width': 2 }, s);
    pts.forEach(function (p) {
      svgEl('circle', { cx: p.x, cy: p.y, r: 3.2, fill: C.ink, 'class': 'hoverable' }, s);
      sText(s, p.x, p.y - 8, fmt(p.pct, 1), 'lab-sm', 'middle').style.fill = C.ink;
    });
    /* 前倾 50.9% 背带 + 平台期 */
    var x26 = pts[1].x - bw / 2, x28 = pts[3].x + bw / 2, x29 = pts[4].x;
    sRect(s, x26, yTop - 14, x28 - x26, 8, { fill: 'rgba(37,99,235,0.25)' });
    sText(s, (x26 + x28) / 2, yTop - 18, bi('front-load: $4,567B = 50.9% of $8,973B (derived)', '前倾：$4,567B = $8,973B 的 50.9%（衍生）'), 'lab-sm', 'middle');
    sRect(s, x29, y0 - 6, x1 - x29, 6, { fill: 'rgba(147,164,196,0.5)' });
    sText(s, (x29 + x1) / 2, y0 + 30, bi('plateau ≈$880B/yr', '平台 ≈$880B/年'), 'lab-sm', 'middle');
    /* 2029 骤降 */
    sText(s, (pts[3].x + pts[4].x) / 2, yA(978) - 26, '−43%', 'lab', 'middle').style.fill = C.amber;
    sText(s, x0, 322, bi('symmetry caveat: cost per MW and nominal GDP both grow 4%/yr; 6%/8% scenarios recompute the right axis only (derived).', '对称假设：单位成本与名义 GDP 同按 4%/年增长；6%/8% 情景仅重算右轴（衍生）。'), 'lab-sm');
    svgPilcrow(s, 690, 20, 'investment_annual', 0);
  });
})();

/* ---- 7.6 historical_booms 哑铃图 ---- */
(function () {
  var st = { mode: 'avg' };
  reg(function renderBooms() {
    var vw = V.historical_booms;
    var body = mount('viz-historical_booms');
    if (!body) return;
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML = '<span class="ctl-label">' + esc(t('x_scale')) + ':</span>' +
      '<button class="switch' + (st.mode === 'avg' ? ' on' : '') + '" data-a="avg">' + esc(t('avg_scale')) + ' ●</button>' +
      '<button class="switch' + (st.mode === 'peak' ? ' on' : '') + '" data-a="peak">' + esc(t('peak_scale')) + ' ○</button>';
    body.appendChild(ctl);
    var s = svgEl('svg', { viewBox: '0 0 700 330', width: '100%' }, null);
    body.appendChild(s);
    var rows = vw.rows.slice().sort(function (a, b) { return b.size_pct_gdp - a.size_pct_gdp; });
    var x0 = 118, x1 = 640, yTop = 26, rowH = 40;
    var xmax = st.mode === 'avg' ? 5.2 : 5.4;
    var xS = function (v) { return x0 + (x1 - x0) * (v / xmax); };
    [0, 1, 2, 3, 4, 5].forEach(function (tv) {
      sLine(s, xS(tv), yTop - 8, xS(tv), yTop + rows.length * rowH - 4, { 'class': 'grid' });
      sText(s, xS(tv), yTop + rows.length * rowH + 8, tv + '%', 'ax-tick', 'middle');
    });
    rows.forEach(function (r, i) {
      var cy = yTop + i * rowH + rowH / 2;
      var isAI = r.episode === 'AI buildout';
      if (isAI) sRect(s, x0 - 110, cy - 15, x1 - x0 + 118, 30, { fill: C.accentLight });
      var mainV = st.mode === 'avg' ? r.size_pct_gdp : (r.peak_pct_gdp === null ? null : r.peak_pct_gdp);
      var g = svgEl('g', { 'class': 'hit' }, s);
      attachTip(g, epTip(r));
      sText(s, x0 - 12, cy - 2, r.episode, 'lab', 'end').setAttribute('font-weight', isAI || r.episode === 'Railroads' ? '700' : '400');
      sText(s, x0 - 12, cy + 12, r.period, 'lab-sm', 'end');
      if (r.peak_pct_gdp !== null) {
        /* 峰值空心点 + 连线 */
        sLine(g, xS(r.size_pct_gdp), cy, xS(r.peak_pct_gdp), cy, { stroke: isAI ? C.accent : C.muted, 'stroke-width': 1.4 });
        svgEl('circle', { cx: xS(r.peak_pct_gdp), cy: cy, r: 6, fill: '#fff', stroke: isAI ? C.accent : C.muted, 'stroke-width': 2 }, g);
        var py = Array.isArray(r.peak_year) ? '(' + r.peak_year.join(', ') + ')' : String(r.peak_year);
        sText(g, xS(r.peak_pct_gdp) + (isAI ? 8 : 8), cy - 8, '○ ' + fmt(r.peak_pct_gdp, 2) + ' (' + py + ')', 'lab-sm', 'start');
      } else if (st.mode === 'peak') {
        /* 铁路：开区间虚线箭头（禁造数） */
        sLine(g, xS(r.size_pct_gdp), cy, xS(4.05), cy, { stroke: C.muted, 'stroke-dasharray': '3 3', 'stroke-width': 1.4 });
        svgEl('path', { d: 'M' + xS(4.05) + ' ' + cy + ' l-7 -4 v8 z', fill: C.muted }, g);
        sText(g, xS(4.05) + 4, cy + 3, '>4% (1870, 1881)', 'lab-sm', 'start').style.fill = C.ink;
      }
      var dotColor = isAI ? C.accent : C.muted;
      svgEl('circle', { cx: xS(r.size_pct_gdp), cy: cy, r: isAI ? 6.5 : 5.5, fill: dotColor }, g);
      sText(g, xS(r.size_pct_gdp) - 9, cy + 4, fmt(r.size_pct_gdp, 2), 'lab', 'end').setAttribute('font-weight', isAI || r.episode === 'Railroads' ? '700' : '400');
      /* 徽标 */
      sText(g, x1 + 8, cy + 3, isAI ? t('scenario') : t('measured'), 'lab-sm', 'start')
        .style.fill = isAI ? C.accent : '#14532d';
    });
    /* AI 与铁路 gap 括注（仅年均模式） */
    if (st.mode === 'avg') {
      var aiRow = rows.filter(function (r) { return r.episode === 'AI buildout'; })[0];
      var rrRow = rows.filter(function (r) { return r.episode === 'Railroads'; })[0];
      if (aiRow && rrRow) {
        var iAI = rows.indexOf(aiRow), iRR = rows.indexOf(rrRow);
        if (Math.abs(iAI - iRR) === 1) {
          var yA2 = yTop + iAI * rowH + rowH - 2;
          var yR2 = yTop + iRR * rowH + 2;
          var gx = xS(3.22) + 14;
          sLine(s, gx, yA2, gx, yR2, { stroke: C.accent, 'stroke-width': 1.4 });
          sText(s, gx + 6, (yA2 + yR2) / 2 + 3, 'gap 0.98pp · 1.44× (' + t('derived') + ')', 'lab-sm', 'start').style.fill = C.accent;
        }
      }
    }
    svgPilcrow(s, 690, 18, 'historical_booms', 0);
    function epTip(r) {
      var src = {
        'Canals': 'Cranmer (1960) construction expenditures / Johnston & Williamson GDP',
        'Railroads': "Gallman's 1860-dollar series via Rhode (2002); excludes locomotives & rolling stock",
        'Electrification': 'Ulmer (1960) gross capex, electric light & power',
        'Highways': 'FHWA (2014) government capital outlays',
        'Telecom and fiber': 'BEA private fixed investment, communications',
        'AI buildout': 'Appendix B scenario; GDP sensitivity: 6% growth → 2.95% cumulative'
      }[r.episode] || '';
      return esc(r.episode) + ' ' + esc(r.period) + '\n' +
        bi('average', '年均') + ': ' + fmt(r.size_pct_gdp, 2) + '% · ' + bi('peak', '峰值') + ': ' +
        (r.peak_pct_gdp === null ? '>4% (open interval)' : fmt(r.peak_pct_gdp, 2) + '% (' + (Array.isArray(r.peak_year) ? r.peak_year.join('/') : r.peak_year) + ')') +
        (src ? '\n' + esc(src) : '');
    }
  });
})();

/* ---- 7.7 hyperscaler_capex：双线 + 比率虚线 + 2026 交叉 ---- */
(function () {
  var st = { ratio: true };
  reg(function renderCapex() {
    var vw = V.hyperscaler_capex;
    var body = mount('viz-hyperscaler_capex');
    if (!body) return;
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML = '<button class="switch' + (st.ratio ? ' on' : '') + '" data-a="ratio">' + esc(t('show_ratio')) + ' ─┄</button>';
    body.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      if (e.target.getAttribute && e.target.getAttribute('data-a')) { st.ratio = !st.ratio; renderCapex(); }
    });
    var s = svgEl('svg', { viewBox: '0 0 700 330', width: '100%' }, null);
    body.appendChild(s);
    var x0 = 56, x1 = 612, y0 = 272, yTop = 42;
    var rows = vw.rows;
    var xS = function (i) { return x0 + i * (x1 - x0) / (rows.length - 1); };
    var yA = function (v) { return y0 - (y0 - yTop) * (v / 850); };
    var yB = function (v) { return y0 - (y0 - yTop) * ((v - 30) / 90); };
    [0, 200, 400, 600, 800].forEach(function (tv) {
      sLine(s, x0, yA(tv), x1, yA(tv), { 'class': 'grid' });
      sText(s, x0 - 8, yA(tv) + 3, fmtI(tv), 'ax-tick', 'end');
    });
    [30, 60, 90, 120].forEach(function (tv) {
      sText(s, x1 + 10, yB(tv) + 3, tv + '%', 'ax-tick', 'start').style.fill = C.ink;
    });
    sText(s, x0 - 44, 16, '$B', 'ax');
    sText(s, x1 + 6, 16, 'capex/OCF %', 'ax');
    /* 2026 交叉色带 */
    var x26 = xS(rows.length - 1);
    sRect(s, xS(rows.length - 2) - 4, yTop - 10, x26 - xS(rows.length - 2) + 12, y0 - yTop + 14, { fill: C.accentLight });
    /* 100% 线 */
    sLine(s, x0, yB(100), x1, yB(100), { stroke: C.ink, 'stroke-dasharray': '2 3', 'stroke-width': 0.8 });
    sText(s, x0 + 4, yB(100) - 4, '100%', 'lab-sm', 'start');
    function line(key, color, w) {
      var d = rows.map(function (r, i) { return xS(i) + ',' + yA(r[key]); }).join(' ');
      var p = svgEl('polyline', { points: d, fill: 'none', stroke: color, 'stroke-width': w }, s);
      rows.forEach(function (r, i) {
        var dot = svgEl('circle', { cx: xS(i), cy: yA(r[key]), r: 3.4, fill: color, 'class': 'hoverable' }, s);
        attachTip(dot, r.year + '\n' + (key === 'capex_bn' ? t('capex') : t('ocf')) + ': $' + fmt(r.capex_bn, 1) + 'B / $' + fmt(r.ocf_bn, 1) + 'B\n' +
          t('ratio_line') + ': ' + fmt(r.capex_bn / r.ocf_bn * 100, 0) + '%' +
          (r.year === 2026 ? '\n' + bi('caveat: reported + guidance + Wall Street estimates; excludes leased data centers (→§05)', '口径：已报+指引+华尔街估计；不含租入数据中心（→§05）') : ''));
      });
      return p;
    }
    line('ocf_bn', C.muted, 2.2);
    line('capex_bn', C.accent, 3);
    /* 比率线（衍生） */
    if (st.ratio) {
      var d = rows.map(function (r, i) { return xS(i) + ',' + yB(Math.min(120, r.capex_bn / r.ocf_bn * 100)); }).join(' ');
      svgEl('polyline', { points: d, fill: 'none', stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, s);
      rows.forEach(function (r, i) {
        if (i % 2 === 0 || r.year === 2026) sText(s, xS(i), yB(r.capex_bn / r.ocf_bn * 100) - 8, fmt(r.capex_bn / r.ocf_bn * 100, 0) + '%', 'lab-sm', 'middle');
      });
    }
    /* 2026 双圈 + 缺口 */
    var last = rows[rows.length - 1];
    svgEl('circle', { cx: x26, cy: yA(last.capex_bn), r: 8, fill: 'none', stroke: C.accent, 'stroke-width': 2 }, s);
    svgEl('circle', { cx: x26, cy: yA(last.ocf_bn), r: 8, fill: 'none', stroke: C.muted, 'stroke-width': 2 }, s);
    sLine(s, x26 + 14, yA(last.capex_bn), x26 + 14, yA(last.ocf_bn), { stroke: C.amber, 'stroke-width': 2 });
    sText(s, x26 + 14, yA(last.ocf_bn) + 34, '$93.4B · ' + bi('gap (derived)', '缺口（衍生）'), 'lab', 'middle').style.fill = C.amber;
    sText(s, x26, yA(last.capex_bn) - 22, '$800.5B', 'lab', 'middle').style.fill = C.accent;
    sText(s, x26, yA(last.ocf_bn) + 18, '$707.1B', 'lab', 'middle').style.fill = '#64748b';
    rows.forEach(function (r, i) { sText(s, xS(i), y0 + 16, String(r.year), 'ax-tick', 'middle'); });
    /* 加速标注 */
    sText(s, x0 + 4, yTop - 16, bi('capex ×8.3 vs OCF ×2.8 (2020→2026, derived)', 'capex ×8.3 对 OCF ×2.8（2020→2026，衍生）'), 'lab-sm', 'start');
    svgPilcrow(s, 690, 18, 'hyperscaler_capex', 2);
  });
})();

/* ---- 7.8 financing_mix：两层嵌套堆叠 ---- */
(function () {
  var st = { drill: true };
  reg(function renderFinancing() {
    var vw = V.financing_mix;
    var body = mount('viz-financing_mix');
    if (!body) return;
    var s = svgEl('svg', { viewBox: '0 0 700 ' + (st.drill ? 250 : 170), width: '100%' }, null);
    body.appendChild(s);
    var x0 = 24, x1 = 640;
    /* 第一层 60/40 */
    var y1 = 34, h1 = 44;
    sText(s, x0, 22, bi("Full investment ~$2.9T (2025–28, Morgan Stanley estimate — third-party)", '全投资约 $2.9T（2025–28，Morgan Stanley 估算——第三方口径)'), 'lab');
    var segE = sRect(s, x0, y1, (x1 - x0) * 0.6, h1, { fill: C.light, stroke: C.borderS, 'stroke-width': 0.5, 'class': 'hoverable', rx: 2 });
    attachTip(segE, esc(vw.rows[2].item) + '\n60% · “approximate 60–40 split”\n' + esc(vw.rows[2].note));
    var segD = sRect(s, x0 + (x1 - x0) * 0.6, y1, (x1 - x0) * 0.4, h1, { fill: C.accent, 'class': 'hoverable', rx: 2 });
    segD.style.cursor = 'pointer';
    attachTip(segD, esc(vw.rows[3].item) + '\n40% · “approximate 60–40 split”\n' + esc(vw.rows[3].note) + '\n' + bi('click to toggle drill-down', '点击展开/收起下钻'));
    segD.addEventListener('click', function () { st.drill = !st.drill; renderFinancing(); });
    sText(s, x0 + (x1 - x0) * 0.3, y1 + 20, '60% ' + t('equity'), 'lab', 'middle').style.fill = C.ink;
    sText(s, x0 + (x1 - x0) * 0.8, y1 + 20, '40% ' + t('debt'), 'lab', 'middle').style.fill = '#fff';
    /* >50% 胶囊（无数值，禁造数） */
    var cap = sRect(s, 656, y1 + 6, 36, h1 - 12, { fill: 'none', stroke: C.borderS, 'stroke-dasharray': '3 3', rx: 10 });
    attachTip(cap, esc(vw.rows[1].item) + '\n' + esc(vw.rows[1].note));
    sText(s, 674, y1 + 24, '>50%', 'lab', 'middle').style.fill = C.ink;
    sText(s, 674, y1 + 36, bi('outside', '外部'), 'lab-sm', 'middle');
    /* 第二层：债务三桶（绝对 $B） */
    if (st.drill) {
      var y2 = 128, h2 = 40;
      var buckets = [
        { row: vw.rows[4], color: C.accent, w: 340 },
        { row: vw.rows[5], color: '#5a7fd8', w: 110 },
        { row: vw.rows[6], color: C.muted, w: 92 }
      ];
      var cur = x0 + (x1 - x0) * 0.6 - 200;
      sText(s, x0 + (x1 - x0) * 0.6 - 200, 118, bi('Debt drill-down ($B absolute)', '债务下钻（绝对 $B）'), 'lab-sm');
      buckets.forEach(function (b) {
        var seg = sRect(s, cur, y2, b.w, h2, { fill: b.color, 'class': 'hoverable', rx: 2 });
        attachTip(seg, esc(b.row.item) + '\n$' + fmtI(b.row.value_bn) + 'B · ' + esc(b.row.note));
        var pc = b.row.value_bn / 1150 * 100;
        sText(s, cur + b.w / 2, y2 + 17, '$' + fmtI(b.row.value_bn) + 'B', 'lab', 'middle').style.fill = '#fff';
        sText(s, cur + b.w / 2, y2 + 32, fmt(pc, 0) + '% ' + t('derived'), 'lab-sm', 'middle').style.fill = '#dbeafe';
        cur += b.w + 8;
      });
      sText(s, x0, 200, bi('Reconciliation (derived, fine print): 800 + 200 + 150 = $1,150B ≈ $2.9T × 40% = $1,160B.', '勾稽（衍生，细体）：800 + 200 + 150 = $1,150B ≈ $2.9T × 40% = $1,160B。'), 'lab-sm');
      sText(s, x0, 216, bi('Third-party caliber: Morgan Stanley Research (2025); qualifiers about/roughly/approximately kept verbatim in hover notes.', '第三方口径：Morgan Stanley Research（2025）；「about/roughly/approximately」等英文限定词在浮层中保留原文。'), 'lab-sm');
      svgPilcrow(s, 690, 20, 'financing_mix', 2);
    }
  });
})();

/* ---- 7.9 hyperion_case：三面板 ---- */
(function () {
  var st = { detail: false };
  reg(function renderHyperion() {
    var vw = V.hyperion_case;
    function fk(k) { for (var i = 0; i < vw.rows.length; i++) if (vw.rows[i].fact_key === k) return vw.rows[i]; return null; }
    var body = mount('viz-hyperion_case');
    if (!body) return;
    var s = svgEl('svg', { viewBox: '0 0 1040 470', width: '100%' }, null);
    body.appendChild(s);
    /* Panel A 结构 flow */
    sText(s, 16, 20, 'A · ' + bi('Structure (Figure 2)', '交易结构（图 2）'), 'lab');
    function box(x, y, w, h, lines, provIdx, note) {
      var g = svgEl('g', { 'class': 'hit' }, s);
      var r = sRect(g, x, y, w, h, { 'class': 'flow-box' });
      lines.forEach(function (ln, i) {
        sText(g, x + w / 2, y + 16 + i * 14, ln.t, ln.cls || 'flow-text', 'middle').setAttribute('font-weight', ln.b ? '700' : '400');
      });
      if (provIdx !== null) svgPilcrow(g, x + w - 8, y + 14, 'hyperion_case', provIdx);
      if (note) attachTip(g, esc(note));
      return g;
    }
    function arrow(x1, y1, x2, y2, dashed) {
      sLine(s, x1, y1, x2, y2, { stroke: '#64748b', 'stroke-width': 1.3, 'marker-end': '' });
      svgEl('path', { d: 'M' + x2 + ' ' + y2 + ' l-7 -4 v8 z', fill: '#64748b', transform: 'rotate(' + ang(x1, y1, x2, y2) + ' ' + x2 + ' ' + y2 + ')' }, s);
      function ang(ax, ay, bx, by) {
        var d = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
        return d;
      }
    }
    box(16, 34, 150, 58, [
      { t: 'Meta · 20%', b: true }, { t: 'via Iris Crossing LLC', cls: 'lab-sm' }
    ], 15, fk('meta_jv_vehicle').note);
    box(16, 112, 150, 72, [
      { t: 'Blue Owl · 80%', b: true }, { t: '≈$2.5B for the stake', cls: 'lab-sm' }, { t: 'via Beignet Investor LLC', cls: 'lab-sm' }
    ], 15, fk('blue_owl_jv_vehicle').note);
    box(216, 72, 140, 62, [
      { t: 'JV Beignet', b: true }, { t: 'joint venture', cls: 'lab-sm' }
    ], 8, fk('joint_venture').note);
    arrow(166, 63, 216, 92);
    arrow(166, 148, 216, 112);
    /* SPV */
    var spv = box(406, 66, 190, 74, [
      { t: 'Laidley LLC (SPV)', b: true },
      { t: 'owns the campus', cls: 'lab-sm' },
      { t: '~2.0 GW · ~$30B', cls: 'lab-sm' }
    ], 14, fk('spv_asset_owner').note + '\n' + fk('capacity').note + '\n' + fk('total_investment').note);
    arrow(356, 103, 406, 103);
    sText(s, 406, 58, bi('funded by Project Beignet Holdings LLC', '由 Project Beignet Holdings LLC 出资'), 'lab-sm');
    /* $27B 债节点 */
    var debt = box(406, 176, 190, 74, [
      { t: '$27B A+ debt', b: true },
      { t: 'Oct 2025 · 6.58% · 2049', cls: 'lab-sm' },
      { t: bi('largest single IG issuance in U.S. history', '美国史上最大单笔 IG 发行'), cls: 'lab-sm' }
    ], 5, fk('external_debt_raised').note + '\n' + fk('issuance_yield').note + '\n' + fk('largest_ig_corporate_issuance_us').note + '\n' + t('click_hint_flow'));
    debt.style.cursor = 'pointer';
    debt.addEventListener('click', function () { st.detail = !st.detail; renderHyperion(); });
    arrow(501, 176, 501, 140);
    /* PPA */
    box(660, 66, 170, 74, [
      { t: 'Entergy Louisiana PPA', b: true },
      { t: '3 gas-fired units', cls: 'lab-sm' }
    ], 16, fk('ppa_counterparty').note + '\n' + fk('ppa_new_gas_units').note);
    arrow(596, 103, 660, 103);
    /* 勾稽 */
    sText(s, 16, 226, bi('Reconciliation (derived): $2.5B / 0.8 ≈ $3.125B equity + $27B debt ≈ $30.1B ≈ $30B asset value.', '勾稽（衍生）：$2.5B / 0.8 ≈ $3.125B 股权 + $27B 债 ≈ $30.1B ≈ $30B 资产值。'), 'lab-sm');
    /* Panel B 杠杆三点 */
    sText(s, 16, 268, 'B · ' + bi('Three leverage worlds', '三个杠杆世界'), 'lab');
    var lev = [
      { v: 90, lab: 'Beignet debt/asset', sub: 'DSCR 1.12×', prov: 6 },
      { v: 25, lab: 'Meta book equity', sub: bi('year-end 2025', '2025 年末'), prov: 8 },
      { v: 4, lab: 'Meta market equity', sub: bi('“just 4%”', '「仅 4%」'), prov: 8 }
    ];
    var bx = 40, bw2 = 300;
    lev.forEach(function (l, i) {
      var y = 282 + i * 44;
      var w = Math.max(10, bw2 * l.v / 100);
      var seg = sRect(s, bx, y, w, 26, { fill: i === 0 ? C.accent : C.muted, 'class': 'hoverable', rx: 3 });
      attachTip(seg, l.lab + ': ' + l.v + '%\n' + esc(fk(i === 0 ? 'project_debt_to_asset' : (i === 1 ? 'meta_leverage_book' : 'meta_leverage_market')).note) +
        (i === 0 ? '\nDSCR ' + fk('dscr').value + '× — “only 1.12×”' : '') +
        (i === 2 ? '\nMeta OCF $130B ≥ 18× 2026 debt service' : '') +
        '\n' + bi('two leverage worlds inside one group', '同一集团内的两个杠杆世界'));
      /* 90% 条的右侧是 Panel C 时间轴起点——标签改为条内白字；其余条标签在右侧 */
      var fullLab = l.v + '% · ' + l.lab + ' (' + l.sub + ')';
      if (i === 0) {
        sText(s, bx + w - 10, y + 17, fullLab, 'lab-sm', 'end').style.fill = '#fff';
      } else {
        sText(s, bx + w + 8, y + 17, fullLab, 'lab-sm', 'start');
      }
    });
    sText(s, bx, 416, bi('Meta OCF $130B is at least 18× its 2026 debt service (fn4).', 'Meta 经营现金流 $130B 至少为其 2026 年偿债的 18 倍（脚注 4）。'), 'lab-sm');
    /* Panel C 租约时间轴 */
    sText(s, 400, 268, 'C · ' + bi('Five 4-year leases 2029 → 2049', '五段各 4 年租约 2029 → 2049'), 'lab');
    var tx0 = 402, tx1 = 1010, ty = 300;
    var t0 = 2025, t1 = 2049;
    var tS = function (yr) { return tx0 + (tx1 - tx0) * (yr - t0) / (t1 - t0); };
    sLine(s, tx0, ty, tx1, ty, { stroke: C.ink, 'stroke-width': 1.4 });
    for (var yr = 2025; yr <= 2049; yr += 4) {
      sLine(s, tS(yr), ty - 5, tS(yr), ty + 5, { stroke: C.ink });
      sText(s, tS(yr), ty + 20, String(yr), 'ax-tick', 'middle');
    }
    for (var k = 0; k < 5; k++) {
      var a = 2029 + k * 4, b = a + 4;
      var seg = sRect(s, tS(a), ty - 26, tS(b) - tS(a) - 3, 20, { fill: k % 2 ? C.muted : C.accent, 'class': 'hoverable', rx: 3 });
      attachTip(seg, bi('lease', '租约') + ' ' + (k + 1) + '/5 · ' + a + '–' + b + ' (4y)\n' + esc(fk('lease_count').note));
      /* ▲ 终止权 */
      var gate = svgEl('path', { d: 'M' + (tS(b) - 1.5) + ' ' + (ty - 34) + ' l5 9 h-10 z', fill: C.ink, 'class': 'hoverable' }, s);
      attachTip(gate, '▲ ' + bi('renewal gate: termination option + asset sale + residual value guarantee', '续约闸门：终止权 + 资产出售 + 残值担保') + '\n' + esc(fk('tenant_termination_option').note) + '\n' + esc(fk('gaap_recognized_before_effective').note));
    }
    sText(s, tS(2025), ty - 48, '▲ ' + bi('bond issued Oct 2025', '债券发行 2025-10'), 'lab-sm', 'start');
    sText(s, tx1, ty - 40, '2049 ' + bi('maturity', '到期'), 'lab-sm', 'end');
    sText(s, 402, 372, bi('GAAP: Meta recognizes neither future lease obligations nor the RVG before effectiveness — “even though one of the two commitments will ultimately materialize for sure”.', 'GAAP：Meta 在生效前对未来租约与残值担保均不予确认——「尽管两项承诺中必有一项最终兑现」。'), 'lab-sm');
    /* 发行细节卡 */
    if (st.detail) {
      var card = document.createElement('div');
      card.className = 'info-card';
      card.style.margin = '12px 0 0';
      card.innerHTML = '<div class="label">' + esc(t('issue_detail')) + ' · $27B</div><div class="content">' +
        '<span class="en">Rated <b>A+</b> by S&amp;P — <b>one notch below</b> Meta’s own corporate rating; issued at <b>6.58%</b>, <b>≥100bp</b> above what Meta likely would have paid on comparable unsecured debt; lifetime extra interest <b>&gt;$5B</b> (ultimately reflected in Meta’s lease payments); bondholders have <b>no direct claim</b> on Meta’s balance sheet. Economic rationale: “not cheaper financing, but preservation of an asset-light corporate profile”.</span>' +
        '<span class="zh">标普评级 <b>A+</b>——低于 Meta 公司评级<b>一档</b>；发行收益率 <b>6.58%</b>，高于 Meta 同类无担保债<b>至少 100bp</b>；全周期多付利息 <b>&gt;$5B</b>（最终计入 Meta 租金）；债券持有人对 Meta 资产负债表<b>无直接求偿权</b>。经济动机：「不是更便宜的融资，而是以维持轻资产的公司形象」。</span>' +
        '<button class="pilcrow" data-prov="hyperion_case:5" type="button">¶</button> <button class="pilcrow" data-prov="hyperion_case:17" type="button">¶</button> <button class="pilcrow" data-prov="hyperion_case:18" type="button">¶</button> <button class="pilcrow" data-prov="hyperion_case:20" type="button">¶</button></div>';
      body.appendChild(card);
    }
    /* Sopaipilla 卡 */
    var sop = document.createElement('div');
    sop.className = 'viz-note';
    sop.innerHTML = 'C23 · ' + esc(bi('Template copied: the 960 MW Sopaipilla project (Meta × Blackrock JV, El Paso TX) issued $12.3B of A+-rated bonds in July 2026 on a nearly identical structure.', '模板已复制：960 MW Sopaipilla 项目（Meta × Blackrock 合资，El Paso TX）于 2026 年 7 月以几乎相同结构发行 $12.3B A+ 债。')) +
      ' <button class="pilcrow" data-prov="hyperion_case:22" type="button">¶</button>';
    body.appendChild(sop);
  });
})();

/* ---- 7.10 offbalance_leverage：Panel A 堆叠 + Panel B 斜率 + 源切换 ---- */
(function () {
  var st = { src: 'wsj' };
  reg(function renderOffbalance() {
    var vw = V.offbalance_leverage;
    function fk(k) { for (var i = 0; i < vw.rows.length; i++) if (vw.rows[i].fact_key === k) return vw.rows[i]; return null; }
    var body = mount('viz-offbalance_leverage');
    if (!body) return;
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML = '<span class="ctl-label">' + esc(t('src_toggle')) + ':</span>' +
      '<button class="switch' + (st.src === 'wsj' ? ' on' : '') + '" data-a="wsj">' + esc(t('source_wsj')) + '</button>' +
      '<button class="switch' + (st.src === 'moodys' ? ' on' : '') + '" data-a="moodys">' + esc(t('source_moodys')) + '</button>';
    body.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a) { st.src = a; renderOffbalance(); }
    });
    var s = svgEl('svg', { viewBox: '0 0 700 330', width: '100%' }, null);
    body.appendChild(s);
    hatchDef(s, 'h-ob', '#9ca3af');
    var x0 = 24, x1 = 660;
    if (st.src === 'wsj') {
      sText(s, x0, 20, 'Panel A · ' + bi('$3T data-center obligations (WSJ, fn5) — only one-fifth visible', '$3T 数据中心义务（WSJ，脚注 5）——仅五分之一可见'), 'lab');
      var segs = [
        { v: 604, wv: 604, lab: bi('on balance 604', '表内 604'), color: C.accent, hatch: false, sub: '356 LTD + 248 leases', note: fk('wsj_onbalance_total').note },
        { v: 904, wv: 904 * 2400 / 2424, lab: bi('future leases 904', '未来租赁 904'), color: C.muted, hatch: false, sub: '', note: fk('wsj_future_lease_commitments').note + '\n' + bi('width normalized to the paper\'s $2.4T off-balance total (904+1,520=2,424)', '条宽归一至论文 $2.4T 表外口径（904+1,520=2,424）') },
        { v: 1520, wv: 1520 * 2400 / 2424, lab: bi('purchases 1,520', '采购 1,520'), color: '#e5e7eb', hatch: true, sub: bi('mostly chips', '多为芯片'), note: fk('wsj_future_purchase_commitments').note + '\nfn9: NVIDIA $500B facility / 25% RVG / ≤$125B backstop (→§06)' }
      ];
      var tot = 3004;
      sText(s, x0, 44, bi('20.1% visible', '20.1% 可见') + ' (' + t('derived') + ')', 'lab').style.fill = C.accent;
      var cur = x0, ay = 58, ah = 46;
      segs.forEach(function (sg) {
        var w = (x1 - x0) * (sg.wv / tot);
        var attrs = { 'class': 'hoverable', stroke: C.borderS, 'stroke-width': 0.5 };
        attrs.fill = sg.hatch ? '#f3f4f6' : sg.color;
        var seg = sRect(s, cur, ay, w, ah, attrs);
        if (sg.hatch) { seg.style.fill = 'url(#h-ob)'; seg.setAttribute('fill-opacity', '0.55'); }
        attachTip(seg, sg.lab + '\n$' + fmtI(sg.v) + 'B · ' + fmt(sg.v / tot * 100, 1) + '%' + (sg.sub ? '\n' + sg.sub : '') + '\n' + esc(sg.note));
        sText(s, cur + w / 2, ay + 20, '$' + fmtI(sg.v) + 'B', 'lab', 'middle').style.fill = sg.hatch ? C.ink : '#fff';
        sText(s, cur + w / 2, ay + 36, fmt(sg.v / tot * 100, 1) + '%', 'lab-sm', 'middle').style.fill = sg.hatch ? C.ink : '#e0e7ff';
        cur += w;
      });
      sText(s, x1, 44, bi('off-balance $2,400B = 79.9%', '表外 $2,400B = 79.9%'), 'lab-sm', 'end');
    } else {
      sText(s, x0, 20, "Panel A · " + bi("Moody's (2026a): hyperscaler lease commitments", 'Moody\'s（2026a）：超大规模厂商租赁承诺'), 'lab');
      var ay2 = 58, ah2 = 46;
      var wOff = (x1 - x0) * (660 / 970);
      var segOn = sRect(s, x0, ay2, (x1 - x0) * (310 / 970), ah2, { fill: C.accent, 'class': 'hoverable' });
      attachTip(segOn, bi('reflected on balance sheet', '已入表') + ': ~$310B (derived residual)\n' + esc(fk('moodys_hyperscaler_lease_commitments').note));
      var segOff = sRect(s, x0 + (x1 - x0) * (310 / 970), ay2, wOff, ah2, { fill: 'url(#h-ob)', 'fill-opacity': 0.6, 'class': 'hoverable', stroke: C.borderS });
      attachTip(segOff, bi('future leases NOT on balance sheet', '未入表的未来租约') + ': ~$660B\n' + esc(fk('moodys_offbalance_future_leases').note));
      sText(s, x0 + (x1 - x0) * (155 / 970), ay2 + 28, '~$310B', 'lab', 'middle').style.fill = '#fff';
      sText(s, x0 + (x1 - x0) * (310 / 970) + wOff / 2, ay2 + 28, '$660B · 68% ' + bi('not on B/S (derived)', '未入表（衍生）'), 'lab', 'middle');
      sText(s, x0, 44, bi("roughly $970B total lease commitments", '租赁承诺合计约 $970B'), 'lab-sm');
    }
    /* Panel B 斜率 */
    sText(s, x0, 140, 'Panel B · ' + bi('leverage with leases capitalized (fn6, ex-Amazon, June 2026)', '计入租约后的杠杆（脚注 6，剔除 Amazon，2026-06）'), 'lab');
    function slope(cx, l1, l2, unit, mult) {
      var yTop2 = 156, yBot = 258;
      var y1 = yBot - (yBot - yTop2) * 0.18;
      var y2 = yBot - (yBot - yTop2) * 0.95;
      var g = svgEl('g', { 'class': 'hit' }, s);
      svgEl('circle', { cx: cx - 60, cy: y1, r: 5, fill: C.ink }, g);
      svgEl('circle', { cx: cx + 60, cy: y2, r: 5, fill: C.accent }, g);
      sLine(g, cx - 60, y1, cx + 60, y2, { stroke: C.accent, 'stroke-width': 2.4 });
      sText(g, cx - 60, y1 - 10, l1 + unit, 'lab', 'middle');
      sText(g, cx + 60, y2 - 10, l2 + unit, 'lab', 'middle');
      sText(g, cx, (y1 + y2) / 2 + 4, '×' + mult + ' (' + t('derived') + ')', 'lab', 'middle').style.fill = C.amber;
      sText(g, cx - 60, yBot + 16, t('reported'), 'lab-sm', 'middle');
      sText(g, cx + 60, yBot + 16, t('plus_lease'), 'lab-sm', 'middle');
      attachTip(g, 'L: ' + l1 + ' → ' + l2 + unit + ' (×' + mult + ', derived)\n' + esc(fk('fn6_l1').note) + '\n' + esc(fk('fn6_uncommenced_lease_pv_factor').note));
    }
    slope(190, '20', '48', '%', '2.4');
    slope(480, '0.7', '2.6', '×', '3.7');
    sText(s, x0, 300, bi('Two denominators, side by side: debt/(debt+book equity) vs debt/EBITDA — the cash-flow metric is more sensitive (×3.7 vs ×2.4). Uncommenced leases ×0.75 as PV approximation.', '两种分母并列：债务/(债务+账面股本) 对 债务/EBITDA——现金流口径更敏感（×3.7 对 ×2.4）。未生效租约按 ×0.75 近似现值。'), 'lab-sm');
    svgPilcrow(s, 690, 18, 'offbalance_leverage', st.src === 'wsj' ? 1 : 0);
    svgPilcrow(s, 690, 34, 'offbalance_leverage', 8);
  });
})();

/* ---- 7.11 market_signals：CDS 斜率 + beta + 循环担保 ---- */
(function () {
  reg(function renderSignals() {
    var vw = V.market_signals;
    function sv(k) { for (var i = 0; i < vw.rows.length; i++) if (vw.rows[i].signal === k) return vw.rows[i]; return null; }
    var body = mount('viz-market_signals');
    if (!body) return;
    var s = svgEl('svg', { viewBox: '0 0 1040 482', width: '100%' }, null);
    body.appendChild(s);
    /* Panel A CDS */
    sText(s, 16, 20, 'A · ' + bi('5y CDS spreads (fn8) — all five widened', '五年期 CDS 利差（脚注 8）——五家超大规模厂商全员走阔'), 'lab');
    var firms = [
      { n: 'Oracle', a: 118.8, b: 205.5 },
      { n: 'Amazon', a: 39.7, b: 59.6 },
      { n: 'Meta', a: 56.1, b: 80.2 },
      { n: 'Alphabet', a: 44.7, b: 57.7 },
      { n: 'Microsoft', a: 35.1, b: 47.7 }
    ];
    var ax0 = 120, ax1 = 420, ayT = 44, ayB = 288;
    var yC = function (v) { return ayB - (ayB - ayT) * (v / 220); };
    [0, 50, 100, 150, 200].forEach(function (tv) {
      sLine(s, ax0, yC(tv), ax1, yC(tv), { 'class': 'grid' });
      sText(s, ax0 - 8, yC(tv) + 3, String(tv), 'ax-tick', 'end');
    });
    sText(s, ax0 - 8, 46, 'bp', 'ax', 'end');
    var opac = [1, 0.78, 0.62, 0.48, 0.36];
    /* 端点/中点标签防撞：按 y 排序后强制最小间距（9.5px 字需 ≥11px） */
    function nudgeY(arr, key, gap) {
      var order = arr.map(function (d, k) { return k; }).sort(function (a, b) { return arr[a][key] - arr[b][key]; });
      var prev = -1e9;
      order.forEach(function (k) { arr[k][key] = Math.max(arr[k][key], prev + gap); prev = arr[k][key]; });
      return arr;
    }
    var geo = firms.map(function (f, i) {
      var y1 = yC(f.a), y2 = yC(f.b);
      return { f: f, i: i, y1: y1, y2: y2, labA: y1 + 4, labB: y2 + 4, mid: (y1 + y2) / 2 - 6 };
    });
    nudgeY(geo, 'labA', 11);
    nudgeY(geo, 'labB', 12);
    nudgeY(geo, 'mid', 11);
    geo.forEach(function (d) {
      var f = d.f, i = d.i;
      var g = svgEl('g', { 'class': 'hit' }, s);
      sLine(g, ax0, d.y1, ax1, d.y2, { stroke: C.accent, 'stroke-width': f.n === 'Oracle' ? 3 : 2, 'stroke-opacity': opac[i], 'stroke-dasharray': f.n === 'Amazon' ? '5 4' : 'none' });
      svgEl('circle', { cx: ax0, cy: d.y1, r: 4, fill: '#fff', stroke: C.accent, 'stroke-opacity': opac[i], 'stroke-width': 2 }, g);
      svgEl('circle', { cx: ax1, cy: d.y2, r: 4.5, fill: C.accent, 'fill-opacity': opac[i] }, g);
      sText(g, ax0 - 10, d.labA, fmt(f.a, 1), 'lab-sm', 'end');
      sText(g, ax1 + 10, d.labB, fmt(f.b, 1), 'lab', 'start');
      sText(g, (ax0 + ax1) / 2, d.mid, f.n + ' +' + fmt(f.b - f.a, 1) + 'bp +' + fmt((f.b / f.a - 1) * 100, 0) + '%', 'lab-sm', 'middle');
      attachTip(g, f.n + ': ' + fmt(f.a, 1) + ' → ' + fmt(f.b, 1) + ' bp\n+' + fmt(f.b - f.a, 1) + 'bp · +' + fmt((f.b / f.a - 1) * 100, 1) + '% (derived)' +
        (f.n === 'Amazon' ? '\nexcluded from fn6 L1–L4 sample (warehouse-heavy leases)' : '') + '\n' + esc(sv('cds_observation_window').note));
    });
    sText(s, ax0, ayB + 18, '2025-11-21', 'ax-tick', 'middle');
    sText(s, ax1, ayB + 18, '2026-07-22', 'ax-tick', 'middle');
    /* 聚合带 */
    var band = sRect(s, ax0, 306, ax1 - ax0, 40, { fill: C.accentLight, 'class': 'hoverable', rx: 4 });
    attachTip(band, bi('aggregate (derived): 294.4 → 450.7 bp = +156.3bp = +53.1%; Oracle contributes 86.7/156.3 = 55.5%', '合计（衍生）：294.4 → 450.7 bp = +156.3bp = +53.1%；Oracle 贡献 86.7/156.3 = 55.5%'));
    sText(s, ax0 + 8, 322, bi('Σ 294.4 → 450.7 bp (+53.1%, derived) · Oracle 55.5% of the move', 'Σ 294.4 → 450.7 bp（+53.1%，衍生）· Oracle 独占走阔的 55.5%'), 'lab-sm', 'start');
    sText(s, ax0, 366, bi('Endpoints only — the paper states two spreads per firm, no daily path (a path would be fabricated resolution).', '仅两端点——论文每家只给两个利差值，无逐日路径（画路径即伪造分辨率）。'), 'lab-sm');
    /* Panel B beta */
    sText(s, 480, 20, 'B · ' + t('reit_beta') + ' (Figure 3)', 'lab');
    var bx0 = 560, bx1 = 900, byT = 60, byB = 220;
    var yBt = function (v) { return byB - (byB - byT) * (v / 1.05); };
    sLine(s, bx0, yBt(0), bx0, yBt(1.05), { 'class': 'grid' });
    [0, 0.5, 1.0].forEach(function (tv) {
      sLine(s, bx0, yBt(tv), bx1, yBt(tv), { 'class': 'grid' });
      sText(s, bx0 - 8, yBt(tv) + 3, fmt(tv, 1), 'ax-tick', 'end');
    });
    var bg = svgEl('g', { 'class': 'hit' }, s);
    sLine(bg, bx0, yBt(0.5), bx1, yBt(1), { stroke: C.ink, 'stroke-width': 3 });
    svgEl('circle', { cx: bx0, cy: yBt(0.5), r: 4.5, fill: '#fff', stroke: C.ink, 'stroke-width': 2 }, bg);
    svgEl('circle', { cx: bx1, cy: yBt(1), r: 4.5, fill: C.ink }, bg);
    sText(bg, bx0 - 10, yBt(0.5) + 4, '~0.5', 'lab-sm', 'end');
    sText(bg, bx1 + 10, yBt(1) + 4, '~1', 'lab', 'start');
    attachTip(bg, 'beta ~0.5 → ~1 (36-month rolling, monthly 2018-01 → 2026-03)\n' + esc(sv('figure3_sample_period').note));
    sText(s, bx0, byB + 18, '2018-01', 'ax-tick', 'middle');
    sText(s, bx1, byB + 18, '2026-03', 'ax-tick', 'middle');
    sRect(s, 480, 256, 540, 44, { fill: '#f6f8fc', stroke: C.border, rx: 4 });
    sText(s, 492, 272, bi('non-AI S&P 500 exposure: now COMPARABLE to AI-stock exposure', '对标普 500 非 AI 成分的暴露：已与 AI 股暴露相当'), 'lab-sm', 'start');
    sText(s, 492, 288, bi('(qualitative statement — no numeric line drawn)', '（定性表述——不画数值线）'), 'lab-sm', 'start');
    sText(s, 480, 344, bi('“Data centers appear less like defensive infrastructure… and more like part of the same systematic risk complex.”', '「数据中心越来越不像防御性基础设施……而更像同一系统风险复合体的一部分。」'), 'lab-sm');
    svgPilcrow(s, 480 + 540, 20, 'market_signals', 10);
    /* Panel C 循环担保 */
    sText(s, 16, 396, 'C · ' + bi('Circular backstop: the $500B chip facility (fn9)', '循环兜底：$500B 芯片工具（脚注 9）'), 'lab');
    function fbox(x, y, w, h, lines, note, provIdx) {
      var g = svgEl('g', { 'class': 'hit' }, s);
      sRect(g, x, y, w, h, { 'class': 'flow-box' });
      lines.forEach(function (ln, i) { sText(g, x + w / 2, y + 16 + i * 14, ln, 'flow-text', 'middle'); });
      attachTip(g, esc(note));
      if (provIdx !== null) svgPilcrow(g, x + w - 8, y + 14, 'market_signals', provIdx);
      return g;
    }
    fbox(16, 410, 240, 46, ['Apollo · BlackRock · Blackstone', 'Brookfield · Goldman Sachs · KKR'], sv('nvidia_facility_participants').note, null);
    fbox(300, 410, 210, 46, ['$500B chip financing facility', 'August 2026'], sv('nvidia_facility_size_bn').note + '\n' + sv('nvidia_facility_date').note, 3);
    fbox(560, 410, 170, 46, ['NVIDIA chips', '(purchases)'], bi('finances purchases of NVIDIA chips', '为 NVIDIA 芯片采购融资'), null);
    sLine(s, 256, 433, 300, 433, { stroke: '#64748b', 'stroke-width': 1.3 });
    sLine(s, 510, 433, 560, 433, { stroke: '#64748b', 'stroke-width': 1.3 });
    /* 回边：25% RVG */
    var back = svgEl('path', {
      d: 'M645 456 C 645 466, 405 466, 405 456',
      fill: 'none', stroke: C.accent, 'stroke-width': 2, 'stroke-dasharray': '6 3', 'class': 'hoverable'
    }, s);
    attachTip(back, 'NVIDIA → facility: 25% residual value guarantee\n“as much as $125 billion of backstops” (qualifier kept)\n' + esc(sv('nvidia_residual_value_guarantee_pct').note));
    sText(s, 525, 478, '← 25% RVG · ≤$125B', 'lab-sm', 'middle').style.fill = C.accent;
    /* ghost */
    var ghost = fbox(770, 410, 250, 46, ['Google × Broadcom (TPU)', bi('similar arrangement — ghost', '类似安排——虚影')], sv('google_broadcom_similar_arrangement').note, 5);
    ghost.setAttribute('opacity', '0.55');
    ghost.querySelector('rect').setAttribute('stroke-dasharray', '5 4');
    svgPilcrow(s, 16, 34, 'market_signals', 2);
  });
})();

/* ---- 7.12 revenue_requirement：阶梯瀑布 + 分队列柱 ---- */
(function () {
  reg(function renderReqRev() {
    var vw = V.revenue_requirement;
    var body = mount('viz-revenue_requirement');
    if (!body) return;
    var s = svgEl('svg', { viewBox: '0 0 1040 380', width: '100%' }, null);
    body.appendChild(s);
    /* Panel A：对数标尺阶梯（断轴等价） */
    sText(s, 16, 20, 'Panel A · ' + bi('capital ladder (log scale — broken-axis equivalent)', '资本阶梯（对数标尺——断轴等价）'), 'lab');
    var steps = [
      { v: vw.totals.cost_bn, lab: 'ΣQ_t cost', prov: 1 },
      { v: vw.totals.capital_bn, lab: '×1.04527 → B_t', prov: 2 },
      { v: vw.totals.req_cf_bn, lab: '×19.37% → CF', prov: 3 },
      { v: vw.totals.req_rev_bn, lab: '÷50% → Rev', prov: 4 }
    ];
    var ax0 = 60, ax1 = 560, ayB = 300, ayT = 56;
    var lg = function (v) { return Math.log10(v); };
    var lmin = lg(1500), lmax = lg(9600);
    var yL = function (v) { return ayB - (ayB - ayT) * ((lg(v) - lmin) / (lmax - lmin)); };
    [2000, 4000, 9000].forEach(function (tv) {
      sLine(s, ax0, yL(tv), ax1, yL(tv), { 'class': 'grid' });
      sText(s, ax0 - 8, yL(tv) + 3, fmtI(tv), 'ax-tick', 'end');
    });
    sText(s, ax0 - 44, 36, '$B (log)', 'ax');
    var n = steps.length;
    var stepW = (ax1 - ax0) / n;
    steps.forEach(function (st, i) {
      var cx = ax0 + i * stepW + stepW / 2;
      var bw = 62;
      var bar = sRect(s, cx - bw / 2, yL(st.v), bw, ayB - yL(st.v), { fill: 'rgba(37,99,235,' + (0.45 + i * 0.18) + ')', 'class': 'hoverable', rx: 3 });
      attachTip(bar, st.lab + ': $' + fmtI(st.v) + 'B' +
        '\nφ = 1.04527 (r=10%)' +
        '\na(10%,6)=22.96% · a(10%,20)=11.75%' +
        '\nw = 0.68×22.96% + 0.32×11.75% = 19.37%' +
        '\nreq_rev ≈ 2 × req_cf' + bi(' (0.1 off — table rounding)', '（0.1 差系表内四舍五入）'));
      sText(s, cx, yL(st.v) - 20, '$' + fmtI(st.v) + 'B', 'lab', 'middle');
      sText(s, cx, yL(st.v) - 8, st.lab, 'lab-sm', 'middle');
      if (i > 0) {
        var pv = steps[i - 1].v;
        var my = (yL(pv) + yL(st.v)) / 2;
        var op = i === 1 ? '×1.04527' : (i === 2 ? '×19.37%' : '÷50%');
        sText(s, cx - stepW / 2 + 8, my, op, 'lab', 'start').style.fill = C.amber;
        sLine(s, cx - stepW / 2 + bw / 2 + 2, yL(pv), cx - stepW / 2 + bw / 2 + 2, yL(st.v), { stroke: C.amber, 'stroke-dasharray': '3 3', 'stroke-width': 1.2 });
      }
      svgPilcrow(s, cx + bw / 2 - 4, yL(st.v) + 14, 'revenue_requirement', st.prov);
    });
    sText(s, ax1, 324, '3,548.5 / 40,481 = 8.77% ≈ 8.8% ' + bi('of 2032 GDP', '占 2032 年 GDP'), 'lab', 'end').style.fill = C.accent;
    var endX = ax0 + 3 * stepW + stepW / 2;
    var endDot = svgEl('circle', { cx: endX, cy: yL(3548.5) - 34, r: 5, fill: 'none', stroke: C.accent, 'stroke-width': 1.5, 'class': 'hoverable' }, s);
    attachTip(endDot, bi('“not a forecast of AI revenues” — click to open the slider lab', '「这不是对 AI 收入的预测」——点击打开滑杆实验台'));
    endDot.style.cursor = 'pointer';
    endDot.addEventListener('click', function () {
      var lab = el('slider-lab');
      if (lab) lab.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    /* Panel B 分队列柱 */
    sText(s, 620, 20, 'Panel B · ' + bi('required revenue by cohort', '按建成年的所需收入'), 'lab');
    var bx0 = 648, bx1 = 1000, byB = 300, byT = 56;
    var rows = vw.rows;
    var nn = rows.length;
    var stepB = (bx1 - bx0) / nn;
    var bwB = Math.min(30, stepB - 8);
    var yR = function (v) { return byB - (byB - byT) * (v / 850); };
    [0, 400, 800].forEach(function (tv) {
      sLine(s, bx0, yR(tv), bx1, yR(tv), { 'class': 'grid' });
      sText(s, bx0 - 8, yR(tv) + 3, fmtI(tv), 'ax-tick', 'end');
    });
    rows.forEach(function (r, i) {
      var cx = bx0 + i * stepB + (stepB - bwB) / 2;
      var is28 = r.year === 2028;
      var bar = sRect(s, cx, yR(r.req_rev_bn), bwB, byB - yR(r.req_rev_bn), { fill: is28 ? C.accent : C.muted, 'class': 'hoverable', rx: 2, stroke: is28 ? C.borderS : 'none', 'stroke-width': is28 ? 1.4 : 0 });
      attachTip(bar, r.year + '\ngw: ' + fmt(r.gw, 1) + ' GW\ncost: $' + fmtI(r.cost_bn) + 'B\ncapital: $' + fmtI(r.capital_bn) + 'B\nreq_cf: $' + fmt(r.req_cf_bn, 1) + 'B\nreq_rev: $' + fmt(r.req_rev_bn, 1) + 'B\n' +
        'req_rev ≈ 2 × req_cf' + bi(' (2026/2031 off by 0.1 — rounding)', '（2026/2031 差 0.1——四舍五入）'));
      if (!is28) {
        sText(s, cx + bwB / 2, yR(r.req_rev_bn) - 18, fmtI(r.req_rev_bn), 'lab-sm', 'middle');
        sText(s, cx + bwB / 2, yR(r.req_rev_bn) - 7, fmt(r.gw, 1) + ' GW', 'lab-sm', 'middle').style.fill = '#64748b';
      }
      sText(s, cx + bwB / 2, byB + 14, String(r.year).slice(2), 'ax-tick', 'middle');
    });
    /* 2028 峰值注释：置于 Panel B 右上空区（标题行之下、柱顶之上），2028 柱数值改标于柱右侧 */
    var x28 = bx0 + 3 * stepB + (stepB - bwB) / 2 + bwB / 2;
    var r28 = rows.filter(function (r) { return r.year === 2028; })[0];
    if (r28) {
      var cx28 = bx0 + 3 * stepB + (stepB - bwB) / 2;
      sText(s, cx28 + bwB + 6, yR(r28.req_rev_bn) + 4, fmtI(r28.req_rev_bn), 'lab-sm', 'start').style.fill = C.accent;
      sText(s, cx28 + bwB + 6, yR(r28.req_rev_bn) + 15, fmt(r28.gw, 1) + ' GW', 'lab-sm', 'start').style.fill = '#64748b';
    }
    sText(s, bx1 - 2, 40, '$812.2B = 22.9% ' + bi('of total (derived)', '占总额（衍生）'), 'lab-sm', 'end').style.fill = C.accent;
    sText(s, bx1 - 2, 54, bi('investment peak = revenue peak year', '投资峰 = 收入峰同年'), 'lab-sm', 'end').style.fill = C.accent;
    sText(s, bx0 - 20, 340, bi('Cohort reconciliation: 2028 row 32.7 GW (Table 4) + 10.8 = Table 6 note: undated 54.0 GW ÷ 5 (2028–32) → 43.5 GW.', '队列勾稽：表 4 的 2028 行 32.7 GW + 10.8 = 表 6 注的无日期 54.0 GW ÷ 5（2028–32 均摊）→ 43.5 GW。'), 'lab-sm');
    svgPilcrow(s, 1024, 20, 'revenue_requirement', 8);
  });
})();

/* ---- 7.13 revenue_sensitivity：3×3 格 + 市价对峙 + 滑杆实验台 ---- */
(function () {
  var LAB = { r: 10, mu: 50, life: 6, u: 100 };
  var LAB_CHECK = { ok: null, msg: '' };
  function crf(r, n) { return r / (1 - Math.pow(1 + r, -n)); }
  function wOf(rPct, life) { return 0.68 * crf(rPct / 100, life) + 0.32 * crf(rPct / 100, 20); }
  /* φ(r)：论文式(3)（PDF p.29）——Table 7 注明资本基座随 r 用式(3)重算（p.31），
     故实验台在 r≠10% 时也按 8,762.2 × φ(r) 取基座，而非固定 9,158.8。 */
  function phiOf(rPct) {
    var r = rPct / 100;
    return 0.05122 * Math.pow(1 + r, 3) + 0.05122 * Math.pow(1 + r, 2) + 0.17561 * (1 + r) + 0.72195;
  }
  function labCalc(r, mu, life, u) {
    var w = wOf(r, life);
    var reqRev = 8762.2 * phiOf(r) * w / (mu / 100);
    var gdpPct = reqRev / 40481 * 100;
    var gpu = reqRev * 1e9 / (79.3e6 * 8760 * (u / 100));
    return { w: w, reqRev: reqRev, gdpPct: gdpPct, gpu: gpu, gap: gpu / 6.07 - 1, phi: phiOf(r) };
  }
  /* 锚点自测（site-plan §3.14 断言 + Table 7 全档复算） */
  (function anchors() {
    var a = labCalc(10, 50, 6, 100);
    var b = labCalc(10, 50, 3, 100);
    var c5 = labCalc(5, 50, 6, 100);
    var c15 = labCalc(15, 50, 6, 100);
    var ok =
      Math.abs(a.w - 0.1937) < 0.0006 &&
      Math.abs(a.phi - 1.04527) < 0.00005 &&
      Math.abs(a.reqRev - 3548) / 3548 < 0.005 &&
      Math.abs(a.gpu - 5.11) < 0.05 &&
      Math.abs(b.w - 0.3110) < 0.0006 &&
      Math.abs(b.reqRev - 5697) / 5697 < 0.005 &&
      Math.abs(b.gdpPct - 14.1) < 0.15 &&
      Math.abs(c5.reqRev - 2860) / 2860 < 0.005 &&
      Math.abs(c15.reqRev - 4326) / 4326 < 0.005;
    LAB_CHECK.ok = ok;
    LAB_CHECK.msg = ok
      ? '(10%,50%,6y,100%) → φ=1.04527, w=' + fmt(a.w, 4) + ', $' + fmt(a.reqRev, 0) + 'B, $' + fmt(a.gpu, 2) + '/GPU-hr ; (10%,50%,3y,100%) → w=' + fmt(b.w, 4) + ', $' + fmt(b.reqRev, 0) + 'B, ' + fmt(b.gdpPct, 1) + '% of GDP ; Table 7 cross-check: 5% → $' + fmt(c5.reqRev, 0) + 'B (2,860) ; 15% → $' + fmt(c15.reqRev, 0) + 'B (4,326)'
      : 'ANCHOR MISMATCH a={w:' + a.w.toFixed(4) + ', phi:' + a.phi.toFixed(5) + ', rev:' + a.reqRev.toFixed(1) + ', gpu:' + a.gpu.toFixed(2) + '} b={w:' + b.w.toFixed(4) + ', rev:' + b.reqRev.toFixed(1) + ', gdp:' + b.gdpPct.toFixed(2) + '} 5%=' + c5.reqRev.toFixed(1) + ' 15%=' + c15.reqRev.toFixed(1);
    if (!ok && window.console && console.error) console.error('[acbl] ' + LAB_CHECK.msg);
    if (ok && window.console && console.info) console.info('[acbl] slider-lab anchor self-test ✓ ' + LAB_CHECK.msg);
  })();

  /* 当前情景条所在动态组 + 输出更新（滑杆拖动时不重建 DOM） */
  var dynG = null;
  var bx0g = 120, bx1g = 560;
  function xP(v) { return bx0g + (bx1g - bx0g) * (v / 9.5); }
  function drawDyn() {
    if (!dynG) return;
    while (dynG.firstChild) dynG.removeChild(dynG.firstChild);
    var cur = labCalc(LAB.r, LAB.mu, LAB.life, LAB.u);
    var cy = 244 + 4 * 26 + 6;
    var val = Math.min(9.5, cur.gpu);
    var warn = cur.gpu > 6.07;
    var col = warn ? C.amber : C.green;
    var g2 = svgEl('g', {}, dynG);
    var bar = sRect(g2, bx0g, cy, xP(val) - bx0g, 18, { fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-dasharray': '5 3', rx: 3, 'class': 'hoverable' });
    attachTip(bar, t('lab_current') + ': $' + fmt(cur.gpu, 2) + '/GPU-hr\nr=' + LAB.r + '% · μ=' + LAB.mu + '% · ' + LAB.life + 'y · u=' + LAB.u + '%');
    sText(g2, bx0g - 8, cy + 13, t('lab_current'), 'lab-sm', 'end');
    var tx = sText(g2, xP(val) + 8, cy + 13, '$' + fmt(cur.gpu, 2), 'lab', 'start');
    tx.style.fill = col;
  }
  function updateLab() {
    var cur = labCalc(LAB.r, LAB.mu, LAB.life, LAB.u);
    var set = function (id, html) { var n = el(id); if (n) n.innerHTML = html; };
    set('lo-rev', '$' + fmt(cur.reqRev / 1000, 2) + 'T');
    set('lo-gpu', '$' + fmt(cur.gpu, 2));
    set('lo-w', fmt(cur.w * 100, 2) + '%');
    var gapEl = el('lo-gap');
    if (gapEl) {
      gapEl.innerHTML = (cur.gap >= 0 ? '+' : '') + fmt(cur.gap * 100, 1) + '%';
      gapEl.className = 'lo-value ' + (cur.gap >= 0 ? 'neg' : 'pos');
    }
    set('lo-gap-sub', cur.gap >= 0 ? '▲ ' + bi('above market', '高于市价') : '● ' + bi('below market', '低于市价'));
    set('lo-rev-sub', fmt(cur.gdpPct, 1) + '% ' + t('lab_of_gdp'));
    set('lo-gpu-sub', 'u=' + LAB.u + '%');
    set('lab-formula-line', 'req_rev = 8,762.2 × φ(' + LAB.r + '%) × w / μ = $' + fmt(cur.reqRev, 0) + 'B ; φ(' + LAB.r + '%) = ' + fmt(cur.phi, 5) + (LAB.r === 10 ? ' (paper: 1.04527)' : ' (eq.(3))') + ' ; w = 0.68·a(' + LAB.r + '%,' + LAB.life + ') + 0.32·a(' + LAB.r + '%,20) = ' + fmt(cur.w * 100, 2) + '%');
    drawDyn();
  }

  reg(function renderSens() {
    var vw = V.revenue_sensitivity;
    var body = mount('viz-revenue_sensitivity');
    if (!body) return;
    dynG = null;
    var s = svgEl('svg', { viewBox: '0 0 700 400', width: '100%' }, null);
    body.appendChild(s);
    /* Panel A 3×3（y 40–196） */
    sText(s, 16, 18, 'A · ' + bi('sensitivity grid ($B)', '敏感性格（$B）'), 'lab');
    var margins = [33, 50, 67];
    var returns = [15, 10, 5];
    var gx0 = 120, gy0 = 40, cw = 130, ch = 52;
    sText(s, gx0 + cw / 2, 34, 'μ=33%', 'ax', 'middle');
    sText(s, gx0 + cw * 1.5, 34, 'μ=50%', 'ax', 'middle');
    sText(s, gx0 + cw * 2.5, 34, 'μ=67%', 'ax', 'middle');
    returns.forEach(function (rr, ri) {
      var row = vw.rows.filter(function (x) { return x.required_return_pct === rr; })[0];
      sText(s, gx0 - 10, gy0 + ri * ch + ch / 2 + 4, 'r=' + rr + '%', 'ax', 'end');
      margins.forEach(function (m, mi) {
        var val = m === 33 ? row.margin_33_bn : (m === 50 ? row.margin_50_bn : row.margin_67_bn);
        var center = (rr === 10 && m === 50);
        var depth = Math.min(0.85, 0.22 + (val / 6554) * 0.63);
        var cell = sRect(s, gx0 + mi * cw + 3, gy0 + ri * ch + 3, cw - 6, ch - 6, {
          fill: 'rgba(37,99,235,' + depth.toFixed(2) + ')', 'class': 'hoverable',
          stroke: center ? C.borderS : 'none', 'stroke-width': center ? 2.4 : 0, rx: 3
        });
        attachTip(cell, 'r=' + rr + '% · μ=' + m + '%\n$' + fmtI(val) + 'B\n' +
          fmt(val / 40481 * 100, 1) + '% ' + bi('of 2032 GDP (derived)', '占 2032 年 GDP（衍生）') + '\n' +
          fmt(val / 3549, 2) + '× ' + bi('vs central cell (derived)', '对中央格倍数（衍生）'));
        sText(s, gx0 + mi * cw + cw / 2, gy0 + ri * ch + ch / 2 - 2, '$' + fmtI(val), 'lab', 'middle').style.fill = depth > 0.55 ? '#fff' : C.ink;
        sText(s, gx0 + mi * cw + cw / 2, gy0 + ri * ch + ch / 2 + 13, fmt(val / 40481 * 100, 1) + '% GDP', 'lab-sm', 'middle').style.fill = depth > 0.55 ? '#dbeafe' : '#64748b';
        if (center) sText(s, gx0 + mi * cw + cw / 2, gy0 + ri * ch + 12, bi('central', '中央格'), 'lab-sm', 'middle').style.fill = '#fff';
      });
    });
    svgPilcrow(s, 540, 18, 'revenue_sensitivity', 0);
    /* Panel B 市价对峙（静态四条 + 动态当前情景条）——整体置于 Panel A（y≤196）之下 */
    sText(s, 16, 224, 'B · ' + bi('vs market: $/GPU-hr against Ornn $6.07', '对市价：$/GPU 时对 Ornn $6.07'), 'lab');
    var bars = [
      { v: 5.1, lab: bi('full utilization', '满负荷'), prov: 8 },
      { v: 6.4, lab: '80% ' + bi('billing', '计费'), prov: 11 },
      { v: 7.3, lab: '70% ' + bi('billing', '计费'), prov: 11 },
      { v: 8.2, lab: '3y ' + bi('IT life', 'IT 寿命'), prov: 16 }
    ];
    var byB = 358;
    bars.forEach(function (b, i) {
      var y = 244 + i * 26;
      var above = b.v > 6.07;
      var seg = sRect(s, bx0g, y, xP(b.v) - bx0g, 18, { fill: above ? C.amber : C.accent, 'class': 'hoverable', rx: 3 });
      attachTip(seg, '$' + fmt(b.v, 1) + '/GPU-hr · ' + b.lab + '\n' + (above ? '▲ ' + bi('above spot', '高于现货价') : '● ' + bi('below spot (green)', '低于现货价（绿）')));
      sText(s, bx0g - 8, y + 13, b.lab, 'lab-sm', 'end');
      sText(s, xP(b.v) + 8, y + 13, '$' + fmt(b.v, 1), 'lab', 'start');
      svgPilcrow(s, xP(b.v) + 44, y + 13, 'revenue_sensitivity', b.prov);
    });
    sLine(s, xP(6.07), 234, xP(6.07), byB + 14, { stroke: C.ink, 'stroke-width': 2 });
    sText(s, xP(6.07), 230, '$6.07 Ornn B200 (2026-08-31)', 'lab-sm', 'middle');
    dynG = svgEl('g', { id: 'rs-dyn' }, s);
    /* Panel C 滑杆实验台（HTML，一次构建） */
    var cur = labCalc(LAB.r, LAB.mu, LAB.life, LAB.u);
    var lab = document.createElement('div');
    lab.className = 'slider-panel';
    lab.id = 'slider-lab';
    var lifes = [3, 4, 5, 6, 8, 10, 20];
    function sliderHtml(key, label, min, max, step, val, unit) {
      return '<div class="slider-row"><label><span>' + esc(label) + '</span><span class="val" id="sv-' + key + '">' + val + unit + '</span></label>' +
        '<input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-k="' + key + '" aria-label="' + esc(label) + '"></div>';
    }
    lab.innerHTML =
      '<div class="sp-title">C · ' + esc(t('lab_title')) + '</div>' +
      '<div class="sp-sub">' + esc(t('lab_sub')) + '</div>' +
      '<div class="sliders">' +
      sliderHtml('r', t('lab_r'), 5, 15, 0.5, LAB.r, '%') +
      sliderHtml('mu', t('lab_mu'), 25, 75, 1, LAB.mu, '%') +
      '<div class="slider-row"><label><span>' + esc(t('lab_life')) + '</span></label>' +
      '<div class="seg-btns">' + lifes.map(function (n1) {
        return '<button class="switch' + (LAB.life === n1 ? ' on' : '') + '" data-life="' + n1 + '">' + n1 + t('yr') + '</button>';
      }).join('') + '</div></div>' +
      sliderHtml('u', t('lab_u'), 50, 100, 5, LAB.u, '%') +
      '</div>' +
      '<div class="lab-outputs">' +
      '<div class="lab-out"><div class="lo-label">' + esc(t('lab_reqrev')) + '</div><div class="lo-value" id="lo-rev">$' + fmt(cur.reqRev / 1000, 2) + 'T</div><div class="lo-sub" id="lo-rev-sub">' + fmt(cur.gdpPct, 1) + '% ' + esc(t('lab_of_gdp')) + '</div></div>' +
      '<div class="lab-out"><div class="lo-label">' + esc(t('lab_gpuhr')) + '</div><div class="lo-value" id="lo-gpu">$' + fmt(cur.gpu, 2) + '</div><div class="lo-sub" id="lo-gpu-sub">u=' + LAB.u + '%</div></div>' +
      '<div class="lab-out"><div class="lo-label">' + esc(t('lab_gap')) + '</div><div class="lo-value ' + (cur.gap >= 0 ? 'neg' : 'pos') + '" id="lo-gap">' + (cur.gap >= 0 ? '+' : '') + fmt(cur.gap * 100, 1) + '%</div><div class="lo-sub" id="lo-gap-sub">' + (cur.gap >= 0 ? '▲ ' + bi('above market', '高于市价') : '● ' + bi('below market', '低于市价')) + '</div></div>' +
      '<div class="lab-out"><div class="lo-label">w</div><div class="lo-value" id="lo-w">' + fmt(cur.w * 100, 2) + '%</div><div class="lo-sub">' + bi('weighted capital charge', '加权年资本费用') + '</div></div>' +
      '</div>' +
      '<div style="margin-top:14px"><button class="switch on" id="lab-reset">' + esc(t('lab_reset')) + '</button></div>' +
      '<div class="lab-formula"><span id="lab-formula-line">req_rev = 8,762.2 × φ(' + LAB.r + '%) × w / μ = $' + fmt(cur.reqRev, 0) + 'B ; φ(' + LAB.r + '%) = ' + fmt(cur.phi, 5) + (LAB.r === 10 ? ' (paper: 1.04527)' : ' (eq.(3))') + ' ; w = 0.68·a(' + LAB.r + '%,' + LAB.life + ') + 0.32·a(' + LAB.r + '%,20) = ' + fmt(cur.w * 100, 2) + '%</span><br>' +
      'anchor self-test: <span class="' + (LAB_CHECK.ok ? 'ok' : 'bad') + '">' + (LAB_CHECK.ok ? '✓ ' : '✗ ') + esc(LAB_CHECK.msg) + '</span><br>' +
      bi('OpenAI+Anthropic arithmetic (fixed): $100B (2026) × 1.813^6 ≈ $3.54T — 81.3%/yr through 2032.', 'OpenAI+Anthropic 算术（固定）：$100B（2026）× 1.813^6 ≈ $3.54T——至 2032 年年增 81.3%。') +
      ' <button class="pilcrow" data-prov="revenue_sensitivity:12" type="button">¶</button></div>';
    body.appendChild(lab);
    drawDyn();
    lab.addEventListener('input', function (e) {
      var tg = e.target;
      var k = tg.getAttribute && tg.getAttribute('data-k');
      if (!k) return;
      var v = parseFloat(tg.value);
      if (k === 'r') LAB.r = v;
      else if (k === 'mu') LAB.mu = v;
      else if (k === 'u') LAB.u = v;
      var sv = el('sv-' + k);
      if (sv) sv.textContent = v + '%';
      updateLab();
    }, false);
    lab.addEventListener('click', function (e) {
      var lf = e.target.getAttribute && e.target.getAttribute('data-life');
      if (lf) {
        LAB.life = parseInt(lf, 10);
        var btns = lab.querySelectorAll('[data-life]');
        for (var i = 0; i < btns.length; i++) btns[i].className = 'switch' + (parseInt(btns[i].getAttribute('data-life'), 10) === LAB.life ? ' on' : '');
        updateLab();
        return;
      }
      if (e.target.id === 'lab-reset') {
        LAB.r = 10; LAB.mu = 50; LAB.life = 6; LAB.u = 100;
        var rs = lab.querySelectorAll('input[type="range"]');
        var keys = ['r', 'mu', 'u'];
        var vals = [10, 50, 100];
        for (var j = 0; j < rs.length; j++) {
          rs[j].value = vals[keys.indexOf(rs[j].getAttribute('data-k'))];
        }
        var svs = { r: '10%', mu: '50%', u: '100%' };
        for (var kk in svs) { var sv2 = el('sv-' + kk); if (sv2) sv2.textContent = svs[kk]; }
        var bl = lab.querySelectorAll('[data-life]');
        for (var j2 = 0; j2 < bl.length; j2++) bl[j2].className = 'switch' + (parseInt(bl[j2].getAttribute('data-life'), 10) === 6 ? ' on' : '');
        updateLab();
      }
    });
  });
})();

/* ============================================================
   8. 『我们的探索』8 张衍生图（全部站点自研，非论文观点）
   ============================================================ */
(function () {
  var KIND_LABEL = {
    recombination: { en: 'recombination', zh: 'recombination · 视图重组' },
    extension: { en: 'extension', zh: 'extension · 口径延伸' }
  };
  reg(function renderInsightsRoot() {
    var root = el('insights-root');
    if (!root) return;
    root.innerHTML = '';
    INSIGHTS.selected.forEach(function (it) {
      var card = document.createElement('article');
      card.className = 'insight-card';
      card.id = 'ins-' + it.id;
      card.innerHTML =
        '<h3><span class="en">' + esc(it.title.en) + '</span><span class="zh">' + esc(it.title.zh) + '</span></h3>' +
        '<div class="insight-meta">#' + esc(it.id) + ' · <span class="badge-kind">' + esc(L(KIND_LABEL[it.kind]) || it.kind) + '</span><span class="badge-derived">' + esc(bi('derived', '衍生')) + '</span></div>' +
        '<div class="insight-claim"><span class="en">' + esc(it.claim.en) + '</span><span class="zh">' + esc(it.claim.zh) + '</span></div>' +
        '<figure class="viz" id="iviz-' + it.id + '"><div class="viz-body"></div></figure>' +
        '<details class="insight-math"><summary>' + esc(bi('Recomputation & provenance (python3 verified 2026-10-12)', '复算式与来源（python3 已复算 2026-10-12）')) + '</summary>' +
        '<div class="math-body">' + esc(it.evidence) + '\n\n' + it.provenance.map(function (p) { return esc(p); }).join('\n') + '</div></details>';
      root.appendChild(card);
    });
    renderSustain1(); renderMacro1(); renderSustain2();
    renderRisk1(); renderMacro3(); renderRisk2(); renderMacro5(); renderRisk3();
  });

  function figBody(id) { var f = el('iviz-' + id); return f ? f.querySelector('.viz-body') : null; }

  /* sustain-1：双柱+比率线（单年/三年切换）+ 对数对比条 */
  var s1 = { cum: false };
  function renderSustain1() {
    var b = figBody('sustain-1');
    if (!b) return;
    b.innerHTML = '';
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML = '<button class="switch' + (s1.cum ? '' : ' on') + '" data-a="yr">' + esc(t('single_year')) + '</button>' +
      '<button class="switch' + (s1.cum ? ' on' : '') + '" data-a="cum">' + esc(t('cum3')) + '</button>';
    b.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a) { s1.cum = a === 'cum'; renderSustain1(); }
    });
    var s = svgEl('svg', { viewBox: '0 0 1000 340', width: '100%' }, null);
    b.appendChild(s);
    var rows = V.hyperscaler_capex.rows;
    var x0 = 60, x1 = 560, y0 = 256, yT = 52;
    var yA = function (v) { return y0 - (y0 - yT) * (v / 1800); };
    var yB = function (v) { return y0 - (y0 - yT) * ((v - 30) / 90); };
    [0, 600, 1200, 1800].forEach(function (tv) { sLine(s, x0, yA(tv), x1, yA(tv), { 'class': 'grid' }); sText(s, x0 - 8, yA(tv) + 3, fmtI(tv), 'ax-tick', 'end'); });
    [30, 60, 90, 120].forEach(function (tv) { sText(s, x1 + 10, yB(tv) + 3, tv + '%', 'ax-tick', 'start'); });
    sText(s, x0 - 44, 16, '$B', 'ax'); sText(s, x1 + 6, 16, 'capex/OCF', 'ax');
    var step = (x1 - x0) / rows.length;
    var cumC = 0, cumO = 0;
    var pts = [];
    rows.forEach(function (r, i) {
      var cx = x0 + i * step + step / 2;
      var cv, ov, isCum;
      if (s1.cum && r.year >= 2024) {
        cumC += r.capex_bn; cumO += r.ocf_bn;
        cv = cumC; ov = cumO; isCum = true;
        pts.push({ x: cx, y: yB(Math.min(120, cv / ov * 100)), v: cv / ov * 100, yr: r.year });
      } else {
        cv = r.capex_bn; ov = r.ocf_bn; isCum = false;
        if (!s1.cum) pts.push({ x: cx, y: yB(Math.min(120, cv / ov * 100)), v: cv / ov * 100, yr: r.year });
      }
      if (!s1.cum || r.year >= 2024) {
        var bw = 13;
        var bc = sRect(s, cx - bw - 1, yA(cv), bw, y0 - yA(cv), { fill: C.accent, 'class': 'hoverable' });
        var bo = sRect(s, cx + 1, yA(ov), bw, y0 - yA(ov), { fill: C.muted, 'class': 'hoverable' });
        attachTip(bc, r.year + (isCum ? ' (2024–' + r.year + ' Σ) ' : ' ') + 'capex: $' + fmt(cv, 1) + 'B');
        attachTip(bo, r.year + (isCum ? ' (2024–' + r.year + ' Σ) ' : ' ') + 'OCF: $' + fmt(ov, 1) + 'B');
      }
      sText(s, cx, y0 + 14, String(r.year).slice(2), 'ax-tick', 'middle');
    });
    if (pts.length) {
      svgEl('polyline', { points: pts.map(function (p) { return p.x + ',' + p.y; }).join(' '), fill: 'none', stroke: C.ink, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, s);
      pts.forEach(function (p) {
        svgEl('circle', { cx: p.x, cy: p.y, r: 3, fill: C.ink, 'class': 'hoverable' }, s);
        sText(s, p.x, p.y - 8, fmt(p.v, 0) + '%', 'lab-sm', 'middle');
      });
    }
    sText(s, x0, 36, s1.cum
      ? bi('2024–26 cumulative: capex $1,456.7B = 81.4% of OCF $1,788.8B (derived) — even cumulatively, no crossover', '2024–26 累计：资本开支 $1,456.7B = 经营现金流 $1,788.8B 的 81.4%（衍生）——累计口径也未交叉')
      : bi('single-year view: 2026 = first crossover (113.2%, derived)', '单年视角：2026 = 首次交叉（113.2%，衍生）'), 'lab-sm');
    /* 右图：对数对比条 */
    sText(s, 620, 36, bi('The tip vs the iceberg ($B, log scale)', '冰山一角与整座冰山（$B，对数标尺）'), 'lab');
    var comps = [
      { v: 93.4, lab: bi('visible gap 2026', '表内缺口 2026'), mult: '1×', color: C.accent },
      { v: 725, lab: bi('MS need per year', '摩根士丹利年均需求'), mult: '7.8×', color: C.muted },
      { v: 2400, lab: bi('off-balance stock', '表外存量'), mult: '25.7×', color: C.amber }
    ];
    var rx0 = 770, rx1 = 900;
    var xL = function (v) { return rx0 + (rx1 - rx0) * (Math.log10(v / 50) / Math.log10(2400 / 50)); };
    comps.forEach(function (c, i) {
      var y = 62 + i * 54;
      var seg = sRect(s, rx0, y, xL(c.v) - rx0, 30, { fill: c.color, 'class': 'hoverable', rx: 3 });
      attachTip(seg, '$' + fmtI(c.v) + 'B — ' + c.lab + '\n' + c.mult + ' ' + bi('the visible gap (derived)', '表内缺口（衍生）'));
      sText(s, rx0 - 8, y + 20, c.lab, 'lab-sm', 'end');
      sText(s, xL(c.v) + 8, y + 20, '$' + fmtI(c.v) + 'B · ' + c.mult, 'lab', 'start');
    });
    sText(s, 620, 236, bi('hover the bars for multiples: 25.7× / 7.8× / 3.88× (external >$362.5B/yr, derived)', '悬停条形看倍数：25.7× / 7.8× / 3.88×（外部 >$362.5B/年，衍生）'), 'lab-sm');
    sText(s, 620, 254, bi('log scale because $93B and $2.4T differ 26-fold — a linear bar would erase the tip.', '用对数标尺：$93B 与 $2.4T 相差 26 倍——线性条会抹掉一角。'), 'lab-sm');
    sText(s, 620, 272, bi('3-year view derived from hyperscaler_capex + offbalance_leverage + financing_mix.', '三年视角由数据视图 hyperscaler_capex + offbalance_leverage + financing_mix 衍生。'), 'lab-sm');
  }

  /* macro-1：哑铃 + 双参考线 + 铁路地板 */
  var m1 = { mode: 'avg' };
  function renderMacro1() {
    var b = figBody('macro-1');
    if (!b) return;
    b.innerHTML = '';
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML = '<span class="ctl-label">' + esc(t('x_scale')) + ':</span>' +
      '<button class="switch' + (m1.mode === 'avg' ? ' on' : '') + '" data-a="avg">● ' + esc(t('avg_scale')) + '</button>' +
      '<button class="switch' + (m1.mode === 'peak' ? ' on' : '') + '" data-a="peak">○ ' + esc(t('peak_scale')) + '</button>';
    b.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a) { m1.mode = a; renderMacro1(); }
    });
    var s = svgEl('svg', { viewBox: '0 0 1000 330', width: '100%' }, null);
    b.appendChild(s);
    var rows = V.historical_booms.rows.slice().sort(function (a, b2) { return b2.size_pct_gdp - a.size_pct_gdp; });
    var x0 = 170, x1 = 900, yT = 34, rh = 40;
    var xmax = m1.mode === 'avg' ? 5.2 : 5.6;
    var xS = function (v) { return x0 + (x1 - x0) * (v / xmax); };
    [0, 1, 2, 3, 4, 5].forEach(function (tv) {
      sLine(s, xS(tv), yT - 6, xS(tv), yT + rows.length * rh, { 'class': 'grid' });
      sText(s, xS(tv), yT + rows.length * rh + 14, tv + '%', 'ax-tick', 'middle');
    });
    [[3.22, 'AI avg 3.22%'], [4.96, 'AI peak 4.96% (2028)']].forEach(function (rf) {
      sLine(s, xS(rf[0]), yT - 6, xS(rf[0]), yT + rows.length * rh, { stroke: C.accent, 'stroke-dasharray': '4 3', 'stroke-width': 1.2 });
      sText(s, xS(rf[0]) + 4, yT + rows.length * rh + 27, rf[1], 'lab-sm', 'start').style.fill = C.accent;
    });
    sRect(s, xS(4), yT - 6, xS(4.6) - xS(4), rows.length * rh + 6, { fill: 'rgba(180,83,9,0.10)' });
    sText(s, xS(4.3), yT + 8, bi('railroads ">4%" floor', '铁路「>4%」地板'), 'lab-sm', 'middle').style.fill = C.amber;
    rows.forEach(function (r, i) {
      var cy = yT + i * rh + rh / 2;
      var isAI = r.episode === 'AI buildout';
      var g = svgEl('g', { 'class': 'hit' }, s);
      var usePeak = m1.mode === 'peak';
      sText(s, x0 - 12, cy + 3, r.episode + ' · ' + r.period, 'lab-sm', 'end');
      if (r.peak_pct_gdp !== null) {
        sLine(g, xS(r.size_pct_gdp), cy, xS(r.peak_pct_gdp), cy, { stroke: isAI ? C.accent : C.muted, 'stroke-width': 1.3 });
        svgEl('circle', { cx: xS(r.peak_pct_gdp), cy: cy, r: 5.5, fill: '#fff', stroke: isAI ? C.accent : C.muted, 'stroke-width': 2 }, g);
      } else if (usePeak) {
        sLine(g, xS(r.size_pct_gdp), cy, xS(4.05), cy, { stroke: C.muted, 'stroke-dasharray': '3 3' });
        svgEl('path', { d: 'M' + xS(4.05) + ' ' + cy + ' l-7 -4 v8 z', fill: C.muted }, g);
        sText(g, xS(4.05) + 5, cy + 3, '>4%', 'lab-sm', 'start');
      }
      svgEl('circle', { cx: xS(r.size_pct_gdp), cy: cy, r: isAI ? 6 : 5, fill: isAI ? C.accent : C.muted }, g);
      var mult = r.peak_pct_gdp ? bi('AI avg / this peak = ', 'AI 平均 / 该峰值 = ') + fmt(3.22 / r.peak_pct_gdp, 2) + '× (' + t('derived') + ')' : bi('only ">4%" recorded — AI avg does not clear it', '仅记「>4%」——AI 平均未越过它');
      attachTip(g, r.episode + ' ' + r.period + '\navg ' + fmt(r.size_pct_gdp, 2) + '% · peak ' + (r.peak_pct_gdp === null ? '>4%' : fmt(r.peak_pct_gdp, 2) + '%') + '\n' + mult);
    });
    sText(s, x0, 312, bi('Derived claim: AI\'s average beats the best recorded year of 4 of 5 predecessors (3.6×/3.4×/2.4×/2.3×); trough years (2.2%, 2031–32) still run 1.58× telecom\'s best.', '衍生论断：AI 的平均年胜过五轮历史热潮中四轮的最好年份（3.6×/3.4×/2.4×/2.3×）；最差年份（2031–32 的 2.2%）也是电信最佳年份的 1.58 倍。'), 'lab-sm');
  }

  /* sustain-2：利用率曲线 vs 租金（滑杆不重建 DOM） */
  var s2 = { rent: 6.07, mu: 50 };
  var s2g = null;
  function s2Geom() { return { x0: 70, x1: 940, y0: 218, yT: 30 }; }
  function s2Draw() {
    if (!s2g) return;
    while (s2g.firstChild) s2g.removeChild(s2g.firstChild);
    var g = s2Geom();
    var base = 5.110 * (50 / s2.mu);
    var xU = function (u) { return g.x0 + (g.x1 - g.x0) * ((u - 50) / 50); };
    var yP = function (p) { return g.y0 - (g.y0 - g.yT) * (Math.min(p, 12) / 12); };
    var uStar = base / s2.rent * 100;
    var pts = [];
    for (var u = 50; u <= 100.01; u += 1) pts.push([u, base / (u / 100)]);
    if (uStar > 50 && uStar <= 100) {
      var under = pts.filter(function (p) { return p[0] <= uStar + 0.5; });
      if (under.length > 1) {
        var area = under.map(function (p) { return xU(p[0]) + ',' + yP(p[1]); }).join(' ');
        area += ' ' + xU(under[under.length - 1][0]) + ',' + yP(s2.rent) + ' ' + xU(under[0][0]) + ',' + yP(s2.rent);
        svgEl('polygon', { points: area, fill: 'rgba(180,83,9,0.15)' }, s2g);
        sText(s2g, xU((50 + uStar) / 2), yP(s2.rent) - 10, t('below_market'), 'lab-sm', 'middle').style.fill = C.amber;
      }
    }
    svgEl('polyline', { points: pts.map(function (p) { return xU(p[0]) + ',' + yP(p[1]); }).join(' '), fill: 'none', stroke: C.accent, 'stroke-width': 2.6 }, s2g);
    sLine(s2g, g.x0, yP(s2.rent), g.x1, yP(s2.rent), { stroke: C.ink, 'stroke-width': 2 });
    sText(s2g, g.x1, yP(s2.rent) - 6, '$' + fmt(s2.rent, 2) + ' ' + bi('rent', '租金'), 'lab', 'end');
    [[80, 6.4], [70, 7.3]].forEach(function (pt) {
      var dot = svgEl('circle', { cx: xU(pt[0]), cy: yP(5.110 / (pt[0] / 100)), r: 4.5, fill: '#fff', stroke: C.ink, 'stroke-width': 2, 'class': 'hoverable' }, s2g);
      attachTip(dot, 'paper (μ=50): ' + pt[0] + '% → $' + pt[1] + '/billed GPU-hr\n5.11/' + pt[0] + ' = ' + fmt(5.110 / (pt[0] / 100), 2) + ' ≈ $' + pt[1]);
      sText(s2g, xU(pt[0]) + 8, yP(5.110 / (pt[0] / 100)) - 8, pt[0] + '%→$' + pt[1], 'lab-sm', 'start');
    });
    if (uStar >= 50 && uStar <= 100) {
      sLine(s2g, xU(uStar), g.yT, xU(uStar), g.y0, { stroke: C.green, 'stroke-dasharray': '4 3' });
      sText(s2g, xU(uStar) + 5, g.yT + 12, t('breakeven_u') + ' ≈ ' + fmt(uStar, 1) + '%', 'lab-sm', 'start').style.fill = C.green;
    } else if (uStar > 100) {
      sText(s2g, g.x1 - 8, g.yT + 12, bi('no breakeven ≤100% — market cannot cover at any utilization', '≤100% 内无盈亏平衡——任何利用率下市价都不够'), 'lab-sm', 'end').style.fill = C.amber;
    }
    var hd = el('s2-head');
    if (hd) hd.textContent = bi('required billed price = ', '所需计费价 = ') + '$' + fmt(base, 2) + '/u  (μ=' + s2.mu + '%)';
    var rv = el('s2-rent-val'); if (rv) rv.textContent = '$' + fmt(s2.rent, 2);
    var mv = el('s2-mu-val'); if (mv) mv.textContent = s2.mu + '%';
  }
  function renderSustain2() {
    var b = figBody('sustain-2');
    if (!b) return;
    b.innerHTML = '';
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML =
      '<span class="ctl-label">' + esc(t('rent_price')) + ':</span>' +
      '<input type="range" min="4" max="8" step="0.05" value="' + s2.rent + '" data-k="rent" aria-label="' + esc(t('rent_price')) + '" style="width:120px;accent-color:var(--accent);vertical-align:middle"> <b style="font-family:var(--mono);font-size:12px;color:var(--accent)" id="s2-rent-val">$' + fmt(s2.rent, 2) + '</b>' +
      '<span class="ctl-label" style="margin-left:14px">' + esc(t('lab_mu')) + ':</span>' +
      '<input type="range" min="33" max="67" step="1" value="' + s2.mu + '" data-k="mu" aria-label="' + esc(t('lab_mu')) + '" style="width:110px;accent-color:var(--accent);vertical-align:middle"> <b style="font-family:var(--mono);font-size:12px;color:var(--accent)" id="s2-mu-val">' + s2.mu + '%</b>';
    b.appendChild(ctl);
    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute && e.target.getAttribute('data-k');
      if (k === 'rent') s2.rent = parseFloat(e.target.value);
      if (k === 'mu') s2.mu = parseFloat(e.target.value);
      s2Draw();
    });
    var s = svgEl('svg', { viewBox: '0 0 1000 300', width: '100%' }, null);
    b.appendChild(s);
    var g = s2Geom();
    var xU = function (u) { return g.x0 + (g.x1 - g.x0) * ((u - 50) / 50); };
    var yP = function (p) { return g.y0 - (g.y0 - g.yT) * (Math.min(p, 12) / 12); };
    [0, 3, 6, 9, 12].forEach(function (tv) { sLine(s, g.x0, yP(tv), g.x1, yP(tv), { 'class': 'grid' }); sText(s, g.x0 - 8, yP(tv) + 3, '$' + tv, 'ax-tick', 'end'); });
    [50, 60, 70, 80, 90, 100].forEach(function (u) { sText(s, xU(u), g.y0 + 16, u + '%', 'ax-tick', 'middle'); });
    sText(s, g.x0 - 56, 14, '$/GPU-hr', 'ax');
    sText(s, (g.x0 + g.x1) / 2, 290, bi('billed utilization', '计费利用率'), 'ax', 'middle');
    sText(s, g.x0, 14, '', 'lab-sm', 'start').setAttribute('id', 's2-head');
    s2g = svgEl('g', { id: 's2-dyn' }, s);
    s2Draw();
    var note = document.createElement('p');
    note.className = 'viz-note';
    note.innerHTML = '<span class="en">Derived: at $6.07 the cushion dies at u≈84.2%; holding u=100%, the margin floor is μ*=1,774.3/4,217=42.1%; Table 7’s 33%-margin column ($7.74/GPU-hr) is above spot at any utilization.</span>' +
      '<span class="zh">衍生：$6.07 下缓冲在 u≈84.2% 耗尽；锁定 u=100% 时利润率下限 μ*=1,774.3/4,217=42.1%；表 7 的 33% 利润率列（$7.74/GPU 时）在任何利用率下都高于现货价。</span>';
    b.appendChild(note);
  }

  /* risk-1：三子视图切换 */
  var r1 = { view: 'de' };
  function renderRisk1() {
    var b = figBody('risk-1');
    if (!b) return;
    b.innerHTML = '';
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML = '<button class="switch' + (r1.view === 'de' ? ' on' : '') + '" data-a="de">' + esc(t('sub_de')) + '</button>' +
      '<button class="switch' + (r1.view === 'buf' ? ' on' : '') + '" data-a="buf">' + esc(t('sub_buf')) + '</button>' +
      '<button class="switch' + (r1.view === 'tl' ? ' on' : '') + '" data-a="tl">' + esc(t('sub_tl')) + '</button>';
    b.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a) { r1.view = a; renderRisk1(); }
    });
    var s = svgEl('svg', { viewBox: '0 0 1000 310', width: '100%' }, null);
    b.appendChild(s);
    if (r1.view === 'de') {
      var x0 = 420, y0 = 250, h = 190;
      var lg2 = function (v) { return Math.log10(v); };
      var l0 = lg2(0.2), l1 = lg2(12);
      var xL = function (v) { return x0 + 480 * ((lg2(v) - l0) / (l1 - l0)); };
      [0.3, 1, 3, 10].forEach(function (tv) {
        sLine(s, xL(tv), y0 - h - 8, xL(tv), y0, { 'class': 'grid' });
        sText(s, xL(tv), y0 + 16, fmt(tv, tv < 1 ? 1 : 0) + '×', 'ax-tick', 'middle');
      });
      sText(s, 40, y0 - h - 22, bi('debt/equity, log scale (derived)', '债务/股本，对数标尺（衍生）'), 'lab');
      var bars = [
        { v: 8.64, lab: bi('Hyperion SPV (Beignet)', 'Hyperion SPV（Beignet）'), sub: 'D/E = 27/3.125 · LTV 90% · DSCR 1.12×', color: C.accent },
        { v: 0.33, lab: bi('Meta parent (book)', 'Meta 母公司（账面）'), sub: '25% book leverage → D/E 0.25/0.75', color: C.muted }
      ];
      bars.forEach(function (bb, i) {
        var y = y0 - 66 - i * 96;
        var seg = sRect(s, xL(0.2), y, xL(bb.v) - xL(0.2), 42, { fill: bb.color, 'class': 'hoverable', rx: 3 });
        attachTip(seg, bb.lab + '\nD/E ' + fmt(bb.v, 2) + '×\n' + bb.sub);
        sText(s, xL(0.2) - 10, y + 26, bb.lab, 'lab', 'end');
        sText(s, xL(bb.v) + 8, y + 26, fmt(bb.v, 2) + '×', 'lab', 'start');
      });
      sLine(s, xL(0.33), y0 - 110, xL(8.64), y0 - 110, { stroke: C.amber, 'stroke-dasharray': '4 3', 'stroke-width': 1.6 });
      sText(s, (xL(0.33) + xL(8.64)) / 2, y0 - 118, bi('S&P bridges 25.9× of leverage with ', '标普用') + t('notch') + bi(' (A+ vs Meta)', '（A+ 对 Meta）就桥接了 25.9× 杠杆'), 'lab-sm', 'middle').style.fill = C.amber;
      sText(s, 40, y0 + 44, bi('Derived: implied equity $2.5B/0.8 = $3.125B; D/E 27/3.125 = 8.64×; parent 0.25/0.75 = 0.33×; differential 25.9×.', '衍生：隐含股权 $2.5B/0.8 = $3.125B；D/E 27/3.125 = 8.64×；母公司 0.25/0.75 = 0.33×；杠杆差 25.9×。'), 'lab-sm');
    } else if (r1.view === 'buf') {
      sText(s, 40, 34, bi('lease cash-flow buffer before DSCR breach (derived)', '击穿偿债线前的租约现金流缓冲（衍生）'), 'lab');
      var gx = 90, gw = 820, gy = 210, gh = 36;
      sRect(s, gx, gy, gw, gh, { fill: '#eef1f6', rx: 6 });
      sRect(s, gx, gy, gw * (10.7 / 15), gh, { fill: 'rgba(180,83,9,0.18)', rx: 6 });
      var trig = sRect(s, gx + gw * (10.7 / 15) - 2, gy - 10, 4, gh + 20, { fill: C.amber, 'class': 'hoverable' });
      attachTip(trig, bi('trigger: −10.7% lease cash flow exhausts 1.12× DSCR (1 − 1/1.12)', '触发线：租约现金流 −10.7% 即击穿 1.12× DSCR（1 − 1/1.12）'));
      sText(s, gx + gw * (10.7 / 15) - 6, gy - 16, '−10.7%', 'lab', 'end').style.fill = C.amber;
      sText(s, gx + gw - 6, gy - 16, '0%', 'lab-sm', 'end');
      sText(s, gx + gw / 2, gy + gh + 28, bi('A 10.7% decline in lease cash flow takes DSCR to 1.0× — the A+ rests on a 10.4% JV equity cushion (3.125/30.125).', '租约现金流下降 10.7% 即把 DSCR 拉到 1.0×——A+ 背后是仅 10.4% 的合资股本缓冲（3.125/30.125）。'), 'lab-sm', 'middle');
    } else {
      sText(s, 40, 34, bi('~24y bond vs 4y effective leases (derived)', '约 24 年债券对 4 年生效租约（衍生）'), 'lab');
      var tx0 = 80, tx1 = 940, ty = 130;
      var tS = function (yr) { return tx0 + (tx1 - tx0) * ((yr - 2025) / 24); };
      var bond = sRect(s, tx0, ty - 24, tx1 - tx0, 30, { fill: 'rgba(37,99,235,0.12)', stroke: C.borderS, rx: 4, 'class': 'hoverable' });
      attachTip(bond, bi('$27B bond Oct 2025 → 2049 (≈24y); at any point only 4 years of lease are effective = 16.7% of its life.', '$27B 债券 2025-10 → 2049（约 24 年）；任一时点只有 4 年生效租约支撑 = 存续期的 16.7%。'));
      sText(s, tx0 + 8, ty - 6, bi('bond ≈24y', '债券 ≈24 年'), 'lab-sm', 'start');
      for (var k = 0; k < 5; k++) {
        var a = 2029 + k * 4, b2 = a + 4;
        var seg = sRect(s, tS(a), ty + 14, tS(b2) - tS(a) - 3, 22, { fill: k % 2 ? C.muted : C.accent, rx: 3, 'class': 'hoverable' });
        attachTip(seg, bi('lease', '租约') + ' ' + (k + 1) + '/5 · ' + a + '–' + b2 + ' (4y)');
        var gate = svgEl('path', { d: 'M' + (tS(b2) - 1.5) + ' ' + (ty - 34) + ' l5 9 h-10 z', fill: C.ink, 'class': 'hoverable' }, s);
        attachTip(gate, '▲ ' + b2 + ' ' + bi('renewal gate — Meta termination option + asset sale + RVG', '续约闸门——Meta 终止权 + 资产出售 + 残值担保'));
      }
      [2025, 2029, 2033, 2037, 2041, 2045, 2049].forEach(function (yr) {
        sText(s, tS(yr), ty + 64, String(yr), 'ax-tick', 'middle');
      });
      sText(s, tx0, 246, bi('5 × 4-year leases cover 20 of ~24 years; termination flags at every gate from 2029.', '五段 4 年租约覆盖约 24 年中的 20 年；2029 年起每个闸门都有终止权旗标。'), 'lab-sm');
    }
  }

  /* macro-3：瀑布 + 无日期滑杆（滑杆不重建 DOM） */
  var m3 = { u: 17.2 };
  function m3Update() {
    var gw2 = 13.8 + 120.6 + 313.9 * (m3.u / 100);
    var gdpPct = 3.22 * gw2 / 188.3;
    var flip = gdpPct <= 2.24 + 0.001;
    var set = function (id, html, style) {
      var n = el(id);
      if (n) { n.innerHTML = html; if (style) n.setAttribute('style', style); }
    };
    set('m3-gdp', fmt(gdpPct, 2) + '%', 'color:' + (flip ? C.amber : C.accent));
    set('m3-flip', flip
      ? '<span style="color:var(--amber);font-weight:700">▲ ' + esc(t('rank_flip')) + '</span>'
      : esc(t('margin_above')) + ': +' + fmt(gdpPct - 2.24, 2) + 'pp');
    set('m3-gw', fmt(gw2, 1) + ' GW');
    set('m3-u-val', fmt(m3.u, 1) + '%');
  }
  function renderMacro3() {
    var b = figBody('macro-3');
    if (!b) return;
    b.innerHTML = '';
    var s = svgEl('svg', { viewBox: '0 0 1000 180', width: '100%' }, null);
    b.appendChild(s);
    sText(s, 16, 20, bi('516.7 GW split, by evidence bucket', '按证据桶拆分的 516.7 GW'), 'lab');
    var parts = [
      { v: 13.8, lab: bi('2025 full', '2025 全额'), color: C.accent },
      { v: 120.6, lab: bi('dated by 2032', '有日期·2032 前'), color: C.accent },
      { v: 54.0, lab: bi('no-date by 2032', '无日期·2032 前'), color: '#5a7fd8' },
      { v: 114.9, lab: bi('after 2032', '2032 后'), color: C.muted },
      { v: 213.5, lab: bi('never', '永不完工'), color: '#e5e7eb' }
    ];
    var wx0 = 190, wx1 = 660;
    var cur = wx0;
    parts.forEach(function (p) {
      var w = (wx1 - wx0) * (p.v / 516.7);
      var seg = sRect(s, cur, 40, w, 40, { fill: p.color, stroke: '#fff', 'stroke-width': 0.8, 'class': 'hoverable' });
      attachTip(seg, p.lab + ': ' + fmt(p.v, 1) + ' GW');
      if (w > 36) sText(s, cur + w / 2, 64, fmt(p.v, 1), 'lab-sm', 'middle').style.fill = p.color === '#e5e7eb' ? C.ink : '#fff';
      cur += w;
    });
    sText(s, wx0 - 8, 50, bi('dated 63.8%', '有日期 63.8%'), 'lab-sm', 'end');
    sText(s, wx0 - 8, 66, bi('no-date 17.2% (3.7× harsher)', '无日期 17.2%（严苛 3.7 倍）'), 'lab-sm', 'end');
    sText(s, 16, 112, bi('realization by 2032: dated 120.6/189.0 = 63.8% vs no-date 54.0/313.9 = 17.2% — and the no-date bucket is 56.3% of the whole 557.1 GW database (all derived).', '2032 年前实现率：有日期 120.6/189.0 = 63.8% 对无日期 54.0/313.9 = 17.2%——且无日期档占整个 557.1 GW 数据库的 56.3%（均衍生）。'), 'lab-sm');
    var panel = document.createElement('div');
    panel.className = 'slider-panel';
    panel.style.marginTop = '8px';
    panel.innerHTML =
      '<div class="slider-row"><label><span>' + esc(t('realization_slider')) + '</span><span class="val" id="m3-u-val">' + fmt(m3.u, 1) + '%</span></label>' +
      '<input type="range" min="0" max="64" step="0.5" value="' + m3.u + '" data-k="u3" aria-label="' + esc(t('realization_slider')) + '"></div>' +
      '<div class="lab-outputs" style="margin-top:12px">' +
      '<div class="lab-out"><div class="lo-label">' + esc(t('implied_gdp')) + '</div><div class="lo-value" id="m3-gdp"></div><div class="lo-sub">' + bi('scaled from 3.22% ∝ GW realized (derived)', '由 3.22% 按实现 GW 等比重定标（衍生）') + '</div></div>' +
      '<div class="lab-out"><div class="lo-label">' + esc(t('rail_threshold')) + '</div><div class="lo-value">2.24%</div><div class="lo-sub" id="m3-flip"></div></div>' +
      '<div class="lab-out"><div class="lo-label">GW by 2032</div><div class="lo-value" id="m3-gw"></div><div class="lo-sub">13.8 + 120.6 + 313.9×u</div></div>' +
      '</div>' +
      '<div class="lab-formula">range: u=0 → 134.4 GW → 2.30% ; u=63.8% → 334.7 GW → 5.72% (' + t('derived') + ')<br>' +
      bi('Even at u=0 the scenario (2.30%) stays 0.06pp above railroads — the flip sits one step outside this band, which is exactly how fragile the ranking is.', '即便 u=0，情景（2.30%）仍高于铁路 0.06 个百分点——翻转就在这条带外一步之遥，这正是排名的脆弱之处。') + '</div>';
    b.appendChild(panel);
    m3Update();
    panel.addEventListener('input', function (e) {
      if (e.target.getAttribute && e.target.getAttribute('data-k') === 'u3') {
        m3.u = parseFloat(e.target.value);
        m3Update();
      }
    });
  }

  /* risk-2：$3T 堆叠 + 两个开关 */
  var r2 = { pv: false, cap: false };
  function renderRisk2() {
    var b = figBody('risk-2');
    if (!b) return;
    b.innerHTML = '';
    var ctl = document.createElement('div');
    ctl.className = 'viz-controls';
    ctl.innerHTML =
      '<button class="switch' + (r2.pv ? ' on' : '') + '" data-a="pv">' + esc(t('pv_lease')) + '</button>' +
      '<button class="switch' + (r2.cap ? ' on' : '') + '" data-a="cap">' + esc(t('cap_purchase')) + '</button>';
    b.appendChild(ctl);
    ctl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a) { r2[a] = !r2[a]; renderRisk2(); }
    });
    var s = svgEl('svg', { viewBox: '0 0 1000 250', width: '100%' }, null);
    b.appendChild(s);
    hatchDef(s, 'h-r2', '#9ca3af');
    var lease = r2.pv ? 904 * 0.75 : 904;
    var segs = [
      { v: 604, lab: bi('on balance 604', '表内 604'), color: C.accent },
      { v: lease, lab: bi('future leases ' + (r2.pv ? '678 (×0.75)' : '904'), '未来租赁 ' + (r2.pv ? '678（×0.75）' : '904')), color: C.muted },
      { v: 1520, lab: bi('purchases 1,520', '采购 1,520'), color: '#e5e7eb', hatch: true }
    ];
    var tot = 604 + lease + 1520 + (r2.cap ? 1140 : 0);
    var x0 = 200, x1 = 900, y = 60, h = 46;
    sText(s, x0, 34, bi('what L2/L4 capture vs what exists ($B)', 'L2/L4 捕捉的对实际存在的（$B）'), 'lab');
    var cur = x0;
    segs.forEach(function (sg) {
      var w = (x1 - x0) * (sg.v / tot);
      var attrs = { 'class': 'hoverable', stroke: C.borderS, 'stroke-width': 0.5 };
      attrs.fill = sg.hatch ? 'url(#h-r2)' : sg.color;
      var seg = sRect(s, cur, y, w, h, attrs);
      attachTip(seg, sg.lab + '\n$' + fmtI(sg.v) + 'B');
      if (w > 40) sText(s, cur + w / 2, y + 28, '$' + fmtI(sg.v), 'lab-sm', 'middle').style.fill = sg.hatch ? C.ink : '#fff';
      cur += w;
    });
    if (r2.cap) {
      var wG = (x1 - x0) * (1140 / tot);
      var ghost = sRect(s, cur, y, wG, h, { fill: 'none', stroke: C.amber, 'stroke-dasharray': '5 4', 'stroke-width': 1.6, 'class': 'hoverable' });
      attachTip(ghost, bi('+ ghost: purchases capitalized at the paper\'s own 0.75 → +$1,140B of debt-equivalents (derived)', '+ 幽灵段：按论文自己的 0.75 将采购承诺资本化 → +$1,140B 债务等价物（衍生）'));
      if (wG > 40) sText(s, cur + wG / 2, y + 28, '+$1,140', 'lab-sm', 'middle').style.fill = C.amber;
    }
    var leaseX0 = x0 + (x1 - x0) * (604 / tot);
    sLine(s, leaseX0, y + h + 8, cur, y + h + 8, { stroke: C.ink, 'stroke-width': 1.2 });
    sText(s, (leaseX0 + cur) / 2, y + h + 22, bi('L2/L4 add only the lease segment — the $1,520B (63.3% of off-balance; 2.52× the whole on-balance stack) enters no ratio', 'L2/L4 只加回租赁段——$1,520B（表外的 63.3%、整个表内盘的 2.52 倍）不进入任何比率'), 'lab-sm', 'middle');
    sText(s, x0, 160, bi('Cross-validation (derived): the equity-denominator pair implies lease obligations = 2.69× debt; the EBITDA pair implies 2.71× — 0.8% apart: internally consistent, structurally incomplete.', '交叉验证（衍生）：权益分母对推出租约 = 债务的 2.69×；EBITDA 分母对推出 2.71×——仅差 0.8%：内部自洽、结构不完整。'), 'lab-sm');
    sText(s, x0, 182, bi('Asymmetric degradation: cash-flow metric ×3.7 (0.7×→2.6×) vs balance-sheet metric ×2.4 (20%→48%) — and both still miss the chips.', '恶化不对称：现金流口径 ×3.7（0.7×→2.6×）对资产负债表口径 ×2.4（20%→48%）——且两者都漏掉芯片。'), 'lab-sm');
    sText(s, x0, 204, bi('Reconciliation: 604/(2,400+604) = 20.1% ≈ “one-fifth”.', '勾稽：604/(2,400+604) = 20.1% ≈「五分之一」。'), 'lab-sm');
  }

  /* macro-5：甘特 + 逐年柱 */
  function renderMacro5() {
    var b = figBody('macro-5');
    if (!b) return;
    b.innerHTML = '';
    var s = svgEl('svg', { viewBox: '0 0 1000 340', width: '100%' }, null);
    b.appendChild(s);
    sText(s, 16, 20, bi('Gantt 1836–2032: bar = period · depth = avg %GDP · height ∝ annual-GDP equivalents (derived)', '甘特 1836–2032：条 = 期间 · 色深 = 年均 %GDP · 高度 ∝ GDP 当量（衍生）'), 'lab');
    var rows = V.historical_booms.rows;
    var yT = 40, yB = 180;
    var tS = function (yr) { return 200 + 380 * ((yr - 1836) / (2032 - 1836)); };
    [1840, 1880, 1920, 1960, 2000, 2032].forEach(function (yr) {
      sLine(s, tS(yr), yT - 10, tS(yr), yB + 6, { 'class': 'grid' });
      sText(s, tS(yr), yB + 20, String(yr), 'ax-tick', 'middle');
    });
    rows.forEach(function (r, i) {
      var yrs = r.period.split('–');
      var a = parseInt(yrs[0], 10), b2 = parseInt(yrs[1], 10);
      var dur = b2 - a;
      var depth = Math.min(0.9, 0.25 + (r.size_pct_gdp / 3.22) * 0.6);
      var hh = Math.max(9, Math.min(22, (r.size_pct_gdp * dur) / 47.0 * 22));
      var yy = yT + i * 24;
      var seg = sRect(s, tS(a), yy, tS(b2) - tS(a), hh, { fill: 'rgba(37,99,235,' + depth.toFixed(2) + ')', 'class': 'hoverable', rx: 2 });
      attachTip(seg, r.episode + ' ' + r.period + ' (' + dur + 'y)\navg ' + fmt(r.size_pct_gdp, 2) + '% · GDP-equivalent ' + fmt(r.size_pct_gdp * dur, 1) + ' ' + t('gdp_equiv'));
      sText(s, tS(a) - 8, yy + hh / 2 + 3, r.episode, 'lab-sm', 'end');
    });
    /* GDP 当量排序条 */
    sText(s, 620, yT + 4, bi('GDP equivalents (avg × years):', 'GDP 当量（年均 × 年数）：'), 'lab-sm');
    var gdps = [['Railroads', 47.0], ['AI buildout', 25.8], ['Highways', 20.3], ['Electrification', 10.5], ['Telecom', 8.8], ['Canals', 4.0]];
    gdps.forEach(function (g2, i) {
      var yy = yT + 20 + i * 17;
      var w = 150 * (g2[1] / 47);
      sRect(s, 810, yy, w, 11, { fill: g2[0] === 'AI buildout' ? C.accent : C.muted, rx: 2 });
      sText(s, 804, yy + 9, fmt(g2[1], 1), 'lab-sm', 'end');
      sText(s, 620, yy + 9, g2[0], 'lab-sm', 'start');
    });
    sText(s, 620, yT + 20 + 6 * 17 + 6, bi('railroads / AI = 47.0/25.8 = 1.83× (derived)', '铁路 / AI = 47.0/25.8 = 1.83×（衍生）'), 'lab-sm');
    /* 右下：表5 逐年柱 */
    var bx0 = 620, bx1 = 980, byb = 310, byt = 236;
    var irows = V.investment_annual.rows;
    var stp = (bx1 - bx0) / irows.length;
    irows.forEach(function (r, i) {
      var cx = bx0 + i * stp + stp / 2;
      var hh2 = (byb - byt) * (r.investment_bn / 1717);
      var is28 = r.year === 2028, is29 = r.year === 2029;
      var bar = sRect(s, cx - stp / 2 + 3, byb - hh2, stp - 6, hh2, { fill: is28 ? C.accent : 'rgba(37,99,235,0.55)', 'class': 'hoverable' });
      attachTip(bar, r.year + ': $' + fmtI(r.investment_bn) + 'B · ' + fmt(r.investment_gdp_pct, 1) + '% GDP' + (is28 ? '\n' + bi('peak $1,717B · 5.0%', '峰值 $1,717B · 5.0%') : '') + (is29 ? '\n' + bi('−43% cliff', '−43% 断崖') : ''));
      sText(s, cx, byb + 12, String(r.year).slice(2), 'lab-sm', 'middle');
    });
    sText(s, bx0, 228, bi('Table 5: 2028 peak → 2029 −43%; 2027–28 cohorts = 93.6 GW of dated pipeline', '表5：2028 峰 → 2029 −43%；2027–28 队列 = 有日期管道的 93.6 GW'), 'lab-sm');
  }

  /* risk-3：斜率按相对涨幅排序 + 聚合带 */
  function renderRisk3() {
    var b = figBody('risk-3');
    if (!b) return;
    b.innerHTML = '';
    var s = svgEl('svg', { viewBox: '0 0 1000 330', width: '100%' }, null);
    b.appendChild(s);
    var firms = [
      { n: 'Oracle', a: 118.8, b: 205.5 },
      { n: 'Amazon', a: 39.7, b: 59.6 },
      { n: 'Meta', a: 56.1, b: 80.2 },
      { n: 'Microsoft', a: 35.1, b: 47.7 },
      { n: 'Alphabet', a: 44.7, b: 57.7 }
    ].sort(function (x, y) { return (y.b / y.a) - (x.b / x.a); });
    var x0 = 300, x1 = 660, yT = 44, yB = 240;
    var yC = function (v) { return yB - (yB - yT) * (v / 220); };
    [0, 50, 100, 150, 200].forEach(function (tv) {
      sLine(s, x0, yC(tv), x1, yC(tv), { 'class': 'grid' });
      sText(s, x0 - 8, yC(tv) + 3, String(tv), 'ax-tick', 'end');
    });
    var opac = [1, 0.8, 0.62, 0.48, 0.36];
    function nudgeY(arr, key, gap) {
      var order = arr.map(function (d, k) { return k; }).sort(function (a, b) { return arr[a][key] - arr[b][key]; });
      var prev = -1e9;
      order.forEach(function (k) { arr[k][key] = Math.max(arr[k][key], prev + gap); prev = arr[k][key]; });
      return arr;
    }
    var geo = firms.map(function (f, i) {
      var y1 = yC(f.a), y2 = yC(f.b);
      return { f: f, i: i, y1: y1, y2: y2, labA: y1 + 4, labB: y2 + 4 };
    });
    nudgeY(geo, 'labA', 11);
    nudgeY(geo, 'labB', 12);
    geo.forEach(function (d) {
      var f = d.f, i = d.i;
      var g = svgEl('g', { 'class': 'hit' }, s);
      sLine(g, x0, d.y1, x1, d.y2, { stroke: C.accent, 'stroke-width': i === 0 ? 3.4 : 2.2, 'stroke-opacity': opac[i], 'stroke-dasharray': f.n === 'Amazon' ? '6 4' : 'none' });
      svgEl('circle', { cx: x0, cy: d.y1, r: 4, fill: '#fff', stroke: C.accent, 'stroke-opacity': opac[i], 'stroke-width': 2 }, g);
      svgEl('circle', { cx: x1, cy: d.y2, r: 4.5, fill: C.accent, 'fill-opacity': opac[i] }, g);
      sText(g, x0 - 12, d.labA, fmt(f.a, 1), 'lab-sm', 'end');
      sText(g, x1 + 12, d.labB, fmt(f.b, 1), 'lab', 'start');
      sText(g, x1 + 62, d.labB, '+' + fmt((f.b / f.a - 1) * 100, 1) + '%', 'lab-sm', 'start');
      attachTip(g, f.n + ': ' + fmt(f.a, 1) + ' → ' + fmt(f.b, 1) + ' bp (+' + fmt(f.b - f.a, 1) + 'bp / +' + fmt((f.b / f.a - 1) * 100, 1) + '%, derived)' +
        (f.n === 'Amazon' ? '\n' + bi('excluded from fn6 L1–L4 — yet second-hardest repriced', '被 fn6 L1–L4 剔除——重定价幅度却是第二大') : '') +
        (f.n === 'Oracle' ? '\n' + bi('entered 2.1–3.4× wider than peers; 55.5% of the aggregate move', '起点即比同业宽 2.1–3.4×；独占合计走阔的 55.5%') : ''));
    });
    sText(s, x0, yB + 18, '2025-11-21', 'ax-tick', 'middle');
    sText(s, x1, yB + 18, '2026-07-22', 'ax-tick', 'middle');
    sText(s, 40, yT + 4, bi('sorted by relative widening (derived) — Oracle deepest, Amazon dashed', '按相对走阔排序（衍生）——Oracle 最深，Amazon 虚线'), 'lab');
    sText(s, 40, yT + 24, bi('dispersion 73.0/29.1 = 2.5×: the market discriminated, not a uniform IG de-rating', '离散 73.0/29.1 = 2.5×：市场在做区分定价，而非一刀切降档'), 'lab-sm');
    var band = sRect(s, 40, 272, 920, 40, { fill: '#eff4ff', rx: 4, 'class': 'hoverable' });
    attachTip(band, bi('aggregate (derived): Σ 294.4 → 450.7 bp (+156.3bp, +53.1%)', '合计（衍生）：Σ 294.4 → 450.7 bp（+156.3bp，+53.1%）') + '\nOracle 86.7/156.3 = 55.5% of the aggregate move');
    sText(s, 52, 290, bi('aggregate band: Σ 294.4 → 450.7 bp (+53.1%, derived) · Oracle 55.5% of the move · Amazon +50.1% yet excluded from the fn6 sample', '聚合带：Σ 294.4 → 450.7 bp（+53.1%，衍生）· Oracle 独占 55.5% · Amazon +50.1% 却被 fn6 样本剔除'), 'lab-sm', 'start');
    sText(s, 52, 306, bi('ratio-based (fn6) and market-based (fn8) evidence cover different firm sets — neither alone shows the whole risk map.', '比率型（fn6）与市场型（fn8）证据覆盖不同公司集合——单看任一套都看不到完整风险地图。'), 'lab-sm', 'start');
  }
})();

/* ============================================================
   9. 附录核对表
   ============================================================ */
(function () {
  reg(function renderAppendix() {
    var host = el('appendix-verify');
    if (!host) return;
    var rows = MANIFEST.views;
    var html = '<table class="data-table"><thead><tr>' +
      '<th>' + esc(t('verify_col_view')) + '</th>' +
      '<th class="num">' + esc(t('verify_col_rows')) + '</th>' +
      '<th>' + esc(t('verify_col_src')) + '</th>' +
      '<th>' + esc(t('verify_col_status')) + '</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td><b>' + esc(r.id) + '</b><br><span style="font-size:12px;color:var(--text-secondary)">' +
        esc(lang === 'zh' ? r.title_zh : r.title_en) + '</span></td>' +
        '<td class="num">' + esc(String(r.rows)) + '</td>' +
        '<td style="font-family:var(--mono);font-size:11.5px">' + esc(r.source) + '</td>' +
        '<td class="ok">' + esc(t('verify_ok')) + '</td></tr>';
    });
    html += '</tbody></table>';
    host.innerHTML = html;
  });
})();

/* ============================================================
   10. boot
   ============================================================ */
(function boot() {
  var lt = el('lang-toggle');
  if (lt) lt.addEventListener('click', function () { applyLang(lang === 'zh' ? 'en' : 'zh'); });
  var ns = el('nav-select');
  if (ns) ns.addEventListener('change', function () {
    var tgt = document.querySelector(ns.value);
    if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.documentElement.lang = lang;
  document.body.className = 'lang-' + lang;
  if (lt) lt.textContent = lang === 'zh' ? 'EN' : '中文';
  renderAll();
  /* prov 锚点自测：放在 renderAll() 之后，覆盖静态 HTML + 全部动态生成的 SVG/图表角标 */
  var missing = [];
  var nodes = document.querySelectorAll('[data-prov]');
  for (var i = 0; i < nodes.length; i++) {
    var k = nodes[i].getAttribute('data-prov').split(':');
    var idx = parseInt(k[1], 10);
    var arr = provIndex[k[0]];
    if (!arr || !(idx >= 0 && idx < arr.length)) missing.push(nodes[i].getAttribute('data-prov'));
  }
  if (window.console && console.info) {
    console.info('[acbl] provenance entries: ' + provCount + '; data-prov refs: ' + nodes.length +
      (missing.length ? '; MISSING: ' + missing.join(',') : '; all resolve'));
  }
})();
})();

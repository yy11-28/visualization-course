// =============================================================
// course.js — 课程内容展示模块
// 提供：章节卡片 / 知识图谱 / 概念可视化 / 课程目录 / 阅读辅助
// 章节正文内容不做任何改动，仅叠加展示层。
// =============================================================

// D3 使用本地副本（assets/d3.v7.esm.js），保证断网时依然可用。
// 生成方式见 tools/build-d3-esm.js
import * as d3 from "./assets/d3.v7.esm.js";
import { CHAPTERS, COURSE_META, buildChartGraph } from "./course-map.js";
import { PITFALLS, GLOSSARY, QUIZ, t as tL } from "./study-tools.js";
import { PATHWAY } from "./pathway.js";
import { SECTION_NOTES } from "./section-notes.js";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* 章节元信息速查：章号 → 标题 / 主题色 / 链接 */
const CH = Object.fromEntries(CHAPTERS.map((c) => [c.num, c]));

/* i18n 文案：优先用 i18n.js 的 t()，缺失时回退内置中文 */
const T = (key, fallback, vars) => {
  let v = "";
  try { v = window.__i18n?.t?.(key) || ""; } catch { /* i18n 未加载 */ }
  if (!v || v === key) v = fallback;
  if (vars) for (const [k, val] of Object.entries(vars)) v = v.replace(`{${k}}`, val);
  return v;
};

/* 小节跳转链接 */
const secHref = (chNum, secId) => `${CH[chNum].href}#ch-${secId}`;

/* =============================================================
 * 1. 章节卡片（一行三列网格）
 * ============================================================= */
export function renderChapterCards(host = $("#chapter-cards")) {
  if (!host) return;
  host.innerHTML = CHAPTERS.map((c) => {
    const chips = c.sections.map((s) =>
      `<button type="button" class="ch-chip" data-href="${c.href}#ch-${s.id}" title="${s.id} ${s.title}">${s.id} ${s.title}</button>`).join("");
    return `<a class="ch-card" href="${c.href}" style="--ac:${c.accent}">
      <span class="ch-card-bar" aria-hidden="true"></span>
      <div class="ch-card-top">
        <span class="ch-num">${String(c.num).padStart(2, "0")}</span>
        <div class="ch-title"><h3>${c.icon} ${c.title}</h3><span class="ch-en">${c.titleEn || ""}</span></div>
      </div>
      <p class="ch-blurb">${c.blurb}</p>
      <div class="ch-chips">${chips}</div>
      <div class="ch-card-foot">
        <span class="ch-meta">${c.sections.length} 小节 · ${c.hours} 学时</span>
        <span class="ch-arrow">→</span>
      </div>
    </a>`;
  }).join("");

  // 小节胶囊 → 直达该节；卡片其余区域 → 进入章节
  host.addEventListener("click", (e) => {
    const chip = e.target.closest(".ch-chip");
    if (!chip) return;
    e.preventDefault();
    e.stopPropagation();
    location.href = chip.dataset.href;
  });
}

/* =============================================================
 * 2. 知识图谱（D3 力导向图）
 * ============================================================= */
export function renderGraph(svgEl = $("#course-graph")) {
  if (!svgEl) return;
  const { nodes, links } = buildChartGraph();
  const width  = svgEl.clientWidth  || 900;
  const height = svgEl.clientHeight || 480;

  d3.select(svgEl).selectAll("*").remove();
  const svg = d3.select(svgEl)
    .attr("viewBox", [0, 0, width, height])
    .attr("preserveAspectRatio", "xMidYMid meet");

  const defs = svg.append("defs");
  const g = defs.append("linearGradient").attr("id", "graphGlow").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
  g.append("stop").attr("offset", "0%").attr("stop-color", "#818cf8");
  g.append("stop").attr("offset", "100%").attr("stop-color", "#38bdf8");

  const linkG = svg.append("g");
  const nodeG = svg.append("g");

  const sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id).distance((d) => (d.type === "progress" ? 150 : 46)).strength((d) => (d.type === "progress" ? 0.28 : 0.85)))
    .force("charge", d3.forceManyBody().strength((d) => (d.type === "chapter" ? -520 : d.type === "section" ? -170 : -60)))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius((d) => d.r + 6))
    .force("x", d3.forceX(width / 2).strength(0.035))
    .force("y", d3.forceY(height / 2).strength(0.06));

  const link = linkG.selectAll("line").data(links).join("line")
    .attr("class", "g-link")
    .attr("stroke-width", (d) => (d.type === "progress" ? 2 : 1.2))
    .attr("stroke-dasharray", (d) => (d.type === "progress" ? "6 6" : null))
    .attr("opacity", (d) => (d.type === "progress" ? 0.55 : 0.7));

  const node = nodeG.selectAll("g").data(nodes).join("g").attr("class", "g-node");

  node.append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d) => (d.type === "chapter" ? d.color : "#ffffff"))
    .attr("stroke", (d) => d.color)
    .attr("stroke-width", (d) => (d.type === "chapter" ? 3 : 2.5))
    .attr("opacity", (d) => (d.type === "chapter" ? 0.24 : 1));

  node.append("text")
    .attr("class", (d) => (d.type === "chapter" ? "g-chapter-label" : "g-node-label"))
    .attr("text-anchor", "middle")
    .attr("dy", (d) => (d.type === "chapter" ? 5 : d.r + 13))
    .text((d) => d.label);

  // 悬停高亮相邻
  node.on("mouseenter", function (_, d) {
    node.transition().duration(140).style("opacity", (o) =>
      o.id === d.id || links.some((l) =>
        (l.source.id === d.id && l.target.id === o.id) || (l.target.id === d.id && l.source.id === o.id)
      ) ? 1 : 0.22);
  }).on("mouseleave", () => node.transition().duration(140).style("opacity", 1));

  // 点击小节 → 跳转
  node.filter((d) => d.type === "section").on("click", (_, d) => { location.href = d.href; });

  // 拖拽
  node.call(d3.drag()
    .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
    .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

  sim.on("tick", () => {
    link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });
}

/* =============================================================
 * 3. 概念可视化画廊
 * ============================================================= */
const VIZ = {};

/* --- 3.1 DIKW 金字塔 --- */
VIZ.dikw = (el) => {
  const layers = [
    { label: "智慧 Wisdom",  color: "#4f46e5", w: 0.30, note: "知道为什么 · 决策" },
    { label: "知识 Knowledge", color: "#6C8FF5", w: 0.47, note: "知道怎么做 · 规律" },
    { label: "信息 Information", color: "#818cf8", w: 0.66, note: "谁 / 何时 / 何地" },
    { label: "数据 Data",    color: "#a5b4fc", w: 0.88, note: "原始符号 · 事实" },
  ];
  const W = 260, H = 172, cx = W / 2;
  const rows = layers.map((L, i) => {
    const yTop = 8 + i * 40, yBot = yTop + 36;
    const halfTop = (L.w * W) / 2;
    const nextW = layers[i + 1] ? layers[i + 1].w : L.w * 0.72;
    const halfBot = (nextW * W) / 2;
    const pts = `${cx - halfTop},${yTop} ${cx + halfTop},${yTop} ${cx + halfBot},${yBot} ${cx - halfBot},${yBot}`;
    return `<g class="pyr-layer">
      <polygon points="${pts}" fill="${L.color}" />
      <text class="pyr-text" x="${cx}" y="${yTop + 23}" text-anchor="middle">${L.label}</text>
      <title>${L.note}</title>
    </g>`;
  }).join("");
  el.innerHTML = `<div class="pyramid">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="DIKW 金字塔">${rows}</svg>
    <p class="viz-note">上层依赖下层：没有干净的数据，就没有可信的智慧。可视化处在<strong>信息 → 知识</strong>的加速带。</p>
  </div>`;
};

/* --- 3.2 Stevens 测量尺度 --- */
VIZ.stevens = (el) => {
  const rows = [
    { name: "定类 Nominal",  val: 25, color: "#94a3b8", tip: "只有相等/不等，如性别、班级。可做的操作：计数、众数。" },
    { name: "定序 Ordinal",  val: 45, color: "#60a5fa", tip: "有顺序但间距未知，如满意度星级。可排序、取中位数。" },
    { name: "定距 Interval", val: 70, color: "#818cf8", tip: "间距有意义但无绝对零点，如摄氏温度、日期。可加减。" },
    { name: "定比 Ratio",    val: 100, color: "#4f46e5", tip: "有绝对零点，如年龄、金额、人数。可乘除、算倍数。" },
  ];
  el.innerHTML = `<div class="stevens">${rows.map((r) => `
    <div class="st-row" title="${r.tip}">
      <b>${r.name}</b>
      <div class="st-bar"><div class="st-fill" style="width:${r.val}%;background:${r.color}"></div></div>
    </div>`).join("")}
    <p class="viz-note">尺度越高，允许的运算与图表越多。<strong>用错了尺度 = 用错了图</strong>，这是最常见的错误来源。</p>
  </div>`;
};

/* --- 3.3 Mackinlay 视觉通道排序 --- */
VIZ.mackinlay = (el) => {
  const rows = [
    { name: "位置 Position", score: 100 }, { name: "长度 Length", score: 88 },
    { name: "角度 Angle",    score: 72 },  { name: "斜率 Slope",  score: 66 },
    { name: "面积 Area",     score: 54 },  { name: "体积 Volume", score: 44 },
    { name: "色饱和 Saturation", score: 34 }, { name: "色相 Hue",  score: 24 },
  ];
  el.innerHTML = `<div class="mack">${rows.map((r, i) => {
    const c = d3.interpolateCool(1 - i / (rows.length - 1) * 0.68);
    return `<div class="mack-row" title="Mackinlay 1986：定量数据下的感知精确度排名 第 ${i + 1} 位">
      <b>${r.name}</b>
      <div class="mack-bar"><div class="mack-fill" style="width:${r.score}%;background:${c}"></div></div>
      <span class="mack-score">${r.score}</span>
    </div>`;
  }).join("")}
    <p class="viz-note">同一份数据，<strong>用位置编码比用颜色编码精确约 3～5 倍</strong>。这是选择视觉编码的第一原则。</p>
  </div>`;
};

/* --- 3.4 Card 数据流模型 --- */
VIZ.card = (el) => {
  const steps = [
    { k: "D", t: "原始数据 Data",      d: "分散、含噪、格式各异",              c: "#64748b" },
    { k: "T", t: "数据表 Data Tables", d: "清洗 / 聚合 / 连接 / 派生",          c: "#4FC0A1" },
    { k: "V", t: "视觉结构 Visual Structures", d: "选图元 + 通道映射",         c: "#6C8FF5" },
    { k: "I", t: "视图 Views",         d: "渲染 + 交互 + 动画",                c: "#4f46e5" },
  ];
  el.innerHTML = `<div class="card-flow">${steps.map((s, i) => `
    ${i ? `<div class="cf-arrow">↓</div>` : ""}
    <div class="cf-step">
      <div class="cf-dot" style="background:${s.c}">${s.k}</div>
      <div class="cf-body"><b>${s.t}</b><span>${s.d}</span></div>
    </div>`).join("")}
    <p class="viz-note">Card 1999。每一步都能反向迭代 —— <strong>看到视图不对，要回到哪一步修？</strong> 这是调试可视化的思路。</p>
  </div>`;
};

/* --- 3.5 图表类型选择指南 --- */
VIZ.chartpick = (el) => {
  const ICONS = {
    bar:   `<svg viewBox="0 0 34 22" class="ci"><rect x="2" y="12" width="6" height="8"/><rect x="11" y="6" width="6" height="14"/><rect x="20" y="2" width="6" height="18"/><rect x="29" y="9" width="3" height="11"/></svg>`,
    line:  `<svg viewBox="0 0 34 22" class="ci"><polyline points="2,18 10,12 18,14 26,5 32,8"/></svg>`,
    area:  `<svg viewBox="0 0 34 22" class="ci"><polygon points="2,20 10,12 18,14 26,5 32,8 32,20"/></svg>`,
    pie:   `<svg viewBox="0 0 22 22" class="ci"><path d="M11,11 L11,1 A10,10 0 0 1 21,11 Z"/><path d="M11,11 L21,11 A10,10 0 0 1 11,21 Z" opacity=".55"/></svg>`,
    stack: `<svg viewBox="0 0 34 22" class="ci"><rect x="3" y="2" width="7" height="5"/><rect x="3" y="8" width="7" height="5" opacity=".7"/><rect x="3" y="14" width="7" height="6" opacity=".45"/><rect x="14" y="2" width="7" height="8"/><rect x="14" y="11" width="7" height="4" opacity=".7"/><rect x="14" y="16" width="7" height="4" opacity=".45"/></svg>`,
    scatter:`<svg viewBox="0 0 34 22" class="ci"><circle cx="6" cy="16" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="18" cy="13" r="2"/><circle cx="24" cy="5" r="2"/><circle cx="30" cy="8" r="2"/></svg>`,
    hist:  `<svg viewBox="0 0 34 22" class="ci"><rect x="2" y="10" width="5" height="10"/><rect x="8" y="5" width="5" height="15"/><rect x="14" y="2" width="5" height="18"/><rect x="20" y="8" width="5" height="12"/><rect x="26" y="13" width="5" height="7"/></svg>`,
    box:   `<svg viewBox="0 0 22 22" class="ci"><rect x="5" y="6" width="12" height="9" fill="none" stroke="currentColor" stroke-width="1.4"/><line x1="11" y1="1" x2="11" y2="6"/><line x1="11" y1="15" x2="11" y2="21"/><line x1="2" y1="10" x2="20" y2="10"/></svg>`,
    heat:  `<svg viewBox="0 0 22 22" class="ci"><rect x="1" y="1" width="6" height="6" opacity=".3"/><rect x="8" y="1" width="6" height="6" opacity=".6"/><rect x="15" y="1" width="6" height="6" opacity=".95"/><rect x="1" y="8" width="6" height="6" opacity=".6"/><rect x="8" y="8" width="6" height="6" opacity=".95"/><rect x="15" y="8" width="6" height="6" opacity=".3"/><rect x="1" y="15" width="6" height="6" opacity=".95"/><rect x="8" y="15" width="6" height="6" opacity=".3"/><rect x="15" y="15" width="6" height="6" opacity=".6"/></svg>`,
    map:   `<svg viewBox="0 0 22 22" class="ci"><path d="M11,1 C15,5 16,8 16,11 C16,15 14,18 11,21 C8,18 6,15 6,11 C6,8 7,5 11,1 Z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="11" r="2.2"/></svg>`,
  };

  const rows = [
    { goal: "比较大小",      desc: "各类别之间的数值对比",       picks: [["bar", "条形图"], ["stack", "堆叠条形图"]] },
    { goal: "看时间趋势",    desc: "数值随时间的变化走向",       picks: [["line", "折线图"], ["area", "面积图"]] },
    { goal: "看占比构成",    desc: "部分与整体的关系",           picks: [["pie", "饼图"],   ["stack", "百分比堆叠图"]] },
    { goal: "看相关关系",    desc: "两个变量是否相关、有无异常", picks: [["scatter", "散点图"]] },
    { goal: "看分布情况",    desc: "数据的集中区间与离群值",     picks: [["hist", "直方图"], ["box", "箱线图"]] },
    { goal: "看空间分布",    desc: "地理或矩阵上的密度差异",     picks: [["map", "choropleth 地图"], ["heat", "热力图"]] },
  ];

  el.innerHTML = `<div class="chartpick">${rows.map((r) => `
    <div class="cp-row">
      <div class="cp-goal"><b>${r.goal}</b><span>${r.desc}</span></div>
      <div class="cp-picks">${r.picks.map(([k, name]) => `
        <span class="cp-pick" title="${name}">${ICONS[k]}<em>${name}</em></span>`).join("")}</div>
    </div>`).join("")}
    <p class="viz-note">先问「<strong>要让读者比较什么</strong>」，再选图 —— 而不是先选好看的图。<em>饼图仅适合 2–3 个类别</em>。</p>
  </div>`;
};

/* --- 3.6 配色方案选择 --- */
VIZ.palette = (el) => {
  const swatches = (n, fn) => Array.from({ length: n }, (_, i) =>
    `<i style="background:${fn(i / (n - 1 || 1))}"></i>`).join("");

  const groups = [
    {
      name: "分类 Categorical",
      fn: (t) => d3.schemeTableau10[Math.floor(t * 9.999)],
      raw: `<i style="background:${d3.schemeTableau10.slice(0, 8).join('"></i><i style="background:')}"></i>`,
      use: "类别之间没有顺序（如专业、性别）",
      tip: "色相变化为主，明度接近，避免暗示大小关系",
    },
    {
      name: "顺序 Sequential",
      fn: null,
      raw: swatches(8, (t) => d3.interpolateBlues(0.15 + t * 0.85)),
      use: "数值由低到高（如气温、密度）",
      tip: "单一色相的明度渐变，人眼能自然读出大小",
    },
    {
      name: "发散 Diverging",
      fn: null,
      raw: swatches(8, (t) => d3.interpolateRdBu(1 - t)),
      use: "围绕中心值向两侧偏离（如涨跌、差值）",
      tip: "两端对比色 + 中间中性色，中心点必须明确",
    },
  ];

  el.innerHTML = `<div class="palette">${groups.map((g) => `
    <div class="pal-row">
      <div class="pal-head"><b>${g.name}</b><span>${g.use}</span></div>
      <div class="pal-strip">${g.raw}</div>
      <p class="pal-tip">${g.tip}</p>
    </div>`).join("")}
    <p class="viz-note">⚠️ <strong>彩虹色（jet）慎用</strong>：它没有自然的明暗顺序，读者难以判断大小，且对色觉障碍者不友好。</p>
  </div>`;
};

/* --- 3.7 CVD 色盲模拟 --- */
VIZ.cvd = (el) => {
  const base = ["#d73027", "#fc8d59", "#fee090", "#91cf60", "#1a9850", "#4575b4", "#762a83", "#e08214"];
  const modes = [
    { id: "normal", name: "正常视觉", m: null },
    { id: "protan", name: "红色盲", m: [0.567,0.433,0, 0.558,0.442,0, 0,0.242,0.758] },
    { id: "deutan", name: "绿色盲", m: [0.625,0.375,0, 0.7,0.3,0, 0,0.3,0.7] },
    { id: "tritan", name: "蓝黄色盲", m: [0.95,0.05,0, 0,0.433,0.567, 0,0.475,0.525] },
  ];
  el.innerHTML = `
    <svg width="0" height="0" style="position:absolute">
      <defs>${modes.filter((x) => x.m).map((x) => `
        <filter id="cvd-${x.id}" color-interpolation-filters="linearRGB">
          <feColorMatrix type="matrix" values="${x.m.slice(0,3).join(" ")} 0 0 ${x.m.slice(3,6).join(" ")} 0 0 ${x.m.slice(6,9).join(" ")} 0 0"/>
        </filter>`).join("")}
      </defs>
    </svg>
    <div class="cvd-demo">
      <div class="cvd-swatches" id="cvd-swatches">
        ${base.map((c) => `<div class="cvd-swatch" style="background:${c}"></div>`).join("")}
      </div>
      <div class="cvd-controls">
        <div class="cvd-btns" id="cvd-btns">
          ${modes.map((m, i) => `<button class="cvd-btn${i === 0 ? " active" : ""}" data-mode="${m.id}" type="button">${m.name}</button>`).join("")}
        </div>
      </div>
    </div>
    <p class="viz-note">约 <strong>8% 的男性</strong>存在色觉障碍。切换看看：红绿配色在他们眼里会“塌”成一片 —— 这就是第 3 章强调 CVD 安全配色的原因。</p>`;

  const sw = $("#cvd-swatches", el);
  $("#cvd-btns", el).addEventListener("click", (e) => {
    const b = e.target.closest(".cvd-btn");
    if (!b) return;
    $$(".cvd-btn", el).forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    sw.style.filter = b.dataset.mode === "normal" ? "none" : `url(#cvd-${b.dataset.mode})`;
  });
};

export function renderGallery() {
  const map = [
    ["#viz-dikw",      VIZ.dikw],
    ["#viz-stevens",   VIZ.stevens],
    ["#viz-mack",      VIZ.mackinlay],
    ["#viz-card",      VIZ.card],
    ["#viz-chartpick", VIZ.chartpick],
    ["#viz-palette",   VIZ.palette],
    ["#viz-cvd",       VIZ.cvd],
  ];
  // 惰性渲染：默认只显示卡片壳，点击后才绘制图形
  for (const [sel, fn] of map) {
    const el = $(sel);
    if (!el) continue;
    const cover = document.createElement("button");
    cover.type = "button";
    cover.className = "viz-cover";
    cover.innerHTML = `<span class="viz-cover-btn">▶ ${T("study.figure.show", "点击查看图形")}</span>`;
    cover.setAttribute("aria-label", "view figure");
    el.appendChild(cover);
    cover.addEventListener("click", () => {
      // 渲染函数会整体重写 stage 内容，cover 随之清除
      fn(el);
      el.classList.add("open");
    });
  }
}

/* =============================================================
 * 5. 32 学时学习路径（16 次课，按章分组的时间线）
 * ============================================================= */
export function renderPathway() {
  const host = $("#pw-list");
  if (!host) return;

  const F = (key, fb, vars) => T(key, fb, vars);

  // 左栏只做导航：16 次课紧凑行，详细内容在右侧面板
  const html = CHAPTERS.map((c) => {
    const sessions = PATHWAY.filter((s) => s.ch === c.num);
    if (!sessions.length) return "";

    return `<div class="pw-sess-group" style="--ac:${c.accent}">
      <div class="pw-sess-ch">
        <span class="pw-sess-ch-num">${String(c.num).padStart(2, "0")}</span>
        <span>${c.icon} ${c.title}</span>
        <span class="pw-sess-ch-meta">${c.hours} ${F("portal.stat.hours", "学时")}</span>
      </div>
      ${sessions.map((s) => `
        <button type="button" class="pw-sess${s.milestone ? " is-milestone" : ""}" id="pw-${s.no}" data-no="${s.no}">
          <span class="pw-sess-no">${String(s.no).padStart(2, "0")}</span>
          <span class="pw-sess-t">${tL(s.title)}${s.milestone ? " ★" : ""}</span>
          <span class="pw-sess-secs">${s.sections.join(" · ")}</span>
        </button>`).join("")}
    </div>`;
  }).join("");

  host.innerHTML = html;

  renderPathwayGraph();
  renderPathwayDetail(null);
  initPathwayLinkage();

  // 概览条
  const ov = $("#pw-overview");
  if (ov) {
    ov.innerHTML = [
      `<div class="pw-ov"><b>32</b><span>${F("portal.stat.hours", "学时")}</span></div>`,
      `<div class="pw-ov"><b>16</b><span>${F("pw.sessions", "次课")}</span></div>`,
      `<div class="pw-ov"><b>5</b><span>${F("portal.stat.chapters", "章")}</span></div>`,
      `<div class="pw-ov"><b>27</b><span>${F("portal.stat.sections", "小节")}</span></div>`,
      `<div class="pw-ov"><b>2</b><span>${F("pw.milestone", "次阶段节点")}</span></div>`,
    ].join("");
  }
}

/* 小节 → 所属课次 */
const sec2session = {};
PATHWAY.forEach((s) => s.sections.forEach((sec) => (sec2session[sec] = s.no)));

/* 页面基准路径：工具子页需回退两级，首页直接用相对路径 */
const pwBase = () => (location.pathname.includes("/tools/") ? "../../" : "");

/* 学习路径图：每个专题一行，行内小节节点横向串成一条路径 */
export function renderPathwayGraph() {
  const box = $("#pw-graph");
  if (!box) return;

  // 画布按左栏实际宽度设计：标签区加宽防遮挡；节点少的章间距自动拉大，行末统一对齐不留空
  const X0 = 184, TOP = 42, ROW = 76, AMP = 10, GAP = 12, AVAIL = 538;
  const rows = CHAPTERS.map((c) => {
    const n = c.sections.length;
    const step = n > 1 ? AVAIL / (n - 1) : 0;
    const r = Math.max(19, Math.min(24, (step - GAP) / 2));   // 间距越大，节点越大
    return { c, n, step, r, fs: (r * 0.58).toFixed(1) };
  });
  const W = X0 + AVAIL + Math.max(...rows.map((x) => x.r)) + 14;
  const H = TOP + (CHAPTERS.length - 1) * ROW + 40;

  let lines = "", dots = "", heads = "";

  rows.forEach((row, i) => {
    const { c, step, r, fs } = row;
    const y = TOP + i * ROW;
    // 行内波浪交错：奇偶节点上下错开，章与章之间不连线
    const pts = c.sections.map((s, j) => ({
      s, x: X0 + j * step, y: y + (j % 2 ? AMP : -AMP),
    }));

    lines += pts.slice(0, -1).map((p, j) => {
      const q = pts[j + 1];
      return `<line class="pw-path-line" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${c.accent}" />`;
    }).join("");

    // 行首专题标签（垂直居中于本行）
    heads += `<g>
      <text class="pw-col-num" x="14" y="${y + 1}" fill="${c.accent}">${String(c.num).padStart(2, "0")}</text>
      <text class="pw-col-title" x="46" y="${y + 1}">${c.icon} ${c.title}</text>
    </g>`;

    dots += pts.map((p) => `
      <g class="pw-dot" data-sec="${p.s.id}" data-ch="${c.num}" transform="translate(${p.x},${p.y})" tabindex="0">
        <title>${p.s.id} ${p.s.title}</title>
        <circle class="pw-dot-hit" r="${r + 4}" />
        <circle class="pw-dot-c" r="${r}" fill="${c.accent}" />
        <text class="pw-dot-t" y="4" style="font-size:${fs}px">${p.s.id}</text>
      </g>`).join("");
  });

  box.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="学习路径图">
      ${heads}${lines}${dots}
    </svg>`;
}

/* 某次课的排期内容：要点 + 课堂活动 + 课后作业 + 前置依赖 + 覆盖小节 */
function pwSessionHtml(s, F) {
  const c = CH[s.ch];
  const links = s.prereq.map((p) =>
    `<a class="pw-d-pre" href="#pw-${p}">${F("pw.session.short", "第 {n} 次课", { n: p })}</a>`).join("");

  return `
    <div class="pw-d-head" style="--ac:${c.accent}">
      <span class="pw-d-badge">${String(s.no).padStart(2, "0")}</span>
      <div>
        <h3>${tL(s.title)}</h3>
        <span class="pw-d-sub">${F("pw.week", "第 {n} 周", { n: s.week })} · ${s.hours} ${F("portal.stat.hours", "学时")}</span>
      </div>
    </div>
    <ul class="pw-d-points">
      ${s.points.map((p) => `<li>${tL(p)}</li>`).join("")}
    </ul>
    <div class="pw-box act"><b>${F("pw.activity", "课堂活动")}</b><span>${tL(s.activity)}</span></div>
    <div class="pw-box hw"><b>${F("pw.homework", "课后作业")}</b><span>${tL(s.homework)}</span></div>
    <div class="pw-box pre"><b>${F("pw.prereq", "前置依赖")}</b>
      <span>${links || `<i class="pw-none">${F("pw.prereq.none", "无 —— 本课程起点")}</i>`}</span></div>
    <div class="pw-d-secs">
      ${s.sections.map((sec) => `<button type="button" class="pw-d-sec" data-sec="${sec}">${sec}</button>`).join("")}
    </div>`;
}

/* 右侧详情面板：默认概览 / 选中某小节 / 选中某次课 */
export function renderPathwayDetail(secId, no) {
  const box = $("#pw-detail");
  if (!box) return;

  const F = (k, fb, v) => T(k, fb, v);

  if (secId) {
    const chNum = Number(secId.split("-")[0]);
    const c = CH[chNum];
    const sec = c.sections.find((s) => s.id === secId);
    const note = SECTION_NOTES[secId];
    const sess = PATHWAY.find((s) => s.no === sec2session[secId]);
    const href = `${pwBase()}${c.href}#ch-${secId}`;

    box.innerHTML = `
      <div class="pw-d-head" style="--ac:${c.accent}">
        <span class="pw-d-badge">${secId}</span>
        <div>
          <h3>${sec.title}</h3>
          <span class="pw-d-sub">${c.icon} 第${chNum}章 ${c.title}</span>
        </div>
      </div>
      <p class="pw-d-brief">${note ? tL(note.brief) : ""}</p>
      <ul class="pw-d-points">
        ${note ? note.points.map((p) => `<li>${tL(p)}</li>`).join("") : ""}
      </ul>
      <div class="pw-d-tags">${(sec.tags || []).map((t) => `<span>${t}</span>`).join("")}</div>
      <a class="pw-d-go" href="${href}">
        <span>${F("pw.detail.enter", "进入学习")}</span><span>→</span>
      </a>
      <div class="pw-d-cap">${F("pw.detail.plan", "本节所属排期")}</div>
      <div class="pw-d-plan">${pwSessionHtml(sess, F)}</div>`;

    $$(".pw-d-sec", box).forEach((b) => (b.onclick = () => renderPathwayDetail(b.dataset.sec)));
    selectDot(secId);
    return;
  }

  if (no) {
    const s = PATHWAY.find((x) => x.no === no);

    box.innerHTML = pwSessionHtml(s, F);

    $$(".pw-d-sec", box).forEach((b) => (b.onclick = () => renderPathwayDetail(b.dataset.sec)));
    selectDot(null, s.sections);
    return;
  }

  // 默认：概览 + 提示
  box.innerHTML = `
    <div class="pw-side-cap">${F("pw.detail.title", "小节详情")}</div>
    <div class="pw-side-tip">${F("pw.detail.tip", "点击左侧路径图上的任一节点，这里显示该小节的简略内容与学习入口。")}</div>
    <div class="pw-d-legend">
      ${CHAPTERS.map((c) => `<div class="pw-d-lg" style="--ac:${c.accent}">
        <i></i><b>${String(c.num).padStart(2, "0")} ${c.title}</b><span>${c.sections.length}</span>
      </div>`).join("")}
    </div>`;
  selectDot(null, null);
}

/* 高亮路径图上的节点 */
function selectDot(secId, secs) {
  $$(".pw-dot").forEach((g) => {
    const id = g.dataset.sec;
    g.classList.toggle("on", secId ? id === secId : !!(secs && secs.includes(id)));
  });
}

/* 联动：点节点看小节、点课次卡看课次、滚动时自动跟随 */
function initPathwayLinkage() {
  const cards = $$(".pw-sess");
  const cur = $("#pw-current");
  if (!cards.length) return;

  const setActive = (no) => {
    cards.forEach((c) => c.classList.toggle("pw-active", Number(c.dataset.no) === no));
    const s = PATHWAY.find((x) => x.no === no);
    if (cur && s) cur.textContent = `${T("pw.session.short", "第 {n} 次课", { n: no })} · ${tL(s.title)}`;
  };

  // 手动点击后锁定滚动联动，直到用户自己滚动才交还控制权
  let locked = false;
  const unlock = () => { locked = false; };
  ["wheel", "touchmove", "keydown"].forEach((ev) =>
    window.addEventListener(ev, unlock, { passive: true }));

  // 判定线：顶栏下方 140px 以上最后一张卡 = 当前课次
  let raf = null;
  const sync = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      if (locked) return;
      const line = 140;
      let cur = cards[0];
      for (const c of cards) if (c.getBoundingClientRect().top <= line) cur = c;
      setActive(Number(cur.id.replace("pw-", "")));
    });
  };
  window.addEventListener("scroll", sync, { passive: true });
  sync();

  // 点击路径图节点 → 右侧显示该小节详情
  const gbox = $("#pw-graph");
  if (gbox) {
    gbox.addEventListener("click", (e) => {
      const g = e.target.closest(".pw-dot");
      if (!g) return;
      renderPathwayDetail(g.dataset.sec);
      setActive(sec2session[g.dataset.sec]);
    });
    gbox.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const g = e.target.closest(".pw-dot");
      if (!g) return;
      e.preventDefault();
      renderPathwayDetail(g.dataset.sec);
    });
  }

  // 点击左栏课次行 → 右侧显示该次课详情（要点 / 活动 / 作业 / 依赖）
  $("#pw-list").addEventListener("click", (e) => {
    const row = e.target.closest(".pw-sess");
    if (!row) return;
    const no = Number(row.dataset.no);
    renderPathwayDetail(null, no);
    setActive(no);
  });

  setActive(PATHWAY[0].no);
}

/* =============================================================
 * 6. 常见误区对照
 * ============================================================= */
export function renderPitfalls(host = $("#pf-list")) {
  if (!host) return;
  host.innerHTML = PITFALLS.map((g) => {
    const c = CH[g.ch];
    return `<div class="pf-group" style="--ac:${c.accent}">
      <div class="pf-cap">第 ${c.num} 章 · ${c.title}</div>
      ${g.items.map((p) => `
        <div class="pf-row">
          <div class="pf-box bad">
            <span class="pf-tag">✗ ${T("study.bad", "常见错误")}</span>
            <p>${tL(p.bad)}</p>
          </div>
          <div class="pf-arrow">→</div>
          <div class="pf-box good">
            <span class="pf-tag">✓ ${T("study.good", "正确做法")}</span>
            <p>${tL(p.good)}</p>
          </div>
          <div class="pf-why">
            <b>${T("study.why", "为什么")}：</b>${tL(p.why)}
            <a class="pf-link" href="${secHref(c.num, p.sec)}">${T("study.goto", "看这一节")} ${p.sec} →</a>
          </div>
        </div>`).join("")}
    </div>`;
  }).join("");
}

/* =============================================================
 * 7. 术语速查表（搜索 + 按章筛选）
 * ============================================================= */
let glState = { q: "", ch: 0 };

export function renderGlossary() {
  const list = $("#gl-list");
  const filters = $("#gl-filters");
  if (!list) return;

  filters.innerHTML = [`<button type="button" class="gl-f ${glState.ch === 0 ? "on" : ""}" data-ch="0">${T("study.glossary.all", "全部")}</button>`]
    .concat(CHAPTERS.map((c) =>
      `<button type="button" class="gl-f ${glState.ch === c.num ? "on" : ""}" data-ch="${c.num}">${String(c.num).padStart(2, "0")} ${c.title}</button>`))
    .join("");

  const flat = GLOSSARY.flatMap((g) => g.items.map((it) => ({ ch: g.ch, ...it })));
  const q = glState.q.trim().toLowerCase();
  const hit = flat.filter((it) => {
    if (glState.ch && it.ch !== glState.ch) return false;
    if (!q) return true;
    return `${tL(it.term)} ${it.term.en} ${tL(it.desc)}`.toLowerCase().includes(q);
  });

  $("#gl-count").textContent = T("study.glossary.count", "共 {n} 条术语", { n: hit.length });

  list.innerHTML = hit.length
    ? hit.map((it) => {
        const c = CH[it.ch];
        return `<details class="gl-item" style="--ac:${c.accent}">
          <summary>
            <span class="gl-ch">${it.ch}</span>
            <b class="gl-term">${tL(it.term)}</b>
            <span class="gl-en">${it.term.en}</span>
            <span class="gl-plus">+</span>
          </summary>
          <div class="gl-desc">
            <p>${tL(it.desc)}</p>
            <a href="${secHref(it.ch, it.sec)}">${T("study.goto", "看这一节")} ${it.sec} →</a>
          </div>
        </details>`;
      }).join("")
    : `<p class="gl-empty">${T("study.glossary.empty", "没有匹配的术语")}</p>`;

  filters.onclick = (e) => {
    const b = e.target.closest(".gl-f");
    if (!b) return;
    glState.ch = Number(b.dataset.ch);
    renderGlossary();
  };
}

export function initGlossarySearch() {
  const input = $("#gl-search");
  if (!input) return;
  input.addEventListener("input", () => {
    glState.q = input.value;
    renderGlossary();
  });
}

/* =============================================================
 * 8. 课堂自测题（即时判分）
 * ============================================================= */
export function renderQuiz() {
  const list = $("#qz-list");
  if (!list) return;

  list.innerHTML = QUIZ.map((g) => {
    const c = CH[g.ch];
    return `<div class="qz-group" style="--ac:${c.accent}">
      <div class="qz-cap">第 ${c.num} 章 · ${c.title}</div>
      ${g.items.map((q, i) => `
        <div class="qz-item" data-ans="${q.a}" data-sec="${q.sec}" data-ch="${c.num}">
          <p class="qz-q"><span class="qz-idx">Q${i + 1}</span>${tL(q.q)}</p>
          <div class="qz-options">
            ${q.options.map((o, k) =>
              `<button type="button" class="qz-opt" data-k="${k}"><span class="qz-key">${"ABCD"[k]}</span>${tL(o)}</button>`).join("")}
          </div>
          <div class="qz-fb" hidden></div>
        </div>`).join("")}
    </div>`;
  }).join("");

  list.onclick = (e) => {
    const btn = e.target.closest(".qz-opt");
    if (!btn) return;
    const item = btn.closest(".qz-item");
    const pick = Number(btn.dataset.k);
    const ans = Number(item.dataset.ans);
    const ok = pick === ans;
    item.dataset.done = "1";
    $$(".qz-opt", item).forEach((b) => {
      b.disabled = true;
      b.classList.toggle("picked", Number(b.dataset.k) === pick);
      b.classList.toggle("right", Number(b.dataset.k) === ans);
    });
    const q = QUIZ.find((g) => g.ch === Number(item.dataset.ch))
      .items.find((x) => x.sec === item.dataset.sec);
    const fb = $(".qz-fb", item);
    fb.hidden = false;
    fb.className = `qz-fb ${ok ? "ok" : "no"}`;
    fb.innerHTML = `
      <span class="qz-verdict">${ok ? T("study.quiz.correct", "✓ 答对了") : T("study.quiz.wrong", "✗ 再想想")}</span>
      ${ok ? "" : `<span class="qz-ans">${T("study.quiz.answer", "正确答案")}：${"ABCD"[ans]}. ${tL(q.options[ans])}</span>`}
      <span class="qz-exp">${tL(q.exp)}</span>
      <a class="qz-link" href="${secHref(Number(item.dataset.ch), item.dataset.sec)}">${T("study.goto", "看这一节")} ${item.dataset.sec} →</a>`;
    updateQuizProgress();
  };

  $("#qz-reset").onclick = () => renderQuiz();
  updateQuizProgress();
}

function updateQuizProgress() {
  const items = $$(".qz-item");
  const done = items.filter((i) => i.dataset.done === "1");
  const correct = items.filter((i) => {
    const picked = $(".qz-opt.picked", i);
    return picked && Number(picked.dataset.k) === Number(i.dataset.ans);
  });
  $("#qz-progress").textContent = T("study.quiz.progress", "已答 {n} / {total} · 正确 {c}", {
    n: done.length, total: items.length, c: correct.length,
  });
}

/* =============================================================
 * 5. 阅读辅助条（目录 / 字号 / 回顶）
 * ============================================================= */
export function initReaderBar() {
  const bar = document.createElement("div");
  bar.className = "reader-bar";
  bar.id = "reader-bar";
  bar.innerHTML = `
    <button type="button" data-act="toc"  title="课程目录（快捷键 O）">📑 目录</button>
    <span class="tb-sep"></span>
    <button type="button" data-act="zoom" title="放大字号（快捷键 +）">A+</button>
    <button type="button" data-act="zoomout" title="缩小字号（快捷键 -）">A-</button>
    <span class="tb-sep"></span>
    <button type="button" data-act="top" title="回到顶部">↑</button>`;
  document.body.appendChild(bar);
  requestAnimationFrame(() => bar.classList.add("show"));

  bar.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (b) ACTIONS[b.dataset.act]?.();
  });
}

export const ACTIONS = {
  toc()     { toggleToc(); },
  zoom()    { bumpFont(1); },
  zoomout() { bumpFont(-1); },
  top()     { window.scrollTo({ top: 0, behavior: "smooth" }); },
};

/* 字号缩放：投影或大屏阅读时提高正文可读性 */
function bumpFont(dir) {
  const cur = parseFloat(getComputedStyle(document.body).fontSize) || 16;
  const next = Math.min(26, Math.max(14, cur + dir * 1.5));
  document.body.style.fontSize = `${next}px`;
}

/* 目录抽屉开合（含遮罩） */
function toggleToc(force) {
  const drawer = $("#toc-drawer");
  const mask = $("#toc-mask");
  if (!drawer) return;
  const open = typeof force === "boolean" ? force : !drawer.classList.contains("open");
  drawer.classList.toggle("open", open);
  mask?.classList.toggle("open", open);
}

/* =============================================================
 * 6. 目录抽屉（全站导航，章节页也可用）
 * ============================================================= */
export function initTocDrawer() {
  const drawer = document.createElement("aside");
  drawer.className = "toc-drawer";
  drawer.id = "toc-drawer";
  drawer.innerHTML = `
    <div class="toc-head">
      <b>📑 课程目录</b>
      <button type="button" class="toc-close" aria-label="关闭">✕</button>
    </div>
    <div class="toc-body">
      ${CHAPTERS.map((c) => `
        <div class="toc-ch" style="--ac:${c.accent}">
          <a class="toc-ch-title" href="${c.href}"><span>${c.icon}</span> 第${c.num}章 ${c.title}</a>
          <ul>
            ${c.sections.map((s) => `
              <li><a href="${c.href}#ch-${s.id}">${s.id} ${s.title}</a></li>`).join("")}
          </ul>
        </div>`).join("")}
    </div>`;
  document.body.appendChild(drawer);

  const mask = document.createElement("div");
  mask.className = "toc-mask";
  mask.id = "toc-mask";
  document.body.appendChild(mask);
  mask.addEventListener("click", () => toggleToc(false));

  drawer.addEventListener("click", (e) => {
    if (e.target.closest(".toc-close")) { toggleToc(false); return; }
    // 点击小节后自动收起，方便直接阅读
    if (e.target.closest("a[href*='#ch-']")) toggleToc(false);
  });
}

/* =============================================================
 * 7. 快捷键
 * ============================================================= */
export function initHotkeys() {
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    const k = e.key.toLowerCase();
    if (k === "o") ACTIONS.toc();
    else if (k === "+" || k === "=") { e.preventDefault(); bumpFont(1); }
    else if (k === "-" || k === "_") { e.preventDefault(); bumpFont(-1); }
    else if (k === "escape") $("#toc-drawer")?.classList.remove("open");
  });
}

/* =============================================================
 * 9. 启动
 * ============================================================= */
export function boot() {
  // 各页面按需渲染：容器存在才渲染对应模块
  if ($("#chapter-cards")) renderChapterCards();   // 首页课程入口
  if ($("#pf-list")) renderPitfalls();             // 误区对照页
  if ($("#gl-list")) { renderGlossary(); initGlossarySearch(); } // 术语页
  
  if ($("#pw-list")) renderPathway();                // 学习路径页
  if ($("#qz-list")) renderQuiz();                 // 自测页
  if ($("#viz-dikw")) renderGallery();              // 概念可视化页
  if ($("#course-graph")) requestAnimationFrame(() => renderGraph()); // 图谱页

  // 章节页：阅读辅助条 + 目录抽屉 + 快捷键
  if ($(".chapter")) {
    initReaderBar();
    initTocDrawer();
    initHotkeys();
  }

  // 语言切换后重渲染带双语内容的模块
  document.addEventListener("wbl:localechange", () => {
    if ($("#pf-list")) renderPitfalls();
    if ($("#gl-list")) renderGlossary();

    if ($("#pw-list")) renderPathway();
    if ($("#qz-list")) renderQuiz();
    $$(".viz-cover-btn").forEach((b) => (b.textContent = `▶ ${T("study.figure.show", "点击查看图形")}`));
  });

  // 窗口尺寸变化时重排图谱
  let rt = null;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if ($("#course-graph")) renderGraph();
    }, 260);
  });
}

if (typeof window !== "undefined" && !window.__VIS_BOOTED__) {
  window.__VIS_BOOTED__ = true;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // 嵌入课程门户 iframe 时，向父页面上报内容高度，供外层自适应撑开、整页滚动
  if (window.parent && window.parent !== window) {
    const reportHeight = () => {
      try {
        // 用 body 自身盒子高度，不受 iframe 视口影响，避免"撑大视口→高度变大"的循环
        const h = document.body
          ? Math.round(document.body.getBoundingClientRect().height)
          : document.documentElement.scrollHeight;
        window.parent.postMessage({ type: "lesson-height", height: h }, "*");
      } catch { /* ignore */ }
    };
    reportHeight();
    window.addEventListener("load", reportHeight);
    window.addEventListener("resize", reportHeight);
    if ("ResizeObserver" in window && document.body) new ResizeObserver(reportHeight).observe(document.body);
    setTimeout(reportHeight, 600);
    setTimeout(reportHeight, 1800);
  }
}

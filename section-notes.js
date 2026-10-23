// =============================================================
// section-notes.js — 27 个小节的简略内容
// 供学习路径图点击节点后在右侧详情面板展示：一句话概述 + 2 条要点。
// 文案中英双语，由 study-tools.js 的 t() 取用。
// =============================================================

export const SECTION_NOTES = {
  /* ---------- 第 1 章 数据 ---------- */
  "1-1": {
    brief: { zh: "可视化的起点：先解决“数据从哪来”，再谈怎么画。", en: "Where visualization starts: get the data first, then draw it." },
    points: [
      { zh: "三种造数据方式：CSV 文件、JSON 数组、AI 合成", en: "Three sources: CSV files, JSON arrays, AI synthesis" },
      { zh: "拿到数据先盘字段：每个字段叫什么、是什么类型", en: "Inventory the fields: name and type of each column" },
    ],
  },
  "1-2": {
    brief: { zh: "DIKW 金字塔：数据加上语境才成为信息。", en: "DIKW pyramid: data becomes information once it has context." },
    points: [
      { zh: "数据 → 信息 → 知识 → 智慧，逐级抽象", en: "Data → information → knowledge → wisdom, increasing abstraction" },
      { zh: "同一组数字在不同语境下可以讲出完全不同的故事", en: "The same numbers tell different stories in different contexts" },
    ],
  },
  "1-3": {
    brief: { zh: "数据属性决定“能算什么、能用什么通道编码”。", en: "Data attributes decide what you can compute and how you can encode." },
    points: [
      { zh: "Stevens 四尺度：定类 / 定序 / 定距 / 定比", en: "Stevens' four scales: nominal / ordinal / interval / ratio" },
      { zh: "Mackinlay 通道排序：位置 > 长度 > 角度 > 面积 > 色深 > 色相", en: "Mackinlay ranking: position > length > angle > area > color" },
    ],
  },
  "1-4": {
    brief: { zh: "用函数式操作把原数据整理成“能画图的表”。", en: "Functional operations turn raw data into a drawable table." },
    points: [
      { zh: "D3 的数组工具：map / filter / rollup / group / extent", en: "D3 array tools: map, filter, rollup, group, extent" },
      { zh: "聚合要守恒：分组后合计应与总数一致", en: "Aggregation must be conservative: group totals should match" },
    ],
  },
  "1-5": {
    brief: { zh: "Data-Join：让 DOM 节点跟着数据增减。", en: "Data-Join: DOM nodes follow the data as it grows or shrinks." },
    points: [
      { zh: "三态：enter（新增）/ update（更新）/ exit（移除）", en: "Three states: enter / update / exit" },
      { zh: "selection.join() 一行替代旧式三态写法", en: "selection.join() replaces the old three-state boilerplate" },
    ],
  },

  /* ---------- 第 2 章 数据可视化流程 ---------- */
  "2-1": {
    brief: { zh: "Card 数据流模型：可视化的标准流水线。", en: "Card's data flow model: the standard visualization pipeline." },
    points: [
      { zh: "原始值 → 数据表 → 视觉结构 → 视图", en: "Raw values → data tables → visual structures → views" },
      { zh: "每个阶段都要可逆，出问题能回溯到上一环", en: "Each stage should be traceable back to its source" },
    ],
  },
  "2-2": {
    brief: { zh: "把原始记录规整成结构化数据表。", en: "Tidy raw records into a structured data table." },
    points: [
      { zh: "d3.rollup 做分组聚合，输出嵌套 Map", en: "d3.rollup groups and aggregates into nested Maps" },
      { zh: "处理缺失值与异常值，避免图表被极端值带偏", en: "Handle missing and outlier values before plotting" },
    ],
  },
  "2-3": {
    brief: { zh: "视觉映射：给数据分配位置、长度、颜色等通道。", en: "Visual mapping: assign position, length, color channels to data." },
    points: [
      { zh: "Reingold-Tilford 树布局：分层递归放置节点", en: "Reingold-Tilford tree layout places nodes hierarchically" },
      { zh: "通道必须匹配尺度：定序用有序色，定比用长度/位置", en: "Channel must match scale: ordinal→sequential color, ratio→length" },
    ],
  },
  "2-4": {
    brief: { zh: "视图渲染与交互：让图能看、能点、能筛选。", en: "Rendering and interaction: make charts clickable and filterable." },
    points: [
      { zh: "事件委托：大量图形只在父容器绑一次监听", en: "Event delegation: one listener on the parent for many marks" },
      { zh: "过渡动画 200–400ms，过长反而拖慢阅读", en: "Keep transitions at 200–400ms; longer ones slow reading" },
    ],
  },

  /* ---------- 第 3 章 色彩专题 ---------- */
  "3-1": {
    brief: { zh: "颜色模型：RGB 给设备、HSV 直觉、Lab 才感知均匀。", en: "Color models: RGB for devices, HSV intuitive, Lab uniform." },
    points: [
      { zh: "HSV 的“亮度”不等于人眼感知的亮度", en: "HSV lightness is not perceived lightness" },
      { zh: "CVD 模拟：红绿混淆是最常见的色彩障碍", en: "CVD simulation: red-green confusion is the most common deficiency" },
    ],
  },
  "3-2": {
    brief: { zh: "colormap 三类：顺序型 / 发散型 / 定性型。", en: "Three colormap families: sequential / diverging / qualitative." },
    points: [
      { zh: "先判断数据性质，再选配色方案类别", en: "Judge the data first, then pick the colormap family" },
      { zh: "彩虹色 jet 制造虚假边界，是论文返修重灾区", en: "Rainbow jet creates false boundaries — a top revision reason" },
    ],
  },
  "3-3": {
    brief: { zh: "CIE Lab 色域：在感知均匀空间里取色。", en: "CIE Lab gamut: sample colors in a perceptually uniform space." },
    points: [
      { zh: "Lab 中等距的两点，看起来色差也等距", en: "Equal Lab distance means equal perceived difference" },
      { zh: "亮度 L* 单独成通道，适合做顺序配色", en: "Lightness L* alone makes a good sequential scale" },
    ],
  },
  "3-4": {
    brief: { zh: "色系搭配五类：单色 / 类比 / 互补 / 分裂互补 / 三等分。", en: "Five harmonies: mono / analogous / complementary / split / triadic." },
    points: [
      { zh: "分类数超过 8 就该换编码通道，而不是继续加颜色", en: "Beyond 8 categories, switch channel instead of adding colors" },
      { zh: "互补色对比强，适合强调；类比色柔和，适合分组", en: "Complementary pops for emphasis; analogous is calm for groups" },
    ],
  },
  "3-5": {
    brief: { zh: "科研经典配色：Wong / Okabe-Ito / Paul Tol。", en: "Classic scientific palettes: Wong / Okabe-Ito / Paul Tol." },
    points: [
      { zh: "这些配色对色觉障碍友好，顶刊常见", en: "These palettes are CVD-friendly and common in top journals" },
      { zh: "引用配色时注明来源，便于复现", en: "Cite the palette source so others can reproduce it" },
    ],
  },
  "3-6": {
    brief: { zh: "对错案例对比：从翻车图里学配色原则。", en: "Bad vs good cases: learn color rules from flawed figures." },
    points: [
      { zh: "判错三件事：彩虹色、语义错位、CVD 不可分", en: "Diagnose: rainbow, semantics mismatch, CVD confusion" },
      { zh: "发散型必须有明确中点（零值 / 均值）", en: "Diverging schemes need a meaningful midpoint" },
    ],
  },
  "3-7": {
    brief: { zh: "配色生成器：先定风格，再批量产出。", en: "Palette generator: pick a style, then generate variants." },
    points: [
      { zh: "鲜艳风格适合投屏，低饱和适合论文印刷", en: "Vivid suits projection; muted suits print" },
      { zh: "生成后必须回到 Lab 检查亮度是否单调", en: "After generating, check Lab lightness monotonicity" },
    ],
  },
  "3-8": {
    brief: { zh: "CVD 论文图测：出图前的最后一道关。", en: "CVD figure check: the last gate before publishing." },
    points: [
      { zh: "三种色觉障碍模拟：红绿色盲 / 绿色盲 / 蓝色盲", en: "Three simulations: protanopia, deuteranopia, tritanopia" },
      { zh: "灰度打印测试：去掉颜色还能不能读懂", en: "Grayscale test: is the figure still readable without color" },
    ],
  },

  /* ---------- 第 4 章 低维数据可视化 ---------- */
  "4-1": {
    brief: { zh: "三层坐标变换：数据 → 归一化 → 屏幕。", en: "Three coordinate layers: data → normalized → screen." },
    points: [
      { zh: "标尺三要素：domain 输入域、range 输出域、是否 clamp", en: "Scale essentials: domain, range, clamp" },
      { zh: "别把像素坐标写死，换尺寸就崩", en: "Never hard-code pixel coordinates" },
    ],
  },
  "4-2": {
    brief: { zh: "坐标轴：图表的“标尺”，起点决定结论。", en: "Axes: the chart's ruler — the baseline decides the conclusion." },
    points: [
      { zh: "条形图必须从 0 起；折线图不必", en: "Bar charts must start at zero; line charts need not" },
      { zh: "刻度数量适中：太密读不出，太疏看不清趋势", en: "Keep tick count moderate: neither cluttered nor too sparse" },
    ],
  },
  "4-3": {
    brief: { zh: "曲线拟合：在噪声里找趋势。", en: "Curve fitting: find the trend in the noise." },
    points: [
      { zh: "拟合不是越复杂越好，看残差与可解释性", en: "Complexity isn't better — check residuals and explainability" },
      { zh: "线性 / 二次 / 指数 / LOESS 各有适用场景", en: "Linear, quadratic, exponential, LOESS each have their place" },
    ],
  },
  "4-4": {
    brief: { zh: "45° 黄金角：Cleveland 的感知发现。", en: "The 45° golden angle: Cleveland's perceptual finding." },
    points: [
      { zh: "人眼对接近 45° 的斜率最敏感、判断最准", en: "The eye judges slopes near 45° most accurately" },
      { zh: "调整宽高比（banking）让关键趋势落在 45° 附近", en: "Bank the aspect ratio so key trends land near 45°" },
    ],
  },
  "4-5": {
    brief: { zh: "Marching Squares：在网格上画等值线。", en: "Marching Squares: draw contours on a grid." },
    points: [
      { zh: "逐格比较四角与阈值，16 种情形查表取边", en: "Compare four corners to the threshold; 16 cases map to edges" },
      { zh: "鞍点有二义性，要用中心值消歧", en: "Saddle cases are ambiguous — resolve with the center value" },
    ],
  },

  /* ---------- 第 5 章 时序数据可视化 ---------- */
  "5-1": {
    brief: { zh: "时间的五个属性决定该用什么图。", en: "Five time attributes decide which chart to use." },
    points: [
      { zh: "有序、周期性、层次、连续/离散、跨度", en: "Ordered, cyclic, hierarchical, continuous/discrete, span" },
      { zh: "先看尺度：秒级走势和十年趋势不该用同一张图", en: "Mind the scale: seconds and decades don't share a chart" },
    ],
  },
  "5-2": {
    brief: { zh: "标准时间可视化：折线图与它的标注。", en: "Standard time view: the line chart and its annotations." },
    points: [
      { zh: "折线负责趋势，异常点要额外标注", en: "Lines show trends; annotate anomalies explicitly" },
      { zh: "重采样能改变结论，要说明采样粒度", en: "Resampling changes conclusions — state the granularity" },
    ],
  },
  "5-3": {
    brief: { zh: "van Wijk 日历热图：把长周期折进一屏。", en: "van Wijk calendar heatmap: fold a long span into one screen." },
    points: [
      { zh: "二维折叠布局：行是周、列是月/年", en: "2D fold: rows are weeks, columns are months/years" },
      { zh: "配发散色必须有明确基准日", en: "Diverging color needs a clear baseline day" },
    ],
  },
  "5-4": {
    brief: { zh: "周期时间可视化：阿基米德螺旋日历。", en: "Cyclic time views: the Archimedean spiral calendar." },
    points: [
      { zh: "螺旋适合循环数据，首尾不要强行接合", en: "Spirals suit cyclic data; don't force the ends to meet" },
      { zh: "半径方向可叠加第二变量（如强度）", en: "The radial axis can carry a second variable such as intensity" },
    ],
  },
  "5-5": {
    brief: { zh: "Storyline：用线条聚散讲多角色的故事。", en: "Storylines: line convergence tells multi-character stories." },
    points: [
      { zh: "布局目标：减少交叉、保持线条顺序稳定", en: "Layout goals: fewer crossings, stable line ordering" },
      { zh: "案例：《侏罗纪公园》角色关系随时间变化", en: "Case study: Jurassic Park character relationships over time" },
    ],
  },
};

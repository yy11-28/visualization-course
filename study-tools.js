// =============================================================
// study-tools.js — 学习辅助内容数据源
// 为首页的「常见误区 / 术语速查 / 课堂自测」提供内容
// 每条都绑定具体小节编号，可直接跳到对应正文；文案中英双语。
// =============================================================

/* 取当前语言字段：i18n 会设置 <html lang> */
export const t = (f) => (
  (document.documentElement.lang || "zh").toLowerCase().startsWith("en") ? f.en : f.zh
);

/* ---------- 2. 常见误区对照 ---------- */
export const PITFALLS = [
  {
    ch: 1,
    items: [
      {
        sec: "1-3",
        bad: { zh: "把「满意度：很不满意/一般/很满意」当成数字 1/2/3 求平均值", en: "Averaging an ordinal scale (bad/neutral/good as 1/2/3) as if it were numeric." },
        good: { zh: "定序数据用堆叠条形图或百分比展示分布，不做算术平均", en: "Show ordinal data as stacked bars or percentages; don't take arithmetic means." },
        why: { zh: "定序只有顺序、没有等距，「平均」出来的数没有意义", en: "Ordinal has order but no equal spacing, so the mean is meaningless." },
      },
      {
        sec: "1-3",
        bad: { zh: "用颜色深浅（面积/亮度）来比较数值大小", en: "Comparing magnitudes with color shade (area/brightness)." },
        good: { zh: "用位置或长度编码：同一坐标轴上的条形/点，读者判断更准", en: "Encode with position or length — bars/dots on a shared axis are judged far more accurately." },
        why: { zh: "Mackinlay 排序中位置精度约为面积/颜色的 3～5 倍", en: "In Mackinlay's ranking, position is roughly 3–5× more accurate than area or color." },
      },
    ],
  },
  {
    ch: 2,
    items: [
      {
        sec: "2-1",
        bad: { zh: "先挑一张好看的图，再把数据塞进去", en: "Pick a pretty chart first, then force the data into it." },
        good: { zh: "先定任务（比较 / 分布 / 构成 / 关系 / 时序），再选图", en: "Define the task first (compare / distribute / compose / relate / trend), then pick the chart." },
        why: { zh: "Card 模型的第二步是「确定要表达什么」，图只是最终载体", en: "Card's pipeline fixes intent before form; the chart is only the final carrier." },
      },
      {
        sec: "2-2",
        bad: { zh: "把全部原始记录直接画出来（几万点糊成一片）", en: "Plot every raw record — tens of thousands of points turn into mush." },
        good: { zh: "先做聚合或采样：d3.rollup 分组统计，再画汇总结果", en: "Aggregate or sample first: group with d3.rollup, then plot the summary." },
        why: { zh: "可视化传达的是结构，不是行数；变换环节就是为此存在的", en: "Visualization conveys structure, not row count — that is what the transform stage is for." },
      },
    ],
  },
  {
    ch: 3,
    items: [
      {
        sec: "3-5",
        bad: { zh: "用彩虹色 jet 表示连续数值（温度、 elevation、相关系数）", en: "Use the rainbow (jet) colormap for continuous values (temperature, elevation, correlation)." },
        good: { zh: "顺序型用单一色相的明暗渐变（如 Blues / viridis）；有中点时用发散型", en: "Use single-hue lightness ramps (Blues, viridis) for sequential data; diverging ramps when there is a midpoint." },
        why: { zh: "jet 的明暗不单调，会在本该平滑的地方制造虚假边界", en: "Jet's lightness is non-monotonic, creating false boundaries where data is smooth." },
      },
      {
        sec: "3-6",
        bad: { zh: "给类别数据（城市、品种）套一个连续渐变色", en: "Apply a continuous gradient to categorical data (cities, species)." },
        good: { zh: "类别用定性配色（Wong / Okabe-Ito），色相互相区分、明度接近", en: "Use qualitative palettes (Wong / Okabe-Ito) with distinct hues and similar lightness." },
        why: { zh: "渐变暗示「有大小顺序」，而类别之间没有顺序", en: "A gradient implies magnitude order, which categories do not have." },
      },
      {
        sec: "3-8",
        bad: { zh: "只在自己屏幕上确认配色好看就投稿", en: "Submit figures after checking colors only on your own screen." },
        good: { zh: "用 CVD 模拟器切换红/绿色盲复检，或直接用 CVD 安全配色", en: "Re-check with a CVD simulator (protan/deutan), or use CVD-safe palettes outright." },
        why: { zh: "约 8% 的男性读者看到的图与你看到的不一样", en: "Roughly 8% of male readers see your figure differently." },
      },
    ],
  },
  {
    ch: 4,
    items: [
      {
        sec: "4-2",
        bad: { zh: "条形图把纵轴截断（如从 90 起）来「放大差异」", en: "Truncate the bar chart's axis (e.g. start at 90) to 'amplify' differences." },
        good: { zh: "条形图纵轴必须从 0 开始；想看细节就换折线图或加数据表", en: "Bar charts must start at zero; switch to a line chart or add a table for fine detail." },
        why: { zh: "条形用长度编码，截断后长度比例失真，等于误导读者", en: "Bars encode by length; truncating distorts the ratio and misleads readers." },
      },
      {
        sec: "4-3",
        bad: { zh: "只画一条平滑拟合曲线，把原始数据点隐去", en: "Show only a smooth fitted curve and hide the raw points." },
        good: { zh: "先画散点，再叠加拟合线，并标注拟合方式与置信区间", en: "Draw the scatter first, overlay the fit, and label the model and confidence band." },
        why: { zh: "拟合会掩盖离群点和数据的真实密度，读者无法判断可信度", en: "Fitting hides outliers and true density, so readers cannot judge reliability." },
      },
    ],
  },
  {
    ch: 5,
    items: [
      {
        sec: "5-1",
        bad: { zh: "时间轴按「第 1 个、第 2 个…记录」等距排列", en: "Lay out the time axis by record index (1st, 2nd, …) at equal spacing." },
        good: { zh: "使用时间尺度（d3.scaleTime），缺失的日期如实留下空白", en: "Use a time scale (d3.scaleTime) and leave honest gaps for missing dates." },
        why: { zh: "类别尺度会让「采样密集的时段」看起来被压缩，趋势失真", en: "A categorical scale compresses densely sampled periods and distorts the trend." },
      },
      {
        sec: "5-3",
        bad: { zh: "几年的日数据全塞进一条折线里", en: "Squeeze years of daily data into a single line." },
        good: { zh: "按周期拆分：日历热图看「哪天/哪月高」，螺旋看周期叠加趋势", en: "Split by cycle: calendar heatmaps for 'which day/month', spirals for cycle plus trend." },
        why: { zh: "长时序的主要矛盾往往是周期性，折线图会把周期压平", en: "Long series are dominated by cycles, which a single flattened line hides." },
      },
    ],
  },
];

/* ---------- 3. 术语速查表 ---------- */
export const GLOSSARY = [
  {
    ch: 1,
    items: [
      { term: { zh: "DIKW 金字塔", en: "DIKW Pyramid" }, sec: "1-2", desc: { zh: "数据(Data) → 信息(Information) → 知识(Knowledge) → 智慧(Wisdom) 的层级模型，上一层依赖下一层的质量。", en: "A hierarchy Data → Information → Knowledge → Wisdom; each level depends on the quality of the one below." } },
      { term: { zh: "Stevens 测量尺度", en: "Stevens' Scales" }, sec: "1-3", desc: { zh: "定类(Nominal)、定序(Ordinal)、定距(Interval)、定比(Ratio) 四类，尺度越高允许的运算与图表越多。", en: "Nominal, ordinal, interval, ratio — higher scales permit more operations and chart types." } },
      { term: { zh: "视觉通道", en: "Visual Channel" }, sec: "1-3", desc: { zh: "用来编码数据的视觉属性：位置、长度、角度、面积、亮度、色相、形状等。", en: "Visual properties used to encode data: position, length, angle, area, brightness, hue, shape." } },
      { term: { zh: "Mackinlay 排序", en: "Mackinlay Ranking" }, sec: "1-3", desc: { zh: "不同视觉通道的表达精度排序：位置最高、色相最低，是选编码方式的第一依据。", en: "Accuracy ranking of visual channels — position highest, hue lowest; the first guide when choosing encodings." } },
      { term: { zh: "Data-Join", en: "Data Join" }, sec: "1-5", desc: { zh: "D3 把数据数组与 DOM 元素绑定的机制，产生 enter(新增)/update(更新)/exit(移除) 三种状态。", en: "D3 binds data arrays to DOM elements, yielding enter / update / exit states." } },
    ],
  },
  {
    ch: 2,
    items: [
      { term: { zh: "Card 数据流模型", en: "Card's Pipeline" }, sec: "2-1", desc: { zh: "原始数据 → 数据表 → 视觉结构 → 视图 的四步模型，每步都能反向迭代。", en: "Raw data → data table → visual structure → view; every step can be iterated backwards." } },
      { term: { zh: "数据变换", en: "Data Transformation" }, sec: "2-2", desc: { zh: "把原始数据整理成可视化可直接使用的表：过滤、聚合、归一化、派生字段。", en: "Reshape raw data into a plotting-ready table: filter, aggregate, normalize, derive." } },
      { term: { zh: "视觉映射", en: "Visual Mapping" }, sec: "2-3", desc: { zh: "把数据字段绑定到视觉通道的过程，决定读者看到什么。", en: "Binding data fields to visual channels — it decides what the reader actually perceives." } },
      { term: { zh: "反向迭代", en: "Loop Back" }, sec: "2-4", desc: { zh: "看到视图不对时，沿流程往回找到出错的那一步并修正。", en: "When the view looks wrong, walk the pipeline backwards to find and fix the faulty step." } },
      { term: { zh: "Reingold-Tilford 布局", en: "Reingold-Tilford Layout" }, sec: "2-3", desc: { zh: "分层递归计算树节点坐标的经典算法，d3.tree() 即基于此。", en: "Classic recursive algorithm for tidy tree layouts; d3.tree() is based on it." } },
    ],
  },
  {
    ch: 3,
    items: [
      { term: { zh: "顺序型 colormap", en: "Sequential Colormap" }, sec: "3-2", desc: { zh: "单一色相由浅到深（或多色渐变但明暗单调），用于有大小顺序的数值。", en: "Single-hue lightness ramp (or monotonic multi-hue) for ordered magnitudes." } },
      { term: { zh: "发散型 colormap", en: "Diverging Colormap" }, sec: "3-2", desc: { zh: "两端两种色相、中间中性色，用于有 meaningful 中点的数据（如 ±异常）。", en: "Two hues at the ends with a neutral midpoint, for data with a meaningful center (e.g. ± anomalies)." } },
      { term: { zh: "定性型 colormap", en: "Qualitative Colormap" }, sec: "3-2", desc: { zh: "色相互相区分、明度接近，用于没有顺序的类别。", en: "Distinct hues with similar lightness, for unordered categories." } },
      { term: { zh: "CIE Lab", en: "CIE Lab" }, sec: "3-3", desc: { zh: "接近感知均匀的颜色空间：L 明度、a/b 色度，适合做颜色插值与配色评估。", en: "A near-perceptually-uniform space: L lightness, a/b chroma — ideal for interpolation and evaluation." } },
      { term: { zh: "色觉障碍 (CVD)", en: "Color Vision Deficiency" }, sec: "3-8", desc: { zh: "红绿色盲等辨色能力差异，约影响 8% 的男性；科研图需做 CVD 安全检验。", en: "Color perception differences such as protan/deutan; affects ~8% of men, so figures need CVD checks." } },
    ],
  },
  {
    ch: 4,
    items: [
      { term: { zh: "比例尺 scale", en: "Scale" }, sec: "4-2", desc: { zh: "把数据域(domain) 映射到值域(range) 的函数，是 d3 的核心抽象。", en: "A function mapping domain to range — the core d3 abstraction." } },
      { term: { zh: "曲线拟合", en: "Curve Fitting" }, sec: "4-3", desc: { zh: "用函数近似数据趋势（线性/多项式/指数/对数等），需配合散点一起展示。", en: "Approximating trends with functions (linear, polynomial, exponential, log); show with the scatter." } },
      { term: { zh: "45° 黄金角", en: "45° Banking" }, sec: "4-4", desc: { zh: "Cleveland 提出：把图形的平均斜率调整到 45° 附近，人眼判断最准。", en: "Cleveland: bank the average slope to ~45° where slope judgments are most accurate." } },
      { term: { zh: "等值线 / Marching Squares", en: "Contour / Marching Squares" }, sec: "4-5", desc: { zh: "在网格单元上按 16 种拓扑情况连接等值点，得到连续等值线。", en: "Connect equal-value points per grid cell across 16 topological cases to build contours." } },
    ],
  },
  {
    ch: 5,
    items: [
      { term: { zh: "时间粒度", en: "Temporal Granularity" }, sec: "5-1", desc: { zh: "数据的采样单位（秒/天/月/年），决定能看到多细的规律。", en: "Sampling unit (second/day/month/year) that bounds how fine a pattern you can see." } },
      { term: { zh: "周期性", en: "Cyclicity" }, sec: "5-3", desc: { zh: "按固定周期重复的规律（日/周/季），需专门布局才能显现。", en: "Patterns repeating on a fixed cycle (daily/weekly/seasonal) that need dedicated layouts." } },
      { term: { zh: "日历热图", en: "Calendar Heatmap" }, sec: "5-3", desc: { zh: "van Wijk 提出：按年-周-日二维折叠，用颜色表示每天数值。", en: "van Wijk's layout: fold time into year-week-day cells and encode values by color." } },
      { term: { zh: "阿基米德螺旋", en: "Archimedean Spiral" }, sec: "5-4", desc: { zh: "把时间绕成螺旋：半径表示年份、角度表示年内位置，周期与趋势同时可见。", en: "Wind time into a spiral: radius for year, angle for position within the year — cycles and trend together." } },
      { term: { zh: "Storyline", en: "Storyline" }, sec: "5-5", desc: { zh: "用曲线表示多个角色随时间的聚散与并行，常用于叙事型时间线。", en: "Curves showing characters converging/diverging over time for narrative timelines." } },
    ],
  },
];

/* ---------- 4. 课堂自测题 ---------- */
export const QUIZ = [
  {
    ch: 1,
    items: [
      {
        sec: "1-3",
        q: { zh: "「满意度：很不满意 → 一般 → 很满意」属于哪种测量尺度？", en: "What scale is 'satisfaction: bad → neutral → good'?" },
        options: [
          { zh: "定类 Nominal", en: "Nominal" },
          { zh: "定序 Ordinal", en: "Ordinal" },
          { zh: "定距 Interval", en: "Interval" },
          { zh: "定比 Ratio", en: "Ratio" },
        ],
        a: 1,
        exp: { zh: "有顺序但相邻等级间距不一定相等，属于定序；不能求算术平均。", en: "Ordered but with unequal spacing: ordinal. Arithmetic means are invalid." },
      },
      {
        sec: "1-3",
        q: { zh: "要精确比较数值大小，最应该优先使用的视觉通道是？", en: "Which channel best supports precise magnitude comparison?" },
        options: [
          { zh: "位置 Position", en: "Position" },
          { zh: "面积 Area", en: "Area" },
          { zh: "色相 Hue", en: "Hue" },
          { zh: "形状 Shape", en: "Shape" },
        ],
        a: 0,
        exp: { zh: "Mackinlay 排序中位置精度最高，约为面积/颜色的 3～5 倍。", en: "Mackinlay ranks position first, roughly 3–5× more accurate than area or color." },
      },
    ],
  },
  {
    ch: 2,
    items: [
      {
        sec: "2-1",
        q: { zh: "Card 模型中「把数据表字段绑定到位置/颜色等通道」是哪一步？", en: "In Card's pipeline, binding table fields to channels like position/color is which step?" },
        options: [
          { zh: "数据变换", en: "Data transformation" },
          { zh: "视觉映射", en: "Visual mapping" },
          { zh: "视图渲染", en: "View rendering" },
          { zh: "数据采集", en: "Data acquisition" },
        ],
        a: 1,
        exp: { zh: "数据表 → 视觉结构 这一步叫视觉映射，产出「视觉结构」。", en: "Data table → visual structure is visual mapping; its output is the visual structure." },
      },
      {
        sec: "2-2",
        q: { zh: "几万条原始记录直接画散点导致糊成一片，正确做法是？", en: "Tens of thousands of raw points turn into mush. What should you do?" },
        options: [
          { zh: "换更鲜艳的颜色", en: "Use brighter colors" },
          { zh: "先聚合/采样再画", en: "Aggregate or sample first" },
          { zh: "把点画得更小", en: "Draw smaller dots" },
          { zh: "改成饼图", en: "Switch to a pie chart" },
        ],
        a: 1,
        exp: { zh: "可视化传达的是结构：先在变换环节做聚合或采样（如 d3.rollup）。", en: "Visualization conveys structure: aggregate or sample in the transform stage (e.g. d3.rollup)." },
      },
    ],
  },
  {
    ch: 3,
    items: [
      {
        sec: "3-2",
        q: { zh: "表示「温度异常：负偏离 ↔ 正偏离」，应选哪类 colormap？", en: "For temperature anomalies (negative ↔ positive), which colormap family fits?" },
        options: [
          { zh: "顺序型 Sequential", en: "Sequential" },
          { zh: "发散型 Diverging", en: "Diverging" },
          { zh: "定性型 Qualitative", en: "Qualitative" },
          { zh: "彩虹色 Rainbow", en: "Rainbow" },
        ],
        a: 1,
        exp: { zh: "存在有意义的零点（正常值），两侧分别编码负/正偏离，用发散型。", en: "There is a meaningful midpoint (normal), so encode both sides with a diverging ramp." },
      },
      {
        sec: "3-6",
        q: { zh: "给「城市 / 品种」这类类别数据配色，正确做法是？", en: "How should you color categorical data like cities or species?" },
        options: [
          { zh: "用连续渐变色", en: "Use a continuous gradient" },
          { zh: "用定性配色（色相区分、明度接近）", en: "Use a qualitative palette (distinct hues, similar lightness)" },
          { zh: "用彩虹色 jet", en: "Use the rainbow jet map" },
          { zh: "全部用同一个颜色", en: "Use one single color" },
        ],
        a: 1,
        exp: { zh: "类别无顺序，渐变会暗示大小关系；应选明度接近、色相互分的定性配色。", en: "Categories have no order; gradients imply magnitude. Use qualitative palettes with similar lightness." },
      },
    ],
  },
  {
    ch: 4,
    items: [
      {
        sec: "4-2",
        q: { zh: "条形图的纵轴可以从 90 开始以「放大差异」吗？", en: "Can a bar chart's axis start at 90 to 'amplify' differences?" },
        options: [
          { zh: "可以，只要标注清楚", en: "Yes, as long as it is labeled" },
          { zh: "不可以，条形图必须从 0 开始", en: "No, bar charts must start at zero" },
          { zh: "只有折线图才必须从 0 开始", en: "Only line charts must start at zero" },
          { zh: "取决于数据量", en: "It depends on the data volume" },
        ],
        a: 1,
        exp: { zh: "条形靠长度编码，截断基線会让长度比例失真；折线图看趋势则不强制 0 基线。", en: "Bars encode length, so a truncated baseline distorts ratios; line charts show trends and needn't start at zero." },
      },
      {
        sec: "4-4",
        q: { zh: "Cleveland 的 45° 黄金角说的是什么？", en: "What is Cleveland's 45° banking about?" },
        options: [
          { zh: "图例要放在 45° 位置", en: "Legends belong at 45°" },
          { zh: "把关键趋势的平均斜率调到 45° 附近，判断最准", en: "Bank the average slope of key trends to ~45° for most accurate judgments" },
          { zh: "饼图扇区不要超过 45°", en: "Pie sectors must stay under 45°" },
          { zh: "颜色明度差要大于 45", en: "Lightness difference must exceed 45" },
        ],
        a: 1,
        exp: { zh: "人眼对 45° 附近的斜率最敏感，作图时应尽量把关键趋势摆到该角度。", en: "Slope judgments peak near 45°, so bank key trends to that angle." },
      },
    ],
  },
  {
    ch: 5,
    items: [
      {
        sec: "5-1",
        q: { zh: "时间序列中缺失了若干日期，时间轴应该如何处理？", en: "With missing dates in a time series, how should the axis be handled?" },
        options: [
          { zh: "按记录序号等距排列", en: "Space by record index" },
          { zh: "用时间尺度并如实留出空白", en: "Use a time scale and leave honest gaps" },
          { zh: "用线性插值补上", en: "Linearly interpolate the gaps" },
          { zh: "删掉缺失前后的数据", en: "Drop data around the gaps" },
        ],
        a: 1,
        exp: { zh: "类别尺度会压缩采样密集的时段；时间尺度如实反映间隔，折线在缺失处断开。", en: "Categorical scales compress dense periods; a time scale keeps true spacing and breaks the line at gaps." },
      },
      {
        sec: "5-3",
        q: { zh: "想看「每年 12 月销量最高」这种周期规律，哪种图最合适？", en: "To see a yearly December sales peak, which chart fits best?" },
        options: [
          { zh: "单条长折线图", en: "One long line chart" },
          { zh: "日历热图 / 螺旋图", en: "Calendar heatmap / spiral" },
          { zh: "饼图", en: "Pie chart" },
          { zh: "散点图", en: "Scatter plot" },
        ],
        a: 1,
        exp: { zh: "周期规律需要按周期折叠的布局：日历热图看「哪天/哪月」，螺旋同时看周期与长期趋势。", en: "Cycles need cycle-folding layouts: heatmaps for 'which day/month', spirals for cycle plus trend." },
      },
    ],
  },
];

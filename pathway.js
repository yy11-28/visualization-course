// =============================================================
// pathway.js — 32 学时教学排课数据
// 按「每次课 2 学时」拆分为 16 次课，覆盖 5 章 27 小节。
// 每次课包含：本次覆盖的小节、核心要点、课堂活动、课后作业、前置依赖。
// 文案中英双语，由 study-tools.js 的 t() 取用。
// =============================================================

export const PATHWAY = [
  /* ================= 第 1 章 数据（6 学时 · 3 次课） ================= */
  {
    no: 1, week: 1, ch: 1, hours: 2, sections: ["1-1", "1-2"], prereq: [],
    title: { zh: "数据从哪来：生成与定义", en: "Where Data Comes From: Generation & Definition" },
    points: [
      { zh: "可视化始于数据：原始数据 → 数据表 → 视觉结构 → 视图", en: "Visualization starts with data: raw → tables → visual structures → views" },
      { zh: "用 CSV / JSON / AI 合成三种方式造数据，弄清字段与类型", en: "Create data via CSV, JSON, or AI synthesis; understand fields and types" },
      { zh: "DIKW 金字塔：数据加语境成信息，提炼规律成知识", en: "DIKW: data + context becomes information; patterns become knowledge" },
    ],
    activity: {
      zh: "现场用 d3.csv 拉一份新生数据，控制台里逐字段问：“这是哪个 Stevens 尺度？”",
      en: "Load a student dataset with d3.csv, then ask for each field: which Stevens scale is it?",
    },
    homework: {
      zh: "自己写一段 Python / JS 生成 50 条带 4 个字段的 CSV，说明每个字段的类型",
      en: "Generate a 50-row CSV with 4 fields yourself and state each field's type",
    },
  },
  {
    no: 2, week: 2, ch: 1, hours: 2, sections: ["1-3"], prereq: [1],
    title: { zh: "数据属性：Stevens 尺度 × Mackinlay 通道", en: "Data Attributes: Stevens Scales × Mackinlay Channels" },
    points: [
      { zh: "四种尺度：定类 / 定序 / 定距 / 定比，决定能做什么运算", en: "Four scales: nominal / ordinal / interval / ratio — they decide valid operations" },
      { zh: "编码精度排序：位置 > 长度 > 角度 > 面积 > 体积 > 色深 > 色相", en: "Encoding accuracy: position > length > angle > area > volume > color" },
      { zh: "定类数据不能求平均，这是作业里最高频的错误", en: "Averaging categorical data is the most common homework error" },
    ],
    activity: {
      zh: "给同一份数据分别用色相和长度编码，让学生凭肉眼读出最大/最小值的差",
      en: "Encode the same data twice — by hue and by length — and let students compare read-out accuracy",
    },
    homework: {
      zh: "把「常见误区对照」里第 1 章的 3 组错误做法改成正确写法",
      en: "Fix the three Chapter-1 mistakes listed in the Common Pitfalls tool",
    },
  },
  {
    no: 3, week: 3, ch: 1, hours: 2, sections: ["1-4", "1-5"], prereq: [2],
    title: { zh: "数据变换与 D3 选择器", en: "Data Transformation & D3 Selections" },
    points: [
      { zh: "D3 八个函数式数组操作：map / filter / rollup / group …", en: "D3's eight functional array operations: map, filter, rollup, group…" },
      { zh: "Data-Join 三态：enter / update / exit", en: "Data-Join three states: enter / update / exit" },
      { zh: "selection.join() 一行替代旧式三态写法", en: "selection.join() replaces the old three-state boilerplate in one line" },
    ],
    activity: {
      zh: "讲台上动态追加 / 删除数据点，让学生预测哪些 DOM 会新增、哪些会被移除",
      en: "Append and delete data points live; let students predict which DOM nodes enter or exit",
    },
    homework: {
      zh: "用 selection.join() 重写一次课 1 的条形图，做到数据变化时动画过渡正确",
      en: "Rewrite Session 1's bar chart with selection.join() so updates animate correctly",
    },
  },

  /* ================= 第 2 章 流程（6 学时 · 3 次课） ================= */
  {
    no: 4, week: 4, ch: 2, hours: 2, sections: ["2-1", "2-2"], prereq: [3],
    title: { zh: "Card 流程模型与数据规整", en: "Card's Pipeline Model & Data Wrangling" },
    points: [
      { zh: "Card 模型四阶段：原始值 → 数据表 → 视觉结构 → 视图", en: "Card's four stages: raw values → data tables → visual structures → views" },
      { zh: "d3.rollup 做分组聚合：嵌套 Map 是 D3 的数据基石", en: "d3.rollup for aggregation: nested Maps are D3's data backbone" },
      { zh: "每个转换都要可逆：出问题能回溯到上一环节", en: "Every transform should be traceable back to its source" },
    ],
    activity: {
      zh: "把新生数据按学院 + 性别做两级 rollup，现场画出层级矩形图",
      en: "Roll up the student data by college and gender, then draw a hierarchical treemap live",
    },
    homework: {
      zh: "对自己的 CSV 做一次两级聚合，输出到控制台并检查合计是否守恒",
      en: "Aggregate your own CSV in two levels and verify the totals add up",
    },
  },
  {
    no: 5, week: 5, ch: 2, hours: 2, sections: ["2-3"], prereq: [4],
    title: { zh: "视觉映射：数据表 → 视觉结构", en: "Visual Mapping: Tables → Visual Structures" },
    points: [
      { zh: "通道选择与数据尺度必须匹配（定序→有序颜色，定比→长度/位置）", en: "Channel must match data scale (ordinal→sequential color, ratio→length)" },
      { zh: "Reingold-Tilford 树布局：分层递归画节点", en: "Reingold-Tilford tree layout: hierarchical recursive node placement" },
      { zh: "布局算坐标、通道定外观，两者解耦才好改", en: "Layout computes positions, channels decide appearance — keep them decoupled" },
    ],
    activity: {
      zh: "同一棵树分别用树布局与矩形树图展示，讨论各适合什么提问",
      en: "Render the same tree as a dendrogram and a treemap; discuss which questions each answers",
    },
    homework: {
      zh: "给自己的数据选一种布局并说明“为什么不是另外那种”",
      en: "Pick one layout for your data and justify why not the alternatives",
    },
  },
  {
    no: 6, week: 6, ch: 2, hours: 2, sections: ["2-4"], prereq: [5], milestone: true,
    title: { zh: "视图渲染与交互", en: "View Rendering & Interaction" },
    points: [
      { zh: "事件委托：大量图形只在父层绑一次监听", en: "Event delegation: bind once on the parent for many marks" },
      { zh: "过渡动画要短（200–400ms），过长会拖慢阅读", en: "Keep transitions short (200–400ms); longer ones slow reading" },
      { zh: "第一阶段收尾：已能独立完成「数据 → 图」的完整链路", en: "Milestone: you can now build the full data → chart pipeline alone" },
    ],
    activity: {
      zh: "给树图加 hover 高亮与点击折叠，体会交互对读图的帮助",
      en: "Add hover highlight and click-to-collapse to the tree and feel how interaction helps reading",
    },
    homework: {
      zh: "阶段作业：提交一个带交互的可视化小作品（数据自定）",
      en: "Milestone assignment: submit one interactive visualization of your own dataset",
    },
  },

  /* ================= 第 3 章 色彩（8 学时 · 4 次课） ================= */
  {
    no: 7, week: 7, ch: 3, hours: 2, sections: ["3-1", "3-2"], prereq: [6],
    title: { zh: "颜色模型与 colormap 三类选择", en: "Color Models & the Three Colormap Families" },
    points: [
      { zh: "RGB 给设备、HSV 直觉但不均匀、Lab 才感知均匀", en: "RGB for devices, HSV intuitive but not uniform, Lab perceptually uniform" },
      { zh: "三类方案：顺序型 / 发散型 / 定性型，先判数据再选色", en: "Three families: sequential / diverging / qualitative — judge data first" },
      { zh: "彩虹色 jet 制造虚假边界，是论文返修重灾区", en: "Rainbow jet creates false boundaries — a top reason for paper revision" },
    ],
    activity: {
      zh: "同一张热力图轮流套 jet / viridis / 发散方案，投屏对比虚假边界的出现",
      en: "Apply jet, viridis, and a diverging scheme to one heatmap; compare on the projector",
    },
    homework: {
      zh: "把自己的阶段作业换成感知均匀配色，写一段 100 字说明改动理由",
      en: "Re-color your milestone work with a perceptually uniform scheme and explain why in 100 words",
    },
  },
  {
    no: 8, week: 8, ch: 3, hours: 2, sections: ["3-3", "3-4"], prereq: [7],
    title: { zh: "Lab 色域与色系搭配规则", en: "Lab Gamut & Color Harmony Rules" },
    points: [
      { zh: "在 Lab 空间取点，才能保证颜色阶梯视觉等距", en: "Sample in Lab space to keep color steps visually even" },
      { zh: "五类搭配：单色 / 类比 / 互补 / 分裂互补 / 三等分", en: "Five harmonies: mono / analogous / complementary / split / triadic" },
      { zh: "分类数超过 8 就该换编码通道，而不是继续加颜色", en: "Beyond 8 categories switch encoding channel instead of adding colors" },
    ],
    activity: {
      zh: "给 5 类数据各套两种搭配规则，全班投票哪种更易分辨",
      en: "Apply two harmony rules to a 5-class dataset and vote which is easier to tell apart",
    },
    homework: {
      zh: "整理一套自己的 6 色定性配色，标注每条 Lab 亮度",
      en: "Build your own 6-color qualitative palette and note each Lab lightness",
    },
  },
  {
    no: 9, week: 9, ch: 3, hours: 2, sections: ["3-5", "3-6"], prereq: [8],
    title: { zh: "科研经典配色与错例修正", en: "Classic Scientific Palettes & Fixing Bad Cases" },
    points: [
      { zh: "Wong / Okabe-Ito / Paul Tol：顶刊常用的 CVD 安全配色", en: "Wong / Okabe-Ito / Paul Tol: CVD-safe palettes common in top journals" },
      { zh: "判错三件事：是否彩虹、是否语义错位、是否 CVD 不可分", en: "Diagnose three things: rainbow, semantics mismatch, CVD confusion" },
      { zh: "发散型必须有明确中点（零值 / 均值），否则不要用", en: "A diverging scheme needs a meaningful midpoint, otherwise don't use it" },
    ],
    activity: {
      zh: "发 6 张“翻车图”，小组限时找出问题并当场改配色",
      en: "Hand out six flawed figures; teams race to spot issues and re-color them",
    },
    homework: {
      zh: "挑一张自己过去作业里的图，按 CVD 标准重做并附前后对比",
      en: "Redo one of your own past figures to be CVD-safe with a before/after comparison",
    },
  },
  {
    no: 10, week: 10, ch: 3, hours: 2, sections: ["3-7", "3-8"], prereq: [9],
    title: { zh: "配色生成器与 CVD 复检", en: "Palette Generators & CVD Re-check" },
    points: [
      { zh: "生成器：先定风格（鲜艳 / 低饱和），再批量产出", en: "Generators: pick a style (vivid / muted) first, then produce variants" },
      { zh: "出图必做 CVD 模拟复检：红绿通道混淆最致命", en: "Always run CVD simulation before publishing; red-green confusion is fatal" },
      { zh: "灰度打印测试：去掉颜色还能不能读懂", en: "Grayscale test: is the figure still readable without color?" },
    ],
    activity: {
      zh: "每人现场生成一套配色，跑灰度 + CVD 双检，不合格当场返工",
      en: "Everyone generates a palette, runs grayscale + CVD checks, and revises failures on the spot",
    },
    homework: {
      zh: "交付彩色版本的阶段作业，附灰度打印稿与 CVD 检查结果",
      en: "Submit the colored milestone work with a grayscale print and CVD check result",
    },
  },

  /* ================= 第 4 章 低维（6 学时 · 3 次课） ================= */
  {
    no: 11, week: 11, ch: 4, hours: 2, sections: ["4-1", "4-2"], prereq: [10],
    title: { zh: "坐标与坐标轴变换", en: "Coordinate & Axis Transformations" },
    points: [
      { zh: "三层坐标：数据坐标 → 归一化 → 屏幕坐标", en: "Three coordinate layers: data → normalized → screen" },
      { zh: "标尺三要素：domain 输入域、range 输出域、是否 clamp", en: "Scale essentials: domain, range, and whether to clamp" },
      { zh: "非零起点的条形图会夸大差异 —— 与折线图要求相反", en: "Truncated bar axes exaggerate differences — unlike line charts" },
    ],
    activity: {
      zh: "同一份 Crime 数据分别设 y 轴起点 0 与 40，比较视觉差量是否被放大",
      en: "Plot the same Crime data with y-axis starting at 0 vs 40 and compare perceived gaps",
    },
    homework: {
      zh: "写明自己的图该不该从 0 开始，并给出理由",
      en: "State whether your chart's axis should start at zero, with reasoning",
    },
  },
  {
    no: 12, week: 12, ch: 4, hours: 2, sections: ["4-3", "4-4"], prereq: [11],
    title: { zh: "曲线拟合与 45° 黄金角", en: "Curve Fitting & the 45° Golden Angle" },
    points: [
      { zh: "拟合不是越复杂越好：看残差与可解释性", en: "Complexity isn't better: check residuals and explainability" },
      { zh: "Cleveland：人眼对 45° 附近斜率最敏感", en: "Cleveland: the eye is most sensitive near 45° slopes" },
      { zh: "调宽高比让关键趋势落在 45° 附近，读图更准", en: "Adjust aspect ratio so key trends land near 45° for accurate reading" },
    ],
    activity: {
      zh: "同一序列依次拟合线性 / 二次 / LOESS，讨论各自的“故事”差别",
      en: "Fit linear, quadratic, and LOESS in turn; discuss how the 'story' changes",
    },
    homework: {
      zh: "给自己的散点图加拟合线，并调整宽高比到 45° 附近",
      en: "Add a fit line to your scatter plot and tune the aspect ratio toward 45°",
    },
  },
  {
    no: 13, week: 13, ch: 4, hours: 2, sections: ["4-5"], prereq: [12],
    title: { zh: "Marching Squares 等值线", en: "Marching Squares Contours" },
    points: [
      { zh: "逐格判断四角与阈值的关系，16 种情形查表取边", en: "Compare each cell's four corners to the threshold; 16 cases map to edges" },
      { zh: "线性插值找交点，比直接取中点平滑得多", en: "Linear interpolation for crossings beats plain midpoints" },
      { zh: "鞍点有二义性，需要用中心值消歧", en: "Saddle cases are ambiguous — resolve with the cell center value" },
    ],
    activity: {
      zh: "纸上手算一个 2×2 网格的等值线，再对照程序生成结果",
      en: "Hand-compute contours on a 2×2 grid, then compare with the program output",
    },
    homework: {
      zh: "实现 Marching Squares 并画三层等值线 + 色带标注",
      en: "Implement Marching Squares and draw three contour levels with a labeled color scale",
    },
  },

  /* ================= 第 5 章 时序（6 学时 · 3 次课） ================= */
  {
    no: 14, week: 14, ch: 5, hours: 2, sections: ["5-1", "5-2"], prereq: [13],
    title: { zh: "时间属性与标准折线图", en: "Time Attributes & Standard Line Charts" },
    points: [
      { zh: "时间五属性：有序、周期性、层次、连续/离散、范围", en: "Five time attributes: ordered, cyclic, hierarchical, continuous/discrete, span" },
      { zh: "先看尺度：秒级走势和十年趋势不该用同一张图", en: "Mind the scale: second-level and decade-level trends don't share a chart" },
      { zh: "折线负责趋势，异常点要额外标注而不是指望读者自己发现", en: "Lines show trends; annotate anomalies rather than expecting readers to spot them" },
    ],
    activity: {
      zh: "同一份法国人名数据按年、按月、按十年重采样，看结论如何变化",
      en: "Resample the French name data by year, month, and decade; watch the conclusion shift",
    },
    homework: {
      zh: "对自己的时间序列做两次重采样，说明各适合回答什么问题",
      en: "Resample your own time series twice and explain what each answers",
    },
  },
  {
    no: 15, week: 15, ch: 5, hours: 2, sections: ["5-3", "5-4"], prereq: [14],
    title: { zh: "日历热图与周期可视化", en: "Calendar Heatmaps & Cyclic Views" },
    points: [
      { zh: "van Wijk 日历：二维折叠把长周期塞进一屏", en: "van Wijk calendar: fold a long span into one screen in 2D" },
      { zh: "阿基米德螺旋适合循环数据，收尾不接合避免误导", en: "Archimedean spirals suit cyclic data; don't join the ends" },
      { zh: "日历图配发散色必须有明确基准日，否则颜色无意义", en: "Diverging colors on calendars need a clear baseline day" },
    ],
    activity: {
      zh: "把一年数据分别画成折线、日历热图、螺旋，投票哪种最快看出周末效应",
      en: "Draw one year of data as line, calendar, and spiral; vote which reveals weekend effects fastest",
    },
    homework: {
      zh: "实现日历热图，并说明你选的配色属于哪一类",
      en: "Implement a calendar heatmap and state which colormap family you chose",
    },
  },
  {
    no: 16, week: 16, ch: 5, hours: 2, sections: ["5-5"], prereq: [15], milestone: true,
    title: { zh: "Storyline 与期末综合", en: "Storylines & Final Review" },
    points: [
      { zh: "故事线：用线条的聚散表达多角色关系随时间的变化", en: "Storylines: line convergence shows evolving character relationships" },
      { zh: "布局优化目标是减少交叉、保持线条顺序稳定", en: "Layout goals: fewer crossings, stable line ordering" },
      { zh: "回顾全课程：数据 → 通道 → 配色 → 坐标 → 时间，五步走", en: "Review the course: data → channels → color → coordinates → time" },
    ],
    activity: {
      zh: "用《侏罗纪公园》角色数据画故事线，讨论布局交叉对叙事的影响",
      en: "Draw a storyline from the Jurassic Park cast and discuss how crossings affect the narrative",
    },
    homework: {
      zh: "期末作品：自选主题完成一幅可解释的可视化，附设计说明与自检清单",
      en: "Final work: one self-chosen explainable visualization with design notes and a self-check list",
    },
  },
];

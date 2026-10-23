// =============================================================
// course-map.js — 课程地图数据源
// 为知识图谱、进度追踪、教学工具提供统一的章节/小节数据
// =============================================================

export const COURSE_META = {
  course: "《可视化导论》",
  teacher: "李昕",
  institution: "中国石油大学（华东）",
  textbook: "陈为《可视化导论》",
  totalHours: 32,
  totalSections: 27,
  updated: "2026-10-16",
};

export const CHAPTERS = [
  {
    id: "ch1",
    num: 1,
    title: "数据",
    titleEn: "Data",
    href: "lesson-01/",
    icon: "🧬",
    accent: "#6C8FF5",
    blurb: "一切可视化的起点。从生成到定义、属性、变换与 D3 选择器。",
    hours: 6,
    sections: [
      { id: "1-1", title: "数据生成",      tags: ["AI 合成", "CSV"] },
      { id: "1-2", title: "数据定义",      tags: ["DIKW", "金字塔"] },
      { id: "1-3", title: "数据属性",      tags: ["Stevens", "Mackinlay"] },
      { id: "1-4", title: "数据变换",      tags: ["函数式", "map/reduce"] },
      { id: "1-5", title: "D3 数据选择器",  tags: ["Selection", "enter/update/exit"] },
    ],
  },
  {
    id: "ch2",
    num: 2,
    title: "数据可视化流程",
    titleEn: "Visualization Pipeline",
    href: "lesson-02/",
    icon: "🔁",
    accent: "#4FC0A1",
    blurb: "Card 数据流模型 + 从新生数据到分类树到树形列表的完整链路。",
    hours: 6,
    sections: [
      { id: "2-1", title: "数据可视化流程",      tags: ["Card 模型", "D→T→V→I"] },
      { id: "2-2", title: "数据变换：原数据 → 数据表", tags: ["d3.rollup", "聚合"] },
      { id: "2-3", title: "视觉映射：数据表 → 视觉结构", tags: ["树布局", "通道"] },
      { id: "2-4", title: "视图渲染与用户交互",      tags: ["事件委托", "动画"] },
    ],
  },
  {
    id: "ch3",
    num: 3,
    title: "色彩专题",
    titleEn: "Color Special Topic",
    href: "lesson-03/",
    icon: "🎨",
    accent: "#EE7C93",
    blurb: "颜色模型 + colormap + Lab 色域 + 5 大色系 + 经典科研配色 + 鲜艳/低饱和哲学生成器 + CVD 论文图测。",
    hours: 8,
    sections: [
      { id: "3-1", title: "颜色模型基础",    tags: ["RGB", "HSV", "Lab", "CVD"] },
      { id: "3-2", title: "colormap 三类选择", tags: ["顺序型", "发散型", "定性型"] },
      { id: "3-3", title: "CIE Lab 色域图",  tags: ["感知均匀"] },
      { id: "3-4", title: "色系搭配规则（5 大类）", tags: ["单色", "类比", "互补", "三等分"] },
      { id: "3-5", title: "科研经典配色",    tags: ["Wong", "Paul Tol", "Okabe-Ito"] },
      { id: "3-6", title: "对错案例对比",    tags: ["错例", "修正"] },
      { id: "3-7", title: "鲜艳 + 低饱和 哲学生成器", tags: ["生成器"] },
      { id: "3-8", title: "CVD 论文图测",    tags: ["色盲", "复检"] },
    ],
  },
  {
    id: "ch4",
    num: 4,
    title: "低维数据可视化",
    titleEn: "Low-Dimensional Data",
    href: "lesson-04/",
    icon: "📈",
    accent: "#E8B04B",
    blurb: "Crime 数据坐标变换、10 种曲线拟合、Cleveland 45° 倾角、Marching Squares 等值线。",
    hours: 6,
    sections: [
      { id: "4-1", title: "数据转换",      tags: ["三层坐标变换"] },
      { id: "4-2", title: "坐标轴变换",    tags: ["scale", "axis"] },
      { id: "4-3", title: "曲线拟合",      tags: ["10 种曲线"] },
      { id: "4-4", title: "倾角感知（45° 黄金角）", tags: ["Cleveland"] },
      { id: "4-5", title: "等值线（Marching Squares）", tags: ["等值线"] },
    ],
  },
  {
    id: "ch5",
    num: 5,
    title: "时序数据可视化",
    titleEn: "Temporal Data",
    href: "lesson-05/",
    icon: "⏳",
    accent: "#9B7FE0",
    blurb: "5 个时间属性、法国人名时间序列、van Wijk 日历热图、阿基米德螺旋日历、Storyline 故事线（《侏罗纪公园》案例）。",
    hours: 6,
    sections: [
      { id: "5-1", title: "时间属性",              tags: ["时间分解"] },
      { id: "5-2", title: "标准时间可视化（折线图）", tags: ["折线", "标注"] },
      { id: "5-3", title: "日历热图（van Wijk）",   tags: ["日历", "colormap"] },
      { id: "5-4", title: "周期时间可视化（阿基米德螺旋）", tags: ["极坐标"] },
      { id: "5-5", title: "Storyline 时间线（侏罗纪公园）", tags: ["Storygraph"] },
    ],
  },
];

// 理论概念速查（用于教师工具箱的"概念卡片"）
export const CONCEPTS = [
  { key: "DIKW",   label: "DIKW 金字塔",   chapter: "1.2", desc: "数据 → 信息 → 知识 → 智慧，逐级抽象。" },
  { key: "STEVENS",label: "Stevens 测量尺度", chapter: "1.3", desc: "定类、定序、定距、定比 四种类型。" },
  { key: "MACKINLAY",label:"Mackinlay 视觉通道排序", chapter: "1.3", desc: "位置 > 长度 > 角度 > 面积 > 体积 > 颜色 ..." },
  { key: "CARD",   label: "Card 数据流模型", chapter: "2.1", desc: "原始数据 → 数据表 → 视觉结构 → 视图。" },
  { key: "REINGOLD",label:"Reingold-Tilford 树布局", chapter: "2.3", desc: "分层递归画树形节点的经典算法。" },
  { key: "JOIN",   label: "Data-Join 三态", chapter: "1.5", desc: "enter / update / exit 的命令式 vs 函数式。" },
  { key: "CLEVELAND",label:"Cleveland 45° 黄金角", chapter: "4.4", desc: "人眼对 45° 倾角的斜率最敏感。" },
  { key: "MARCHING",label:"Marching Squares 等值线", chapter: "4.5", desc: "网格上画等值线的离散算法。" },
  { key: "WONG",   label: "Wong 配色",     chapter: "3.5", desc: "Nature Methods 推荐 8 色 CVD 安全配色。" },
  { key: "TOL",    label: "Paul Tol 配色", chapter: "3.5", desc: "顶刊常见的 6 套高质量 colormap。" },
  { key: "VANWIJK",label:"van Wijk 日历热图", chapter: "5.3", desc: "二维折叠表现周期数据的优雅布局。" },
  { key: "STORY",  label: "Storyline 故事线",chapter: "5.5", desc: "多角色随时间变化的可视化方法。" },
];

// 知识图谱节点/链接（用于 D3 力导向图）
// 节点 = 章节 + 小节；链接 = 归属关系 + 章节递进关系
export function buildChartGraph() {
  const nodes = [];
  const links = [];
  for (const ch of CHAPTERS) {
    nodes.push({
      id: ch.id, type: "chapter", chapter: ch.id,
      label: `第${ch.num}章 ${ch.title}`, color: ch.accent, r: 34,
    });
    for (const s of ch.sections) {
      const nodeId = `${ch.id}-${s.id}`;
      nodes.push({
        id: nodeId, type: "section", chapter: ch.id,
        label: `${s.id} ${s.title}`, color: ch.accent, r: 15,
        href: `${ch.href}#ch-${s.id}`,
      });
      links.push({ source: ch.id, target: nodeId });
    }
  }
  // 章节间递进依赖（虚线）
  for (let i = 0; i < CHAPTERS.length - 1; i++) {
    links.push({ source: CHAPTERS[i].id, target: CHAPTERS[i + 1].id, type: "progress" });
  }
  return { nodes, links };
}

// 搜索索引（小节名 + 概念 + 标签）
export function buildSearchIndex() {
  const idx = [];
  for (const ch of CHAPTERS) {
    idx.push({ kind: "chapter", id: ch.id, label: `第${ch.num}章 ${ch.title}`, href: ch.href });
    for (const s of ch.sections) {
      const text = [s.title, ...(s.tags || [])].join(" ");
      idx.push({
        kind: "section",
        id: `${ch.id}-${s.id}`,
        label: `${s.id} ${s.title}`,
        text,
        href: `${ch.href}#ch-${s.id}`,
      });
    }
  }
  for (const c of CONCEPTS) {
    const chNum = c.chapter.split(".")[0];
    idx.push({
      kind: "concept",
      id: c.key,
      label: c.label,
      text: c.desc,
      href: `lesson-0${chNum}/#ch-${c.chapter}`,
    });
  }
  return idx;
}
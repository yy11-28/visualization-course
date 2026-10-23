# 《可视化导论》课程站点（重构版）

## 新版学习空间（2026-10-21）

首页现已独立重写，使用 `index.html`、`portal.css`、`portal.js`，不依赖旧门户的布局与交互实现。`portal-data.json` 保存原课程的章节元信息和自测题内容；课程正文、数据、讲义与演示文件保持原样。下方旧版说明保留用于维护原课程页面和工具页。

- 学习概览与章节目录，全局搜索支持小节标题、章节名称和标签，按 `/` 聚焦搜索。
- 学习工作区承载原课程，支持前后小节跳转、完成标记、收藏和小节笔记。
- 收藏列表、自动保存的个人笔记、Markdown 笔记导出。
- 原有 10 道自测题的独立界面，支持分章练习、即时反馈、解析和重做。
- 手机端折叠导航，保留原知识图谱、概念可视化、术语、误区、排期和补充演示入口。

仍通过 `node serve.js` 启动并访问 `http://localhost:8080/`。学习记录使用当前浏览器的 localStorage（`vis-learning-space-v1`），不同浏览器、设备或端口之间不自动同步；清除站点数据会清除记录，笔记可提前导出。不需要安装依赖或连接服务器账号。

如果调整章节元信息或原自测题，需要同步更新 `portal-data.json`，保持新门户与教学资料一致。

面向**课堂教学与学生学习**优化的课程网站重构版。章节正文内容与原站完全一致，
重构集中在：门户首页、样式主题、概念可视化、离线可靠性。

## 快速开始

```bash
# 方式一：Node（推荐，支持局域网共享）
node serve.js          # 默认 http://localhost:8080，可加端口参数：node serve.js 9000

# 方式二：Python
python -m http.server 8080
```

局域网使用：连同一 WiFi，访问启动时打印的 `http://<你的IP>:8080`。

## 目录结构

```
├── index.html            课程主页（章节总览 + 知识图谱 + 概念可视化 + 课程目录）
├── styles.css            门户主题（设计令牌 / 卡片 / 图谱 / 画廊，投影友好）
├── course.css            展示组件样式（阅读辅助条 / 课程目录 / 目录抽屉）
├── course.js             展示逻辑（章节卡片 / 力导向图谱 / 7 个概念图形）
├── course-map.js         课程地图数据源（5 章 27 节，改课时/小节在这里改）
├── lesson-enhance.css    章节页排版增强（纯样式，不动正文）
├── i18n.js / i18n.css    中英双语切换（沿用原站，补齐缺失键）
├── serve.js              零依赖静态服务器（兼容 /vis/ 子路径的绝对引用）
├── assets/
│   ├── d3.v7.min.js      D3 v7 UMD 本地副本
│   ├── d3.v7.esm.js      D3 v7 ESM 副本（由 tools/build-d3-esm.js 生成）
│   └── d3-regression.min.js  回归拟合插件（supplementary/regression 用）
├── lesson-01 … lesson-05 章节页（正文未动，仅叠加样式与展示增强）
├── supplementary/        补充 demo 集合（原站镜像，D3 已本地化）
└── tools/                维护脚本（见下）
```

## 主页内容

- **课程章节**：5 章卡片，每章列出小节、学时与关键词，点击直达
- **知识图谱**：D3 力导向图呈现章节结构与小节依赖，可点击跳转、拖拽查看
- **概念可视化**（7 个，对应教材章节）：
  - DIKW 金字塔（1.2）· Stevens 测量尺度（1.3）· Mackinlay 通道排序（1.3）
  - Card 数据流模型（2.1）· 图表类型选择指南（4–5 章）· 配色方案选择（3.3）
  - CVD 色觉障碍模拟（3.8，可切换红/绿/蓝黄色盲视角）
- **课程目录**：全部 27 节的完整清单，含学时与关键词标签
- **学习指南**：推荐学习方法与页面结构说明

## 离线可靠性（重要改进）

原站 lesson.js / supplementary 各页写死了 `cdn.jsdelivr.net` 的 D3 地址，断网时
**章节切换、Tab 切换、所有 demo 全部失效**。本版本：

1. D3 v7 与 d3-regression 已下载到 `assets/`；
2. 各页面通过 `<script type="importmap">` 把 CDN 地址映射到本地文件，
   **未改动任何章节正文与 lesson.js 源码**；
3. 全站不再有任何外部资源依赖（零视频、零字体、零统计脚本）。

## 维护脚本（tools/）

| 脚本 | 用途 |
|------|------|
| `node tools/build-d3-esm.js` | 从 `assets/d3.v7.min.js` 重新生成 ESM 版（升级 D3 后运行） |
| `node tools/check-i18n.js` | 检查页面使用的 data-i18n 键是否都在字典中 |
| `node tools/mirror-site.js` | 增量镜像线上 supplementary / demo 页面 |
| `node tools/fetch-dynamic-data.js` | 扫描并下载 JS 中动态 fetch 的 data/img 引用 |
| `powershell tools/verify-site.ps1` | 遍历站点页面，汇总 console 错误 |

## 已知遗留问题（原站即如此，未改动）

- `supplementary/calendar*.html` 引用绝对路径 `/data/calendar_data_modified.csv`，
  该文件在线上原站也是 404。拿到该 CSV 后放入站点根的 `data/` 即可恢复日历图。
- `supplementary/volumeRendering.html`、`yearcalendar.html` 在线上原站已是 404，
  入口页上的对应链接点击后无内容。
- `supplementary/index.html` 引用的 `../portal/styles.css` 线上原站同样是 404，
  仅影响补充页入口的一处装饰样式。

## 部署

整个目录上传至 GitHub Pages 仓库的 `vis/` 目录即可（保持相对路径结构）。
importmap 中的 `../assets/...` 为相对路径，部署在任何子路径下都能正常工作。

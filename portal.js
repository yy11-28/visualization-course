import { PATHWAY } from './pathway.js';
import { SECTION_NOTES } from './section-notes.js';
// 侧载课程 i18n 字典：门户与课程共用同一套小节标题翻译
import './i18n.js';

const $ = (s) => document.querySelector(s);
const paths = {
  home:'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  book:'M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z',
  grid:'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
  bookmark:'M6 3h12v18l-6-4-6 4Z',
  note:'M14 3H5v18h14V9ZM14 3v6h5M8 13h8M8 17h5',
  search:'m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow:'M4 12h16m-6-6 6 6-6 6',
  check:'m5 12 4 4L19 6',
  clock:'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  layers:'m3 7 9-5 9 5-9 5ZM3 12l9 5 9-5M3 17l9 5 9-5',
  flow:'M4 3h6v6H4ZM14 15h6v6h-6ZM7 9v9h7M10 6h7v9',
  palette:'M12 3a9 9 0 1 0 0 18c2 0 3-1 2-3s1-3 3-3h1c5 0 3-12-6-12ZM7 9h.01M12 6h.01M17 9h.01M6 14h.01',
  chart:'M3 3v18h18M7 16l4-6 4 3 5-8',
  graph:'M4 4h5v5H4ZM15 4h5v5h-5ZM10 16h5v5h-5ZM6 9l6 7m5-7-5 7M9 6h6',
  bulb:'M9 18h6M9 21h6M8 15a7 7 0 1 1 8 0l-1 3H9Z',
  quiz:'M9 3h6v4H9ZM9 5H5v16h14V5h-4M8 13l3 3 5-6',
  external:'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
  download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  menu:'M4 6h16M4 12h16M4 18h16',
  calendar:'M4 5h16v16H4ZM8 2v6M16 2v6M4 10h16',
  warning:'m12 3 10 18H2ZM12 9v5M12 17h.01',
  sun:'M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon:'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
};
const icon = (name) => `<svg class="icon ${name}-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY = 'vis-learning-space-v1';
const freshState = () => ({done:[], bookmarks:[], notes:{}, answers:{}, last:null});
let state = freshState();
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && Array.isArray(saved.done) && Array.isArray(saved.bookmarks) && saved.notes && saved.answers) state = {...state,...saved};
} catch { /* A new space is also usable when storage is unavailable. */ }
let data, sections, questions;
let chapterFilter = 'all';
let quizFilter = 'all';
let noteSection;
let pathwaySession = 1;
let pathwaySection = null;
let toastTimer;
const colors = ['#6e82cf','#50a68e','#c97b9b','#ca9b52','#8e7acc'];
const tints = ['#edf1ff','#eaf6f0','#fbedf3','#fcf4e7','#f1edfc'];
const glyphs = ['layers','flow','palette','chart','clock'];
const tools = [
  {title:'知识图谱',desc:'从整体理解章节与小节的关联，让知识形成自己的网络。',icon:'graph',name:'graph',href:'tools/graph/',label:'查看知识网络',titleEn:'Knowledge Graph',descEn:'See how chapters and sections connect, and let knowledge form its own network.',labelEn:'Explore the network',color:'#625be2',tint:'#eeedff'},
  {title:'概念可视化',desc:'通过 7 个互动教学图形，理解抽象概念背后的视觉逻辑。',icon:'palette',name:'concepts',href:'tools/concepts/',label:'探索互动图形',titleEn:'Concept Visuals',descEn:'Understand the visual logic behind abstract concepts through 7 interactive teaching graphics.',labelEn:'Explore the graphics',color:'#c97b9b',tint:'#fbedf3'},
  {title:'术语速查',desc:'检索课程中的中英文术语，随时回顾关键概念。',icon:'book',name:'glossary',href:'tools/glossary/',label:'打开速查表',titleEn:'Glossary',descEn:'Look up bilingual terms from the course and revisit key concepts anytime.',labelEn:'Open the glossary',color:'#508eb4',tint:'#ecf5fc'},
  {title:'常见误区',desc:'通过错误与正确案例的对照，识别可视化表达中的陷阱。',icon:'warning',name:'pitfalls',href:'tools/pitfalls/',label:'查看案例对照',titleEn:'Common Pitfalls',descEn:'Spot the traps in visual encoding by comparing wrong and right examples.',labelEn:'View the cases',color:'#66a18b',tint:'#edf6f0'},
  {title:'补充演示',desc:'打开原课程的补充案例，在实际图形中观察数据与交互。',icon:'chart',name:'supplementary',href:'supplementary/',label:'浏览演示案例',titleEn:'Supplementary Demos',descEn:'Open supplementary cases from the original course and observe data and interaction in real graphics.',labelEn:'Browse the demos',color:'#957ac3',tint:'#f2edfa'},
];
function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2600);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
  catch { toast(L('浏览器存储不可用，请先导出需要保留的笔记。','Browser storage is unavailable — export any notes you want to keep.')); return false; }
}
const sectionById = (id) => sections.find((s) => s.id === id);
const learnHref = (id) => `#learn/${id}`;
const nextSection = () => sectionById(state.last) || sections.find((s) => !state.done.includes(s.id)) || sections[0];
const doneCount = () => sections.filter((s) => state.done.includes(s.id)).length;
// ---------- 全局偏好：语言（中/英）与主题（亮/暗） ----------
const LOCALE_KEY = 'wbl-locale';
const THEME_KEY = 'wbl-theme';
const NAV_LABELS = {
  home:['学习概览','Overview'],
  pathway:['学习路径','Pathway'],
  courses:['全部课程','Courses'],
  tools:['学习工具','Tools'],
  bookmarks:['我的收藏','Bookmarks'],
  notes:['学习笔记','Notes']
};
const PAGE_LABELS = { ...NAV_LABELS, quiz:['课堂自测','Quiz'], learn:['学习工作区','Workspace'], tool:['学习工具','Tools'] };
const isEN = () => currentLocale() === 'en-US';
// 双语文案助手：按当前语言取中文或英文
const L = (zh, en) => isEN() ? en : zh;
// 章节简介英文（数据文件中无英文字段）
const BLURB_EN = {
  1:'Where every visualization begins — from generating data to defining it, its attributes, transforms and D3 selections.',
  2:'The Card data-flow model, plus the complete pipeline from freshman data to classification trees to treemaps.',
  3:'Color models, colormaps, the Lab space, 5 major palettes, classic research palettes, a vivid/muted generator and a CVD paper-chart test.',
  4:'Coordinate transforms of crime data, 10 curve fittings, the Cleveland 45° slope chart and Marching Squares isolines.',
  5:'Five time attributes, French-name time series, the van Wijk calendar heatmap, Archimedean spiral calendars and Storyline (the Jurassic Park case).'
};
// 小节标题：英文模式优先取课程 i18n 字典（键形如 sec-01-1.title）
const secTitle = (s) => {
  if (!isEN()) return s.title;
  const [a,b] = s.id.split('-');
  const key = `sec-0${Number(a)}-${b}.title`;
  const v = window.__i18n?.t?.(key);
  return v && v !== key ? v.replace(/^\d+\.\d+\s*/, '') : s.title;
};
function currentLocale() {
  try { return localStorage.getItem(LOCALE_KEY) === 'en-US' ? 'en-US' : 'zh-CN'; } catch { return 'zh-CN'; }
}
function currentTheme() {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
}
const lessonDoc = () => { try { return ($('#lesson-frame') || $('#tool-frame'))?.contentDocument || null; } catch { return null; } };
// 课程页为硬编码配色，暗色主题下由这段注入样式覆盖主要容器与 D3 图形文字
const LESSON_DARK_CSS = [
  // 课程主页变量体系（styles.css）下的通用暗色覆盖，同样作用于工具页 iframe
  'html[data-theme="dark"]{--bg:#0f172a;--bg-2:#131b2d;--card:#151d2e;--soft:#1a2333;--ink:#e2e8f0;--body:#c3cbdc;--muted:#8d97ae;--line:#26314a;--line-dk:#334060}',
  'html[data-theme="dark"] body{background:#0f172a!important;color:#e2e8f0!important}',
  'html[data-theme="dark"] .frame,html[data-theme="dark"] .sect,html[data-theme="dark"] .pfoot{background:transparent!important;color:#e2e8f0!important}',
  'html[data-theme="dark"] .pfoot{color:#8d97ae!important;border-color:#26314a!important}',
  'html[data-theme="dark"] .chapter-nav,html[data-theme="dark"] .chapter-content,',
  'html[data-theme="dark"] .demo-sub,html[data-theme="dark"] .demo-detail,',
  'html[data-theme="dark"] .note,html[data-theme="dark"] .toc-drawer{background:#151d2e!important;border-color:#26334a!important;color:#e2e8f0!important}',
  'html[data-theme="dark"] h1,html[data-theme="dark"] h2,html[data-theme="dark"] h3{color:#f1f5f9!important}',
  'html[data-theme="dark"] p,html[data-theme="dark"] li,html[data-theme="dark"] td,html[data-theme="dark"] th{color:#cbd5e1!important}',
  'html[data-theme="dark"] .note{background:rgba(180,120,20,.16)!important;color:#fcd9a0!important;border-color:rgba(180,120,20,.35)!important}',
  'html[data-theme="dark"] code{background:#1e293b!important;color:#f0abfc!important}',
  'html[data-theme="dark"] pre{background:#0b1220!important;border-color:#26334a!important}',
  'html[data-theme="dark"] .demo-mount svg text{fill:#e2e8f0!important}',
  'html[data-theme="dark"] table{background:#151d2e!important;color:#cbd5e1!important}',
  'html[data-theme="dark"] table th{background:#1b2537!important;color:#e2e8f0!important}',
  'html[data-theme="dark"] table th,html[data-theme="dark"] table td{border-color:#26334a!important}',
  'html[data-theme="dark"] .demo-mount{background:transparent!important}',
  'html[data-theme="dark"] .demo-mount svg [stroke="#1f2937"],',
  'html[data-theme="dark"] .demo-mount svg [stroke="#334155"]{stroke:#64748b!important}'
].join('\n');
function paintTheme() {
  const theme = currentTheme();
  document.documentElement.dataset.theme = theme;
  const doc = lessonDoc();
  if (!doc) return;
  doc.documentElement.dataset.theme = theme;
  if (!doc.getElementById('learn-dark-style')) {
    const style = doc.createElement('style');
    style.id = 'learn-dark-style';
    style.textContent = LESSON_DARK_CSS;
    doc.head.appendChild(style);
  }
}
function renderTopbarTools() {
  const host = $('#topbar-tools');
  if (!host) return;
  const en = isEN();
  const theme = currentTheme();
  const langLabel = en ? 'Language' : '语言切换';
  const themeLabel = en ? 'Toggle dark / light' : '切换深色 / 亮色';
  host.innerHTML = `<div class="lang-switch" role="group" aria-label="${langLabel}">`
    + `<button type="button" class="lang-btn ${en ? '' : 'active'}" data-set-locale="zh-CN" aria-pressed="${!en}">中</button>`
    + `<button type="button" class="lang-btn ${en ? 'active' : ''}" data-set-locale="en-US" aria-pressed="${en}">EN</button>`
    + `</div><button type="button" class="theme-toggle" data-toggle-theme aria-label="${themeLabel}" title="${themeLabel}">${icon(theme === 'dark' ? 'moon' : 'sun')}</button>`;
}
function toggleTheme() {
  try { localStorage.setItem(THEME_KEY, currentTheme() === 'dark' ? 'light' : 'dark'); } catch { /* ignore */ }
  paintTheme();
  renderTopbarTools();
  toast(isEN() ? (currentTheme() === 'dark' ? 'Dark mode on.' : 'Light mode on.') : (currentTheme() === 'dark' ? '已切换到深色模式。' : '已切换到亮色模式。'));
}
function setLocaleGlobally(loc) {
  try { localStorage.setItem(LOCALE_KEY, loc); } catch { /* ignore */ }
  document.documentElement.lang = loc === 'en-US' ? 'en' : 'zh-CN';
  // 重新渲染当前视图：门户文案按新语言输出，课程/工具 iframe 重新加载后读取同一语言偏好
  render({scroll:false});
  toast(loc === 'en-US' ? 'Switched to English.' : '已切换到中文界面。');
}
function navigation(view) {
  const items = [['home','home'],['pathway','flow'],['courses','book'],['tools','grid'],['bookmarks','bookmark'],['notes','note']];
  const en = isEN();
  const label = (id) => (NAV_LABELS[id] || ['',''])[en ? 1 : 0];
  const courseHref = learnHref(sectionById(state.last)?.id || sections[0].id);
  $('#navigation').innerHTML = items.map(([id,glyph]) => `${id === 'bookmarks' ? '<div class="nav-divider"></div>' : ''}<a class="nav-link ${(view === 'learn' ? id === 'courses' : (view === 'quiz' || view === 'tool') ? id === 'tools' : id === view) ? 'active' : ''}" href="${id === 'courses' ? courseHref : `#${id}`}" ${id === view ? 'aria-current="page"' : ''}>${icon(glyph)}${label(id)}${id === 'bookmarks' && state.bookmarks.length ? `<span class="nav-count">${state.bookmarks.length}</span>` : ''}</a>`).join('');
}
function heading(title,description,extra='') {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${description}</p></div>${extra}</div>`;
}
function chapterStyle(ch) { return `--chapter-color:${colors[ch.num-1]};--chapter-tint:${tints[ch.num-1]}`; }
function chapterCard(ch) {
  const done = ch.sections.filter((s) => state.done.includes(s.id)).length;
  return `<article class="chapter-card" style="${chapterStyle(ch)}"><div class="chapter-card-head"><span class="chapter-glyph">${icon(glyphs[ch.num-1])}</span><span class="chapter-no">CHAPTER 0${ch.num}</span></div><h3><a href="${learnHref(ch.sections[0].id)}">${escape(L(ch.title, ch.titleEn))}</a></h3><div class="chapter-en">${escape(ch.titleEn)}</div><p>${escape(L(ch.blurb, BLURB_EN[ch.num] || ch.blurb))}</p><div class="chapter-meta"><span>${icon('book')}${ch.sections.length} ${L('个小节','sections')}</span><span>${icon('clock')}${ch.hours} ${L('学时','hrs')}</span></div><div class="chapter-card-foot"><div class="progress-track"><span style="width:${done/ch.sections.length*100}%"></span></div><small>${done}/${ch.sections.length} ${L('已完成','done')}</small>${icon('arrow')}</div></article>`;
}
function heroArt() {
  return `<div class="hero-art" aria-hidden="true"><svg viewBox="0 0 320 300" fill="none"><circle cx="180" cy="155" r="106" stroke="#d5d0f2" stroke-dasharray="4 7"/><circle cx="180" cy="155" r="80" fill="#e0ddf9" opacity=".5"/><g transform="translate(58 73) rotate(-9 100 95)"><rect width="206" height="162" rx="13" fill="white"/><rect x="15" y="16" width="57" height="5" rx="2" fill="#cecae3"/><rect x="15" y="27" width="32" height="3" rx="1.5" fill="#e8e5f1"/><path d="M24 130h161M24 101h161M24 72h161M24 45h161" stroke="#f0eef8"/><rect x="34" y="94" width="20" height="36" rx="3" fill="#b8b0ed"/><rect x="67" y="76" width="20" height="54" rx="3" fill="#c8c0f3"/><rect x="100" y="87" width="20" height="43" rx="3" fill="#a79ae9"/><rect x="133" y="52" width="20" height="78" rx="3" fill="#7d6bcd"/><rect x="166" y="65" width="20" height="65" rx="3" fill="#a89cde"/><path d="m44 83 33-18 33 11 33-38 33 11" stroke="#d4ae6c" stroke-width="2.5"/><circle cx="143" cy="38" r="4" fill="#d4ae6c"/></g><g transform="translate(168 191) rotate(8)"><rect width="116" height="79" rx="12" fill="#fff"/><circle cx="36" cy="39" r="21" stroke="#eeeaf8" stroke-width="9"/><circle cx="36" cy="39" r="21" stroke="#8b7bd0" stroke-width="9" stroke-dasharray="88 132" transform="rotate(-90 36 39)"/><rect x="72" y="26" width="28" height="4" rx="2" fill="#cfc8e4"/><rect x="72" y="37" width="20" height="4" rx="2" fill="#e7e3f1"/><rect x="72" y="48" width="24" height="4" rx="2" fill="#e7e3f1"/></g><g transform="translate(211 36) rotate(12)"><rect width="62" height="48" rx="10" fill="#fdfbf6"/><path d="m14 32 10-13 10 7 14-15" stroke="#cab17c" stroke-width="2.5"/><circle cx="48" cy="11" r="3" fill="#cab17c"/></g><circle cx="43" cy="190" r="5" fill="#c1b4e6"/><circle cx="275" cy="144" r="4" fill="#ceb783"/><path d="M78 40v12m-6-6h12" stroke="#b4a6dd" stroke-width="2"/></svg></div>`;
}
function pathwayDetail() {
  const session = PATHWAY.find((item) => item.no === pathwaySession);
  const section = sectionById(pathwaySection);
  const note = SECTION_NOTES[pathwaySection];
  return `${section ? `<div class="pathway-section-detail"><span class="eyebrow">SECTION ${section.id}</span><h3>${escape(secTitle(section))}</h3><p>${escape(note.brief[isEN()?'en':'zh'])}</p><ul>${note.points.map((point) => `<li>${escape(point[isEN()?'en':'zh'])}</li>`).join('')}</ul><a class="button" href="${learnHref(section.id)}">${L('进入学习','Start learning')} ${icon('arrow')}</a></div>` : ''}
    <span class="eyebrow">SESSION ${String(session.no).padStart(2,'0')}${session.milestone ? ` · ${L('阶段节点','milestone')}` : ''}</span>
    <h3>${escape(session.title[isEN()?'en':'zh'])}</h3><p class="pathway-session-meta">${L(`第 ${session.week} 周`,`Week ${session.week}`)} · ${session.hours} ${L('学时','hrs')}</p>
    <ul>${session.points.map((point) => `<li>${escape(point[isEN()?'en':'zh'])}</li>`).join('')}</ul>
    <div class="pathway-task"><b>${L('课堂活动','In class')}</b><p>${escape(session.activity[isEN()?'en':'zh'])}</p></div>
    <div class="pathway-task"><b>${L('课后作业','Homework')}</b><p>${escape(session.homework[isEN()?'en':'zh'])}</p></div>
    <div class="pathway-task"><b>${L('前置依赖','Prerequisites')}</b><div>${session.prereq.length ? session.prereq.map((no) => `<button class="text-link" data-pathway-session="${no}">${L(`第 ${no} 次课`,`Session ${no}`)} ${icon('arrow')}</button>`).join(' ') : L('无 —— 本课程起点','None — course starting point')}</div></div>
    <div class="pathway-section-links">${session.sections.map((id) => `<button class="chip ${pathwaySection===id?'active':''}" data-pathway-section="${id}">${id} ${escape(sectionById(id).title)}</button>`).join('')}</div>`;
}
function pathwayBody() {
  const session = PATHWAY.find((item) => item.no === pathwaySession);
  let nodeNo = 0;
  return `<div class="pathway-overview">${[[32,L('学时','hrs')],[16,L('次课','sessions')],[5,L('章节','chapters')],[27,L('小节','sections')],[PATHWAY.filter((item)=>item.milestone).length,L('阶段节点','milestones')]].map(([value,label])=>`<div><b>${value}</b><span>${label}</span></div>`).join('')}</div>
    <div class="pathway-layout"><div class="pathway-road" aria-label="${L('27 个小节学习路径','Learning path of 27 sections')}"><h3>${L('学习路径','Learning Path')}</h3>${data.chapters.map((ch)=>`<div class="pathway-chapter" style="${chapterStyle(ch)}"><span>${L(`第 ${ch.num} 章`,`Ch ${ch.num}`)}<small>${escape(L(ch.title, ch.titleEn))}</small></span><div class="pathway-flow">${ch.sections.map((s)=>{ const no=String(++nodeNo).padStart(2,'0'); const done=state.done.includes(s.id); return `<div class="pathway-stop ${nodeNo%2?'up':'down'}"><button class="pathway-node ${pathwaySection===s.id?'selected':!pathwaySection&&session.sections.includes(s.id)?'related':''}" data-pathway-section="${s.id}" aria-pressed="${pathwaySection===s.id}" aria-label="${L('查看','View')} ${s.id} ${escape(s.title)}">${no}${done?icon('check'):''}</button><b>${escape(s.title)}</b><small>${escape(s.tags[0]||s.id)}</small></div>`;}).join('')}</div></div>`).join('')}</div>
    <aside class="pathway-detail" id="pathway-detail" aria-label="${L('学习路径详情','Path details')}" aria-live="polite">${pathwayDetail()}</aside></div>`;
}
function pathwayPage() {
  return heading(L('学习路径','Learning Path'),L('按每次课 2 学时拆分为 16 次课，依次覆盖 5 章 27 小节；点击小节查看内容，选择课次查看要点、课堂活动与课后作业。','Split into 16 sessions of 2 hours each, covering 5 chapters and 27 sections; click a section to preview it, or pick a session to see key points, in-class activities and homework.'))
  + `<section class="home-pathway" id="pathway" aria-label="${L('32 学时学习路径','32-hour learning path')}">${pathwayBody()}</section>`;
}
function selectPathway(sectionId,sessionNo) {
  pathwaySection = sectionId || null;
  pathwaySession = sectionId ? PATHWAY.find((item)=>item.sections.includes(sectionId)).no : Number(sessionNo);
  const session = PATHWAY.find((item)=>item.no===pathwaySession);
  $('#pathway-detail').innerHTML = pathwayDetail();
  document.querySelectorAll('.pathway-session').forEach((button)=>{
    const selected = Number(button.dataset.pathwaySession)===pathwaySession;
    button.classList.toggle('selected',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  document.querySelectorAll('.pathway-node').forEach((button)=>{
    const id = button.dataset.pathwaySection;
    button.classList.toggle('selected',id===pathwaySection);
    button.classList.toggle('related',!pathwaySection&&session.sections.includes(id));
    button.setAttribute('aria-pressed',String(id===pathwaySection));
  });
  if (window.matchMedia('(max-width:1000px)').matches) $('#pathway-detail').scrollIntoView({behavior:'smooth',block:'start'});
}
function home() {
  const next = nextSection();
  const count = doneCount(), percent = Math.round(count/sections.length*100);
  const date = new Intl.DateTimeFormat(isEN() ? 'en-US' : 'zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(new Date());
  return heading(L('每一次探索，都让理解更进一步。','Every exploration deepens your understanding.'),L('欢迎回到你的可视化学习空间，今天也来发现数据的另一面。','Welcome back to your visualization space — come discover another side of data today.'),`<span class="date-label">${icon('calendar')}${date}</span>`)
  + `<div class="hero-layout"><section class="hero"><div class="hero-copy"><span class="hero-kicker">LEARN TO SEE, LEARN TO CREATE</span><h2>${L('让数据，成为<br>看得见的知识。','Turn data into<br>knowledge you can see.')}</h2><p>${L('从数据理解到视觉表达，<br>在讲解、代码与交互演示之间，自由探索。','From data understanding to visual expression —<br>explore freely across explanations, code and interactive demos.')}</p><a class="button" href="${learnHref(next.id)}">${state.last ? L('继续学习','Continue learning') : L('开始第一课','Start lesson one')}${icon('arrow')}</a></div>${heroArt()}</section><section class="progress-panel"><div class="panel-heading"><h3>${L('我的学习进度','My Progress')}</h3><span class="subtle-label">${L('持续积累','Steady growth')}</span></div><div class="progress-center"><div class="progress-ring" style="--progress:${percent}"><div><b>${percent}<span style="font-size:13px">%</span></b><small>${L('课程完成度','Course completed')}</small></div></div><div class="progress-number"><b>${count}<span> / ${sections.length}</span></b>${L('已完成小节','sections done')}</div></div><p class="progress-caption">${count === sections.length ? L('全部小节已完成，回顾笔记巩固所学。','All sections finished — revisit your notes to consolidate.') : `${L('下一站：','Up next:')}<strong>${next.id} ${escape(next.title)}</strong>`}<br>${L('学习记录保存在当前浏览器','Your progress is saved in this browser')}</p></section></div>`
  + `<div class="section-heading"><h2>${L('探索课程','Explore the course')} <small>${L('5 个章节，一条完整的学习路径','5 chapters, one complete learning path')}</small></h2><a class="text-link" href="${learnHref(next.id)}">${L('继续学习','Continue learning')} ${icon('arrow')}</a></div><div class="chapter-grid">${data.chapters.map(chapterCard).join('')}<div class="explore-card"><span class="eyebrow">LEARNING BY DOING</span><h3>${L('不只看懂图表，<br>也能动手创造。','Not just read charts —<br>create them too.')}</h3><p>${L('在互动演示中验证你的理解。','Put your understanding to the test in interactive demos.')}</p><a class="text-link" href="#tools">${L('打开学习工具','Open the tools')} ${icon('arrow')}</a></div></div>`;
}
function lessonRow(s) {
  const done = state.done.includes(s.id), bookmarked = state.bookmarks.includes(s.id);
  return `<div class="lesson-row"><span class="section-number">${s.id}</span><div class="lesson-info"><a class="lesson-title" href="${learnHref(s.id)}">${escape(s.title)}</a><div class="tags">${s.tags.map((tag) => `<span>${escape(tag)}</span>`).join('')}</div></div><span class="lesson-state">${done ? L('已完成','Done') : ''}</span><button class="icon-button ${done?'done':''}" data-action="done" data-id="${s.id}" aria-pressed="${done}" aria-label="${done?L('取消完成','Unmark done'):L('标记完成','Mark done')} ${escape(s.title)}">${icon('check')}</button><button class="icon-button" data-action="bookmark" data-id="${s.id}" aria-pressed="${bookmarked}" aria-label="${bookmarked?L('取消收藏','Remove bookmark'):L('收藏','Bookmark')} ${escape(s.title)}">${icon('bookmark')}</button><a class="icon-button" href="${learnHref(s.id)}" aria-label="${L('学习','Study')} ${escape(s.title)}">${icon('arrow')}</a></div>`;
}
function chapterGroup(ch,items) {
  return `<section class="catalog-chapter" style="${chapterStyle(ch)}"><div class="catalog-head"><span class="chapter-glyph">${icon(glyphs[ch.num-1])}</span><div><h2>${escape(ch.title)}</h2><p>${escape(ch.titleEn)} · ${ch.hours} ${L('学时','hrs')}</p></div><span class="chapter-no">CHAPTER 0${ch.num}</span></div>${items.map(lessonRow).join('')}</section>`;
}
function empty(title,desc,glyph='bookmark') {
  return `<div class="empty-state">${icon(glyph)}<h2>${title}</h2><p>${desc}</p><a class="button" href="${learnHref(sectionById(state.last)?.id || sections[0].id)}">${L('去探索课程','Explore the course')} ${icon('arrow')}</a></div>`;
}
function courses(bookmarks=false) {
  const filtered = sections.filter((s) => (!bookmarks || state.bookmarks.includes(s.id)) && (chapterFilter === 'all' || s.chapter.num === Number(chapterFilter)));
  return heading(bookmarks?L('我的收藏','Bookmarks'):L('全部课程','All Courses'),bookmarks?L('把值得回看的知识放在一起，随时重拾灵感。','Keep the knowledge worth revisiting in one place.'):L('循序渐进，也可以从你感兴趣的知识点开始。','Go step by step, or start wherever interests you.'))
  + `<div class="filter-bar"><button class="chip ${chapterFilter==='all'?'active':''}" data-filter="all" aria-pressed="${chapterFilter==='all'}">${L('全部章节','All chapters')}</button>${data.chapters.map((ch) => `<button class="chip ${Number(chapterFilter)===ch.num?'active':''}" data-filter="${ch.num}" aria-pressed="${Number(chapterFilter)===ch.num}">${L(`第 ${ch.num} 章`,`Ch ${ch.num}`)}</button>`).join('')}<span class="filter-summary">${filtered.length} ${L('个小节','sections')} · ${filtered.filter((s)=>state.done.includes(s.id)).length} ${L('个已完成','done')}</span></div>`
  + (filtered.length ? data.chapters.map((ch) => { const items=filtered.filter((s) => s.chapter.num === ch.num); return items.length ? chapterGroup(ch,items) : ''; }).join('') : empty(bookmarks?L('这里还没有收藏的小节','No bookmarked sections yet'):L('这个章节还没有内容','Nothing in this chapter'),bookmarks?L('点击课程旁的书签图标，把想要回顾的小节收藏起来。','Tap the bookmark icon next to a lesson to save it here.'):L('试试选择其他章节。','Try another chapter.')));
}
function toolsPage() {
  return heading(L('学习工具箱','Toolbox'),L('从概念理解到动手验证，找到适合你的探索方式。','From understanding concepts to hands-on verification — find your way to explore.'))
  + `<div class="tool-grid">${tools.map((tool) => `<a class="tool-card" href="#tool/${tool.name}"><span class="tool-icon" style="--tool-color:${tool.color};--tool-tint:${tool.tint}">${icon(tool.icon)}</span><h2>${L(tool.title, tool.titleEn)}</h2><p>${L(tool.desc, tool.descEn)}</p><span class="text-link">${L(tool.label, tool.labelEn)} ${icon('arrow')}</span></a>`).join('')}</div>`;
}
// 工具嵌入视图：门户顶栏保持原样，工具页在 iframe 内打开（其自带导航被隐藏），左上角提供返回按钮
function toolPage(name) {
  const tool = tools.find((item) => item.name === name);
  if (!tool) { location.hash = '#tools'; return ''; }
  return `<div class="tool-embed"><iframe class="tool-frame" id="tool-frame" src="${tool.href}" title="${escape(L(tool.title, tool.titleEn))}" allow="fullscreen"></iframe></div>`;
}
function wireToolFrame() {
  const frame = $('#tool-frame');
  if (!frame) return;
  frame.addEventListener('load', () => {
    let doc = null;
    try { doc = frame.contentDocument; } catch { /* ignore */ }
    if (!doc) return;
    // 工具页自带的顶部导航与门户顶栏重复，隐藏之
    try { doc.querySelector('.course-topbar')?.remove(); } catch { /* ignore */ }
    paintTheme();
    try { (doc.scrollingElement || doc.documentElement).scrollLeft = 0; } catch { /* ignore */ }
  });
}
function noteEditor(id,compact=false) {
  const s = sectionById(id);
  const value = state.notes[id]?.text || '';
  return `<section class="note-editor"><div class="editor-head"><div><h2>${compact ? L('小节笔记','Section notes') : `${s.id} ${escape(s.title)}`}</h2><small id="note-status">${value?L('已保存在当前浏览器','Saved in this browser'):L('记录此刻的理解','Capture your current understanding')}</small></div>${compact?'':`<a class="icon-button" href="${learnHref(id)}" aria-label="${L('学习本节','Study this section')}">${icon('external')}</a>`}</div><label class="skip-link" for="note-text">${L('本节笔记','Notes for this section')}</label><textarea id="note-text" data-note-id="${id}" placeholder="${L('记录你的理解、疑问，或下一次想尝试的变化…','Write down your understanding, questions, or the next variation to try…')}">${escape(value)}</textarea><div class="editor-foot"><span id="note-length">${value.length} ${L('字','chars')}</span><span>${L('自动保存','Auto-saved')}</span></div></section>`;
}
function notes() {
  noteSection = sectionById(noteSection)?.id || sections.find((s) => state.notes[s.id]?.text.trim())?.id || nextSection().id;
  const noteCount = sections.filter((s) => state.notes[s.id]?.text.trim()).length;
  return heading(L('学习笔记','Notes'),L(`${noteCount} 篇记录，把一时的发现变成自己的知识。`,`${noteCount} entries turning fleeting discoveries into your own knowledge.`),`<button class="button secondary" data-action="export">${icon('download')}${L('导出笔记','Export notes')}</button>`)
  + `<div class="note-layout"><aside class="note-list" aria-label="${L('选择小节笔记','Pick a section')}">${sections.map((s) => `<button class="note-item ${s.id===noteSection?'active':''}" data-note-section="${s.id}" ${s.id===noteSection?'aria-current="true"':''}><b>${s.id} ${escape(s.title)}</b><span>${escape(state.notes[s.id]?.text.slice(0,40) || L('还没有笔记，点击开始记录','No notes yet — tap to start'))}</span></button>`).join('')}</aside>${noteEditor(noteSection)}</div>`;
}
function quiz() {
  const selected = questions.filter((q) => quizFilter === 'all' || q.chapter === Number(quizFilter));
  const answered = selected.filter((q) => state.answers[q.id] !== undefined);
  const correct = answered.filter((q) => state.answers[q.id] === q.a).length;
  return heading(L('课堂自测','Quiz'),L('保留原课程练习题，选择答案后查看反馈与解析。','Original course exercises — pick an answer to see feedback and explanations.'))
  + `<div class="filter-bar"><button class="chip ${quizFilter==='all'?'active':''}" data-quiz-filter="all">${L('全部练习','All exercises')}</button>${data.chapters.map((ch) => `<button class="chip ${Number(quizFilter)===ch.num?'active':''}" data-quiz-filter="${ch.num}">${L(`第 ${ch.num} 章`,`Ch ${ch.num}`)}</button>`).join('')}</div><div class="quiz-summary" aria-live="polite"><div><h2>${correct} / ${selected.length} ${L('答对','correct')}</h2><p>${L('已作答','Answered')} ${answered.length} ${L('题','')} · ${answered.length===selected.length?L('已完成本组练习','Set completed'):L('按照自己的节奏继续','Continue at your own pace')}</p></div><button class="button secondary" data-action="reset-quiz">${L('重做本组','Redo set')}</button></div>`
  + selected.map((q,index) => { const answer=state.answers[q.id], hasAnswer=answer!==undefined; return `<article class="quiz-card"><div class="quiz-top"><span>QUESTION ${String(index+1).padStart(2,'0')}</span><span>${L(`第 ${q.chapter} 章 · 小节 ${q.sec}`,`Ch ${q.chapter} · Sec ${q.sec}`)}</span></div><h3>${escape(q.q[isEN()?'en':'zh'])}</h3><div class="quiz-options">${q.options.map((option,i) => `<button class="quiz-option ${hasAnswer&&i===q.a?'correct':hasAnswer&&i===answer?'wrong':''}" data-question="${q.id}" data-answer="${i}" ${hasAnswer?'disabled':''}><span>${'ABCD'[i]}</span>${escape(option[isEN()?'en':'zh'])}${hasAnswer&&i===q.a?icon('check'):''}</button>`).join('')}</div>${hasAnswer?`<div class="quiz-explanation"><b>${answer===q.a?L('回答正确，继续保持。','Correct — keep it up.'):L(`再想一想，正确答案是 ${'ABCD'[q.a]}。`,`Not quite — the answer is ${'ABCD'[q.a]}.`)}</b>${escape(q.exp[isEN()?'en':'zh'])}<br><a href="${learnHref(q.sec)}">${L('回到相关小节','Back to the section')} ${icon('arrow')}</a></div>`:''}</article>`; }).join('');
}
/* 学习页"课堂自测"小窗 */
function quizModalBody(chNum) {
  const byChapter = questions.filter((q) => q.chapter === Number(chNum));
  const selected = byChapter.length ? byChapter : questions;
  const answered = selected.filter((q) => state.answers[q.id] !== undefined);
  const correct = answered.filter((q) => state.answers[q.id] === q.a).length;
  return `<div class="quiz-modal-head"><div><h2>${L('课堂自测','Quiz')}</h2><p>${correct} / ${selected.length} ${L('答对','correct')} · ${L('已作答','answered')} ${answered.length} ${L('题','')} · ${L(`第 ${Number(chNum)} 章题目`,`Ch ${Number(chNum)} questions`)}</p></div><button type="button" class="quiz-modal-close" data-quiz-modal-close aria-label="${L('关闭','Close')}">✕</button></div><div class="quiz-modal-scroll">${selected.map((q,index) => { const answer=state.answers[q.id], hasAnswer=answer!==undefined; return `<article class="quiz-card"><div class="quiz-top"><span>QUESTION ${String(index+1).padStart(2,'0')}</span><span>${L(`小节 ${q.sec}`,`Sec ${q.sec}`)}</span></div><h3>${escape(q.q[isEN()?'en':'zh'])}</h3><div class="quiz-options">${q.options.map((option,i) => `<button class="quiz-option ${hasAnswer&&i===q.a?'correct':hasAnswer&&i===answer?'wrong':''}" data-question="${q.id}" data-answer="${i}" ${hasAnswer?'disabled':''}><span>${'ABCD'[i]}</span>${escape(option[isEN()?'en':'zh'])}${hasAnswer&&i===q.a?icon('check'):''}</button>`).join('')}</div>${hasAnswer?`<div class="quiz-explanation"><b>${answer===q.a?L('回答正确，继续保持。','Correct — keep it up.'):L(`再想一想，正确答案是 ${'ABCD'[q.a]}。`,`Not quite — the answer is ${'ABCD'[q.a]}.`)}</b>${escape(q.exp[isEN()?'en':'zh'])}</div>`:''}</article>`; }).join('')}</div>`;
}
function openQuizModal(chNum) {
  closeQuizModal();
  const overlay=document.createElement('div');
  overlay.className='quiz-modal';
  overlay.id='quiz-modal';
  overlay.innerHTML=`<div class="quiz-modal-mask" data-quiz-modal-close></div><div class="quiz-modal-panel" role="dialog" aria-modal="true" aria-label="${L('课堂自测','Quiz')}">${quizModalBody(chNum)}</div>`;
  overlay.dataset.chapter=chNum;
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';
}
function closeQuizModal() {
  $('#quiz-modal')?.remove();
  document.body.style.overflow='';
}
function refreshQuizModal() {
  const overlay=$('#quiz-modal');
  if (!overlay) return;
  overlay.querySelector('.quiz-modal-panel').innerHTML=quizModalBody(overlay.dataset.chapter);
}
// 学习进度面板条目（供 learn() 渲染与完成状态变更后原地刷新共用）
function learnProgressListHTML(curNum) {
  return data.chapters.map((ch)=>{const done=ch.sections.filter((it)=>state.done.includes(it.id)).length;const pct=Math.round(done/ch.sections.length*100);const cur=ch.num===curNum;return `<div class="learn-progress-item ${cur?'current':''}"><a class="learn-progress-ch" href="#courses/${ch.num}"><span class="learn-progress-name">${L(`第 ${ch.num} 章`,`Ch ${ch.num}`)} · ${escape(L(ch.title, ch.titleEn))}</span><span class="learn-progress-pct">${pct}%</span></a><div class="progress-track" style="--chapter-color:${colors[ch.num-1]}"><span style="width:${pct}%"></span></div><small>${done}/${ch.sections.length} ${L('已完成','done')}</small></div>`;}).join('');
}
// 完成状态变化后实时刷新进度条（不重载课程 iframe）
function syncLearnProgress() {
  const host = $('.learn-progress-list');
  if (!host) return;
  const cur = sectionById(currentRoute().id)?.chapter.num;
  host.innerHTML = learnProgressListHTML(cur);
}
function learn(id) {
  const s = sectionById(id);
  if (!s) return empty(L('没有找到这个小节','Section not found'),L('请从课程目录选择一个小节。','Pick a section from the course list.'),'book');
  state.last = id;
  save();
  const index = sections.indexOf(s), done = state.done.includes(id);
  return `<div class="learn-layout"><div class="learn-banner"><div class="learn-banner-copy"><h1>${L(`第 ${s.chapter.num} 章`,`Ch ${s.chapter.num}`)} ${escape(L(s.chapter.title, s.chapter.titleEn))}</h1><p class="subtitle">Doc-0${s.chapter.num} ${L('集成教学页面 · 讲解 ⇄ 代码 ⇄ 演示 三 tab 切换','integrated teaching page · Explain ⇄ Code ⇄ Demo, three switchable tabs')}</p></div><div class="learn-banner-tip"><span class="kbd">Tab</span> ${L('切换章节 · 每个章节内三 tab 自由切换','to switch chapters · within a chapter, switch the three tabs freely')}</div></div><div class="learn-body"><div><iframe class="lesson-frame" id="lesson-frame" src="${s.chapter.href}#ch-${id}" title="${escape(s.title)}：原课程讲解、代码与演示" allow="fullscreen"></iframe></div><aside class="learn-aside"><section class="panel learn-progress-panel"><h2>${L('学习进度','Progress')}</h2><div class="learn-progress-list">${learnProgressListHTML(s.chapter.num)}</div><button type="button" class="button learn-quiz-btn" data-quiz-modal="${s.chapter.num}">${L('课堂自测','Quiz')} ${icon('arrow')}</button></section>${noteEditor(id,true)}</aside></div></div>`;
}
function currentRoute() {
  const [view='home',id] = location.hash.replace(/^#/,'').split('/');
  const aliases = {chapters:'courses',top:'home',main:'home'};
  return {view: aliases[view] || view || 'home',id};
}
// 把“标记完成 / 收藏 / 分享”做成图标按钮，注入课程页每个小节标题的右侧
function injectLessonActions(doc) {
  const chapters = doc.querySelectorAll('.chapter[id^="ch-"]');
  if (!chapters.length) return;
  if (!doc.getElementById('lesson-actions-style')) {
    const style = doc.createElement('style');
    style.id = 'lesson-actions-style';
    style.textContent = [
      '.chapter h2{display:flex;align-items:center;gap:12px}',
      '.sec-actions{display:inline-flex;gap:6px;margin-left:auto}',
      '.sec-actions button{width:26px;height:26px;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:13px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}',
      '.sec-actions button:hover{border-color:#c7d2fe;background:#eef2ff;color:#4338ca}',
      '.sec-actions button.is-on{background:#4338ca;border-color:#4338ca;color:#fff}'
    ].join('\n');
    doc.head.appendChild(style);
  }
  const paintAll = () => {
    chapters.forEach((c) => {
      const sid = c.id.replace(/^ch-/, '');
      if (!sectionById(sid)) return;
      let box = c.querySelector('.sec-actions');
      if (!box) {
        const h2 = c.querySelector('h2');
        if (!h2) return;
        box = doc.createElement('span');
        box.className = 'sec-actions';
        box.innerHTML = `<button type="button" data-act="done" title="${L('标记完成','Mark done')}">✓</button><button type="button" data-act="bookmark" title="${L('收藏本节','Bookmark')}">☆</button><button type="button" data-act="share" title="${L('分享本节','Share')}">↗</button>`;
        h2.appendChild(box);
      }
      const done = state.done.includes(sid), marked = state.bookmarks.includes(sid);
      box.querySelector('[data-act="done"]').classList.toggle('is-on', done);
      const bm = box.querySelector('[data-act="bookmark"]');
      bm.classList.toggle('is-on', marked);
      bm.textContent = marked ? '★' : '☆';
    });
  };
  paintAll();
  doc.addEventListener('click', (event) => {
    const btn = event.target.closest('.sec-actions [data-act]');
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    const sid = btn.closest('.chapter').id.replace(/^ch-/, '');
    if (!sectionById(sid)) return;
    if (btn.dataset.act === 'share') {
      const shareURL = location.origin + location.pathname + learnHref(sid);
      (navigator.clipboard ? navigator.clipboard.writeText(shareURL) : Promise.reject())
        .then(() => toast(L('分享链接已复制到剪贴板。','Share link copied to clipboard.')))
        .catch(() => toast(L('复制失败，请手动复制地址栏链接。','Copy failed — please copy the address manually.')));
      return;
    }
    const key = btn.dataset.act === 'done' ? 'done' : 'bookmarks';
    const was = state[key].includes(sid);
    state[key] = was ? state[key].filter((v) => v !== sid) : [...state[key], sid];
    if (save()) toast(btn.dataset.act === 'done' ? (was ? L('已取消完成标记。','Done mark removed.') : L('已记录，向前迈进了一步。','Noted — one step forward.')) : (was ? L('已取消收藏。','Bookmark removed.') : L('已加入我的收藏。','Added to bookmarks.')));
    paintAll();
    navigation('learn');
    syncLearnProgress();
  });
}
function wireLessonFrame() {
  const frame = $('#lesson-frame');
  if (!frame) return;
  frame.addEventListener('load', () => {
    let doc = null;
    try { doc = frame.contentDocument; } catch { /* 跨域受限 */ }
    if (!doc) return;
    // 章节标题横幅已由学习页自身渲染，隐藏课程页内部的顶部导航与标题，避免重复
    try {
      doc.querySelector('.course-topbar')?.remove();
      doc.querySelector('.lesson-header')?.remove();
    } catch { /* ignore */ }
    // 宽屏：学习工作区固定一屏高，课程页不在 iframe 层滚动，
    // 由目录 / 正文两个组件各自内部滚动
    try {
      const style = doc.createElement('style');
      style.id = 'learn-embed-style';
      style.textContent = [
        '@media (min-width: 1001px) {',
        '  html, body { height: 100% !important; overflow: hidden !important; }',
        '  body { display: flex; flex-direction: column; }',
        '  .lesson-main { flex: 1 1 auto; min-height: 0; height: auto; overflow: hidden; align-items: stretch; padding: 0; margin: 0; }',
        '  .chapter-nav { position: static !important; align-self: stretch !important; height: 100%; overflow-y: auto; }',
        '  .chapter-content { height: 100%; overflow-y: auto; }',
        '  .lesson-footer, .chapter-pager { display: none !important; }',
        '}'
      ].join('\n');
      doc.head.appendChild(style);
    } catch { /* ignore */ }
    // 课程页脚本会调用 scrollIntoView（如激活章节后滚到 demo），
    // 该调用会跨文档滚动外层页面。此处重写为在组件内部滚动（最近的可滚动祖先）。
    try {
      const cw = frame.contentWindow;
      const proto = cw.Element.prototype;
      if (!proto.__scrollIntoViewPatched) {
        proto.__scrollIntoViewPatched = true;
        proto.scrollIntoView = function (...args) {
          const opts = (args.length && typeof args[0] === 'object' && args[0]) || {};
          let el = this.parentElement;
          while (el) {
            const s = cw.getComputedStyle(el);
            if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) break;
            el = el.parentElement;
          }
          const scroller = el || doc.scrollingElement || doc.documentElement;
          const top = this.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
          scroller.scrollTo({ top, behavior: opts.behavior || 'auto' });
        };
      }
    } catch { /* ignore */ }
    window.scrollTo(0, 0);
    try { (doc.scrollingElement || doc.documentElement).scrollLeft = 0; } catch { /* ignore */ }
    paintTheme();
    injectLessonActions(doc);
    // Keep the outer progress and notes aligned with navigation inside the course.
    doc.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || event.ctrlKey || event.metaKey) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      const chapterMatch = url.pathname.match(/\/lesson-0([1-5])\/(?:index\.html)?$/);
      const section = sectionById(url.hash.replace('#ch-', ''));
      const chapter = chapterMatch && data.chapters.find((ch) => ch.num === Number(chapterMatch[1]));
      const homeURL = new URL('./', location.href);
      const homeLink = url.pathname === homeURL.pathname && !url.hash;
      if (chapter || homeLink) {
        event.preventDefault();
        event.stopPropagation();
        location.hash = chapter ? learnHref(section?.id || chapter.sections[0].id) : '#home';
      }
    }, true);
  });
}
function render({scroll=true}={}) {
  const {view,id} = currentRoute();
  // 课程目录页已移除：#courses 与 #courses/N 直接进入对应内容页
  if (view === 'courses') {
    const ch = id && data.chapters.find((c) => c.num === Number(id));
    location.hash = learnHref(ch ? ch.sections[0].id : (sectionById(state.last)?.id || sections[0].id));
    return;
  }
  const en = isEN();
  const names = Object.fromEntries(Object.entries(PAGE_LABELS).map(([k,v]) => [k, v[en ? 1 : 0]]));
  navigation(view);
  renderTopbarTools();
  document.title = `${names[view] || names.home} · ${en ? 'Visualization Lab' : '可视化导论'}`;
  const renderers={home,tools:toolsPage,bookmarks:()=>courses(true),notes,quiz,learn:()=>learn(id),pathway:pathwayPage,tool:()=>toolPage(id)};
  $('#main').innerHTML=(renderers[view] || home)();
  // 学习工作区 / 工具嵌入视图为固定一屏布局，隐藏页脚避免整页出现滚动
  document.body.classList.toggle('learn-view', view === 'learn');
  document.body.classList.toggle('tool-view', view === 'tool');
  const backButton = $('#topbar-back');
  if (backButton) backButton.hidden = view !== 'tool';
  wireLessonFrame();
  wireToolFrame();
  if (scroll) window.scrollTo({top:0,behavior:'instant'});
}
function exportNotes() {
  const written=sections.filter((s) => state.notes[s.id]?.text.trim());
  if (!written.length) { toast(L('先写下一点想法，再导出笔记。','Write something down before exporting.')); return; }
  const text=`# ${L('可视化导论 · 我的学习笔记','Introduction to Visualization · My Notes')}\n\n`+written.map((s)=>`## ${s.id} ${s.title}\n\n${state.notes[s.id].text}\n`).join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));
  const link=document.createElement('a'); link.href=url; link.download=L('可视化导论-学习笔记.md','Visualization-Notes.md'); link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast(L('学习笔记已导出。','Notes exported.'));
}
function bindEvents() {
  document.addEventListener('click',(event) => {
    if (event.target.closest('#topbar-back')) { location.hash = '#tools'; return; }
    const localeBtn=event.target.closest('[data-set-locale]');
    if (localeBtn) { setLocaleGlobally(localeBtn.dataset.setLocale); return; }
    if (event.target.closest('[data-toggle-theme]')) { toggleTheme(); return; }
    const quizModalBtn=event.target.closest('[data-quiz-modal]');
    if (quizModalBtn) { openQuizModal(quizModalBtn.dataset.quizModal); return; }
    if (event.target.closest('[data-quiz-modal-close]')) { closeQuizModal(); return; }
    const pathwayNode = event.target.closest('[data-pathway-section]');
    if (pathwayNode) selectPathway(pathwayNode.dataset.pathwaySection);
    const pathwayClass = event.target.closest('[data-pathway-session]');
    if (pathwayClass) selectPathway(null,pathwayClass.dataset.pathwaySession);
    const filter=event.target.closest('[data-filter]');
    if (filter) { chapterFilter=filter.dataset.filter; if(currentRoute().view==='courses'&&currentRoute().id) history.replaceState(null,'','#courses'); render({scroll:false}); }
    const qFilter=event.target.closest('[data-quiz-filter]');
    if (qFilter) { quizFilter=qFilter.dataset.quizFilter; render({scroll:false}); }
    const note=event.target.closest('[data-note-section]');
    if (note) { noteSection=note.dataset.noteSection; render({scroll:false}); }
    const action=event.target.closest('[data-action]');
    if (action) {
      const {action:type,id}=action.dataset;
      if (type==='done' || type==='bookmark') {
        const key=type==='done'?'done':'bookmarks';
        const was=state[key].includes(id);
        state[key]=was?state[key].filter((value)=>value!==id):[...state[key],id];
        const persisted=save();
        if (currentRoute().view==='learn') {
          // Keep the course iframe and current demo mounted while updating controls.
          action.setAttribute('aria-pressed',String(!was));
          if (type==='done') {
            action.innerHTML=`${icon('check')}${was?L('标记为完成','Mark as done'):L('已完成本节','Section completed')}`;
            action.classList.toggle('subtle',!was);
          } else action.setAttribute('aria-label',was?L('收藏本节','Bookmark this section'):L('取消收藏本节','Remove bookmark'));
          navigation('learn');
          syncLearnProgress();
        } else render({scroll:false});
        if(persisted) toast(type==='done'?(was?L('已取消完成标记。','Done mark removed.'):L('已记录，向前迈进了一步。','Noted — one step forward.')):(was?L('已取消收藏。','Bookmark removed.'):L('已加入我的收藏。','Added to bookmarks.')));
      }
      if(type==='export') exportNotes();
      if(type==='reset-quiz') { questions.filter((q)=>quizFilter==='all'||q.chapter===Number(quizFilter)).forEach((q)=>delete state.answers[q.id]); save(); render({scroll:false}); toast(L('本组练习已重置。','This set has been reset.')); }
    }
    const answer=event.target.closest('[data-question]');
    if(answer && !answer.disabled) { state.answers[answer.dataset.question]=Number(answer.dataset.answer); save(); render({scroll:false}); refreshQuizModal(); }
  });
  document.addEventListener('keydown',(event)=>{ if(event.key==='Escape') closeQuizModal(); });
  document.addEventListener('input',(event)=>{
    if(event.target.id!=='note-text') return;
    const {noteId}=event.target.dataset, text=event.target.value;
    if(text.trim()) state.notes[noteId]={text,updated:new Date().toISOString()};
    else delete state.notes[noteId];
    const persisted=save();
    $('#note-status').textContent=persisted?L('已保存在当前浏览器','Saved in this browser'):L('未能保存，请导出笔记','Not saved — export your notes');
    $('#note-length').textContent=`${text.length} ${L('字','chars')}`;
    const preview=document.querySelector(`[data-note-section="${noteId}"] span`);
    if(preview) preview.textContent=text.trim()?text.slice(0,40):L('还没有笔记，点击开始记录','No notes yet — tap to start');
  });
  document.addEventListener('change',(event)=>{if(event.target.id==='learn-select') location.hash=learnHref(event.target.value);});
  window.addEventListener('hashchange',()=>{render();});
}
async function boot() {
  try {
    const response=await fetch('portal-data.json');
    if(!response.ok) throw new Error('Course data unavailable');
    data=await response.json();
    sections=data.chapters.flatMap((chapter)=>chapter.sections.map((s)=>({...s,chapter})));
    questions=data.quiz.flatMap((group)=>group.items.map((q,i)=>({...q,id:`${group.ch}-${i}`,chapter:group.ch})));
    // Discard references to sections that are no longer part of the course.
    state.done=state.done.filter((id)=>sectionById(id)); state.bookmarks=state.bookmarks.filter((id)=>sectionById(id));
    paintTheme();
    bindEvents();render();
  } catch(error) {
    $('#main').innerHTML=`<section class="error-panel"><h1>${L('学习空间暂时无法加载','The learning space failed to load')}</h1><p>${L('请通过本地 HTTP 服务打开站点，或刷新后重试。课程资料仍可直接访问。','Open the site via a local HTTP server, or refresh and retry. Course materials remain directly accessible.')}</p><a class="button" href="lesson-01/">${L('打开第一章课程','Open chapter one')}</a></section>`;
    console.error(error);
  }
}
boot();

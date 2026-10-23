#!/usr/bin/env node
// =============================================================
// mirror-site.js — 递归镜像线上 supplementary/ 与 lesson-01/demo/ 子页面
// 仅下载文本与图片资源（不下载任何视频），保证本地离线预览完整。
//   用法： node mirror-site.js
// =============================================================

const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = __dirname;
const BASE = "https://cinger007.github.io/vis/";

// 入口 HTML 页面（相对站点根）
const SEEDS = [
  "supplementary/index.html",
  "lesson-01/demo/index.html",
];

// supplementary 入口页里列出的子页面（同名文件在 supplementary/ 下）
const SUPP_SUBPAGES = [
  "calendar.html","calendar1.html","calendar3.html","colormap.html","contour.html",
  "contourd3.html","crime1985.html","mark.html","newstudent.html","nssystem.html",
  "regression.html","sex_compare.html","tableshow.html","treelist.html",
  "volumeRendering.html","yearcalendar.html",
];
for (const s of SUPP_SUBPAGES) SEEDS.push("supplementary/" + s);

// lesson-01/demo 入口页里列出的子 demo
const DEMO_SUBPAGES = [
  "01-data-loader/index.html","02-dikw-pyramid/index.html","03-attribute-types/index.html",
  "04-d3-array-ops/index.html","05-selectors/index.html",
];
for (const s of DEMO_SUBPAGES) SEEDS.push("lesson-01/demo/" + s);

const seen = new Set();
const queue = [];
const failed = [];
const downloaded = [];

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 35000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        res.resume();
        return get(next).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
  });
}

function normalize(rel, fromDir) {
  // 把页面里的相对引用解析为站点内相对路径；返回 null 表示跳过
  if (/^(https?:|mailto:|javascript:|data:|#)/i.test(rel)) return null;
  rel = rel.split("#")[0].split("?")[0];
  if (!rel) return null;
  let joined;
  if (rel.startsWith("/")) {
    joined = rel.replace(/^\//, "");
  } else {
    joined = (fromDir ? fromDir + "/" : "") + rel;
  }
  const parts = [];
  for (const seg of joined.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  const out = parts.join("/");
  // 只镜像 vis 站内的 supplementary / lesson-* / assets / data / portal 目录
  if (!/^(supplementary|lesson-0\d|assets|data|portal|i18n)/.test(out)) return null;
  return out;
}

function extractRefs(html, pageRel) {
  const dir = path.posix.dirname(pageRel);
  const refs = [];
  const re = /(?:src|href)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const n = normalize(m[1], dir === "." ? "" : dir);
    if (n) refs.push(n);
  }
  // lesson.js 等脚本里引用的 data/ 资源由 fetch-assets.js 处理，这里不重复
  return refs;
}

(async () => {
  for (const s of SEEDS) queue.push(s);

  while (queue.length) {
    const rel = queue.shift();
    if (seen.has(rel)) continue;
    seen.add(rel);

    // 已存在的文件跳过（比如已下载过的 data/img）
    const dest = path.join(ROOT, rel);
    if (fs.existsSync(dest)) continue;

    try {
      const buf = await get(BASE + rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, buf);
      downloaded.push(rel);

      // HTML 继续解析引用
      if (/\.html?$/i.test(rel)) {
        const text = buf.toString("utf8");
        for (const r of extractRefs(text, rel)) {
          if (!seen.has(r)) queue.push(r);
        }
      }
    } catch (e) {
      failed.push(rel + "  (" + e.message + ")");
    }
  }

  console.log(`✅ 新下载 ${downloaded.length} 个文件，跳过/已存在 ${[...seen].length - downloaded.length} 个，失败 ${failed.length} 个`);
  if (failed.length) {
    console.log("失败列表：");
    failed.forEach((f) => console.log("  " + f));
  }
})();

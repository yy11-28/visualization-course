#!/usr/bin/env node
// =============================================================
// localize-refs.js — 把 supplementary / demo 页面的外部 D3 引用指向本地副本
//   1. UMD <script src="https://...d3...">  → 直接替换为相对路径
//   2. ESM import（CDN URL / 裸名 "d3"）     → 注入 importmap
// 幂等：重复运行不会二次注入。
// =============================================================

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

// ---------- 1. UMD script src 替换 ----------
const UMD_MAP = [
  [/https:\/\/cdn\.jsdelivr\.net\/npm\/d3@7(?=["'])/g, "../assets/d3.v7.min.js"],
  [/https:\/\/d3js\.org\/d3\.v7(\.min)?\.js/g, "../assets/d3.v7.min.js"],
  [/https:\/\/unpkg\.com\/d3-regression@[^"']+\/dist\/d3-regression(\.min)?\.js/g, "../assets/d3-regression.min.js"],
];

// ---------- 2. importmap 注入（ESM） ----------
function importmapFor(dirDepth) {
  const up = "../".repeat(dirDepth);
  return (
    `<script type="importmap">\n` +
    `{\n` +
    `  "imports": {\n` +
    `    "https://cdn.jsdelivr.net/npm/d3@7/+esm": "${up}assets/d3.v7.esm.js",\n` +
    `    "d3": "${up}assets/d3.v7.esm.js"\n` +
    `  }\n` +
    `}\n` +
    `</script>`
  );
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.html?$/i.test(e.name)) out.push(p);
  }
  return out;
}

let umdFixed = 0, mapsAdded = 0, scanned = 0;

for (const base of ["supplementary", "lesson-01/demo", "lesson-01", "lesson-02", "lesson-03", "lesson-04", "lesson-05"]) {
  const files = walk(path.join(ROOT, base));
  for (const file of files) {
    scanned++;
    let src = fs.readFileSync(file, "utf8");
    const before = src;

    // 相对站点根的深度（用于拼 ../assets）
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const depth = rel.split("/").length - 1; // 目录深度
    const up = "../".repeat(depth);

    // 1) UMD 替换（注意 supplementary 之外路径深度不同）
    for (const [re, target] of UMD_MAP) {
      src = src.replace(re, (up + target.replace(/^\.\.\//, "")));
    }

    // 2) importmap：只给含 ESM d3 import 的页面注入
    const hasEsmD3 = /import\s+[^;]*d3[^;]*from\s*["'](https:\/\/cdn\.jsdelivr\.net\/npm\/d3@7\/\+esm|"d3")/.test(src)
      || /import\s*\*\s*as\s*d3\s+from\s*["']d3["']/.test(src);
    if (hasEsmD3 && !src.includes('type="importmap"')) {
      const map = importmapFor(depth);
      if (/<\/head>/i.test(src)) {
        src = src.replace(/<\/head>/i, map + "\n</head>");
      } else {
        src = map + "\n" + src;
      }
    }

    if (src !== before) {
      fs.writeFileSync(file, src, "utf8");
      if (src.match(/assets\/d3/g)?.length) umdFixed++;
      if (src.includes('type="importmap"')) mapsAdded++;
      console.log("updated:", rel);
    }
  }
}

console.log(`\n扫描 ${scanned} 个 HTML；更新 ${umdFixed} 处 UMD 引用；importmap 注入累计 ${mapsAdded} 页`);

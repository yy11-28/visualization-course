#!/usr/bin/env node
// add-favicon.js — 给所有页面注入内联 SVG favicon（零额外文件，纯 data URI）
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const FAV =
  `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%234f46e5'/%3E%3Crect x='22' y='52' width='14' height='26' rx='3' fill='%23a5b4fc'/%3E%3Crect x='43' y='36' width='14' height='42' rx='3' fill='%23e0e7ff'/%3E%3Crect x='64' y='22' width='14' height='56' rx='3' fill='%23ffffff'/%3E%3C/svg%3E" />`;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.html?$/i.test(e.name)) out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  // 排除镜像来的 lecture 渲染页（第三方模板结构）
  if (rel.includes("lecture/")) continue;
  let src = fs.readFileSync(file, "utf8");
  if (src.includes('rel="icon"') || src.includes("favicon")) continue;
  if (/<head[^>]*>/i.test(src)) {
    src = src.replace(/<head([^>]*)>/i, (m) => m + "\n  " + FAV);
    fs.writeFileSync(file, src, "utf8");
    n++;
  }
}
console.log(`✅ 已为 ${n} 个页面添加内联 favicon`);

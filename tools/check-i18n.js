#!/usr/bin/env node
// check-i18n.js — 找出 HTML 中使用、但 i18n.js 字典缺失的键
const fs = require("fs");
const path = require("path");

// 支持在根目录或 tools/ 下运行
const ROOT = require("fs").existsSync(require("path").join(__dirname, "i18n.js"))
  ? __dirname
  : require("path").resolve(__dirname, "..");

// 粗略提取 zh-CN 字典的键
const i18nSrc = fs.readFileSync(path.join(ROOT, "i18n.js"), "utf8");
const zhBlock = i18nSrc.split("'zh-CN':")[1]?.split("'en-US':")[0] || "";
const dictKeys = new Set([...zhBlock.matchAll(/'([\w.-]+)':/g)].map((m) => m[1]));

const pages = ["index.html"];
for (let i = 1; i <= 5; i++) pages.push(path.join(`lesson-0${i}`, "index.html"));

const used = new Map();
for (const p of pages) {
  const src = fs.readFileSync(path.join(ROOT, p), "utf8");
  for (const m of src.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) {
    const k = m[1];
    if (!used.has(k)) used.set(k, []);
    used.get(k).push(p);
  }
}

const missing = [...used.keys()].filter((k) => !dictKeys.has(k));
console.log(`字典键数: ${dictKeys.size}，页面使用键数: ${used.size}`);
console.log(`缺失 ${missing.length} 个：`);
for (const k of missing) {
  const pages_ = [...new Set(used.get(k))].join(", ");
  console.log(`  ${k}   <- ${pages_}`);
}

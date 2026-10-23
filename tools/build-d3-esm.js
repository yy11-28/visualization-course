#!/usr/bin/env node
// =============================================================
// build-d3-esm.js — 把 UMD 版 d3.min.js 包装成真正的 ES module
//
// 目的：lesson.js 里写死的是
//   import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"
// 通过 importmap 把它映射到本地 ./assets/d3.v7.esm.js 即可离线可用，
// 从而完全不必改动任何章节正文与 lesson.js 源码。
//
// 关键点：D3 自身导出了 window / document / event 等与全局对象同名的 API。
// 若在模块顶层写 `const { window } = api`，该声明会遮蔽全局 window 并处于 TDZ，
// 导致 D3 内部访问 window 时报 "Cannot access 'window' before initialization"。
// 因此这里统一用「别名常量 + export { alias as realName }」的方式导出。
//
// 用法： node build-d3-esm.js
// =============================================================

const fs = require("fs");
const path = require("path");

const UMD = path.join(__dirname, "assets", "d3.v7.min.js");
const OUT = path.join(__dirname, "assets", "d3.v7.esm.js");

if (!fs.existsSync(UMD)) {
  console.error("缺少 UMD 构建：assets/d3.v7.min.js");
  process.exit(1);
}

let d3;
try {
  d3 = require(UMD); // 借助 Node 的 CJS 环境拿到完整 API 列表
} catch (e) {
  console.error("无法解析 D3 UMD 构建：", e.message);
  process.exit(1);
}

const RESERVED = new Set([
  "break","case","catch","class","const","continue","debugger","default","delete",
  "do","else","enum","export","extends","false","finally","for","function","if",
  "import","in","instanceof","new","null","return","super","switch","this","throw",
  "true","try","typeof","var","void","while","with","yield","let","static",
  "implements","package","protected","interface","private","public","await",
  "arguments","eval",
]);

const names = Object.keys(d3)
  .filter((n) => /^[A-Za-z_$][\w$]*$/.test(n))
  .filter((n) => !RESERVED.has(n));

const src = fs.readFileSync(UMD, "utf8");

// 为每个 API 生成一个不冲突的别名常量
const consts = names
  .map((n, i) => `const __d3_${i} = __d3api[${JSON.stringify(n)}];`)
  .join("\n");

// 以别名导出真实名称，避免在模块作用域引入同名绑定
const exp = names.length
  ? `export {\n${names.map((n, i) => `  __d3_${i} as ${n}`).join(",\n")}\n};`
  : "export {};";

const out =
  "/* d3.v7.esm.js — 由 build-d3-esm.js 自动生成：UMD 构建 + ESM 命名导出 */\n" +
  "/* 请勿手工编辑；重新生成： node build-d3-esm.js */\n" +
  "var module = { exports: {} };\n" +
  "var exports = module.exports;\n" +
  src +
  "\n\nvar __d3api = module.exports;\n" +
  consts +
  "\n" +
  exp +
  "\nexport default __d3api;\n";

fs.writeFileSync(OUT, out, "utf8");
console.log(
  `✅ 已生成 ${path.relative(__dirname, OUT)}  (${(out.length / 1024).toFixed(0)} KB, ${names.length} 个导出)`
);

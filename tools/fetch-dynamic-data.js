#!/usr/bin/env node
// fetch-dynamic-data.js — 扫描 JS/HTML 中动态 fetch 的 data/img 引用并镜像下载
// v2：按「引用所在文件的目录」解析相对路径，保留真实站点路径。
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = __dirname;
const BASE = "https://cinger007.github.io/vis/";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html?|js)$/i.test(e.name)) out.push(p);
  }
  return out;
}

// { "supplementary/data/xxx.csv": ["supplementary/calendar.html", ...] }
const refs = new Map();

for (const base of ["supplementary", "lesson-01", "lesson-02", "lesson-03", "lesson-04", "lesson-05"]) {
  for (const file of walk(path.join(ROOT, base))) {
    const relFile = path.relative(ROOT, file).replace(/\\/g, "/");
    const dir = path.posix.dirname(relFile);
    const src = fs.readFileSync(file, "utf8");
    const re = /["'`(]((?:\.\.?\/|\.)?(?:data|img|assets)\/[\w.\-/]+\.(?:csv|json|tsv|png|jpe?g|svg|txt))["'`)]/gi;
    let m;
    while ((m = re.exec(src))) {
      const raw = m[1];
      const parts = [];
      for (const seg of (dir === "." ? [] : dir.split("/")).concat(raw.split("/"))) {
        if (seg === "" || seg === ".") continue;
        if (seg === "..") parts.pop(); else parts.push(seg);
      }
      const norm = parts.join("/");
      if (!refs.has(norm)) refs.set(norm, new Set());
      refs.get(norm).add(relFile);
    }
  }
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 35000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return get(new URL(res.headers.location, url).href).then(resolve, reject);
      if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("timeout", function () { this.destroy(new Error("timeout")); })
      .on("error", reject);
  });
}

(async () => {
  let ok = 0, fail = 0;
  for (const [rel, users] of [...refs].sort()) {
    const dest = path.join(ROOT, rel);
    if (fs.existsSync(dest)) { ok++; continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      const buf = await get(BASE + rel);
      fs.writeFileSync(dest, buf);
      console.log(`OK   ${rel}  (${(buf.length / 1024).toFixed(1)} KB)`);
      ok++;
    } catch (e) {
      console.log(`FAIL ${rel}  (${e.message})  <- ${[...users][0]}`);
      fail++;
    }
  }
  console.log(`\n共 ${refs.size} 个引用：可用 ${ok}，失败 ${fail}`);
})();

#!/usr/bin/env node
// fetch-plugin.js — 从 npmmirror 下载 d3-regression 插件（supplementary/regression 页面依赖）
const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");
const os = require("os");

const OUT = path.join(__dirname, "assets", "d3-regression.min.js");
if (fs.existsSync(OUT)) { console.log("已存在，跳过"); process.exit(0); }

const TGZ = path.join(os.tmpdir(), "d3reg.tgz");
const url = "https://registry.npmmirror.com/d3-regression/-/d3-regression-1.3.10.tgz";

function get(u) {
  return new Promise((resolve, reject) => {
    https.get(u, { timeout: 40000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return get(new URL(res.headers.location, u).href).then(resolve, reject);
      if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

(async () => {
  const buf = await get(url);
  fs.writeFileSync(TGZ, buf);
  const tmp = path.join(os.tmpdir(), "d3reg_" + Date.now());
  fs.mkdirSync(tmp, { recursive: true });
  execSync(`tar -xzf "${TGZ}" -C "${tmp}"`);
  const src = path.join(tmp, "package", "dist", "d3-regression.min.js");
  if (!fs.existsSync(src)) { console.error("包内未找到 dist/d3-regression.min.js"); process.exit(1); }
  fs.copyFileSync(src, OUT);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.rmSync(TGZ, { force: true });
  console.log(`✅ 已下载 assets/d3-regression.min.js (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);
})();

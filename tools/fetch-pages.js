#!/usr/bin/env node
// fetch-pages.js — 镜像 supplementary 页面与各章 demo 目录 / lecture 页面
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = __dirname;
const BASE = "https://cinger007.github.io/vis";

const PAGES = [
  ["supplementary/index.html", `${BASE}/supplementary/`],
  ["lesson-01/demo/index.html", `${BASE}/lesson-01/demo/`],
  ["lesson-02/demo/index.html", `${BASE}/lesson-02/demo/`],
  ["lesson-03/demo/index.html", `${BASE}/lesson-03/demo/`],
  ["lesson-04/demo/index.html", `${BASE}/lesson-04/demo/`],
  ["lesson-05/demo/index.html", `${BASE}/lesson-05/demo/`],
  ["lesson-01/lecture/index.html", `${BASE}/lesson-01/lecture`],
  ["lesson-02/lecture/index.html", `${BASE}/lesson-02/lecture`],
  ["lesson-03/lecture/index.html", `${BASE}/lesson-03/lecture`],
  ["lesson-04/lecture/index.html", `${BASE}/lesson-04/lecture`],
  ["lesson-05/lecture/index.html", `${BASE}/lesson-05/lecture`],
];

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

(async () => {
  for (const [out, url] of PAGES) {
    const dest = path.join(ROOT, out);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      const buf = await get(url);
      fs.writeFileSync(dest, buf);
      console.log(`OK   ${out}  (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.log(`FAIL ${out}  ${e.message}`);
    }
  }
})();

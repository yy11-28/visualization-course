#!/usr/bin/env node
// fetch-assets.js — 把各章节页引用的图片/数据文件镜像到本地，保证离线预览完整。
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = __dirname;
const BASE = "https://cinger007.github.io/vis/lesson-0";

const FILES = [
  [1, "data/join.png"],
  [1, "data/newstudent.csv"],
  [2, "data/newstudent.csv"],
  [2, "img/01-mackinlay-ranking.png"],
  [2, "img/02-marks-points-lines-areas.png"],
  [2, "img/03-channels-position-color-shape.png"],
  [2, "img/04-magnitude-channels.png"],
  [2, "img/05-identity-channels.png"],
  [4, "data/crime.csv"],
  [5, "data/french_names.json"],
  [5, "data/weather_2024.csv"],
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
    req.on("timeout", () => { req.destroy(new Error("timeout")); });
    req.on("error", reject);
  });
}

(async () => {
  for (const [n, rel] of FILES) {
    const out = path.join(ROOT, `lesson-0${n}`, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    try {
      const buf = await get(`${BASE}${n}/${rel}`);
      fs.writeFileSync(out, buf);
      console.log(`OK   lesson-0${n}/${rel}  (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.log(`FAIL lesson-0${n}/${rel}  ${e.message}`);
    }
  }
})();

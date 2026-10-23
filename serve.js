#!/usr/bin/env node
// =============================================================
// serve.js — 零依赖静态服务器（教师本地/局域网授课用）
//   启动：  node serve.js  [端口]
//   默认：  http://localhost:8080
//   局域网：学生连同一 WiFi 后访问 http://<你的IP>:8080
// =============================================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || 8080);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm":  "text/html; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".mjs":  "text/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv":  "text/csv; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf":  "font/ttf",
  ".md":   "text/markdown; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
};

function getLanIPs() {
  const out = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const net of ifaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) out.push(net.address);
    }
  }
  return out;
}

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split("?")[0]);
    // 兼容站点部署在 /vis/ 子路径时的绝对引用（如 lecture 页里的 /vis/assets/...）
    if (rel === "/vis" || rel.startsWith("/vis/")) rel = rel.slice(4) || "/";
    // 无 favicon 的页面（如 supplementary/regression.html）会默认请求 /favicon.ico，
    // 统一返回内联 SVG 图标，避免 404
    if (rel === "/favicon.ico") {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#4f46e5"/><rect x="22" y="52" width="14" height="26" rx="3" fill="#a5b4fc"/><rect x="43" y="36" width="14" height="42" rx="3" fill="#e0e7ff"/><rect x="64" y="22" width="14" height="56" rx="3" fill="#fff"/></svg>`;
      res.writeHead(200, { "Content-Type": "image/svg+xml" });
      return res.end(svg);
    }
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(ROOT, path.normalize(rel).replace(/^([/\\])+/, ""));

    // 防目录穿越
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("404 Not Found: " + rel);
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`\n  ✅ 《可视化导论》课程站点已启动\n`);
    console.log(`     本机访问： http://localhost:${PORT}`);
    const ips = getLanIPs();
    if (ips.length) {
      console.log(`     局域网访问（学生连同一 WiFi）：`);
      ips.forEach((ip) => console.log(`       http://${ip}:${PORT}`));
    }
    console.log(`\n     按 Ctrl+C 停止\n`);
  });

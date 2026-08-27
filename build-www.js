// Собирает папку www/ для Capacitor из файлов игры.
// index.html в корне остаётся единственным источником правды —
// www/ каждый раз пересобирается, чтобы копии не разъезжались.
const fs = require("fs");
const path = require("path");

const FILES = [
  "index.html",
  "sw.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png"
];

const out = path.join(__dirname, "www");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

let missing = 0;
for (const f of FILES) {
  const src = path.join(__dirname, f);
  if (!fs.existsSync(src)) { console.error("НЕТ ФАЙЛА: " + f); missing++; continue; }
  fs.copyFileSync(src, path.join(out, f));
  console.log("  + " + f + "  (" + fs.statSync(src).size + " байт)");
}
if (missing) { console.error("Не хватает файлов: " + missing); process.exit(1); }
console.log("www/ собрана: " + FILES.length + " файлов");

// Собирает версию игры для публикации как Artifact.
// Artifact сам оборачивает файл в <!doctype><html><head><body>, поэтому
// отдаём только <title>, <style> и содержимое <body>.
// Манифест, иконки и service worker выкидываем: рядом их не будет.
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

const style = src.match(/<style>[\s\S]*?<\/style>/);
if (!style) { console.error("не нашёл <style>"); process.exit(1); }

const body = src.match(/<body>([\s\S]*?)<\/body>/);
if (!body) { console.error("не нашёл <body>"); process.exit(1); }

let inner = body[1];

// регистрация service worker — в артефакте sw.js рядом нет
const swBlock = /\/\* Офлайн-режим[\s\S]*?\n\}\n/;
if (!swBlock.test(inner)) {
  console.error("не нашёл блок регистрации service worker — проверьте вручную");
  process.exit(1);
}
inner = inner.replace(swBlock, "");

const out = "<title>Самоцветы</title>\n" + style[0] + "\n" + inner.trim() + "\n";

// страховка: ничего лишнего не утекло
for (const bad of ["<!doctype", "<html", "<head", "<body", "manifest.webmanifest", "serviceWorker"]) {
  if (out.toLowerCase().includes(bad.toLowerCase())) {
    console.error("в результате осталось лишнее: " + bad);
    process.exit(1);
  }
}

const dest = process.argv[2];
fs.writeFileSync(dest, out, "utf8");
console.log("готово: " + dest);
console.log("  размер: " + Math.round(out.length / 1024) + " КБ (лимит артефакта 16 МБ)");
console.log("  внешних загрузок: " + (out.match(/https?:\/\/[^"'\s)]+/g) || []).length);

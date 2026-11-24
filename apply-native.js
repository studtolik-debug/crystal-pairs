// Накладывает наши правки нативной части из native/android/ на android/.
// Папку android/ генерирует Capacitor, в git она не хранится, поэтому всё,
// что в ней меняется руками (сейчас — MainActivity с полноэкранным режимом),
// лежит в native/android/ по тем же путям и копируется сюда при сборке.
const fs = require("fs");
const path = require("path");

const from = path.join(__dirname, "native", "android");
const to = path.join(__dirname, "android");
if (!fs.existsSync(to)) {
  console.log("android/ ещё нет — сначала npm run android:add");
  process.exit(0);
}

let n = 0;
(function copy(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const src = path.join(dir, e.name);
    if (e.isDirectory()) { copy(src); continue; }
    const dst = path.join(to, path.relative(from, src));
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log("  > android/" + path.relative(to, dst).replace(/\\/g, "/"));
    n++;
  }
})(from);
console.log("нативных правок наложено: " + n);

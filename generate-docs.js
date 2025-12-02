const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const TOTAL_FILES = 22000;
const DOCS_DIR = path.join(__dirname, "docs");

// Clean start
if (fs.existsSync(DOCS_DIR)) {
  fs.rmSync(DOCS_DIR, { recursive: true });
}
fs.mkdirSync(DOCS_DIR, { recursive: true });

console.log(`Generating ${TOTAL_FILES.toLocaleString()} files...`);

// Create index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Large Static Site Demo</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { color: #333; }
    .stats { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .links { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
    a { color: #0070f3; }
  </style>
</head>
<body>
  <h1>Large Static Site Demo</h1>
  <div class="stats">
    <p><strong>Total files:</strong> ${TOTAL_FILES.toLocaleString()}</p>
    <p><strong>HTML files:</strong> ~${Math.floor(
      TOTAL_FILES / 2
    ).toLocaleString()}</p>
    <p><strong>JS files:</strong> ~${Math.floor(
      TOTAL_FILES / 2
    ).toLocaleString()}</p>
  </div>
  <h2>Sample Pages</h2>
  <div class="links">
    ${Array.from(
      { length: 20 },
      (_, i) => `<a href="/pages/page-${i * 100}.html">Page ${i * 100}</a>`
    ).join("\n    ")}
  </div>
  <h2>Sample Assets</h2>
  <div class="links">
    ${Array.from(
      { length: 10 },
      (_, i) => `<a href="/assets/module-${i * 100}.js">Module ${i * 100}</a>`
    ).join("\n    ")}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(DOCS_DIR, "index.html"), indexHtml);

// Create pages directory for HTML files
const pagesDir = path.join(DOCS_DIR, "pages");
fs.mkdirSync(pagesDir, { recursive: true });

// Create assets directory for JS files
const assetsDir = path.join(DOCS_DIR, "assets");
fs.mkdirSync(assetsDir, { recursive: true });

// Generate ~50% HTML in /pages, ~50% JS in /assets
const htmlCount = Math.floor(TOTAL_FILES / 2);
const jsCount = TOTAL_FILES - htmlCount;

for (let i = 0; i < htmlCount; i++) {
  const html = `<!DOCTYPE html>
<html><head><title>Page ${i}</title>
<style>body{font-family:system-ui,sans-serif;max-width:600px;margin:50px auto;padding:20px;}a{color:#0070f3;}.loaded{background:#e8f5e9;padding:10px;border-radius:4px;margin:10px 0;}</style>
</head><body>
<h1>Page ${i}</h1>
<p>This is page ${i} of ${htmlCount.toLocaleString()} HTML pages.</p>
<div id="js-status" class="loaded">Loading JS module...</div>
<p><a href="/">Back to Home</a> | <a href="/pages/page-${Math.max(
    0,
    i - 1
  )}.html">Prev</a> | <a href="/pages/page-${Math.min(
    htmlCount - 1,
    i + 1
  )}.html">Next</a></p>
<script src="/assets/module-${i}.js"></script>
<script>document.getElementById('js-status').textContent = 'JS module-${i}.js loaded!';</script>
</body></html>`;
  fs.writeFileSync(path.join(pagesDir, `page-${i}.html`), html);
  if ((i + 1) % 2500 === 0) console.log(`  ${i + 1} HTML files...`);
}

for (let i = 0; i < jsCount; i++) {
  const js = `// Module ${i}\nexport const id = ${i};\nexport const name = "module-${i}";\nconsole.log("Loaded module ${i}");`;
  fs.writeFileSync(path.join(assetsDir, `module-${i}.js`), js);
  if ((i + 1) % 2500 === 0) console.log(`  ${i + 1} JS files...`);
}

console.log(`\n✅ Generated ${TOTAL_FILES.toLocaleString()} files in docs/`);
console.log("\n👉 Now run: npm run deploy");

#!/usr/bin/env node
/**
 * CUK School — Static build / stamper
 * ---------------------------------------------------------------
 * 단일 소스(_partials/)의 nav·footer 를 모든 페이지에 찍어줍니다.
 *
 *   실행:  node build.mjs
 *
 * - _partials/nav.html, _partials/footer.html 을 수정한 뒤 이 명령을
 *   실행하면 12개 HTML 페이지의 nav·footer 가 한 번에 동일하게 갱신됩니다.
 * - 폰트 프리커넥트(성능)도 <head> 에 자동 삽입합니다.
 * - 여러 번 실행해도 결과가 동일합니다(idempotent). 빌드 산출물이 곧
 *   배포 파일이므로 Netlify 설정을 바꿀 필요가 없습니다.
 * ---------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const nav = read("_partials/nav.html").trim();
const footer = read("_partials/footer.html").trim();

const FONT_LINKS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=Noto+Serif+KR:wght@500;600;700&display=swap">';

// Top-level pages only (admin/ has no navbar/footer and is skipped)
const pages = readdirSync(ROOT).filter(
  (f) => f.endsWith(".html") && f !== "404.html"
);

let changed = 0;
for (const file of pages) {
  let html = read(file);
  const before = html;

  // 1) Replace the <nav class="navbar"> … </nav> block (exactly one per page)
  html = html.replace(/<nav class="navbar"[\s\S]*?<\/nav>/, nav);

  // 2) Replace the <footer class="footer"> … </footer> block
  html = html.replace(/<footer class="footer"[\s\S]*?<\/footer>/, footer);

  // 3) Inject font preconnect + stylesheet before styles.css (once)
  if (!html.includes("fonts.googleapis.com")) {
    html = html.replace(
      '<link rel="stylesheet" href="styles.css">',
      FONT_LINKS + '<link rel="stylesheet" href="styles.css">'
    );
  }

  if (html !== before) {
    writeFileSync(join(ROOT, file), html);
    changed++;
    console.log(`  ✓ ${file}`);
  }
}
console.log(`\nDone. ${changed}/${pages.length} page(s) updated.`);

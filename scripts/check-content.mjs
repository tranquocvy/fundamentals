#!/usr/bin/env node
// Kiểm tra nội dung trước khi build (chạy trong CI và bằng `npm run check`):
//  - bài trong content/docs/<môn>/ (trừ index.mdx) có ≥ 1 references, không còn "TODO" trong frontmatter
//  - mọi mục trong meta.json trỏ tới file .mdx hoặc thư mục có thật
//  - mọi <Term>x</Term> không kèm def/id đều có trong content/glossary.json
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join('content', 'docs');
const errors = [];
const err = (file, msg) => errors.push(`${relative('.', file)}: ${msg}`);

const glossary = JSON.parse(readFileSync(join('content', 'glossary.json'), 'utf8')).terms;
const known = new Set();
for (const [term, e] of Object.entries(glossary)) {
  known.add(term.toLowerCase());
  for (const a of e.aliases ?? []) known.add(a.toLowerCase());
}

function walk(dir, depth) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, depth + 1);
    else if (name.endsWith('.mdx')) checkMdx(p, depth > 0 && name !== 'index.mdx');
    else if (name === 'meta.json') checkMeta(p, dir);
  }
}

function checkMdx(file, isArticle) {
  const src = readFileSync(file, 'utf8');
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (/TODO/.test(fm)) err(file, 'frontmatter còn "TODO", hãy điền nốt.');
  if (isArticle && !/^references:\s*\r?\n\s+-/m.test(fm)) err(file, 'bài cần ít nhất 1 mục trong references.');

  // bỏ code block và inline code để không bắt nhầm ví dụ như `<Term>x</Term>`
  const body = src.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  for (const m of body.matchAll(/<Term(\s[^>]*)?>([^<]*)<\/Term>/g)) {
    const attrs = m[1] ?? '';
    if (/\bdef=/.test(attrs)) continue;
    const key = attrs.match(/\bid="([^"]+)"/)?.[1] ?? m[2];
    if (!known.has(key.trim().toLowerCase())) {
      err(file, `<Term>${m[2]}</Term> chưa có trong content/glossary.json (thêm vào glossary hoặc dùng def="...").`);
    }
  }
}

function checkMeta(file, dir) {
  const meta = JSON.parse(readFileSync(file, 'utf8'));
  for (const page of meta.pages ?? []) {
    if (page.startsWith('---') || page === '...') continue;
    if (!existsSync(join(dir, `${page}.mdx`)) && !existsSync(join(dir, page))) {
      err(file, `"${page}" không có file ${page}.mdx hay thư mục ${page}/ tương ứng.`);
    }
  }
}

walk(ROOT, 0);

if (errors.length) {
  console.error(`✗ check-content: ${errors.length} lỗi\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('✓ check-content: nội dung hợp lệ');

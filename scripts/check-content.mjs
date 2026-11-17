#!/usr/bin/env node
// Kiểm tra nội dung trước khi build (chạy trong CI và bằng `npm run check`):
//  - bài trong content/docs/<môn>/ (trừ index.mdx) có ≥ 1 references, không còn "TODO" trong frontmatter
//  - mọi mục trong meta.json trỏ tới file .mdx hoặc thư mục có thật
//  - mọi <Term>x</Term> không kèm def/id đều có trong content/glossary.json
//  - roadmap (content/roadmaps/*.yaml) hợp lệ, và không id node nào bị xoá/đổi tên so với nhánh gốc
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ROADMAP_DIR, allNodes, listRoadmapSlugs, nodeIdsFromYaml, readRoadmapFile, validateRoadmap, warnRoadmap } from './roadmap-core.mjs';

const ROOT = join('content', 'docs');
const REFERENCE_KINDS = new Set(['book', 'web', 'paper', 'video']);   // phải khớp articleSchema trong src/lib/source.ts
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
  // frontmatter phải là YAML hợp lệ (lỗi hay gặp: giá trị chứa ": " mà không đặt trong ngoặc kép), và references[].kind đúng tập cho phép
  try {
    const data = parseYaml(fm) ?? {};
    for (const r of data.references ?? []) {
      if (!REFERENCE_KINDS.has(r?.kind)) err(file, `references: kind "${r?.kind}" không hợp lệ (chỉ ${[...REFERENCE_KINDS].join(', ')}).`);
    }
  } catch (e) {
    err(file, `frontmatter không phải YAML hợp lệ: ${String(e.message).split(/\r?\n/)[0]} (giá trị có ": " bên trong cần đặt trong ngoặc kép).`);
  }
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
checkRoadmaps();

function checkRoadmaps() {
  const subjects = [...readFileSync(join('src', 'lib', 'subjects.ts'), 'utf8').matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
  const slugs = listRoadmapSlugs();
  for (const slug of slugs) {
    const file = join(ROADMAP_DIR, `${slug}.yaml`);
    let rm;
    try {
      rm = readRoadmapFile(file, slug);
    } catch (e) {
      err(file, `YAML không hợp lệ: ${e.message.split('\n')[0]}`);
      continue;
    }
    for (const e of validateRoadmap(rm, { subjects })) err(file, e);
    for (const w of warnRoadmap(rm)) console.warn(`cảnh báo ${relative('.', file)}: ${w}`);
  }

  // Id node là khoá lưu tiến trình của người dùng: không được xoá hay đổi tên.
  const base = baseRef();
  if (!base) return;
  const baseFiles = git(['ls-tree', '--name-only', base, 'content/roadmaps/']);
  for (const path of baseFiles.split('\n').filter((f) => f.endsWith('.yaml'))) {
    const slug = path.split('/').pop().slice(0, -'.yaml'.length);
    const file = join(ROADMAP_DIR, `${slug}.yaml`);
    if (!slugs.includes(slug)) {
      err(file, `roadmap "${slug}" có trên ${base} nhưng đã bị xoá/đổi tên (URL và tiến trình người dùng sẽ hỏng).`);
      continue;
    }
    const before = nodeIdsFromYaml(git(['show', `${base}:${path}`]));
    const now = new Set(allNodes(readRoadmapFile(file, slug)).map((n) => n.id));
    for (const id of before) {
      if (!now.has(id)) err(file, `node "${id}" có trên ${base} nhưng đã bị xoá/đổi tên. Giữ id cũ và đặt "deprecated: true" thay vì xoá.`);
    }
  }
}

/**
 * Nhánh để so sánh: ROADMAP_BASE_REF nếu đặt; PR → nhánh đích; push trong CI → commit trước;
 * local → origin/main.
 */
function baseRef() {
  const candidates = process.env.ROADMAP_BASE_REF
    ? [process.env.ROADMAP_BASE_REF]
    : process.env.GITHUB_BASE_REF
    ? [`origin/${process.env.GITHUB_BASE_REF}`]
    : process.env.GITHUB_EVENT_NAME === 'push'
      ? ['HEAD~1']
      : ['origin/main'];
  return candidates.find((r) => git(['rev-parse', '--verify', '--quiet', r]) !== '');
}

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

if (errors.length) {
  console.error(`✗ check-content: ${errors.length} lỗi\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('✓ check-content: nội dung hợp lệ');

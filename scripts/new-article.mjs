#!/usr/bin/env node
// Tạo bài mới từ templates/_template.mdx và đăng ký vào meta.json của môn.
//
//   npm run new <môn> <slug> ["Tiêu đề"]
//   npm run new os virtual-memory
//   npm run new os virtual-memory "Virtual Memory"
//
// Tiêu đề mặc định sinh từ slug: virtual-memory → "Virtual Memory".
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [subject, slug, ...titleParts] = process.argv.slice(2);
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

if (!subject || !slug) fail('Cách dùng: npm run new <môn> <slug> ["Tiêu đề"]   ví dụ: npm run new os virtual-memory');
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`slug "${slug}" phải viết thường, tiếng Anh, nối bằng gạch ngang (vd. virtual-memory).`);

const dir = join('content', 'docs', subject);
const metaPath = join(dir, 'meta.json');
if (!existsSync(metaPath)) {
  fail(`Chưa có môn "${subject}" (thiếu ${metaPath}). Xem mục "Thêm một môn mới" trong CONTRIBUTING.md.`);
}

const file = join(dir, `${slug}.mdx`);
if (existsSync(file)) fail(`${file} đã tồn tại.`);

const title =
  titleParts.join(' ').trim() ||
  slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

// GitHub username để hiện avatar: ưu tiên `git config github.user`, sau đó hỏi GitHub CLI (`gh`) nếu đã đăng nhập.
function githubUser() {
  const run = (cmd, args) => {
    try {
      return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim();
    } catch {
      return '';
    }
  };
  return run('git', ['config', 'github.user']) || run('gh', ['api', 'user', '--jq', '.login']);
}
const user = githubUser();

let content = readFileSync(join('templates', '_template.mdx'), 'utf8')
  .replaceAll('{{title}}', title)
  .replaceAll('{{subject}}', subject);
if (user) content = content.replace('# authors: [github-username]', `authors: [${user}]`);
writeFileSync(file, content);

const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
meta.pages ??= [];
if (!meta.pages.includes(slug)) meta.pages.push(slug);
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');

console.log(`✓ Đã tạo ${file}`);
console.log(`✓ Đã thêm "${slug}" vào ${metaPath}`);
console.log(
  user
    ? `✓ authors: [${user}]`
    : '! Không tìm được GitHub username: sửa dòng "# authors" trong frontmatter, hoặc chạy `git config --global github.user <username>`.',
);
console.log(`→ Sửa các dòng TODO trong frontmatter, rồi xem ở http://localhost:3000/docs/${subject}/${slug}`);

# Đóng góp cho fundamentals

File này dành cho **cả người lẫn AI agent** (Claude Code, Codex, Cursor...). Nếu bạn dùng agent, chỉ cần bảo nó: *"Đọc CONTRIBUTING.md rồi viết bài về X cho môn Y"*.

## 1. Site này là gì

- Ghi chú kiến thức nền tảng IT **đã học**, viết bằng **tiếng Việt**, giữ **thuật ngữ tiếng Anh**.
- **Không phải** site luyện phỏng vấn: không viết dạng "câu hỏi / đáp án mẫu", không mẹo trả lời.
- Mỗi bài phải có **nguồn tiếng Anh** để người đọc đối chiếu.
- Site tĩnh (Next.js `output: 'export'` + Fumadocs + MDX). Không backend, không database.

## 2. Quy ước viết

| Nên | Không nên |
|---|---|
| `process`, `thread`, `race condition` giữ nguyên tiếng Anh | Dịch gượng: "tiến trình con luồng", "điều kiện đua" |
| Câu ngắn, giải thích *vì sao*, có ví dụ cụ thể | Chép lại định nghĩa trong sách |
| `<Term>` cho thuật ngữ cần giải nghĩa, lần đầu xuất hiện | Bọc `<Term>` cho mọi lần nhắc lại |
| `<Expand>` cho ví dụ dài, chứng minh, phần đào sâu | Giấu ý chính trong `<Expand>` |
| Bảng so sánh khi có ≥ 2 khái niệm song song | Danh sách gạch đầu dòng dài > 7 ý |
| Nguồn cụ thể: sách + chương, link bài gốc | "Theo internet", link blog không rõ tác giả |

Cấu trúc bài gợi ý: `## Ý chính` → các phần giải thích → `## Khi nào dùng / Lưu ý` (tuỳ bài). Không cần mục "Tài liệu tham khảo" trong nội dung vì trang tự hiển thị từ frontmatter `references`.

### Giọng điệu ký hiệu code (quan trọng)

Site có chất "coder" nhưng **dùng tiết chế**. Ký hiệu kiểu terminal chỉ xuất hiện ở các chỗ cố định:

- breadcrumb đường dẫn: `~/os/process-thread`
- dòng mở đầu trang chủ: `$ cat README.md`
- link nav: `~/home`, `/subjects`, `/contribute`; link hành động: `> bắt đầu ...`
- nhãn `~/subjects`, số thứ tự `01 /`, tag `#os`, nhãn `draft`, loại nguồn `[book]` `[web]`

**Không** thêm `//`, `[+]`, `$`, `>` vào tiêu đề bài, heading trong bài, nút hay component mới. Heading trong bài là chữ thường, phần trang trí (vạch accent) do CSS lo.

## 3. Các bước thêm một bài

1. Tạo file `content/docs/<môn>/<slug>.mdx`. `slug` viết thường, gạch ngang, tiếng Anh: `virtual-memory.mdx`.
2. Copy frontmatter từ [`templates/article.mdx`](templates/article.mdx) rồi điền.
3. Thêm `<slug>` vào mảng `pages` trong `content/docs/<môn>/meta.json` (đúng thứ tự muốn hiện ở sidebar).
4. `npm run dev`, mở `http://localhost:3000/docs/<môn>/<slug>` để xem.
5. `npm run build` phải pass (frontmatter sai schema sẽ báo lỗi ở bước này).
6. Commit, mở Pull Request vào `main`.

### Frontmatter

```yaml
---
title: Virtual Memory              # bắt buộc, giữ thuật ngữ tiếng Anh nếu là tên khái niệm
description: Một câu tiếng Việt tóm tắt bài.   # bắt buộc
status: draft                      # draft | reviewed (chỉ người review mới đổi sang reviewed)
tags: [os, memory]                 # chữ thường, tiếng Anh
authors: [github-username]         # tuỳ chọn; bỏ trống thì lấy tên từ git commit đầu tiên
references:                        # ít nhất 1 nguồn
  - title: "OSTEP — Chapter 13: Address Spaces"
    url: https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf   # tuỳ chọn
    kind: book                     # book | web | paper | video
    note: đọc phần 13.3            # tuỳ chọn
---
```

Schema nằm ở `src/lib/source.ts` (`articleSchema`). Thêm field mới thì sửa ở đó.

### Component dùng được trong MDX

```mdx
<Term def="Giải nghĩa ngắn, 1 câu.">address space</Term>

<Expand title="Ví dụ: counter++ bị xen kẽ">
Nội dung markdown bình thường, có thể có code block.
</Expand>
```

Muốn thêm component mới: tạo trong `src/components/`, đăng ký ở `src/components/mdx.tsx`, cập nhật mục này.

## 4. Thêm một môn mới

1. Tạo thư mục `content/docs/<slug-môn>/` gồm:
   - `index.mdx`: trang giới thiệu môn (frontmatter `title`, `description`, `tags`).
   - `meta.json`: `{ "title": "Tên môn", "pages": ["bai-1", "bai-2"] }`. **Không** ghi `index` vào `pages`, vì nó tự thành trang của thư mục.
2. Thêm `<slug-môn>` vào `pages` của `content/docs/meta.json`.
3. Trong `src/lib/subjects.ts`: đặt `ready: true` cho môn đó (hoặc thêm mục mới, kèm 2 màu accent).
4. Trong `src/app/global.css`: thêm 2 dòng `html[data-subject='<slug>']` và `.dark[data-subject='<slug>']` với cùng 2 màu.
   - Màu light phải đủ tương phản trên nền `#f6f5f1`, màu dark trên nền `#0e0f13` (WCAG AA cho chữ thường: ≥ 4.5:1).

## 5. Thiết kế (đừng phá)

- **Theme**: dark mặc định + light. Token màu ở đầu `src/app/global.css` (`--color-fd-*`). Không hard-code màu trong component; dùng token hoặc `var(--subject-accent)`.
- **Accent theo môn**: `<html data-subject="...">` do `SubjectScope` gắn theo URL.
- **Font**: Fraunces (tiêu đề), Source Serif 4 (chữ đọc, mặc định), Be Vietnam Pro (chữ đọc khi chọn sans), JetBrains Mono (code + các nhãn kiểu terminal). Khai báo ở `src/lib/fonts.ts`.
- Luật font chung nằm trong `@layer base` để class tiện ích (`font-mono`...) ghi đè được.
- Responsive: phải đọc tốt ở 375px, không được cuộn ngang.

## 6. Checklist trước khi mở PR

- [ ] File đúng chỗ `content/docs/<môn>/<slug>.mdx`, đã thêm vào `meta.json`
- [ ] Frontmatter đủ `title`, `description`, `status: draft`, `tags`, ≥ 1 `references`
- [ ] Thuật ngữ tiếng Anh giữ nguyên, có `<Term>` ở lần xuất hiện đầu nếu cần giải nghĩa
- [ ] Không thêm ký hiệu `//`, `[+]` vào heading
- [ ] `npm run build` pass
- [ ] Commit message theo Conventional Commits (mục 8)
- [ ] Xem thử cả dark/light và màn hình hẹp

## 7. Lệnh hay dùng

```bash
npm install          # cài deps
npm run dev          # xem trước ở http://localhost:3000
npm run build        # build tĩnh ra out/ (tự chạy scripts/fix-prefetch.mjs sau build)
npx serve out -l 4000  # chạy bản build tĩnh
npm run types:check  # kiểm tra type
```

## 8. Commit message: Conventional Commits

Mọi commit dùng [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <mô tả ngắn, viết thường, không chấm cuối>

<thân: vì sao / thay đổi gì, mỗi ý một gạch đầu dòng (tuỳ chọn)>
```

| type | Dùng khi |
|---|---|
| `feat` | tính năng hoặc component mới, môn mới |
| `fix` | sửa lỗi hiển thị/hành vi |
| `content` | thêm hoặc sửa bài ghi chú trong `content/` |
| `docs` | README, CONTRIBUTING, AGENTS, template |
| `style` | chỉ đổi CSS/giao diện, không đổi logic |
| `refactor` | sắp xếp lại code, không đổi hành vi |
| `chore` | deps, config, script build, `.gitattributes` |

- `scope` tuỳ chọn: môn (`os`, `networking`...) hoặc khu vực (`search`, `ui`, `build`).
- Dòng đầu ≤ 72 ký tự, mệnh lệnh: `feat(ui): add byline`, không phải `Added byline`.
- Một commit một mục đích. Nếu dòng đầu phải dùng "và" cho 2 việc khác loại, tách commit.
- Ví dụ: `content(os): add virtual memory note`, `fix(search): strip JSX tags from index`.

# Ngữ cảnh cho agent: `src/` (giao diện và code)

Đọc [CONTRIBUTING.md](../CONTRIBUTING.md) mục 5 (thiết kế) và mục 6 (checklist) trước, rồi file này để biết **code đặt ở đâu, vì sao, và các ràng buộc ẩn**. Mục đích: khỏi phải duyệt từng file cũ để suy ra quy ước.

## 1. Site là gì về mặt kỹ thuật

- **Next.js 16 static export** (`output: 'export'` trong `next.config.mjs`) + **Fumadocs** + MDX + **Tailwind v4**. Không có backend, không database, không API runtime. Kết quả build là thư mục `out/` đặt lên host tĩnh (Vercel).
- Hệ quả của static export: mọi route phải sinh được lúc build. Trang động dùng `generateStaticParams`; route handler (`search`, `llms.txt`, `og`) phải là loại tĩnh. Đừng dùng cookie, header của request, `searchParams` ở server, hay API route cần chạy lúc request.
- Tiến trình học nằm ở **localStorage của trình duyệt** (`src/lib/progress.ts`, khoá `fundamentals:progress:v1`, mã sao lưu `fp1.…`). Đổi định dạng thì phải giữ đọc được dữ liệu cũ; xem [content/roadmaps/AGENTS.md](../content/roadmaps/AGENTS.md) về khoá tiến trình.
- CI (`.github/workflows/ci.yml`) chạy `npm run check`, `npm run types:check`, `npm run build` với `fetch-depth: 0` (byline cần lịch sử git).

## 2. Bản đồ thư mục

```text
src/
  app/
    layout.tsx, global.css      layout gốc, token màu, mọi CSS (kể cả khối Roadmap)
    (home)/                     trang chủ, /roadmaps, /roadmaps/[slug] (cây dùng layout của Fumadocs "home")
    docs/                       layout và trang bài viết (docs/[[...slug]]/page.tsx: byline, status, references)
    api/search/route.ts         chỉ mục tìm kiếm tĩnh (zbsearch)
    llms.txt, llms-full.txt, llms.mdx/   bản văn bản thuần của site cho LLM
    og/docs/[...slug]/          ảnh Open Graph cho từng bài
  components/
    mdx.tsx                     ĐĂNG KÝ component dùng được trong MDX (Term, Expand, GlossaryList)
    term.tsx, expand.tsx        component MDX
    roadmap/                    roadmap-view (cây đầy đủ), roadmap-card (thẻ + mini-map), progress-tools (sao lưu/khôi phục)
    subject-list.tsx, subject-scope.tsx   danh sách môn; SubjectScope gắn data-subject theo URL
    search.tsx, font-toggle.tsx, glossary-list.tsx, provider.tsx
  lib/
    source.ts                   schema frontmatter (articleSchema) và loader Fumadocs; đổi field frontmatter ở đây
    subjects.ts                 danh sách môn, slug, màu accent, cờ ready
    roadmaps.ts                 đọc YAML roadmap, dựng ViewSection/MiniMap; dùng chung logic với scripts/roadmap-core.mjs
    progress.ts                 trạng thái học trong localStorage
    glossary.ts                 tra content/glossary.json cho <Term>
    git.ts                      đọc tác giả và ngày cập nhật từ git log lúc build (chỉ tên, không bao giờ email)
    search-tokenizer.ts         bỏ dấu tiếng Việt để "bo nho" khớp "bộ nhớ"
    fonts.ts, layout.shared.tsx, shared.ts, cn.ts
```

## 3. Quy tắc thiết kế (đừng phá)

- **Màu**: chỉ dùng token trong khối đầu `src/app/global.css`: `--color-fd-background/foreground/muted/card/border/primary...` và `var(--subject-accent)`. **Không hard-code hex** trong component. Light nền `#f6f5f1`, dark nền `#0e0f13`.
- **Accent theo môn**: `SubjectScope` đặt `<html data-subject="os">` theo URL `/docs/<môn>/...`; CSS có `html[data-subject='os']` và `.dark[data-subject='os']` đặt `--subject-accent`. Môn mới cần hai dòng đó (CONTRIBUTING mục 4); màu light phải đủ tương phản trên nền sáng, dark trên nền tối (WCAG AA, ≥ 4.5:1).
- **Font** khai báo ở `src/lib/fonts.ts`: Fraunces (tiêu đề), Source Serif 4 (chữ đọc, mặc định), Be Vietnam Pro (chữ đọc khi chọn sans), JetBrains Mono (code và nhãn kiểu terminal). `next/font` bắt buộc option là **object literal**, không dùng biến. Luật font chung nằm trong `@layer base` để class tiện ích (`font-mono`...) ghi đè được.
- **Ký hiệu kiểu terminal** chỉ ở những chỗ cố định liệt kê trong CONTRIBUTING mục 2. Không thêm `//`, `[+]`, `$`, `>` vào heading, nút hay component mới.
- **Responsive**: phải đọc tốt ở **375px**, không cuộn ngang. Roadmap trên mobile là cây một phía; trên desktop (≥ 60rem) là hai phía.
- **Dark mặc định**, có light. Kiểm cả hai.
- Class CSS của roadmap có tiền tố `rm-` (`.rm`, `.rm-section`, `.rm-row`, `.rm-trunk`, `.rm-pill`, `.rm-mini`...), nằm cùng khối "Roadmap" trong `global.css`. `--rail`/`--line` phải khai báo trên `.rm-section` (nơi có `--acc`), không phải trên `.rm`.
- `src/app/global.css` đang là **CRLF** trong working tree. Sửa bằng script phải giữ nguyên (mở với `newline=''`), nếu không diff phình toàn file.

## 4. Thêm hoặc sửa

- **Component dùng trong MDX**: tạo ở `src/components/`, đăng ký ở `src/components/mdx.tsx`, cập nhật mục "Component dùng được trong MDX" của CONTRIBUTING.md. Component cần state hay tương tác thì ghi `'use client'` ở dòng đầu (như `term.tsx`, `expand.tsx`).
- **Field frontmatter mới**: sửa `articleSchema` trong `src/lib/source.ts` **và** `scripts/check-content.mjs` nếu cần kiểm; cập nhật CONTRIBUTING (mục Frontmatter) và `templates/_template.mdx`. Lưu ý schema này **chỉ chạy ở build**: `npm run check` không bắt lỗi giá trị sai (ví dụ `kind` ngoài `book | web | paper | video` làm build hỏng dù check xanh), nên luôn chạy cả `build`.
- **Môn mới**: thư mục `content/docs/<môn>/` (xem content/AGENTS.md), thêm vào `content/docs/meta.json`, đặt `ready: true` trong `src/lib/subjects.ts`, thêm hai dòng màu trong `global.css`.
- **Trang mới ở `app/`**: kiểm tra nó có sinh tĩnh được không; nếu là danh sách nội dung thì dùng `source` từ `src/lib/source.ts`, đừng đọc file thủ công.
- **Tìm kiếm**: dùng `searchTokenizer` ở cả lúc dựng chỉ mục và lúc truy vấn; đổi một bên mà không đổi bên kia làm tìm kiếm tiếng Việt hỏng.

## 5. Kiểm tra trước khi xong

```bash
npm run check         # nội dung hợp lệ
npm run types:check   # TypeScript (next typegen + tsc)
npm run build         # build tĩnh; dừng dev server trước, hai cái không chạy song song trên cùng thư mục
```

Rồi mở bằng `npm run dev` (cổng 3000; nếu bận Next tự chọn cổng khác), nhìn trang bị ảnh hưởng ở **dark và light**, ở **375px**, và đảm bảo không có lỗi trong console. Build gặp lỗi hết bộ nhớ (heap) khi máy đang chạy nhiều thứ nặng (ví dụ WSL) thì giải phóng RAM hoặc đặt `NODE_OPTIONS=--max-old-space-size=6144`.

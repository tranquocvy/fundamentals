# Hướng dẫn cho AI agent

**Trước khi viết bài hoặc sửa code, đọc [CONTRIBUTING.md](CONTRIBUTING.md).** File đó có quy ước viết, frontmatter, các bước thêm bài/môn, quy tắc thiết kế và checklist.

Tóm tắt điều không được vi phạm:

- Nội dung tiếng Việt, **giữ thuật ngữ tiếng Anh**. Không phải site luyện phỏng vấn.
- Bài mới: tạo bằng `npm run new <môn> <slug>` (copy `templates/_template.mdx`, tự thêm vào `meta.json`), điền hết `TODO`, `status: draft`, có ≥ 1 `references`.
- Thuật ngữ: dùng `<Term>tên</Term>` và thêm giải nghĩa vào `content/glossary.json` nếu chưa có. Không lặp `def` cho thuật ngữ đã có trong glossary.
- Ký hiệu kiểu terminal (`~/`, `$`, `>`) chỉ ở các chỗ cố định đã liệt kê trong CONTRIBUTING.md. **Không** thêm `//` hay `[+]` vào heading, nút, component mới.
- Màu dùng token (`--color-fd-*`, `--subject-accent`), không hard-code.
- `npm run check` và `npm run build` phải pass trước khi mở PR (CI chạy lại cả hai).
- Commit message theo **Conventional Commits** (`feat`, `fix`, `content`, `docs`, `style`, `refactor`, `chore`), xem mục 8 CONTRIBUTING.md. Ví dụ: `content(os): add virtual memory note`.

# Fumadocs

This site is built with [Fumadocs](https://fumadocs.dev) on Next.js. The APIs and conventions of Fumadocs may differ from your training data, so check its docs for the task at hand:

- Writing pages: https://fumadocs.dev/docs/next/markdown.md
- Organizing pages and folders: https://fumadocs.dev/docs/next/page-conventions.md
- Customizing the UI: https://fumadocs.dev/docs/next/guides/customize-ui.md
- Changing the theme and colors: https://fumadocs.dev/docs/ui/theme.md
- Upgrading Fumadocs: https://fumadocs.dev/docs/next/upgrade.md
- Other tasks: https://fumadocs.dev/llms.txt lists every docs page.

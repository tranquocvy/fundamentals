# Hướng dẫn cho AI agent

**Trước khi viết bài hoặc sửa code, đọc [CONTRIBUTING.md](CONTRIBUTING.md).** File đó có quy ước viết, frontmatter, các bước thêm bài/môn, quy tắc thiết kế và checklist.

Ngữ cảnh theo thư mục (chuẩn chất lượng bài, mẫu để bắt chước, quy trình, môi trường thí nghiệm): [content/AGENTS.md](content/AGENTS.md) cho bài viết và glossary, [content/roadmaps/AGENTS.md](content/roadmaps/AGENTS.md) cho roadmap, [src/AGENTS.md](src/AGENTS.md) cho giao diện và component, [scripts/AGENTS.md](scripts/AGENTS.md) cho script kiểm tra và tạo bài, [templates/AGENTS.md](templates/AGENTS.md) cho khuôn bài mới. Đọc file tương ứng **trước khi** thêm hoặc sửa gì trong thư mục đó; chúng ghi sẵn quy ước để khỏi phải suy ra từ code cũ. Thêm một thư mục mới nhận đóng góp thì thêm AGENTS.md (và `CLAUDE.md` chứa `@AGENTS.md`) cho nó. Riêng `content/docs/` thì **không** đặt `.md` vào, vì Fumadocs coi mọi `.md` ở đó là một trang.

Tóm tắt điều không được vi phạm:

- Nội dung tiếng Việt, **giữ thuật ngữ tiếng Anh**. Dạy nền tảng để hiểu thật (nhờ vậy vững khi phỏng vấn), không viết dạng ngân hàng câu hỏi.
- Bài viết theo **khung bài học** ở content/AGENTS.md mục 2: mỗi mục là vòng Đoán trước → ví dụ có số thật → Thử ngay; nâng cao để ở `## Đi sâu hơn`. Không giới hạn số từ; quy ước là cấu trúc.
- Bài mới: tạo bằng `npm run new <môn> <slug>` (copy `templates/_template.mdx`, tự thêm vào `meta.json`), điền hết `TODO`, `status: draft`, có ≥ 1 `references`.
- Thuật ngữ: dùng `<Term>tên</Term>` và thêm giải nghĩa vào `content/glossary.json` nếu chưa có. Không lặp `def` cho thuật ngữ đã có trong glossary.
- Roadmap: mỗi cây là một file `content/roadmaps/<slug>.yaml` (CONTRIBUTING.md mục 4b). **Không đổi tên hay xoá id node / tên file đã có** vì đó là khoá lưu tiến trình người dùng; muốn bỏ node thì đặt `deprecated: true`. Khung roadmap phải có `sources` từ nguồn mở, không sao chép roadmap.sh.
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

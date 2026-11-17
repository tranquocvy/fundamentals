# Ngữ cảnh cho agent: `scripts/`

Các script Node thuần (`.mjs`, không build, không TypeScript) chạy qua `npm run`. Chúng là **hàng rào chất lượng của nội dung** và công cụ tạo bài. Đọc file này trước khi sửa, vì đổi một luật kiểm tra ảnh hưởng tới mọi người đóng góp.

| Script | Lệnh | Việc làm | Chạy khi nào |
|---|---|---|---|
| `check-content.mjs` | `npm run check` | duyệt `content/docs/**/*.mdx`, `meta.json`, glossary, và gọi lõi roadmap | tay, và ở CI |
| `roadmap-core.mjs` | (được gọi bởi check) | đọc, kiểm hợp lệ, và **tính bố cục** (`layoutSection`) cho `content/roadmaps/*.yaml` | check và lúc build |
| `new-article.mjs` | `npm run new <môn> <slug> ["Tiêu đề"]` | copy `templates/_template.mdx`, điền title, subject, authors, thêm slug vào cuối `meta.json` của môn | tay |
| `fix-prefetch.mjs` | tự chạy ở `postbuild` | Next 16 export ghi file prefetch theo thư mục lồng nhau nhưng client xin tên phẳng nối bằng dấu chấm; script sao chép bản tên phẳng để host tĩnh khỏi trả 404 | sau mỗi `next build` |

## Điều cần biết

- **`roadmap-core.mjs` dùng chung cho build và check.** `src/lib/roadmaps.ts` import cùng logic (bố cục, kiểm hợp lệ), nên luật bố cục chỉ nằm một chỗ. Đổi cách xếp cây (trục chính, nhánh trái/phải) là sửa ở đây, rồi cập nhật [content/roadmaps/AGENTS.md](../content/roadmaps/AGENTS.md) và CONTRIBUTING mục 4b.
- **Luật kiểm roadmap:** YAML hợp lệ, khoá đúng tên, id duy nhất trong file, `requires` trỏ tới node có thật và **không có vòng**, `article` tồn tại, `subject` có thật, node chưa có `article` thì có `resources`, `effort` là số nguyên dương, và **không id nào bị xoá so với `main`** (so với nhánh khác: `ROADMAP_BASE_REF=origin/<nhánh> npm run check`). Node có hơn một `requires` trong cùng chặng chỉ cảnh báo.
- **Luật kiểm bài:** bài trong `content/docs/<môn>/` (trừ `index.mdx`) phải có ≥ 1 `references` và không còn chữ `TODO` trong frontmatter; mọi mục trong `meta.json` trỏ tới file `.mdx` hoặc thư mục có thật; `<Term>` không có trong glossary mà không kèm `def` là lỗi.
- **Check không thay thế build.** Check kiểm frontmatter là YAML hợp lệ và `references[].kind` thuộc `book|web|paper|video` (tập này phải khớp `articleSchema` trong `src/lib/source.ts`; đổi một nơi thì đổi nơi kia), nhưng **không** kiểm các giá trị schema khác (do Zod ở `src/lib/source.ts` kiểm lúc build) và không biên dịch MDX (thẻ `<Term>`, `<Expand>`, `<`/`{` trong văn xuôi). Luôn chạy cả hai.
- `check-content.mjs` chỉ đọc file `.mdx`; vì vậy `.md` trong `content/docs/` không bị kiểm, nhưng Fumadocs vẫn coi nó là trang. **Không đặt `.md` trong `content/docs/`.**
- `new-article.mjs` lấy tên GitHub cho `authors` từ `git config github.user`, rồi từ `gh` nếu đã đăng nhập; không có thì để trống (byline lấy từ git). Nó **từ chối** môn chưa có `meta.json` và slug không viết thường nối bằng gạch ngang.
- Script phải chạy được trên Windows, macOS và Linux (người đóng góp dùng cả ba): dùng `node:path`, không viết lệnh shell riêng của một hệ điều hành.
- Thêm script mới: đăng ký trong `package.json`, và ghi vào bảng ở trên.

# fundamentals

Kho tài liệu kiến thức nền tảng IT: hệ điều hành, mạng máy tính, cơ sở dữ liệu, cấu trúc dữ liệu và thuật toán… Mỗi bài giải thích một khái niệm cốt lõi, có ví dụ và nguồn gốc để đọc sâu thêm.

Dự án mở cho mọi người cùng đóng góp: thêm bài mới, bổ sung ví dụ, sửa chỗ sai, hay mở môn học mới đều được chào đón.

**Đọc tại:** https://fundamentals-notes.vercel.app

## Nội dung

| Môn | Trạng thái |
|---|---|
| Operating Systems | Process vs Thread, CPU Scheduling, Virtual Memory, Deadlock |
| Computer Networks | TCP vs UDP, DNS |
| Databases | sắp có |
| Data Structures & Algorithms | sắp có |
| OOP & Design Patterns | sắp có |
| Backend | sắp có |
| DevOps | sắp có |

Thuật ngữ dùng chung giữa các bài được gom ở trang [Glossary](https://fundamentals-notes.vercel.app/docs/glossary).

Các bài được xâu thành **lộ trình học** ở trang [Roadmaps](https://fundamentals-notes.vercel.app/roadmaps) (CS Fundamentals, Backend…): đánh dấu chủ đề đã học, tiến trình lưu ngay trong trình duyệt và sao lưu được bằng một mã ngắn. Mỗi roadmap là một file YAML trong `content/roadmaps/`, ai cũng có thể mở PR thêm cây mới hay thêm chủ đề.

## Đóng góp

Chỉ cần biết Markdown là viết được bài. Quy trình ngắn:

```bash
git clone https://github.com/tranquocvy/fundamentals.git
cd fundamentals
npm install
npm run new os virtual-memory   # tạo bài từ template, tự thêm vào sidebar
npm run dev                     # xem trước ở http://localhost:3000
npm run check                   # kiểm tra frontmatter, glossary trước khi mở PR
```

Sau đó mở Pull Request vào `main`. CI tự kiểm tra và build; Vercel tạo link xem trước cho PR.

Hướng dẫn đầy đủ (quy ước viết, frontmatter, glossary, thêm môn mới, quy ước commit) ở [CONTRIBUTING.md](CONTRIBUTING.md). Nếu bạn dùng AI agent (Claude Code, Codex, Cursor…), repo có sẵn [AGENTS.md](AGENTS.md) để agent tự đọc quy ước.

Một vài nguyên tắc chính:

- Mỗi bài có ít nhất một nguồn tham khảo (sách, RFC, tài liệu chính thức).
- Bài mới để `status: draft`; sau khi có người review mới chuyển `reviewed`.
- Commit message theo [Conventional Commits](https://www.conventionalcommits.org/).

## Công nghệ

- [Next.js](https://nextjs.org) (static export) + [Fumadocs](https://fumadocs.dev) + MDX
- Tailwind CSS v4, theme sáng/tối, đổi font đọc serif/sans
- Search chạy phía trình duyệt, gõ có dấu hay không dấu đều tìm được
- Deploy tĩnh trên Vercel, không backend, không database

## Cấu trúc thư mục

```
content/docs/<môn>/*.mdx      bài viết
content/docs/<môn>/meta.json  thứ tự bài trong sidebar
content/glossary.json         giải nghĩa thuật ngữ dùng chung
content/roadmaps/*.yaml       roadmap, mỗi file một cây
templates/_template.mdx       khung bài mới
src/components/               Term, Expand, GlossaryList, ...
src/lib/subjects.ts           danh sách môn và màu accent ở trang chủ
scripts/                      npm run new, npm run check, xử lý sau build
```

## Lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` | chạy dev server ở http://localhost:3000 |
| `npm run new <môn> <slug>` | tạo bài mới từ template |
| `npm run check` | kiểm tra nội dung (frontmatter, meta.json, glossary) |
| `npm run types:check` | kiểm tra TypeScript |
| `npm run build` | build tĩnh ra `out/` |

## Người duy trì

[@tranquocvy](https://github.com/tranquocvy). Nội dung thuộc về tất cả những người đóng góp.

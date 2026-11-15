# fundamentals

Knowledge base ghi chú kiến thức nền tảng IT — viết bằng tiếng Việt, giữ thuật ngữ tiếng Anh, kèm nguồn tiếng Anh để đối chiếu.

Dùng nội bộ cho bản thân và bạn bè. Site tĩnh, không backend, không database.

## Stack

- Next.js (static export) + Fumadocs + MDX
- Tailwind CSS v4
- Dark / light theme, đổi font đọc serif / sans
- Search chạy phía client (Orama)

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Build tĩnh: `npm run build` (output ở `out/`).

## Cấu trúc

```
content/docs/<môn>/*.mdx   # bài viết
content/docs/<môn>/meta.json   # thứ tự sidebar
src/lib/subjects.ts        # danh sách môn + màu accent ở trang chủ
src/components/            # Expand, Term, ...
```

## Thêm bài

Xem [CONTRIBUTING.md](CONTRIBUTING.md). Tóm tắt: thêm `.mdx` vào `content/docs/<môn>/`, cập nhật `meta.json`, điền frontmatter (`title`, `description`, `status`, `tags`, `references`), mở PR.

## Tác giả

tranquocvy — nội dung do các thành viên đóng góp.

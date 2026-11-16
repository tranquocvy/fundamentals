# Ngữ cảnh cho agent: `templates/`

Hiện chỉ có `_template.mdx`: khuôn của một bài mới, được `npm run new <môn> <slug>` copy sang `content/docs/<môn>/<slug>.mdx`.

## Phải giữ nguyên

`scripts/new-article.mjs` làm hai việc **bằng thay chuỗi**, nên các chuỗi sau trong template không được đổi:

- `{{title}}` và `{{subject}}`: được thay bằng tiêu đề và slug môn.
- Dòng `# authors: [github-username]` (có dấu `#` ở đầu): được thay bằng `authors: [<tên GitHub>]` khi tìm được; nếu không, dòng này để nguyên là chú thích.

Các dòng `TODO` trong frontmatter là **cố ý**: `npm run check` chặn bài còn chữ `TODO` ở frontmatter, nên người viết buộc phải điền `description`, `references` trước khi qua CI.

## Khi sửa template

- Template phải phản ánh **chuẩn bài hiện hành** ở [content/AGENTS.md](../content/AGENTS.md) (bài sâu, tự cài, output chạy thật, mục `## Lưu ý`). Đổi chuẩn thì sửa cả hai nơi.
- Frontmatter của template phải hợp lệ với `articleSchema` ở `src/lib/source.ts` (`kind` chỉ nhận `book | web | paper | video`). Thêm field mới ở schema thì thêm vào đây và vào CONTRIBUTING mục Frontmatter.
- Thân bài chỉ chứa **hướng dẫn tạm** để người viết xoá đi; đừng đưa nội dung giả trông như thật vào template, vì bài viết dở vẫn build và hiện lên site.
- Chú thích trong MDX dùng `{/* ... */}`. Đừng dùng `<!-- -->` (không hợp lệ trong MDX).
- Template mới cho loại trang khác (ví dụ trang môn `index.mdx`) thì thêm file ở đây và dạy `scripts/new-article.mjs` dùng nó; hiện `index.mdx` của môn viết tay theo mẫu ở các môn có sẵn (frontmatter `title`, `description`, `tags`, rồi bảng "bài nào trả lời câu hỏi gì").

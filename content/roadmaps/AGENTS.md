# Ngữ cảnh cho agent: `content/roadmaps/`

Mỗi file `<tên>.yaml` ở đây là một cây roadmap, tên file là URL (`cs-fundamentals.yaml` thành `/roadmaps/cs-fundamentals`). Đọc [CONTRIBUTING.md](../../CONTRIBUTING.md) mục 4b để có schema đầy đủ; file này giải thích **vì sao** thiết kế như vậy và **trang web sẽ vẽ ra sao**, để cây mới hay node mới khớp với phần còn lại.

Kế hoạch bổ sung chặng và node cho `cs-fundamentals` (khảo sát so với OSSU, Teach Yourself CS, CS2023) nằm ở [EXPANSION.md](EXPANSION.md); đọc trước khi thêm chặng mới.

## 1. Hai cây hiện có

| File | Mục đích | Chặng (section id) |
|---|---|---|
| `cs-fundamentals.yaml` | nền tảng khoa học máy tính cho người tự học | `dsa`, `os`, `networking`, `databases` |
| `backend.yaml` | lộ trình đi làm backend | `foundations`, `api`, `data`, `ops` |

Hai cây **dùng chung bài viết**: node có `article: networking/dns` ở cây nào thì học xong ở cây này, cây kia cũng hiện đã xong, vì tiến trình lưu theo bài (`a:<article>`), không theo cây. Node không có `article` lưu theo `n:<roadmap>/<id>`.

## 2. Luật không được phá

- **`id` node và tên file roadmap là khoá lưu tiến trình trong localStorage của người dùng** (`fundamentals:progress:v1`, và mã sao lưu `fp1.…`). Không đổi tên, không xoá. Muốn bỏ một node: `deprecated: true` (ẩn, id vẫn giữ). `npm run check` so với `main` và báo lỗi nếu có id biến mất.
- Hệ quả khi **gắn `article` vào node đang dùng `resources`**: khoá tiến trình của node đó đổi từ `n:<roadmap>/<id>` sang `a:<article>`. Ai đã đánh dấu xong sẽ phải đánh dấu lại. Chấp nhận được với node chưa có bài (ít người đã học), cần cân nhắc với node đã có người dùng. Cây `backend` có node `http-basics` (cùng chủ đề với bài `networking/http`) chưa gắn bài vì lý do này; gắn khi chấp nhận trade-off, và **vẫn không đổi `id`**.
- Khung kiến thức phải có `sources` từ nguồn mở (OSSU, CS2023, giáo trình công khai...). **Không sao chép nội dung hay cấu trúc của roadmap.sh.**
- Mỗi node có `article` **hoặc** ít nhất một `resources`.

## 3. Trang web vẽ cây thế nào (để thiết kế node cho đúng)

Bố cục tự sinh từ `requires`, không có toạ độ. Quy tắc nằm ở `scripts/roadmap-core.mjs` (`layoutSection`), dùng chung cho build và check:

- **Trục chính** của mỗi chặng là chuỗi node bắt buộc (không `optional`) dài nhất theo `requires`. Hoà nhau thì theo thứ tự trong file. Node gốc bắt buộc không có `requires` trong chặng được xếp nối nhau trên trục theo thứ tự file.
- Node bắt buộc không nằm trên trục thành **nhánh rẽ phải**; node `optional: true` **rẽ trái, nét đứt**. Node cha trên bản đồ là `requires` **đầu tiên** nằm trong cùng chặng; các `requires` còn lại và `requires` sang chặng khác hiện thành dòng "cần …" trên node chứ không vẽ dây. Vì vậy đặt node cha chính lên đầu danh sách.
- Node tuỳ chọn không có cha nằm ở hàng cuối của chặng.
- Mỗi chặng nên 5–9 node, mỗi node tương ứng một bài đọc 15–30 phút. Nhánh sâu quá 2 cấp sẽ chật trên mobile (cần đọc tốt ở 375px).
- Trang `/roadmaps` hiện mỗi cây dạng thẻ với bản đồ nhỏ (SVG), danh sách chặng và tiến trình; trang `/roadmaps/<tên>` vẽ cây đầy đủ, có gợi ý "Học tiếp", và hộp thoại chi tiết từng node ("Nên học trước", "Học xong mở ra"). Màu của chặng lấy từ `subject` (accent theo môn trong `src/lib/subjects.ts`).
- Trạng thái tiến trình chỉ có `done` và `skip`; khoá cũ `learning` còn có thể xuất hiện trong dữ liệu của người dùng và được đọc như "chưa học".
- `effort` (phút) của node có `article` tự tính từ độ dài bài (`WORDS_PER_MINUTE = 160` trong `src/lib/roadmaps.ts`), nên bài 6.000 từ hiện khoảng 38 phút. Chỉ đặt `effort` tay cho node chưa có bài.

## 4. Khi thêm hoặc sửa

- **Thêm node**: id viết thường, gạch ngang, duy nhất trong file; `title`, `description` một câu; `requires` là id có thật; `resources` có tiêu đề ghi tới chương (đặt trong ngoặc kép nếu có `: `).
- **Viết bài cho node chưa có bài**: tạo bài bằng `npm run new <môn> <slug>` (slug trùng id node cho dễ nhớ), rồi thêm `article: <môn>/<slug>` ngay sau `title`. Xem chuẩn bài ở [../AGENTS.md](../AGENTS.md).
- **Thêm chặng** gắn với một môn: `subject` phải là slug có thật trong `src/lib/subjects.ts`; thêm `outcome` (học xong chặng thì làm được gì, một câu).
- **Cây mới**: file mới, `title` và `description`, `order` (thứ tự trên `/roadmaps`), `sources` ≥ 1. Đừng đổi tên file sau khi merge.
- **Kiểm**: `npm run check` (YAML hợp lệ, khoá đúng tên, id duy nhất, `requires` trỏ tới node có thật và không có vòng, `article` tồn tại, `subject` có thật, không id nào bị xoá so với `main`). Để so với nhánh khác: `ROADMAP_BASE_REF=origin/<nhánh> npm run check`. Node có hơn một `requires` trong cùng chặng chỉ bị cảnh báo. Rồi `npm run build` và nhìn trang `/roadmaps/<tên>` ở desktop và 375px, cả dark lẫn light.
- CSS của roadmap nằm trong khối "Roadmap" của `src/app/global.css` (class `.rm`, `.rm-section`, `.rm-pill`...). Màu dùng token (`--color-fd-*`, `--subject-accent`), không hard-code; `src/app/global.css` đang là CRLF trong working tree.

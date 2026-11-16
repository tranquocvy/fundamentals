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

**Độ sâu**: bài ở đây dài và có code tự cài, output chạy thật, bảng so sánh, phần quan sát trên hệ thống thật. Chuẩn chi tiết và các bài mẫu nằm ở [content/AGENTS.md](content/AGENTS.md); đọc trước khi viết, vì quy ước ngắn gọn ở bảng trên không nói về độ sâu.

Cấu trúc bài gợi ý: `## Ý chính` → các phần giải thích → `## Khi nào dùng / Lưu ý` (tuỳ bài). Không cần mục "Tài liệu tham khảo" trong nội dung vì trang tự hiển thị từ frontmatter `references`.

### Giọng điệu ký hiệu code (quan trọng)

Site có chất "coder" nhưng **dùng tiết chế**. Ký hiệu kiểu terminal chỉ xuất hiện ở các chỗ cố định:

- breadcrumb đường dẫn: `~/os/process-thread`
- dòng mở đầu trang chủ: `$ cat README.md`
- link nav: `~/home`, `/subjects`, `/contribute`; link hành động: `> bắt đầu ...`
- nhãn `~/subjects`, số thứ tự `01 /`, tag `#os`, nhãn `draft`, loại nguồn `[book]` `[web]`

**Không** thêm `//`, `[+]`, `$`, `>` vào tiêu đề bài, heading trong bài, nút hay component mới. Heading trong bài là chữ thường, phần trang trí (vạch accent) do CSS lo.

## 3. Các bước thêm một bài

1. Tạo bài bằng lệnh (slug viết thường, tiếng Anh, gạch ngang):
   ```bash
   npm run new os virtual-memory                    # tiêu đề tự sinh: "Virtual Memory"
   npm run new os virtual-memory "Virtual Memory"   # hoặc tự đặt tiêu đề
   ```
   Lệnh này copy [`templates/_template.mdx`](templates/_template.mdx) thành `content/docs/os/virtual-memory.mdx` và thêm `virtual-memory` vào cuối `content/docs/os/meta.json`. Muốn đổi vị trí trong sidebar thì sửa thứ tự trong `meta.json`.
2. Điền các dòng `TODO` trong frontmatter, viết nội dung.
3. `npm run dev`, mở `http://localhost:3000/docs/<môn>/<slug>` để xem.
4. `npm run check` rồi `npm run build` phải pass.
5. Commit (Conventional Commits, mục 8), mở Pull Request vào `main`. CI sẽ tự chạy lại `check`, `types:check`, `build`; PR chỉ merge khi CI xanh. Vercel tạo link preview cho PR để xem trước.

### Frontmatter

```yaml
---
title: Virtual Memory              # bắt buộc, giữ thuật ngữ tiếng Anh nếu là tên khái niệm
description: Một câu tiếng Việt tóm tắt bài.   # bắt buộc
status: draft                      # draft | reviewed (chỉ người review mới đổi sang reviewed)
tags: [os, memory]                 # chữ thường, tiếng Anh
authors: [github-username]         # `npm run new` tự điền (để hiện avatar); bỏ trống thì chỉ hiện tên từ git commit đầu tiên
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
<Term>address space</Term>                 lấy giải nghĩa từ glossary (cách nên dùng)
<Term id="process">các process</Term>      chữ hiển thị khác khoá trong glossary
<Term def="Giải nghĩa riêng.">từ mới</Term>  giải nghĩa chỉ dùng trong bài này

<Expand title="Ví dụ: counter++ bị xen kẽ">
Nội dung markdown bình thường, có thể có code block.
</Expand>
```

Muốn thêm component mới: tạo trong `src/components/`, đăng ký ở `src/components/mdx.tsx`, cập nhật mục này.

### Glossary dùng chung

Giải nghĩa thuật ngữ nằm ở **một chỗ**: [`content/glossary.json`](content/glossary.json). Mọi bài dùng chung, trang `/docs/glossary` liệt kê tất cả.

```json
"virtual memory": {
  "def": "Một câu giải nghĩa ngắn, tiếng Việt.",
  "subject": "os",
  "aliases": ["vm"]
}
```

- Khoá là thuật ngữ tiếng Anh viết thường, giữ thứ tự ABC. Từ viết tắt thêm `"label": "TCP"` để trang Glossary hiển thị đúng chữ hoa.
- `aliases` (tuỳ chọn): các cách viết khác (số nhiều, viết tắt) để `<Term>vm</Term>` cũng tra được.
- Dùng `<Term>` với thuật ngữ chưa có trong glossary mà không kèm `def` thì `npm run check` và build đều báo lỗi, nên CI sẽ chặn.
- Ưu tiên thêm vào glossary thay vì `def="..."`: định nghĩa thống nhất giữa các bài.

## 4. Thêm một môn mới

1. Tạo thư mục `content/docs/<slug-môn>/` gồm:
   - `index.mdx`: trang giới thiệu môn (frontmatter `title`, `description`, `tags`).
   - `meta.json`: `{ "title": "Tên môn", "pages": ["bai-1", "bai-2"] }`. **Không** ghi `index` vào `pages`, vì nó tự thành trang của thư mục.
2. Thêm `<slug-môn>` vào `pages` của `content/docs/meta.json`.
3. Trong `src/lib/subjects.ts`: đặt `ready: true` cho môn đó (hoặc thêm mục mới, kèm 2 màu accent).
4. Trong `src/app/global.css`: thêm 2 dòng `html[data-subject='<slug>']` và `.dark[data-subject='<slug>']` với cùng 2 màu.
   - Màu light phải đủ tương phản trên nền `#f6f5f1`, màu dark trên nền `#0e0f13` (WCAG AA cho chữ thường: ≥ 4.5:1).

## 4b. Roadmap

Mỗi roadmap là **một file YAML** trong [`content/roadmaps/`](content/roadmaps). Tên file là URL: `backend.yaml` → `/roadmaps/backend`. Thêm file là có cây mới; sửa file là thêm/bớt chủ đề. Không phải viết code.

```yaml
title: Backend                       # bắt buộc
description: Một câu mô tả cây.      # bắt buộc
order: 2                             # tuỳ chọn, thứ tự trên trang /roadmaps
sources:                             # ≥ 1, nguồn của KHUNG kiến thức (không copy roadmap.sh)
  - name: OSSU Computer Science
    url: https://github.com/ossu/computer-science
    note: thứ tự các môn Core        # tuỳ chọn
sections:                            # mỗi section là một "chặng" trên trục
  - id: os                           # viết thường, gạch ngang, duy nhất trong file
    title: Operating Systems
    subject: os                      # tuỳ chọn, slug trong src/lib/subjects.ts → lấy màu của môn
    description: Một câu về chặng này.
    outcome: Giải thích được một chương trình chạy thế nào.   # tuỳ chọn, học xong chặng thì làm được gì
    nodes:
      - id: process-thread           # CỐ ĐỊNH MÃI MÃI (xem bên dưới)
        title: Process vs Thread
        article: os/process-thread   # bài trong content/docs; không có thì hiện "Viết bài này"
        requires: [complexity]       # tuỳ chọn, id node nên học trước (cùng file, khác section được)
        optional: true               # tuỳ chọn, chủ đề không bắt buộc
        description: Một câu.        # tuỳ chọn
        effort: 40                   # tuỳ chọn, số phút ước lượng; node có article thì tự tính từ độ dài bài
        resources:                   # link ngoài; BẮT BUỘC ≥ 1 nếu node chưa có article
          - title: "OSTEP — Chapter 4: Processes"   # có dấu ": " thì đặt trong ngoặc kép
            url: https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf
```

**Bố cục tự sinh, không nhập toạ độ.** Trang cây vẽ mỗi chặng thành một trục với các nhánh, suy ra từ `requires`:

- `requires` **đầu tiên** nằm trong cùng chặng là node cha trên bản đồ. Các `requires` còn lại, và `requires` sang chặng khác, hiện thành dòng "cần …" trên node chứ không vẽ dây. Vì vậy hãy đặt node cha chính lên đầu danh sách.
- Trục chính là chuỗi node bắt buộc dài nhất (hoà nhau thì theo thứ tự trong file). Node bắt buộc không nằm trên trục thành nhánh rẽ phải; node `optional: true` rẽ trái với nét đứt.
- Node gốc bắt buộc không có `requires` trong chặng được xếp nối tiếp nhau trên trục theo thứ tự trong file.
- Mỗi chặng nên có 5–9 node, một node tương ứng một bài đọc 15–30 phút. Nhánh sâu quá 2 cấp sẽ chật trên mobile.
- Mỗi node phải có `article` hoặc ít nhất một `resources`, để người học luôn có chỗ bắt đầu.

**Quy tắc id (quan trọng):** id node là khoá lưu tiến trình trong trình duyệt người dùng. Đổi tên hay xoá id làm tiến trình của họ biến mất.

- Không đổi tên, không xoá id đã merge. Muốn bỏ một node: thêm `deprecated: true` (node bị ẩn, id vẫn giữ).
- Không đổi tên file roadmap đã merge (URL và tiến trình sẽ hỏng).
- Node có `article` lưu tiến trình theo bài, nên học "Process vs Thread" ở cây nào thì mọi cây chứa bài đó đều hiện đã xong.

`npm run check` (và CI) kiểm: YAML hợp lệ, khoá đúng tên, id duy nhất, `requires` trỏ tới node có thật, **không có vòng phụ thuộc**, `article` tồn tại, `subject` có thật, node chưa có `article` thì có `resources`, và **không id nào bị xoá so với `main`** (so với nhánh khác: `ROADMAP_BASE_REF=origin/<nhánh> npm run check`). Node có hơn một `requires` trong cùng chặng chỉ bị cảnh báo, không chặn.

Ngữ cảnh thiết kế của roadmap (cách trang vẽ cây, vì sao id bất biến, đánh đổi khi gắn `article`) ở [content/roadmaps/AGENTS.md](content/roadmaps/AGENTS.md).

Khi viết bài cho một node chưa có bài: tạo bài bằng `npm run new`, rồi thêm `article: <môn>/<slug>` vào node đó trong file roadmap.

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
- [ ] Thuật ngữ mới đã thêm vào `content/glossary.json`
- [ ] Sửa roadmap: không đổi/xoá id node đã có (dùng `deprecated: true`)
- [ ] `npm run check` và `npm run build` pass
- [ ] Commit message theo Conventional Commits (mục 8)
- [ ] Xem thử cả dark/light và màn hình hẹp

## 7. Lệnh hay dùng

```bash
npm install          # cài deps
npm run dev          # xem trước ở http://localhost:3000
npm run new <môn> <slug>  # tạo bài mới từ template
npm run check        # kiểm frontmatter, meta.json, glossary
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

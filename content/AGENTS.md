# Ngữ cảnh cho agent: thư mục `content/`

Đọc file này **sau** [CONTRIBUTING.md](../CONTRIBUTING.md) khi bạn viết hoặc sửa bất cứ thứ gì trong `content/docs/` (bài ghi chú), `content/glossary.json` hoặc `content/roadmaps/` (xem thêm [roadmaps/AGENTS.md](roadmaps/AGENTS.md)). CONTRIBUTING nói **luật** (frontmatter, lệnh, checklist); file này nói **chuẩn chất lượng** và **cách các bài hiện có được viết**, để bài mới trông và đọc như cùng một bộ.

> Không đặt file `.md` hay `AGENTS.md` bên trong `content/docs/`. Fumadocs coi mọi `.md` ở đó là một trang và sẽ làm hỏng build hoặc tạo trang lạ. Ghi chú cho agent nằm ở `content/` và `content/roadmaps/`.

## 1. Bản đồ

```text
content/
  docs/<môn>/        bài ghi chú, mỗi môn một thư mục: index.mdx, meta.json, <slug>.mdx
  glossary.json      giải nghĩa thuật ngữ dùng chung (cho <Term>)
  roadmaps/<tên>.yaml  một cây roadmap mỗi file
```

Các môn khai báo ở `src/lib/subjects.ts`; môn nào có `ready: true` mới hiện nội dung. Môn chưa có bài hiện nhãn "soon". Màu accent của môn khai báo sẵn ở đó, và `src/app/global.css` cần hai dòng màu tương ứng khi tạo môn (CONTRIBUTING mục 4).

Trạng thái hiện tại: chặng **Operating Systems** (7 bài) và **Computer Networks** (6 bài) viết theo chuẩn sâu bên dưới. **Data Structures & Algorithms** và **Databases** chưa có môn: node trong roadmap `cs-fundamentals` mới chỉ có link ngoài. Xem `content/roadmaps/cs-fundamentals.yaml` để biết node nào đã có `article`, đó là nguồn sự thật, đừng dựa vào danh sách trong file này.

### Bản đồ từng môn (để biết bài nào nối với bài nào)

Môn không thể có file ghi chú riêng trong `content/docs/<môn>/` (xem cảnh báo trên), nên bản đồ nằm ở đây. Thứ tự dưới đây là thứ tự trong `meta.json` và cũng là thứ tự đọc; danh sách bài thật luôn lấy từ `meta.json` và roadmap, đừng chỉ tin vào bảng này.

| Môn | Thứ tự đọc | Liên kết chéo đã có |
|---|---|---|
| `os` | process-thread, cpu-scheduling, synchronization, deadlock, virtual-memory, file-systems, io-devices | process-thread dẫn tới synchronization và virtual-memory; cpu-scheduling, virtual-memory và synchronization dẫn về process-thread; synchronization dẫn tới deadlock; file-systems dẫn tới virtual-memory và io-devices; io-devices dẫn tới cpu-scheduling, file-systems và process-thread |
| `networking` | network-layers, ip-routing, tcp-vs-udp, dns, http, tls | chuỗi `requires` trong roadmap: network-layers, ip-routing, tcp-vs-udp, rồi dns và http, http dẫn tới tls. Các bài dẫn chéo nhau theo kiểu đã học tới đâu nhắc tới đó (ví dụ tls dẫn về http, dns, tcp-vs-udp, network-layers). Dẫn sang OS: tcp-vs-udp tới os/cpu-scheduling (trung bình mũ cho RTO) và os/io-devices (epoll); network-layers và http tới os/process-thread và os/io-devices |

Bài viết cho môn mới nên chọn thứ tự đọc **theo chuỗi `requires`** của node trong roadmap, và để bài sau dẫn link về bài trước. Môn `dsa` và `databases` chưa tạo: bài `databases/indexing` sẽ cần `dsa/trees` (B-tree), và `databases/transactions` cần `os/synchronization` và `os/file-systems` (journaling).

## 2. Chuẩn độ sâu của một bài (đã thống nhất với chủ repo)

Chủ repo muốn bài **đủ kiến thức, đủ ví dụ, implement đủ sâu để người làm IT nắm chắc, không sơ sài, không ngại dài**. Các bài ngắn 300–850 từ ban đầu chỉ là bản tạm và đã được viết lại. Bài đạt chuẩn thường dài **5.000 tới 12.000 từ** (tính cả code); độ dài là hệ quả của việc đi tới cơ chế, đừng độn.

Một bài đạt chuẩn có đủ:

1. **Mở bằng `## Ý chính`**: hai, ba đoạn nêu khái niệm cốt lõi, bài toán nó giải, rồi một đoạn nói bài đi theo trình tự nào và output lấy từ đâu.
2. **Đi từ dưới lên, giải thích vì sao.** Mỗi cơ chế là lời giải cho một vấn đề cụ thể của cơ chế trước nó (ví dụ: địa chỉ vật lý, base and bounds, segmentation, paging; hay stop-and-wait, cửa sổ trượt, TCP).
3. **Tự cài thứ đang nói tới**, không chỉ dùng API: spinlock và mutex trên futex, Banker's algorithm, trình mô phỏng scheduler, `ping` và `traceroute` qua raw socket, resolver DNS đi từ root xuống, server HTTP/1.1 trên socket, trie cho longest prefix match, X25519 viết tay.
4. **Ví dụ tính tay có số cụ thể**, và số khớp với output của code trong bài.
5. **Bảng so sánh** khi có từ hai lựa chọn song song trở lên.
6. **Hệ thống thật**: Linux làm thế nào (system call, file trong `/proc`, tham số `sysctl`), phần mềm quen thuộc chọn gì và vì sao (PostgreSQL, Nginx, Redis, Chrome, Go...).
7. **Mục quan sát và chẩn đoán**: lệnh nào để thấy cơ chế trên máy thật, đọc output ra sao, bảng "triệu chứng, nguyên nhân hay gặp".
8. **Kết bằng `## Lưu ý`**: 6 tới 12 gạch đầu dòng về hiểu lầm và cái bẫy thực tế. Đây là mục duy nhất được phép là danh sách dài.
9. **Liên kết chéo** bằng `/docs/<môn>/<slug>` tới các bài đã có khi nhắc khái niệm có bài riêng (ví dụ TCP dẫn về CPU Scheduling cho exponential averaging, I/O & Devices cho epoll).

Không làm: viết dạng câu hỏi phỏng vấn; chép định nghĩa sách giáo khoa; mục "Tài liệu tham khảo" trong thân bài; số liệu hay output không chạy ra từ máy thật.

### Mẫu để bắt chước

Khi cần ví dụ về giọng văn, độ chi tiết, cách đặt code và output cạnh nhau, đọc một bài đã viết xong thay vì suy diễn:

| Muốn học cách | Đọc |
|---|---|
| tự cài một cơ chế rồi so sánh bằng số đo | `content/docs/os/synchronization.mdx`, `content/docs/os/cpu-scheduling.mdx` |
| bóc từng byte của một giao thức, tự dựng gói tin | `content/docs/networking/dns.mdx`, `content/docs/networking/network-layers.mdx` |
| đi từ vấn đề tới giải pháp qua nhiều tầng, kèm mô phỏng | `content/docs/networking/tcp-vs-udp.mdx` |
| mô hình hoá bằng bảng tính tay | `content/docs/os/virtual-memory.mdx` |

## 3. Quy trình viết một bài

1. **Tạo file.** Bài mới: `npm run new <môn> <slug>` (slug trùng `id` của node roadmap nếu bài trả lời cho node đó). Lệnh tự thêm vào cuối `meta.json`; sửa tay thứ tự cho khớp thứ tự đọc. Bài viết lại: ghi đè, giữ `authors`.
2. **Frontmatter.** `status: draft` (kể cả khi viết lại bài đang `reviewed`; chỉ người review mới đổi lại). `description` một câu nói bài bao phủ những gì. `references`: 6 tới 9 nguồn, ghi tới chương, có `note` nói đọc phần nào; ưu tiên RFC, sách gốc, tài liệu chính thức.
3. **Chạy code trước, viết văn sau.** Mọi đoạn code trong bài được viết thành file trong thư mục tạm (không phải trong repo), chạy thật, rồi dán **nguyên code và nguyên output** vào bài. Không bịa output. Nếu một đoạn không chạy được trên máy bạn (không có gcc, không có quyền root...), nói rõ trong bài là output minh hoạ, đừng trình bày như chạy thật.
4. **Thuật ngữ.** Bọc `<Term>` ở lần xuất hiện đầu. Viết xong cả một chặng mới thêm glossary một lượt (mục 5).
5. **Gắn vào roadmap.** Thêm `article: <môn>/<slug>` ngay sau `title` của node tương ứng trong `content/roadmaps/*.yaml`. Giữ nguyên `resources`. **Không đổi `id`.**
6. **Cập nhật `index.mdx` của môn**: bảng "bài nào trả lời câu hỏi gì", theo thứ tự đọc. Và `meta.json`.
7. **Kiểm tra**: `npm run check`, rồi dừng dev server, rồi `npm run build`. Mở từng trang ở `/docs/<môn>/<slug>` và nhìn: không có dòng `| ... |` hiện thành chữ thô, không có thẻ `<Term>` hay `<Expand>` hiện thành chữ.

## 4. Bẫy MDX và bẫy viết bài

- `<` và `{` trong **văn xuôi** làm hỏng MDX. `Mutex<T>`, `/proc/<pid>/maps`, `a < b`, `{ ... }` phải nằm trong backtick hoặc code block.
- **Không đặt ký tự `|` trong inline code nằm trong ô bảng** (ví dụ `grep -E 'a|b'`): nó cắt ô. Viết lại lệnh hoặc đưa ra ngoài bảng.
- Trong `<Expand title="...">`, để một dòng trống sau thẻ mở và trước thẻ đóng.
- `<Term>x</Term>` tra glossary không phân biệt hoa thường và tra cả `aliases`. Thuật ngữ chưa có mà không kèm `def` thì `npm run check` báo lỗi.
- Heading chữ thường, không thêm `//`, `[+]`, `$`, `>`. Block ví dụ có thể dùng `$` ở đầu dòng **bên trong code block** nhưng nên tránh khi output bị dán lại.
- Trong working tree trên Windows, `content/glossary.json` và `src/app/global.css` đang là CRLF còn `.mdx` là LF (`.gitattributes` chuẩn hoá về LF khi commit). Khi sửa bằng script, mở file bằng `newline=''` để giữ nguyên; Python ghi file ở chế độ text trên Windows sẽ đổi LF thành CRLF và làm diff phình. Sau khi ghi `.mdx` bằng Python, kiểm tra bằng `file <tên>` rằng không có "CRLF line terminators".
- `scripts/check-content.mjs` chặn frontmatter còn chữ `TODO`.
- Dữ liệu từ máy của người chạy thí nghiệm (IP nhà mạng, MAC, tên người dùng, đường dẫn máy) có thể lộ vào output. Lược bỏ hoặc nói rõ đã lược, đừng sửa số cho đẹp.

## 5. Glossary

`content/glossary.json`: khoá viết thường, sắp ABC. Mỗi mục:

```json
"compare-and-swap": {
  "def": "Một câu tiếng Việt.",
  "subject": "os",
  "aliases": ["cas"]
}
```

Từ viết tắt thêm `"label": "TLB"`. Cách làm: viết xong cả chặng, quét mọi `<Term>` trong thư mục môn, so với khoá và alias trong glossary để ra danh sách thiếu, thêm một lượt, sắp lại ABC. Đừng lặp `def` cho thuật ngữ đã có. Các môn đang dùng `subject`: `os`, `networking`.

## 6. Môi trường thí nghiệm đã dùng (để bài sau cùng cách)

Các bài hiện có chạy trên Windows với WSL2 Ubuntu (`wsl -d Ubuntu -u root -- bash -lc "..."`), Python 3 (đặt `PYTHONIOENCODING=utf8`). Các kỹ thuật lặp lại được:

- **Bắt gói và dựng gói tin**: raw socket `AF_PACKET` trên `lo` hay `eth0` (cần root) và giải mã bằng `struct`; không cần `tcpdump`.
- **Mô phỏng mất gói và trễ**: `tc qdisc add dev lo root netem ...` cho trễ; `tc qdisc add dev lo handle ffff: ingress` kèm filter `u32` để **bỏ gói ở chiều vào** (netem loss ở chiều ra làm gói bị mất trước khi bộ bắt gói thấy). Luôn dọn lại: `tc qdisc del dev lo root` và `ingress`, và đặt lại MTU của `lo` là 65536 nếu đã đổi.
- **Không có sẵn**: `gcc`, `dig`, `tcpdump`, `traceroute`, `iptables`. Ví dụ C trong chặng OS chưa được biên dịch (ghi rõ trong bài). Docker daemon không chạy. Thư viện `cryptography` của Python có trong WSL.
- Máy chạy thí nghiệm có IP nhà mạng thật; đừng đưa nguyên các hop hay địa chỉ của nhà mạng vào bài.

## 7. Git

- Conventional Commits (CONTRIBUTING mục 8): `content(networking): ...`, `content(os): ...`.
- Hiện chặng OS và Networking nằm chung nhánh `content/os-deep-dive`, theo ý chủ repo.
- Không commit `HANDOFF.md` nếu nó còn trong working tree: đó là ghi chú bàn giao tạm của người cũ, phần bền của nó đã nằm ở file này và CONTRIBUTING.

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

Trạng thái hiện tại: năm chặng của `cs-fundamentals` (**Computer Architecture** 4 bài, **Operating Systems** 8 bài, **Computer Networks** 7 bài, **Data Structures & Algorithms** 8 bài, **Databases** 7 bài) đã có bài, đều `draft`. Chỉ `dsa/complexity` và `databases/indexing` theo chuẩn ở mục 2; các bài còn lại viết theo chuẩn cũ (dài) và chờ viết lại khi chủ repo yêu cầu. Chặng và node mới dự kiến nằm ở [roadmaps/EXPANSION.md](roadmaps/EXPANSION.md). Xem `content/roadmaps/cs-fundamentals.yaml` để biết node nào đã có `article`, đó là nguồn sự thật, đừng dựa vào danh sách trong file này.

### Bản đồ từng môn (để biết bài nào nối với bài nào)

Môn không thể có file ghi chú riêng trong `content/docs/<môn>/` (xem cảnh báo trên), nên bản đồ nằm ở đây. Thứ tự dưới đây là thứ tự trong `meta.json` và cũng là thứ tự đọc; danh sách bài thật luôn lấy từ `meta.json` và roadmap, đừng chỉ tin vào bảng này.

| Môn | Thứ tự đọc | Liên kết chéo đã có |
|---|---|---|
| `architecture` | data-representation, isa-assembly, memory-hierarchy, pipeline-branch-prediction | data-representation dẫn tới dsa/strings, networking/network-layers và databases/relational-model (NUMERIC); isa-assembly dẫn về data-representation và tới architecture/pipeline-branch-prediction, os/process-thread, os/virtual-memory, dsa/graphs; memory-hierarchy dẫn tới dsa/arrays-linked-lists, dsa/trees, os/virtual-memory, os/file-systems, os/synchronization, databases/query-processing; pipeline-branch-prediction dẫn về memory-hierarchy và tới dsa/sorting, os/cpu-scheduling, os/process-thread. Thí nghiệm bằng C chạy trong WSL2 sau khi `apt-get install gcc`; `/tmp` của WSL bị xoá khi distro tắt nên biên dịch và chạy trong cùng một lần gọi |
| `os` | process-thread, cpu-scheduling, synchronization, deadlock, virtual-memory, file-systems, io-devices, virtualization-containers | process-thread dẫn tới synchronization và virtual-memory; cpu-scheduling, virtual-memory và synchronization dẫn về process-thread; synchronization dẫn tới deadlock; file-systems dẫn tới virtual-memory và io-devices; io-devices dẫn tới cpu-scheduling, file-systems và process-thread; virtualization-containers dẫn tới process-thread, cpu-scheduling (cgroup), virtual-memory (OOM) và networking/ip-routing (veth) |
| `dsa` | complexity, arrays-linked-lists, hash-tables, trees, sorting, graphs, dynamic-programming, strings | mỗi bài dẫn về bài trước: arrays-linked-lists về complexity; hash-tables về complexity và arrays-linked-lists; trees về complexity và arrays-linked-lists (và dẫn tới databases/indexing về sau); sorting dùng heap của trees; graphs dùng heap (trees), hàng đợi (arrays-linked-lists), bảng băm (hash-tables) và sort (sorting); dynamic-programming dẫn về complexity (Fibonacci) và graphs. Dẫn sang OS: trees tới os/cpu-scheduling (CFS), os/virtual-memory, os/file-systems; graphs tới os/deadlock; arrays-linked-lists tới os/process-thread và os/io-devices. Dẫn sang Networking: trees và graphs tới networking/ip-routing |
| `databases` | relational-model, indexing, transactions, isolation-levels, normalization, storage-engines, query-processing | indexing dẫn về relational-model (EXPLAIN) và dsa/trees (B+ tree); transactions dẫn về os/file-systems (journaling), os/synchronization và os/deadlock, dsa/graphs (đồ thị chờ); isolation-levels dẫn về transactions (MVCC), os/deadlock và dsa/graphs; normalization dẫn về relational-model, indexing, transactions; storage-engines dẫn về indexing, transactions và dsa/trees; query-processing dẫn về relational-model, indexing, dsa/hash-tables, dsa/sorting và dsa/dynamic-programming; dsa/strings dẫn về hash-tables, trees, databases/indexing |
| `networking` | network-layers, ip-routing, tcp-vs-udp, dns, http, tls, sockets | chuỗi `requires` trong roadmap: network-layers, ip-routing, tcp-vs-udp, rồi dns và http, http dẫn tới tls. Các bài dẫn chéo nhau theo kiểu đã học tới đâu nhắc tới đó (ví dụ tls dẫn về http, dns, tcp-vs-udp, network-layers). Dẫn sang OS: tcp-vs-udp tới os/cpu-scheduling (trung bình mũ cho RTO) và os/io-devices (epoll); network-layers và http tới os/process-thread và os/io-devices; sockets dẫn về tcp-vs-udp, http, os/io-devices (epoll), os/cpu-scheduling và os/process-thread |

Bài viết cho môn mới nên chọn thứ tự đọc **theo chuỗi `requires`** của node trong roadmap, và để bài sau dẫn link về bài trước. Bài `databases/indexing` cần `dsa/trees` (B-tree), và `databases/transactions` cần `os/synchronization` và `os/file-systems` (journaling): các liên kết này đã có.

## 2. Chuẩn một bài học (đã thống nhất với chủ repo)

### Mục tiêu

Site dạy **kiến thức nền tảng để hiểu thật**, nhờ vậy người đọc vững khi đi làm và khi phỏng vấn IT. Bài phải giúp người chưa biết gì về chủ đề hiểu được phần cốt lõi; kiến thức nâng cao là **phần mở rộng**, không chen vào mạch chính.

**Không giới hạn số từ hay thời gian đọc**, vì mỗi chủ đề cần lượng nội dung khác nhau. Thứ được quy ước là **cấu trúc và cách viết**. Phép thử cho mọi đoạn: nó có giúp trả lời câu hỏi của bài (`description`) ở mức nền tảng không? Không thì bỏ, hoặc chuyển xuống `## Đi sâu hơn`.

Trước đây chuẩn là "không ngại dài, 5.000 tới 12.000 từ, có đủ hệ thống thật và mục chẩn đoán". Chuẩn đó làm bài phình thành tài liệu từ cơ bản tới chuyên sâu, và đã bị thay. **Các bài viết trước chuẩn này chưa được viết lại**; đừng lấy cấu trúc của chúng làm mẫu.

### Cơ sở

Cấu trúc dưới đây dựa trên các kết quả nghiên cứu về học tập được lặp lại nhiều lần:

| Nguyên tắc | Áp dụng trong bài | Nguồn |
|---|---|---|
| Bộ nhớ làm việc có hạn; quá nhiều chữ hay nhiều thứ mới cùng lúc làm người đọc quá tải | một ý mỗi mục, định nghĩa thuật ngữ trước khi dùng, cắt phần không phục vụ câu hỏi của bài | Sweller, Cognitive Load Theory; Mayer, coherence và segmenting principles |
| Người mới học tốt hơn từ ví dụ giải sẵn; khi đã quen, nên giảm dần phần giải sẵn | chuỗi ví dụ giải sẵn → giải một nửa → tự làm | Renkl & Atkinson 2003 (faded worked examples); Kalyuga 2003 (expertise reversal) |
| Tự nhớ lại và tự trả lời giúp nhớ lâu hơn đọc lại | câu "Thử ngay" cuối mỗi mục, "Tự kiểm tra tổng hợp" cuối bài | Roediger & Karpicke 2006; Dunlosky và cộng sự 2013 |
| Đoán trước rồi xem kết quả làm người đọc chú ý vào chỗ lệch giữa đoán và thật | câu "Đoán trước" ngay trước output hay kết luận | White & Gunstone 1992 (Predict–Observe–Explain) |
| Nối ví dụ cụ thể với quy tắc trừu tượng | con số thật trước, quy tắc sau, rồi kiểm lại bằng số | Pashler và cộng sự 2007 (IES practice guide) |
| Sửa hiểu lầm hiệu quả nhất khi nêu thẳng ra và giải thích vì sao sai, ngay chỗ nó nảy ra | "Nhiều người nghĩ X. Thật ra Y, vì Z." đặt trong mục liên quan | Tippett 2010 (refutation text) |
| Hình ảnh động chỉ giúp khi người học phải tương tác với nó, xem không thì gần như vô ích | chỉ làm widget khi người đọc tự đổi input và phải đoán | Hundhausen, Douglas & Stasko 2002; Naps và cộng sự 2002; Tversky, Morrison & Bétrancourt 2002 |

### Khung bài

Theo đúng thứ tự:

1. **`description` là câu hỏi mà bài trả lời**, viết bằng lời của người chưa biết. Ví dụ: "Làm sao biết một thuật toán sẽ chậm đi bao nhiêu khi dữ liệu lớn lên, mà không cần chạy thử trên mọi máy?"
2. **Dòng `**Cần biết trước:**`** nêu kiến thức cần có và link tới bài tương ứng. Ngay sau đó là **dòng `**Cách đọc bài:**`** giải thích hai câu Đoán trước và Thử ngay (chép từ bài mẫu).
3. **`## Ý chính`**: 2 đoạn ngắn trả lời thẳng câu hỏi của bài. Người chỉ đọc mục này vẫn nắm được ý cốt lõi.
4. **Các mục chính, mỗi mục một ý**, đi từ vấn đề tới cơ chế giải quyết nó. Mỗi mục là một **vòng nhỏ**:
   - mở bằng vấn đề, hoặc câu **`**Đoán trước:**`** đặt ngay trước output hay kết luận mà người đọc cần đoán;
   - ví dụ cụ thể có số thật (code ngắn và output chạy thật, hoặc bảng tính tay);
   - rút ra quy tắc từ ví dụ;
   - nếu mục đó có một hiểu lầm hay gặp, viết **`**Hiểu lầm hay gặp ở đây:**`** theo dạng "Nhiều người nghĩ X. Thật ra Y, vì Z.";
   - kết bằng **`**Thử ngay:**`**: một câu hỏi ngắn, đáp án trong `<Expand title="Đáp án">`.
5. **Kỹ năng thì dạy bằng chuỗi ví dụ mờ dần** (khi bài dạy một cách làm, như đọc độ phức tạp từ code hay tính subnet). Ba mục con: **Ví dụ 1 (giải sẵn)** đủ từng bước; **Ví dụ 2 (giải một nửa)** để chỗ trống `___` cho người đọc điền; **Ví dụ 3 (tự làm)**. Đáp án của ví dụ 2 và 3 nằm trong `<Expand>` và có kiểm bằng số.
6. **Bảng so sánh** khi có từ hai lựa chọn song song trở lên.
7. **`## Tự kiểm tra tổng hợp`**: 3 tới 5 câu trộn kiến thức của nhiều mục, khó hơn các câu Thử ngay. Ưu tiên câu "vì sao", "nếu đổi X thì sao", hoặc đọc một đoạn code thật. Không hỏi lại định nghĩa. Mọi đáp án nằm chung trong một `<Expand title="Đáp án">`.
8. **`## Đi sâu hơn`**: phần nâng cao, mỗi chủ đề một `<Expand>` (chứng minh chặt, định lý, cách hệ thống thật cài đặt, đo đạc chi tiết), hoặc link sang bài khác. **Mạch chính phải đọc hiểu trọn vẹn khi không mở phần này.**

Không có mục "Hiểu lầm thường gặp" hay "Lưu ý" riêng ở cuối bài: hiểu lầm đặt ngay tại mục nó nảy ra.

### Cách viết

- Một đoạn một ý. Câu ngắn. Xưng hô tự nhiên với người đọc.
- Thuật ngữ được định nghĩa **trước** lần dùng đầu, bọc `<Term>`.
- Code trong mạch chính phải ngắn và chỉ minh hoạ đúng ý đang nói. Không dồn nhiều hàm vào một khối khi người đọc chưa biết đang đo cái gì; giới thiệu từng hàm ở mục cần nó.
- Ví dụ chạy được thì phải có cả code lẫn output thật, và số trong văn khớp số trong output.
- **Liên kết chéo** bằng `/docs/<môn>/<slug>` khi nhắc khái niệm có bài riêng, thay vì giải thích lại.
- **Hệ thống thật** (Linux làm thế nào, PostgreSQL hay Redis chọn gì) chỉ vào mạch chính khi nó giúp hiểu ý nền tảng; còn lại để ở Đi sâu hơn.

### Widget tương tác

Chỉ làm khi thoả **cả ba** điều kiện: người đọc **tự đổi input**; bài có câu Đoán trước đi kèm; và hình hay bảng tĩnh không thể hiện được điều đó (thường là thứ thay đổi theo một tham số, hoặc một quá trình chạy từng bước). Widget là client component ở `src/components/`, viết để **dùng lại được cho nhiều bài**, và mạch chính vẫn phải hiểu được khi không có nó (ví dụ trang `llms.txt` không chạy được widget). Hiện có `<GrowthChart>` (CONTRIBUTING mục "Component dùng được trong MDX").

### Không làm

Viết dạng ngân hàng câu hỏi phỏng vấn hoặc mẹo trả lời; chép định nghĩa sách giáo khoa; mục "Tài liệu tham khảo" trong thân bài; số liệu hay output không chạy ra từ máy thật; độn nội dung nâng cao vào mạch chính.

### Mẫu để bắt chước

**Cấu trúc và cách viết**: `content/docs/dsa/complexity.mdx` (bài dùng Python) và `content/docs/databases/indexing.mdx` (bài dùng SQL trên PostgreSQL, thí nghiệm nối tiếp nhau trên cùng bảng) đã theo chuẩn này. Bắt chước chúng: dòng Cách đọc bài, vòng nhỏ ở mỗi mục, chuỗi ví dụ 1/2/3, Hiểu lầm hay gặp ở đây, Tự kiểm tra tổng hợp, Đi sâu hơn.

Các bài dưới viết theo chuẩn cũ (dài, nhiều nâng cao trong mạch chính). Chỉ dùng chúng để học **kỹ thuật làm thí nghiệm**, đừng bắt chước cấu trúc:

| Muốn học kỹ thuật | Đọc |
|---|---|
| tự cài một cơ chế rồi so sánh bằng số đo | `content/docs/os/synchronization.mdx`, `content/docs/os/cpu-scheduling.mdx` |
| bóc từng byte của một giao thức, tự dựng gói tin | `content/docs/networking/dns.mdx`, `content/docs/networking/network-layers.mdx` |
| mô hình hoá bằng bảng tính tay | `content/docs/os/virtual-memory.mdx` |

## 3. Quy trình viết một bài

1. **Tạo file.** Bài mới: `npm run new <môn> <slug>` (slug trùng `id` của node roadmap nếu bài trả lời cho node đó). Lệnh tự thêm vào cuối `meta.json`; sửa tay thứ tự cho khớp thứ tự đọc. Bài viết lại: ghi đè, giữ `authors`.
2. **Frontmatter.** `status: draft` (kể cả khi viết lại bài đang `reviewed`; chỉ người review mới đổi lại). `description` là câu hỏi mà bài trả lời (mục 2). `references`: nguồn ghi tới chương, có `note` nói đọc phần nào; ưu tiên RFC, sách gốc, tài liệu chính thức. Nguồn cho phần Đi sâu hơn ghi rõ trong `note`.
3. **Chạy code trước, viết văn sau.** Mọi đoạn code trong bài được viết thành file trong thư mục tạm (không phải trong repo), chạy thật, rồi dán **nguyên code và nguyên output** vào bài. Viết xong thì chạy lại toàn bộ khối code theo thứ tự trong bài (khối sau có thể dùng hàm của khối trước, kể cả khối nằm trong `<Expand>`) và so từng ký tự với khối output đi ngay sau. Không bịa output. Nếu một đoạn không chạy được trên máy bạn (không có gcc, không có quyền root...), nói rõ trong bài là output minh hoạ, đừng trình bày như chạy thật.
4. **Thuật ngữ.** Bọc `<Term>` ở lần xuất hiện đầu. Viết xong cả một chặng mới thêm glossary một lượt (mục 5).
5. **Gắn vào roadmap.** Thêm `article: <môn>/<slug>` ngay sau `title` của node tương ứng trong `content/roadmaps/*.yaml`. Giữ nguyên `resources`. **Không đổi `id`.**
6. **Cập nhật `index.mdx` của môn**: bảng "bài nào trả lời câu hỏi gì", theo thứ tự đọc; cột câu hỏi lấy từ `description`. Và `meta.json`.
7. **Kiểm tra**: `npm run check`, rồi dừng dev server, rồi `npm run build`. Mở từng trang ở `/docs/<môn>/<slug>` và nhìn: không có dòng `| ... |` hiện thành chữ thô, không có thẻ `<Term>` hay `<Expand>` hiện thành chữ.

## 4. Bẫy MDX và bẫy viết bài

- `<` và `{` trong **văn xuôi** làm hỏng MDX. `Mutex<T>`, `/proc/<pid>/maps`, `a < b`, `{ ... }` phải nằm trong backtick hoặc code block.
- **Không đặt ký tự `|` trong inline code nằm trong ô bảng** (ví dụ `grep -E 'a|b'`): nó cắt ô. Viết lại lệnh hoặc đưa ra ngoài bảng.
- Trong `<Expand title="...">`, để một dòng trống sau thẻ mở và trước thẻ đóng.
- `<Term>x</Term>` tra glossary không phân biệt hoa thường và tra cả `aliases`. Thuật ngữ chưa có mà không kèm `def` thì `npm run check` báo lỗi.
- Heading chữ thường, không thêm `//`, `[+]`, `$`, `>`. Block ví dụ có thể dùng `$` ở đầu dòng **bên trong code block** nhưng nên tránh khi output bị dán lại.
- Trong working tree trên Windows, `content/glossary.json` và `src/app/global.css` đang là CRLF còn `.mdx` là LF (`.gitattributes` chuẩn hoá về LF khi commit). Khi sửa bằng script, mở file bằng `newline=''` để giữ nguyên; Python ghi file ở chế độ text trên Windows sẽ đổi LF thành CRLF và làm diff phình. Sau khi ghi `.mdx` bằng Python, kiểm tra bằng `file <tên>` rằng không có "CRLF line terminators".
- `scripts/check-content.mjs` chặn frontmatter còn chữ `TODO`.
- Giá trị `note:` hay `title:` trong frontmatter mà chứa dấu hai chấm theo sau là dấu cách (`mô tả Timsort: run, minrun`) phải đặt trong ngoặc kép, nếu không YAML hỏng (`Nested mappings are not allowed in compact mappings`). `npm run check` nay bắt lỗi này, nhưng vẫn phải chạy cả `npm run build`.
- Nếu `npm run build` báo đường dẫn lạ tới thư mục khác (ví dụ `webpack loader path ... is outside configured roots`) sau khi dự án được chuyển thư mục, xoá thư mục `.next` và `.source` (đều sinh ra khi build, đã được ignore) rồi build lại.
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

Từ viết tắt thêm `"label": "TLB"`. Cách làm: viết xong cả chặng, quét mọi `<Term>` trong thư mục môn, so với khoá và alias trong glossary để ra danh sách thiếu, thêm một lượt, sắp lại ABC. Đừng lặp `def` cho thuật ngữ đã có. Các môn đang dùng `subject`: `os`, `networking`, `dsa`, `databases`, `architecture`.

## 6. Môi trường thí nghiệm đã dùng (để bài sau cùng cách)

Các bài hiện có chạy trên Windows với WSL2 Ubuntu (`wsl -d Ubuntu -u root -- bash -lc "..."`), Python 3 (đặt `PYTHONIOENCODING=utf8`). Các kỹ thuật lặp lại được:

- **Bắt gói và dựng gói tin**: raw socket `AF_PACKET` trên `lo` hay `eth0` (cần root) và giải mã bằng `struct`; không cần `tcpdump`.
- **Mô phỏng mất gói và trễ**: `tc qdisc add dev lo root netem ...` cho trễ; `tc qdisc add dev lo handle ffff: ingress` kèm filter `u32` để **bỏ gói ở chiều vào** (netem loss ở chiều ra làm gói bị mất trước khi bộ bắt gói thấy). Luôn dọn lại: `tc qdisc del dev lo root` và `ingress`, và đặt lại MTU của `lo` là 65536 nếu đã đổi.
- **Không có sẵn**: `gcc`, `dig`, `tcpdump`, `traceroute`, `iptables`. Ví dụ C trong chặng OS chưa được biên dịch (ghi rõ trong bài). Docker daemon không chạy. Thư viện `cryptography` của Python có trong WSL.
- **PostgreSQL 16 trong WSL** (cài bằng `apt-get install postgresql python3-psycopg2` với quyền root trong WSL): chạy truy vấn bằng `su postgres -c "psql -X -q -d <db> < file.sql"` (đọc từ stdin để thông báo lỗi không kèm đường dẫn file), kịch bản nhiều phiên bằng `psycopg2` chạy dưới user `postgres` (kết nối qua socket, peer auth). Có sẵn `pageinspect`, `pg_waldump`, `pg_test_fsync`, `pgbench` trong `/usr/lib/postgresql/16/bin`. Đặt `\pset null '∅'` để thấy NULL, và `EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, COSTS OFF)` để output ổn định. Khi viết script SQL dài, tạo file bằng công cụ Write thay vì heredoc trong shell (dấu nháy lồng nhau dễ hỏng).
- Máy chạy thí nghiệm có IP nhà mạng thật; đừng đưa nguyên các hop hay địa chỉ của nhà mạng vào bài.

## 7. Git

- Conventional Commits (CONTRIBUTING mục 8): `content(networking): ...`, `content(os): ...`.
- Hiện chặng OS và Networking nằm chung nhánh `content/os-deep-dive`, theo ý chủ repo.
- Không commit `HANDOFF.md` nếu nó còn trong working tree: đó là ghi chú bàn giao tạm của người cũ, phần bền của nó đã nằm ở file này và CONTRIBUTING.

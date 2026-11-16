# Kế hoạch mở rộng roadmap `cs-fundamentals`

Ghi lại kết quả khảo sát ngày 2026-11-17: bốn chặng hiện có (DSA, OS, Networking, Databases) có đủ cho "CS Fundamentals" chưa, và nên bổ sung gì. **Đây là ghi chú để làm dần, chưa có gì trong này được triển khai.** Tick vào mục khi làm xong.

Chủ repo chọn làm **tuần tự, từng chặng một**. Hoàn thành bài viết của bốn chặng hiện có trước (xem `HANDOFF.md`), rồi mới thêm chặng mới.

## 1. Kết luận

Chưa đủ. Bốn chặng hiện có là phần "hệ thống và dữ liệu" của CS. So với ba nguồn mà roadmap tự ghi trong `sources` thì thiếu khoảng năm mảng lớn.

## 2. Đối chiếu với nguồn

| Nguồn | Có trong roadmap | Thiếu |
|---|---|---|
| [Teach Yourself CS](https://teachyourselfcs.com/) (9 môn) | Algorithms & Data Structures, OS, Networking, Databases | Programming, Computer Architecture, Mathematics for CS, Languages & Compilers, Distributed Systems |
| [OSSU Computer Science](https://github.com/ossu/computer-science) (Core) | Algorithms, OS, Networking, Databases | Nand2Tetris (architecture), Math, Programming Languages, Security (4 môn), Software Engineering, The Missing Semester, Machine Learning, Computer Graphics, Ethics |
| [CS2023](https://csed.acm.org/knowledge-areas/) (17 knowledge area) | AL, OS, NC, DM | AR, FPL, SEC, SF, PDC, SE, MSF, SDF, SPD, AI, GIT, HCI, SEP |

Mức kiểm chứng: Teach Yourself CS và OSSU đã đọc trực tiếp ngày 2026-11-17. Với CS2023, chỉ xác nhận được con số 17 area và sáu area đầu (AL, AR, AI, DM, FPL, GIT); tên các area còn lại ghi theo trí nhớ, cần kiểm lại trên trang `csed.acm.org` trước khi trích dẫn trong `sources`.

## 3. Chặng mới nên thêm

Xếp theo thứ tự nên làm. Node chỉ là gợi ý, chốt lại khi viết.

### 3.1 Computer Architecture (đặt trước OS)

- [ ] biểu diễn số và dữ liệu (số nguyên, bù hai, float, endianness)
- [ ] ISA và assembly
- [ ] pipeline và branch prediction
- [ ] memory hierarchy và cache

Vì sao: bài `os/virtual-memory` và `dsa/complexity` đều dựa vào cache và TLB mà chưa có bài nền giải thích. Nguồn gợi ý: Nand2Tetris, Patterson & Hennessy, CS:APP (Bryant & O'Hallaron).

### 3.2 Distributed Systems (sau Networking và Databases)

- [ ] thời gian và thứ tự sự kiện (logical clock)
- [ ] replication
- [ ] consistency (CAP, linearizability)
- [ ] consensus (Paxos, Raft)
- [ ] partitioning (consistent hashing, nối với `dsa/hash-tables`)

Vì sao: là đích tự nhiên của Networking, Transactions và Hash Table. Nguồn gợi ý: MIT 6.824 (nay là 6.5840), Kleppmann "Designing Data-Intensive Applications", bài báo Raft.

### 3.3 Security (nối với TLS)

- [ ] threat model
- [ ] mật mã học ứng dụng (nối với `networking/tls`, đã có phần nền)
- [ ] authentication và authorization
- [ ] lỗ hổng web và memory safety

Vì sao: bài TLS đã dạy phần mật mã nên chặng này gần như có sẵn nửa nền. OSSU dành 4 môn cho security.

## 4. Chặng nên cân nhắc

- [ ] **Languages & Compilers**: lexer, parser, interpreter, type system, GC. Có trong Teach Yourself CS; OSSU có "Programming Languages".
- [ ] **Math for CS** (đặt `optional`): logic và chứng minh, tổ hợp, xác suất, đại số tuyến tính.

## 5. Không đưa vào cây này

AI/ML, Graphics, HCI, Ethics. Thuộc CS tổng quát nhưng lệch hướng của site (backend và hệ thống). Nếu cần thì làm cây roadmap riêng.

## 6. Node còn thiếu trong bốn chặng hiện có

- [ ] **OS**: `virtualization-containers` (namespaces, cgroups). Đây là một trong ba phần của OSTEP (virtualization, concurrency, persistence) và nối sang DevOps.
- [ ] **DSA**: `strings` (matching, trie). Phần heap và priority queue cần chỗ rõ ràng, hiện chỉ nằm lẫn trong `trees`.
- [ ] **Databases**: `storage-engines` (B-tree so với LSM-tree) và `query-processing` (planner, join algorithm), là nền cho `indexing` và `transactions`.
- [ ] **Networking** (ưu tiên thấp): `sockets` (API và mô hình I/O).

## 7. Ràng buộc kỹ thuật khi thực hiện

- Thêm node hoặc chặng mới **không** phá khoá tiến trình. Chỉ đổi hoặc xoá `id` cũ mới phá (xem [AGENTS.md](AGENTS.md)).
- Mỗi chặng mới cần một `subject` có trong `src/lib/subjects.ts` (đang có sẵn `oop`, `backend`, `devops`). Các môn mới (architecture, distributed, security, plt, math) phải khai báo thêm kèm màu accent, và hai dòng `data-subject` trong `src/app/global.css`.
- Mỗi chặng 5 tới 9 node. Chặng mới cũng phải có `outcome`.
- Thêm node vào `cs-fundamentals.yaml` rồi `npm run check` (so với `main`) và `npm run build`.
- Thêm chặng làm đổi thứ tự trục chính trên bản đồ; nhìn lại `/roadmaps/cs-fundamentals` ở 375px.

## 8. Thứ tự làm đề xuất

1. Hoàn thành bài viết cho bốn chặng hiện có (DSA, rồi Databases).
2. Thêm các node thiếu ở mục 6 (vì chỉ thêm node vào chặng đã có, rẻ nhất).
3. Chặng mới: Architecture, Distributed Systems, Security.
4. Chặng cân nhắc: Languages & Compilers, Math.

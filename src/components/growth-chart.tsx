'use client';
import { useId, useState } from 'react';

/**
 * <GrowthChart /> — kéo n để thấy số thao tác của các lớp độ phức tạp.
 * Mọi giá trị tính bằng log10 để 2^n với n lớn không tràn số.
 */

type Cls = { name: string; log10: (n: number) => number };

const LOG10_2 = Math.log10(2);

const CLASSES: Cls[] = [
  { name: 'O(1)', log10: () => 0 },
  { name: 'O(log n)', log10: (n) => Math.log10(Math.max(1, Math.log2(n))) },
  { name: 'O(n)', log10: (n) => Math.log10(n) },
  { name: 'O(n log n)', log10: (n) => Math.log10(n * Math.max(1, Math.log2(n))) },
  { name: 'O(n²)', log10: (n) => 2 * Math.log10(n) },
  { name: 'O(n³)', log10: (n) => 3 * Math.log10(n) },
  { name: 'O(2ⁿ)', log10: (n) => n * LOG10_2 },
];

// Các mốc n trên thanh kéo: dày ở vùng nhỏ (nơi 2^n bùng nổ), thưa ở vùng lớn.
const STEPS = [
  1, 2, 4, 8, 10, 16, 20, 30, 40, 50, 60, 64, 100, 128, 256, 500, 1000, 2000, 4000, 10_000,
  100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000,
];

const NS_PER_SEC = 9; // log10(1e9)
const YEAR_SEC = 365.25 * 86400;
const UNIVERSE_YEARS = 1.38e10;
// Thanh dài tối đa ứng với 1 năm (log10 số ns).
const BAR_MAX = Math.log10(YEAR_SEC) + NS_PER_SEC;

function fmtNum(log10: number) {
  if (log10 < 12) return Math.round(10 ** log10).toLocaleString('vi-VN');
  return `≈ 10^${Math.floor(log10)}`;
}

function fmtTime(log10ns: number) {
  const logSec = log10ns - NS_PER_SEC;
  if (logSec > Math.log10(UNIVERSE_YEARS * YEAR_SEC)) return 'lâu hơn tuổi vũ trụ';
  const sec = 10 ** logSec;
  const units: [string, number][] = [
    ['năm', YEAR_SEC],
    ['ngày', 86400],
    ['giờ', 3600],
    ['phút', 60],
  ];
  for (const [unit, size] of units) {
    if (sec >= size) {
      const v = sec / size;
      return `${v >= 1e6 ? `≈ 10^${Math.floor(Math.log10(v))}` : v.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} ${unit}`;
    }
  }
  if (sec >= 1) return `${sec.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} giây`;
  if (sec >= 1e-3) return `${(sec * 1e3).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} ms`;
  if (sec >= 1e-6) return `${(sec * 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} µs`;
  return `${Math.round(sec * 1e9)} ns`;
}

function fmtRatio(logRatio: number) {
  if (logRatio < 3) return `×${(10 ** logRatio).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}`;
  return `×10^${Math.floor(logRatio)}`;
}

export function GrowthChart({ initial = 1000 }: { initial?: number }) {
  const [idx, setIdx] = useState(() => Math.max(0, STEPS.indexOf(initial)));
  const id = useId();
  const n = STEPS[idx];
  const half = n / 2;

  return (
    <div className="not-prose my-6 rounded-xl border border-fd-border bg-fd-card p-4">
      <label htmlFor={id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="text-fd-muted-foreground">Kích thước đầu vào</span>
        <span className="font-mono text-base font-semibold">n = {n.toLocaleString('vi-VN')}</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={STEPS.length - 1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        aria-valuetext={`n = ${n.toLocaleString('vi-VN')}`}
        className="mt-2 w-full accent-[var(--subject-accent)]"
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="rounded-md border border-fd-border px-3 py-1 text-sm hover:bg-fd-muted"
        >
          Nhỏ hơn
        </button>
        <button
          type="button"
          onClick={() => setIdx((i) => Math.min(STEPS.length - 1, i + 1))}
          className="rounded-md border border-fd-border px-3 py-1 text-sm hover:bg-fd-muted"
        >
          Lớn hơn
        </button>
      </div>

      <ul className="mt-4 space-y-3" aria-live="polite">
        {CLASSES.map((c) => {
          const lg = c.log10(n);
          const over = lg - NS_PER_SEC >= 0; // từ 1 giây trở lên
          const width = Math.min(100, Math.max(1, (lg / BAR_MAX) * 100));
          const ratio = n >= 2 ? lg - c.log10(half) : null;
          return (
            <li key={c.name}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                <span className="font-mono font-semibold">{c.name}</span>
                <span className={over ? 'font-semibold text-[var(--subject-accent)]' : 'text-fd-muted-foreground'}>
                  {fmtTime(lg)}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-fd-muted">
                <div
                  className={`h-full rounded-full ${over ? 'bg-[var(--subject-accent)]' : 'bg-fd-muted-foreground/50'}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="mt-1 flex flex-wrap justify-between gap-x-3 font-mono text-xs text-fd-muted-foreground">
                <span>{fmtNum(lg)} thao tác</span>
                {ratio !== null && <span>so với n/2: {fmtRatio(ratio)}</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-fd-muted-foreground">
        Giả sử mỗi thao tác mất 1 ns. Thanh dùng thang log, đầy thanh là 1 năm; thanh tô màu và chữ đậm là từ 1 giây trở lên. Dòng
        &quot;so với n/2&quot; cho biết chi phí tăng bao nhiêu lần khi n gấp đôi.
      </p>
    </div>
  );
}

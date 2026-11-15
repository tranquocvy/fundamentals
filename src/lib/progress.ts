'use client';
import { useSyncExternalStore } from 'react';

/**
 * Tiến trình học, lưu trong localStorage của trình duyệt (không có server).
 * Khoá mỗi mục là progressKey(): "a:<bài>" cho node có bài, "n:<roadmap>/<id>" cho node chưa có bài.
 * Dùng chung cho mọi roadmap và sau này cho take-note, nên tách thành module riêng.
 */
export type Status = 'done' | 'skip';
/**
 * Giá trị có thể nằm trong localStorage. "learning" là trạng thái cũ đã bỏ:
 * key vẫn được giữ nguyên khi ghi, nhưng khi đọc thì coi như chưa học (xem statusOf).
 */
export type StoredStatus = Status | 'learning';
export type ProgressState = {
  v: 1;
  items: Record<string, StoredStatus>;
  updatedAt?: string;
  /** lần cuối người dùng xuất mã sao lưu */
  backedUpAt?: string;
};

const STORAGE_KEY = 'fundamentals:progress:v1';
const EVENT = 'fundamentals:progress';
const EMPTY: ProgressState = { v: 1, items: {} };

let cached: { raw: string | null; state: ProgressState } = { raw: null, state: EMPTY };

function read(): ProgressState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY; // localStorage bị chặn (chế độ riêng tư, iframe...)
  }
  if (raw === cached.raw) return cached.state;
  let state = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.v === 1 && parsed.items && typeof parsed.items === 'object') state = parsed;
  } catch {
    /* dữ liệu hỏng: coi như trống, không ghi đè cho tới khi người dùng thao tác */
  }
  cached = { raw, state };
  return state;
}

function write(next: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* hết dung lượng hoặc bị chặn: bỏ qua, UI vẫn chạy trong phiên này */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && cb(); // tab khác thay đổi
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', onStorage);
  };
}

/** Hook đọc tiến trình; server render trả về trạng thái trống rồi hydrate. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Trạng thái hiệu lực của một khoá: "learning" cũ gộp về chưa học. */
export function statusOf(state: ProgressState, key: string): Status | undefined {
  const s = state.items[key];
  return s === 'done' || s === 'skip' ? s : undefined;
}

export function setStatus(key: string, status: Status | null) {
  const cur = read();
  const items = { ...cur.items };
  if (status) items[key] = status;
  else delete items[key];
  write({ ...cur, items, updatedAt: new Date().toISOString() });
}

/** Gộp (merge) hoặc thay thế (replace) tiến trình hiện tại bằng dữ liệu nhập vào. */
export function importItems(items: Record<string, StoredStatus>, mode: 'merge' | 'replace') {
  const cur = read();
  const next = mode === 'replace' ? { ...items } : { ...cur.items, ...items };
  write({ ...cur, items: next, updatedAt: new Date().toISOString() });
}

export function markBackedUp() {
  write({ ...read(), backedUpAt: new Date().toISOString() });
}

/** Đếm theo trạng thái trên một danh sách khoá. "skip" không tính vào phần cần học. */
export function countProgress(state: ProgressState, keys: string[]) {
  let done = 0;
  let skip = 0;
  for (const k of new Set(keys)) {
    const s = state.items[k];
    if (s === 'done') done++;
    else if (s === 'skip') skip++;
  }
  const total = new Set(keys).size - skip;
  return { done, skip, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ---------- Mã sao lưu ----------
// Định dạng: "fp1." + base64url(deflate-raw(JSON)). "fp0." khi trình duyệt không có CompressionStream.
// JSON gọn: { v:1, d:[...khoá done], l:[...learning, trạng thái cũ], s:[...skip] } theo khoá cố định, không theo vị trí node,
// nên thêm/bớt node trong roadmap không làm hỏng mã cũ.

const toB64Url = (bytes: Uint8Array) => {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64Url = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeProgress(items: Record<string, StoredStatus>): Promise<string> {
  const pick = (st: StoredStatus) => Object.keys(items).filter((k) => items[k] === st).sort();
  const json = JSON.stringify({ v: 1, d: pick('done'), l: pick('learning'), s: pick('skip') });
  const bytes = new TextEncoder().encode(json);
  if (typeof CompressionStream === 'undefined') return `fp0.${toB64Url(bytes)}`;
  return `fp1.${toB64Url(await pipe(bytes, new CompressionStream('deflate-raw')))}`;
}

export async function decodeProgress(code: string): Promise<Record<string, StoredStatus>> {
  const m = code.trim().match(/^fp([01])\.([A-Za-z0-9_-]+)$/);
  if (!m) throw new Error('Mã không đúng định dạng (phải bắt đầu bằng "fp1.").');
  let bytes = fromB64Url(m[2]);
  if (m[1] === '1') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  const data = JSON.parse(new TextDecoder().decode(bytes));
  if (data?.v !== 1) throw new Error('Mã thuộc phiên bản không hỗ trợ.');
  const items: Record<string, StoredStatus> = {};
  const isKey = (k: unknown): k is string => typeof k === 'string' && /^(a|n):[\w\-/]+$/.test(k);
  for (const [field, st] of [['d', 'done'], ['l', 'learning'], ['s', 'skip']] as const) {
    for (const k of data[field] ?? []) if (isKey(k)) items[k] = st;
  }
  return items;
}

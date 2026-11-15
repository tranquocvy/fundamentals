'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, Upload, X } from 'lucide-react';
import { decodeProgress, encodeProgress, importItems, markBackedUp, useProgress, type StoredStatus } from '@/lib/progress';

const REMIND_AFTER_DAYS = 30;

/**
 * Sao lưu / khôi phục tiến trình bằng một mã ngắn (không cần tài khoản).
 * Link dạng /roadmaps/<slug>#p=<mã> mở ra sẽ hỏi có nhập tiến trình đó không.
 */
export function ProgressTools({ slug }: { slug: string }) {
  const progress = useProgress();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<'export' | 'import'>('export');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [fromLink, setFromLink] = useState<Record<string, StoredStatus> | null>(null);

  const count = Object.keys(progress.items).length;
  const days = progress.backedUpAt ? (Date.now() - Date.parse(progress.backedUpAt)) / 86_400_000 : Infinity;
  const remind = count >= 3 && days > REMIND_AFTER_DAYS;

  // Nhận tiến trình từ link #p=...
  useEffect(() => {
    const m = window.location.hash.match(/^#p=(.+)$/);
    if (!m) return;
    decodeProgress(decodeURIComponent(m[1]))
      .then((items) => Object.keys(items).length && setFromLink(items))
      .catch(() => setMsg({ ok: false, text: 'Link chứa mã tiến trình không hợp lệ.' }));
  }, []);

  const openDialog = async (m: 'export' | 'import') => {
    setMode(m);
    setMsg(null);
    setInput('');
    if (m === 'export') setCode(await encodeProgress(progress.items));
    dialogRef.current?.showModal();
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      markBackedUp();
      setMsg({ ok: true, text: `Đã copy ${label}. Cất ở đâu đó an toàn (note, email cho chính mình…).` });
    } catch {
      setMsg({ ok: false, text: 'Trình duyệt chặn copy, hãy chọn và copy thủ công.' });
    }
  };

  const doImport = async (how: 'merge' | 'replace') => {
    try {
      const items = await decodeProgress(input);
      importItems(items, how);
      setMsg({ ok: true, text: `Đã ${how === 'merge' ? 'gộp' : 'thay bằng'} ${Object.keys(items).length} mục tiến trình.` });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Không đọc được mã.' });
    }
  };

  const clearHash = () => history.replaceState(null, '', window.location.pathname + window.location.search);
  const link = typeof window !== 'undefined' && code ? `${window.location.origin}/roadmaps/${slug}#p=${code}` : '';

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rm-tool" onClick={() => openDialog('export')}>
          <Download className="h-4 w-4" /> Sao lưu
        </button>
        <button type="button" className="rm-tool" onClick={() => openDialog('import')}>
          <Upload className="h-4 w-4" /> Khôi phục
        </button>
      </div>

      {remind && (
        <p className="w-full text-xs text-fd-muted-foreground">
          Tiến trình chỉ lưu trong trình duyệt này.{' '}
          <button type="button" className="text-fd-primary hover:underline" onClick={() => openDialog('export')}>
            Sao lưu ngay
          </button>{' '}
          để không mất khi xoá dữ liệu trình duyệt.
        </p>
      )}

      {fromLink && (
        <div className="w-full rounded-xl border border-fd-primary/50 bg-fd-primary/5 p-3 text-sm">
          Link này chứa {Object.keys(fromLink).length} mục tiến trình. Nhập vào trình duyệt này?
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className="rm-tool" onClick={() => { importItems(fromLink, 'merge'); setFromLink(null); clearHash(); }}>
              Gộp với hiện tại
            </button>
            <button type="button" className="rm-tool" onClick={() => { importItems(fromLink, 'replace'); setFromLink(null); clearHash(); }}>
              Thay thế
            </button>
            <button type="button" className="rm-tool" onClick={() => { setFromLink(null); clearHash(); }}>
              Bỏ qua
            </button>
          </div>
        </div>
      )}

      <dialog ref={dialogRef} className="rm-dialog" onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold">{mode === 'export' ? 'Sao lưu tiến trình' : 'Khôi phục tiến trình'}</h3>
          <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-full p-1.5 text-fd-muted-foreground hover:bg-fd-muted" aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>

        {mode === 'export' ? (
          <>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              Mã này chứa tiến trình của mọi roadmap ({count} mục). Dán vào ô Khôi phục trên máy khác, hoặc mở link để nhập
              ngay.
            </p>
            <textarea readOnly value={code} className="rm-code" rows={3} onFocus={(e) => e.currentTarget.select()} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="rm-cta" onClick={() => copy(code, 'mã')}>Copy mã</button>
              <button type="button" className="rm-cta rm-cta-ghost" onClick={() => copy(link, 'link')}>Copy link</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-fd-muted-foreground">Dán mã bắt đầu bằng <code>fp1.</code> vào đây.</p>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="rm-code" rows={3} placeholder="fp1.…" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="rm-cta" disabled={!input.trim()} onClick={() => doImport('merge')}>Gộp với hiện tại</button>
              <button type="button" className="rm-cta rm-cta-ghost" disabled={!input.trim()} onClick={() => doImport('replace')}>Thay thế toàn bộ</button>
            </div>
          </>
        )}
        {msg && <p className={`mt-3 text-sm ${msg.ok ? 'text-fd-primary' : 'text-red-500'}`} role="status">{msg.text}</p>}
      </dialog>
    </>
  );
}

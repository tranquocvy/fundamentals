'use client';
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { lookupTerm } from '@/lib/glossary';

const GUTTER = 12;

/**
 * <Term>address space</Term>             → lấy giải nghĩa từ content/glossary.json
 * <Term id="process">processes</Term>    → tra theo id khi chữ hiển thị khác khoá
 * <Term def="giải nghĩa">từ mới</Term>   → giải nghĩa riêng cho bài này
 * Không tìm thấy giải nghĩa thì build lỗi, để CI chặn trước khi merge.
 */
export function Term({ def: ownDef, id: key, children }: { def?: string; id?: string; children: ReactNode }) {
  const label = typeof children === 'string' ? children : undefined;
  const def = ownDef ?? lookupTerm(key ?? label ?? '')?.def;
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const id = useId();
  const tipRef = useRef<HTMLSpanElement>(null);

  // Đẩy tooltip vào trong nếu nó tràn ra mép phải/trái màn hình; mũi nhọn vẫn chỉ đúng vào từ.
  useLayoutEffect(() => {
    if (!open || !tipRef.current) return;
    const rect = tipRef.current.getBoundingClientRect();
    const left = rect.left - shift;
    const maxLeft = window.innerWidth - rect.width - GUTTER;
    setShift(Math.max(GUTTER, Math.min(left, maxLeft)) - left);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!def) {
    throw new Error(
      `<Term>${label ?? key ?? '?'}</Term>: chưa có trong content/glossary.json. Thêm vào glossary hoặc truyền def="...".`,
    );
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="term-trigger"
      >
        {children}
      </button>
      {open && (
        <span
          ref={tipRef}
          id={id}
          role="tooltip"
          style={{ ['--shift' as string]: `${shift}px` }}
          className="term-tip absolute left-0 top-full z-20 mt-2.5 w-72 max-w-[calc(100vw-24px)] rounded-2xl border border-fd-border bg-fd-popover p-4 text-sm leading-relaxed text-fd-popover-foreground shadow-xl"
        >
          <span className="mb-1.5 flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--subject-accent)]" />
            <span className="font-semibold text-fd-foreground">{children}</span>
          </span>
          <span className="block text-fd-muted-foreground">{def}</span>
        </span>
      )}
    </span>
  );
}

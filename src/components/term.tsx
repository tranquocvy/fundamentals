'use client';
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const GUTTER = 12;

/** <Term def="giải nghĩa ngắn">address space</Term> */
export function Term({ def, children }: { def: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const id = useId();
  const tipRef = useRef<HTMLSpanElement>(null);

  // Đẩy tooltip vào trong nếu nó tràn ra mép phải/trái màn hình.
  useLayoutEffect(() => {
    if (!open || !tipRef.current) return;
    const rect = tipRef.current.getBoundingClientRect();
    const left = rect.left - shift;
    const maxLeft = window.innerWidth - rect.width - GUTTER;
    setShift(Math.max(GUTTER, Math.min(left, maxLeft)) - left);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="border-b border-dashed border-fd-primary text-fd-primary cursor-help"
      >
        {children}
      </button>
      {open && (
        <span
          ref={tipRef}
          id={id}
          role="tooltip"
          style={{ transform: `translateX(${shift}px)` }}
          className="absolute left-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-24px)] border border-fd-border bg-fd-popover p-3 text-sm leading-snug text-fd-popover-foreground shadow-lg"
        >
          <span className="block font-semibold text-fd-primary mb-1">{children}</span>
          {def}
        </span>
      )}
    </span>
  );
}

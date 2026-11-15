'use client';
import { useId, useState, type ReactNode } from 'react';

/** <Expand title="Ví dụ ...">nội dung mở rộng, mặc định thu gọn</Expand> */
export function Expand({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card transition-colors hover:border-[color-mix(in_oklab,var(--subject-accent)_40%,var(--color-fd-border))]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left font-medium"
      >
        <span aria-hidden className="expand-icon" />
        <span className="flex-1">{title}</span>
        <span className="text-xs text-fd-muted-foreground">{open ? 'Thu gọn' : 'Mở rộng'}</span>
      </button>
      <div id={id} className="expand-body" data-open={open} {...(!open ? { inert: true } : {})}>
        <div>
          <div className="px-4 pb-1 pl-[3.25rem] [&>:first-child]:mt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

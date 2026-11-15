'use client';
import { useId, useState, type ReactNode } from 'react';

export function Expand({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="my-5 border border-fd-border bg-fd-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left font-mono text-sm hover:text-fd-primary transition-colors"
      >
        <span className="text-fd-primary">{open ? '[-]' : '[+]'}</span>
        <span>{title}</span>
      </button>
      <div id={id} className="expand-body" data-open={open} {...(!open ? { inert: true } : {})}>
        <div><div className="px-4 pb-4">{children}</div></div>
      </div>
    </div>
  );
}

'use client';
import { useId, useState, type ReactNode } from 'react';

/** <Term def="giải nghĩa ngắn">address space</Term> */
export function Term({ def, children }: { def: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
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
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 border border-fd-border bg-fd-popover p-3 text-sm leading-snug text-fd-popover-foreground shadow-lg"
        >
          <span className="block font-mono text-xs text-fd-primary mb-1">// {children}</span>
          {def}
        </span>
      )}
    </span>
  );
}

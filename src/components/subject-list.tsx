'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Subject } from '@/lib/subjects';

export function SubjectList({ subjects }: { subjects: Subject[] }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <ul className="relative border-t border-fd-border" onMouseLeave={() => setHover(null)}>
      {/* ô vuông trượt */}
      <span
        aria-hidden
        className="subject-bar pointer-events-none absolute left-0 top-0 h-[72px] w-1.5 transition-all duration-200 ease-out"
        style={{
          transform: `translateY(${(hover ?? 0) * 72}px)`,
          opacity: hover === null ? 0 : 1,
          ['--bar-light' as string]: subjects[hover ?? 0].accent.light,
          ['--bar-dark' as string]: subjects[hover ?? 0].accent.dark,
        }}
      />
      {subjects.map((s, i) => {
        const inner = (
          <div
            className="flex h-[72px] items-center gap-5 px-6 border-b border-fd-border"
            style={{ ['--subject-accent' as string]: undefined }}
          >
            <span className="font-mono text-xs text-fd-muted-foreground w-8">{s.num} /</span>
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl">{s.title}</div>
              <div className="font-mono text-xs text-fd-muted-foreground truncate">{s.topics}</div>
            </div>
            <span className="font-mono text-xs" style={{ color: s.ready ? 'var(--color-fd-foreground)' : undefined }}>
              {s.ready ? '→' : 'soon'}
            </span>
          </div>
        );
        return (
          <li key={s.slug} onMouseEnter={() => setHover(i)} className={s.ready ? '' : 'opacity-50'}>
            {s.ready ? <Link href={`/docs/${s.slug}`}>{inner}</Link> : inner}
          </li>
        );
      })}
    </ul>
  );
}

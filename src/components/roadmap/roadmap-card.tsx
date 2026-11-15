'use client';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { MiniMap } from '@/lib/roadmaps';
import { countProgress, statusOf, useProgress } from '@/lib/progress';

export type CardData = {
  slug: string;
  title: string;
  description: string;
  sourceName: string;
  nodeCount: number;
  articleCount: number;
  keys: string[];
  /** bản thu nhỏ của cây, toạ độ tính lúc build */
  map: MiniMap;
};

const accentVars = (a: { light: string; dark: string }) =>
  ({ ['--acc-light' as string]: a.light, ['--acc-dark' as string]: a.dark }) as CSSProperties;

/** Thẻ một roadmap trên trang /roadmaps: vẽ luôn hình dạng cây, chấm tô theo tiến trình trong localStorage. */
export function RoadmapCard({ data }: { data: CardData }) {
  const state = useProgress();
  const progress = countProgress(state, data.keys);
  const { map } = data;

  return (
    <Link
      href={`/roadmaps/${data.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-fd-border bg-fd-card p-5 transition-colors hover:border-fd-primary/50 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold leading-tight">{data.title}</h2>
          <p className="mt-2 text-fd-muted-foreground">{data.description}</p>
        </div>
        <span aria-hidden className="mt-1 font-mono text-fd-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-fd-primary">
          →
        </span>
      </div>

      {/* cây thu nhỏ: trục chạy ngang, nhánh bắt buộc ở trên, tuỳ chọn ở dưới */}
      <svg
        className="rm-mini mt-5"
        viewBox={`0 0 ${map.width} ${map.height}`}
        style={{ maxWidth: map.width * 1.6 }}
        role="img"
        aria-label={`Sơ đồ ${map.sections.length} chặng: ${map.sections.map((s) => s.title).join(', ')}`}
      >
        <path className="rm-mini-links" d={map.links} />
        {map.sections.map((sec) => (
          <g key={sec.title} className="accent-scope" style={accentVars(sec.accent)}>
            <path d={sec.path} />
            {sec.dots.map((d) => (
              <circle
                key={`${d.x}-${d.y}`}
                cx={d.x}
                cy={d.y}
                r={d.trunk ? 5 : 3.75}
                data-status={statusOf(state, d.key)}
                data-optional={d.optional || undefined}
              />
            ))}
          </g>
        ))}
      </svg>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {map.sections.map((sec, i) => (
          <li key={sec.title} className="accent-scope inline-flex items-center gap-1.5" style={accentVars(sec.accent)}>
            <span className="font-mono text-xs" style={{ color: 'var(--acc)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {sec.title}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-fd-muted">
          <div className="h-full rounded-full bg-fd-primary transition-[width] duration-500" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-fd-muted-foreground">
          <span>{progress.done > 0 ? `${progress.percent}% · ${progress.done}/${progress.total} xong` : 'Chưa bắt đầu'}</span>
          <span>{data.nodeCount} chủ đề</span>
          <span>{data.articleCount} đã có bài</span>
          <span>theo {data.sourceName}</span>
        </p>
      </div>
    </Link>
  );
}

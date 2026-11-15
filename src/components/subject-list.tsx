import Link from 'next/link';
import type { Subject } from '@/lib/subjects';

/**
 * Danh sách môn ở trang chủ. Hàng tự co giãn theo nội dung (không cố định chiều cao),
 * vạch accent bên trái khi hover làm bằng CSS (.subject-row), mỗi hàng mang màu môn của nó.
 */
export function SubjectList({ subjects }: { subjects: Subject[] }) {
  return (
    <ul className="border-t border-fd-border">
      {subjects.map((s) => {
        const inner = (
          <div className="flex items-center gap-4 px-4 py-4 sm:gap-5 sm:px-6">
            <span className="w-8 shrink-0 font-mono text-xs text-fd-muted-foreground">{s.num} /</span>
            <div className="min-w-0 flex-1">
              <div className={`font-display text-lg leading-snug sm:text-xl ${s.ready ? '' : 'text-fd-muted-foreground'}`}>
                {s.title}
              </div>
              <div className="mt-0.5 font-mono text-xs text-fd-muted-foreground">{s.topics}</div>
            </div>
            <span className={`shrink-0 font-mono text-xs ${s.ready ? 'text-fd-foreground' : 'text-fd-muted-foreground'}`}>
              {s.ready ? '→' : 'soon'}
            </span>
          </div>
        );
        return (
          <li
            key={s.slug}
            className="subject-row border-b border-fd-border"
            style={{ ['--row-light' as string]: s.accent.light, ['--row-dark' as string]: s.accent.dark }}
          >
            {s.ready ? <Link href={`/docs/${s.slug}`} className="block">{inner}</Link> : inner}
          </li>
        );
      })}
    </ul>
  );
}

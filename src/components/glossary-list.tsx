import { glossary, termAnchor } from '@/lib/glossary';
import { subjects } from '@/lib/subjects';

const subjectTitle = new Map(subjects.map((s) => [s.slug, s.title]));

/** Danh sách mọi thuật ngữ trong content/glossary.json, dùng ở trang /docs/glossary. */
export function GlossaryList() {
  return (
    <dl className="not-prose divide-y divide-fd-border border-y border-fd-border">
      {glossary.map((e) => (
        <div key={e.term} id={termAnchor(e.term)} className="scroll-mt-24 py-4 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-6">
          <dt>
            <span className="font-semibold">{e.label ?? e.term}</span>
            {e.subject && (
              <span className="mt-0.5 block text-xs text-fd-muted-foreground">
                {subjectTitle.get(e.subject) ?? e.subject}
              </span>
            )}
          </dt>
          <dd className="mt-1 text-fd-muted-foreground sm:mt-0">
            {e.def}
            {e.aliases?.length ? (
              <span className="mt-1 block text-xs">còn gọi: {e.aliases.join(', ')}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

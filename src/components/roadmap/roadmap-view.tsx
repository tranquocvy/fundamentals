'use client';
import Link from 'next/link';
import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, PenLine, X } from 'lucide-react';
import type { Tree, ViewNode, ViewSection } from '@/lib/roadmaps';
import { countProgress, setStatus, statusOf, useProgress, type ProgressState, type Status } from '@/lib/progress';
import { ProgressTools } from './progress-tools';

type FlatNode = ViewNode & { section: ViewSection };

const STATUS_LABEL: Record<Status, string> = { done: 'Đã xong', skip: 'Bỏ qua' };

/** "~45 phút", "~1 giờ 20" */
function formatMinutes(m: number) {
  if (m < 60) return `~${m} phút`;
  const rest = m % 60;
  return `~${Math.floor(m / 60)} giờ${rest ? ` ${rest}` : ''}`;
}

/** Phút còn lại của các node chưa xong/bỏ qua mà có ước lượng thời gian. */
function minutesLeft(nodes: ViewNode[], progress: ProgressState) {
  return nodes.reduce((sum, n) => (statusOf(progress, n.key) ? sum : sum + (n.minutes ?? 0)), 0);
}

/**
 * Trang một roadmap. Mỗi chặng là một trục dọc: node trên trục là đường chính,
 * nhánh bắt buộc rẽ phải, nhánh tuỳ chọn rẽ trái (nét đứt). Bố cục lấy từ layoutSection().
 */
export function RoadmapView({ slug, sections }: { slug: string; sections: ViewSection[] }) {
  const progress = useProgress();
  const [hovered, setHovered] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const flat = useMemo(() => sections.flatMap((section) => section.nodes.map((n) => ({ ...n, section }))), [sections]);
  const byId = useMemo(() => new Map(flat.map((n) => [n.id, n])), [flat]);
  const dependents = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const n of flat) for (const r of n.requires) m.set(r.id, [...(m.get(r.id) ?? []), n.id]);
    return m;
  }, [flat]);

  const overall = countProgress(progress, flat.map((n) => n.key));
  const left = minutesLeft(flat, progress);
  const next = suggestNext(flat, byId, progress);
  const finished = overall.total > 0 && overall.done === overall.total;

  // Khi rê chuột: làm nổi node đó cùng các node cần học trước và học sau nó.
  const related = useMemo(() => {
    if (!hovered) return null;
    const node = byId.get(hovered);
    return new Set([hovered, ...(node?.requires.map((r) => r.id) ?? []), ...(dependents.get(hovered) ?? [])]);
  }, [hovered, byId, dependents]);

  const open = (id: string) => {
    setOpenId(id);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };
  const current = openId ? byId.get(openId) : undefined;

  const pill = (id: string) => {
    const n = byId.get(id);
    if (!n) return null;
    const st = statusOf(progress, n.key);
    const isNext = next?.id === id;
    const label = [n.title, st && STATUS_LABEL[st], n.optional && 'tuỳ chọn', isNext && 'gợi ý học tiếp'].filter(Boolean).join(', ');
    return (
      <button
        type="button"
        className="rm-pill"
        data-status={st}
        data-kind={n.href ? 'article' : 'external'}
        data-optional={n.optional || undefined}
        data-next={isNext || undefined}
        data-related={related?.has(id) || undefined}
        onClick={() => open(id)}
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(id)}
        onBlur={() => setHovered(null)}
        aria-label={label}
      >
        {isNext && <span className="rm-next-tag" aria-hidden>học tiếp</span>}
        <span className="rm-status" data-status={st} aria-hidden />
        <span className="min-w-0">
          <span className="rm-title">{n.title}</span>
          {n.extra.length > 0 && <span className="rm-chip">cần {n.extra.map((r) => r.title).join(', ')}</span>}
        </span>
        <span className="rm-kind" aria-hidden>
          {n.href ? (
            <>
              <BookOpen className="h-3.5 w-3.5" />
              {n.minutes ? `${n.minutes}′` : null}
            </>
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" />
          )}
        </span>
      </button>
    );
  };

  const branches = (trees: Tree[], nested = false) => (
    <ul className={nested ? 'rm-kids' : 'rm-branches'}>
      {trees.map((t) => (
        <li key={t.id} data-optional={byId.get(t.id)?.optional || undefined}>
          {pill(t.id)}
          {t.children.length > 0 && branches(t.children, true)}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* thanh tổng quan */}
      <div className="mt-8 rounded-2xl border border-fd-border bg-fd-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-fd-muted-foreground">Tiến trình của bạn</p>
            <p className="font-display text-3xl font-semibold">
              {overall.percent}%
              <span className="ml-2 text-base font-normal text-fd-muted-foreground">
                {overall.done}/{overall.total} xong{left > 0 ? ` · còn ${formatMinutes(left)} đọc bài` : ''}
              </span>
            </p>
          </div>
          <ProgressTools slug={slug} />
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-fd-muted">
          <div className="h-full rounded-full bg-fd-primary transition-[width] duration-500" style={{ width: `${overall.percent}%` }} />
        </div>

        {next ? (
          <button type="button" onClick={() => open(next.id)} className="rm-next accent-scope" style={accentVars(next.section)}>
            <span className="rm-next-label">Học tiếp</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-lg font-semibold">{next.title}</span>
              <span className="block truncate text-sm text-fd-muted-foreground">
                {next.section.title}
                {next.minutes ? ` · ${formatMinutes(next.minutes)}` : ''}
                {next.href ? '' : ' · học từ nguồn ngoài'}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0" style={{ color: 'var(--acc)' }} aria-hidden />
          </button>
        ) : (
          finished && <p className="mt-4 text-sm text-fd-muted-foreground">Bạn đã đi hết lộ trình này.</p>
        )}
        <Legend />
      </div>

      {/* cây */}
      <div className="rm mt-14" data-focus={related ? 'true' : undefined}>
        {sections.map((sec, si) => {
          const secProgress = countProgress(progress, sec.nodes.map((n) => n.key));
          const secLeft = minutesLeft(sec.nodes, progress);
          const secDone = secProgress.total > 0 && secProgress.done === secProgress.total;
          return (
            <section
              key={sec.id}
              className="rm-section accent-scope"
              style={accentVars(sec)}
              aria-labelledby={`sec-${sec.id}`}
              data-done={secDone || undefined}
            >
              <header className="rm-station">
                <span className="rm-station-dot" aria-hidden>
                  {String(si + 1).padStart(2, '0')}
                </span>
                <div className="rm-station-text">
                  <h2 id={`sec-${sec.id}`} className="font-display text-2xl font-semibold leading-tight">
                    {sec.title}
                  </h2>
                  {sec.description && <p className="rm-station-desc">{sec.description}</p>}
                  {sec.outcome && (
                    <p className="rm-outcome">
                      <span>Xong chặng này</span> {sec.outcome}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-xs text-fd-muted-foreground">
                    {secProgress.done}/{secProgress.total} xong{secLeft > 0 ? ` · còn ${formatMinutes(secLeft)}` : ''}
                  </p>
                </div>
              </header>

              <ol className="rm-rows">
                {sec.rows.map((row, ri) => {
                  const trunkNode = row.id ? byId.get(row.id) : undefined;
                  return (
                    <li
                      key={row.id ?? `spur-${ri}`}
                      className="rm-row"
                      data-passed={(trunkNode && statusOf(progress, trunkNode.key)) || undefined}
                      data-spur={row.id ? undefined : true}
                    >
                      <div className="rm-trunk">{row.id ? pill(row.id) : <span className="rm-junction" aria-hidden />}</div>
                      {row.right.length > 0 && <div className="rm-side" data-side="right">{branches(row.right)}</div>}
                      {row.left.length > 0 && <div className="rm-side" data-side="left">{branches(row.left)}</div>}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
        <div className="rm-end" aria-hidden>
          <span>hết lộ trình</span>
        </div>
      </div>

      {/* bảng chi tiết node */}
      <dialog
        ref={dialogRef}
        className="rm-dialog"
        onClose={() => setOpenId(null)}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      >
        {current && (
          <NodeDetail
            node={current}
            status={statusOf(progress, current.key)}
            unlocks={(dependents.get(current.id) ?? []).map((id) => byId.get(id)!).filter(Boolean)}
            statusOfId={(id) => {
              const n = byId.get(id);
              return n ? statusOf(progress, n.key) : undefined;
            }}
            onOpen={open}
            onClose={() => dialogRef.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}

function NodeDetail({
  node,
  status,
  unlocks,
  statusOfId,
  onOpen,
  onClose,
}: {
  node: FlatNode;
  status?: Status;
  unlocks: FlatNode[];
  statusOfId: (id: string) => Status | undefined;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const [first, ...others] = node.resources;
  const related = (title: string, items: { id: string; title: string }[]) =>
    items.length > 0 && (
      <div className="mt-5">
        <p className="text-sm font-medium">{title}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {items.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onOpen(r.id)}
                className="inline-flex items-center gap-2 rounded-full border border-fd-border px-3 py-1 text-sm hover:border-[var(--acc)]"
              >
                <span className="rm-status rm-status-sm" data-status={statusOfId(r.id)} aria-hidden />
                {r.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="accent-scope" style={accentVars(node.section)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--acc)' }}>
            {node.section.title}
            {node.minutes ? <span className="text-fd-muted-foreground"> · {formatMinutes(node.minutes)}</span> : null}
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{node.title}</h3>
        </div>
        <button type="button" onClick={onClose} className="rounded-full p-1.5 text-fd-muted-foreground hover:bg-fd-muted" aria-label="Đóng">
          <X className="h-5 w-5" />
        </button>
      </div>

      {node.description && <p className="mt-3 text-fd-muted-foreground">{node.description}</p>}
      {node.optional && <p className="mt-2 text-sm text-fd-muted-foreground">Chủ đề tuỳ chọn: hữu ích nhưng không bắt buộc để đi tiếp.</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        {node.href ? (
          <Link href={node.href} className="rm-cta">
            <BookOpen className="h-4 w-4" /> Đọc bài
          </Link>
        ) : (
          first && (
            <a href={first.url} target="_blank" rel="noreferrer" className="rm-cta">
              <ArrowUpRight className="h-4 w-4" /> {first.title}
            </a>
          )
        )}
      </div>

      {/* trạng thái */}
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Trạng thái">
        {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={status === s}
            onClick={() => setStatus(node.key, status === s ? null : s)}
            className="rm-state-btn"
          >
            <span className="rm-status" data-status={s} aria-hidden />
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {related('Nên học trước', node.requires)}
      {related('Học xong mở ra', unlocks)}

      {(node.href ? node.resources : others).length > 0 && (
        <div className="mt-6 border-t border-fd-border pt-4">
          <p className="text-sm font-medium">{node.href ? 'Tài liệu ngoài' : 'Tài liệu khác'}</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {(node.href ? node.resources : others).map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-fd-muted-foreground underline-offset-4 hover:text-fd-foreground hover:underline">
                  {r.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!node.href && (
        <p className="mt-6 border-t border-fd-border pt-4 text-sm text-fd-muted-foreground">
          Chủ đề này chưa có bài trên site.{' '}
          <a href={node.writeHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium hover:underline" style={{ color: 'var(--acc)' }}>
            <PenLine className="h-3.5 w-3.5" /> Viết bài này ↗
          </a>
          <span className="mt-1 block text-xs">
            Link mở GitHub với frontmatter điền sẵn; nhớ thêm bài vào meta.json của môn và gắn
            <code className="mx-1">article</code>vào node trong file roadmap.
          </span>
        </p>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-fd-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5" /> có bài trên site
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ArrowUpRight className="h-3.5 w-3.5" /> học từ nguồn ngoài
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="rm-legend-line" aria-hidden /> trục chính, nhánh rẽ phải
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="rm-legend-line" data-optional aria-hidden /> tuỳ chọn, rẽ trái
      </span>
      {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          <span className="rm-status rm-status-sm" data-status={s} aria-hidden />
          {STATUS_LABEL[s]}
        </span>
      ))}
    </div>
  );
}

/**
 * Gợi ý một node duy nhất: node đầu tiên theo thứ tự đọc mà chưa xong/bỏ qua
 * và mọi node cần học trước đều đã xong hoặc bỏ qua. Ưu tiên node bắt buộc.
 */
function suggestNext(flat: FlatNode[], byId: Map<string, FlatNode>, progress: ProgressState) {
  const settled = (n?: FlatNode) => !!n && !!statusOf(progress, n.key);
  const ready = flat.filter((n) => !settled(n) && n.requires.every((r) => settled(byId.get(r.id))));
  return ready.find((n) => !n.optional) ?? ready[0];
}

function accentVars(sec: { accent: { light: string; dark: string } }) {
  return { ['--acc-light' as string]: sec.accent.light, ['--acc-dark' as string]: sec.accent.dark } as CSSProperties;
}

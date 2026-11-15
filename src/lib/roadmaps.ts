import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DOCS_DIR,
  ROADMAP_DIR,
  articleExists,
  layoutSection,
  listRoadmapSlugs,
  progressKey,
  readRoadmapFile,
  validateRoadmap,
  type Roadmap,
  type RoadmapNode,
  type RoadmapSection,
} from '../../scripts/roadmap-core.mjs';
import { source } from './source';
import { subjects } from './subjects';

export type { Roadmap, RoadmapNode, RoadmapSection };

/** Node đã chuẩn hoá để gửi xuống client (thêm khoá tiến trình, link bài). */
export type ViewNode = {
  id: string;
  title: string;
  description?: string;
  optional: boolean;
  /** khoá trong localStorage, xem progressKey() */
  key: string;
  /** URL bài trên site, nếu đã có bài */
  href?: string;
  /** link GitHub để viết bài cho node chưa có bài */
  writeHref?: string;
  requires: { id: string; title: string }[];
  /** `requires` không vẽ thành đường nối (sang chặng khác, hoặc node cha thứ hai): hiện bằng chip */
  extra: { id: string; title: string }[];
  /** phút ước lượng: tính từ độ dài bài, hoặc `effort` trong YAML */
  minutes?: number;
  resources: { title: string; url: string }[];
};

/** Cây nhánh: chỉ chứa id, dữ liệu node tra trong ViewSection.nodes */
export type Tree = { id: string; children: Tree[] };
/** Một hàng trên trục: node trục (null = hàng chỉ có nhánh tuỳ chọn), nhánh tuỳ chọn bên trái, bắt buộc bên phải */
export type ViewRow = { id: string | null; left: Tree[]; right: Tree[] };

export type ViewSection = {
  id: string;
  title: string;
  description?: string;
  /** học xong chặng này thì làm được gì */
  outcome?: string;
  accent: { light: string; dark: string };
  /** theo thứ tự đọc gợi ý (trục trước, rồi nhánh) */
  nodes: ViewNode[];
  rows: ViewRow[];
};

/** Bản thu nhỏ của cây cho trang /roadmaps: toạ độ SVG sinh từ cùng layoutSection(). */
export type MiniMap = {
  width: number;
  height: number;
  sections: {
    title: string;
    accent: { light: string; dark: string };
    /** đường trục và các nhánh của chặng */
    path: string;
    dots: { x: number; y: number; key: string; trunk: boolean; optional: boolean }[];
  }[];
  /** đoạn nối giữa các chặng */
  links: string;
};

export type RoadmapSummary = {
  slug: string;
  title: string;
  description: string;
  sources: Roadmap['sources'];
  sectionCount: number;
  nodeCount: number;
  articleCount: number;
  /** khoá tiến trình của mọi node, để tính % trên trang tổng */
  keys: string[];
};

const DEFAULT_ACCENT = { light: '#a65400', dark: '#ffb454' };
const accentOf = (subject?: string) => subjects.find((s) => s.slug === subject)?.accent ?? DEFAULT_ACCENT;

function load(slug: string): Roadmap {
  const rm = readRoadmapFile(join(ROADMAP_DIR, `${slug}.yaml`), slug);
  const errors = validateRoadmap(rm, { subjects: subjects.map((s) => s.slug) });
  if (errors.length) {
    throw new Error(`content/roadmaps/${slug}.yaml không hợp lệ:\n  - ${errors.join('\n  - ')}`);
  }
  return rm;
}

let cache: Roadmap[] | undefined;
/** Mọi roadmap, sắp theo `order` rồi theo tên. */
export function getRoadmaps(): Roadmap[] {
  cache ??= listRoadmapSlugs()
    .map(load)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title));
  return cache;
}

export function getRoadmap(slug: string): Roadmap | undefined {
  return getRoadmaps().find((r) => r.slug === slug);
}

const visible = (n: RoadmapNode) => !n.deprecated;

export function summarize(rm: Roadmap): RoadmapSummary {
  const nodes = rm.sections.flatMap((s) => s.nodes.filter(visible));
  return {
    slug: rm.slug,
    title: rm.title,
    description: rm.description,
    sources: rm.sources,
    sectionCount: rm.sections.length,
    nodeCount: nodes.length,
    articleCount: nodes.filter((n) => n.article && articleExists(n.article)).length,
    keys: nodes.map((n) => progressKey(rm.slug, n)),
  };
}

const NEW_FILE_URL = 'https://github.com/tranquocvy/fundamentals/new/main/content/docs';

/** Link mở trình tạo file của GitHub, điền sẵn tên file và frontmatter cho node chưa có bài. */
function writeUrl(subject: string, n: RoadmapNode) {
  const body = [
    '---',
    `title: ${n.title}`,
    `description: ${n.description ?? 'TODO một câu tóm tắt.'}`,
    'status: draft',
    `tags: [${subject}]`,
    'references:',
    '  - title: "TODO nguồn tham khảo"',
    '    kind: book',
    '---',
    '',
    '## Ý chính',
    '',
    '',
  ].join('\n');
  // encodeURIComponent (dấu cách → %20) thay vì URLSearchParams (dấu cách → +) để GitHub giải mã chắc chắn đúng
  return `${NEW_FILE_URL}?filename=${encodeURIComponent(`${subject}/${n.id}.mdx`)}&value=${encodeURIComponent(body)}`;
}

const WORDS_PER_MINUTE = 160; // đọc tài liệu kỹ thuật, chậm hơn đọc lướt

/** Phút đọc ước lượng của một bài, tính từ số từ trong file MDX (bỏ frontmatter). */
function readingMinutes(article: string): number | undefined {
  const file = [join(DOCS_DIR, `${article}.mdx`), join(DOCS_DIR, article, 'index.mdx')].find((f) => existsSync(f));
  if (!file) return undefined;
  const body = readFileSync(file, 'utf8').replace(/^---[\s\S]*?\n---/, '');
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Chuẩn hoá roadmap thành dữ liệu cho trang cây. */
export function toView(rm: Roadmap): ViewSection[] {
  const titleOf = new Map(rm.sections.flatMap((s) => s.nodes).map((n) => [n.id, n.title]));
  const named = (id: string) => ({ id, title: titleOf.get(id) ?? id });
  return rm.sections.map((sec) => {
    const layout = layoutSection(sec);
    const byId = new Map(sec.nodes.map((n) => [n.id, n]));
    const subject = sec.subject ?? sec.id;
    return {
      id: sec.id,
      title: sec.title,
      description: sec.description,
      outcome: sec.outcome,
      accent: accentOf(sec.subject),
      rows: layout.rows,
      nodes: layout.order.map((id) => {
        const n = byId.get(id)!;
        const page = n.article ? source.getPage(n.article.split('/')) : undefined;
        return {
          id: n.id,
          title: n.title,
          description: n.description,
          optional: n.optional ?? false,
          key: progressKey(rm.slug, n),
          href: page?.url,
          writeHref: page ? undefined : writeUrl(subject, n),
          requires: (n.requires ?? []).map(named),
          extra: (layout.extra[n.id] ?? []).map(named),
          minutes: (n.article ? readingMinutes(n.article) : undefined) ?? n.effort,
          resources: n.resources ?? [],
        };
      }),
    };
  });
}

/** Toạ độ bản thu nhỏ: trục chạy ngang, nhánh bắt buộc mọc lên trên, nhánh tuỳ chọn mọc xuống dưới. */
export function toMiniMap(rm: Roadmap): MiniMap {
  const STEP = 30; // khoảng cách hai node trên trục
  const LIFT = 15; // khoảng cách dọc giữa các node của nhánh
  const INDENT = 11;
  const GAP = 30; // giữa hai chặng
  const PAD = 10;
  const layouts = rm.sections.map((sec) => ({ sec, layout: layoutSection(sec) }));
  const size = (ts: Tree[]): number => ts.reduce((sum, t) => sum + 1 + size(t.children), 0);
  const up = Math.max(0, ...layouts.flatMap((l) => l.layout.rows.map((r) => size(r.right))));
  const down = Math.max(0, ...layouts.flatMap((l) => l.layout.rows.map((r) => size(r.left))));
  const y0 = PAD + up * LIFT;

  let x = PAD;
  const links: string[] = [];
  const sections = layouts.map(({ sec, layout }, si) => {
    const byId = new Map(sec.nodes.map((n) => [n.id, n]));
    const dots: MiniMap['sections'][number]['dots'] = [];
    const paths: string[] = [];
    const dot = (id: string, dx: number, dy: number, trunk: boolean) => {
      const n = byId.get(id)!;
      dots.push({ x: dx, y: dy, key: progressKey(rm.slug, n), trunk, optional: n.optional ?? false });
    };
    const startX = x;
    if (si > 0) links.push(`M${startX - GAP} ${y0}H${startX}`);
    layout.rows.forEach((row, ri) => {
      if (ri > 0) x += STEP;
      if (row.id) dot(row.id, x, y0, true);
      for (const [trees, dir] of [[row.right, -1], [row.left, 1]] as const) {
        let k = 0;
        let deepest = 0;
        const place = (t: Tree, px: number, py: number, depth: number) => {
          k += 1;
          const cx = px + INDENT;
          const cy = y0 + dir * k * LIFT;
          paths.push(`M${px} ${py}V${cy}H${cx}`);
          dot(t.id, cx, cy, false);
          deepest = Math.max(deepest, depth);
          for (const c of t.children) place(c, cx, cy, depth + 1);
        };
        for (const t of trees) place(t, x, y0, 1);
        // nhánh sâu thì nới chỗ để không đè lên cột kế bên
        if (deepest > 1) x += (deepest - 1) * INDENT;
      }
    });
    paths.unshift(`M${startX} ${y0}H${x}`);
    x += GAP;
    return { title: sec.title, accent: accentOf(sec.subject), path: paths.join(''), dots };
  });
  return { width: x - GAP + PAD + INDENT, height: y0 + down * LIFT + PAD, sections, links: links.join('') };
}

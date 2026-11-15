// Lõi roadmap dùng chung cho build (src/lib/roadmaps.ts) và `npm run check` (scripts/check-content.mjs).
// Thuần JavaScript để chạy được cả bằng Node lẫn trong Next.js.
//
// Mỗi roadmap là một file content/roadmaps/<slug>.yaml. Xem CONTRIBUTING.md mục "Roadmap".
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export const ROADMAP_DIR = join('content', 'roadmaps');
export const DOCS_DIR = join('content', 'docs');

/**
 * @typedef {{ title: string, url: string }} Resource
 * @typedef {{ name: string, url?: string, note?: string }} Source
 * @typedef {{
 *   id: string, title: string, description?: string, article?: string,
 *   requires?: string[], optional?: boolean, effort?: number, resources?: Resource[], deprecated?: boolean
 * }} RoadmapNode
 * @typedef {{ id: string, title: string, description?: string, outcome?: string, subject?: string, nodes: RoadmapNode[] }} RoadmapSection
 * @typedef {{
 *   slug: string, title: string, description: string, order?: number,
 *   sources: Source[], sections: RoadmapSection[]
 * }} Roadmap
 */

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const KEYS = {
  roadmap: ['title', 'description', 'order', 'sources', 'sections'],
  source: ['name', 'url', 'note'],
  section: ['id', 'title', 'description', 'outcome', 'subject', 'nodes'],
  node: ['id', 'title', 'description', 'article', 'requires', 'optional', 'effort', 'resources', 'deprecated'],
  resource: ['title', 'url'],
};

/** Đọc và parse một file roadmap (chưa kiểm tra). */
export function readRoadmapFile(file, slug) {
  const data = parse(readFileSync(file, 'utf8')) ?? {};
  return /** @type {Roadmap} */ ({ ...data, slug });
}

/** Danh sách slug roadmap theo tên file. */
export function listRoadmapSlugs(dir = ROADMAP_DIR) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => f.slice(0, -'.yaml'.length))
    .sort();
}

/** Bài `os/process-thread` có tồn tại trong content/docs không. */
export function articleExists(article, docsDir = DOCS_DIR) {
  return existsSync(join(docsDir, `${article}.mdx`)) || existsSync(join(docsDir, article, 'index.mdx'));
}

/** Mọi node của roadmap (kể cả node deprecated). */
export function allNodes(rm) {
  return (rm.sections ?? []).flatMap((s) => s.nodes ?? []);
}

/**
 * Khoá lưu tiến trình. Node gắn bài thì lưu theo bài, nên học ở cây này
 * thì cây khác chứa cùng bài cũng hiện đã xong.
 */
export function progressKey(slug, node) {
  return node.article ? `a:${node.article}` : `n:${slug}/${node.id}`;
}

/**
 * Kiểm tra một roadmap. Trả về danh sách lỗi (rỗng = hợp lệ).
 * @param {Roadmap} rm
 * @param {{ articleExists?: (a: string) => boolean, subjects?: string[] }} [opts]
 */
export function validateRoadmap(rm, opts = {}) {
  const errs = [];
  const at = (where, msg) => errs.push(`${where}: ${msg}`);
  const exists = opts.articleExists ?? articleExists;

  const unknown = (obj, allowed, where) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return at(where, 'phải là một object.');
    for (const k of Object.keys(obj)) if (!allowed.includes(k)) at(where, `khoá "${k}" không hợp lệ (dùng được: ${allowed.join(', ')}).`);
  };
  const str = (v, where, name, required = true) => {
    if (v === undefined) return required && at(where, `thiếu "${name}".`);
    if (typeof v !== 'string' || !v.trim()) at(where, `"${name}" phải là chuỗi không rỗng.`);
  };
  const url = (v, where) => {
    if (v !== undefined && !/^https:\/\//.test(String(v))) at(where, `url "${v}" phải bắt đầu bằng https://.`);
  };

  if (!ID.test(rm.slug)) at(rm.slug, 'tên file phải viết thường, nối bằng gạch ngang (vd. cs-fundamentals.yaml).');
  unknown(rm, ['slug', ...KEYS.roadmap], 'roadmap');
  str(rm.title, 'roadmap', 'title');
  str(rm.description, 'roadmap', 'description');
  if (rm.order !== undefined && typeof rm.order !== 'number') at('roadmap', '"order" phải là số.');

  if (!Array.isArray(rm.sources) || rm.sources.length === 0) at('roadmap', 'cần ít nhất 1 mục trong "sources" (nguồn khung kiến thức).');
  else rm.sources.forEach((s, i) => {
    const w = `sources[${i}]`;
    unknown(s, KEYS.source, w);
    str(s?.name, w, 'name');
    url(s?.url, w);
  });

  if (!Array.isArray(rm.sections) || rm.sections.length === 0) {
    at('roadmap', 'cần ít nhất 1 section.');
    return errs;
  }

  const ids = new Map(); // id → nơi khai báo
  const nodes = [];
  rm.sections.forEach((sec, si) => {
    const w = `section "${sec?.id ?? si}"`;
    unknown(sec, KEYS.section, w);
    str(sec?.title, w, 'title');
    str(sec?.outcome, w, 'outcome', false);
    if (!ID.test(sec?.id ?? '')) at(w, 'cần "id" viết thường, gạch ngang.');
    else if (ids.has(sec.id)) at(w, `id "${sec.id}" bị trùng với ${ids.get(sec.id)}.`);
    else ids.set(sec.id, w);
    if (sec?.subject && opts.subjects && !opts.subjects.includes(sec.subject)) {
      at(w, `subject "${sec.subject}" không có trong src/lib/subjects.ts.`);
    }
    if (!Array.isArray(sec?.nodes) || sec.nodes.length === 0) return at(w, 'cần ít nhất 1 node.');

    sec.nodes.forEach((n, ni) => {
      const wn = `node "${n?.id ?? `${sec.id}[${ni}]`}"`;
      unknown(n, KEYS.node, wn);
      str(n?.title, wn, 'title');
      str(n?.description, wn, 'description', false);
      if (!ID.test(n?.id ?? '')) return at(wn, 'cần "id" viết thường, gạch ngang.');
      if (ids.has(n.id)) at(wn, `id "${n.id}" bị trùng với ${ids.get(n.id)}.`);
      ids.set(n.id, wn);
      nodes.push(n);
      if (n.article !== undefined) {
        str(n.article, wn, 'article');
        if (typeof n.article === 'string' && !exists(n.article)) at(wn, `article "${n.article}" không có file content/docs/${n.article}.mdx.`);
      }
      if (n.requires !== undefined && !Array.isArray(n.requires)) at(wn, '"requires" phải là danh sách id.');
      for (const k of ['optional', 'deprecated']) if (n[k] !== undefined && typeof n[k] !== 'boolean') at(wn, `"${k}" phải là true/false.`);
      if (n.effort !== undefined && !(Number.isInteger(n.effort) && n.effort > 0)) at(wn, '"effort" phải là số phút nguyên dương.');
      if (!n.deprecated && !n.article && !(n.resources ?? []).length) {
        at(wn, 'cần "article" hoặc ít nhất 1 mục trong "resources" để người học có chỗ bắt đầu.');
      }
      (n.resources ?? []).forEach((r, ri) => {
        unknown(r, KEYS.resource, `${wn}.resources[${ri}]`);
        str(r?.title, `${wn}.resources[${ri}]`, 'title');
        str(r?.url, `${wn}.resources[${ri}]`, 'url');
        url(r?.url, `${wn}.resources[${ri}]`);
      });
    });
  });

  // requires trỏ tới node có thật, không trỏ chính mình
  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const n of nodes) {
    for (const r of n.requires ?? []) {
      if (r === n.id) at(`node "${n.id}"`, 'không thể requires chính nó.');
      else if (!nodeIds.has(r)) at(`node "${n.id}"`, `requires "${r}" không phải id node nào trong roadmap.`);
    }
  }

  // không có vòng phụ thuộc
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const state = new Map(); // 1 = đang thăm, 2 = xong
  const visit = (id, path) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) {
      at(`node "${id}"`, `phụ thuộc vòng tròn: ${[...path.slice(path.indexOf(id)), id].join(' → ')}.`);
      return;
    }
    state.set(id, 1);
    for (const r of byId.get(id)?.requires ?? []) if (byId.has(r)) visit(r, [...path, id]);
    state.set(id, 2);
  };
  for (const n of nodes) visit(n.id, []);

  return errs;
}

/**
 * Bố cục một chặng: trục chính + nhánh, sinh hoàn toàn từ `requires` (không có toạ độ tay).
 * - Node cha là `requires` đầu tiên nằm trong cùng chặng; các `requires` còn lại
 *   (kể cả sang chặng khác) thành "extra" để vẽ bằng chip trên node.
 * - Trục chính: mỗi node gốc bắt buộc theo thứ tự trong file, nối tiếp bằng chuỗi con bắt buộc dài nhất của nó.
 * - Con không nằm trên trục thành nhánh: bắt buộc rẽ phải, tuỳ chọn rẽ trái. Cháu chắt đi theo phía của nhánh.
 * - Node gốc tuỳ chọn không có cha: gom vào một hàng cuối không có node trục (id = null).
 * Trả về { rows: [{ id, left: Tree[], right: Tree[] }], order: id[], extra: { id: requiresId[] } },
 * với Tree = { id, children: Tree[] } và `order` là thứ tự đọc gợi ý.
 */
export function layoutSection(section) {
  const nodes = (section.nodes ?? []).filter((n) => !n.deprecated);
  const ids = new Set(nodes.map((n) => n.id));
  const parent = new Map();
  /** @type {Record<string, string[]>} */
  const extra = {};
  const kids = new Map(nodes.map((n) => [n.id, []]));
  for (const n of nodes) {
    const req = n.requires ?? [];
    const p = req.find((r) => ids.has(r));
    if (p) { parent.set(n.id, p); kids.get(p).push(n); }
    const rest = req.filter((r) => r !== p);
    if (rest.length) extra[n.id] = rest;
  }
  const roots = nodes.filter((n) => !parent.has(n.id));
  // chiều cao theo chuỗi node bắt buộc, để chọn trục chính
  const height = new Map();
  const h = (n) => {
    if (height.has(n.id)) return height.get(n.id);
    const best = Math.max(0, ...kids.get(n.id).filter((k) => !k.optional).map(h));
    height.set(n.id, 1 + best);
    return 1 + best;
  };
  nodes.forEach(h);

  let trunkRoots = roots.filter((n) => !n.optional);
  if (trunkRoots.length === 0) trunkRoots = roots.slice(0, 1); // chặng toàn node tuỳ chọn
  const trunk = [];
  for (let cur of trunkRoots) {
    while (cur) {
      trunk.push(cur);
      // sort ổn định: hoà nhau thì giữ thứ tự trong file
      cur = kids.get(cur.id).filter((k) => !k.optional).sort((x, y) => h(y) - h(x))[0];
    }
  }
  const onTrunk = new Set(trunk.map((n) => n.id));
  const tree = (n) => ({ id: n.id, children: kids.get(n.id).map(tree) });
  const rows = trunk.map((n) => {
    const side = kids.get(n.id).filter((k) => !onTrunk.has(k.id));
    return { id: n.id, left: side.filter((k) => k.optional).map(tree), right: side.filter((k) => !k.optional).map(tree) };
  });
  const orphans = roots.filter((n) => !onTrunk.has(n.id));
  if (orphans.length) rows.push({ id: null, left: orphans.map(tree), right: [] });

  const order = [];
  const walk = (t) => { order.push(t.id); t.children.forEach(walk); };
  for (const r of rows) {
    if (r.id) order.push(r.id);
    r.right.forEach(walk);
    r.left.forEach(walk);
  }
  return { rows, order, extra };
}

/**
 * Cảnh báo (không chặn CI): bố cục chỉ vẽ một node cha, nên nhiều `requires`
 * trong cùng chặng sẽ có cạnh không vẽ được.
 */
export function warnRoadmap(rm) {
  const warns = [];
  for (const sec of rm.sections ?? []) {
    const here = new Set((sec.nodes ?? []).map((n) => n.id));
    for (const n of sec.nodes ?? []) {
      const inSec = (n.requires ?? []).filter((r) => here.has(r));
      if (inSec.length > 1) warns.push(`node "${n.id}": ${inSec.length} requires trong cùng chặng "${sec.id}", chỉ "${inSec[0]}" được vẽ làm node cha.`);
    }
  }
  return warns;
}

/** Tập id node trong một nội dung YAML (dùng để so với bản trên nhánh gốc). */
export function nodeIdsFromYaml(text) {
  try {
    const data = parse(text) ?? {};
    return new Set(allNodes(data).map((n) => n.id).filter(Boolean));
  } catch {
    return new Set();
  }
}

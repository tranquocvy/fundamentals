import data from '../../content/glossary.json';

export type GlossaryEntry = {
  term: string;
  /** cách hiển thị, vd. "TCP" cho khoá "tcp"; mặc định là chính khoá */
  label?: string;
  def: string;
  subject?: string;
  aliases?: string[];
};

type RawEntry = Omit<GlossaryEntry, 'term'>;
const raw = (data as { terms: Record<string, RawEntry> }).terms;

/** Tất cả thuật ngữ, sắp theo ABC. */
export const glossary: GlossaryEntry[] = Object.entries(raw)
  .map(([term, e]) => ({ term, ...e }))
  .sort((a, b) => a.term.localeCompare(b.term));

const index = new Map<string, GlossaryEntry>();
for (const e of glossary) {
  index.set(e.term.toLowerCase(), e);
  for (const a of e.aliases ?? []) index.set(a.toLowerCase(), e);
}

/** Tra thuật ngữ theo tên hoặc alias, không phân biệt hoa thường. */
export function lookupTerm(key: string): GlossaryEntry | undefined {
  return index.get(key.trim().toLowerCase());
}

/** id dùng cho anchor trên trang glossary: "race condition" → "race-condition". */
export const termAnchor = (term: string) => term.toLowerCase().replace(/\s+/g, '-');

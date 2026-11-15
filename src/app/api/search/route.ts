import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins/remark-structure';

export const revalidate = false;

/** Bỏ thẻ JSX/HTML (vd. <Term def="...">x</Term> → x) để kết quả search chỉ còn chữ. */
const stripTags = (s: string) => s.replace(/<\/?[A-Za-z][^<>]*>/g, '');

export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
  async buildIndex(page) {
    const raw = page.data.structuredData as StructuredData | (() => Promise<StructuredData>);
    const data = typeof raw === 'function' ? await raw() : raw;
    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: {
        ...data,
        contents: data.contents.map((c) => ({ ...c, content: stripTags(c.content) })),
      },
    };
  },
});

import { llms, loader } from 'fumadocs-core/source';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

/**
 * Frontmatter của mỗi bài. Thêm field mới ở đây là mọi bài đều được kiểm tra.
 * - status: draft (chưa ai review) | reviewed
 * - tags: nhãn ngắn, ví dụ [os, concurrency]
 * - references: nguồn tiếng Anh để đối chiếu
 */
export const articleSchema = pageSchema.extend({
  status: z.enum(['draft', 'reviewed']).default('draft'),
  tags: z.array(z.string()).default([]),
  references: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url().optional(),
        kind: z.enum(['book', 'web', 'paper', 'video']).default('web'),
        note: z.string().optional(),
      }),
    )
    .default([]),
});

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: articleSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
  // link to the files under `/llms.mdx`
  renderUrl: (item) => (/^\/.*\.(md|txt)$/.test(item.url) ? `/llms.mdx${item.url}` : item.url),
});

import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, gitConfig } from '@/lib/shared';
import { getGitInfo } from '@/lib/git';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const editUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/edit/${gitConfig.branch}/content/docs/${encodeURI(page.path)}`;
  const git = getGitInfo(`content/docs/${page.path}`);
  const authors = page.data.authors;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <p className="font-mono text-xs text-fd-muted-foreground mb-2">
        ~/{page.slugs.join('/')}
      </p>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <Byline authors={authors} gitAuthor={git.author} contributors={git.contributors} updated={git.updated} editUrl={editUrl} />
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs mt-2">
        {/* trạng thái chỉ có nghĩa với bài trong một môn, không với trang chung như glossary */}
        {page.slugs.length > 1 && (
          <span className="border border-fd-primary text-fd-primary px-2 py-0.5">{page.data.status}</span>
        )}
        {page.data.tags.map((t) => (
          <span key={t} className="text-fd-muted-foreground">#{t}</span>
        ))}
      </div>
      <div className="border-b border-fd-border pb-6" />
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        {page.data.references.length > 0 && (
          <section className="mt-12 border-t border-fd-border pt-6 not-prose">
            <h2 className="text-lg font-semibold mb-4">Tài liệu tham khảo</h2>
            <ul className="space-y-3 text-sm">
              {page.data.references.map((r) => (
                <li key={r.title} className="flex items-baseline gap-3">
                  <span className="shrink-0 w-14 font-mono text-xs text-fd-primary">[{r.kind}]</span>
                  <span>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{r.title}</a>
                  ) : (
                    r.title
                  )}
                  {r.note && <span className="text-fd-muted-foreground"> — {r.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </DocsBody>
    </DocsPage>
  );
}

function Byline({
  authors,
  gitAuthor,
  contributors,
  updated,
  editUrl,
}: {
  authors: string[];
  gitAuthor?: string;
  contributors: string[];
  updated?: string;
  editUrl?: string;
}) {
  if (authors.length === 0 && !gitAuthor && !updated) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fd-muted-foreground">
      {authors.length > 0 ? (
        <span className="flex items-center gap-2">
          <span className="flex -space-x-1.5">
            {authors.map((u) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={u} src={`https://github.com/${u}.png?size=48`} alt="" width={22} height={22} loading="lazy"
                className="rounded-full ring-2 ring-fd-background" />
            ))}
          </span>
          <span>
            {authors.map((u, i) => (
              <span key={u}>
                {i > 0 && ', '}
                <a href={`https://github.com/${u}`} target="_blank" rel="noreferrer"
                  className="font-medium text-fd-foreground hover:text-fd-primary">{u}</a>
              </span>
            ))}
          </span>
        </span>
      ) : (
        gitAuthor && <span>Viết bởi <span className="font-medium text-fd-foreground">{gitAuthor}</span></span>
      )}
      {contributors.length > 0 && <span>· cùng {contributors.join(', ')}</span>}
      {updated && <span>· cập nhật {fmtDate(updated)}</span>}
      {editUrl && (
        <a href={editUrl} target="_blank" rel="noreferrer" className="hover:text-fd-primary">
          · Sửa trên GitHub ↗
        </a>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}

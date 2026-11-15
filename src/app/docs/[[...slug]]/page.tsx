import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, gitConfig } from '@/lib/shared';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `/llms.mdx${page.url}.md`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <p className="font-mono text-xs text-fd-muted-foreground mb-2">
        ~/{page.slugs.join('/')}
      </p>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs mt-2">
        <span className="border border-fd-primary text-fd-primary px-2 py-0.5">{page.data.status}</span>
        {page.data.tags.map((t) => (
          <span key={t} className="text-fd-muted-foreground">#{t}</span>
        ))}
      </div>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${encodeURI(page.path)}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        {page.data.references.length > 0 && (
          <section className="mt-12 border-t border-fd-border pt-6 not-prose">
            <h2 className="font-mono text-sm text-fd-muted-foreground mb-3">// references</h2>
            <ul className="space-y-2 text-sm">
              {page.data.references.map((r) => (
                <li key={r.title}>
                  <span className="font-mono text-xs text-fd-primary mr-2">[{r.kind}]</span>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{r.title}</a>
                  ) : (
                    r.title
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </DocsBody>
    </DocsPage>
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

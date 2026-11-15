import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RoadmapView } from '@/components/roadmap/roadmap-view';
import { getRoadmap, getRoadmaps, summarize, toView } from '@/lib/roadmaps';
import { gitConfig } from '@/lib/shared';

export const dynamicParams = false;

export function generateStaticParams() {
  return getRoadmaps().map((rm) => ({ slug: rm.slug }));
}

export async function generateMetadata(props: PageProps<'/roadmaps/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const rm = getRoadmap(slug);
  if (!rm) notFound();
  return { title: `${rm.title} roadmap`, description: rm.description };
}

export default async function RoadmapPage(props: PageProps<'/roadmaps/[slug]'>) {
  const { slug } = await props.params;
  const rm = getRoadmap(slug);
  if (!rm) notFound();
  const s = summarize(rm);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="font-mono text-sm text-fd-muted-foreground">
        <Link href="/roadmaps" className="hover:text-fd-primary">~/roadmaps</Link>/{rm.slug}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.25rem,9vw,3.5rem)] font-semibold leading-tight">{rm.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground">{rm.description}</p>
      <p className="mt-3 text-sm text-fd-muted-foreground">
        {s.sectionCount} chặng · {s.nodeCount} chủ đề · {s.articleCount} đã có bài · khung theo{' '}
        {rm.sources.map((src, i) => (
          <span key={src.name}>
            {i > 0 && ', '}
            {src.url ? (
              <a href={src.url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-fd-foreground">
                {src.name}
              </a>
            ) : (
              src.name
            )}
          </span>
        ))}
      </p>

      <RoadmapView slug={rm.slug} sections={toView(rm)} />

      <p className="mt-16 text-sm text-fd-muted-foreground">
        Thiếu chủ đề hay thứ tự chưa hợp lý? Sửa{' '}
        <a
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/edit/${gitConfig.branch}/content/roadmaps/${rm.slug}.yaml`}
          target="_blank"
          rel="noreferrer"
          className="text-fd-primary hover:underline"
        >
          content/roadmaps/{rm.slug}.yaml
        </a>{' '}
        và mở Pull Request.
      </p>
    </main>
  );
}

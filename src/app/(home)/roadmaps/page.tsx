import type { Metadata } from 'next';
import { RoadmapCard, type CardData } from '@/components/roadmap/roadmap-card';
import { getRoadmaps, summarize, toMiniMap } from '@/lib/roadmaps';
import { gitConfig } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Roadmaps',
  description: 'Các lộ trình học dựng từ dữ liệu mở: chọn một cây, đánh dấu tiến trình, đọc bài theo từng chặng.',
};

export default function RoadmapsPage() {
  const cards: CardData[] = getRoadmaps().map((rm) => {
    const s = summarize(rm);
    return {
      slug: s.slug,
      title: s.title,
      description: s.description,
      sourceName: s.sources[0]?.name ?? '',
      nodeCount: s.nodeCount,
      articleCount: s.articleCount,
      keys: s.keys,
      map: toMiniMap(rm),
    };
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="font-mono text-sm text-fd-muted-foreground">~/roadmaps</p>
      <h1 className="mt-4 font-display text-[clamp(2.25rem,9vw,3.5rem)] font-semibold leading-tight">Roadmaps</h1>
      <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground">
        Lộ trình học dựng từ dữ liệu mở. Chọn một cây, đánh dấu chủ đề đã học, mở bài ngay trên từng chặng. Tiến trình lưu
        trong trình duyệt của bạn.
      </p>

      <div className="mt-10 grid gap-4">
        {cards.map((c) => (
          <RoadmapCard key={c.slug} data={c} />
        ))}
      </div>

      <p className="mt-10 text-sm text-fd-muted-foreground">
        Muốn thêm một roadmap hay một chủ đề còn thiếu? Mỗi cây chỉ là một file YAML trong{' '}
        <a
          className="text-fd-primary hover:underline"
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/tree/${gitConfig.branch}/content/roadmaps`}
          target="_blank"
          rel="noreferrer"
        >
          content/roadmaps
        </a>
        , mở Pull Request là được.
      </p>
    </main>
  );
}

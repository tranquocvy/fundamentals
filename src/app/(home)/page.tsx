import Link from 'next/link';
import { SubjectList } from '@/components/subject-list';
import { subjects } from '@/lib/subjects';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="font-mono text-sm text-fd-muted-foreground">$ cat README.md</p>
      <h1 className="mt-4 font-display text-[clamp(2.25rem,11vw,3.75rem)] font-semibold leading-tight md:text-7xl">
        Fundamentals<span className="cursor">_</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-fd-muted-foreground">
        Ghi chú kiến thức nền tảng IT — viết bằng tiếng Việt, giữ thuật ngữ tiếng Anh, kèm nguồn gốc để đối chiếu.
      </p>
      <div className="mt-6 flex flex-col gap-2 font-mono text-sm sm:flex-row sm:gap-6">
        <Link href="/docs/os" className="text-fd-primary hover:underline">
          &gt; bắt đầu với Operating Systems
        </Link>
        <Link href="/roadmaps" className="text-fd-primary hover:underline">
          &gt; chọn một roadmap
        </Link>
      </div>
      <h2 className="mt-16 mb-4 font-mono text-sm font-normal text-fd-muted-foreground">~/subjects</h2>
      <SubjectList subjects={subjects} />
    </main>
  );
}

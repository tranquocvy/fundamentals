import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { FontToggle } from '@/components/font-toggle';

/**
 * docs=true: layout bài viết. Sidebar chỉ liệt kê môn/bài (không lặp link nav),
 * nút đổi font nằm ở chân sidebar; logo "> fundamentals" vẫn dẫn về trang chủ.
 */
export function baseOptions({ docs = false } = {}): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-mono text-base font-bold tracking-tight">
          <span className="text-fd-primary">&gt;</span> {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: docs ? [] : [
      { text: <span className="font-mono text-sm">~/home</span>, url: '/', active: 'url' },
      { text: <span className="font-mono text-sm">/subjects</span>, url: '/docs', active: 'nested-url' },
      { text: <span className="font-mono text-sm">/roadmaps</span>, url: '/roadmaps', active: 'nested-url' },
      { text: <span className="font-mono text-sm">/glossary</span>, url: '/docs/glossary' },
      { text: <span className="font-mono text-sm">/contribute</span>, url: '/docs/contribute' },
      { type: 'custom', secondary: true, children: <FontToggle /> },
    ],
  };
}

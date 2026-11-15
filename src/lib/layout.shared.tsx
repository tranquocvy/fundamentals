import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { FontToggle } from '@/components/font-toggle';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-mono text-base font-bold tracking-tight">
          <span className="text-fd-primary">&gt;</span> {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: <span className="font-mono text-sm">~/home</span>, url: '/', active: 'url' },
      { text: <span className="font-mono text-sm">/subjects</span>, url: '/docs', active: 'nested-url' },
      { text: <span className="font-mono text-sm">/contribute</span>, url: '/docs/contribute' },
      { type: 'custom', secondary: true, children: <FontToggle /> },
    ],
  };
}

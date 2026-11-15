import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { FontToggle } from '@/components/font-toggle';

/** fontToggleInNav=false: trang docs đặt nút đổi font ở chân sidebar thay vì lẫn trong link nav. */
export function baseOptions({ fontToggleInNav = true } = {}): BaseLayoutProps {
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
      ...(fontToggleInNav
        ? [{ type: 'custom' as const, secondary: true, children: <FontToggle /> }]
        : []),
    ],
  };
}

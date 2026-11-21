import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Expand } from './expand';
import { Term } from './term';
import { GlossaryList } from './glossary-list';
import { GrowthChart } from './growth-chart';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Expand,
    Term,
    GlossaryList,
    GrowthChart,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

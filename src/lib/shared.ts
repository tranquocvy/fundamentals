import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'fundamentals';
export const author = 'tranquocvy';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';

// Đổi `repo` cho khớp tên repo GitHub thật của bạn.
export const gitConfig = {
  user: 'tranquocvy',
  repo: 'fundamentals',
  branch: 'main',
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}

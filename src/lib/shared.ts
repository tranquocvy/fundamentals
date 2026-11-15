import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'fundamentals';
export const author = 'tranquocvy';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';

/**
 * URL gốc của site, dùng cho ảnh OG và link tuyệt đối.
 * Ưu tiên NEXT_PUBLIC_SITE_URL (khi đổi sang domain riêng), build trên Vercel dùng domain production,
 * chạy local dùng localhost. Không dùng VERCEL_PROJECT_PRODUCTION_URL: Vercel có thể chọn domain tự sinh
 * cũ (vd. fundamentals-alpha.vercel.app) thay vì domain mình đặt.
 */
export const productionUrl = 'https://fundamentals-notes.vercel.app';
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL ? productionUrl : 'http://localhost:3000');

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

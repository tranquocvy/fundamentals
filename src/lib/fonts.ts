import { Fraunces, Source_Serif_4, Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';

// Lưu ý: next/font yêu cầu options là object literal (không dùng biến).
export const fraunces = Fraunces({ subsets: ['latin', 'vietnamese'], variable: '--font-fraunces', display: 'swap' });
export const sourceSerif = Source_Serif_4({ subsets: ['latin', 'vietnamese'], variable: '--font-source-serif', style: ['normal', 'italic'], display: 'swap' });
export const beVietnam = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], variable: '--font-be-vietnam', weight: ['400', '600'], display: 'swap' });
export const jetbrains = JetBrains_Mono({ subsets: ['latin', 'vietnamese'], variable: '--font-jetbrains', display: 'swap' });

export const fontVariables = [fraunces, sourceSerif, beVietnam, jetbrains].map((f) => f.variable).join(' ');

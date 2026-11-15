/**
 * Danh sách môn học hiển thị ở trang chủ.
 * `slug` trùng tên thư mục trong content/docs/. Môn chưa có thư mục sẽ hiện "soon".
 * Màu accent: dark dùng nền tối, light dùng nền sáng (đã chọn để đủ contrast).
 */
export type Subject = {
  slug: string;
  num: string;
  title: string;
  topics: string;
  accent: { dark: string; light: string };
  /** có nội dung trong content/docs/<slug> chưa */
  ready: boolean;
};

export const subjects: Subject[] = [
  { slug: 'os', num: '01', title: 'Operating Systems', topics: 'process · thread · scheduling · virtual memory', accent: { dark: '#ffb454', light: '#a65400' }, ready: true },
  { slug: 'networking', num: '02', title: 'Computer Networks', topics: 'TCP/IP · HTTP · DNS · TLS', accent: { dark: '#5ccfe6', light: '#00758f' }, ready: false },
  { slug: 'databases', num: '03', title: 'Databases', topics: 'indexing · transaction · normalization', accent: { dark: '#c9a6ff', light: '#6a3fc0' }, ready: false },
  { slug: 'dsa', num: '04', title: 'Data Structures & Algorithms', topics: 'array → graph · complexity', accent: { dark: '#ff8a8a', light: '#c0392b' }, ready: false },
  { slug: 'oop', num: '05', title: 'OOP & Design Patterns', topics: 'SOLID · patterns · architecture', accent: { dark: '#aad94c', light: '#4a7a00' }, ready: false },
  { slug: 'backend', num: '06', title: 'Backend', topics: 'REST · auth · caching · concurrency', accent: { dark: '#f78fb3', light: '#b0245f' }, ready: false },
  { slug: 'devops', num: '07', title: 'DevOps', topics: 'linux · docker · ci/cd', accent: { dark: '#7ee0c3', light: '#00785a' }, ready: false },
];

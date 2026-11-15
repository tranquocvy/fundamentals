import './global.css';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { SubjectScope } from '@/components/subject-scope';
import { fontVariables } from '@/lib/fonts';
import { appName, author, siteUrl } from '@/lib/shared';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${appName} — IT fundamentals notes`, template: `%s · ${appName}` },
  description: 'Ghi chú kiến thức nền tảng IT bằng tiếng Việt, giữ thuật ngữ tiếng Anh.',
};

// Áp font đọc đã lưu trước khi paint để tránh nháy.
const readingFontScript = `try{var f=localStorage.getItem('reading-font');if(f)document.documentElement.dataset.readingFont=f}catch(e){}`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: readingFontScript }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider>
          <SubjectScope />
          <div className="flex-1 flex flex-col">{children}</div>
          <footer className="border-t border-fd-border px-6 py-5 font-mono text-xs text-fd-muted-foreground">
            © 2026 {author} · nội dung do các thành viên đóng góp
          </footer>
        </Provider>
      </body>
    </html>
  );
}

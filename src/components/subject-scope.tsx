'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Đặt data-subject trên <html> theo URL /docs/<môn>/... để đổi accent. */
export function SubjectScope() {
  const pathname = usePathname();
  useEffect(() => {
    const m = pathname.match(/^\/docs\/([^/]+)/);
    const el = document.documentElement;
    if (m) el.dataset.subject = m[1];
    else delete el.dataset.subject;
  }, [pathname]);
  return null;
}

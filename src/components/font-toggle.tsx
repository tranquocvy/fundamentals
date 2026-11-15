'use client';
import { useEffect, useState } from 'react';

export function FontToggle() {
  const [sans, setSans] = useState(false);
  useEffect(() => setSans(document.documentElement.dataset.readingFont === 'sans'), []);
  const toggle = () => {
    const next = sans ? 'serif' : 'sans';
    document.documentElement.dataset.readingFont = next;
    try { localStorage.setItem('reading-font', next); } catch {}
    setSans(!sans);
  };
  return (
    <button
      onClick={toggle}
      aria-label="Đổi font đọc"
      title="Đổi font đọc: serif / sans"
      className="whitespace-nowrap font-mono text-xs px-2 py-1 border border-fd-border hover:border-fd-primary hover:text-fd-primary transition-colors"
    >
      Aa {sans ? 'sans' : 'serif'}
    </button>
  );
}

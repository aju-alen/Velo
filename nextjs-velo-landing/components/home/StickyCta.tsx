'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('home-hero');
    const closing = document.getElementById('home-closing');
    if (!hero || !closing) return;

    let heroVisible = true;
    let closingVisible = false;

    const apply = () => {
      const next = !heroVisible && !closingVisible;
      setVisible(next);
      document.body.style.paddingBottom = next ? '5.5rem' : '';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === closing) closingVisible = entry.isIntersecting;
        }
        apply();
      },
      { threshold: 0.12 },
    );

    observer.observe(hero);
    observer.observe(closing);
    apply();

    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8EB] bg-white px-4 py-3 transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/marketplace"
          tabIndex={visible ? 0 : -1}
          className="inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2"
        >
          Browse the Marketplace
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link
          href="/download-app"
          tabIndex={visible ? 0 : -1}
          className="inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2"
        >
          <Download className="mr-2 h-4 w-4" />
          Download the App
        </Link>
      </div>
    </div>
  );
}

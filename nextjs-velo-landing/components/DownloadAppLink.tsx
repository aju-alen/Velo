'use client';

import { useEffect, useState } from 'react';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/app-links';

type DownloadAppLinkProps = {
  className?: string;
  children: React.ReactNode;
  tabIndex?: number;
};

function storeUrlForDevice() {
  if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)) {
    return PLAY_STORE_URL;
  }
  return APP_STORE_URL;
}

export default function DownloadAppLink({ className, children, tabIndex }: DownloadAppLinkProps) {
  const [href, setHref] = useState(APP_STORE_URL);

  useEffect(() => {
    setHref(storeUrlForDevice());
  }, []);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const url = storeUrlForDevice();
    if (event.currentTarget.href === url) return;
    event.preventDefault();
    window.location.assign(url);
  }

  return (
    <a href={href} onClick={handleClick} className={className} tabIndex={tabIndex}>
      {children}
    </a>
  );
}

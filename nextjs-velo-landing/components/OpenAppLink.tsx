'use client';

import {
  APP_PACKAGE,
  APP_SCHEME,
  registrationDeepLink,
  registrationPagePath,
  registrationRoles,
  type RegistrationPath,
} from '@/lib/app-links';

type OpenAppLinkProps = {
  path: RegistrationPath;
  className?: string;
  children: React.ReactNode;
};

function isAndroid(userAgent: string) {
  return /Android/i.test(userAgent);
}

function isAppleMobile(userAgent: string) {
  return /iPhone|iPad|iPod/i.test(userAgent);
}

export default function OpenAppLink({ path, className, children }: OpenAppLinkProps) {
  const pagePath = registrationPagePath(path);
  const appRole = registrationRoles[path].appRole;

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const userAgent = navigator.userAgent;
    if (!isAndroid(userAgent) && !isAppleMobile(userAgent)) {
      return;
    }

    event.preventDefault();
    const deepLink = registrationDeepLink(appRole);

    if (isAndroid(userAgent)) {
      const fallback = encodeURIComponent(`${window.location.origin}${pagePath}`);
      window.location.assign(
        `intent://register?role=${appRole}#Intent;scheme=${APP_SCHEME};package=${APP_PACKAGE};S.browser_fallback_url=${fallback};end`,
      );
      return;
    }

    const openedAt = Date.now();
    window.location.assign(deepLink);
    window.setTimeout(() => {
      if (document.hidden || Date.now() - openedAt > 2500) return;
      if (window.location.pathname === pagePath) return;
      window.location.assign(pagePath);
    }, 1200);
  }

  return (
    <a href={pagePath} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

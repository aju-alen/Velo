import { router } from 'expo-router';

type Href = Parameters<typeof router.replace>[0];

/**
 * Leave the current flow without leaving screens underneath
 * (e.g. welcome) that the user can swipe/hardware-back into.
 */
export function resetTo(href: Href) {
  try {
    if (router.canDismiss()) {
      router.dismissAll();
    }
  } catch {
    // Some navigators do not support dismiss — fall through to replace.
  }
  router.replace(href);
}

// Update these URLs with your App Store and Play Store links.
export const APP_STORE_URL = 'https://apps.apple.com/us/app/velo-shipping/id6748440881';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.rise.velointernationalshipping';

export const APP_SCHEME = 'velo-international-shipping';
export const APP_PACKAGE = 'com.rise.velointernationalshipping';

export type RegistrationPath = 'sender' | 'agent';
export type AppRegistrationRole = 'USER' | 'AGENT';

export const registrationRoles: Record<
  RegistrationPath,
  {
    appRole: AppRegistrationRole;
    title: string;
    description: string;
    openLabel: string;
  }
> = {
  sender: {
    appRole: 'USER',
    title: 'Get started as a Sender',
    description: 'Sender registration opens in the Velo app. If the app is not installed yet, download it, then come back and open registration.',
    openLabel: 'Open sender registration',
  },
  agent: {
    appRole: 'AGENT',
    title: 'Become a Logistics Agent',
    description: 'Agent registration opens in the Velo app. If the app is not installed yet, download it, then come back and open registration.',
    openLabel: 'Open agent registration',
  },
};

export function registrationPagePath(path: RegistrationPath) {
  return `/get-started/${path}`;
}

export function registrationDeepLink(appRole: AppRegistrationRole) {
  return `${APP_SCHEME}://register?role=${appRole}`;
}

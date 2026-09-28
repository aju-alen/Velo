import type { AccountMenuItem } from '@/components/profile/AccountMenuList';

const SHARED_ITEMS: AccountMenuItem[] = [
  { label: 'Change Password', icon: 'lock-closed-outline', route: '/profile/settings/changePassword', requiresAccount: true },
  { label: 'Support', icon: 'chatbox-outline', route: '/profile/settings/support' },
  {
    label: 'Privacy Policy',
    icon: 'document-text-outline',
    route: 'https://www.termsfeed.com/live/45aff027-4be0-4fba-9f3f-8f827233fc4a',
    isExternal: true,
  },
  {
    label: 'EULA',
    icon: 'document-text-outline',
    route: 'https://velo-mobile-bucket.s3.ap-southeast-1.amazonaws.com/Asset/Velo+EULA.pdf',
    isExternal: true,
  },
  { label: 'Delete Account', icon: 'trash-outline', route: '/profile/settings/deleteAccount', requiresAccount: true },
];

/**
 * Role-aware profile / settings menu items.
 * Common actions are shared; role slots add shortcuts only where permitted.
 */
export function getProfileMenuItems(role?: string): AccountMenuItem[] {
  if (!role || role === 'GUEST') {
    return [
      { label: 'Browse Market', icon: 'storefront-outline', route: '/(tabs)/market/marketHome' },
      { label: 'Support', icon: 'chatbox-outline', route: '/profile/settings/support' },
      {
        label: 'Privacy Policy',
        icon: 'document-text-outline',
        route: 'https://www.termsfeed.com/live/45aff027-4be0-4fba-9f3f-8f827233fc4a',
        isExternal: true,
      },
      { label: 'Sign Up', icon: 'person-add-outline', route: '/(auth)/chooseRole', guestOnly: true },
      { label: 'Log In', icon: 'log-in-outline', route: '/(auth)/login', guestOnly: true },
    ];
  }

  const roleSlot: AccountMenuItem[] = [];

  if (role === 'USER') {
    roleSlot.push(
      { label: 'Shipping History', icon: 'time-outline', route: '/(tabs)/shippinghistory/orderHistoryMainPage', requiresAccount: true },
      { label: 'Track Shipment', icon: 'locate-outline', route: '/(tabs)/home/trackShipment', requiresAccount: true }
    );
  }

  if (role === 'AGENT' || role === 'SUB_AGENT') {
    roleSlot.push({
      label: 'Agent Orders',
      icon: 'cube-outline',
      route: '/(tabs)/adminorderdetail/adminOrderDetailMain',
      requiresAccount: true,
    });
  }

  if (role === 'SUPERADMIN') {
    roleSlot.push({
      label: 'Register Requests',
      icon: 'construct-outline',
      route: '/(tabs)/superRegisterRequestTab/superRegisterRequest',
      requiresAccount: true,
    });
  }

  return [...roleSlot, ...SHARED_ITEMS];
}

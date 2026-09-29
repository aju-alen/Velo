import React from 'react';
import { StyleSheet, TouchableOpacity, View, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { AppText } from '@/components/AppText';
import { resetTo } from '@/utils/resetNavigation';

export type AccountMenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  isExternal?: boolean;
  requiresAccount?: boolean;
  guestOnly?: boolean;
};

const DEFAULT_ITEMS: AccountMenuItem[] = [
  { label: 'Track Shipment', icon: 'locate-outline', route: '/(tabs)/home/trackShipment', requiresAccount: true },
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
  { label: 'Sign Up', icon: 'person-add-outline', route: '/(auth)/chooseRole', guestOnly: true },
];

type AccountMenuListProps = {
  isGuest?: boolean;
  hasAccountId?: boolean;
  items?: AccountMenuItem[];
};

const AccountMenuList = ({
  isGuest = false,
  hasAccountId = false,
  items = DEFAULT_ITEMS,
}: AccountMenuListProps) => {
  const { colors, radius } = useAppTheme();

  const visibleItems = items.filter((item) => {
    if (item.guestOnly) return isGuest;
    if (item.requiresAccount && (isGuest || !hasAccountId)) return false;
    return true;
  });

  const handlePress = (item: AccountMenuItem) => {
    if (item.requiresAccount && (isGuest || !hasAccountId)) {
      Alert.alert('Account required', 'Please sign up or log in to use this feature.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Up', onPress: () => resetTo('/(auth)/chooseRole') },
      ]);
      return;
    }
    if (item.isExternal && item.route) {
      Linking.openURL(item.route);
      return;
    }
    if (item.route) {
      if (item.route.startsWith('/(auth)')) {
        resetTo(item.route as any);
        return;
      }
      router.push(item.route as any);
    }
  };

  if (visibleItems.length === 0) return null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
        },
      ]}
    >
      {visibleItems.map((item, idx) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.row,
            idx !== visibleItems.length - 1 && {
              borderBottomColor: colors.borderSubtle,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
          activeOpacity={0.65}
          onPress={() => handlePress(item)}
        >
          <AppText variant="bodyStrong" style={styles.label}>
            {item.label}
          </AppText>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.xl,
    borderWidth: 1,
    width: '100%',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: Spacing.lg,
    width: '100%',
  },
  label: {
    flex: 1,
    paddingRight: Spacing.md,
  },
});

export default AccountMenuList;

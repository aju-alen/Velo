import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Linking, useColorScheme, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

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
  const colorScheme = useColorScheme() ?? 'light';
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const textSecondary = colorScheme === 'dark' ? '#AAA' : '#666';
  const borderColor = colorScheme === 'dark' ? '#23242A' : '#E0E0E0';
  const accent = Colors[colorScheme].tint;

  const visibleItems = items.filter((item) => {
    if (item.guestOnly) return isGuest;
    if (item.requiresAccount && (isGuest || !hasAccountId)) return false;
    return true;
  });

  const handlePress = (item: AccountMenuItem) => {
    if (item.requiresAccount && (isGuest || !hasAccountId)) {
      Alert.alert('Account required', 'Please sign up or log in to use this feature.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Up', onPress: () => router.replace('/(auth)/chooseRole') },
      ]);
      return;
    }
    if (item.isExternal && item.route) {
      Linking.openURL(item.route);
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  };

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <View style={[styles.card, { backgroundColor: bgCard, borderColor }]}>
      {visibleItems.map((item, idx) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.featureRow,
            idx !== visibleItems.length - 1 && { borderBottomColor: borderColor, borderBottomWidth: 1 },
          ]}
          activeOpacity={0.7}
          onPress={() => handlePress(item)}
        >
          <Ionicons name={item.icon} size={20} color={accent} style={{ marginRight: 16 }} />
          <Text style={[styles.featureLabel, { color: textPrimary }]}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={textSecondary} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  featureLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AccountMenuList;

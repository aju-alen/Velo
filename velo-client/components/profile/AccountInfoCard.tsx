import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export function roleDisplayLabel(role?: string) {
  switch (role) {
    case 'USER':
      return 'Sender';
    case 'AGENT':
      return 'Logistic Agent';
    case 'SUB_AGENT':
      return 'Sub Agent';
    case 'SUPERADMIN':
      return 'Super Admin';
    case 'GUEST':
      return 'Guest';
    default:
      return role || 'Account';
  }
}

type AccountInfoCardProps = {
  name?: string;
  email?: string;
  mobileCode?: string;
  mobileNumber?: string;
  role?: string;
  addressLine?: string | null;
  isGuest?: boolean;
};

const AccountInfoCard = ({
  name,
  email,
  mobileCode,
  mobileNumber,
  role,
  addressLine,
  isGuest,
}: AccountInfoCardProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const textSecondary = colorScheme === 'dark' ? '#AAA' : '#666';
  const borderColor = colorScheme === 'dark' ? '#23242A' : '#E0E0E0';
  const accent = Colors[colorScheme].tint;

  const initials = (name || 'G')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'G';

  const phone =
    mobileCode && mobileNumber
      ? `${mobileCode} ${mobileNumber}`
      : mobileNumber || null;

  return (
    <View style={[styles.card, { backgroundColor: bgCard, borderColor }]}>
      <View style={[styles.avatar, { backgroundColor: accent }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={[styles.name, { color: textPrimary }]}>
        {isGuest ? 'Guest' : name || 'Your account'}
      </Text>
      <Text style={[styles.roleBadge, { color: accent }]}>
        {roleDisplayLabel(role)}
      </Text>

      {!isGuest && (
        <View style={styles.details}>
          {!!email && (
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={16} color={textSecondary} />
              <Text style={[styles.detailText, { color: textSecondary }]}>{email}</Text>
            </View>
          )}
          {!!phone && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color={textSecondary} />
              <Text style={[styles.detailText, { color: textSecondary }]}>{phone}</Text>
            </View>
          )}
          {!!addressLine && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={textSecondary} />
              <Text style={[styles.detailText, { color: textSecondary }]}>{addressLine}</Text>
            </View>
          )}
        </View>
      )}

      {isGuest && (
        <Text style={[styles.guestHint, { color: textSecondary }]}>
          Sign up to manage your account details and shipments.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  roleBadge: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  details: {
    width: '100%',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  guestHint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AccountInfoCard;

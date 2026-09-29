import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { AppText } from '@/components/AppText';

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
  const { colors, radius, brand } = useAppTheme();

  const initials =
    (name || 'G')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'G';

  const phone =
    mobileCode && mobileNumber ? `${mobileCode} ${mobileNumber}` : mobileNumber || null;

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
      <View style={[styles.avatar, { backgroundColor: brand.amber }]}>
        <AppText variant="h2" color="#FFFFFF">
          {initials}
        </AppText>
      </View>
      <AppText variant="h2" style={styles.name}>
        {isGuest ? 'Guest' : name || 'Your account'}
      </AppText>
      <AppText variant="label" secondary style={styles.role}>
        {roleDisplayLabel(role)}
      </AppText>

      {!isGuest && (
        <View style={[styles.details, { borderTopColor: colors.borderSubtle }]}>
          {!!email && (
            <AppText variant="body" secondary style={styles.center}>
              {email}
            </AppText>
          )}
          {!!phone && (
            <AppText variant="body" secondary style={styles.center}>
              {phone}
            </AppText>
          )}
          {!!addressLine && (
            <AppText variant="caption" muted style={styles.center}>
              {addressLine}
            </AppText>
          )}
        </View>
      )}

      {isGuest && (
        <AppText variant="body" muted style={[styles.center, { marginTop: Spacing.sm }]}>
          Create an account to manage shipments and settings.
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    textAlign: 'center',
    marginBottom: 2,
  },
  role: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  details: {
    width: '100%',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: 6,
  },
  center: {
    textAlign: 'center',
  },
});

export default AccountInfoCard;

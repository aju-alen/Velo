import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import useLoginAccountStore from '@/store/loginAccountStore';
import AccountInfoCard from '@/components/profile/AccountInfoCard';
import AccountMenuList from '@/components/profile/AccountMenuList';
import { getProfileMenuItems } from '@/components/profile/getProfileMenuItems';
import OrganisationManagement from '@/components/settings/organisationManagementMenu/OrganisationManagement';
import { getAuth, signOut } from '@react-native-firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { AppText } from '@/components/AppText';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { resetTo } from '@/utils/resetNavigation';

type ProfileShellProps = {
  children?: React.ReactNode;
};

const ProfileShell = ({ children }: ProfileShellProps) => {
  const { accountLoginData, resetAccountLoginData } = useLoginAccountStore();
  const { colors, brand, radius } = useAppTheme();
  const role = accountLoginData.role;
  const isGuest = role === 'GUEST' || !accountLoginData.id;
  const [addressLine, setAddressLine] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAddress = async () => {
      if (role !== 'USER' || !accountLoginData.id) {
        setAddressLine(null);
        return;
      }
      setLoadingAddress(true);
      try {
        const response = await axios.get(
          `${ipURL}/api/address/get-user-address/${accountLoginData.id}`
        );
        const first = response.data?.data?.[0];
        if (!cancelled && first) {
          const parts = [
            first.addressOne,
            first.addressTwo,
            first.city,
            first.state,
            first.country?.name,
          ].filter(Boolean);
          setAddressLine(parts.join(', '));
        }
      } catch {
        if (!cancelled) setAddressLine(null);
      } finally {
        if (!cancelled) setLoadingAddress(false);
      }
    };

    loadAddress();
    return () => {
      cancelled = true;
    };
  }, [accountLoginData.id, role]);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('registerDetail');
      try {
        await signOut(getAuth());
      } catch {
        // ignore
      }
      resetAccountLoginData();
      resetTo(isGuest ? '/(auth)/chooseRole' : '/(auth)/login');
    } catch (err) {
      console.log(err);
    }
  };

  const menuItems = getProfileMenuItems(isGuest ? 'GUEST' : role);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AccountInfoCard
        name={accountLoginData.name}
        email={accountLoginData.email}
        mobileCode={accountLoginData.mobileCode}
        mobileNumber={accountLoginData.mobileNumber}
        role={role || (isGuest ? 'GUEST' : undefined)}
        addressLine={addressLine}
        isGuest={isGuest}
      />
      {loadingAddress && (
        <ActivityIndicator color={brand.amber} style={{ marginBottom: Spacing.md }} />
      )}

      <AppText variant="label" muted style={styles.sectionTitle}>
        {isGuest ? 'Options' : 'Manage'}
      </AppText>
      <AccountMenuList
        isGuest={isGuest}
        hasAccountId={!!accountLoginData.id}
        items={menuItems}
      />

      {role === 'AGENT' && (
        <>
          <AppText variant="label" muted style={styles.sectionTitle}>
            Organisation
          </AppText>
          <OrganisationManagement />
        </>
      )}

      {children}

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <AppText variant="bodyStrong" color={colors.danger}>
          {isGuest ? 'Exit Guest' : 'Log out'}
        </AppText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl + 8,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
  },
  logoutButton: {
    marginTop: Spacing.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default ProfileShell;

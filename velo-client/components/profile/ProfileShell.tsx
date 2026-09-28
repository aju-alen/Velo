import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useLoginAccountStore from '@/store/loginAccountStore';
import AccountInfoCard from '@/components/profile/AccountInfoCard';
import AccountMenuList from '@/components/profile/AccountMenuList';
import { getProfileMenuItems } from '@/components/profile/getProfileMenuItems';
import OrganisationManagement from '@/components/settings/organisationManagementMenu/OrganisationManagement';
import { Colors } from '@/constants/Colors';
import { getAuth, signOut } from '@react-native-firebase/auth';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';

type ProfileShellProps = {
  /** Extra content after role menu (rarely needed) */
  children?: React.ReactNode;
};

/**
 * Shared profile / settings layout for all roles.
 * Role differences are limited to menu shortcuts + agent organisation block.
 */
const ProfileShell = ({ children }: ProfileShellProps) => {
  const { accountLoginData, resetAccountLoginData } = useLoginAccountStore();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const accent = Colors[colorScheme].tint;
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
        // Firebase may not be signed in for all flows
      }
      resetAccountLoginData();
      router.replace(isGuest ? '/(auth)/chooseRole' : '/(auth)/login');
    } catch (err) {
      console.log(err);
    }
  };

  const menuItems = getProfileMenuItems(isGuest ? 'GUEST' : role);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Account</Text>
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
        <ActivityIndicator color={accent} style={{ marginBottom: 12 }} />
      )}

      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        {isGuest ? 'Guest options' : 'Account management'}
      </Text>
      <AccountMenuList
        isGuest={isGuest}
        hasAccountId={!!accountLoginData.id}
        items={menuItems}
      />

      {role === 'AGENT' && (
        <>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Organisation</Text>
          <OrganisationManagement />
        </>
      )}

      {children}

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: accent }]}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>{isGuest ? 'Exit Guest' : 'Logout'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  logoutContainer: {
    paddingTop: 8,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default ProfileShell;

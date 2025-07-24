import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useLoginAccountStore from '@/store/loginAccountStore';
import OrganisationManagement from '@/components/settings/organisationManagementMenu/OrganisationManagement';
import { useColorScheme } from '@/hooks/useColorScheme';

const SettingsHome = () => {
  const { accountLoginData, resetAccountLoginData } = useLoginAccountStore();
  const colorScheme = useColorScheme();
  const accent = '#FFAC1C';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';

  const handleLogout = () => {
    resetAccountLoginData();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Organisation Management Card */}
      {accountLoginData.role === "AGENT" && <OrganisationManagement />}

      {/* Logout Button */}
      <ThemedView style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: accent }]}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingTop: 24,
    paddingBottom: 16,
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

export default SettingsHome;
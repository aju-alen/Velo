import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useLoginAccountStore from '@/store/loginAccountStore';
import OrganisationManagement from '@/components/settings/organisationManagementMenu/OrganisationManagement';
import { Colors } from '@/constants/Colors';
import { getAuth, signOut } from '@react-native-firebase/auth';
import * as SecureStore from 'expo-secure-store';

const SettingsHome = () => {
  const { accountLoginData, resetAccountLoginData } = useLoginAccountStore();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const accent = '#FFAC1C';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';

  const handleLogout = async () => {
    try{
      await SecureStore.deleteItemAsync('registerDetail');
      try {
        await signOut(getAuth());
      } catch (e) {
        
      }
      resetAccountLoginData();
      router.replace('/(auth)/login');
    }
    catch(err){
      console.log(err);
    }
    
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Organisation Management Card */}
      {accountLoginData.role === "AGENT" && <OrganisationManagement />}

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: accent }]}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
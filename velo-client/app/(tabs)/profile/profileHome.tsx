import { StyleSheet, TouchableOpacity, View, Linking, Text, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useLoginAccountStore from '@/store/loginAccountStore';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const features = [
  { label: 'Change Password', icon: 'lock-closed-outline', route: '/profile/settings/changePassword' },
  // { label: 'My Orders', icon: 'cube-outline', route: '/profile/settings/myOrders' },
  
  { label: 'Support', icon: 'chatbox-outline', route: '/profile/settings/support' },
  { label: 'Privacy Policy', icon: 'document-text-outline', route: 'https://www.termsfeed.com/live/45aff027-4be0-4fba-9f3f-8f827233fc4a', isExternal: true },
  { label: 'EULA', icon: 'document-text-outline', route: 'https://velo-mobile-bucket.s3.ap-southeast-1.amazonaws.com/Asset/Velo+EULA.pdf', isExternal: true },
  { label: 'Delete Account', icon: 'trash-outline', route: '/profile/settings/deleteAccount' },
];

const ProfileHome = () => {
  const { accountLoginData } = useLoginAccountStore();
  const [userData, setUserData] = useState({
    name: accountLoginData.name,
    email: accountLoginData.email,
  });
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const textSecondary = colorScheme === 'dark' ? '#AAA' : '#666';
  const borderColor = colorScheme === 'dark' ? '#23242A' : '#E0E0E0';
  const accent = '#FFAC1C';

  const handleFeaturePress = (item: any) => {
    if (item.isExternal) {
      Linking.openURL(item.route);
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* User Info */}
      <View style={[styles.card, { backgroundColor: bgCard, borderColor }]}> 
        <Text style={[styles.name, { color: textPrimary }]}>Hello {userData.name}</Text>
      </View>
      {/* Features */}
      <View style={[styles.card, { backgroundColor: bgCard, borderColor }]}> 
        {features.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.featureRow, idx !== features.length - 1 && { borderBottomColor: borderColor, borderBottomWidth: 1 }]}
            activeOpacity={0.7}
            onPress={() => handleFeaturePress(item)}
          >
            <Ionicons name={item.icon as any} size={20} color={accent} style={{ marginRight: 16 }} />
            <Text style={[styles.featureLabel, { color: textPrimary }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={textSecondary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProfileHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 44,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  settingsIcon: {
    padding: 6,
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
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
    fontSize: 28,
    letterSpacing: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
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
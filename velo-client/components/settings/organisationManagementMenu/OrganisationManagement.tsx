import { Alert, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useLoginAccountStore from '@/store/loginAccountStore';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

const OrganisationManagement = () => {
  const { accountLoginData } = useLoginAccountStore();
  const colorScheme = useColorScheme();
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#23242A' : '#E0E0E0';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const textSecondary = colorScheme === 'dark' ? '#AAA' : '#666';
  const accent = '#FFAC1C';

  const handleManageTeam = () => {
    if (accountLoginData.modeOfWork === 'ORGANISATION' && accountLoginData.role === 'AGENT') {
      router.push('/(tabs)/profile/settings/manageOrg/manageTeam');
    } else {
      Alert.alert('Error', 'You are not authorised to access this page');
    }
  };
  const handlePricingOption = () => {
    if (accountLoginData.role === 'AGENT') {
      router.push('/profile/settings/manageOrg/managePricing');
    }
  };

  return (
    <ThemedView style={[styles.card, { backgroundColor: bgCard, borderColor }]}> 
      <ThemedText style={[styles.headerTitle, { color: textPrimary }]}>Organisation Management</ThemedText>
      {accountLoginData.role === 'AGENT' && accountLoginData.modeOfWork === 'ORGANISATION' && (
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colorScheme === 'dark' ? '#23242A' : '#F9FAFB', borderColor }]}
          onPress={handleManageTeam}
          activeOpacity={0.8}
        >
          <ThemedView style={styles.menuItemContent}>
            <Ionicons
              name="people-outline"
              size={22}
              color={accent}
              style={styles.icon}
            />
            <ThemedText style={[styles.menuItemText, { color: textPrimary }]}>Manage Team</ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={textSecondary}
              style={styles.chevronIcon}
            />
          </ThemedView>
        </TouchableOpacity>
      )}
      {accountLoginData.role === 'AGENT' && (
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colorScheme === 'dark' ? '#23242A' : '#F9FAFB', borderColor }]}
          onPress={handlePricingOption}
          activeOpacity={0.8}
        >
          <ThemedView style={styles.menuItemContent}>
            <Ionicons
              name="pricetag-outline"
              size={22}
              color={accent}
              style={styles.icon}
            />
            <ThemedText style={[styles.menuItemText, { color: textPrimary }]}>Manage Pricing and Timeline</ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={textSecondary}
              style={styles.chevronIcon}
            />
          </ThemedView>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};

export default OrganisationManagement;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    letterSpacing: 0.1,
  },
  menuItem: {
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  chevronIcon: {
    marginLeft: 10,
  },
});
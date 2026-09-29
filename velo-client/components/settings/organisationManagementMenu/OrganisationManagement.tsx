import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useLoginAccountStore from '@/store/loginAccountStore';
import React from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { AppText } from '@/components/AppText';

const OrganisationManagement = () => {
  const { accountLoginData } = useLoginAccountStore();
  const { colors, radius } = useAppTheme();

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
      {accountLoginData.role === 'AGENT' && accountLoginData.modeOfWork === 'ORGANISATION' && (
        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.borderSubtle }]}
          onPress={handleManageTeam}
          activeOpacity={0.65}
        >
          <AppText variant="bodyStrong" style={styles.rowText}>
            Manage Team
          </AppText>
          <AppText variant="h2" muted>
            ›
          </AppText>
        </TouchableOpacity>
      )}
      {accountLoginData.role === 'AGENT' && (
        <TouchableOpacity style={styles.row} onPress={handlePricingOption} activeOpacity={0.65}>
          <AppText variant="bodyStrong" style={styles.rowText}>
            Pricing & Timeline
          </AppText>
          <AppText variant="h2" muted>
            ›
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrganisationManagement;

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
  },
});

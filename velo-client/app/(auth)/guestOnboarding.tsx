import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { AuthScreen } from '@/components/forms/AuthScreen';
import { AppText } from '@/components/AppText';
import * as SecureStore from 'expo-secure-store';
import { resetTo } from '@/utils/resetNavigation';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

const GuestOnboarding = () => {
  const { colors, radius } = useAppTheme();
  const [busy, setBusy] = useState(false);

  const handleContinue = async () => {
    setBusy(true);
    await SecureStore.setItemAsync(
      'registerDetail',
      JSON.stringify({
        role: 'GUEST',
        registerVerificationStatus: 'GUEST',
      })
    );
    resetTo('/(tabs)/home/homeMainPage');
  };

  return (
    <AuthScreen
      title="Continue as guest"
      subtitle="You can browse the marketplace. Creating shipments and order history need a full account."
      footer={
        <>
          <CustomButton
            buttonText="Browse marketplace"
            handlePress={handleContinue}
            disableButton={busy}
          />
          <TouchableOpacity
            onPress={() => resetTo('/(auth)/chooseRole')}
            accessibilityRole="button"
            style={styles.linkBtn}
          >
            <AppText variant="link" color={colors.tint} style={styles.linkCenter}>
              Create an account instead
            </AppText>
          </TouchableOpacity>
        </>
      }
    >
      <View
        style={[
          styles.panel,
          { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
        ]}
      >
        <AppText variant="label" style={styles.panelTitle}>
          Included
        </AppText>
        <AppText variant="body" secondary>
          Browse listings and open product details.
        </AppText>
        <View style={[styles.rule, { backgroundColor: colors.borderSubtle }]} />
        <AppText variant="label" style={styles.panelTitle}>
          Not included
        </AppText>
        <AppText variant="body" secondary>
          Create shipments, order history, and account settings.
        </AppText>
      </View>
    </AuthScreen>
  );
};

export default GuestOnboarding;

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  panelTitle: {
    marginTop: Spacing.sm,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.md,
  },
  linkBtn: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  linkCenter: {
    textAlign: 'center',
  },
});

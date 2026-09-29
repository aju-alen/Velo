import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axiosInstance, { setAuthorizationHeader } from '@/constants/axiosHeader';
import useLoginAccountStore from '@/store/loginAccountStore';
import { resetTo } from '@/utils/resetNavigation';
import CustomButton from '@/components/CustomButton';
import StartOverButton from '@/components/StartOverButton';
import { AuthScreen } from '@/components/forms/AuthScreen';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

type VerificationUiStatus = 'pending' | 'approved' | 'rejected' | 'loading';

const AgentRestriction = () => {
  const { colors, radius } = useAppTheme();
  const { setAccountLoginData } = useLoginAccountStore();
  const [status, setStatus] = useState<VerificationUiStatus>('loading');

  const refreshStatus = useCallback(async () => {
    try {
      const raw = await SecureStore.getItemAsync('registerDetail');
      if (!raw) {
        setStatus('pending');
        return;
      }
      const account = JSON.parse(raw);
      const localStatus = account.registerVerificationStatus;

      if (localStatus === 'REJECTED') {
        setStatus('rejected');
        return;
      }
      if (localStatus === 'LOGGED_IN') {
        setStatus('approved');
        return;
      }

      if (account.token) {
        setAuthorizationHeader(account.token);
        const response = await axiosInstance.get('/api/auth/account-status');
        const freshStatus = response.data?.account?.registerVerificationStatus;
        if (freshStatus) {
          const updated = {
            ...account,
            registerVerificationStatus: freshStatus,
            organisationId: response.data.account.organisationId ?? account.organisationId,
            verificationDocumentUrl:
              response.data.account.verificationDocumentUrl ?? account.verificationDocumentUrl,
          };
          await SecureStore.setItemAsync('registerDetail', JSON.stringify(updated));
          setAccountLoginData({
            registerVerificationStatus: freshStatus,
            organisationId: updated.organisationId ?? '',
          });
          if (freshStatus === 'LOGGED_IN') {
            setStatus('approved');
            return;
          }
          if (freshStatus === 'REJECTED') {
            setStatus('rejected');
            return;
          }
        }
      }
      setStatus('pending');
    } catch (e) {
      console.warn('Could not refresh verification status', e);
      setStatus('pending');
    }
  }, [setAccountLoginData]);

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 15000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  if (status === 'loading') {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (status === 'approved') {
    return (
      <AuthScreen
        title="You’re approved"
        subtitle="Your logistics agent account is verified. You have full access."
        footer={
          <CustomButton
            buttonText="Open app"
            handlePress={() => resetTo('/(tabs)/home/homeMainPage')}
          />
        }
      >
        <StatusPanel label="Status" value="Approved" valueColor={colors.success} />
      </AuthScreen>
    );
  }

  if (status === 'rejected') {
    return (
      <AuthScreen
        title="Verification declined"
        subtitle="Your verification request was not approved. You can start over or contact support."
        footer={<StartOverButton />}
      >
        <StatusPanel label="Status" value="Rejected" valueColor={colors.danger} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Waiting for review"
      subtitle="Your appointment is booked. A super admin will approve or decline your account. This page refreshes automatically."
      footer={
        <>
          <CustomButton buttonText="Check status" handlePress={refreshStatus} />
          <CustomButton
            buttonText="Continue with limited access"
            handlePress={() => resetTo('/(tabs)/home/homeMainPage')}
          />
          <StartOverButton />
        </>
      }
    >
      <StatusPanel label="Status" value="Pending verification" />
    </AuthScreen>
  );
};

function StatusPanel({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  const { colors, radius } = useAppTheme();
  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
      ]}
    >
      <AppText variant="label">{label}</AppText>
      <AppText variant="h3" color={valueColor || colors.text}>
        {value}
      </AppText>
    </View>
  );
}

export default AgentRestriction;

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  panel: {
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
});

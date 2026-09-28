import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, useColorScheme, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import StartOverButton from '@/components/StartOverButton';
import * as SecureStore from 'expo-secure-store';
import axiosInstance, { setAuthorizationHeader } from '@/constants/axiosHeader';
import useLoginAccountStore from '@/store/loginAccountStore';

type VerificationUiStatus = 'pending' | 'approved' | 'rejected' | 'loading';

const AgentRestriction = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
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
      <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color="#FFAC1C" />
      </View>
    );
  }

  if (status === 'approved') {
    return (
      <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>Verification Approved</Text>
          <Text style={[styles.description, { color: themeColors.text }]}>
            Your logistic agent account has been approved. You now have full access to agent features.
          </Text>
          <View style={[styles.statusCard, styles.approvedCard]}>
            <Text style={[styles.statusTitle, { color: themeColors.text }]}>Current Status</Text>
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>Approved</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/home/homeMainPage')}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Continue to App</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (status === 'rejected') {
    return (
      <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>Verification Not Approved</Text>
          <Text style={[styles.description, { color: themeColors.text }]}>
            Your verification request was declined. You can start registration over or contact support for help.
          </Text>
          <View style={[styles.statusCard, styles.rejectedCard]}>
            <Text style={[styles.statusTitle, { color: themeColors.text }]}>Current Status</Text>
            <Text style={[styles.statusText, { color: '#F44336' }]}>Rejected</Text>
          </View>
          <StartOverButton />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Appointment Scheduled!
        </Text>
        <Text style={[styles.description, { color: themeColors.text }]}>
          Your appointment is booked. A super administrator will review your documents and approve or reject your account. This screen refreshes automatically.
        </Text>
        <View style={styles.statusCard}>
          <Text style={[styles.statusTitle, { color: themeColors.text }]}>Current Status</Text>
          <Text style={[styles.statusText, { color: themeColors.text }]}>Pending Verification</Text>
        </View>
        <TouchableOpacity
          onPress={refreshStatus}
          style={[styles.buttonContainer, styles.secondaryButton]}
        >
          <Text style={styles.buttonText}>Check Status Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home/homeMainPage')}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>
            Continue with Limited Access
          </Text>
        </TouchableOpacity>
        <StartOverButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statusCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  approvedCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  rejectedCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.12)',
  },
  statusTitle: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#FFAC1C',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AgentRestriction;

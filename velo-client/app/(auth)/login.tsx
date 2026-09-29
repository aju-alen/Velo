import React, { useState } from 'react';
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';
import CustomButton from '@/components/CustomButton';
import { FormField } from '@/components/forms/FormField';
import { AppText } from '@/components/AppText';
import { router } from 'expo-router';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import * as SecureStore from 'expo-secure-store';
import useLoginAccountStore from '@/store/loginAccountStore';
import { resetTo } from '@/utils/resetNavigation';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

const Login = () => {
  const { setAccountLoginData } = useLoginAccountStore();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const checkIfAlreadyRegistered = await axios.post(`${ipURL}/api/auth/login`, {
        email,
        password,
      });

      const account = checkIfAlreadyRegistered.data.accountExists;
      setAccountLoginData({
        id: account.id,
        mobileCode: account.mobileCode,
        mobileCountry: account.mobileCountry,
        mobileNumber: account.mobileNumber,
        email: account.email,
        name: account.name,
        password: account.password,
        registerVerificationStatus: account.registerVerificationStatus,
        role: account.role,
        updatedAt: account.updatedAt,
        token: account.token,
        modeOfWork: account.modeOfWork ? account.modeOfWork : null,
        organisationId: account.organisationId ? account.organisationId : '',
      });

      await SecureStore.setItemAsync('registerDetail', JSON.stringify(account));

      if (account.registerVerificationStatus === 'PARTIAL' && account.role === 'AGENT') {
        resetTo(
          account.verificationDocumentUrl
            ? '/(auth)/finalRegisterForm'
            : '/(auth)/verifyAgent'
        );
      } else if (
        (account.registerVerificationStatus === 'APPOINTMENT_BOOKED' ||
          account.registerVerificationStatus === 'REJECTED') &&
        account.role === 'AGENT'
      ) {
        resetTo('/(auth)/agentRestriction');
      } else if (
        account.registerVerificationStatus === 'LOGGED_IN' &&
        (account.role === 'AGENT' || account.role === 'USER' || account.role === 'SUB_AGENT')
      ) {
        resetTo('/(tabs)/home/homeMainPage');
      } else if (account.registerVerificationStatus === 'PARTIAL' && account.role === 'USER') {
        resetTo('/(auth)/finalRegisterForm');
      } else if (
        account.registerVerificationStatus === 'SUPERADMINLOGGEDIN' &&
        account.role === 'SUPERADMIN'
      ) {
        resetTo('/(tabs)/home/homeMainPage');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
      setLoading(false);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'An error occurred. Please try again.';
      Alert.alert('Error', errorMessage);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="display" color={colors.tint} style={styles.brand}>
          Velo
        </AppText>
        <AppText variant="h1" style={styles.title}>
          Welcome back
        </AppText>
        <AppText variant="body" secondary style={styles.subtitle}>
          Sign in to continue shipping.
        </AppText>

        <View style={styles.form}>
          <FormField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <FormField
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightSlot={
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <AppText variant="label" color={colors.tint}>
                  {showPassword ? 'Hide' : 'Show'}
                </AppText>
              </TouchableOpacity>
            }
          />

          <TouchableWithoutFeedback onPress={() => router.push('/(auth)/forgotPassword')}>
            <AppText variant="link" color={colors.tint} style={styles.forgot}>
              Forgot password?
            </AppText>
          </TouchableWithoutFeedback>

          <CustomButton buttonText="Sign in" handlePress={handleLogin} disableButton={loading} />

          <View style={styles.signupRow}>
            <AppText variant="bodySmall" muted>
              Don’t have an account?{' '}
            </AppText>
            <TouchableWithoutFeedback onPress={() => router.replace('/(auth)/chooseRole')}>
              <AppText variant="link" color={colors.tint}>
                Sign up
              </AppText>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl * 2,
    paddingBottom: Spacing.xxxl,
  },
  brand: { marginBottom: Spacing.lg },
  title: { marginBottom: Spacing.sm },
  subtitle: { marginBottom: Spacing.xxxl },
  form: { gap: Spacing.lg },
  forgot: { alignSelf: 'flex-end', marginTop: -Spacing.sm },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});

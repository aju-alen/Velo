import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomButton from '@/components/CustomButton';
import StartOverButton from '@/components/StartOverButton';
import { AuthScreen } from '@/components/forms/AuthScreen';
import { FormField } from '@/components/forms/FormField';
import { AppText } from '@/components/AppText';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import useLoginAccountStore from '@/store/loginAccountStore';
import { destinationForStoredAccount } from '@/utils/accountDestination';
import { resetTo } from '@/utils/resetNavigation';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AGENT_REG_STEPS, SENDER_REG_STEPS } from '@/constants/flowSteps';

const Register = () => {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  const roleParam = params.role;
  const role = Array.isArray(roleParam) ? roleParam[0] : roleParam;
  const isAgent = role === 'AGENT';
  const steps = isAgent ? AGENT_REG_STEPS : SENDER_REG_STEPS;
  const { setAccountLoginData } = useLoginAccountStore();
  const [checkingAccount, setCheckingAccount] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setreEnterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    reEnterPassword: '',
  });

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value: string) => value.length >= 8;

  useEffect(() => {
    let active = true;
    const openExistingAccount = async () => {
      try {
        const stored = await SecureStore.getItemAsync('registerDetail');
        if (!stored) {
          if (active) setCheckingAccount(false);
          return;
        }
        const userData = JSON.parse(stored);
        const destination = destinationForStoredAccount(userData);
        if (!destination) {
          if (active) setCheckingAccount(false);
          return;
        }
        setAccountLoginData(userData);
        resetTo(destination as any);
      } catch {
        if (active) setCheckingAccount(false);
      }
    };
    openExistingAccount();
    return () => {
      active = false;
    };
  }, [setAccountLoginData]);

  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck || !validateEmail(emailToCheck)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }));
      return;
    }
    setEmailVerifying(true);
    try {
      const response = await axios.get(`${ipURL}/api/auth/check-email`, {
        params: { email: emailToCheck },
      });
      if (response.data.exists) {
        setErrors((prev) => ({
          ...prev,
          email: 'This email is already registered. Sign in instead.',
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    } catch {
      // ignore network check failures
    } finally {
      setEmailVerifying(false);
    }
  };

  const validateForm = () => {
    const next = { name: '', email: '', password: '', reEnterPassword: '' };
    let ok = true;
    if (name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters';
      ok = false;
    }
    if (!validateEmail(email)) {
      next.email = 'Enter a valid email address';
      ok = false;
    }
    if (!validatePassword(password)) {
      next.password = 'Password must be at least 8 characters';
      ok = false;
    }
    if (password !== reEnterPassword) {
      next.reEnterPassword = 'Passwords do not match';
      ok = false;
    }
    setErrors(next);
    return ok;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setButtonLoading(true);
    await SecureStore.setItemAsync(
      'tempRegister',
      JSON.stringify({ name, email, password, role })
    );
    router.replace('/(auth)/mobileInput');
    setButtonLoading(false);
  };

  if (checkingAccount) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <AuthScreen
      title={isAgent ? 'Create agent account' : 'Create sender account'}
      subtitle="We’ll use this to secure your account and reach you about shipments."
      step={1}
      total={steps.length}
      stepLabel={steps[0].label}
      footer={
        <>
          <CustomButton
            disableButton={buttonLoading || emailVerifying}
            buttonText="Continue"
            handlePress={handleRegister}
          />
          <StartOverButton />
        </>
      }
    >
      <FormField
        label="Full name"
        placeholder="Your name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setErrors((prev) => ({ ...prev, name: '' }));
        }}
        error={errors.name}
        autoComplete="name"
        autoCapitalize="words"
      />
      <FormField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: '' }));
        }}
        onBlur={() => checkEmailExists(email)}
        error={errors.email}
        hint={emailVerifying ? 'Checking availability…' : undefined}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <FormField
        label="Password"
        placeholder="At least 8 characters"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({
            ...prev,
            password: text && text.length < 8 ? 'Password must be at least 8 characters' : '',
            reEnterPassword:
              reEnterPassword && text !== reEnterPassword ? 'Passwords do not match' : '',
          }));
        }}
        error={errors.password}
        secureTextEntry={!showPassword}
        rightSlot={
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            hitSlop={8}
          >
            <AppText variant="label" color={colors.tint}>
              {showPassword ? 'Hide' : 'Show'}
            </AppText>
          </TouchableOpacity>
        }
      />
      <FormField
        label="Confirm password"
        placeholder="Re-enter password"
        value={reEnterPassword}
        onChangeText={(text) => {
          setreEnterPassword(text);
          setErrors((prev) => ({
            ...prev,
            reEnterPassword: text && password !== text ? 'Passwords do not match' : '',
          }));
        }}
        error={errors.reEnterPassword}
        secureTextEntry={!showPassword}
      />
    </AuthScreen>
  );
};

export default Register;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

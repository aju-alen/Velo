import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { OtpInput } from 'react-native-otp-entry';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '@/components/CustomButton';
import StartOverButton from '@/components/StartOverButton';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { AuthScreen } from '@/components/forms/AuthScreen';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { AGENT_REG_STEPS, SENDER_REG_STEPS } from '@/constants/flowSteps';

const OtpInputs = () => {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  const { verfication_id } = params;

  const [phoneNumber, setPhoneNumber] = useState({ mobile: '', code: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAgent = userDetails?.role === 'AGENT';
  const steps = isAgent ? AGENT_REG_STEPS : SENDER_REG_STEPS;

  useEffect(() => {
    const load = async () => {
      const secureMobile = await SecureStore.getItemAsync('tempMobile');
      const secureUser = await SecureStore.getItemAsync('tempRegister');
      if (secureMobile) setPhoneNumber(JSON.parse(secureMobile));
      if (secureUser) setUserDetails(JSON.parse(secureUser));
    };
    load();
  }, []);

  const handleVerifyNumber = async (code: string) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const resp = await axios.post('https://api.smsala.com/api/VerifyStatus', {
        verfication_id,
        verfication_code: code,
      });

      if (resp.data.status === 'V') {
        const formData = { ...userDetails, ...phoneNumber };
        const saveUserToDB = await axios.post(`${ipURL}/api/auth/register`, formData);
        await SecureStore.deleteItemAsync('tempRegister');
        await SecureStore.deleteItemAsync('tempMobile');
        await SecureStore.setItemAsync(
          'registerDetail',
          JSON.stringify(saveUserToDB.data.userDetails)
        );
        if (saveUserToDB.data.userDetails.role === 'AGENT') {
          router.replace('/(auth)/verifyAgent');
        } else {
          router.replace('/(auth)/finalRegisterForm');
        }
      } else {
        setErrorMessage('Invalid code. Please try again.');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="Enter verification code"
      subtitle={`We sent a code to ${phoneNumber.code} ${phoneNumber.mobile}.`}
      step={2}
      total={steps.length}
      stepLabel={steps[1].label}
      footer={
        <>
          <CustomButton
            buttonText={loading ? 'Verifying…' : 'Verify'}
            handlePress={() => handleVerifyNumber(otp)}
            disableButton={loading || otp.length < 4}
          />
          <StartOverButton />
        </>
      }
    >
      <View style={styles.otpWrap} accessibilityLabel="One time password input">
        <OtpInput
          numberOfDigits={4}
          onTextChange={(value) => {
            setOtp(value);
            if (value.length === 4) handleVerifyNumber(value);
          }}
          theme={{
            pinCodeContainerStyle: {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
            focusedPinCodeContainerStyle: {
              borderColor: colors.tint,
            },
            pinCodeTextStyle: { color: colors.text },
          }}
        />
      </View>
      {loading ? <ActivityIndicator color={colors.tint} /> : null}
      {errorMessage ? (
        <AppText variant="bodySmall" color={colors.danger}>
          {errorMessage}
        </AppText>
      ) : null}
    </AuthScreen>
  );
};

export default OtpInputs;

const styles = StyleSheet.create({
  otpWrap: {
    marginTop: Spacing.md,
  },
});

import React, { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  TextInput, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView,
  Alert,
  View,
  Text,
  useColorScheme,
  TouchableWithoutFeedback
} from 'react-native';
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { OtpInput } from 'react-native-otp-entry';

const ResetPassword = () => {
  const params = useLocalSearchParams();
  const email = params.email as string || '';
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  useEffect(() => {
    if (!email) {
      Alert.alert('Error', 'Email is required', [
        { text: 'OK', onPress: () => router.replace('/(auth)/forgotPassword') }
      ]);
    }
  }, [email]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${ipURL}/api/auth/verify-reset-otp`, {
        email: email,
        otp: otp
      });
      
      setVerificationToken(response.data.verificationToken);
      setOtpVerified(true);
      Alert.alert('Success', 'OTP verified successfully. Please enter your new password.');
    } catch (err: any) {
      console.log(err, 'error--');
      const errorMessage = err?.response?.data?.message || err?.message || 'Invalid or expired OTP. Please try again.';
      Alert.alert('Error', errorMessage);
      setOtp('');
    } finally {
      setLoading(false);
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!verificationToken) {
      Alert.alert('Error', 'Please verify OTP first');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${ipURL}/api/auth/reset-password`, {
        email: email,
        verificationToken: verificationToken,
        newPassword: newPassword
      });
      
      Alert.alert(
        'Success',
        'Your password has been reset successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      );
    } catch (err: any) {
      console.log(err, 'error--');
      const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.logoText, { color: '#FFAC1C' }]}>Velo</Text>
            <Text style={[styles.welcomeText, { color: themeColors.text }]}>Reset Password</Text>
            <Text style={[styles.subtitleText, { color: themeColors.text }]}>
              {otpVerified 
                ? 'Enter your new password below.'
                : 'Enter the 6-digit OTP sent to your email.'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {!otpVerified ? (
              <>
                <View style={styles.otpContainer}>
                  <OtpInput
                    numberOfDigits={6}
                    onTextChange={(text) => {
                      setOtp(text);
                      if (text.length === 6) {
                        handleVerifyOTP();
                      }
                    }}
                    focusColor="#FFAC1C"
                    focusStickBlinkingDuration={400}
                    theme={{
                      pinCodeContainerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#23242A' : '#f9f9f9',
                        width: horizontalScale(50),
                        height: verticalScale(50),
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colorScheme === 'dark' ? '#333' : '#d3d3d3',
                      },
                    }}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <CustomButton 
                    buttonText='Verify OTP' 
                    buttonWidth={horizontalScale(300)} 
                    handlePress={handleVerifyOTP}
                    disableButton={loading || otp.length !== 6}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: themeColors.text }]}>New Password</Text>
                  <View style={[styles.inputWrapper, { borderColor: themeColors.text }]}>
                    <MaterialIcons name="lock" size={20} color="gray" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Enter new password"
                      placeholderTextColor="gray"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showPassword}
                      style={[styles.input, { flex: 1, color: themeColors.text }]}
                    />
                    <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                      <MaterialIcons 
                        name={showPassword ? "visibility" : "visibility-off"} 
                        size={20} 
                        color="gray" 
                      />
                    </TouchableWithoutFeedback>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: themeColors.text }]}>Confirm Password</Text>
                  <View style={[styles.inputWrapper, { borderColor: themeColors.text }]}>
                    <MaterialIcons name="lock" size={20} color="gray" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Confirm new password"
                      placeholderTextColor="gray"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      style={[styles.input, { flex: 1, color: themeColors.text }]}
                    />
                    <TouchableWithoutFeedback onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <MaterialIcons 
                        name={showConfirmPassword ? "visibility" : "visibility-off"} 
                        size={20} 
                        color="gray" 
                      />
                    </TouchableWithoutFeedback>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <CustomButton 
                    buttonText='Reset Password' 
                    buttonWidth={horizontalScale(300)} 
                    handlePress={handleResetPassword}
                    disableButton={loading}
                  />
                </View>
              </>
            )}

            <View style={styles.backContainer}>
              <TouchableWithoutFeedback onPress={() => router.back()}>
                <Text style={[styles.backText, { color: themeColors.text }]}>Back</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ResetPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    marginTop: verticalScale(60),
  },
  logoText: {
    fontSize: moderateScale(40),
    lineHeight: moderateScale(56),
    fontWeight: 'bold',
    marginBottom: verticalScale(16),
  },
  welcomeText: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(28),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  subtitleText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    color: 'gray',
    marginBottom: verticalScale(8),
  },
  formContainer: {
    marginTop: verticalScale(40),
  },
  otpContainer: {
    width: '100%',
    marginBottom: verticalScale(24),
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    marginBottom: verticalScale(8),
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    height: verticalScale(48),
  },
  inputIcon: {
    marginRight: horizontalScale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(24),
  },
  backContainer: {
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  backText: {
    fontSize: moderateScale(14),
    color: '#FFAC1C',
  },
});

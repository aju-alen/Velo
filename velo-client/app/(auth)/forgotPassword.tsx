import React, { useState } from 'react'
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
import { router } from 'expo-router';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${ipURL}/api/auth/forgot-password`, {
        email: email
      });
      
      Alert.alert(
        'Success',
        'If an account with this email exists, a password reset OTP has been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/(auth)/resetPassword',
              params: { email: email }
            })
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
            <Text style={[styles.welcomeText, { color: themeColors.text }]}>Forgot Password?</Text>
            <Text style={[styles.subtitleText, { color: themeColors.text }]}>
              Enter your email address and we'll send you an OTP to reset your password.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: themeColors.text }]}>Email</Text>
              <View style={[styles.inputWrapper, { borderColor: themeColors.text }]}>
                <MaterialIcons name="email" size={20} color="gray" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="gray"
                  value={email}
                  autoCapitalize='none'
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoComplete='email'
                  style={[styles.input, { color: themeColors.text }]}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton 
                buttonText='Send OTP' 
                buttonWidth={horizontalScale(300)} 
                handlePress={handleSendOTP}
                disableButton={loading}
              />
            </View>

            <View style={styles.backContainer}>
              <TouchableWithoutFeedback onPress={() => router.back()}>
                <Text style={[styles.backText, { color: themeColors.text }]}>Back to Login</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ForgotPassword

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
  },
  formContainer: {
    marginTop: verticalScale(40),
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

import React, { useState } from 'react'
import { StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, View, Text, useColorScheme } from 'react-native';
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { Colors } from '@/constants/Colors';

const Register = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const params = useLocalSearchParams();
  const { role } = params;
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reEnterPassword, setreEnterPassword] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)
  
  // Add error states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    reEnterPassword: ''
  })
  
  // Add loading state for email verification
  const [emailVerifying, setEmailVerifying] = useState(false)

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8
  }

  // Email verification function
  const checkEmailExists = async (emailToCheck) => {
    if (!emailToCheck || !validateEmail(emailToCheck)) {
      setErrors(prev => ({...prev, email: 'Please enter a valid email'}))
      return
    }
    
    setEmailVerifying(true)
    try {
      const response = await axios.get(`${ipURL}/api/auth/check-email`, {
        params: { email: emailToCheck }
      })
      
      if (response.data.exists) {
        setErrors(prev => ({...prev, email: 'This email is already registered. Please use a different email or login.'}))
      } else {
        setErrors(prev => ({...prev, email: ''}))
      }
    } catch (error) {
      console.error('Error checking email:', error)
      // Don't show error to user for API failures, just log it
    } finally {
      setEmailVerifying(false)
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: '',
      email: '',
      password: '',
      reEnterPassword: ''
    }

    // Name validation
    if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
      isValid = false
    }

    // Email validation
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
      isValid = false
    }

    // Password validation
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters'
      isValid = false
    }

    // Re-enter password validation
    if (password !== reEnterPassword) {
      newErrors.reEnterPassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }
  
  // Check if form is valid and ready to submit
  const isFormValid = () => {
    return (
      name.trim().length >= 2 &&
      validateEmail(email) &&
      validatePassword(password) &&
      password === reEnterPassword &&
      Object.values(errors).every(error => error === '') &&
      !emailVerifying
    )
  }

  const handleRegister = async () => {
    if (validateForm()) {
      setButtonLoading(true)
      await SecureStore.setItemAsync('tempRegister', JSON.stringify({
        name,
        email,
        password,
        role
      }))
      router.replace('/(auth)/mobileInput')
      setButtonLoading(false)
    }
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              <Text style={[styles.logoText, { color: themeColors.text }]}>Velo</Text>
              <Text style={[styles.subheading, { color: themeColors.text }]}>
                {role === "USER" ? "User" : "Agent"} Registration
              </Text>
            </View>

            <View style={styles.formContainer}>
              <InputField
                label="Name"
                placeholder="Enter Your Name"
                value={name}
                onChangeText={(text) => {
                  setName(text)
                  setErrors(prev => ({...prev, name: ''}))
                }}
                error={errors.name}
                autoComplete='name'
                keyboardType='default'
                colorScheme={colorScheme}
                themeColors={themeColors}
              />

              <InputField
                label="Email"
                placeholder="Enter Your Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  setErrors(prev => ({...prev, email: ''}))
                }}
                onBlur={() => checkEmailExists(email)}
                error={errors.email}
                autoCapitalize='none'
                keyboardType='email-address'
                autoComplete='email'
                loading={emailVerifying}
                colorScheme={colorScheme}
                themeColors={themeColors}
              />

              <InputField
                label="Password"
                placeholder="Enter Your Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  if (text && text.length < 8) {
                    setErrors(prev => ({...prev, password: 'Password must be at least 8 characters'}))
                  } else {
                    setErrors(prev => ({...prev, password: ''}))
                  }
                  // Also check password confirmation
                  if (reEnterPassword && text !== reEnterPassword) {
                    setErrors(prev => ({...prev, reEnterPassword: 'Passwords do not match'}))
                  } else if (reEnterPassword) {
                    setErrors(prev => ({...prev, reEnterPassword: ''}))
                  }
                }}
                onBlur={() => {
                  if (password && password.length < 8) {
                    setErrors(prev => ({...prev, password: 'Password must be at least 8 characters'}))
                  }
                }}
                error={errors.password}
                secureTextEntry
                colorScheme={colorScheme}
                themeColors={themeColors}
              />

              <InputField
                label="Re-Enter Password"
                placeholder="Re-Enter Your Password"
                value={reEnterPassword}
                onChangeText={(text) => {
                  setreEnterPassword(text)
                  if (text && password !== text) {
                    setErrors(prev => ({...prev, reEnterPassword: 'Passwords do not match'}))
                  } else {
                    setErrors(prev => ({...prev, reEnterPassword: ''}))
                  }
                }}
                onBlur={() => {
                  if (reEnterPassword && password !== reEnterPassword) {
                    setErrors(prev => ({...prev, reEnterPassword: 'Passwords do not match'}))
                  }
                }}
                error={errors.reEnterPassword}
                secureTextEntry
                colorScheme={colorScheme}
                themeColors={themeColors}
              />

              <View style={styles.buttonWrapper}>
                <CustomButton 
                  disableButton={buttonLoading }
                  buttonText='Register'
                  handlePress={handleRegister}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

// Enhanced Input Field Component with error handling
const InputField = ({ label, error, loading = false, colorScheme, themeColors, ...props }) => (
  <View style={styles.inputContainer}>
    <View style={styles.labelContainer}>
      <Text style={[styles.inputLabel, { color: themeColors.text }]}>{label}</Text>
      {loading && (
        <Text style={styles.loadingText}>Checking...</Text>
      )}
    </View>
    <View style={[
      styles.inputWrapper,
      { borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
      error && styles.inputWrapperError
    ]}>
      <TextInput
        {...props}
        placeholderTextColor="rgba(128, 128, 128, 0.6)"
        keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
        style={[styles.input, { color: themeColors.text }]}
      />
    </View>
    {error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
mainContainer: {
  flex: 1,
  paddingTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(40),
  paddingHorizontal: horizontalScale(24),
},
headerContainer: {
  alignItems: 'center',
  marginBottom: verticalScale(40),
},
inputWrapper: {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: moderateScale(12),
  borderWidth: 1,
  
  overflow: 'hidden',
  height: verticalScale(52),
},
inputWrapperError: {
  borderColor: '#FF6B6B', // Error color
  borderWidth: 1,
},
errorText: {
  color: '#FF6B6B',
  fontSize: moderateScale(12),
  marginTop: verticalScale(4),
  marginLeft: horizontalScale(4),
},
input: {
  flex: 1,
  paddingHorizontal: horizontalScale(16),
  fontSize: moderateScale(16),
  height: '100%',
},
logoText: {
  fontSize: moderateScale(42),
  marginBottom: verticalScale(16),
},
subheading: {
  fontSize: moderateScale(24),
  opacity: 0.9,
},
formContainer: {
  paddingHorizontal: horizontalScale(8),
},
inputContainer: {
  marginBottom: verticalScale(20),
},
inputLabel: {
  fontSize: moderateScale(14),
  marginBottom: verticalScale(8),
  letterSpacing: 0.5,
  opacity: 0.9,
},

buttonWrapper: {
  marginTop: verticalScale(32),
  alignItems: 'center',
  paddingBottom: verticalScale(20),
},
labelContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: verticalScale(8),
},
loadingText: {
  fontSize: moderateScale(12),
  color: '#4CAF50',
  fontStyle: 'italic',
},
});

export default Register;
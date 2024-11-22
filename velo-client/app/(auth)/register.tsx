import React, { useState } from 'react'
import { StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '@/hooks/useColorScheme';


const Register = () => {

  const params = useLocalSearchParams();
  const { role } = params;
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reEnterPassword, setreEnterPassword] = useState('')
  
  // Add error states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    reEnterPassword: ''
  })

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8
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
  
  const handleRegister = async () => {
    if (validateForm()) {
      await SecureStore.setItemAsync('tempRegister', JSON.stringify({
        name,
        email,
        password,
        role
      }))
      router.replace('/mobileInput')
    }
  }

  return (
    <ThemedView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedView style={styles.headerContainer}>
              <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText>
              <ThemedText type='subtitle' style={styles.subheading}>
                {role === "USER" ? "User" : "Agent"} Registration
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.formContainer}>
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
              />

              <InputField
                label="Email"
                placeholder="Enter Your Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  setErrors(prev => ({...prev, email: ''}))
                }}
                error={errors.email}
                autoCapitalize='none'
                keyboardType='email-address'
                autoComplete='email'
              />

              <InputField
                label="Password"
                placeholder="Enter Your Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setErrors(prev => ({...prev, password: ''}))
                }}
                error={errors.password}
                secureTextEntry
              />

              <InputField
                label="Re-Enter Password"
                placeholder="Re-Enter Your Password"
                value={reEnterPassword}
                onChangeText={(text) => {
                  setreEnterPassword(text)
                  setErrors(prev => ({...prev, reEnterPassword: ''}))
                }}
                error={errors.reEnterPassword}
                secureTextEntry
              />

              <ThemedView style={styles.buttonWrapper}>
                <CustomButton 
                  disableButton={!name || !email || !password || !reEnterPassword}
                  buttonText='Register'
                  handlePress={handleRegister}
                />
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

// Enhanced Input Field Component with error handling
const InputField = ({ label, error, ...props }) => (
  <ThemedView style={styles.inputContainer}>
    <ThemedText type='default' style={styles.inputLabel}>{label}</ThemedText>
    <ThemedView style={[
      styles.inputWrapper,{borderColor: useColorScheme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'},
      error && styles.inputWrapperError
    ]}>
      <TextInput
        {...props}
        placeholderTextColor="rgba(128, 128, 128, 0.6)"
        keyboardAppearance='dark'
        style={styles.input}
      />
    </ThemedView>
    {error ? (
      <ThemedText style={styles.errorText}>{error}</ThemedText>
    ) : null}
  </ThemedView>
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
  color: '#666',
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
});

export default Register;
import React, { useState } from 'react'
import { 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Platform, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
  Keyboard,
  Dimensions 
} from 'react-native';
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import * as SecureStore from 'expo-secure-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useLoginAccountStore from '@/store/loginAccountStore';


const Login = () => {
  const { setAccountLoginData } = useLoginAccountStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async() => {
    try {
      const formData = {
        email: email,
        password: password
      }
      const checkIfAlreadyRegistered = await axios.post(`${ipURL}/api/auth/login`, formData);
      setAccountLoginData(checkIfAlreadyRegistered.data.accountExists)
      
      if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "PARTIAL" && checkIfAlreadyRegistered.data.accountExists.role === "AGENT") {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.push('/verifyAgent')
      }
      else if(checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "APPOINTMENT_BOOKED" && checkIfAlreadyRegistered.data.accountExists.role === "AGENT" ){
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.push('/(tabs)/home')
      }
      else if(checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "LOGGED_IN" && checkIfAlreadyRegistered.data.accountExists.role === "AGENT" ){
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.push('/(tabs)/home')
      }
      else if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "PARTIAL" && checkIfAlreadyRegistered.data.accountExists.role === "USER" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.push('/(auth)/finalRegisterForm')
      }
      else if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "LOGGED_IN" && checkIfAlreadyRegistered.data.accountExists.role === "USER" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.push('/(tabs)/home')
      }
    }
    catch(err) {
      console.log(err, 'error--');
      alert(`${err.response.data.message}`)
    }
  }

  return (
    <ThemedView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
       
          <ThemedView style={styles.headerContainer}>
            <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText>
            <ThemedText type='subtitle' style={styles.welcomeText}>Welcome back!</ThemedText>
            <ThemedText style={styles.subtitleText}>Please sign in to continue</ThemedText>
          </ThemedView>

          <ThemedView style={styles.formContainer}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText type='default' style={styles.label}>Email</ThemedText>
              <ThemedView style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color="gray" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="gray"
                  value={email}
                  autoCapitalize='none'
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoComplete='email'
                  style={styles.input}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText type='default' style={styles.label}>Password</ThemedText>
              <ThemedView style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color="gray" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="gray"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { flex: 1 }]}
                />
                <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="gray" 
                  />
                </TouchableWithoutFeedback>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.forgotPasswordContainer}>
              <TouchableWithoutFeedback onPress={() => console.log('Forgot password')}>
                <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
              </TouchableWithoutFeedback>
            </ThemedView>

            <ThemedView style={styles.buttonContainer}>
              <CustomButton 
                buttonText='Sign In' 
                buttonWidth={horizontalScale(300)} 
                handlePress={handleLogin}
              />
            </ThemedView>

            <ThemedView style={styles.signupContainer}>
              <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
              <TouchableWithoutFeedback onPress={() => router.push('/(auth)/chooseRole')}>
                <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
              </TouchableWithoutFeedback>
            </ThemedView>
          </ThemedView>
    </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  scrollContainer: {

    paddingHorizontal: horizontalScale(24),
  },
  headerContainer: {
    marginTop: verticalScale(60),
    
  },
  logoText: {
    fontSize: moderateScale(32),
    marginBottom: verticalScale(16),
  },
  welcomeText: {
    fontSize: moderateScale(24),
    marginBottom: verticalScale(8),
  },
  subtitleText: {
    fontSize: moderateScale(16),
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

    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
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
    color: '#666',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: verticalScale(24),
  },
  forgotPasswordText: {
    color: '#FFAC1C',
    fontSize: moderateScale(14),
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: moderateScale(14),
    color: 'gray',
  },
  signupLink: {
    fontSize: moderateScale(14),
    color: '#FFAC1C',
    fontWeight: '600',
  },
});
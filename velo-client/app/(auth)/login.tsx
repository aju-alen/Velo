import React, { useState } from 'react'
import { 
  StyleSheet, 
  TextInput, 
  Platform, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback,
  Alert,
  View,
  Text,
  useColorScheme
} from 'react-native';
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import * as SecureStore from 'expo-secure-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useLoginAccountStore from '@/store/loginAccountStore';
import { Colors } from '@/constants/Colors';


const Login = () => {
  const { setAccountLoginData } = useLoginAccountStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const handleLogin = async() => {
    try {
      setLoading(true)
      const formData = {
        email: email,
        password: password
      }
      const checkIfAlreadyRegistered = await axios.post(`${ipURL}/api/auth/login`, formData);
      console.log(checkIfAlreadyRegistered.data, 'checkIfAlreadyRegistered');
      
      setAccountLoginData({
        id: checkIfAlreadyRegistered.data.accountExists.id,
        mobileCode: checkIfAlreadyRegistered.data.accountExists.mobileCode,
        mobileCountry: checkIfAlreadyRegistered.data.accountExists.mobileCountry,
        mobileNumber: checkIfAlreadyRegistered.data.accountExists.mobileNumber,
        name: checkIfAlreadyRegistered.data.accountExists.name,
        password: checkIfAlreadyRegistered.data.accountExists.password,
        registerVerificationStatus: checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus,
        role: checkIfAlreadyRegistered.data.accountExists.role,
        updatedAt: checkIfAlreadyRegistered.data.accountExists.updatedAt,
        token: checkIfAlreadyRegistered.data.accountExists.token,
        modeOfWork: checkIfAlreadyRegistered.data.accountExists.modeOfWork? checkIfAlreadyRegistered.data.accountExists.modeOfWork : null,
        organisationId: checkIfAlreadyRegistered.data.accountExists.organisationId? checkIfAlreadyRegistered.data.accountExists.organisationId : '',
      })
      
      if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "PARTIAL" && checkIfAlreadyRegistered.data.accountExists.role === "AGENT") {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/verifyAgent')
      }
      else if(checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "APPOINTMENT_BOOKED" && checkIfAlreadyRegistered.data.accountExists.role === "AGENT" ){
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/(tabs)/home/homeMainPage')
      }
      else if(checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "LOGGED_IN" && checkIfAlreadyRegistered.data.accountExists.role === "AGENT" ){
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/(tabs)/home/homeMainPage')
      }
      else if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "PARTIAL" && checkIfAlreadyRegistered.data.accountExists.role === "USER" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/(auth)/finalRegisterForm')
      }
      else if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "LOGGED_IN" && checkIfAlreadyRegistered.data.accountExists.role === "USER" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/(tabs)/home/homeMainPage')
      }
      else if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "SUPERADMINLOGGEDIN" && checkIfAlreadyRegistered.data.accountExists.role === "SUPERADMIN" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/(tabs)/home/homeMainPage')
      }
      else if (checkIfAlreadyRegistered.data.accountExists.registerVerificationStatus === "LOGGED_IN" && checkIfAlreadyRegistered.data.accountExists.role === "SUB_AGENT" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/(tabs)/home/homeMainPage')
      }
      else {
        Alert.alert('Error', 'Something went wrong')
      }
      setLoading(false)
    }
    catch(err) {
      console.log(err, 'error--');
      alert(`${err.response.data.message}`)
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
       
          <View style={styles.headerContainer}>
            <Text style={[styles.logoText, { color: '#FFAC1C' }]}>Velo</Text>
            <Text style={[styles.welcomeText, { color: themeColors.text }]}>Welcome back!</Text>
            <Text style={[styles.subtitleText, { color: themeColors.text }]}>Please sign in to continue</Text>
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

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: themeColors.text }]}>Password</Text>
              <View style={[styles.inputWrapper, { borderColor: themeColors.text }]}>
                <MaterialIcons name="lock" size={20} color="gray" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="gray"
                  value={password}
                  onChangeText={setPassword}
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

            <View style={styles.forgotPasswordContainer}>
              <TouchableWithoutFeedback onPress={() => console.log('Forgot password')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton 
                buttonText='Sign In' 
                buttonWidth={horizontalScale(300)} 
                handlePress={handleLogin}
                disableButton={loading}
              />
            </View>

            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: themeColors.text }]}>Don't have an account? </Text>
              <TouchableWithoutFeedback onPress={() => router.push('/(auth)/chooseRole')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
    </KeyboardAvoidingView>
    </View>
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
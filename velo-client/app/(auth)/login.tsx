import React, { useState, useRef } from 'react'
import { StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [mobile, setMobile] = useState('')




  console.log(password, 'password--');


  return (
    <ThemedView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView >

            <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText>
            <ThemedView style={styles.loginContainer}>
              <ThemedText type='subtitle' style={styles.subheading}>User Login</ThemedText>

              {/* Email Input */}
              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Email</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Your Email"
                    placeholderTextColor="gray"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoComplete='email'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              {/* Password Input */}
              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Password</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Your Password"
                    placeholderTextColor="gray"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.submitButtonContainer}>
              <CustomButton buttonText='Login' buttonWidth={300} handlePress={() => router.push('/(auth)/register')}   />
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Login

const styles = StyleSheet.create({
  mainContainer:{
      flex: 1,
      marginTop: 40,
      paddingHorizontal: 20,
    },
  logoText: {
    marginTop: 60,
  },
  loginContainer: {
    
  },
  subheading: {
    marginTop: 20,
  },
  textInputHeading: {
    marginBottom: verticalScale(8),
    marginTop: verticalScale(12),
  },
  textInputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: verticalScale(12),
    height: verticalScale(40),
  },
  textInputText: {
    fontSize: moderateScale(14),
    color: 'gray',
  },
  submitButtonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },


})
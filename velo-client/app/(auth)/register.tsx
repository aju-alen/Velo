import React, { useState } from 'react'
import { StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';


const Register = () => {
  const params = useLocalSearchParams();
  const { role } = params;
  console.log(role, 'params--');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reEnterPassword, setreEnterPassword] = useState('')
  
  const handleRegister =async () => {
    if (password === reEnterPassword) {
      await SecureStore.setItemAsync('tempRegister', JSON.stringify({
        name,
        email,
        password,
        role
      }))
      router.replace('/mobileInput')
    } else {
      alert('Passwords do not match')
    }
  }



  return (
    <ThemedView style={{
      flex: 1,
      marginTop: 40,
      paddingHorizontal: 20,
    }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView >

            <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText>
            <ThemedText type='subtitle' style={styles.subheading}>{role === "USER" ? "User" : "Agent"} Registration</ThemedText>

            {/* Name Input */}
            <ThemedView style={{ marginBottom: verticalScale(6) }}>
              <ThemedText type='default' style={styles.textInputHeading}>Name</ThemedText>
              <ThemedView style={styles.textInputBox}>
                <TextInput
                  placeholder="Enter Your Name"
                  placeholderTextColor="gray"
                  value={name}
                  onChangeText={setName}
                  keyboardType='default'
                  autoComplete='name'
                  keyboardAppearance='dark'
                  returnKeyType='next'
                  style={styles.textInputText}
                />
              </ThemedView>
            </ThemedView>

           

            {/* Email Input */}
            <ThemedView style={{ marginBottom: verticalScale(6) }}>
              <ThemedText type='default' style={styles.textInputHeading}>Email</ThemedText>
              <ThemedView style={styles.textInputBox}>
                <TextInput
                  placeholder="Enter Your Email"
                  placeholderTextColor="gray"
                  value={email}
                  autoCapitalize='none'
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

            {/* Re-Enter Password Input */}
            <ThemedView style={{ marginBottom: verticalScale(6) }}>
              <ThemedText type='default' style={styles.textInputHeading}>Re-Enter Password</ThemedText>
              <ThemedView style={styles.textInputBox}>
                <TextInput
                  placeholder="Re-Enter Your Password"
                  placeholderTextColor="gray"
                  value={reEnterPassword}
                  onChangeText={setreEnterPassword}
                  secureTextEntry
                  keyboardAppearance='dark'
                  returnKeyType='done' // Done for the last field
                  style={styles.textInputText}
                />
              </ThemedView>
              <ThemedView style={styles.buttonContainer}>
              <CustomButton disableButton={
                !name || !email || !password || !reEnterPassword
              } buttonText='Register'  handlePress={handleRegister} />
              </ThemedView>
            </ThemedView>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
  },
  logoText: {
    marginTop: verticalScale(60),
  },
  subheading: {
    marginTop: verticalScale(20),
  },
  textInputHeading: {
    marginBottom: verticalScale(8),
    marginTop: verticalScale(12),
  },
  textInputBox: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
    marginBottom: verticalScale(12),
    height: verticalScale(40),
  },
  textInputText: {
    fontSize: moderateScale(14),
    color: 'gray',
  },
  buttonContainer:{
    justifyContent:'center',
    alignItems:'center',
  }
  
})
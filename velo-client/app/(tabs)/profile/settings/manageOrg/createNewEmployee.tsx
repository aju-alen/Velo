import React, { useState } from 'react';
import { StyleSheet, TextInput,  TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import axiosInstance from '@/constants/axiosHeader';
import { router, useLocalSearchParams } from 'expo-router';

const CreateNewEmployeeSignup = () => {
const {orgId} = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileCode, setMobileCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSignup =async () => {
    const formData ={
      name,
      email,
      password,
      mobileCode,
      mobileNumber,
      orgId
    }
    const signupSubEmployee = await axiosInstance.post(`/api/organisation/signup-sub-agent`,formData)
    router.replace('/profile/settings/manageOrg/manageTeam')
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sign-up a new sub employee</ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      
      <ThemedView style={styles.mobileContainer}>
        <TextInput
          style={styles.mobileCode}
          placeholder="+91"
          value={mobileCode}
          onChangeText={setMobileCode}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
        
        <TextInput
          style={styles.mobileNumber}
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
      </ThemedView>
      
      <TouchableOpacity 
        style={styles.signupButton} 
        onPress={handleSignup}
      >
        <ThemedText style={styles.signupButtonText}>
          Create Employee
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,

    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  mobileContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  mobileCode: {
    borderWidth: 1,

    padding: 10,
    borderRadius: 5,
    width: '25%',
    marginRight: 10,
  },
  mobileNumber: {
    borderWidth: 1,

    padding: 10,
    borderRadius: 5,
    width: '72%',
  },
  signupButton: {
    backgroundColor: '#FFAC1C',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CreateNewEmployeeSignup;
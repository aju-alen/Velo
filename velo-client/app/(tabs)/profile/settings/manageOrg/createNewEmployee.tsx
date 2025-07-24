import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import axiosInstance from '@/constants/axiosHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

const CreateNewEmployeeSignup = () => {
  const { orgId } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileCode, setMobileCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSignup = async () => {
    const formData = {
      name,
      email,
      password,
      mobileCode,
      mobileNumber,
      orgId
    };
    await axiosInstance.post(`/api/organisation/signup-sub-agent`, formData);
    router.replace('/profile/settings/manageOrg/manageTeam');
  };

  // Theme-aware colors
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const inputBg = colorScheme === 'dark' ? '#23242A' : '#F9FAFB';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const textSecondary = colorScheme === 'dark' ? '#AAA' : '#666';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#888';
  const accent = '#FFAC1C';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={[styles.outer, { backgroundColor: colorScheme === 'dark' ? '#101014' : '#F5F6FA' }]}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <ThemedView style={[styles.card, { backgroundColor: bgCard, shadowColor: colorScheme === 'dark' ? '#000' : '#000' }]}> 
            <ThemedText style={[styles.title, { color: textPrimary }]}>Sign-up a new sub employee</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={placeholderColor}
            />
            <ThemedView style={styles.mobileContainer}>
              <TextInput
                style={[styles.mobileCode, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
                placeholder="971"
                value={mobileCode}
                onChangeText={setMobileCode}
                keyboardType="phone-pad"
                placeholderTextColor={placeholderColor}
              />
              <TextInput
                style={[styles.mobileNumber, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
                placeholder="Mobile Number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                placeholderTextColor={placeholderColor}
              />
            </ThemedView>
            <TouchableOpacity 
              style={[styles.signupButton, { backgroundColor: accent }]}
              onPress={handleSignup}
              activeOpacity={0.85}
            >
              <ThemedText style={styles.signupButtonText}>
                Create Employee
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </KeyboardAvoidingView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 18,
    padding: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 15,
  },
  mobileContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  mobileCode: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    width: '25%',
    marginRight: 8,
    fontSize: 15,
  },
  mobileNumber: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    width: '72%',
    fontSize: 15,
  },
  signupButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default CreateNewEmployeeSignup;
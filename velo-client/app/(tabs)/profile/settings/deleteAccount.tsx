import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import useLoginAccountStore from '@/store/loginAccountStore';
import axiosInstance from '@/constants/axiosHeader';
import { router } from 'expo-router';
import { getAuth, signOut } from '@react-native-firebase/auth';
import * as SecureStore from 'expo-secure-store';

const DeleteAccount = () => {
  const colorScheme = useColorScheme();
  const { accountLoginData, resetAccountLoginData } = useLoginAccountStore();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const inputBg = colorScheme === 'dark' ? '#23242A' : '#F9FAFB';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#888';
  const accent = '#FF4D4F';

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');
    if (!password) {
      setError('Password is required.');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/api/auth/delete-account', {
        userId: accountLoginData.id,
        password,
      });
      setSuccess('Account deleted successfully.');
      setTimeout(async () => {
        await SecureStore.deleteItemAsync('registerDetail');
      try {
        await signOut(getAuth());
      } catch (e) {
        
      }
      resetAccountLoginData();
      router.replace('/(auth)/login');
        router.replace('/login');
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={[styles.outer, { backgroundColor: colorScheme === 'dark' ? '#101014' : '#F5F6FA' }]}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <ThemedView style={[styles.card, { backgroundColor: bgCard, borderColor }]}> 
            <ThemedText style={[styles.title, { color: accent }]}>Delete Account</ThemedText>
            <ThemedText style={[styles.warning, { color: accent }]}>This action is irreversible. Your account and all data will be permanently deleted.</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
              placeholder="Enter your password to confirm"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={placeholderColor}
            />
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            {success ? <ThemedText style={styles.success}>{success}</ThemedText> : null}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: accent }]} 
              onPress={handleDeleteAccount}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Delete Account</ThemedText>
              )}
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
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  warning: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 15,
  },
  button: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  error: {
    color: '#FF4D4F',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  success: {
    color: '#10B981',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default DeleteAccount; 
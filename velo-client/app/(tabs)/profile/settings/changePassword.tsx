import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, View, Text, useColorScheme } from 'react-native';
import useLoginAccountStore from '@/store/loginAccountStore';
import axiosInstance from '@/constants/axiosHeader';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const ChangePassword = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { accountLoginData } = useLoginAccountStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const inputBg = colorScheme === 'dark' ? '#23242A' : '#F9FAFB';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#888';
  const accent = '#FFAC1C';

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/change-password', {
        userId: accountLoginData.id,
        currentPassword,
        newPassword,
      });
      setSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      router.replace('/(auth)/login')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.outer, { backgroundColor: colorScheme === 'dark' ? '#101014' : '#F5F6FA' }]}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={[styles.card, { backgroundColor: bgCard, borderColor }]}> 
            <Text style={[styles.title, { color: textPrimary }]}>Change Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor={placeholderColor}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: accent }]} 
              onPress={handleChangePassword}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
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

export default ChangePassword;
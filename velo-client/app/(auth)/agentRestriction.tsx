import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const AgentRestriction = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
      <View style={styles.contentContainer}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          {/* <CheckCircle size={64} color="#FFAC1C" /> */}
        </View>

        {/* Main Message */}
        <Text style={[styles.title, { color: themeColors.text }]}>
          Appointment Scheduled!
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: themeColors.text }]}>
          Your appointment has been successfully booked and scheduled. You will have access to limited features until your verification is complete.
        </Text>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={[styles.statusTitle, { color: themeColors.text }]}>Current Status</Text>
          <Text style={[styles.statusText, { color: themeColors.text }]}>Pending Verification</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)/home/homeMainPage')} 
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>
            Continue with Limited Access
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statusCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#FFAC1C',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AgentRestriction;
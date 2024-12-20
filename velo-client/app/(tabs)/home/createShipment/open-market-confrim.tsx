import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';


const OpenMarketConfirm = () => {
  return (
    <ThemedView style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          {/* <CheckCircle size={64} color="#FFAC1C" /> */}
        </View>

        {/* Main Message */}
        <ThemedText style={styles.title}>
            Your Order has been put out!
        </ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>
            Your order has been put out in the market and waiting for someone to accept it. You will be notified once someone accepts your order.
        </ThemedText>

   

        {/* Action Button */}
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)/home/homeMainPage')} 
          style={styles.buttonContainer}
        >
          <ThemedText style={styles.buttonText}>
            Continue Market
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
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

export default OpenMarketConfirm;
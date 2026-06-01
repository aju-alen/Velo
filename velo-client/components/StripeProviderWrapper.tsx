// StripeProviderWrapper.js
import React, { useState, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { ipURL } from '@/constants/backendUrl';

const StripeProviderWrapper = ({ children }) => {
  const [publishableKey, setPublishableKey] = useState('');
  const configScheme = Constants.expoConfig?.scheme;
  const appScheme = Array.isArray(configScheme)
    ? (configScheme[0] ?? 'velo-international-shipping')
    : (configScheme ?? 'velo-international-shipping');

  const fetchPublishableKey = async () => {
    try {
      const response = await fetch(`${ipURL}/api/stripe/get-keys`); // Replace with your server endpoint
      const data = await response.json(); 
      console.log(data, 'data opublic key');     
      setPublishableKey(data.publishableKey);
    } catch (error) {
      console.error('Error fetching publishable key:', error);
    }
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  if (!publishableKey) {
    // Optionally, return a loading spinner until the key is fetched
    return null;
  }

  return (
    <StripeProvider
      publishableKey={publishableKey}
      urlScheme={appScheme}
    >
      {children}
    </StripeProvider>
  );
};

export default StripeProviderWrapper;

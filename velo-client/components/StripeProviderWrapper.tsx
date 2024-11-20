// StripeProviderWrapper.js
import React, { useState, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ipURL } from '@/constants/backendUrl';

const StripeProviderWrapper = ({ children }) => {
  const [publishableKey, setPublishableKey] = useState('');

  const fetchPublishableKey = async () => {
    try {
      const response = await fetch(`${ipURL}/api/stripe/get-keys`); // Replace with your server endpoint
      const data = await response.json();
      console.log('Publishable key:', data.publishableKey);
      
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
    >
      {children}
    </StripeProvider>
  );
};

export default StripeProviderWrapper;

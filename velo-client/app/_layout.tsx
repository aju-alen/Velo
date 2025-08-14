import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import StripeProviderWrapper from '@/components/StripeProviderWrapper';
import { useColorScheme } from '@/hooks/useColorScheme';
import useDefaultTheme from '@/store/themeStore';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://6c674a7040f065b6c6ea364755723ee4@o4508838422118400.ingest.de.sentry.io/4509823798018128',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
    // Raleway: require('../assets/fonts/Raleway-Regular.ttf'),
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
     
    <PaperProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false}} />
      <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
    </PaperProvider>
  );
});
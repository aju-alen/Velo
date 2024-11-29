import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import { View } from 'react-native';

import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import StripeProviderWrapper from '@/components/StripeProviderWrapper';
import { SplashScreen } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate an artificial delay for a better user experience.
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (loaded) {
      prepare();
    }
  }, [loaded]);

  // Hide splash screen when app is ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!loaded || !appIsReady) {
    return null; // Keep the splash screen visible until fonts are loaded and delay is complete
  }

  return (
    <StripeProviderWrapper>
      <PaperProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>

            {/* Place redirect logic outside the stack */}
            <Redirect href="/" />
          </View>
        </ThemeProvider>
      </PaperProvider>
    </StripeProviderWrapper>
  );
}

import { ThemeProvider } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getNavigationTheme } from '@/constants/navigationTheme';
import { Colors } from '@/constants/Colors';
import { Type } from '@/constants/typography';
import { applyGlobalTypography } from '@/utils/applyGlobalTypography';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const mode = (colorScheme ?? 'light') as 'light' | 'dark';

  useEffect(() => {
    applyGlobalTypography();
    SplashScreen.hideAsync();
  }, []);

  const navTheme = getNavigationTheme(mode);
  const basePaper = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const paperTheme = {
    ...basePaper,
    colors: {
      ...basePaper.colors,
      primary: Colors[mode].tint,
      background: Colors[mode].background,
      surface: Colors[mode].surface,
      onSurface: Colors[mode].text,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors[mode].surface },
            headerTintColor: Colors[mode].text,
            headerTitleStyle: {
              fontSize: Type.h3.fontSize,
              fontWeight: '600',
            },
            contentStyle: { backgroundColor: Colors[mode].background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
          {/* Never swipe/back from auth or app into the welcome screen */}
          <Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}

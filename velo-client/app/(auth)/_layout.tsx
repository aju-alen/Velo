import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Auth / onboarding stack.
 * Default: no swipe-back / hardware-back (prevents returning to welcome
 * or prior registration steps). Password recovery still allows back.
 */
export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const mode = (colorScheme ?? 'light') as 'light' | 'dark';
  const pathname = usePathname();

  useEffect(() => {
    const allowHardwareBack =
      pathname.includes('forgotPassword') || pathname.includes('resetPassword');

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (allowHardwareBack) return false;
      return true;
    });

    return () => sub.remove();
  }, [pathname]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors[mode].background },
      }}
    >
      <Stack.Screen name="chooseRole" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="mobileInput" />
      <Stack.Screen name="otpInput" />
      <Stack.Screen name="verifyAgent" />
      <Stack.Screen name="finalRegisterForm" />
      <Stack.Screen name="setAppointment" />
      <Stack.Screen name="agentRestriction" />
      <Stack.Screen name="guestOnboarding" />
      <Stack.Screen name="forgotPassword" options={{ gestureEnabled: true }} />
      <Stack.Screen name="resetPassword" options={{ gestureEnabled: true }} />
    </Stack>
  );
}

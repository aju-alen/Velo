import React from 'react';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Type } from '@/constants/typography';

export default function SettingsLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: Type.h3.fontSize,
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="settingsHome" options={{ title: 'Settings', gestureEnabled: false }} />
      <Stack.Screen name="manageOrg" options={{ headerShown: false }} />
      <Stack.Screen name="deleteAccount" options={{ title: 'Delete Account' }} />
      <Stack.Screen name="changePassword" options={{ title: 'Change Password' }} />
      <Stack.Screen name="myOrders" options={{ headerShown: false }} />
      <Stack.Screen name="support" options={{ title: 'Support' }} />
    </Stack>
  );
}

import React from 'react';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Type } from '@/constants/typography';

export default function ProfileLayout() {
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
      <Stack.Screen
        name="profileHome"
        options={{
          title: 'Profile',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}

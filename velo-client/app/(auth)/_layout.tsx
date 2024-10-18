import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='chooseRole' options={{ headerShown: false }} />
            <Stack.Screen name='login' options={{ headerShown: false }} />
            <Stack.Screen name='register' options={{ headerShown: false }} />
            <Stack.Screen name='mobileInput' options={{ headerShown: false }} />
            <Stack.Screen name='otpInput' options={{ headerShown: false }} />
            <Stack.Screen name='verifyAgent' options={{ headerShown: false }} />
            <Stack.Screen name='finalRegisterForm' options={{ headerShown: false }} />
        </Stack>
    );
}

import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function SuperRegisterRequestLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='superRegisterRequest' options={{ headerShown: true,
            title: 'Super Register Request',    
            gestureEnabled:false }}/>
        </Stack>
    );
}

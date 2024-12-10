import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function AdminUpdateStatusLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='adminUpdateStatus' options={{ headerShown: true }}/>
        </Stack>
    );
}

import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function MarketLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='marketHome' options={{ headerShown: false }} />
            <Stack.Screen name='[singleListing]' options={{ headerShown: false }} />
            <Stack.Screen name='createListing' options={{ headerShown: false }} />
        </Stack>
    );
}

import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function MarketLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='createShipmentHome' options={{ headerShown: false }} />
            <Stack.Screen name='shippingOptions' options={{ headerShown: false }} />
           
        </Stack>
    );
}

import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function MarketLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='createShipmentHome' options={{ headerShown: true }} />
            <Stack.Screen name='shippingOptions' options={{ headerShown: true }} />
            <Stack.Screen name='shippingOptionalService' options={{ headerShown: true }} />
            <Stack.Screen name='shipmentSchedulePickup' options={{ headerShown: true }} />
            <Stack.Screen name='finalPreview' options={{ headerShown: true }} />
            <Stack.Screen name='payment' options={{ headerShown: true }} />
            <Stack.Screen name='paymentSuccess' options={{ headerShown: true }} />
           
        </Stack>
    );
}

import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function HomeLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='adminOrderDetailMain' options={{ headerShown: false, gestureEnabled:false }}/>
            <Stack.Screen name='[singleOrder]' options={{ headerShown: false }}/>
            <Stack.Screen name='adminUpdateShipment' options={{ headerShown: false }}/>

            

        </Stack>
    );
}

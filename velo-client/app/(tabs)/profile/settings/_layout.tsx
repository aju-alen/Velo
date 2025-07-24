import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SettingsLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
             <Stack.Screen name='settingsHome' options={{ headerShown: true,
            title: 'Settings',    
            gestureEnabled:false }}/>
             <Stack.Screen name='manageOrg' options={{ headerShown: false}}/>
             <Stack.Screen name='deleteAccount' options={{ headerShown: false}}/>
             <Stack.Screen name='changePassword' options={{ headerShown: false}}/>
             <Stack.Screen name='myOrders' options={{ headerShown: false}}/>
             <Stack.Screen name='support' options={{ headerShown: false}}/>
             
        </Stack>
    );
}

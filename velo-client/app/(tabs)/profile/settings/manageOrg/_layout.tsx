import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ManageOrgLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
             <Stack.Screen name='manageTeam' options={{ headerShown: true,  
             title: 'Manage Team',
            gestureEnabled:false }}/>
            
             <Stack.Screen name='managePricing' options={{ headerShown: true,  
             title: 'Manage Pricing',
            gestureEnabled:false }}/>

             <Stack.Screen name='createNewEmployee' options={{ headerShown: true,  
            gestureEnabled:false }}/>
        </Stack>
    );
}

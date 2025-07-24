import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='profileHome' options={{ headerShown: true,
            title: 'My Profile',    
            gestureEnabled:false,
            headerRight: () => (
                <Ionicons 
                name="settings-outline"
                size={24}
                color={colorScheme === 'dark'? '#fff' : '#000' }
                onPress={()=>router.push('/(tabs)/profile/settings/settingsHome')}
                />
            )
            }}/>

            <Stack.Screen name='settings' options={{ headerShown: false}}/>
        </Stack>
    );
}

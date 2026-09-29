import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Stack } from 'expo-router';
import useShipmentStore from '@/store/shipmentStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import SaveDraftButton from '@/components/SaveDraftButton';

export default function CreateShipmentLayout() {
    const { setCreateShipment } = useShipmentStore();
    const colorScheme = useColorScheme();
    const headerTint = colorScheme === 'dark' ? 'white' : 'black';

    const handleGoBackHome = () => {
        setCreateShipment(false);
        router.replace('/(tabs)/home/homeMainPage');
    };

    const draftHeaderRight = () => <SaveDraftButton />;

    return (
        <Stack>
            <Stack.Screen
                name="createShipmentHome"
                options={{
                    headerShown: true,
                    title: 'Details',
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleGoBackHome}>
                            <AntDesign name="arrow-left" size={24} color={headerTint} />
                        </TouchableOpacity>
                    ),
                    headerRight: draftHeaderRight,
                }}
            />
            <Stack.Screen
                name="shippingOptions"
                options={{ headerShown: true, title: 'Addresses', headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="shippingOptionalService"
                options={{ headerShown: true, title: 'Services', headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="shipmentSchedulePickup"
                options={{ headerShown: true, title: 'Pickup', headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="finalPreview"
                options={{ headerShown: true, title: 'Review', headerRight: draftHeaderRight }}
            />
            <Stack.Screen name="payment" options={{ title: 'Payment', gestureEnabled: false }} />
            <Stack.Screen name="paymentSuccess" options={{ headerShown: true, gestureEnabled: false }} />
            <Stack.Screen
                name="viewShippingOptions"
                options={{ headerShown: true, title: 'Carrier', headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="open-market-confrim"
                options={{ headerShown: true, title: 'Confirmed', gestureEnabled: false }}
            />
        </Stack>
    );
}

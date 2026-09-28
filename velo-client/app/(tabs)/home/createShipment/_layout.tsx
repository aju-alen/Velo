import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Stack } from 'expo-router';
import useShipmentStore from '@/store/shipmentStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import SaveDraftButton from '@/components/SaveDraftButton';

export default function CreateShipmentLayout() {
    const { createShipment, setCreateShipment } = useShipmentStore();
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
                    headerShown: createShipment ? true : false,
                    title: 'Shipment Details',
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
                options={{ headerShown: true, title: 'Shipping Options', headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="shippingOptionalService"
                options={{ headerShown: true, title: 'Additional Service', headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="shipmentSchedulePickup"
                options={{ headerShown: true, title: 'Schedule Pickup', headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="finalPreview"
                options={{ headerShown: true, title: 'Shipment Preview', headerRight: draftHeaderRight }}
            />
            <Stack.Screen name="payment" options={{ title: 'Payment Summary', gestureEnabled: false }} />
            <Stack.Screen name="paymentSuccess" options={{ headerShown: true, gestureEnabled: false }} />
            <Stack.Screen
                name="viewShippingOptions"
                options={{ headerShown: true, title: 'Shipping Options', gestureEnabled: false, headerRight: draftHeaderRight }}
            />
            <Stack.Screen
                name="open-market-confrim"
                options={{ headerShown: true, title: 'Shipping Confirmed', gestureEnabled: false }}
            />
        </Stack>
    );
}

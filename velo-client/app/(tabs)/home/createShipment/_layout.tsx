import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import useShipmentStore from '@/store/shipmentStore';

export default function MarketLayout() {
    const {createShipment} = useShipmentStore();
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='createShipmentHome' options={{ headerShown: createShipment ? true : false, title:'Shipment Details'}} />
            <Stack.Screen name='shippingOptions' options={{ headerShown: true, title:'Shipping Options'}} />
            <Stack.Screen name='shippingOptionalService' options={{ headerShown: true, title:'Additional Service'}} />
            <Stack.Screen name='shipmentSchedulePickup' options={{ headerShown: true, title:"Schedule Pickup"}} />
            <Stack.Screen name='finalPreview' options={{ headerShown: true,title:'Shipment Preview'}} />
            <Stack.Screen name='payment' options={{ headerShown: true,  title:'Payment Sumamry' }} />
            <Stack.Screen name='paymentSuccess' options={{ headerShown: true}} />
        </Stack>
    );
}

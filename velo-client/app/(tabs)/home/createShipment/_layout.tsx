import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Stack } from 'expo-router';
import useShipmentStore from '@/store/shipmentStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';

export default function MarketLayout() {
    const {createShipment,setCreateShipment} = useShipmentStore();
    console.log(createShipment);
    
    const colorScheme = useColorScheme();

    const handleGoBackHome =()=>{
        setCreateShipment(false)
        router.replace('/(tabs)/home/homeMainPage')
    }

    return (
        <Stack>
            <Stack.Screen name='createShipmentHome' options={{ 
                headerShown: createShipment ? true : false,
                title:'Shipment Details',
                headerLeft:()=>(
                    <TouchableOpacity onPress={handleGoBackHome}>
                    <AntDesign name="arrowleft" size={24}  color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                )
                }} />
            <Stack.Screen name='shippingOptions' options={{ headerShown: true, title:'Shipping Options'}} />
            <Stack.Screen name='shippingOptionalService' options={{ headerShown: true, title:'Additional Service'}} />
            <Stack.Screen name='shipmentSchedulePickup' options={{ headerShown: true, title:"Schedule Pickup"}} />
            <Stack.Screen name='finalPreview' options={{ headerShown: true,title:'Shipment Preview'}} />
            <Stack.Screen name='payment' options={{title:'Payment Sumamry',gestureEnabled:false }} />
            <Stack.Screen name='paymentSuccess' options={{ headerShown: true,gestureEnabled:false}} />
        </Stack>
    );
}

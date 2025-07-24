import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useLoginAccountStore from '@/store/loginAccountStore';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { accountLoginData } = useLoginAccountStore();

  const [accountDetail, setAccountDetail] = useState(null)

  useEffect(() => {
    const getSecureStoreData = async () => {
      const user = await SecureStore.getItemAsync('registerDetail');
      if (user) {
        setAccountDetail(JSON.parse(user));
      }
    }
    getSecureStoreData();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'storefront' : 'storefront-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shippinghistory"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'newspaper' : 'newspaper-outline'} color={color} />
          ),
          href: (accountLoginData.role === "USER")? "/shippinghistory" : null 
        }}
      />
    
        <Tabs.Screen
          name="adminorderdetail"
          options={{
            title: 'Order',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'newspaper' : 'newspaper-outline'} color={color} />
            ),
            href: (accountLoginData.role === "AGENT")? "/adminorderdetail" : null 
          
          }}
        />
        <Tabs.Screen
          name="superRegisterRequestTab"
          options={{
            title: 'Register Request',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'construct' : 'construct-outline'} color={color} />
            ),
            href: (accountLoginData.role === "SUPERADMIN")? "/superRegisterRequestTab" : null 
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'My Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
            ) 
          }}
        />
      
    </Tabs>
  );
}

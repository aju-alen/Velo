import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import CustomButton from '@/components/CustomButton';
import StartOverButton from '@/components/StartOverButton';
import { AuthScreen } from '@/components/forms/AuthScreen';
import { SelectableRow } from '@/components/forms/SelectableRow';
import { router } from 'expo-router';

const ROLES = [
  {
    key: 'USER',
    title: 'Sender',
    description: 'Book shipments and track deliveries.',
  },
  {
    key: 'AGENT',
    title: 'Logistics agent',
    description: 'Manage orders, pricing, and pickups.',
  },
  {
    key: 'GUEST',
    title: 'Browse as guest',
    description: 'Explore the marketplace with limited access.',
  },
] as const;

const ChooseRole = () => {
  const [role, setRole] = useState('USER');
  const fade = useRef(new Animated.Value(1)).current;

  const handleContinueRegister = () => {
    if (role === 'GUEST') {
      router.replace({ pathname: '/(auth)/guestOnboarding' });
    } else {
      router.replace({ pathname: '/(auth)/register', params: { role } });
    }
  };

  const handlePress = (selectedRole: string) => {
    setRole(selectedRole);
    fade.setValue(0.92);
    Animated.timing(fade, {
      toValue: 1,
      duration: 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <AuthScreen
      title="How will you use Velo?"
      subtitle="Pick the account type that matches how you ship."
      footer={
        <>
          <CustomButton buttonText="Continue" handlePress={handleContinueRegister} />
          <StartOverButton />
        </>
      }
    >
      <Animated.View style={[styles.list, { opacity: fade }]}>
        {ROLES.map((item) => (
          <SelectableRow
            key={item.key}
            title={item.title}
            description={item.description}
            selected={role === item.key}
            onPress={() => handlePress(item.key)}
          />
        ))}
      </Animated.View>
    </AuthScreen>
  );
};

export default ChooseRole;

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});

import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { getAuth, signOut } from '@react-native-firebase/auth';

const REGISTRATION_STORE_KEYS = ['registerDetail', 'tempRegister', 'tempMobile'] as const;

export async function clearRegistrationStorage() {
  await Promise.all(
    REGISTRATION_STORE_KEYS.map((key) =>
      SecureStore.deleteItemAsync(key).catch(() => undefined)
    )
  );
}

export async function abandonRegistrationAndRestart(
  resetAccountLoginData: () => void
) {
  const stored = await SecureStore.getItemAsync('registerDetail');
  let userId: string | null = null;

  if (stored) {
    try {
      userId = JSON.parse(stored).id ?? null;
    } catch {
      userId = null;
    }
  }

  if (userId) {
    try {
      await axios.post(`${ipURL}/api/auth/abandon-registration`, { userId });
    } catch (error) {
      console.warn('Failed to delete in-progress account on server:', error);
    }
  }

  await clearRegistrationStorage();

  try {
    await signOut(getAuth());
  } catch {
    // Firebase may not be signed in on early registration steps
  }

  resetAccountLoginData();
  router.replace('/');
}

export function confirmAbandonRegistration(resetAccountLoginData: () => void) {
  Alert.alert(
    'Start Over?',
    'This will delete your in-progress account and clear all registration data. You will return to the beginning.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete & Start Over',
        style: 'destructive',
        onPress: () => abandonRegistrationAndRestart(resetAccountLoginData),
      },
    ]
  );
}

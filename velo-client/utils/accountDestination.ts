type StoredAccount = {
  role?: string;
  registerVerificationStatus?: string;
};

export function destinationForStoredAccount(userData: StoredAccount | null) {
  if (!userData?.role) return null;

  if (userData.registerVerificationStatus === 'PARTIAL') {
    return '/(auth)/finalRegisterForm';
  }

  return '/(tabs)/home/homeMainPage';
}

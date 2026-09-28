type StoredAccount = {
  role?: string;
  registerVerificationStatus?: string;
  verificationDocumentUrl?: string | null;
};

/**
 * Cold-start / deep-link destination for a stored account.
 * Agents in PARTIAL without a verification document must finish verifyAgent first.
 */
export function destinationForStoredAccount(userData: StoredAccount | null) {
  if (!userData?.role) return null;

  if (userData.role === 'AGENT') {
    if (userData.registerVerificationStatus === 'PARTIAL') {
      if (userData.verificationDocumentUrl) {
        return '/(auth)/finalRegisterForm';
      }
      return '/(auth)/verifyAgent';
    }
    if (
      userData.registerVerificationStatus === 'APPOINTMENT_BOOKED' ||
      userData.registerVerificationStatus === 'REJECTED'
    ) {
      return '/(auth)/agentRestriction';
    }
  }

  if (userData.registerVerificationStatus === 'PARTIAL') {
    return '/(auth)/finalRegisterForm';
  }

  return '/(tabs)/home/homeMainPage';
}

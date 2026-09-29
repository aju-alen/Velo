import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';
import axiosInstance, { setAuthorizationHeader } from '@/constants/axiosHeader';

const stepFromPath = (pathname: string | null) => {
  if (!pathname) return 'createShipmentHome';
  const parts = pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || 'createShipmentHome';
};

const SaveDraftButton = () => {
  const [saving, setSaving] = useState(false);
  const pathname = usePathname();
  const { accountLoginData } = useLoginAccountStore();
  const { draftId, setDraftId, getDraftPayload } = useShipmentStore();

  const handleSave = async () => {
    try {
      setSaving(true);

      let userId = accountLoginData.id;
      let role = accountLoginData.role;
      let token = accountLoginData.token;

      if (!userId || !token || role !== 'USER') {
        const raw = await SecureStore.getItemAsync('registerDetail');
        if (raw) {
          const stored = JSON.parse(raw);
          userId = userId || stored.id;
          role = role || stored.role;
          token = token || stored.token;
        }
      }

      if (role !== 'USER' || !userId) {
        Alert.alert('Unavailable', 'Only senders can save shipment drafts.');
        return;
      }
      if (!token) {
        Alert.alert('Session expired', 'Please sign in again to save a draft.');
        return;
      }

      setAuthorizationHeader(token);

      // Dates / undefined must be plain JSON for Prisma Json columns
      const payload = JSON.parse(JSON.stringify(getDraftPayload()));

      const response = await axiosInstance.post('/api/shipment/draft', {
        userId,
        draftId: draftId || undefined,
        currentStep: stepFromPath(pathname),
        payload,
      });
      const savedId = response.data?.draft?.id;
      if (savedId) setDraftId(savedId);
      Alert.alert('Draft saved', 'You can continue this shipment later from Home.');
    } catch (e: any) {
      console.log('save draft error', e?.response?.status, e?.response?.data || e?.message);
      const message =
        e?.response?.data?.message ||
        (typeof e?.response?.data === 'string' ? e.response.data : null) ||
        e?.message ||
        'Could not save draft. Please try again.';
      Alert.alert('Error', String(message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.button} hitSlop={8}>
      {saving ? (
        <ActivityIndicator size="small" color="#FFAC1C" />
      ) : (
        <Text style={styles.label}>Save</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    minWidth: 44,
    alignItems: 'flex-end',
  },
  label: {
    color: '#FFAC1C',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default SaveDraftButton;

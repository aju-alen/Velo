import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';
import axiosInstance from '@/constants/axiosHeader';

const stepFromPath = (pathname: string | null) => {
  if (!pathname) return 'createShipmentHome';
  const parts = pathname.split('/');
  return parts[parts.length - 1] || 'createShipmentHome';
};

const SaveDraftButton = () => {
  const [saving, setSaving] = useState(false);
  const pathname = usePathname();
  const { accountLoginData } = useLoginAccountStore();
  const { draftId, setDraftId, getDraftPayload } = useShipmentStore();

  const handleSave = async () => {
    if (accountLoginData.role !== 'USER' || !accountLoginData.id) {
      Alert.alert('Unavailable', 'Only senders can save shipment drafts.');
      return;
    }
    try {
      setSaving(true);
      const response = await axiosInstance.post('/api/shipment/draft', {
        userId: accountLoginData.id,
        draftId: draftId || undefined,
        currentStep: stepFromPath(pathname),
        payload: getDraftPayload(),
      });
      const savedId = response.data?.draft?.id;
      if (savedId) setDraftId(savedId);
      Alert.alert('Draft saved', 'You can continue this shipment later from Home.');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not save draft. Please try again.');
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

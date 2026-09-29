import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import axiosInstance from '@/constants/axiosHeader';
import { AppText } from '@/components/AppText';
import { FormField } from '@/components/forms/FormField';
import CustomButton from '@/components/CustomButton';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

const UnitBadge = ({ label }: { label: string }) => {
  const { colors, brand } = useAppTheme();
  return (
    <View style={[styles.unitBadge, { backgroundColor: colors.tintMuted }]}>
      <AppText variant="caption" color={brand.amber}>
        {label}
      </AppText>
    </View>
  );
};

const ManagePricingOption = () => {
  const { colors, radius } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [documentPricePerPiece, setDocumentPricePerPiece] = useState('');
  const [packagePricePerKg, setPackagePricePerKg] = useState('');
  const [packagePricePerPiece, setPackagePricePerPiece] = useState('');
  const [shipmentTimeline, setShipmentTimeline] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    const fields = [
      documentPricePerPiece,
      packagePricePerKg,
      packagePricePerPiece,
      shipmentTimeline,
    ];
    return fields.every((v) => v.trim() !== '' && !Number.isNaN(Number(v)));
  }, [
    documentPricePerPiece,
    packagePricePerKg,
    packagePricePerPiece,
    shipmentTimeline,
  ]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/api/organisation/get-pricing');
        if (cancelled) return;
        setDocumentPricePerPiece(data.documentPricePerPiece?.toString() || '');
        setPackagePricePerKg(data.packagePricePerKg?.toString() || '');
        setPackagePricePerPiece(data.packagePricePerPiece?.toString() || '');
        setShipmentTimeline(data.deliveryTimeline?.toString() || '');
      } catch (e) {
        console.log(e);
        if (!cancelled) {
          Alert.alert('Could not load pricing', 'Check your connection and try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSavePricing = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await axiosInstance.put('/api/organisation/save-pricing', {
        documentPricePerPiece,
        packagePricePerKg,
        packagePricePerPiece,
        shipmentTimeline,
      });
      Alert.alert('Pricing saved', 'Your rates are visible to senders choosing your organisation.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert('Save failed', 'Could not update pricing. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h1" accessibilityRole="header">
          Your rates
        </AppText>
        <AppText variant="bodySmall" secondary style={styles.subtitle}>
          Prices are in AED. Delivery time is counted in calendar days.
        </AppText>

        {/* Documents */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
        >
          <AppText variant="h3">Documents</AppText>
          <AppText variant="caption" secondary style={styles.sectionHint}>
            Charged per piece
          </AppText>
          <FormField
            label="Price per piece"
            value={documentPricePerPiece}
            onChangeText={setDocumentPricePerPiece}
            keyboardType="decimal-pad"
            placeholder="0.00"
            editable={!loading && !saving}
            rightSlot={<UnitBadge label="AED" />}
            hint="Applied to document shipments"
          />
        </View>

        {/* Packages */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
        >
          <AppText variant="h3">Packages</AppText>
          <AppText variant="caption" secondary style={styles.sectionHint}>
            Weight and piece fees are combined
          </AppText>
          <FormField
            label="Price per kg"
            value={packagePricePerKg}
            onChangeText={setPackagePricePerKg}
            keyboardType="decimal-pad"
            placeholder="0.00"
            editable={!loading && !saving}
            rightSlot={<UnitBadge label="AED" />}
          />
          <FormField
            label="Price per piece"
            value={packagePricePerPiece}
            onChangeText={setPackagePricePerPiece}
            keyboardType="decimal-pad"
            placeholder="0.00"
            editable={!loading && !saving}
            rightSlot={<UnitBadge label="AED" />}
          />
        </View>

        {/* Timeline */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
        >
          <AppText variant="h3">Delivery time</AppText>
          <AppText variant="caption" secondary style={styles.sectionHint}>
            Typical transit from pickup to delivery
          </AppText>
          <FormField
            label="Estimated delivery"
            value={shipmentTimeline}
            onChangeText={setShipmentTimeline}
            keyboardType="number-pad"
            placeholder="3"
            editable={!loading && !saving}
            rightSlot={<UnitBadge label="days" />}
            hint="Shown to senders as your delivery estimate"
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.borderSubtle,
            paddingBottom: Math.max(insets.bottom, Spacing.md),
          },
        ]}
      >
        <CustomButton
          buttonText={saving ? 'Saving…' : 'Save pricing'}
          handlePress={handleSavePricing}
          disableButton={!canSave || loading || saving}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ManagePricingOption;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  subtitle: {
    marginTop: -Spacing.sm,
    marginBottom: Spacing.xs,
  },
  section: {
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionHint: {
    marginTop: -Spacing.sm,
  },
  unitBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    marginLeft: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

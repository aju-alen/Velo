import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import useShipmentStore from '@/store/shipmentStore';
import TimePickerModal from '@/components/TimePickerModal';
import { router } from 'expo-router';
import { FlowScreen } from '@/components/wizard/FlowScreen';
import { FormField } from '@/components/forms/FormField';
import { SelectableRow } from '@/components/forms/SelectableRow';
import { AppText } from '@/components/AppText';
import CustomButton from '@/components/CustomButton';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { SHIPMENT_STEPS, shipmentNextLabel, shipmentStepIndex, shipmentStepKeyAt } from '@/constants/flowSteps';
import { goToShipmentStep } from '@/utils/resumeShipmentWizard';

const PICKUP_LOCATIONS = ['Doorstep', 'Reception'] as const;

const ShipmentSchedulePickup = () => {
  const { colors, radius, brand } = useAppTheme();
  const {
    savedAddressData,
    accountAddressData,
    deliveryServices,
    packageDetail,
    setDeliveryServices,
    itemType,
  } = useShipmentStore();
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const step = shipmentStepIndex('shipmentSchedulePickup');
  const nextLabel = shipmentNextLabel('shipmentSchedulePickup');

  const formattedDate = useMemo(() => {
    const raw = savedAddressData.shipmentDate || savedAddressData.deliveryDate;
    const d = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, [savedAddressData.shipmentDate, savedAddressData.deliveryDate]);

  const hasTime =
    !!deliveryServices.deliveryPickupTimeFrom && !!deliveryServices.deliveryPickupTimeTo;
  const hasInstruction = !!deliveryServices.pickupInstruction;
  const canContinue = hasTime && hasInstruction;

  const timeLabel = hasTime
    ? `${deliveryServices.deliveryPickupTimeFrom} – ${deliveryServices.deliveryPickupTimeTo}`
    : 'Tap to choose a window';

  const packageMeta =
    itemType === 'PACKAGE'
      ? `${packageDetail.weight || '—'} kg`
      : itemType === 'DOCUMENT'
        ? `${packageDetail.numberOfPieces || '—'} piece(s)`
        : null;

  const handleContinue = () => {
    if (!hasTime) {
      Alert.alert('Pickup time required', 'Choose a start and end time for the pickup window.');
      return;
    }
    if (!hasInstruction) {
      Alert.alert('Pickup location required', 'Choose Doorstep or Reception.');
      return;
    }
    router.push('/(tabs)/home/createShipment/viewShippingOptions');
  };

  const missingHint = !canContinue
    ? [
        !hasTime ? 'pickup time' : null,
        !hasInstruction ? 'pickup location' : null,
      ]
        .filter(Boolean)
        .join(' and ')
    : null;

  return (
    <>
      <FlowScreen
        step={step}
        total={SHIPMENT_STEPS.length}
        stepLabel={SHIPMENT_STEPS[step - 1].label}
        nextLabel={nextLabel}
        onStepPress={(n) => {
          const key = shipmentStepKeyAt(n);
          if (key) goToShipmentStep(key);
        }}
        title="Schedule pickup"
        subtitle="Set when and where the agent should collect the package."
        footer={
          <>
            {missingHint ? (
              <AppText variant="caption" secondary style={styles.hint}>
                Still needed: {missingHint}
              </AppText>
            ) : (
              <AppText variant="caption" color={colors.success} style={styles.hint}>
                Ready — you can continue to carriers
              </AppText>
            )}
            <CustomButton
              buttonText="Continue to carriers"
              handlePress={handleContinue}
              disableButton={!canContinue}
            />
          </>
        }
      >
        {/* Summary */}
        <View
          style={[
            styles.summary,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
        >
          <View style={styles.summaryTop}>
            <View style={styles.summaryCol}>
              <AppText variant="label">Pickup day</AppText>
              <AppText variant="h3">{formattedDate}</AppText>
            </View>
            {packageMeta ? (
              <View style={[styles.metaPill, { backgroundColor: colors.tintMuted }]}>
                <AppText variant="caption" color={brand.amber}>
                  {itemType === 'PACKAGE' ? 'Weight' : 'Pieces'} · {packageMeta}
                </AppText>
              </View>
            ) : null}
          </View>

          <View style={[styles.hairline, { backgroundColor: colors.borderSubtle }]} />

          <AppText variant="label">Collect from</AppText>
          <AppText variant="bodyStrong">
            {accountAddressData.userName || 'Your address'}
          </AppText>
          <AppText variant="bodySmall" secondary>
            {[accountAddressData.addressOne, accountAddressData.addressTwo]
              .filter(Boolean)
              .join(', ')}
          </AppText>
          <AppText variant="bodySmall" secondary>
            {[accountAddressData.city, accountAddressData.state].filter(Boolean).join(', ')}
          </AppText>
        </View>

        {/* Time — required */}
        <AppText variant="label" style={styles.sectionLabel}>
          1. Pickup window
        </AppText>
        <TouchableOpacity
          onPress={() => setOpenTimeModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Select pickup time window"
          accessibilityHint="Opens a list of available pickup times"
          style={[
            styles.actionCard,
            {
              backgroundColor: colors.surface,
              borderColor: hasTime ? brand.amber : colors.border,
              borderWidth: hasTime ? 2 : 1,
              borderRadius: radius.md,
            },
          ]}
        >
          <View style={styles.actionText}>
            <AppText variant="bodyStrong">
              {hasTime ? timeLabel : 'Choose start and end time'}
            </AppText>
            <AppText variant="caption" secondary>
              {hasTime
                ? 'Tap to change the window'
                : 'Agents pick up between 9:30 and 17:00'}
            </AppText>
          </View>
          <AppText variant="label" color={brand.amber}>
            {hasTime ? 'Edit' : 'Select'}
          </AppText>
        </TouchableOpacity>

        {/* Location — required, inline */}
        <AppText variant="label" style={styles.sectionLabel}>
          2. Where should we collect?
        </AppText>
        <View style={styles.list}>
          {PICKUP_LOCATIONS.map((loc) => (
            <SelectableRow
              key={loc}
              title={loc}
              description={
                loc === 'Doorstep'
                  ? 'Leave with you or at the entrance'
                  : 'Hand to building reception'
              }
              selected={deliveryServices.pickupInstruction === loc}
              onPress={() =>
                setDeliveryServices({
                  ...deliveryServices,
                  pickupInstruction: loc,
                })
              }
            />
          ))}
        </View>

        {/* Notes — optional */}
        <AppText variant="label" style={styles.sectionLabel}>
          3. Special notes (optional)
        </AppText>
        <FormField
          label="Instructions for the driver"
          placeholder="e.g. Don’t ring the bell — call on arrival"
          value={deliveryServices.pickupSpecialInstruction}
          onChangeText={(text) =>
            setDeliveryServices({
              ...deliveryServices,
              pickupSpecialInstruction: text,
            })
          }
          multiline
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: 'top' }}
          hint="Shared with the assigned logistics agent"
        />
      </FlowScreen>

      <TimePickerModal
        openModal={openTimeModal}
        handleCloseModal={() => setOpenTimeModal(false)}
      />
    </>
  );
};

export default ShipmentSchedulePickup;

const styles = StyleSheet.create({
  summary: {
    borderWidth: 1,
    padding: Spacing.lg,
    gap: 4,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  summaryCol: {
    flex: 1,
    gap: 4,
  },
  metaPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.md,
  },
  sectionLabel: {
    marginTop: Spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionText: {
    flex: 1,
    gap: 4,
  },
  list: {
    gap: Spacing.sm,
  },
  hint: {
    textAlign: 'center',
    marginBottom: 2,
  },
});

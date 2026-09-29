import React from 'react';
import { StyleSheet, View } from 'react-native';
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';
import { router } from 'expo-router';
import { FlowScreen } from '@/components/wizard/FlowScreen';
import { AppText } from '@/components/AppText';
import CustomButton from '@/components/CustomButton';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { SHIPMENT_STEPS, shipmentNextLabel, shipmentStepIndex, shipmentStepKeyAt } from '@/constants/flowSteps';
import { goToShipmentStep } from '@/utils/resumeShipmentWizard';

const ShippingOptions = () => {
  const { savedAddressData, packageDetail, accountAddressData, itemType } = useShipmentStore();
  const { accountLoginData } = useLoginAccountStore();
  const { colors, radius } = useAppTheme();
  const step = shipmentStepIndex('shippingOptions');
  const nextLabel = shipmentNextLabel('shippingOptions');

  const from = {
    name: accountLoginData.name || accountAddressData.userName,
    line1: accountAddressData.addressOne,
    line2: [accountAddressData.city, accountAddressData.country?.name].filter(Boolean).join(', '),
    contact: [accountLoginData.email || accountAddressData.email, `${accountLoginData.mobileCode || accountAddressData.countryCode || ''} ${accountLoginData.mobileNumber || accountAddressData.mobileNumber || ''}`.trim()]
      .filter(Boolean)
      .join(' · '),
  };

  const to = {
    name: savedAddressData.name,
    line1: savedAddressData.addressOne,
    line2: [savedAddressData.city, savedAddressData.state].filter(Boolean).join(', '),
    contact: [savedAddressData.email, `${savedAddressData.countryCode || ''} ${savedAddressData.mobileNumber || ''}`.trim()]
      .filter(Boolean)
      .join(' · '),
  };

  return (
    <FlowScreen
      step={step}
      total={SHIPMENT_STEPS.length}
      stepLabel={SHIPMENT_STEPS[step - 1].label}
      nextLabel={nextLabel}
      onStepPress={(n) => {
        const key = shipmentStepKeyAt(n);
        if (key) goToShipmentStep(key);
      }}
      title="Confirm addresses"
      subtitle="Check the package summary and where this shipment goes."
      footer={
        <CustomButton
          buttonText="Continue to services"
          handlePress={() =>
            router.push('/(tabs)/home/createShipment/shippingOptionalService')
          }
        />
      }
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
        ]}
      >
        <AppText variant="label">Package</AppText>
        <AppText variant="h3">{packageDetail.packageName || itemType || 'Shipment'}</AppText>
        {itemType === 'PACKAGE' ? (
          <AppText variant="bodySmall" secondary>
            {packageDetail.length} × {packageDetail.width} × {packageDetail.height} cm
          </AppText>
        ) : null}
        <AppText variant="bodySmall" secondary>
          {packageDetail.numberOfPieces || '—'} piece(s) · {packageDetail.weight || '—'} kg
        </AppText>
      </View>

      <AddressBlock title="From" {...from} />
      <AddressBlock title="To" {...to} />
    </FlowScreen>
  );
};

function AddressBlock({
  title,
  name,
  line1,
  line2,
  contact,
}: {
  title: string;
  name?: string;
  line1?: string;
  line2?: string;
  contact?: string;
}) {
  const { colors, radius } = useAppTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`${title}: ${name || ''}`}
    >
      <AppText variant="label">{title}</AppText>
      <AppText variant="h3">{name || '—'}</AppText>
      {line1 ? (
        <AppText variant="bodySmall" secondary>
          {line1}
        </AppText>
      ) : null}
      {line2 ? (
        <AppText variant="bodySmall" secondary>
          {line2}
        </AppText>
      ) : null}
      {contact ? (
        <AppText variant="caption" muted style={styles.contact}>
          {contact}
        </AppText>
      ) : null}
    </View>
  );
}

export default ShippingOptions;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: Spacing.lg,
    gap: 4,
  },
  contact: {
    marginTop: Spacing.sm,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import useShipmentStore from '@/store/shipmentStore';
import { router } from 'expo-router';
import { FlowScreen } from '@/components/wizard/FlowScreen';
import { SelectableRow } from '@/components/forms/SelectableRow';
import { AppText } from '@/components/AppText';
import CustomButton from '@/components/CustomButton';
import { SHIPMENT_STEPS, shipmentNextLabel, shipmentStepIndex, shipmentStepKeyAt } from '@/constants/flowSteps';
import { goToShipmentStep } from '@/utils/resumeShipmentWizard';

const SERVICES = [
  {
    id: 'verbalNotification' as const,
    name: 'Verbal notification',
    description: 'Get a call before delivery',
    price: 10,
  },
  {
    id: 'adultSignature' as const,
    name: 'Adult signature',
    description: 'Delivered to an adult at the address',
    price: 20,
  },
  {
    id: 'directSignature' as const,
    name: 'Direct signature',
    description: 'Recipient must be available to sign',
    price: 20,
  },
];

const ShippingOptionalService = () => {
  const { deliveryServices, setDeliveryServices, setCuminativeExpence, cummilativeExpence } =
    useShipmentStore();
  const step = shipmentStepIndex('shippingOptionalService');
  const nextLabel = shipmentNextLabel('shippingOptionalService');

  const totalExtras =
    (cummilativeExpence.adultSignature || 0) +
    (cummilativeExpence.directSignature || 0) +
    (cummilativeExpence.verbalNotification || 0);

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
      title="Optional services"
      subtitle="Add any extras you need. You can continue without selecting any."
      footer={
        <>
          {totalExtras > 0 ? (
            <AppText variant="bodySmall" secondary style={styles.total}>
              Extras: AED {totalExtras}
            </AppText>
          ) : null}
          <CustomButton
            buttonText="Continue to pickup"
            handlePress={() =>
              router.push('/(tabs)/home/createShipment/shipmentSchedulePickup')
            }
          />
        </>
      }
    >
      <View style={styles.list}>
        {SERVICES.map((service) => {
          const selected = !!deliveryServices[service.id];
          return (
            <SelectableRow
              key={service.id}
              title={`${service.name} · AED ${service.price}`}
              description={service.description}
              selected={selected}
              onPress={() => {
                const next = !selected;
                setDeliveryServices({ [service.id]: next });
                setCuminativeExpence({ [service.id]: next ? service.price : 0 });
              }}
              accessibilityLabel={`${service.name}, ${service.price} dirhams`}
            />
          );
        })}
      </View>
    </FlowScreen>
  );
};

export default ShippingOptionalService;

const styles = StyleSheet.create({
  list: { gap: 12 },
  total: { textAlign: 'center', marginBottom: 4 },
});

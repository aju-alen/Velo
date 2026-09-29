import { InteractionManager } from 'react-native';
import { router } from 'expo-router';
import { SHIPMENT_STEPS, type ShipmentStepKey } from '@/constants/flowSteps';

const WIZARD_KEYS = SHIPMENT_STEPS.map((s) => s.key) as ShipmentStepKey[];

const PAST_CARRIER = new Set([
  'finalPreview',
  'payment',
  'paymentSuccess',
  'open-market-confrim',
]);

function shipmentPath(key: string) {
  return `/(tabs)/home/createShipment/${key}`;
}

/**
 * Open a draft with the full wizard stack under the resume step so the user
 * can go back and edit any previous step.
 */
export function resumeShipmentWizard(currentStep?: string | null) {
  let step = (currentStep || 'createShipmentHome') as string;

  // Live carrier quotes — never resume past the carrier screen with a frozen price
  if (PAST_CARRIER.has(step) || step === 'viewShippingOptions') {
    step = 'viewShippingOptions';
  }

  let idx = WIZARD_KEYS.indexOf(step as ShipmentStepKey);
  if (idx < 0) idx = 0;

  const stack = WIZARD_KEYS.slice(0, idx + 1);

  router.replace(shipmentPath(stack[0]) as any);

  if (stack.length === 1) return;

  InteractionManager.runAfterInteractions(() => {
    // Push remaining screens so hardware/back returns through editable steps
    stack.slice(1).forEach((key, i) => {
      setTimeout(() => {
        router.push(shipmentPath(key) as any);
      }, i * 30);
    });
  });
}

/** Jump to an earlier (or same) wizard step when it exists on the stack. */
export function goToShipmentStep(key: ShipmentStepKey) {
  const href = shipmentPath(key) as any;
  try {
    if (typeof router.dismissTo === 'function') {
      router.dismissTo(href);
      return;
    }
  } catch {
    // fall through
  }
  router.navigate(href);
}

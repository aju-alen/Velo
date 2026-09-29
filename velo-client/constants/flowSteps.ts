/** Canonical create-shipment wizard steps for progress UI */
export const SHIPMENT_STEPS = [
  { key: 'createShipmentHome', label: 'Details', title: 'Shipment details' },
  { key: 'shippingOptions', label: 'Addresses', title: 'Confirm addresses' },
  { key: 'shippingOptionalService', label: 'Services', title: 'Optional services' },
  { key: 'shipmentSchedulePickup', label: 'Pickup', title: 'Schedule pickup' },
  { key: 'viewShippingOptions', label: 'Carrier', title: 'Choose carrier' },
  { key: 'finalPreview', label: 'Review', title: 'Review & confirm' },
] as const;

export type ShipmentStepKey = (typeof SHIPMENT_STEPS)[number]['key'];

export function shipmentStepIndex(key: ShipmentStepKey) {
  return SHIPMENT_STEPS.findIndex((s) => s.key === key) + 1;
}

export function shipmentNextLabel(key: ShipmentStepKey) {
  const idx = SHIPMENT_STEPS.findIndex((s) => s.key === key);
  if (idx < 0 || idx >= SHIPMENT_STEPS.length - 1) return undefined;
  return SHIPMENT_STEPS[idx + 1].label;
}

/** 1-based step → route key */
export function shipmentStepKeyAt(stepNumber: number): ShipmentStepKey | undefined {
  return SHIPMENT_STEPS[stepNumber - 1]?.key;
}

/** Registration progress by role */
export const SENDER_REG_STEPS = [
  { key: 'register', label: 'Account' },
  { key: 'mobile', label: 'Phone' },
  { key: 'details', label: 'Address' },
] as const;

export const AGENT_REG_STEPS = [
  { key: 'register', label: 'Account' },
  { key: 'mobile', label: 'Phone' },
  { key: 'verify', label: 'ID' },
  { key: 'details', label: 'Business' },
  { key: 'appointment', label: 'Appointment' },
] as const;

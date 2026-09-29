/**
 * Live org quote math — always compute from current org rates + shipment inputs.
 * Never trust prices persisted in a draft.
 */

export type PricingPackageDetail = {
  numberOfPieces?: string | number;
  weight?: string | number;
};

export type PricingDeliveryServices = {
  verbalNotification?: boolean;
  adultSignature?: boolean;
  directSignature?: boolean;
};

export type PricingOrganisation = {
  documentPricePerPiece?: number | null;
  packagePricePerKg?: number | null;
  packagePricePerPiece?: number | null;
  deliveryTimeline?: number | null;
};

const VERBAL = 10;
const ADULT = 20;
const DIRECT = 20;

export function calculateBasePrice(
  itemType: string,
  packageDetail: PricingPackageDetail,
  org: PricingOrganisation
): number {
  const pieces = Number(packageDetail.numberOfPieces) || 0;
  const weight = Number(packageDetail.weight) || 0;

  if (itemType === 'DOCUMENT') {
    return (Number(org.documentPricePerPiece) || 0) * pieces;
  }
  if (itemType === 'PACKAGE') {
    const byWeight = (Number(org.packagePricePerKg) || 0) * weight;
    const byPiece = (Number(org.packagePricePerPiece) || 0) * pieces;
    return byWeight + byPiece;
  }
  return 0;
}

export function calculateCollectionCharge(basePrice: number): number {
  return basePrice * 0.1;
}

export function calculateExtras(deliveryServices: PricingDeliveryServices): number {
  return (
    (deliveryServices.verbalNotification ? VERBAL : 0) +
    (deliveryServices.adultSignature ? ADULT : 0) +
    (deliveryServices.directSignature ? DIRECT : 0)
  );
}

export function calculateFinalOrgPrice(
  itemType: string,
  packageDetail: PricingPackageDetail,
  deliveryServices: PricingDeliveryServices,
  org: PricingOrganisation
): { basePrice: number; collectionPrice: number; totalPrice: number } {
  const basePrice = calculateBasePrice(itemType, packageDetail, org);
  const collectionPrice = calculateCollectionCharge(basePrice);
  const totalPrice = basePrice + collectionPrice + calculateExtras(deliveryServices);
  return { basePrice, collectionPrice, totalPrice };
}

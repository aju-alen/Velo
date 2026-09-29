import { create } from 'zustand'

interface SavedAddressData {
  name: string
  companyName: string
  addressOne: string
  addressTwo: string
  city: string
  state: string
  email: string
  mobileNumber: string
  countryId: string
  residentAddress: boolean
  saveAddress: boolean
  countryCode: string
  zipCode: string
  gotDetails: boolean
  shipmentDate: Date | string
  deliveryDate: Date | string
}

interface AccountAddressData {
  addressOne: string
  addressTwo: string
  city: string
  countryId: string
  state: string
  country: {
    name: string
    id: number
  },
  userName: string
  email: string
  mobileNumber: string
  countryCode: string
}

interface PackageDetail {
  length: string
  height: string
  width: string
  numberOfPieces: string
  weight: string
  packageName: string
}

interface DeliveryServices {
  verbalNotification: boolean
  adultSignature: boolean
  directSignature: boolean
  deliveryPickupTimeFrom: string
  deliveryPickupTimeTo: string
  pickupInstruction: string
  pickupSpecialInstruction: string
}

interface CummilativeExpence {
  adultSignature: number
  directSignature: number
  verbalNotification: number
}

interface FinalShipmentData {
  totalPrice: number
  organisationId: string
  basePrice: number
  collectionPrice: number
  shippingMarket: string
}

interface AgentShipmentData {
  shipmentStatus: string
  shipmentId: string
}

export type ShipmentDraftPayload = {
  savedAddressData: SavedAddressData
  packageDetail: PackageDetail
  packageDescription: string
  accountAddressData: AccountAddressData
  deliveryServices: DeliveryServices
  cummilativeExpence: CummilativeExpence
  finalShipmentData: FinalShipmentData
  itemType: string
}

interface ShipmentState {
  savedAddressData: SavedAddressData
  packageDetail: PackageDetail
  packageDescription: string
  accountAddressData: AccountAddressData
  deliveryServices: DeliveryServices
  cummilativeExpence: CummilativeExpence
  finalShipmentData: FinalShipmentData
  agentShipmentData: AgentShipmentData
  itemType: string
  createShipment: Boolean
  editData: Boolean
  draftId: string | null
  setFinalShipmentData: (data: Partial<FinalShipmentData>) => void
  setAgentShipmentData: (data: Partial<AgentShipmentData>) => void
  setEditData: (data: Boolean) => void
  setCreateShipment: (data: Boolean) => void
  setSavedAddressData: (data: Partial<SavedAddressData>) => void
  setAccountAddressData: (data: Partial<AccountAddressData>) => void
  setPackageDetail: (data: Partial<PackageDetail>) => void
  setPackageDescription: (description: string) => void
  setDeliveryServices: (data: Partial<DeliveryServices>) => void
  setCuminativeExpence: (data: Partial<CummilativeExpence>) => void
  setItemType: (itemType: string) => void
  setDraftId: (draftId: string | null) => void
  getDraftPayload: () => ShipmentDraftPayload
  hydrateFromDraft: (payload: Partial<ShipmentDraftPayload>, draftId?: string | null) => void
  resetShipmentData: () => void
}

const emptySavedAddress = (): SavedAddressData => ({
  name: '',
  companyName: '',
  addressOne: '',
  addressTwo: '',
  city: '',
  state: '',
  email: '',
  mobileNumber: '',
  countryId: '',
  residentAddress: false,
  saveAddress: false,
  countryCode: '+971',
  zipCode: '',
  gotDetails: false,
  shipmentDate: new Date(),
  deliveryDate: new Date(),
})

const emptyAccountAddress = (): AccountAddressData => ({
  addressOne: '',
  addressTwo: '',
  city: '',
  countryId: '',
  state: '',
  country: { name: '', id: 0 },
  userName: '',
  email: '',
  mobileNumber: '',
  countryCode: '',
})

const emptyPackage = (): PackageDetail => ({
  packageName: '',
  length: '',
  height: '',
  width: '',
  numberOfPieces: '1',
  weight: '',
})

const emptyDelivery = (): DeliveryServices => ({
  verbalNotification: false,
  adultSignature: false,
  directSignature: false,
  deliveryPickupTimeFrom: '9:30',
  deliveryPickupTimeTo: '17:00',
  pickupInstruction: '',
  pickupSpecialInstruction: '',
})

const emptyExpense = (): CummilativeExpence => ({
  adultSignature: 0,
  directSignature: 0,
  verbalNotification: 0,
})

const emptyFinal = (): FinalShipmentData => ({
  totalPrice: 0,
  organisationId: '',
  basePrice: 0,
  collectionPrice: 0,
  shippingMarket: '',
})

const useShipmentStore = create<ShipmentState>((set, get) => ({
  savedAddressData: emptySavedAddress(),
  accountAddressData: emptyAccountAddress(),
  deliveryServices: emptyDelivery(),
  packageDetail: emptyPackage(),
  packageDescription: '',
  itemType: '',
  createShipment: false,
  editData: false,
  draftId: null,
  cummilativeExpence: emptyExpense(),
  finalShipmentData: emptyFinal(),
  agentShipmentData: { shipmentStatus: '', shipmentId: '' },

  setFinalShipmentData: (data) =>
    set((state) => ({
      finalShipmentData: { ...state.finalShipmentData, ...data },
    })),
  setSavedAddressData: (data) =>
    set((state) => ({
      savedAddressData: { ...state.savedAddressData, ...data },
    })),
  setAccountAddressData: (data) =>
    set((state) => ({
      accountAddressData: { ...state.accountAddressData, ...data },
    })),
  setPackageDetail: (data) =>
    set((state) => ({
      packageDetail: { ...state.packageDetail, ...data },
    })),
  setPackageDescription: (description) => set(() => ({ packageDescription: description })),
  setDeliveryServices: (data) =>
    set((state) => ({
      deliveryServices: { ...state.deliveryServices, ...data },
    })),
  setCuminativeExpence: (data) =>
    set((state) => ({
      cummilativeExpence: { ...state.cummilativeExpence, ...data },
    })),
  setItemType: (itemType) => set(() => ({ itemType })),
  setCreateShipment: (data) => set(() => ({ createShipment: data })),
  setEditData: (data) => set(() => ({ editData: data })),
  setAgentShipmentData: (data) =>
    set((state) => ({
      agentShipmentData: { ...state.agentShipmentData, ...data },
    })),
  setDraftId: (draftId) => set(() => ({ draftId })),

  getDraftPayload: () => {
    const state = get()
    return {
      savedAddressData: state.savedAddressData,
      packageDetail: state.packageDetail,
      packageDescription: state.packageDescription,
      accountAddressData: state.accountAddressData,
      deliveryServices: state.deliveryServices,
      cummilativeExpence: state.cummilativeExpence,
      // Never persist carrier quotes — org rates change; always recompute live
      finalShipmentData: emptyFinal(),
      itemType: state.itemType,
    }
  },

  hydrateFromDraft: (payload, draftId = null) => {
    const reviveDates = (address?: Partial<SavedAddressData>) => {
      if (!address) return emptySavedAddress()
      const merged = {
        ...emptySavedAddress(),
        ...address,
        shipmentDate: address.shipmentDate ? new Date(address.shipmentDate) : new Date(),
        deliveryDate: address.deliveryDate ? new Date(address.deliveryDate) : new Date(),
      }
      // Show package/address sections when resuming mid-flow
      if (
        !merged.gotDetails &&
        (merged.name || merged.addressOne || payload.packageDetail?.numberOfPieces)
      ) {
        merged.gotDetails = true
      }
      return merged
    }

    set(() => ({
      savedAddressData: reviveDates(payload.savedAddressData),
      packageDetail: { ...emptyPackage(), ...(payload.packageDetail || {}) },
      packageDescription: payload.packageDescription || '',
      accountAddressData: { ...emptyAccountAddress(), ...(payload.accountAddressData || {}) },
      deliveryServices: { ...emptyDelivery(), ...(payload.deliveryServices || {}) },
      cummilativeExpence: { ...emptyExpense(), ...(payload.cummilativeExpence || {}) },
      // Drop any stale quotes stored in older drafts
      finalShipmentData: emptyFinal(),
      itemType: payload.itemType || '',
      draftId: draftId || null,
      createShipment: true,
      editData: true,
    }))
  },

  resetShipmentData: () =>
    set(() => ({
      savedAddressData: emptySavedAddress(),
      accountAddressData: emptyAccountAddress(),
      deliveryServices: emptyDelivery(),
      packageDetail: emptyPackage(),
      packageDescription: '',
      cummilativeExpence: emptyExpense(),
      finalShipmentData: emptyFinal(),
      itemType: '',
      draftId: null,
      editData: false,
      createShipment: false,
      agentShipmentData: { shipmentStatus: '', shipmentId: '' },
    })),
}))

export default useShipmentStore

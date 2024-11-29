import { create } from 'zustand'

// Define interfaces for your state
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
  shipmentDate: Date
  deliveryDate: Date
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

// Define the store state interface
interface ShipmentState {
  savedAddressData: SavedAddressData
  packageDetail: PackageDetail
  packageDescription: string
  accountAddressData: AccountAddressData
  deliveryServices: DeliveryServices
  cummilativeExpence: CummilativeExpence
  itemType: string
  createShipment: Boolean
  editData: Boolean
  setEditData: (data: Boolean) => void
  setCreateShipment: (data: Boolean) => void
  setSavedAddressData: (data: Partial<SavedAddressData>) => void
  setAccountAddressData: (data: Partial<AccountAddressData>) => void
  setPackageDetail: (data: Partial<PackageDetail>) => void
  setPackageDescription: (description: string) => void
  setDeliveryServices: (data: Partial<DeliveryServices>) => void
  setCuminativeExpence: (data: Partial<CummilativeExpence>) => void
  setItemType: (itemType: string) => void
  resetShipmentData: () => void
}

// Create the store with types
const useShipmentStore = create<ShipmentState>((set) => ({
  // Address Data
  savedAddressData: {
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
    countryCode: '',
    zipCode: '',
    gotDetails: false,
    shipmentDate: new Date(),
    deliveryDate: new Date()

  },
  accountAddressData: {
    addressOne:'',
    addressTwo:'',
    city:'',
    countryId:'',
    state:'',
    country:{
      name:"",
      id:0
    },
    userName:'',
    email:'',
    mobileNumber:'',
    countryCode:'',

  },
  deliveryServices:{
    verbalNotification:false,
    adultSignature:false,
    directSignature:false,
    deliveryPickupTimeFrom:'9:30',
    deliveryPickupTimeTo:'17:00',
    pickupInstruction: '',
    pickupSpecialInstruction: ''    
  },

  // Package Details
  packageDetail: {
    packageName:'',
    length: '',
    height: '',
    width: '',
    numberOfPieces: '',
    weight: ''
  },

  // Package Description
  packageDescription: '',
  itemType: '',
  createShipment: false,
  editData: false,

  cummilativeExpence : {
    adultSignature:0,
    directSignature: 0,
    verbalNotification: 0,
  },

  // Actions
  setSavedAddressData: (data) => 
    set((state) => ({
      savedAddressData: {
        ...state.savedAddressData,
        ...data
      }
    })),

    setAccountAddressData: (data) =>
    set((state) => ({
      accountAddressData: {
        ...state.accountAddressData,
        ...data
      }
    })),

  setPackageDetail: (data) =>
    set((state) => ({
      packageDetail: {
        ...state.packageDetail,
        ...data
      }
    })),

  setPackageDescription: (description) =>
    set(() => ({
      packageDescription: description
    })),

  setDeliveryServices: (data) =>
    set((state) => ({
      deliveryServices: {
        ...state.deliveryServices,
        ...data
      }
    })),

    setCuminativeExpence: (data) =>
    set((state) => ({
      cummilativeExpence: {
        ...state.cummilativeExpence,
        ...data
      }
    })),

  setItemType: (itemType) =>
    set(() => ({
      itemType
    })),

  setCreateShipment: (data) =>
    set(() => ({
      createShipment: data
    })),

    setEditData: (data)=>
      set(()=>({
        editData:data
      })),


  // Reset all data
  resetShipmentData: () =>
    set(() => ({
     savedAddressData: {
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
    countryCode: '',
    zipCode: '',
    gotDetails: false,
    shipmentDate: new Date(),
    deliveryDate: new Date()
  },
  accountAddressData: {
    addressOne:'',
    addressTwo:'',
    city:'',
    countryId:'',
    state:'',
    country:{
      name:"",
      id:0
    },
    userName:'',
    email:'',
    mobileNumber:'',
    countryCode:'',

  },
  deliveryServices:{
    verbalNotification:false,
    adultSignature:false,
    directSignature:false,
    deliveryPickupTimeFrom:'',
    deliveryPickupTimeTo:'',
    pickupInstruction: '',
    pickupSpecialInstruction: ''
  },
  packageDetail: {
    packageName:'',
    length: '',
    height: '',
    width: '',
    numberOfPieces: '',
    weight: '',
   
  },
  packageDescription: '',

  cummilativeExpence : {
    adultSignature:0,
    directSignature: 0,
    verbalNotification: 0,
  },

    }))
}))

export default useShipmentStore
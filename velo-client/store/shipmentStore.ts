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
  }
}

interface PackageDetail {
  length: string
  height: string
  width: string
  numberOfPieces: string
  weight: string
  packageName: string
}

// Define the store state interface
interface ShipmentState {
  savedAddressData: SavedAddressData
  packageDetail: PackageDetail
  packageDescription: string
  accountAddressData: AccountAddressData
  setSavedAddressData: (data: Partial<SavedAddressData>) => void
  setAccountAddressData: (data: Partial<AccountAddressData>) => void
  setPackageDetail: (data: Partial<PackageDetail>) => void
  setPackageDescription: (description: string) => void
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
    gotDetails: false
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
    }
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
        gotDetails: false
      }
    }))
}))

export default useShipmentStore
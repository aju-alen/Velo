import { create } from 'zustand'

const useShipmentStore = create((set) => ({
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
    residentAddress: '',
    saveAddress: '',
    countryCode: '',
    zipCode: ''
  },
  
  // Package Details
  packageDetail: {
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
        residentAddress: '',
        saveAddress: '',
        countryCode: '',
        zipCode: ''
      },
      packageDetail: {
        length: '',
        height: '',
        width: '',
        numberOfPieces: '',
        weight: ''
      },
      packageDescription: ''
    }))
}))

export default useShipmentStore
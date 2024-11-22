import { StyleSheet,  Modal, TouchableOpacity, Dimensions, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState,useCallback } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider, RadioButton } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import { useColorScheme } from '@/hooks/useColorScheme'
import SaveAddressForm from '@/components/SaveAddressForm'
import SelectPackage from '@/components/SelectPackage'
import ShipmentDetailPayment from '@/components/ShipmentDetailPayment'
import { router, useFocusEffect } from 'expo-router'
import useShipmentStore from '@/store/shipmentStore'


const { width } = Dimensions.get('window')

const CreateShipmentHome = () => {
  const { 
    setPackageDetail,
    setPackageDescription,
    savedAddressData,
    setSavedAddressData,
    resetShipmentData,
    accountAddressData,
    setAccountAddressData,
  } = useShipmentStore()

  // console.log(accountAddressData, 'accountAddressData in parent data');
  
  const colorScheme = useColorScheme()
  const [userSecureStorage, setUserSecureStorage] = useState(false)

  const [userAddress, setUserAddress] = useState('')
  const [modalVisible, setModalVisible] = useState(true)
  const [addressModalVisible, setAddressModalVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(Platform.OS === 'ios' ? true : false);
  const [checked, setChecked] = useState('false');
  const [buttonClick, setButtonClick] = useState(false)

  console.log(date, 'date----');
  



  //modal useState
  const [countryList, setCountryList] = useState([]);
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState(null)

  
  // console.log(savedAddressData, 'savedAddressData in parent data');
  

  // console.log(userSecureStorage, 'userSecureStorage in parent data');
  

  

  const handleGetDescription = (description) => {
    setPackageDescription(description)
  }


  const handlePackagedetail = (dimension, piece, weight) => {
    setPackageDetail({
      length: dimension.length,
      height: dimension.height,
      width: dimension.width,
      numberOfPieces: piece,
      weight: (Number(weight) * Number(piece)).toString(),
    })
  }
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      setButtonClick(false)
      setSavedAddressData({
        ...savedAddressData,
        gotDetails: false
      })
    }, [])
  )

  const handleContinuePackageDetail = () => {
    setButtonClick(true)
    setAccountAddressData({
      ...accountAddressData,
      userName: userSecureStorage['name'],
      email: userSecureStorage['email'],
      mobileNumber: userSecureStorage['mobileNumber'],
      countryCode: userSecureStorage['mobileCode']
    })


    console.log('Clicked-----');
    router.push('/home/createShipment/shippingOptions')
  }


  const handleCloseSaveAddressModal = () => {
    setAddressModalVisible(false)
  }

  useEffect(() => {
    if (!addressModalVisible) return;

    const getAllCountries = async () => {
      try {
        const allCountry = await axios.get(`${ipURL}/api/country/get-all-countries`);
        setCountryList(allCountry.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    getAllCountries();
  }, [addressModalVisible]);  // Depend directly on addressModalVisible

  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then(response => response.json())
      .then(data => {
        let areaData = data.map((item) => ({
          code: item.alpha2Code,
          item: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
        }))
        setAreas(areaData)

        if (areaData.length > 0) {
          let defaultData = areaData.filter((a: any) => a.code == "AE")
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0])
          }
        }
      })
      .catch(error => {
        console.error('Error fetching country data:', error)
        alert('Failed to load country data')
      })
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      let user = await SecureStore.getItemAsync('registerDetail')
      if (!user) return
      const userData = JSON.parse(user)
      // console.log(userData, 'userData------');

      
      setUserSecureStorage(userData)
      
    }
    checkUser()
  }, [])

  useEffect(() => {
    const getUserAddress = async () => {
      const userAddress = await axios.get(`${ipURL}/api/address/get-user-address/${userSecureStorage['id']}`)
      setUserAddress(userAddress.data.data[0])
      // console.log(userAddress.data.data[0], 'userAddress----2-1-21-2-12-1-212');
      setAccountAddressData({
        ...accountAddressData,
        addressOne: userAddress.data.data[0].addressOne,
        addressTwo: userAddress.data.data[0].addressTwo,
        city: userAddress.data.data[0].city,
        countryId: userAddress.data.data[0].countryId,
        state: userAddress.data.data[0].state,
        country: userAddress.data.data[0].country
      })

      
    }
    if (checked === 'document' || checked === 'package') {
      getUserAddress();
    }
  }, [checked === 'document' || checked === 'package'])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setModalVisible(false)
    resetShipmentData()

  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    console.log(currentDate, 'currentDate');
    
    setSavedAddressData({
      ...savedAddressData,
      shipmentDate: currentDate
    })
    setShow(Platform.OS === 'ios' ? true : false);
  };
  // console.log(savedAddressData, 'savedAddressData-----asdasd-----121-2-12-12');
  




  const PaymentOption = ({ title, description, buttonText, isSecondary, onPress }) => (
    <ThemedView style={styles.section}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <ThemedText style={styles.sectionDescription}>{description}</ThemedText>
      </ThemedView>
      <TouchableOpacity
        style={[styles.actionButton, isSecondary && styles.secondaryButton]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <ThemedText style={[styles.buttonText, isSecondary && styles.secondaryButtonText]}>
          {buttonText}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )


  return (
    <ThemedView style={styles.container}>
      {/* Modal component remains unchanged */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Payment Method</ThemedText>

            <PaymentOption
              title="Online Payment"
              description="Pay securely using your credit/debit card or digital wallet"
              buttonText="Pay Online"
              isSecondary={false}
              onPress={() => handleOptionSelect({ id: 1, text: 'Online Payment' })}
            />

            <ThemedView style={styles.divider} />

            <PaymentOption
              title="Pay During Collection"
              description="Pay with cash or card when your package is picked up"
              buttonText="Pay Later"
              isSecondary
              onPress={() => handleOptionSelect({ id: 2, text: 'Payment during pickup' })}
            />
          </ThemedView>
        </ThemedView>
      </Modal>
      <SaveAddressForm
        addressModalVisible={addressModalVisible}
        onClose={handleCloseSaveAddressModal}
        userId={userSecureStorage['id']}
      />

<ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
      <ThemedView >
        {/* Shipping Date Section */}

        {Platform.OS === 'ios' &&<ThemedView style={styles.section}>
          <ThemedView style={styles.shippingDateContainer}>
            <ThemedText style={styles.sectionHeaderText}>Shipping Date</ThemedText>
            
           {show && <DateTimePicker
              testID="dateTimePicker"
              value={savedAddressData.shipmentDate}
              mode={'date'}
              onChange={onChange}
              minimumDate={new Date()}
              maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
            />}
          </ThemedView>
        </ThemedView>}

        {/* Shipping Type Section */}
        <ThemedView style={styles.section}>

        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>Shipment Details</ThemedText>
          <ThemedView style={styles.titleUnderline} />
        </ThemedView>
          <ThemedView style={styles.shippingTypeContainer}>
            <TouchableOpacity
              style={[
                styles.shippingTypeOption,
                checked === 'document' && styles.shippingTypeSelected
              ]}
              onPress={() => {
                setChecked('document')

              }}
            >
              <RadioButton
                value="document"
                status={checked === 'document' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('document')

                }}
              />
              <ThemedText style={styles.shippingTypeText}>Document</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.shippingTypeOption,
                checked === 'package' && styles.shippingTypeSelected
              ]}
              onPress={() => {
                setChecked('package')

              }}
            >
              <RadioButton
                value="package"
                status={checked === 'package' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('package')

                }}
              />
              <ThemedText style={styles.shippingTypeText}>Package</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Shipping Address Section */}
        {checked !== 'false' && 
         ( <>
            <ThemedView style={styles.section}>

              <ThemedText style={styles.sectionHeaderText}>Shipping From</ThemedText>
              <ThemedView style={styles.addressCard}>
                <ThemedText style={styles.addressName}>{userSecureStorage['name']}</ThemedText>
                <ThemedText style={styles.addressText}>{accountAddressData.addressOne}</ThemedText>
                <ThemedText style={styles.addressText}>{accountAddressData.addressTwo}</ThemedText>
                <ThemedText style={styles.addressText}>
                  {accountAddressData.city}, {accountAddressData.country.name}
                </ThemedText>
                <ThemedView style={styles.contactInfo}>
                  <ThemedText style={styles.contactText}>{userSecureStorage['email']}</ThemedText>
                  <ThemedText style={styles.contactText}>
                    {userSecureStorage['mobileCode']} {userSecureStorage['mobileNumber']}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.section}>

              <ThemedText style={styles.sectionHeaderText}>Shipping To</ThemedText>
              
              <ThemedView style={styles.addressCard}>
                {savedAddressData.gotDetails &&
                <>
                <ThemedText style={styles.addressName}>{savedAddressData.name}</ThemedText>
                <ThemedText style={styles.addressText}>{savedAddressData.addressOne}</ThemedText>
                <ThemedText style={styles.addressText}>{savedAddressData.addressTwo}</ThemedText>
                <ThemedText style={styles.addressText}>
                  {savedAddressData.city}, {savedAddressData.countryId}
                </ThemedText>
                <ThemedText style={styles.addressText}>
                  PinCode:{savedAddressData.zipCode}
                </ThemedText>
                <ThemedView style={styles.contactInfo}>
                  <ThemedText style={styles.contactText}>{savedAddressData.email}</ThemedText>
                  <ThemedText style={styles.contactText}>{savedAddressData.countryCode} {savedAddressData.mobileNumber}
                  </ThemedText>
                </ThemedView>
                </>
              }
                <TouchableOpacity style={styles.addAddressContainer} onPress={() => setAddressModalVisible(true)}>

                  <ThemedText style={styles.addressName}>Add New Address</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
            <Divider style={{ marginVertical: verticalScale(16) }} />
          </>) 
        }
       
       
       {savedAddressData.gotDetails && <SelectPackage getPackageDetail={handlePackagedetail} onButtonclick={buttonClick} />}
      
        {savedAddressData.gotDetails && <ShipmentDetailPayment onGetData={handleGetDescription} onButtonclick={buttonClick} />}

       { savedAddressData.gotDetails &&<TouchableOpacity style={styles.actionButton} onPress={handleContinuePackageDetail}>
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>  }
      </ThemedView>
      </ScrollView>
    </ThemedView>
    
  )
}

const styles = StyleSheet.create({
  // Keeping existing modal styles unchanged
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(100),
  },
  modalContent: {
    borderRadius: 16,
    width: width * 0.9,
    paddingVertical: verticalScale(24),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(24),
    paddingHorizontal: horizontalScale(20),
  },
  section: {

    paddingHorizontal: horizontalScale(10),
    marginBottom: verticalScale(16),

  },
  shippingDateContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    marginTop: verticalScale(16),
  },
  sectionHeader: {
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  actionButton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(16),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFAC1C',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',

  },
  secondaryButtonText: {

  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: verticalScale(16),
  },

  // New and enhanced styles
  container: {
    flex: 1,
    

  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingBottom:verticalScale(80)
  },

  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },

  shippingTypeContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(8),
    
  },
  shippingTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: horizontalScale(16),
    paddingVertical: verticalScale(12),

    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0,
  },
  shippingTypeSelected: {

    borderColor: '#FFAC1C',
    borderWidth: 1,
    paddingHorizontal: horizontalScale(12),
  },
  shippingTypeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addressCard: {

    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,

  },
  addressName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  addressText: {
    fontSize: 16,
    lineHeight: 24,

  },
  contactInfo: {
    marginTop: verticalScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  contactText: {
    fontSize: 14,

    marginBottom: verticalScale(4),
  },
  addAddressContainer: {
    padding: horizontalScale(10),
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryList: {
    padding: moderateScale(15),
  },

  countryCode: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },

  input: {
    height: verticalScale(50),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(15),
    marginBottom: verticalScale(15),
    fontSize: moderateScale(16),
    color: '#666',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(25),
    overflow: 'hidden',
    height: verticalScale(130),
  },
  picker: {
    color: '#fff',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(22),
  },
  title: {
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  titleUnderline: {
    width: horizontalScale(60),
    height: verticalScale(4),
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(2),
  },
});

export default CreateShipmentHome
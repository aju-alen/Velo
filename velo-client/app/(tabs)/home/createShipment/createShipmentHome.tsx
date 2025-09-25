import { StyleSheet,  Modal, TouchableOpacity, Dimensions, ScrollView, Platform,SafeAreaView, View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useState,useCallback } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Divider, RadioButton } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import SaveAddressForm from '@/components/SaveAddressForm'
import SelectPackage from '@/components/SelectPackage'
import ShipmentDetailPayment from '@/components/ShipmentDetailPayment'
import { router, useFocusEffect } from 'expo-router'
import useShipmentStore from '@/store/shipmentStore'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors';



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
    setItemType,
    setCreateShipment,
    editData,
  } = useShipmentStore()

  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [userSecureStorage, setUserSecureStorage] = useState(false)

  const [userAddress, setUserAddress] = useState('')
  const [modalVisible, setModalVisible] = useState(true)
  const [addressModalVisible, setAddressModalVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(Platform.OS === 'ios' ? true : false);
  const [checked, setChecked] = useState('false');
  const [buttonClick, setButtonClick] = useState(false)

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


  useEffect(()=>{
    if(editData){
      setModalVisible(false)
    }
  },[])

  const handleContinuePackageDetail = () => {
    setButtonClick(true)
    setAccountAddressData({
      ...accountAddressData,
      userName: userSecureStorage['name'],
      email: userSecureStorage['email'],
      mobileNumber: userSecureStorage['mobileNumber'],

      countryCode: userSecureStorage['mobileCode']

    })
    setSavedAddressData({
      ...savedAddressData,
      shipmentDate:date,
      deliveryDate: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
    })


    router.push('/home/createShipment/shippingOptions')
  }


  const handleCloseSaveAddressModal = () => {
    setAddressModalVisible(false)
  }

  // useEffect(() => {
  //   if (!addressModalVisible) return;

  //   const getAllCountries = async () => {
  //     try {
  //       const allCountry = await axios.get(`${ipURL}/api/country/get-all-countries`);
  //       setCountryList(allCountry.data);
  //     } catch (error) {
  //       console.error('Error fetching countries:', error);
  //     }
  //   };

  //   getAllCountries();
  // }, [addressModalVisible]);  // Depend directly on addressModalVisible

  

  useEffect(() => {
    const checkUser = async () => {
      let user = await SecureStore.getItemAsync('registerDetail')
      if (!user) return
      const userData = JSON.parse(user)

      setUserSecureStorage(userData)      
    }
    checkUser()
  }, [])
  console.log(userSecureStorage, 'userSecureStorage------');
  

  

  useEffect(() => {
    const getUserAddress = async () => {
      const userAddress = await axios.get(`${ipURL}/api/address/get-user-address/${userSecureStorage['id']}`)
      setUserAddress(userAddress.data.data[0])

      console.log(userAddress.data.data[0], 'userAddress.data.data[0]------');
      
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
    if (checked === 'DOCUMENT' || checked === 'PACKAGE') {
      getUserAddress();
    }
  }, [checked])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setModalVisible(false)
    resetShipmentData()
    setCreateShipment(true)

  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);

    
    setSavedAddressData({
      ...savedAddressData,
      shipmentDate: currentDate
    })
    setShow(Platform.OS === 'ios' ? true : false);
  };

  const onChangeAndroid = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeAndroid,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };
  




  const PaymentOption = ({ title, description, buttonText, isSecondary, onPress }) => (
    <View style={[styles.section, { backgroundColor: themeColors.background }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{title}</Text>
        <Text style={[styles.sectionDescription, { color: themeColors.text }]}>{description}</Text>
      </View>
      <TouchableOpacity
        style={[styles.actionButton, isSecondary && styles.secondaryButton]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, isSecondary && styles.secondaryButtonText, { color: isSecondary ? '#FFAC1C' : 'white' }]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  )


  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      {/* Modal component remains unchanged */}
     {!editData &&  <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
            <View style={styles.shippingMethodHeadContainer}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Select Shipping Method</Text>
            <TouchableOpacity
                      onPress={()=>{
                        setCreateShipment(false)
                        router.push('/home/homeMainPage')}}

                    >
                      <MaterialIcons name="close" size={24} color= {colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
            </View>

            <PaymentOption
              title="Ship and pay online"
              description="Pay securely using your credit/debit card or digital wallet"
              buttonText="Pay Online"
              isSecondary={false}
              onPress={() => handleOptionSelect({ id: 1, text: 'Online Payment' })}
            />

            <View style={[styles.divider, { backgroundColor: themeColors.text }]} />

            <PaymentOption
              title="Ship and pay on collection"
              description="Pay with cash or card when your package is picked up"
              buttonText="Pay Later"
              isSecondary
              onPress={() => handleOptionSelect({ id: 2, text: 'Payment during pickup' })}
            />
          </View>
        </View>
      </Modal>}
      <SaveAddressForm
        addressModalVisible={addressModalVisible}
        onClose={handleCloseSaveAddressModal}
        userId={userSecureStorage['id']}
      />

{(!modalVisible || editData) && <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
      <View >
        {/* Shipping Date Section */}

        {Platform.OS === 'ios' &&<View style={[styles.section, { backgroundColor: themeColors.background }]}>
          <View style={styles.shippingDateContainer}>
            <Text style={[styles.sectionHeaderText, { color: themeColors.text }]}>Shipping Date</Text>
            
           {show && <DateTimePicker
              testID="dateTimePicker"
              value={savedAddressData.shipmentDate}
              mode={'date'}
              onChange={onChange}
              minimumDate={new Date()}
              maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
            />}


          </View>
        </View>}

        {Platform.OS === 'android' && <SafeAreaView style={[styles.section, { backgroundColor: themeColors.background }]}>
          <View style={styles.shippingDateContainer}>
          <Text style={[styles.sectionHeaderText, { color: themeColors.text }]}>Shipping Date</Text>
      <TouchableOpacity onPress={showDatepicker} style={styles.androidDateButton}  >
        <Text style={{ color: 'white' }}>{date.toDateString()}</Text>
      </TouchableOpacity>
      
      </View>
    </SafeAreaView>}

        {/* Shipping Type Section */}
        <View style={[styles.section, { backgroundColor: themeColors.background }]}>

        <View style={styles.titleContainer}>

          
        </View>
          <View style={styles.shippingTypeContainer}>
            <TouchableOpacity
              style={[
                styles.shippingTypeOption,
                checked === 'DOCUMENT' && styles.shippingTypeSelected
              ]}
              onPress={() => {
                setChecked('DOCUMENT')
                setItemType('DOCUMENT')
                resetShipmentData()

              }}
            >
              <RadioButton
                value="DOCUMENT"
                status={checked === 'DOCUMENT' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('DOCUMENT')
                  setItemType('DOCUMENT')
                  resetShipmentData()

                }}
              />
              <Text style={[styles.shippingTypeText, { color: themeColors.text }]}>Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.shippingTypeOption,
                checked === 'PACKAGE' && styles.shippingTypeSelected
              ]}
              onPress={() => {
                setChecked('PACKAGE')
                setItemType('PACKAGE')
                resetShipmentData()

              }}
            >
              <RadioButton
                value="PACKAGE"
                status={checked === 'PACKAGE' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('PACKAGE')
                  setItemType('PACKAGE')
                  resetShipmentData()

                }}
              />
              <Text style={[styles.shippingTypeText, { color: themeColors.text }]}>Package</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipping Address Section */}
        {checked !== 'false'  && 
         ( <>
            <View style={[styles.section, { backgroundColor: themeColors.background }]}>

              <Text style={[styles.sectionHeaderText, { color: themeColors.text }]}>Shipping From</Text>
              <View style={[styles.addressCard, { backgroundColor: themeColors.background }]}>
                <Text style={[styles.addressName, { color: themeColors.text }]}>{userSecureStorage['name']}</Text>
                <Text style={[styles.addressText, { color: themeColors.text }]}>{accountAddressData.addressOne}</Text>
                <Text style={[styles.addressText, { color: themeColors.text }]}>{accountAddressData.addressTwo}</Text>
                <Text style={[styles.addressText, { color: themeColors.text }]}>
                  {accountAddressData.city}, {accountAddressData.country.name}
                </Text>
                <View style={[styles.contactInfo, { borderTopColor: themeColors.text }]}>
                  <Text style={[styles.contactText, { color: themeColors.text }]}>{userSecureStorage['email']}</Text>
                  <Text style={[styles.contactText, { color: themeColors.text }]}>
                    {userSecureStorage['mobileCode']} {userSecureStorage['mobileNumber']}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.section, { backgroundColor: themeColors.background }]}>

              <Text style={[styles.sectionHeaderText, { color: themeColors.text }]}>Shipping To</Text>
              
              <View style={[styles.addressCard, { backgroundColor: themeColors.background }]}>
                {savedAddressData.gotDetails &&
                <>
                <Text style={[styles.addressName, { color: themeColors.text }]}>{savedAddressData.name}</Text>
                <Text style={[styles.addressText, { color: themeColors.text }]}>{savedAddressData.addressOne}</Text>
                <Text style={[styles.addressText, { color: themeColors.text }]}>{savedAddressData.addressTwo}</Text>
                <Text style={[styles.addressText, { color: themeColors.text }]}>
                  {savedAddressData.city}, {savedAddressData.countryId}
                </Text>
                <Text style={[styles.addressText, { color: themeColors.text }]}>
                  ZipCode:{savedAddressData.zipCode}
                </Text>
                <View style={[styles.contactInfo, { borderTopColor: themeColors.text }]}>
                  <Text style={[styles.contactText, { color: themeColors.text }]}>{savedAddressData.email}</Text>
                  <Text style={[styles.contactText, { color: themeColors.text }]}>{savedAddressData.countryCode} {savedAddressData.mobileNumber}
                  </Text>
                </View>
                </>
              }
                <TouchableOpacity style={styles.addAddressContainer} onPress={() => setAddressModalVisible(true)}>

                  <Text style={[styles.addressName, { color: themeColors.text }]}>Add New Address</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Divider style={{ marginVertical: verticalScale(16) }} />
          </>) 
        }
       
       
       {savedAddressData.gotDetails && <SelectPackage itemType={checked} getPackageDetail={handlePackagedetail} onButtonclick={buttonClick} />}
      
        {savedAddressData.gotDetails && <ShipmentDetailPayment itemType={checked} onGetData={handleGetDescription} onButtonclick={buttonClick} />}

       { savedAddressData.gotDetails &&<TouchableOpacity style={styles.actionButton} onPress={handleContinuePackageDetail}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>  }
      </View>
      </ScrollView>}
    </View>
    
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
  shippingMethodHeadContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center",
    marginBottom:verticalScale(20),
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
 
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
    color: 'white',

  },
  secondaryButtonText: {

  },
  divider: {
    height: 1,
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
  androidDateButton:{
    backgroundColor: '#FFAC1C',
    padding: verticalScale(10),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',

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
import { StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, FlatList, Platform, View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from './CustomButton'
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import useShipmentStore from '@/store/shipmentStore'
import AntDesign from '@expo/vector-icons/AntDesign';
import useLoginAccountStore from '@/store/loginAccountStore'
import axiosInstance from '@/constants/axiosHeader'
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window')

const SaveAddressForm = ({ addressModalVisible, onClose, userId }) => {
  const {  setSavedAddressData, resetShipmentData } = useShipmentStore()
const {accountLoginData} = useLoginAccountStore()

  const savedAddressData = useShipmentStore(state => state.savedAddressData)
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];


  console.log(savedAddressData,'savedAddressData------______');
  



  const [countryCodeModal, setCountryCodeModal] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)
  const [areas, setAreas] = useState([])
  const [countryList, setCountryList] = useState([]);
  const [contactModal, setContactModal] = useState(false)
  const [savedContact, setSavedContact] = useState([])
  console.log(savedContact,'savedContact');
  
console.log(savedAddressData,'savedAddressData------______');



 

  useEffect(() => {
    if (areas.length > 0) return; // Prevent refetch
    fetch("https://restcountries.com/v3.1/all/?fields=cca2,name,idd,flag")
      .then(response => response.json())
      .then(data => {
        
        const areaData = data.map(item =>{
          console.log(item,'item----');
          
          return ({
            code: item.cca2,
            item: item.name.common,
            callingCode: `${item.idd.root}`,
            flag: `https://flagsapi.com/${item.cca2}/flat/64.png`,
          })
        })
          

        setAreas(areaData);
        console.log('areaData:', areaData);
        
  
        const defaultArea = areaData.find(a => a.callingCode === "+971");
        console.log('defaultArea:', defaultArea);
        
        if (defaultArea) {
          setSelectedArea(defaultArea);
          setSavedAddressData({ countryCode: defaultArea.callingCode });
        }
      })
      .catch(error => {
        console.error("Error fetching country data:", error);
        alert("Failed to load country data");
      });
  }, [areas]);

  useEffect(() => {
    const getAllSavedAddress = async () => {
      try {
        console.log('userId:', userId);

        
        const savedAddress = await axiosInstance.get(`/api/address/get-external-user-address/${accountLoginData['id']}`);

        setSavedContact(savedAddress.data.data)
      } catch (error) {
        console.error('Error fetching saved addresses:', error)
      }
    }
    getAllSavedAddress()
  }, [contactModal])
  

  useEffect(() => {
    if (!addressModalVisible) return;

    const getAllCountries = async () => {
      try {
        const allCountry = await axiosInstance.get(`/api/country/get-all-countries`);
        setCountryList(allCountry.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    getAllCountries();
  }, [addressModalVisible]);

  const CheckboxItem = ({ label, status, onPress }) => (
    <View style={[styles.checkboxTextContainer, { backgroundColor: themeColors.background }]}>
      <View style={[styles.checboxContainer,{
         borderRadius: Platform.OS === 'ios' ? moderateScale(4) : moderateScale(0),
         borderWidth:Platform.OS === 'ios' ? moderateScale(2) : moderateScale(0),

      }]}>

        <Checkbox
          status={status ? 'checked' : 'unchecked'}
          onPress={onPress}
          color="#FFAC1C"
        />
      </View>
      <Text style={[styles.checkboxLabel, { color: themeColors.text }]}>{label}</Text>
    </View>
  )

  const handleClear = () => {
    try {
      resetShipmentData()

    }
    catch (error) {
      console.error('Error clearing form:', error)
    }
  }

  const handleSave = async () => {


    try {
      if (savedAddressData.saveAddress) {
        console.log(savedAddressData,'savedAddressData----- in saveHandle function');
        
        const addressData = {
          name: savedAddressData.name,
          companyName: savedAddressData.companyName,
          addressOne: savedAddressData.addressOne,
          addressTwo: savedAddressData.addressTwo,
          city: savedAddressData.city,
          state: savedAddressData.state,
          email: savedAddressData.email,
          mobileNumber: savedAddressData.mobileNumber,
          countryId: savedAddressData.countryId,
          residentAddress: savedAddressData.residentAddress,
          saveAddress: savedAddressData.saveAddress,
          userId,
          countryCode: savedAddressData.countryCode === ''? "+971" : savedAddressData.countryCode,
          zipCode: savedAddressData.zipCode
        }
        try {
          const saveAddressToDB = await axios.post(`${ipURL}/api/address/save-external-user-address`, addressData)
          console.log('Address saved:', saveAddressToDB.data)
        }
        catch (error) {
          console.error('Error saving address:', error)
        }
      }
      onClose()
      setSavedAddressData({gotDetails: true})
    }
    catch (error) {
      console.error('Error saving address:', error)
    }
  }

  const renderAreaItem = ({ item }) => {    
    return(
    <TouchableOpacity
      style={[styles.countryListItem, { backgroundColor: themeColors.background, borderBottomColor: themeColors.text }]}
      onPress={() => {
        setSelectedArea(item)
        setSavedAddressData({ countryCode: item.callingCode })
        setCountryCodeModal(false)
      }}
    >
      <Image
        source={{ uri: item.flag }}
        style={styles.countryFlag}
      />
      <Text style={[styles.countryName, { color: themeColors.text }]}>{item.item}</Text>
    </TouchableOpacity>

  )}

  const renderAreasCodesModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={countryCodeModal}
    >
      <TouchableWithoutFeedback onPress={() => setCountryCodeModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
          <View style={styles.selectCountryMainHeader}>
      <Text style={{ color: themeColors.text }}>Select countries</Text>
      <MaterialIcons name="close" size={24} color= {colorScheme === 'dark' ? '#fff' : '#000'} />
      </View>
            <FlatList
              data={areas}
              renderItem={renderAreaItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )

  const savedContactFlatlist = ({ item }) => (
    
    <TouchableOpacity
      style={[styles.contactItemContainer, { backgroundColor: themeColors.background }]}
      onPress={() => {
        setSavedAddressData({
          name: item.name,
          companyName: item.companyName,
          addressOne: item.addressOne,
          addressTwo: item.addressTwo,
          city: item.city,
          state: item.state,
          email: item.email,
          mobileNumber: item.mobileNumber,
          countryId: item.countryId,
          residentAddress: item.residentAddress,
          saveAddress: false,
          countryCode: item.countryCode,
          zipCode: item.zipCode
        })
        setContactModal(false)
        
        const selectedArea = areas.find(a => a.callingCode === item.countryCode)
        console.log(selectedArea,'selectedArea');
        
        setSelectedArea(areas.find(a => a.callingCode === item.countryCode))
      }}
    >
      <View style={[styles.contactInfoContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.contactHeader}>
          <Text style={[styles.contactName, { color: themeColors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
      
        </View>
        
        <View style={styles.contactDetails}>
          <View style={styles.contactDetailRow}>
            <MaterialIcons name="location-on" size={16} color="#FFAC1C" />
            <Text style={[styles.contactDetailText, { color: themeColors.text }]} numberOfLines={2}>
              {item.addressOne}
            </Text>
          </View>
          
          <View style={styles.contactDetailRow}>
            <MaterialIcons name="phone" size={16} color="#FFAC1C" />
            <Text style={[styles.contactDetailText, { color: themeColors.text }]}>
              {`${item.countryCode} ${item.mobileNumber}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )


  const renderContactModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={contactModal}
    >
      <TouchableWithoutFeedback onPress={() => setContactModal(false)}>
        
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        
          <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
            <FlatList
              data={savedContact}
              renderItem={savedContactFlatlist}
              keyExtractor={(item) => item.id}
              style={styles.countryList}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={onClose}

      >
      
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>


               
                  <View style={[styles.modalHeader, { backgroundColor: themeColors.background }]}>
                    <TouchableOpacity onPress={()=>setContactModal(true)}>
                    <AntDesign name="contacts" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: themeColors.text }]}>Add New Address</Text>
                    <TouchableOpacity
                      onPress={onClose}
                    >
                      <MaterialIcons name="close" size={24} color= {colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={[styles.formContainer, { backgroundColor: themeColors.background }]}>
                    <TextInput
                      placeholder="Enter First And Last Name"
                      value={savedAddressData.name}
                      onChangeText={(text) => setSavedAddressData({ name: text })}
                      style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Enter Company Name"
                      value={savedAddressData.companyName}
                      onChangeText={(text) => setSavedAddressData({ companyName: text })}
                      style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />


                    <TextInput
                      placeholder="Address Line One"
                      value={savedAddressData.addressOne}
                      onChangeText={(text) => setSavedAddressData({ addressOne: text })}
                       style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Address Line Two"
                      value={savedAddressData.addressTwo}
                      onChangeText={(text) => setSavedAddressData({ addressTwo: text })}
                       style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="City"
                      value={savedAddressData.city}
                      onChangeText={(text) => setSavedAddressData({ city: text })}
                       style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' :  'rgba(255, 255, 255, 0.9)'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="State"
                      value={savedAddressData.state}
                      onChangeText={(text) => setSavedAddressData({ state: text })}
                       style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Zip Code"
                      value={savedAddressData.zipCode}
                      onChangeText={(text) => setSavedAddressData({ zipCode: text })}
                       style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Email Address"
                      value={savedAddressData.email}
                      onChangeText={(text) => setSavedAddressData({ email: text })}
                       style={[styles.input,{color: themeColors.text,backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'  }]}
                      keyboardType="email-address"
                      autoCapitalize='none'
                    />


                    <View style={[styles.phoneContainer, { backgroundColor: themeColors.background }]}>
                      <TouchableOpacity
                        style={styles.countryCodeButton}
                        onPress={() => setCountryCodeModal(true)}
                      >
                        <Image
                          source={{ uri: selectedArea?.flag }}
                          style={styles.countryFlag}
                        />
                        <Text style={[
                          styles.countryCode,
                          { color: themeColors.text }
                        ]}>
                          {selectedArea?.callingCode}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={24} color={themeColors.text} />
                      </TouchableOpacity>

                      <TextInput
                        style={[styles.phoneInput, { color: themeColors.text, backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                        value={savedAddressData.mobileNumber}
                        onChangeText={(text) => setSavedAddressData({ mobileNumber: text })}
                        placeholder="Mobile Number"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        maxLength={12}
                      />

                    </View>

                    <View style={[styles.pickerContainer, {height:Platform.OS === 'ios'? verticalScale(130) : verticalScale(40), backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'}]}>
                      <Picker

                        selectedValue={savedAddressData.countryId}
                        onValueChange={(itemValue, itemIndex) => setSavedAddressData({ countryId: itemValue })}
                        mode='dropdown'
                        style={{ color: themeColors.text }}
                      >
                        <Picker.Item color="red" label="Select Country" value="" />
                        {countryList?.map((country, index) => (
                          <Picker.Item
                            
                            key={index}
                            label={country.name}
                            value={country.id}
                          />
                        ))}
                      </Picker>
                    </View>

                    <CheckboxItem
                      label="This is a residential address"
                      status={savedAddressData.residentAddress}
                      onPress={() => setSavedAddressData({ residentAddress: !savedAddressData.residentAddress })}

                    />

                    <CheckboxItem
                      label="Save this address for future use"
                      status={savedAddressData.saveAddress}
                      onPress={() => setSavedAddressData({ saveAddress: !savedAddressData.saveAddress })}
                    />

                    <View style={[styles.buttonContainer, { backgroundColor: themeColors.background }]}>

                      <CustomButton
                        buttonText="Clear"
                        handlePress={handleClear}
                        buttonWidth={130}


                      />
                      <CustomButton
                        buttonText="Save Address"
                        handlePress={handleSave}
                        buttonWidth={150}
                      />
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>

        {renderAreasCodesModal()}
        {renderContactModal()}
      </Modal>
    </View>
  )
}

export default SaveAddressForm

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(150),

  },
  modalContent: {
    borderRadius: moderateScale(16),
    width: width * 1.0,
    height: '130%',
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

    paddingHorizontal: horizontalScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },

  formContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(100),
  },
  input: {
    height: verticalScale(50),
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(15),
    marginBottom: verticalScale(15),
    fontSize: moderateScale(16),

  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: horizontalScale(15),
    borderRightColor: 'grey',
  },
  countryFlag: {
    width: horizontalScale(30),
    height: verticalScale(30),
    marginRight: horizontalScale(12),
    borderRadius: moderateScale(4),
  },
  countryCode: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    height: verticalScale(50),
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(15),
    fontSize: moderateScale(16),
  },
  pickerContainer: {
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(25),
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderBottomWidth: 1,
  },
  countryName: {
    fontSize: moderateScale(16),
  },
  countryList: {
    padding: moderateScale(15),
  },
  checkboxTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  checboxContainer: {
    borderColor:  '#FFAC1C',
  },
  checkboxLabel: {
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  contactItemContainer: {
    marginBottom: verticalScale(15),
    overflow: 'hidden',
  },
  contactInfoContainer: {
  },
  contactHeader: {
    marginBottom: verticalScale(10),
  },
  contactName: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    marginBottom: verticalScale(5),
  },
  companyName: {
    fontSize: moderateScale(14),
    color: 'gray',
  },
  contactDetails: {
    marginBottom: verticalScale(10),
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  contactDetailText: {
    marginLeft: horizontalScale(10),
    fontSize: moderateScale(14),
    flex: 1,
  },
  selectCountryMainHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  }
})
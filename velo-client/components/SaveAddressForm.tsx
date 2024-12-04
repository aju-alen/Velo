import { StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, FlatList, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from './CustomButton'
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'
import { useColorScheme } from '@/hooks/useColorScheme'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import useShipmentStore from '@/store/shipmentStore'
import AntDesign from '@expo/vector-icons/AntDesign';
import useLoginAccountStore from '@/store/loginAccountStore'

const { width } = Dimensions.get('window')

const SaveAddressForm = ({ addressModalVisible, onClose, userId }) => {
  const {  setSavedAddressData, resetShipmentData } = useShipmentStore()
const {accountLoginData} = useLoginAccountStore()
console.log(accountLoginData['id'],'accountLoginData----saveAddressForm----');

  const savedAddressData = useShipmentStore(state => state.savedAddressData)
  const colorScheme = useColorScheme()
  // console.log(colorScheme, 'colorScheme------ in saved');
  


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
    fetch("https://restcountries.com/v2/all")
      .then(response => response.json())
      .then(data => {
        const areaData = data.map(item => ({
          code: item.alpha2Code,
          item: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
        }));
        setAreas(areaData);
  
        const defaultArea = areaData.find(a => a.code === "AE");
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
        
        const savedAddress = await axios.get(`${ipURL}/api/address/get-external-user-address/${accountLoginData['id']}`);

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
        const allCountry = await axios.get(`${ipURL}/api/country/get-all-countries`);
        setCountryList(allCountry.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    getAllCountries();
  }, [addressModalVisible]);

  const CheckboxItem = ({ label, status, onPress }) => (
    <ThemedView style={styles.checkboxTextContainer}>
      <ThemedView style={[styles.checboxContainer,{
         borderRadius: Platform.OS === 'ios' ? moderateScale(4) : moderateScale(0),
         borderWidth:Platform.OS === 'ios' ? moderateScale(2) : moderateScale(0),

      }]}>

        <Checkbox
          status={status ? 'checked' : 'unchecked'}
          onPress={onPress}
          color="#FFAC1C"
        />
      </ThemedView>
      <ThemedText type='mini' style={styles.checkboxLabel}>{label}</ThemedText>
    </ThemedView>
  )

  const handleClear = () => {
    try {
      resetShipmentData()

    }
    catch (error) {
      console.error('Error clearing form:', error)
    }
  }

  const handleGetSavedContact = async () => {
    try{
      
    }
    catch (error) {
      console.error('Error getting saved contact:', error)
    }
  }

  const handleSave = async () => {


    try {
      if (savedAddressData.saveAddress) {
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
          countryCode: savedAddressData.countryCode,
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
      style={styles.countryListItem}
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
      <ThemedText style={[styles.countryName, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>{item.item}</ThemedText>
    </TouchableOpacity>

  )}

  const renderAreasCodesModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={countryCodeModal}
    >
      <TouchableWithoutFeedback onPress={() => setCountryCodeModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.selectCountryMainHeader}>
      <ThemedText>Select countries</ThemedText>
      <MaterialIcons name="close" size={24} color= {colorScheme === 'dark' ? '#fff' : '#000'} />
      </ThemedView>
            <FlatList
              data={areas}
              renderItem={renderAreaItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
            />
          </ThemedView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  )

  const savedContactFlatlist = ({ item }) => (
    
    <TouchableOpacity
      style={styles.contactItemContainer}
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
      }}
    >
      <ThemedView style={styles.contactInfoContainer}>
        <ThemedView style={styles.contactHeader}>
          <ThemedText style={styles.contactName} numberOfLines={1}>
            {item.name}
          </ThemedText>
      
        </ThemedView>
        
        <ThemedView style={styles.contactDetails}>
          <ThemedView style={styles.contactDetailRow}>
            <MaterialIcons name="location-on" size={16} color="#FFAC1C" />
            <ThemedText style={styles.contactDetailText} numberOfLines={2}>
              {item.addressOne}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.contactDetailRow}>
            <MaterialIcons name="phone" size={16} color="#FFAC1C" />
            <ThemedText style={styles.contactDetailText}>
              {`${item.countryCode} ${item.mobileNumber}`}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  )


  const renderContactModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={contactModal}
    >
      <TouchableWithoutFeedback onPress={() => setContactModal(false)}>
        
        <ThemedView style={styles.modalOverlay}>
        
          <ThemedView style={styles.modalContent}>
            <FlatList
              data={savedContact}
              renderItem={savedContactFlatlist}
              keyExtractor={(item) => item.id}
              style={styles.countryList}
            />
          </ThemedView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  )

  return (
    <ThemedView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={onClose}

      >
      
          <ThemedView style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <ThemedView style={styles.modalContent}>


               
                  <ThemedView style={styles.modalHeader}>
                    <TouchableOpacity onPress={()=>setContactModal(true)}>
                    <AntDesign name="contacts" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <ThemedText style={styles.modalTitle}>Add New Address</ThemedText>
                    <TouchableOpacity
                      onPress={onClose}
                    >
                      <MaterialIcons name="close" size={24} color= {colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                  </ThemedView>
                  <ScrollView showsVerticalScrollIndicator={false}>
                  <ThemedView style={styles.formContainer}>
                    <TextInput
                      placeholder="Enter First And Last Name"
                      value={savedAddressData.name}
                      onChangeText={(text) => setSavedAddressData({ name: text })}
                      style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Enter Company Name"
                      value={savedAddressData.companyName}
                      onChangeText={(text) => setSavedAddressData({ companyName: text })}
                      style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />


                    <TextInput
                      placeholder="Address Line One"
                      value={savedAddressData.addressOne}
                      onChangeText={(text) => setSavedAddressData({ addressOne: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Address Line Two"
                      value={savedAddressData.addressTwo}
                      onChangeText={(text) => setSavedAddressData({ addressTwo: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="City"
                      value={savedAddressData.city}
                      onChangeText={(text) => setSavedAddressData({ city: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' :  'rgba(255, 255, 255, 0.9)'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="State"
                      value={savedAddressData.state}
                      onChangeText={(text) => setSavedAddressData({ state: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Zip Code"
                      value={savedAddressData.zipCode}
                      onChangeText={(text) => setSavedAddressData({ zipCode: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Email Address"
                      value={savedAddressData.email}
                      onChangeText={(text) => setSavedAddressData({ email: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000',backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'  }]}
                      keyboardType="email-address"
                      autoCapitalize='none'
                    />


                    <ThemedView style={styles.phoneContainer}>
                      <TouchableOpacity
                        style={styles.countryCodeButton}
                        onPress={() => setCountryCodeModal(true)}
                      >
                        <Image
                          source={{ uri: selectedArea?.flag }}
                          style={styles.countryFlag}
                        />
                        <ThemedText style={[
                          styles.countryCode,
                          { color: colorScheme === 'dark' ? '#fff' : '#000' }
                        ]}>
                          {selectedArea?.callingCode}
                        </ThemedText>
                        <MaterialIcons name="arrow-drop-down" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                      </TouchableOpacity>

                      <TextInput
                        style={[styles.phoneInput, { color: colorScheme === 'dark' ? '#fff' : '#000', backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }]}
                        value={savedAddressData.mobileNumber}
                        onChangeText={(text) => setSavedAddressData({ mobileNumber: text })}
                        placeholder="Mobile Number"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        maxLength={12}
                      />

                    </ThemedView>

                    <ThemedView style={[styles.pickerContainer, {height:Platform.OS === 'ios'? verticalScale(130) : verticalScale(40)}]}>
                      <Picker

                        selectedValue={savedAddressData.countryId}
                        onValueChange={(itemValue, itemIndex) => setSavedAddressData({ countryId: itemValue })}
                        mode='dropdown'
                        style={{ color: colorScheme === 'dark' ? '#fff' : '#000', backgroundColor: colorScheme ==='dark'?'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)' }}
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
                    </ThemedView>

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

                    <ThemedView style={styles.buttonContainer}>

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
                    </ThemedView>
                  </ThemedView>
                </ScrollView>
              </ThemedView>
            </TouchableWithoutFeedback>
          </ThemedView>

        {renderAreasCodesModal()}
        {renderContactModal()}
      </Modal>
    </ThemedView>
  )
}

export default SaveAddressForm

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(100),

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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
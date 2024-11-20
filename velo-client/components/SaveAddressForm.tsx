import { StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity, TextInput, Image, Text, Dimensions, View, FlatList } from 'react-native'
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

const { width } = Dimensions.get('window')

const SaveAddressForm = ({ addressModalVisible, onClose, userId }) => {
  const {  setSavedAddressData, resetShipmentData } = useShipmentStore()
  const savedAddressData = useShipmentStore(state => state.savedAddressData)
  const colorScheme = useColorScheme()
  console.log(colorScheme, 'colorScheme------ in saved');
  

  const [countryCodeModal, setCountryCodeModal] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)
  const [areas, setAreas] = useState([])
  const [countryList, setCountryList] = useState([]);
  const [countrySelect, setCountrySelect] = useState('');

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
            savedAddressData.countryCode = defaultData[0].callingCode
          }
        }
      })
      .catch(error => {
        console.error('Error fetching country data:', error)
        alert('Failed to load country data')
      })
  }, [])

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
      <ThemedView style={styles.checboxContainer}>

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

  const renderAreaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryListItem}
      onPress={() => {
        setSelectedArea(item)
        savedAddressData.countryCode = item.callingCode
        setSavedAddressData({ countryCode: item })
        setCountryCodeModal(false)
      }}
    >
      <Image
        source={{ uri: item.flag }}
        style={styles.countryFlag}
      />
      <ThemedText style={[styles.countryName, { color: "#fff" }]}>{item.item}</ThemedText>
    </TouchableOpacity>
  )

  const renderAreasCodesModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={countryCodeModal}
    >
      <TouchableWithoutFeedback onPress={() => setCountryCodeModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
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

  return (
    <ThemedView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={onClose}


      >
        <TouchableWithoutFeedback onPress={onClose}>
          <ThemedView style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <ThemedView style={styles.modalContent}>


                <ScrollView showsVerticalScrollIndicator={false}>
                  <ThemedView style={styles.modalHeader}>
                    <ThemedText style={styles.modalTitle}>Add New Address</ThemedText>
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}
                    >
                      <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  </ThemedView>
                  <ThemedView style={styles.formContainer}>
                    <TextInput
                      placeholder="Enter First And Last Name"
                      value={savedAddressData.name}
                      onChangeText={(text) => setSavedAddressData({ name: text })}
                      style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Enter Company Name"
                      value={savedAddressData.companyName}
                      onChangeText={(text) => setSavedAddressData({ companyName: text })}
                      style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
                      keyboardType="default"
                    />


                    <TextInput
                      placeholder="Address Line One"
                      value={savedAddressData.addressOne}
                      onChangeText={(text) => setSavedAddressData({ addressOne: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Address Line Two"
                      value={savedAddressData.addressTwo}
                      onChangeText={(text) => setSavedAddressData({ addressTwo: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="City"
                      value={savedAddressData.city}
                      onChangeText={(text) => setSavedAddressData({ city: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="State"
                      value={savedAddressData.state}
                      onChangeText={(text) => setSavedAddressData({ state: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Zip Code"
                      value={savedAddressData.zipCode}
                      onChangeText={(text) => setSavedAddressData({ zipCode: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
                      keyboardType="default"
                    />

                    <TextInput
                      placeholder="Email Address"
                      value={savedAddressData.email}
                      onChangeText={(text) => setSavedAddressData({ email: text })}
                       style={[styles.input,{color: colorScheme === 'dark' ? '#fff' : '#000'}]}
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
                        style={[styles.phoneInput, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                        value={savedAddressData.mobileNumber}
                        onChangeText={(text) => setSavedAddressData({ mobileNumber: text })}
                        placeholder="Mobile Number"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        maxLength={12}
                      />

                    </ThemedView>

                    <ThemedView style={styles.pickerContainer}>
                      <Picker

                        selectedValue={savedAddressData.countryId}
                        onValueChange={(itemValue, itemIndex) => setSavedAddressData({ countryId: itemValue })}
                        mode="dialog"
                        style={styles.picker}
                      >
                        <Picker.Item color="#999" label="Select Country" value="" />
                        {countryList?.map((country, index) => (
                          <Picker.Item
                            color="#999"
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

                      />
                      <CustomButton
                        buttonText="Save Address"
                        handlePress={handleSave}
                      />
                    </ThemedView>
                  </ThemedView>
                </ScrollView>
              </ThemedView>
            </TouchableWithoutFeedback>
          </ThemedView>
        </TouchableWithoutFeedback>
        {renderAreasCodesModal()}
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },
  closeButton: {
    padding: moderateScale(8),
  },
  formContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(30),
  },
  input: {
    height: verticalScale(50),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(15),
    marginBottom: verticalScale(15),
    fontSize: moderateScale(16),
    borderWidth: 1,
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
    borderRightWidth: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(15),
    fontSize: moderateScale(16),

  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(25),
    overflow: 'hidden',
    height: verticalScale(130),
  },
  picker: {


  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: verticalScale(20),
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
    borderRadius: moderateScale(4),
    borderWidth: moderateScale(2),
    borderColor: '#FFAC1C',
  },
  checkboxLabel: {
    marginLeft: horizontalScale(8),
  },
})
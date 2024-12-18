import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Chip, Divider,RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { useColorScheme } from '@/hooks/useColorScheme';
import useLoginAccountStore from '@/store/loginAccountStore';

const FinalRegisterForm = () => {
  const {accountLoginData, setAccountLoginData} = useLoginAccountStore();
  const colorScheme = useColorScheme();
  // ... keeping all the existing state and handlers ...
  const [countryList, setCountryList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [accountId, setAccountId] = useState('')
  const [accountRole, setAccountRole] = useState('')
  const [addressOne, setAddressOne] = useState('')
  const [addressTwo, setAddressTwo] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading,setLoading] = useState(true)
  const [buttonDisable, setButtonDisable] = useState(false)
  const [modeOfWork, setModeOfWork] = useState('')

  const [organisationName, setOrganisationName] = useState('')
  const [organisationAddress, setOrganisationAddress] = useState('')
  const [organisationWebsiteUrl, setOrganisationWebsiteUrl] = useState('')

  console.log(modeOfWork, 'modeOfWork--____-----');
  

  // ... keeping all the existing useEffect and handlers ...
  
  const handleChipPress = (countryName, countryId, type) => {
    if (type === 'country') {
      setSelectedCountries((prev) => 
        prev.includes(countryId) ? prev.filter((item) => item !== countryId) : [...prev, countryId]
      );
    } else if (type === 'category') {
      setSelectedCategories((prev) => 
        prev.includes(countryId) ? prev.filter((item) => item !== countryId) : [...prev, countryId]
      );
    }
  };

  useEffect(() => {
    const getCountryFromDB = async () => {
      const getAccInfo = await SecureStore.getItemAsync('registerDetail')
      setAccountId(JSON.parse(getAccInfo).id);
      setAccountRole(JSON.parse(getAccInfo).role);
      
      const response = await axios.get(`${ipURL}/api/country/get-all-countries`)
      const getCategory = await axios.get(`${ipURL}/api/category/get-all-categories`)
      setCategoryList(getCategory.data)
      setCountryList(response.data)
      setLoading(false)
    }
    getCountryFromDB()
  }, [])

  const handleFinalRegisterForm = async () => {

    try {
      setButtonDisable(true)
      if (accountRole === "USER") {
        const formData = {
          userId: accountId,
          addressOne,
          addressTwo,
          state,
          city,
          zipCode,
          country
        }
        const response = await axios.post(`${ipURL}/api/address/create-user-address`, formData)

        setAccountLoginData({
          id: response.data.newUserData.id,
          mobileCode: response.data.newUserData.mobileCode,
          mobileCountry: response.data.newUserData.mobileCountry,
          mobileNumber: response.data.newUserData.mobileNumber,
          name: response.data.newUserData.name,
          password: response.data.newUserData.password,
          registerVerificationStatus: response.data.newUserData.registerVerificationStatus,
          role: response.data.newUserData.role,
          updatedAt: response.data.newUserData.updatedAt,
          token: response.data.newUserData.token,
          modeOfWork: response.data.newUserData.modeOfWork? response.data.newUserData.modeOfWork : null,
        })

        await SecureStore.setItemAsync('registerDetail', JSON.stringify(response.data.newUserData))
        router.replace('/(tabs)/home')
      } else if (accountRole === "AGENT") {
        const formData = {
          userId: accountId,
          selectedCountries,
          selectedCategories,
          modeOfWork,
          organisationName,
          organisationAddress,
          organisationWebsiteUrl,
        }
        const response = await axios.post(`${ipURL}/api/address/create-agent-address`, formData)
        router.push({ pathname: '/(auth)/setAppointment', params: { accountId } })
        setButtonDisable(false)
      }
    } catch (e) {
      console.log(e, 'error--');
      setButtonDisable(false)
    }
  }

  // const CustomInput = ({ label, value, onChangeText, placeholder, autoComplete }) => (
  //   <ThemedView style={styles.inputContainer}>
  //     <ThemedText type='default' style={styles.label}>{label}</ThemedText>
  //     <ThemedView style={styles.inputWrapper}>
  //       <TextInput
  //         placeholder={placeholder}
  //         placeholderTextColor="gray"
  //         value={value}
  //         onChangeText={onChangeText}
  //         keyboardType='default'
  //         autoComplete={autoComplete}
  //         style={styles.input}
  //       />
  //     </ThemedView>
  //   </ThemedView>
  // );

  return (
    <ThemedView style={styles.container}>
     {loading?
     <ThemedView style={{flex:1,justifyContent:'center',alignItems:'center'}}>
     <ActivityIndicator size="large" color="gray" />
      </ThemedView>
     : <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText>
            <ThemedText type='subtitle' style={styles.subheading}>Final Steps</ThemedText>
            
            {accountRole === 'USER' && <>
              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Address 1</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Address 1"
                    placeholderTextColor="gray"
                    value={addressOne}
                    onChangeText={setAddressOne}
                    keyboardType='default'
                    autoComplete='name'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Address 2</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Address 2"
                    placeholderTextColor="gray"
                    value={addressTwo}
                    autoCapitalize='none'
                    onChangeText={setAddressTwo}
                    keyboardType='email-address'
                    autoComplete='email'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>State</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Your State"
                    placeholderTextColor="gray"
                    value={state}
                    autoCapitalize='none'
                    onChangeText={setState}
                    keyboardType='email-address'
                    autoComplete='email'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>City</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Your City"
                    placeholderTextColor="gray"
                    value={city}
                    autoCapitalize='none'
                    onChangeText={setCity}
                    keyboardType='email-address'
                    autoComplete='email'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Zip Code</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Your Zipcode"
                    placeholderTextColor="gray"
                    value={zipCode}
                    autoCapitalize='none'
                    onChangeText={setZipCode}
                    keyboardType='email-address'
                    autoComplete='email'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              {/* Password Input */}
              <ThemedView style={styles.chooseCountry}>
                <ThemedText type='default' style={styles.textInputHeading}>Country</ThemedText>
                <Picker
                  selectedValue={country}
                  onValueChange={(itemValue, itemIndex) => {
                    console.log(itemValue, '--itemValue');

                    setCountry(itemValue)
                  }
                  }
                  style={{ ...styles.picker, color: colorScheme === 'dark' ? 'white' : 'black' }}
                  >
                  <Picker.Item color='red' label="--Select--" />
                  {
                    countryList.map((item, index) => {
                      return (
                        <Picker.Item color={colorScheme==='dark' ? 'white ' :'black'} key={index} label={item.name} value={item.id} />
                      )
                    })}
                </Picker>
              </ThemedView>
            </>}

            {accountRole === 'AGENT' && (
              <ThemedView style={styles.agentContainer}>
                <ThemedView style={styles.sectionContainer}>
                  <ThemedText type='default' style={styles.sectionTitle}>Countries of Operation</ThemedText>
                  <Divider style={styles.divider} />
                  <ThemedView style={styles.chipGrid}>
                    {countryList.map((item) => (
                      <Chip
                        key={item.id}
                        icon={selectedCountries.includes(item.id) ? "check" : "plus"}
                        style={[
                          styles.chip,
                          selectedCountries.includes(item.id) && styles.selectedChip
                        ]}
                        onPress={() => handleChipPress(item.name, item.id, 'country')}
                      >
                        {item.name}
                      </Chip>
                    ))}
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.sectionContainer}>
                  <ThemedText type='default' style={styles.sectionTitle}>Categories</ThemedText>
                  <Divider style={styles.divider} />
                  <ThemedView style={styles.chipGrid}>
                    {categoryList.map((item) => (
                      <Chip
                        key={item.id}
                        icon={selectedCategories.includes(item.id) ? "check" : "plus"}
                        style={[
                          styles.chip,
                          selectedCategories.includes(item.id) && styles.selectedChip
                        ]}
                        onPress={() => handleChipPress(item.name, item.id, 'category')}
                      >
                        {item.name}
                      </Chip>
                    ))}
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.sectionContainer}>
                  <ThemedText type='default' style={styles.sectionTitle}>Mode of work</ThemedText>
                  <Divider style={styles.divider} />
                  <ThemedView style={styles.rowContainer}>
                    <RadioButton
                      value="Solo"
                      status={modeOfWork === 'Solo' ? 'checked' : 'unchecked'}
                      onPress={() => setModeOfWork('Solo')}
                    />
                    <ThemedText>Solo</ThemedText>

                    <RadioButton
                      value="Organisation"
                      status={modeOfWork === 'Organisation' ? 'checked' : 'unchecked'}
                      onPress={() => setModeOfWork('Organisation')}  
                    />
                    <ThemedText>Organisation</ThemedText>

                 </ThemedView>
                </ThemedView>
               {modeOfWork === 'Organisation' && <ThemedView style={styles.sectionContainer}>

                <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Organisation Name</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Organisation Name"
                    placeholderTextColor="gray"
                    value={organisationName}
                    onChangeText={setOrganisationName}
                    keyboardType='default'
                    autoComplete='name'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Organisation Address 1</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Organisation Address 1"
                    placeholderTextColor="gray"
                    value={organisationAddress}
                    onChangeText={setOrganisationAddress}
                    keyboardType='default'
                    autoComplete='name'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Organisation Website URL</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Organisation Website URL"
                    placeholderTextColor="gray"
                    value={organisationWebsiteUrl}
                    onChangeText={setOrganisationWebsiteUrl}
                    keyboardType='default'
                    autoComplete='name'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    style={styles.textInputText}
                  />
                </ThemedView>
              </ThemedView>
                </ThemedView>}
              </ThemedView>
            )}

            <ThemedView style={styles.buttonContainer}>
              <CustomButton buttonText='Complete Registration' handlePress={handleFinalRegisterForm}
              disableButton={buttonDisable}
              />
            </ThemedView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>}
    </ThemedView>
  )
}

export default FinalRegisterForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
  },
  logoText: {
    marginTop: verticalScale(40),
    textAlign: 'center',
  },
  subheading: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
    textAlign: 'center',
  },
  formContainer: {
    marginTop: verticalScale(16),
  },
  inputContainer: {
    marginBottom: verticalScale(16),
  },
  label: {
    marginBottom: verticalScale(8),
    fontSize: moderateScale(14),
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    padding: moderateScale(12),
    fontSize: moderateScale(16),
    color: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  picker: {
    height: verticalScale(50),
  },
  agentContainer: {
    marginTop: verticalScale(16),
  },
  sectionContainer: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  divider: {
    backgroundColor: 'gray',
    marginBottom: verticalScale(16),
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  chip: {
    marginBottom: verticalScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  buttonContainer: {
    marginVertical: verticalScale(24),
    flexDirection: 'row',
    justifyContent: 'center',
    
  },
  textInputHeading: {
    marginBottom: verticalScale(8),
    marginTop: verticalScale(12),
  },
  textInputBox: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
    marginBottom: verticalScale(12),
    height: verticalScale(40),
  },
  chooseCountry: {
    borderColor: 'gray',
    borderRadius: moderateScale(5),
  },

  textInputText: {
    fontSize: moderateScale(14),
    color: 'gray',
  },
});
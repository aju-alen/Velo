import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Chip } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';



const FinalRegisterForm = () => {
  console.log('This is final register Page');


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

  const handleChipPress = (countryName, countryId, type) => {

    if (type === 'country') {
      setSelectedCountries((prev) => {
        if (prev.includes(countryId)) {
          // If already selected, remove it
          return prev.filter((item) => item !== countryId);
        } else {
          // If not selected, add it
          return [...prev, countryId];
        }
      });
    }
    else if (type === 'category') {
      setSelectedCategories((prev) => {
        if (prev.includes(countryId)) {
          // If already selected, remove it
          return prev.filter((item) => item !== countryId);
        } else {
          // If not selected, add it
          return [...prev, countryId];
        }
      });
    }
  };

  console.log(selectedCountries, 'selectedCountries--');
  console.log(selectedCategories, 'selectedCategories--');







  useEffect(() => {
    const getCountryFromDB = async () => {
      const getAccInfo = await SecureStore.getItemAsync('registerDetail')
      setAccountId(JSON.parse(getAccInfo).id);
      setAccountRole(JSON.parse(getAccInfo).role);

      const response = await axios.get(`${ipURL}/api/country/get-all-countries`)
      const getCategory = await axios.get(`${ipURL}/api/category/get-all-categories`)
      console.log(getCategory.data, 'getCategory--');

      setCategoryList(getCategory.data)
      setCountryList(response.data)
    }
    getCountryFromDB()
  }, [])



  const handleFinalRegisterForm = async () => {
  


    try {
      if (accountRole === "USER") {
        try {
          const formData = {
            userId: accountId,
            addressOne,
            addressTwo,
            state,
            city,
            zipCode,
            country
          }
          console.log(formData, 'formData--');
          const response = await axios.post(`${ipURL}/api/address/create-user-address`, formData)
          console.log(response.data);
          await SecureStore.setItemAsync('registerDetail', JSON.stringify(response.data.data))

          router.replace('/(tabs)/home')
        }
        catch (e) {
          console.log(e, 'error--');
        }

      }
      else if (accountRole === "AGENT") {
        try {
          const formData = {
            userId: accountId,
            selectedCountries,
            selectedCategories
          }
          //This is the final step for agent registration. It not only adds address but also categories and countries
          const response = await axios.post(`${ipURL}/api/address/create-agent-address`, formData)
          router.push({ pathname: '/(auth)/setAppointment', params: { accountId } })
        }
        catch (e) {
          console.log(e, 'error--');
        }

      }
    }
    catch (e) {
      console.log(e, 'error--');
    }


  }



  return (
    <ThemedView style={{
      flex: 1,
      marginTop: 40,
      paddingHorizontal: 20,
    }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView >

            <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText>
            <ThemedText type='subtitle' style={styles.subheading}>Final Steps</ThemedText>

            {/* USER FINAL STEPS */}
            {accountRole === 'USER' && <>
              <ThemedView style={{ marginBottom: verticalScale(6) }}>
                <ThemedText type='default' style={styles.textInputHeading}>Address 1</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Your Name"
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
                    placeholder="Enter Your Email"
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
                    placeholder="Enter Your Email"
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
                    placeholder="Enter Your Email"
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
                <ThemedText type='default' style={styles.textInputHeading}>Pin Code</ThemedText>
                <ThemedView style={styles.textInputBox}>
                  <TextInput
                    placeholder="Enter Your Email"
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
                  }>
                  <Picker.Item color='white' label="--Select--" />
                  {
                    countryList.map((item, index) => {
                      return (
                        <Picker.Item color="white" key={index} label={item.name} value={item.id} />
                      )
                    })}
                </Picker>
              </ThemedView>
            </>}

            {/* AGENT FINAL STEPS */}
            {accountRole === 'AGENT' && <>
              <ThemedView style={styles.operationContainer}>
                <ThemedView >
                  <ThemedText type='default' style={styles.textInputHeading}>Countries You Operate</ThemedText>
                  {countryList.map((item, index) => (
                    <ThemedView key={index} style={styles.chipContainer}>
                      <Chip icon={selectedCountries.includes(item.id) ? "plus" : "minus"} style={{ backgroundColor: selectedCountries.includes(item.id) ? '#4CAF50' : 'red' }} onPress={() => handleChipPress(item.name, item.id, 'country')} key={item.id} compact>{item.name}</Chip>
                    </ThemedView>
                  ))}
                </ThemedView>
                <ThemedView style={styles.operationContainer}>
                  <ThemedText type='default'>Select the categories you like to operate</ThemedText>
                  {categoryList.map((item, index) => (
                    <ThemedView key={index} style={styles.chipContainer}>
                      <Chip icon={selectedCategories.includes(item.id) ? "plus" : "minus"} style={{ backgroundColor: selectedCategories.includes(item.id) ? '#4CAF50' : 'red' }} onPress={() => handleChipPress(item.name, item.id, 'category')} key={item.id} compact>{item.name}</Chip>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            </>}


            <ThemedView style={{ marginBottom: verticalScale(6) }}>

              <ThemedView style={styles.buttonContainer}>
                <CustomButton buttonText='Register' handlePress={handleFinalRegisterForm} />
              </ThemedView>

            </ThemedView>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default FinalRegisterForm

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
  },
  logoText: {
    marginTop: verticalScale(60),
  },
  subheading: {
    marginTop: verticalScale(20),
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipContainer: {
    margin: moderateScale(4),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  operationContainer: {
    marginTop: verticalScale(20),
  }

})
import { StyleSheet, TextInput, TouchableOpacity, Modal, Image, TouchableWithoutFeedback, FlatList, Keyboard, ActivityIndicator, Alert, View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import { getAuth, onAuthStateChanged, signInWithPhoneNumber, signOut  } from '@react-native-firebase/auth';
import { OtpInput } from 'react-native-otp-entry';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { Colors } from '@/constants/Colors';

export type selectedArea = {
  code: string,
  item: string,
  callingCode: string,
  flag: string
}


const MobileInput = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [tempRegister, setTempRegister] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [mobile, setMobile] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [otp, setOtp] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    callingCode: ['971'],
    cca2: 'AE',
    currency: ['AED'],
    flag: 'flag-ae',
    name: 'United Arab Emirates',
    region: 'Asia',
    subregion: 'Western Asia',
  })
  const [showCountryPicker, setShowCountryPicker] = useState(false)

  function handleAuthStateChanged(user) {
    if (user) {
      console.log(user, 'user------');
      
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      alert('User Phone Number Verified')
      
    }
  }

  

  // confirm the code
  async function confirmCode() { 
    try {
      setLoading(true)
      await confirm.confirm(otp);
      // Handle successful verification`
      const tempRegisterData = {...tempRegister, mobile:mobile, code:selectedCountry.callingCode[0], country:selectedCountry.cca2}
      const saveUserToDB = await axios.post(`${ipURL}/api/auth/register`, tempRegisterData);
      console.log(saveUserToDB.data, 'saveUserToDB------');
      
      await SecureStore.deleteItemAsync('tempRegister'); 
      await SecureStore.deleteItemAsync('tempMobile');
      await SecureStore.setItemAsync('registerDetail', JSON.stringify(saveUserToDB.data.userDetails));
      if (tempRegister.role === 'AGENT') {
        router.replace('/(auth)/verifyAgent');
      } else {
        router.replace('/(auth)/finalRegisterForm');
      }
      console.log('OTP Verified Successfully');
      setErrorMessage('')
    } catch (error) {
      setErrorMessage('Invalid OTP. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  async function handleSignInWithPhoneNumber() {
    if (!mobile) {
      alert('Please enter a valid mobile number')
      return
    }
    console.log(tempRegister, 'tempRegister------');
    try {
      setIsLoading(true)
      const phoneNumber = `+${selectedCountry.callingCode[0]}${mobile}`;
      console.log(phoneNumber, 'phoneNumber------');

      //check if mobile number is already registered
      const checkMobileNumber = await axios.get(`${ipURL}/api/auth/check-mobile-number?mobile=${mobile}`);
      if(checkMobileNumber.data.continue === false){
        alert('Mobile number already registered. Please try again with different mobile number.');
        setIsLoading(false)
        return
      }

      const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
      console.log(confirmation, 'confirmation------');
      
      setConfirm(confirmation);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending verification code. Please try again with different mobile number.');
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (otpValue) => {
    setOtp(otpValue)
    console.log(otpValue);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    getTempRegiisterData()
  },[])

  const getTempRegiisterData = async () => {
    const tempRegister = await SecureStore.getItemAsync('tempRegister')
    if(tempRegister){
      setTempRegister(JSON.parse(tempRegister))
    }
  }


  // Show OTP input when confirmation is available
  if (confirm) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.headerContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colorScheme === 'dark' ? '#23242A' : '#FFF3E0' }]}>
            <Text style={styles.icon}>🔐</Text>
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Verify Your Number
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.text }]}>
            We've sent a 6-digit verification code to +{selectedCountry.callingCode[0]}{mobile}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <Text style={[styles.otpLabel, { color: themeColors.text }]}>Enter verification code</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={handleOtpChange}
            focusColor="#FFAC1C"
            focusStickBlinkingDuration={400}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#23242A' : '#f9f9f9',
                width: horizontalScale(48),
                height: verticalScale(48),
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colorScheme === 'dark' ? '#333' : '#d3d3d3',
              },
            }}
          />
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <CustomButton
          disableButton={loading}
          buttonText='Verify Number'
          handlePress={confirmCode}
        />

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            setConfirm(null)
            setOtp('')
            setErrorMessage('')
          }}
        >
          <Text style={styles.backText}>← Back to Mobile Input</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.headerContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colorScheme === 'dark' ? '#23242A' : '#FFF3E0' }]}>
            <Text style={styles.icon}>📱</Text>
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Enter Your Mobile Number
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.text }]}>
            We will send you a verification code to verify your number
          </Text>
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#23242A' : '#FAFAFA', borderColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' }]}>
          <TouchableOpacity
            style={[styles.countryPickerButton, { borderRightColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' }]}
            onPress={() => setShowCountryPicker(true)}
          >
            <Text style={[styles.countryCodeText, { color: themeColors.text }]}>
              +{selectedCountry.callingCode[0]}
            </Text>
            <Text style={[styles.dropdownIcon, { color: themeColors.text }]}>▼</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            value={mobile}
            keyboardType='number-pad'
            onChangeText={setMobile}
            placeholder='Enter mobile number'
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            maxLength={12}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: themeColors.text }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>

        <CountryPicker
          visible={showCountryPicker}
          onSelect={(country: Country) => {
            setSelectedCountry(country)
            setShowCountryPicker(false)
          }}
          onClose={() => setShowCountryPicker(false)}
          withFilter
          withFlag
          withCallingCode
          withEmoji
          withModal
          countryCode={selectedCountry.cca2 as CountryCode}
        />

        <CustomButton
          buttonText='Continue'
          handlePress={handleSignInWithPhoneNumber}
          disableButton={isLoading}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(60),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  detailsContainer: {
    width: '100%',
    marginVertical: 15,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  confirmButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
  },
  editLink: {
    marginTop: 10,
  },
  editText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  
  inputContainer: {
    flexDirection: 'row',
    borderWidth: moderateScale(1.5),
    borderRadius: moderateScale(16),
    width: "100%",
    height: verticalScale(60),
    alignItems: 'center',
    marginBottom: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: horizontalScale(15),
    borderRightWidth: 1,
    borderRightColor: 'grey',
  },
  selectedFlag: {
    width: horizontalScale(30),
    height: verticalScale(30),
    marginRight: horizontalScale(8),
    borderRadius: moderateScale(4),
  },
  countryCode: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
 
  input: {
    flex: 1,
    marginLeft: horizontalScale(20),
    fontSize: moderateScale(16),
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#111',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  countryList: {
    padding: moderateScale(15),
  },
  countryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  countryFlag: {
    width: horizontalScale(30),
    height: verticalScale(30),
    marginRight: horizontalScale(12),
    borderRadius: moderateScale(4),
  },
  countryName: {
    fontSize: moderateScale(16),
  },
  confirmationContainer: {
    flex: 1,
    padding: moderateScale(20),
    justifyContent: 'space-between',
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  confirmationTitle: {
    fontSize: moderateScale(24),
    marginBottom: verticalScale(8),
  },
  confirmationSubtitle: {
    fontSize: moderateScale(16),
    opacity: 0.8,
  },
  
  detailItem: {
    marginBottom: verticalScale(20),
  },
  detailLabel: {
    fontSize: moderateScale(14),
    opacity: 0.7,
    marginBottom: verticalScale(4),
  },
  detailValue: {
    fontSize: moderateScale(18),
  },
  actionButtons: {
    paddingVertical: verticalScale(20),
  },
  otpContainer: {
    width: '100%',
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(15),
    textAlign: 'center',
    fontWeight: '500',
  },
  backButton: {
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(10),
  },
  backText: {
    color: '#FFAC1C',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: horizontalScale(15),
    borderRightWidth: 1,
    paddingVertical: verticalScale(10),
  },
  countryCodeText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  dropdownIcon: {
    fontSize: moderateScale(12),
    marginLeft: horizontalScale(8),
  },
  iconContainer: {
    marginBottom: verticalScale(15),
    width: horizontalScale(80),
    height: verticalScale(80),
    borderRadius: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: moderateScale(40),
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
  },
  infoText: {
    fontSize: moderateScale(12),
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  otpLabel: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: verticalScale(15),
    textAlign: 'center',
  },
})

export default MobileInput
import { StyleSheet, TouchableOpacity, ActivityIndicator, View, Text, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { horizontalScale, verticalScale } from '@/constants/metrics';
import { router, useLocalSearchParams } from 'expo-router';
import { OtpInput } from 'react-native-otp-entry';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { Colors } from '@/constants/Colors';

export type selectedArea = {
  code: string;
  item: string;
  callingCode: string;
  flag: string;
};

const OtpInputs = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const params = useLocalSearchParams();
  const { verfication_id } = params;

  const [phoneNumber, setPhoneNumber] = useState({
    mobile: '',
    code: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getSecureStoreMobileData = async () => {
      const secureMobile = await SecureStore.getItemAsync('tempMobile');
      const secureUser = await SecureStore.getItemAsync('tempRegister');

      setPhoneNumber(JSON.parse(secureMobile));
      setUserDetails(JSON.parse(secureUser));
    };

    getSecureStoreMobileData();
  }, []);

  const handleVerifyNumber = async (otp) => {
    try {
      console.log(otp, 'otp');
      
      setLoading(true);
      const resp = await axios.post('https://api.smsala.com/api/VerifyStatus', {
        verfication_id: verfication_id,
        verfication_code: otp,
      });

      if (resp.data.status === 'V') {
        const formData = { ...userDetails, ...phoneNumber };
        const saveUserToDB = await axios.post(`${ipURL}/api/auth/register`, formData);

        await SecureStore.deleteItemAsync('tempRegister');
        await SecureStore.deleteItemAsync('tempMobile');
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(saveUserToDB.data.userDetails));

        if (saveUserToDB.data.userDetails.role === 'AGENT') {
          router.replace('/(auth)/verifyAgent');
        } else {
          router.replace('/(auth)/finalRegisterForm');
        }
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.header, { color: themeColors.text }]}>Verify Your Number</Text>
      <Text style={[styles.subText, { color: themeColors.text }]}>
        We've sent a 4-digit verification code to {phoneNumber.code} {phoneNumber.mobile}.
      </Text>

      <View style={styles.otpContainer}>
        <OtpInput
          numberOfDigits={4}
          onTextChange={(otp) => {
            setOtp(otp)
            console.log(otp);
            if(otp.length === 4){
              handleVerifyNumber(otp)
            }
            
          }}
          focusColor="#FFAC1C"
          focusStickBlinkingDuration={400}
          theme={{
            pinCodeContainerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#23242A' : '#f9f9f9',
              width: horizontalScale(58),
              height: verticalScale(58),
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
        handlePress={()=>handleVerifyNumber(otp)}
      />

     
    </View>
  );
};

export default OtpInputs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',

  },
  header: {
    fontSize: 24,
    fontWeight: '600',

    marginBottom: 10,
  },
  subText: {
    fontSize: 16,

    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpContainer: {
    width: '80%',
    marginBottom: 20,
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 14,
    marginBottom: 10,
  },
  resendText: {
    color: '#FFAC1C',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
});

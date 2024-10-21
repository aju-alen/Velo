import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal,Image, TouchableWithoutFeedback, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics'
import { router,useLocalSearchParams } from 'expo-router'
import { OtpInput } from 'react-native-otp-entry'
import * as SecureStore from 'expo-secure-store';
import CustomButton from '@/components/CustomButton';
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'


export type selectedArea ={
    code: string,
    item: string,
    callingCode: string,
    flag: string
}


const OtpInputs = () => {
  const params = useLocalSearchParams();
  const { verfication_id } = params;
  const [phoneNumber, setPhoneNumber] =useState({
    mobile:'',
    code:'',
    country:''
  })
const [userDetails, setUserDetails] = useState({

})
  const [otp, setOtp] = useState('')
  console.log(verfication_id, 'verfication_id--');

  

  useEffect(() => {
    const getSecureStoreMobileData = async () => {
      let secureMobile = await SecureStore.getItemAsync('tempMobile');
      let secureUser = await SecureStore.getItemAsync('tempRegister');
      

      setPhoneNumber(JSON.parse(secureMobile))
      setUserDetails(JSON.parse(secureUser))
    }

    getSecureStoreMobileData()
  }, [])
  console.log(phoneNumber, 'phoneNumber--');
  console.log(userDetails, 'userDetails--');
  

  const handleVerifyNumber = async () => {
    try {
      
      const resp = await axios.post('https://api.smsala.com/api/VerifyStatus',{
        verfication_id: verfication_id,
        verfication_code: otp
      })
      console.log(resp.data, 'resp.data--');
      

      if(resp.data.status === 'V'){
        const formData = {
          ...userDetails,
          ...phoneNumber
        }
        console.log('formData--',formData);
        const saveUserToDB = await axios.post(`${ipURL}/api/auth/register`, formData)
        console.log(saveUserToDB.data, 'saveUserToDB.data--');
       try{
        await SecureStore.deleteItemAsync('tempRegister');
        await SecureStore.deleteItemAsync('tempMobile');
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(saveUserToDB.data.userDetails))

        if(saveUserToDB.data.userDetails.role === 'AGENT'){
          router.replace('/(auth)/verifyAgent')
        }
        else if(saveUserToDB.data.userDetails.role === 'USER'){
          router.replace('/(auth)/finalRegisterForm')
        }

       }
        catch(e){
          console.log(e,'error--');
        } 

        
      }
      else{
        alert('Invalid OTP. Please try again')
      }
    }
    catch (error) {
      console.log(error, 'error--');
      alert(error.response.data.message)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='subtitle'>
        Enter Verification Code
      </ThemedText>
      <ThemedText type='default'>
        Enter the 4 digit code sent to you at 
      </ThemedText> 
      
      <ThemedText type='subtitle'>
         {phoneNumber?.code} {phoneNumber?.mobile}
      </ThemedText> 
      <ThemedView style={styles.optContainer}>
      <OtpInput 
        numberOfDigits={4}
        onTextChange={ (otp) =>setOtp(otp)}
        focusColor='#FFAC1C'
        focusStickBlinkingDuration={400}
        theme={{
            pinCodeContainerStyle:{
                backgroundColor:'#fff',
                width: horizontalScale(58),
                height: verticalScale(58),
                borderRadius: 10,
            }
        }}
/>   
</ThemedView>
<CustomButton buttonText='Verify' handlePress={handleVerifyNumber} />
    </ThemedView>
  )
}

export default OtpInputs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,


  },
  logoText: {
    marginTop: 60,
  },
  subheading: {

    marginTop: 20,
  },
  optContainer:{
    width: '80%',
    paddingTop: 20,
  }

})
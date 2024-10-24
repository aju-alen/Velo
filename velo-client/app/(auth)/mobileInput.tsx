import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Image, TouchableWithoutFeedback, FlatList, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '@/hooks/useColorScheme';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl'

export type selectedArea = {
  code: string,
  item: string,
  callingCode: string,
  flag: string
}


const mobileInput = () => {
  const colorScheme = useColorScheme();
  const [areas, setAreas] = useState([])
  const [mobile, setMobile] = useState('')
  const [selectedArea, setSelectedArea] = useState<selectedArea | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [finalModalVisible, setFinalModalVisible] = useState(false)
  const [tempRegister, setTempRegister] = useState({})

  useEffect(() => {
    const fetchTempRegister = async () => {
      let result = await SecureStore.getItemAsync('tempRegister');
      setTempRegister(JSON.parse(result))
    }
    fetchTempRegister()
  }, [])

  const handleConfirm = async () => {
    setFinalModalVisible(true)
  }

  const handleSubmit = async () => {

    try {
      const checkIfAlreadyRegistered = await axios.get(`${ipURL}/api/auth/check-registered-account/${selectedArea?.callingCode}/${mobile}`)
      console.log(checkIfAlreadyRegistered.data.accountExists, 'checkIfAlreadyRegistered.data--');
      if (checkIfAlreadyRegistered.data.accountExists && checkIfAlreadyRegistered.data.accountExists.role === "AGENT" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/verifyAgent')
      }
     else if (checkIfAlreadyRegistered.data.accountExists && checkIfAlreadyRegistered.data.accountExists.role === "USER" ) {
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(checkIfAlreadyRegistered.data.accountExists))
        router.replace('/(auth)/finalRegisterForm')
      }
      else {

        const mobileNumber = (selectedArea?.callingCode + mobile).replace("+", "");

        const resp = await axios.post(`https://api.smsala.com/api/Verify`, {
          "api_id": process.env.EXPO_PUBLIC_SMSALA_API_ID,
          "api_password": process.env.EXPO_PUBLIC_SMSALA_API_PASSWORD,
          "brand": process.env.EXPO_PUBLIC_SMSALA_API_BRAND,
          "phonenumber": mobileNumber,
          "sender_id": process.env.EXPO_PUBLIC_SMSALA_API_SENDER_ID,
        })
        console.log(resp.data, 'resp.data--');
        router.replace({
          pathname: "/otpInput",
          params: {
            verfication_id: resp.data.verfication_id
          }
        })


        await SecureStore.setItemAsync('tempMobile', JSON.stringify({
          mobile: mobile,
          code: selectedArea?.callingCode,
          country: selectedArea?.code
        }))

      }
      setFinalModalVisible(false)
    }
    catch (e) {
      console.log(e);
    }
  }

  const handleGoToChooseRole = () => {
    setFinalModalVisible(false)
    router.push('/(auth)/chooseRole')
  }

  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then(response => response.json())
      .then(data => {
        console.log(data);

        let areaData = data.map((item) => {
          return {
            code: item.alpha2Code,
            item: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
          }
        })
        setAreas(areaData)
        if (areaData.length > 0) {
          let defaultData = areaData.filter((a: any) => a.code == "AE");

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0])
          }
        }

      })
  }, [])
  console.log('====================================');
  console.log(selectedArea, 'selectedArea');
  console.log('====================================');
  function renderAreasCodesModal() {

    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            padding: moderateScale(10),
            flexDirection: "row"
          }}
          onPress={() => {
            setSelectedArea(item),
              setModalVisible(false)
          }}
        >
          <Image
            source={{ uri: item.flag }}
            style={{
              height: verticalScale(30),
              width: horizontalScale(30),
              marginRight: horizontalScale(10)
            }}
          />
          <Text style={{ fontSize: moderateScale(16), color: "#fff" }}>{item.item}</Text>
        </TouchableOpacity>
      )
    }



    return (

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: verticalScale(400),
                width: horizontalScale(400),
                backgroundColor: "#111",
                borderRadius: moderateScale(12),
              }}
            >
              <FlatList
                data={areas}
                renderItem={renderItem}
                horizontal={false}
                keyExtractor={(item) => item.code}
                style={{
                  padding: moderateScale(20),
                  marginBottom: verticalScale(20)
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  const confirmDetails = (tempRegister) => {
    console.log(tempRegister, 'tempRegister--');

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={finalModalVisible}
      >
        <ThemedView style={styles.container}>
          <ThemedText type='subtitle'>
            Confirm Details
          </ThemedText>
          <ThemedText type='default'>
            Please confirm your details
          </ThemedText>
          <ThemedText type='subtitle'>
            {selectedArea?.callingCode} {mobile}
          </ThemedText>
          <ThemedText type='subtitle'>
            {tempRegister?.name}
          </ThemedText>
          <ThemedText type='subtitle'>
            {tempRegister?.email}
          </ThemedText>
          <ThemedText type='subtitle'>
            {tempRegister?.role}
          </ThemedText>

          <CustomButton
            buttonText='Confirm'
            handlePress={handleSubmit} />

          <ThemedText type='default' style={{
            marginTop: verticalScale(20)
          }}> Made a mistake? <ThemedText type='link' onPress={handleGoToChooseRole}>
            Edit</ThemedText>
          </ThemedText>
        </ThemedView>

      </Modal>
    )


  }




  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText type='subtitle'>
          Enter Your Mobile Number
        </ThemedText>
        <ThemedText type='default'>
          We will send you a verification code
        </ThemedText>

        <ThemedView style={styles.inputContainer}>
          <TouchableOpacity style={styles.countryCodeTextButton} onPress={() => setModalVisible(true)}>
            <ThemedView style={{ justifyContent: "center", marginLeft: 5 }}>
              <Image
                source={{ uri: selectedArea?.flag }}
                style={{
                  width: horizontalScale(30),
                  height: verticalScale(30),
                }}
              />
            </ThemedView>

            <View style={{ justifyContent: "center", marginLeft: horizontalScale(5) }}>
              <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000', fontSize: moderateScale(12) }}>{selectedArea?.callingCode}</Text>
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder='Mobile Number'
            placeholderTextColor='grey'
            keyboardType='numeric'

          ></TextInput>
        </ThemedView>
        <CustomButton
          buttonText='Continue'
          handlePress={handleConfirm} />

        {renderAreasCodesModal()}
        {confirmDetails(tempRegister)}
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default mobileInput

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(40),


  },
  logoText: {
    marginTop: verticalScale(60),
  },
  subheading: {

    marginTop: verticalScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    borderColor: 'grey',
    borderBottomWidth: moderateScale(0.4),
    width: "100%",
    height: verticalScale(58),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: verticalScale(50),
  },
  countryCodeTextButton: {
    paddingLeft: horizontalScale(10),

  },
  input: {
    flex: 1,
    marginLeft: horizontalScale(10),
    fontSize: moderateScale(16),
    color: 'grey',
  }

})
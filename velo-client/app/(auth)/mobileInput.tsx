import { StyleSheet, TextInput, TouchableOpacity, Modal, Image, TouchableWithoutFeedback, FlatList, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useColorScheme } from '@/hooks/useColorScheme'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'

export type selectedArea = {
  code: string,
  item: string,
  callingCode: string,
  flag: string
}

const MobileInput = () => {
  const colorScheme = useColorScheme()
  const [areas, setAreas] = useState([])
  const [mobile, setMobile] = useState('')
  const [selectedArea, setSelectedArea] = useState<selectedArea | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [finalModalVisible, setFinalModalVisible] = useState(false)
  const [tempRegister, setTempRegister] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTempRegister = async () => {
      let result = await SecureStore.getItemAsync('tempRegister')
      setTempRegister(JSON.parse(result))
    }
    fetchTempRegister()
  }, [])

  const handleConfirm = () => {
    if (!mobile) {
      alert('Please enter a valid mobile number')
      return
    }
    setFinalModalVisible(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const checkIfAlreadyRegistered = await axios.get(
        `${ipURL}/api/auth/check-registered-account/${selectedArea?.callingCode}/${mobile}`
      )
      
      if (checkIfAlreadyRegistered.data.accountExists) {
        alert('Account already exists. Please Login')
        router.push('/(auth)/login')
        return
      }

      const mobileNumber = (selectedArea?.callingCode + mobile).replace("+", "")
      const resp = await axios.post(`https://api.smsala.com/api/Verify`, {
        "api_id":"API913750181010",
        "api_password": "Syndicate1#",
        "brand": "EssayScam",
        "phonenumber": mobileNumber,
        "sender_id": "EssayScam",
      })

      await SecureStore.setItemAsync('tempMobile', JSON.stringify({
        mobile: mobile,
        code: selectedArea?.callingCode,
        country: selectedArea?.code
      }))

      router.replace({
        pathname: "/otpInput",
        params: {
          verfication_id: resp.data.verfication_id
        }
      })
      
      setFinalModalVisible(false)
    } catch (e) {
      console.error(e)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
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
          }
        }
      })
      .catch(error => {
        console.error('Error fetching country data:', error)
        alert('Failed to load country data')
      })
  }, [])

  const renderAreaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryListItem}
      onPress={() => {
        setSelectedArea(item)
        setModalVisible(false)
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
      visible={modalVisible}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
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

  const ConfirmationModal = () => (
    <Modal animationType="slide" transparent={true} visible={finalModalVisible}>
      <ThemedView style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          {/* Header Section */}
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Confirm Your Details
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Please review and confirm your information.
            </ThemedText>
          </ThemedView>
  
          {/* Details Section */}
          <ThemedView style={styles.detailsContainer}>
            <DetailItem label="Phone Number" value={`${selectedArea?.callingCode} ${mobile}`} />
            <DetailItem label="Name" value={tempRegister?.name} />
            <DetailItem label="Email" value={tempRegister?.email} />
            <DetailItem label="Role" value={tempRegister?.role} />
          </ThemedView>
  
          {/* Action Buttons Section */}
          <ThemedView style={styles.actionContainer}>
            <CustomButton
              buttonText='Confirm'
              handlePress={handleSubmit}
              disableButton={false}
            />
            <TouchableOpacity onPress={handleGoToChooseRole} style={styles.editLink}>
              <ThemedText type="link" style={styles.editText}>
                Edit Details
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );

  const DetailItem = ({ label, value }) => (
    <ThemedView style={styles.detailItem}>
      <ThemedText type='default' style={styles.detailLabel}>{label}</ThemedText>
      <ThemedText type='subtitle' style={styles.detailValue}>{value}</ThemedText>
    </ThemedView>
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type='subtitle' style={styles.title}>
            Enter Your Mobile Number
          </ThemedText>
          <ThemedText type='default' style={styles.subtitle}>
            We will send you a verification code
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.countryCodeButton} 
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={{ uri: selectedArea?.flag }}
              style={styles.selectedFlag}
            />
            <ThemedText style={[
              styles.countryCode,
              { color: colorScheme === 'dark' ? '#fff' : '#000' }
            ]}>
              {selectedArea?.callingCode}
            </ThemedText>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder='Mobile Number'
            placeholderTextColor='grey'
            keyboardType='numeric'
            maxLength={12}
          />
        </ThemedView>

        <CustomButton
          buttonText='Continue'
          handlePress={handleConfirm}
          disabled={!mobile}
        />

        {renderAreasCodesModal()}
        <ConfirmationModal />
      </ThemedView>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,

    textAlign: 'center',
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
    borderColor: 'grey',
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(12),
    width: "100%",
    height: verticalScale(58),
    alignItems: 'center',
    marginBottom: verticalScale(30),
    paddingHorizontal: horizontalScale(15),
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
    marginLeft: horizontalScale(15),
    fontSize: moderateScale(16),
    color: 'grey',
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
  
  
})

export default MobileInput
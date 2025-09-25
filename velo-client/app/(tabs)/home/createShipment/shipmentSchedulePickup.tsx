import { SafeAreaView, StyleSheet, TouchableOpacity, TextInput, View, ScrollView,Alert, Text, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { horizontalScale, moderateScale } from '@/constants/metrics'
import { Divider} from 'react-native-paper'
import useShipmentStore from '@/store/shipmentStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import TimePickerModal from '@/components/TimePickerModal'
import PickupInstructionModal from '@/components/PickupInstructionModal'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors';


const ShipmentSchedulePickup = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { savedAddressData, accountAddressData, deliveryServices, packageDetail, setDeliveryServices,itemType,setEditData,packageDescription } = useShipmentStore()
  const [checked, setChecked] = useState('yes')
  const [openTimeModal, setOpenTimeModal] = useState(false)
  const [pickupInstructionmodal, setPickupInstructionModal] = useState(false)

  console.log(packageDescription,'saved--as-da-sd-asd-a-sd');
  

  const formattedDate = savedAddressData.deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
 console.log(formattedDate,'formatDate');
 console.log(savedAddressData.shipmentDate,'shipmentDate');
 
 
 const handleFinalPreview = () => {
  if (!deliveryServices.deliveryPickupTimeFrom || !deliveryServices.deliveryPickupTimeTo) {
    Alert.alert(
      'Missing Information',
      'Please select both pickup start and end times before proceeding.',
      [{ text: 'OK' }]
    )
    return
  }

  router.replace('/(tabs)/home/createShipment/viewShippingOptions')
}
  

  const handleCloseTimeModal = () => setOpenTimeModal(false)
  const handleClosInstructioneModal = () => setPickupInstructionModal(false)

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
    <View >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.header, { color: themeColors.text }]}>Shipment Schedule Pickup</Text>
        
        {/* Schedule Options */}
        {/* <View style={styles.radioContainer}>
          <TouchableOpacity 
            style={[styles.radioBox, checked === 'yes' && styles.radioBoxSelected]}
            onPress={() => setChecked('yes')}
          >
            <RadioButton
              value="yes"
              status={checked === 'yes' ? 'checked' : 'unchecked'}
              color="#FFAC1C"
            />
            <Text style={styles.radioText}>Yes-Schedule a pickup</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.radioBox, checked === 'no' && styles.radioBoxSelected]}
            onPress={() => setChecked('no')}
          >
            <RadioButton
              value="no"
              status={checked === 'no' ? 'checked' : 'unchecked'}
              color="#FFAC1C"
            />
            <Text style={styles.radioText}>No</Text>
          </TouchableOpacity>
        </View> */}

        <Divider style={styles.divider} />

        {/* Pickup Date Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.pickupDateHeaderContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pickup Date</Text>
            <Text style={[styles.dateText, { color: '#FFAC1C' }]}>{formattedDate}</Text>
          </View>
          
          <View style={[styles.infoBox, { backgroundColor: themeColors.background }]}>
            <Ionicons name="information-circle-sharp" size={24} color="#FFAC1C" />
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              If you wish to change any of the data,
              <TouchableOpacity onPress={()=>{
              setEditData(true)
              router.replace('/(tabs)/home/createShipment')
                }}>
                <Text style={{ color: '#FFAC1C', textDecorationLine: 'underline' }}>
                  CLICK HERE
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>

        {/* Pickup Address Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pickup Address</Text>
          <View style={[styles.addressCard, { backgroundColor: themeColors.background, borderColor: themeColors.text }]}>
            <Text style={[styles.addressName, { color: themeColors.text }]}>{accountAddressData.userName}</Text>
            <Text style={[styles.addressText, { color: themeColors.text }]}>
              {accountAddressData.addressOne},{accountAddressData.addressTwo}
            </Text>
            <Text style={[styles.addressText, { color: themeColors.text }]}>
              {accountAddressData.city}, {accountAddressData.state}
            </Text>
            <Text style={[styles.addressText, { color: themeColors.text }]}>{accountAddressData.email}</Text>
            <Text style={[styles.addressText, { color: themeColors.text }]}>
              {accountAddressData.countryCode} {accountAddressData.mobileNumber}
            </Text>
          </View>
        </View>

        {/* Pickup Time Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <TouchableOpacity 
            onPress={() => setOpenTimeModal(true)} 
            style={[styles.timeButton, { backgroundColor: themeColors.background, borderColor: themeColors.text }]}
          >
            <View>
              <Text style={[styles.buttonLabel, { color: themeColors.text }]}>Select Pickup Time</Text>
              <Text style={[styles.selectedTime, { color: '#FFAC1C' }]}>
                {deliveryServices.deliveryPickupTimeFrom} - {deliveryServices.deliveryPickupTimeTo}
              </Text>
            </View>
            <Ionicons name="time-outline" size={24} color="#FFAC1C" />
          </TouchableOpacity>
        </View>

        {/* Weight Section ONLY FOR PACKAGE TYPE*/}
        {itemType === 'PACKAGE' &&<View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Weight (kg)</Text>
          <View style={[styles.weightCard, { backgroundColor: themeColors.background, borderColor: themeColors.text }]}>
            <Text style={[styles.weightLabel, { color: themeColors.text }]}>Total Weight</Text>
            <Text style={[styles.weightValue, { color: themeColors.text }]}>{packageDetail.weight}</Text>
          </View>
        </View>}

        {/* Num of pieces Section ONLY FOR DOCUMENT TYPE*/}
        {itemType === 'DOCUMENT' &&<View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Number of pieces</Text>
          <View style={[styles.weightCard, { backgroundColor: themeColors.background, borderColor: themeColors.text }]}>
            <Text style={[styles.weightLabel, { color: themeColors.text }]}>Total Pieces</Text>
            <Text style={[styles.weightValue, { color: themeColors.text }]}>{packageDetail.numberOfPieces}</Text>
          </View>
        </View>}

        {/* Pickup Instructions Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pickup Instructions
            
          </Text>

          <TouchableOpacity 
            style={[styles.instructionButton, { backgroundColor: themeColors.background, borderColor: themeColors.text }]}
            onPress={() => setPickupInstructionModal(true)}
          >
            <Text style={[styles.buttonText, { color: themeColors.text }]}>Pickup From - 
            <Text style={{ fontSize: moderateScale(12), lineHeight: moderateScale(16) }}> {deliveryServices.pickupInstruction}</Text>
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#FFAC1C" />
          </TouchableOpacity>
        </View>

        {/* Special Instructions Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Special Instruction(s)</Text>
          <TextInput
            style={[styles.textInput,{color: themeColors.text, backgroundColor: themeColors.background, borderColor: themeColors.text}]}
            multiline
            placeholder="Eg: Don't ring bell, call on arrival"
            numberOfLines={4}
            value={deliveryServices.pickupSpecialInstruction}
            onChangeText={(text) => 
              setDeliveryServices({ ...deliveryServices, pickupSpecialInstruction: text })
            }
            placeholderTextColor="#999"
          />
        </View>
        <View style={{ backgroundColor: themeColors.background }}>
            <TouchableOpacity 
              style={[
                styles.buttonContainer, 
                (!deliveryServices.deliveryPickupTimeFrom || !deliveryServices.deliveryPickupTimeTo) 
                  && styles.disabledButton
              ]}
              onPress={handleFinalPreview}
              disabled={
                !deliveryServices.deliveryPickupTimeFrom || !deliveryServices.deliveryPickupTimeTo
              }
            >
              <Text style={styles.finalPreviewText}>
                View Shipping Options
              </Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>

      <TimePickerModal 
        openModal={openTimeModal} 
        handleCloseModal={handleCloseTimeModal} 
      />
      <PickupInstructionModal 
        openModal={pickupInstructionmodal} 
        handleCloseModal={handleClosInstructioneModal} 
      />
    </View>
    </ScrollView>
  )
}

export default ShipmentSchedulePickup

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: '#FFAC1C',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Light gray color for disabled state
  },
  finalPreviewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: horizontalScale(16),
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: horizontalScale(8),
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: horizontalScale(8),
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#E0E0E0',
    width: '48%',

  },
  radioBoxSelected: {
    borderColor: '#FFAC1C',

  },
  radioText: {
    marginLeft: horizontalScale(4),
  },
  divider: {
    marginVertical: horizontalScale(24),

  },
  sectionContainer: {
    marginBottom: horizontalScale(24),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: horizontalScale(8),
  },
  pickupDateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: horizontalScale(16),
  },
  dateText: {
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: horizontalScale(12),
    borderRadius: 8,
  },
  infoText: {
    marginLeft: horizontalScale(8),
    flex: 1,
  },
  addressCard: {

    padding: horizontalScale(16),
    borderRadius: 12,
    borderWidth: 1,
  },
  addressName: {
    fontWeight: '600',
    marginBottom: horizontalScale(8),
  },
  addressText: {

    marginBottom: horizontalScale(4),
  },
  timeButton: {

    padding: horizontalScale(16),
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonLabel: {
    fontWeight: '500',
    marginBottom: horizontalScale(4),
  },
  selectedTime: {
  },
  weightCard: {

    padding: horizontalScale(16),
    borderRadius: 12,
    borderWidth: 1,
  },
  weightLabel: {

    marginBottom: horizontalScale(4),
  },
  weightValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  instructionButton: {

    padding: horizontalScale(16),
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {

    borderWidth: 1,
    borderRadius: 12,
    padding: horizontalScale(12),
    height: horizontalScale(120),
    textAlignVertical: 'top',
  },
  buttonText: {
    fontWeight: '500',
    
  },
  

 
  
})
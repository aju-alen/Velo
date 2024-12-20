import { SafeAreaView, StyleSheet, TouchableOpacity, TextInput, View, ScrollView,Alert } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { horizontalScale, moderateScale } from '@/constants/metrics'
import { Divider} from 'react-native-paper'
import useShipmentStore from '@/store/shipmentStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import TimePickerModal from '@/components/TimePickerModal'
import PickupInstructionModal from '@/components/PickupInstructionModal'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'


const ShipmentSchedulePickup = () => {
  const colorScheme = useColorScheme()
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
    <ScrollView style={styles.container}>
    <ThemedView >
      <SafeAreaView style={styles.safeArea}>
        <ThemedText style={styles.header}>Shipment Schedule Pickup</ThemedText>
        
        {/* Schedule Options */}
        {/* <ThemedView style={styles.radioContainer}>
          <TouchableOpacity 
            style={[styles.radioBox, checked === 'yes' && styles.radioBoxSelected]}
            onPress={() => setChecked('yes')}
          >
            <RadioButton
              value="yes"
              status={checked === 'yes' ? 'checked' : 'unchecked'}
              color="#FFAC1C"
            />
            <ThemedText style={styles.radioText}>Yes-Schedule a pickup</ThemedText>
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
            <ThemedText style={styles.radioText}>No</ThemedText>
          </TouchableOpacity>
        </ThemedView> */}

        <Divider style={styles.divider} />

        {/* Pickup Date Section */}
        <ThemedView style={styles.sectionContainer}>
          <View style={styles.pickupDateHeaderContainer}>
            <ThemedText style={styles.sectionTitle}>Pickup Date</ThemedText>
            <ThemedText style={styles.dateText}>{formattedDate}</ThemedText>
          </View>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-sharp" size={24} color="#FFAC1C" />
            <ThemedText style={styles.infoText}>
              If you wish to change any of the data,
              <TouchableOpacity onPress={()=>{
              setEditData(true)
              router.replace('/(tabs)/home/createShipment')
                }}>
                <ThemedText type='link'>
                  CLICK HERE
                </ThemedText>
              </TouchableOpacity>
            </ThemedText>
          </View>
        </ThemedView>

        {/* Pickup Address Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Pickup Address</ThemedText>
          <View style={styles.addressCard}>
            <ThemedText style={styles.addressName}>{accountAddressData.userName}</ThemedText>
            <ThemedText style={styles.addressText}>
              {accountAddressData.addressOne},{accountAddressData.addressTwo}
            </ThemedText>
            <ThemedText style={styles.addressText}>
              {accountAddressData.city}, {accountAddressData.state}
            </ThemedText>
            <ThemedText style={styles.addressText}>{accountAddressData.email}</ThemedText>
            <ThemedText style={styles.addressText}>
              {accountAddressData.countryCode} {accountAddressData.mobileNumber}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Pickup Time Section */}
        <ThemedView style={styles.sectionContainer}>
          <TouchableOpacity 
            onPress={() => setOpenTimeModal(true)} 
            style={styles.timeButton}
          >
            <View>
              <ThemedText style={styles.buttonLabel}>Select Pickup Time</ThemedText>
              <ThemedText style={styles.selectedTime}>
                {deliveryServices.deliveryPickupTimeFrom} - {deliveryServices.deliveryPickupTimeTo}
              </ThemedText>
            </View>
            <Ionicons name="time-outline" size={24} color="#FFAC1C" />
          </TouchableOpacity>
        </ThemedView>

        {/* Weight Section ONLY FOR PACKAGE TYPE*/}
        {itemType === 'PACKAGE' &&<ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Weight (kg)</ThemedText>
          <View style={styles.weightCard}>
            <ThemedText style={styles.weightLabel}>Total Weight</ThemedText>
            <ThemedText style={styles.weightValue}>{packageDetail.weight}</ThemedText>
          </View>
        </ThemedView>}

        {/* Num of pieces Section ONLY FOR DOCUMENT TYPE*/}
        {itemType === 'DOCUMENT' &&<ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Number of pieces</ThemedText>
          <View style={styles.weightCard}>
            <ThemedText style={styles.weightLabel}>Total Pieces</ThemedText>
            <ThemedText style={styles.weightValue}>{packageDetail.numberOfPieces}</ThemedText>
          </View>
        </ThemedView>}

        {/* Pickup Instructions Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Pickup Instructions
            
          </ThemedText>

          <TouchableOpacity 
            style={styles.instructionButton}
            onPress={() => setPickupInstructionModal(true)}
          >
            <ThemedText style={styles.buttonText}>Pickup From - 
            <ThemedText type='mini'> {deliveryServices.pickupInstruction}</ThemedText>
            </ThemedText>
            <Ionicons name="chevron-forward" size={24} color="#FFAC1C" />
          </TouchableOpacity>
        </ThemedView>

        {/* Special Instructions Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Special Instruction(s)</ThemedText>
          <TextInput
            style={[styles.textInput,{color: colorScheme === 'light' ? '#000' : '#fff'}]}
            multiline
            placeholder="Eg: Don't ring bell, call on arrival"
            numberOfLines={4}
            value={deliveryServices.pickupSpecialInstruction}
            onChangeText={(text) => 
              setDeliveryServices({ ...deliveryServices, pickupSpecialInstruction: text })
            }
            placeholderTextColor="#999"
          />
        </ThemedView>
        <ThemedView>
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
              <ThemedText style={styles.finalPreviewText}>
                View Shipping Options
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
      </SafeAreaView>

      <TimePickerModal 
        openModal={openTimeModal} 
        handleCloseModal={handleCloseTimeModal} 
      />
      <PickupInstructionModal 
        openModal={pickupInstructionmodal} 
        handleCloseModal={handleClosInstructioneModal} 
      />
    </ThemedView>
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
    color: '#FFAC1C',
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
    borderColor: '#E0E0E0',
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
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonLabel: {
    fontWeight: '500',
    marginBottom: horizontalScale(4),
  },
  selectedTime: {
    color: '#FFAC1C',
  },
  weightCard: {

    padding: horizontalScale(16),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {

    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: horizontalScale(12),
    height: horizontalScale(120),
    textAlignVertical: 'top',
  },
  buttonText: {
    fontWeight: '500',
    
  },
  

 
  
})
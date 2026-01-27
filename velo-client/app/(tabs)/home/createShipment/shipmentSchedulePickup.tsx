import { SafeAreaView, StyleSheet, TouchableOpacity, TextInput, View, ScrollView,Alert, Text, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
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
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Pickup Date Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.pickupDateHeaderContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pickup Date</Text>
            <Text style={[styles.dateText, { color: '#FFAC1C' }]}>{formattedDate}</Text>
          </View>
        </View>

        {/* Pickup Address Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(12) }]}>Pickup Address</Text>
          <View style={[styles.addressCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
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
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(12) }]}>Pickup Time</Text>
          <TouchableOpacity 
            onPress={() => setOpenTimeModal(true)} 
            style={[styles.timeButton, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
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
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(12) }]}>Weight (kg)</Text>
          <View style={[styles.weightCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
            <Text style={[styles.weightLabel, { color: themeColors.text }]}>Total Weight</Text>
            <Text style={[styles.weightValue, { color: themeColors.text }]}>{packageDetail.weight}</Text>
          </View>
        </View>}

        {/* Num of pieces Section ONLY FOR DOCUMENT TYPE*/}
        {itemType === 'DOCUMENT' &&<View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(12) }]}>Number of pieces</Text>
          <View style={[styles.weightCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
            <Text style={[styles.weightLabel, { color: themeColors.text }]}>Total Pieces</Text>
            <Text style={[styles.weightValue, { color: themeColors.text }]}>{packageDetail.numberOfPieces}</Text>
          </View>
        </View>}

        {/* Pickup Instructions Section */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(12) }]}>Pickup Instructions</Text>

          <TouchableOpacity 
            style={[styles.instructionButton, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
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
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(12) }]}>Special Instruction(s)</Text>
          <TextInput
            style={[styles.textInput,{color: themeColors.text, backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}]}
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
        <View style={styles.buttonWrapper}>
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
      </ScrollView>

      <TimePickerModal 
        openModal={openTimeModal} 
        handleCloseModal={handleCloseTimeModal} 
      />
      <PickupInstructionModal 
        openModal={pickupInstructionmodal} 
        handleCloseModal={handleClosInstructioneModal} 
      />
    </SafeAreaView>
  )
}

export default ShipmentSchedulePickup

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(80),
  },
  buttonWrapper: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(20),
  },
  buttonContainer: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginVertical: verticalScale(20),
  },
  sectionContainer: {
    marginBottom: verticalScale(20),
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
    marginTop: verticalScale(8),
    borderRadius: moderateScale(12),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginTop: verticalScale(8),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonLabel: {
    fontWeight: '500',
    marginBottom: horizontalScale(4),
  },
  selectedTime: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  weightCard: {
    padding: horizontalScale(16),
    marginTop: verticalScale(8),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginTop: verticalScale(8),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textInput: {
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: horizontalScale(12),
    height: verticalScale(100),
    textAlignVertical: 'top',
    fontSize: moderateScale(14),
  },
  buttonText: {
    fontWeight: '500',
    
  },
  

 
  
})
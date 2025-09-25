import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, FlatList, View, Text, useColorScheme } from 'react-native';
import useShipmentStore from '@/store/shipmentStore';
import { verticalScale,moderateScale,horizontalScale } from '@/constants/metrics';
import { Colors } from '@/constants/Colors';

const PickupInstructionModal = ({openModal,handleCloseModal}) => {
    const {setDeliveryServices,deliveryServices} = useShipmentStore();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
    const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
    const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
    const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';
    
    const instructions = ['Doorstep', 'Reception'];

//   ---------------------------------
  const handleSelectitem = (item) => { 
    setDeliveryServices({
        ...deliveryServices,
        pickupInstruction: item,
    });
    handleCloseModal();
  }

  return (
    <Modal
      visible={openModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal} // Handle Android back button
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.contentContainer, { backgroundColor: bgCard }]}>
          <Text style={[styles.title, { color: textPrimary }]}>Pickup Instructions</Text>
          <FlatList
            data={instructions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, { backgroundColor: bgCard, borderColor: borderColor }]}
                onPress={()=>handleSelectitem(item)}
              >
                <Text style={[styles.optionText, { color: textPrimary }]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Text style={[styles.closeButtonText, { color: '#FFF' }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PickupInstructionModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  option: {
    padding: moderateScale(15),
    marginVertical: verticalScale(8),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: moderateScale(16),
  },
  closeButton: {
    marginTop: moderateScale(20),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(10),
  },
  closeButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

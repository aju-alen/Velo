import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import useShipmentStore from '@/store/shipmentStore';
import { verticalScale,moderateScale,horizontalScale } from '@/constants/metrics';

const PickupInstructionModal = ({openModal,handleCloseModal}) => {
    const {setDeliveryServices,deliveryServices} = useShipmentStore();
  const instructions = ['Front Door', 'Ring Door', 'Reception'];

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
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.contentContainer}>
          <ThemedText style={styles.title}>Pickup Instructions</ThemedText>
          <FlatList
            data={instructions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={()=>handleSelectitem(item)}
              >
                <ThemedText style={styles.optionText}>{item}</ThemedText>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default PickupInstructionModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    borderColor: '#e0e0e0',
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

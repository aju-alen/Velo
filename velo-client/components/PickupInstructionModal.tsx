import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, FlatList, View, Text, useColorScheme, TouchableWithoutFeedback } from 'react-native';
import useShipmentStore from '@/store/shipmentStore';
import { verticalScale,moderateScale,horizontalScale } from '@/constants/metrics';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

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
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.contentContainer, { backgroundColor: bgCard }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.title, { color: textPrimary }]}>Pickup Instructions</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <MaterialIcons name="close" size={24} color={textPrimary} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={instructions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.option, { 
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      borderColor: borderColor 
                    }]}
                    onPress={()=>handleSelectitem(item)}
                  >
                    <Text style={[styles.optionText, { color: textPrimary }]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    flex: 1,
  },
  option: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(16),
    marginVertical: verticalScale(6),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
});

import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { horizontalScale, verticalScale } from '@/constants/metrics'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

const { width } = Dimensions.get('window')

const CreateShipmentHome = () => {
  const [modalVisible, setModalVisible] = useState(true)
  const [selectedOption, setSelectedOption] = useState(null)

  const options = [
    { id: 1, text: 'Online Payment' },
    { id: 2, text: 'Payment during pickup' }
  ]

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setModalVisible(false)
  }

  return (
    <ThemedView style={styles.container}>
        
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Payment Type</ThemedText>

            <ThemedView style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    selectedOption?.id === option.id && styles.selectedOption
                  ]}
                  onPress={() => handleOptionSelect(option)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={[
                    styles.optionText,
                    selectedOption?.id === option.id && styles.selectedOptionText
                  ]}>
                    {option.text}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>

      <ThemedText style={styles.mainText}>
        {selectedOption ? `Creating ${selectedOption.text}` : 'Create Shipment Home'}
      </ThemedText>
    </ThemedView>
  )
}

export default CreateShipmentHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#FFAC1C',
    padding: verticalScale(20),
    borderRadius: 12,
    width: width * 0.85,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: verticalScale(16),
    color: '#000',
  },
  optionsContainer: {
    gap: verticalScale(10),
  },
  optionButton: {
    padding: verticalScale(14),
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    opacity: 0.8,
  },
  selectedOptionText: {
    fontWeight: '500',
    opacity: 1,
  },
  mainText: {
    fontSize: 18,
    fontWeight: '500',
  },
})
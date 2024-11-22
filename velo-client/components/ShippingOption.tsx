import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { verticalScale, horizontalScale } from '@/constants/metrics'
import { ThemedView } from './ThemedView'

interface ShippingOptionProps {
  title: string
  price: string
  duration: string
  isSelected: boolean
  onSelect: () => void
}

export const ShippingOption: React.FC<ShippingOptionProps> = ({ 
  title, 
  price, 
  duration, 
  isSelected, 
  onSelect 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selected]} 
      onPress={onSelect}
    >
      <ThemedView style={styles.content}>
        <ThemedText type='defaultSemiBold' style={styles.title}>{title}</ThemedText>
        <ThemedText type='default' style={styles.duration}>{duration}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.priceContainer}>
        <ThemedText type='defaultSemiBold' style={styles.price}>{price}</ThemedText>
        {isSelected && (
          <MaterialCommunityIcons name="check-circle" size={24} color="#FFD700" />
        )}
      </ThemedView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: verticalScale(16),
    borderRadius: 12,
    marginBottom: verticalScale(12),
  },
  selected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: verticalScale(4),
  },
  duration: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    color: '#FFD700',
    marginRight: horizontalScale(8),
  },
})


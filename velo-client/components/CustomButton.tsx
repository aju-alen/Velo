import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'
import { TouchableOpacity } from 'react-native'
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics'



export type CustomButton = {
  buttonText?: string;
  handlePress: () => void;
  buttonWidth?: number;
  disableButton?: boolean;
};

const CustomButton = ({ buttonText, handlePress, buttonWidth, disableButton}: CustomButton) => {
  return (
    <ThemedView style={[styles.buttonContainer, { width: buttonWidth ? horizontalScale(buttonWidth) : horizontalScale(300) }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={disableButton? true : false}

      >
        <ThemedText type='custom' style={styles.heroText}>
          {buttonText}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFAC1C',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(20),
    elevation: 3, // Adds subtle shadow on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center', // Centers content horizontally
  },
  heroText: {
    fontSize: moderateScale(24),
    fontWeight: '600', // Slightly less bold for better readability
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5, // Improves text readability
    includeFontPadding: false, // Removes extra padding around text
    textShadowColor: 'rgba(0, 0, 0, 0.1)', // Subtle text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
})
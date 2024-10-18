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
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(20),
  },
  heroText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  }
})
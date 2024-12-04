import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
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

const CustomButton = ({ buttonText, handlePress, buttonWidth, disableButton }: CustomButton) => {
  return (
    <TouchableOpacity
    onPress={handlePress}
    activeOpacity={0.7}
    disabled={disableButton ? true : false}
  >
    <ThemedView style={[styles.buttonContainer, { width: buttonWidth ? horizontalScale(buttonWidth) : horizontalScale(300) }]}>
     
        {disableButton ?(
          <ActivityIndicator size="small" color="white" />
        ):<ThemedText style={styles.heroText}>
          {buttonText}
        </ThemedText>}
    </ThemedView>
      </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFAC1C',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    width: '100%',
    overflow: 'hidden',

    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '600',
  }
})
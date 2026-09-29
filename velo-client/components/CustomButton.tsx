import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { horizontalScale, verticalScale } from '@/constants/metrics';
import { Brand, Radius } from '@/constants/Colors';
import { AppText } from '@/components/AppText';

export type CustomButtonProps = {
  buttonText?: string;
  handlePress: () => void;
  buttonWidth?: number;
  disableButton?: boolean;
};

const CustomButton = ({ buttonText, handlePress, buttonWidth, disableButton }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={!!disableButton}
      style={[
        styles.buttonContainer,
        buttonWidth
          ? { width: horizontalScale(buttonWidth), alignSelf: 'center' }
          : { width: '100%', alignSelf: 'stretch' },
        { opacity: disableButton ? 0.55 : 1 },
      ]}
    >
      {disableButton ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <AppText variant="button" color="#FFFFFF">
          {buttonText}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Brand.amber,
    paddingVertical: verticalScale(14),
    paddingHorizontal: 20,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

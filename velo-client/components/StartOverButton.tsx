import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { moderateScale, verticalScale } from '@/constants/metrics';
import useLoginAccountStore from '@/store/loginAccountStore';
import { confirmAbandonRegistration } from '@/utils/abandonRegistration';

type StartOverButtonProps = {
  containerStyle?: object;
};

const StartOverButton = ({ containerStyle }: StartOverButtonProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const { resetAccountLoginData } = useLoginAccountStore();

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => confirmAbandonRegistration(resetAccountLoginData)}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: colorScheme === 'dark' ? '#FF8A8A' : '#D32F2F' }]}>
        Delete account & start over
      </Text>
    </TouchableOpacity>
  );
};

export default StartOverButton;

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

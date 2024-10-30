import { Text, type TextProps, StyleSheet } from 'react-native';
import { verticalScale,horizontalScale,moderateScale } from '@/constants/metrics';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' |'custom' | 'logoText' | 'mini' | 'catText';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'custom' ? styles.custom : undefined,
        type === 'logoText' ? styles.logoText : undefined,
        type === 'mini' ? styles.mini : undefined,
        type === 'catText' ? styles.catText : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  defaultSemiBold: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    lineHeight: moderateScale(44),
  },
  subtitle: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(28),
    fontWeight: 'bold',
  },
  link: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    color: '#0a7ea4',
  },
  custom: {
    fontSize: moderateScale(26),
    lineHeight: moderateScale(36),
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: moderateScale(40),
    lineHeight: moderateScale(56),
    fontWeight: 'bold',
    color: '#FFAC1C',
  },
  mini:{
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  catText:{
    fontSize: moderateScale(13),
    lineHeight: moderateScale(16),
  }
});

import React from 'react';
import { Text, type TextProps, StyleProp, TextStyle } from 'react-native';
import { Type, type TypeVariant } from '@/constants/typography';
import { useAppTheme } from '@/hooks/useAppTheme';

export type AppTextProps = TextProps & {
  variant?: TypeVariant;
  muted?: boolean;
  secondary?: boolean;
  color?: string;
};

/**
 * Canonical text component — platform system font + locked type scale.
 * fontFamily is intentionally omitted so iOS uses SF and Android uses Roboto.
 */
export function AppText({
  variant = 'body',
  muted,
  secondary,
  color,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useAppTheme();
  const resolvedColor =
    color ??
    (muted ? colors.textMuted : secondary ? colors.textSecondary : colors.text);

  return (
    <Text
      {...rest}
      style={[Type[variant], { color: resolvedColor }, style as StyleProp<TextStyle>]}
    />
  );
}

export default AppText;

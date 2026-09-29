import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { Brand } from '@/constants/Colors';
import { Type } from '@/constants/typography';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Maps legacy ThemedText `type` values onto the locked type scale.
 */
const TYPE_MAP = {
  default: 'body',
  defaultSemiBold: 'bodyStrong',
  title: 'h1',
  subtitle: 'h2',
  link: 'link',
  custom: 'h2',
  logoText: 'display',
  mini: 'caption',
  catText: 'caption',
} as const;

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: keyof typeof TYPE_MAP;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const variant = TYPE_MAP[type] ?? 'body';
  const scale = Type[variant];

  return (
    <Text
      style={[
        scale,
        {
          color: type === 'link' ? Brand.amber : type === 'logoText' ? Brand.amber : color,
        },
        style,
      ]}
      {...rest}
    />
  );
}

/** @deprecated Prefer importing Type / AppText — kept for compatibility */
export const themedTextStyles = StyleSheet.create({
  default: Type.body,
  defaultSemiBold: Type.bodyStrong,
  title: Type.h1,
  subtitle: Type.h2,
  link: Type.link,
  custom: Type.h2,
  logoText: Type.display,
  mini: Type.caption,
  catText: Type.caption,
});

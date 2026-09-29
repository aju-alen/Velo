import React from 'react';
import { Text, TextInput } from 'react-native';
import { Type } from '@/constants/typography';

type AnyComponent = {
  render?: (...args: unknown[]) => React.ReactElement;
  defaultProps?: Record<string, unknown>;
  __veloTypographyPatched?: boolean;
};

/**
 * Apply default body size on Text / TextInput.
 * Does NOT set fontFamily — platform defaults (SF / Roboto) must remain untouched.
 */
export function applyGlobalTypography() {
  const textDefaults = Text as unknown as AnyComponent;
  if (textDefaults.__veloTypographyPatched) return;

  textDefaults.defaultProps = {
    ...(textDefaults.defaultProps || {}),
    style: {
      fontSize: Type.body.fontSize,
      lineHeight: Type.body.lineHeight,
    },
  };
  textDefaults.__veloTypographyPatched = true;

  const inputDefaults = TextInput as unknown as AnyComponent;
  inputDefaults.defaultProps = {
    ...(inputDefaults.defaultProps || {}),
    style: {
      fontSize: Type.body.fontSize,
    },
  };
}

import React, { ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, Radius } from '@/constants/Colors';
import { Type } from '@/constants/typography';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  rightSlot?: ReactNode;
  containerStyle?: StyleProp<TextStyle>;
};

/**
 * Accessible labeled field: visible label, linked hint/error, large tap target.
 */
export function FormField({
  label,
  error,
  hint,
  rightSlot,
  containerStyle,
  style,
  ...inputProps
}: FormFieldProps) {
  const { colors, radius } = useAppTheme();
  const inputId = label.replace(/\s+/g, '-').toLowerCase();
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrap, containerStyle as object]}>
      <AppText variant="label" style={styles.label} nativeID={`${inputId}-label`}>
        {label}
      </AppText>
      <View
        style={[
          styles.row,
          {
            backgroundColor: colors.surface,
            borderColor: hasError ? colors.danger : colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          accessibilityHint={hint || error}
          accessibilityLabeledBy={`${inputId}-label`}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { color: colors.text },
            style,
          ]}
        />
        {rightSlot}
      </View>
      {hasError ? (
        <AppText variant="caption" color={colors.danger} style={styles.meta}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" muted style={styles.meta}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  label: {
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: Type.body.fontSize,
    lineHeight: Type.body.lineHeight,
    paddingVertical: Spacing.md,
  },
  meta: {
    marginLeft: 2,
  },
});

export default FormField;

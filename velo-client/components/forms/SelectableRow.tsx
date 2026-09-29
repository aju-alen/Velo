import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

type SelectableRowProps = {
  title: string;
  description?: string;
  selected?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Text-only selectable row for roles, package type, services, etc. */
export function SelectableRow({
  title,
  description,
  selected,
  onPress,
  accessibilityLabel,
}: SelectableRowProps) {
  const { colors, brand, radius } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={accessibilityLabel || title}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: selected ? brand.amber : colors.border,
          borderWidth: selected ? 2 : 1,
          borderRadius: radius.md,
        },
      ]}
    >
      <View style={styles.text}>
        <AppText variant="h3">{title}</AppText>
        {description ? (
          <AppText variant="bodySmall" secondary style={styles.desc}>
            {description}
          </AppText>
        ) : null}
      </View>
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? brand.amber : colors.border,
            backgroundColor: selected ? brand.amber : 'transparent',
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  desc: {
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});

export default SelectableRow;

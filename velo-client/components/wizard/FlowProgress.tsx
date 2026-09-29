import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

type FlowProgressProps = {
  step: number;
  total: number;
  label: string;
  nextLabel?: string;
  /** When set, completed/current steps are tappable (e.g. draft editing). */
  onStepPress?: (stepNumber: number) => void;
};

/**
 * Text-first step indicator with optional “Next” cue for orientation.
 * Completed steps are tappable when `onStepPress` is provided.
 */
export function FlowProgress({
  step,
  total,
  label,
  nextLabel,
  onStepPress,
}: FlowProgressProps) {
  const { colors, brand, radius } = useAppTheme();
  const progress = Math.min(1, Math.max(0, step / total));

  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: total,
        now: step,
        text: `Step ${step} of ${total}${nextLabel ? `, next ${nextLabel}` : ''}`,
      }}
    >
      <View style={styles.metaRow}>
        <AppText variant="caption" secondary style={styles.meta}>
          Step {step} of {total} · {label}
        </AppText>
        {nextLabel && step < total ? (
          <AppText variant="caption" color={brand.amber} style={styles.next}>
            Next: {nextLabel}
          </AppText>
        ) : null}
      </View>

      {onStepPress ? (
        <View style={styles.stepRow}>
          {Array.from({ length: total }, (_, i) => {
            const n = i + 1;
            const reached = n <= step;
            const current = n === step;
            return (
              <Pressable
                key={n}
                disabled={!reached}
                onPress={() => reached && onStepPress(n)}
                accessibilityRole="button"
                accessibilityState={{ disabled: !reached, selected: current }}
                accessibilityLabel={`Step ${n}${current ? ', current' : reached ? ', edit' : ''}`}
                hitSlop={6}
                style={[
                  styles.stepChip,
                  {
                    backgroundColor: reached ? colors.tintMuted : colors.surface,
                    borderColor: current ? brand.amber : colors.border,
                    opacity: reached ? 1 : 0.45,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={reached ? brand.amber : colors.textMuted}
                  style={current ? styles.stepChipCurrent : undefined}
                >
                  {n}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <View style={[styles.track, { backgroundColor: colors.borderSubtle, borderRadius: radius.pill }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              backgroundColor: brand.amber,
              borderRadius: radius.pill,
            },
          ]}
        />
      </View>

      {onStepPress && step > 1 ? (
        <AppText variant="caption" muted>
          Tap a previous step to edit it
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  meta: {
    letterSpacing: 0.2,
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 0,
  },
  next: {
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '42%',
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  stepChip: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepChipCurrent: {
    fontWeight: '700',
  },
  track: {
    height: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default FlowProgress;

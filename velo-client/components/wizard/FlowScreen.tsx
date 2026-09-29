import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { FlowProgress } from '@/components/wizard/FlowProgress';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

type FlowScreenProps = {
  step?: number;
  total?: number;
  stepLabel?: string;
  nextLabel?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: ViewStyle;
  onStepPress?: (stepNumber: number) => void;
};

/**
 * Shared wizard layout: progress + title + scroll body + sticky full-width CTA.
 * Horizontal inset stays tight so content uses most of the screen width.
 */
export function FlowScreen({
  step,
  total,
  stepLabel,
  nextLabel,
  title,
  subtitle,
  children,
  footer,
  contentStyle,
  onStepPress,
}: FlowScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: footer ? Spacing.lg : insets.bottom + Spacing.xxl },
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step != null && total != null && stepLabel ? (
          <FlowProgress
            step={step}
            total={total}
            label={stepLabel}
            nextLabel={nextLabel}
            onStepPress={onStepPress}
          />
        ) : null}
        <AppText variant="h1" style={styles.title} accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body" secondary style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>

      {footer ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, Spacing.md),
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    // Ample content width — only a light edge inset
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.xl,
  },
  body: {
    gap: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
    width: '100%',
  },
});

export default FlowScreen;

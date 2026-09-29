import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { FlowProgress } from '@/components/wizard/FlowProgress';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';

type AuthScreenProps = {
  title: string;
  subtitle?: string;
  step?: number;
  total?: number;
  stepLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Quiet registration/auth shell — typography and space, no decorative icons.
 */
export function AuthScreen({
  title,
  subtitle,
  step,
  total,
  stepLabel,
  children,
  footer,
}: AuthScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xxl,
            paddingBottom: insets.bottom + Spacing.xxxl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step != null && total != null && stepLabel ? (
          <FlowProgress step={step} total={total} label={stepLabel} />
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
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.xl,
    flexGrow: 1,
  },
  title: { marginBottom: Spacing.sm },
  subtitle: { marginBottom: Spacing.xxl },
  body: { gap: Spacing.lg, flexGrow: 1 },
  footer: {
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
    alignItems: 'stretch',
  },
});

export default AuthScreen;

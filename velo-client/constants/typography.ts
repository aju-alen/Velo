import { StyleSheet, TextStyle } from 'react-native';
import { moderateScale } from '@/constants/metrics';

/**
 * Platform default typeface — do not set an explicit fontFamily.
 * iOS → San Francisco, Android → Roboto.
 * Setting `fontFamily: 'System'` on iOS breaks weight variants and looks like a different face.
 */
export const FONT_FAMILY: string | undefined = undefined;

/**
 * Locked type scale — use ONLY these variants via AppText / ThemedText.
 *
 * display  — brand / splash wordmark
 * h1       — screen title
 * h2       — section title
 * h3       — card / row title
 * body     — paragraphs, inputs
 * bodyStrong — emphasized body
 * bodySmall — supporting copy
 * label    — field labels / section labels
 * caption  — meta, timestamps, tab labels
 * button   — primary actions
 * link     — text links
 */
export const Type = {
  display: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(40),
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  h1: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(28),
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: moderateScale(17),
    lineHeight: moderateScale(24),
    fontWeight: '600' as const,
  },
  body: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontWeight: '600' as const,
  },
  bodySmall: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontWeight: '400' as const,
  },
  label: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    fontWeight: '400' as const,
  },
  button: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  link: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontWeight: '600' as const,
  },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof Type;

export const typeStyles = StyleSheet.create(Type);

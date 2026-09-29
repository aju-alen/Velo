/**
 * Velo design tokens — light + soft dark (never pure black).
 * Brand accent: amber #E89B1C / #FFAC1C for primary actions only.
 */

export const Brand = {
  amber: '#E89B1C',
  amberBright: '#FFAC1C',
  amberMuted: 'rgba(232, 155, 28, 0.14)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#5C636A',
    textMuted: '#8B929A',
    background: '#F3F2EF',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E6E4DF',
    borderSubtle: '#EEECE8',
    tint: Brand.amber,
    tintMuted: Brand.amberMuted,
    icon: '#6B7280',
    tabBar: '#FFFFFF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: Brand.amber,
    danger: '#D32F2F',
    success: '#2E7D32',
    overlay: 'rgba(26, 26, 26, 0.04)',
  },
  dark: {
    // Soft elevated charcoal — not pure black
    text: '#F0F1F3',
    textSecondary: '#B0B5BD',
    textMuted: '#8A9099',
    background: '#1C1F26',
    surface: '#262A33',
    surfaceElevated: '#2E333D',
    border: '#3A3F4A',
    borderSubtle: '#323740',
    tint: Brand.amberBright,
    tintMuted: 'rgba(255, 172, 28, 0.16)',
    icon: '#A0A6B0',
    tabBar: '#22262E',
    tabIconDefault: '#7A808A',
    tabIconSelected: Brand.amberBright,
    danger: '#EF5350',
    success: '#66BB6A',
    overlay: 'rgba(255, 255, 255, 0.05)',
  },
} as const;

export type ColorSchemeName = keyof typeof Colors;
export type ThemeColors = (typeof Colors)[ColorSchemeName];

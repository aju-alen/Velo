import { useColorScheme } from 'react-native';
import { Brand, Colors, Radius, Spacing, type ThemeColors } from '@/constants/Colors';

export function useAppTheme() {
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors: ThemeColors = Colors[scheme];
  return {
    scheme,
    colors,
    isDark: scheme === 'dark',
    spacing: Spacing,
    radius: Radius,
    brand: Brand,
  };
}

import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

export function getNavigationTheme(scheme: 'light' | 'dark' | null | undefined): Theme {
  const mode = scheme === 'dark' ? 'dark' : 'light';
  const c = Colors[mode];
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.tint,
      background: c.background,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.tint,
    },
  };
}

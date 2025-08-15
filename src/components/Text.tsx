import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { FONT_FAMILY, TYPOGRAPHY } from '../config/fonts';
import { useAppSelector } from '../redux/hooks';
import { theme } from '../config/colors';

type TypographyVariant = keyof typeof TYPOGRAPHY;

interface CustomTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

const Text: React.FC<CustomTextProps> = ({
  children,
  style,
  variant = 'body1',
  color,
  ...props
}) => {
  const { isDark } = useAppSelector(state => state.theme);
  const themeMode = isDark ? theme.dark : theme.light;

  const textColor = color || themeMode.colors.text.primary;

  return (
    <RNText
      style={[TYPOGRAPHY[variant], { color: textColor }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;

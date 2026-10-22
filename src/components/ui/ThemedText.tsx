import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface ThemedTextProps extends TextProps {
  type?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'captionBold' | 'small';
  color?: string;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  type = 'body',
  color,
  style,
  children,
  ...rest
}) => {
  return (
    <Text
      style={[
        theme.typography[type],
        { color: color || theme.colors.textPrimary },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '../../theme';

interface ThemedViewProps extends ViewProps {
  backgroundColor?: string;
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  backgroundColor,
  style,
  children,
  ...rest
}) => {
  return (
    <View
      style={[{ backgroundColor: backgroundColor || theme.colors.background }, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

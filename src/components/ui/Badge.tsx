import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface BadgeProps {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  backgroundColor = theme.colors.background,
  textColor = theme.colors.textSecondary,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.badgeText, { color: textColor }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...theme.typography.small,
    fontWeight: '600',
  },
});

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  errorTestID?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  errorTestID,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, Boolean(error) && styles.inputError, style]}
        placeholderTextColor={theme.colors.textMuted}
        {...rest}
      />
      {error ? (
        <Text testID={errorTestID} style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.captionBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.errorLight,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

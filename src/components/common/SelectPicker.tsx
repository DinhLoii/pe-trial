import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface SelectPickerProps<T extends string> {
  label?: string;
  value: T | '';
  options: { label: string; value: T | '' }[];
  onSelect: (value: T | '') => void;
  placeholder: string;
  error?: string;
  errorTestID?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

export function SelectPicker<T extends string>({
  label,
  value,
  options,
  onSelect,
  placeholder,
  error,
  errorTestID,
  containerStyle,
  testID,
}: SelectPickerProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.value ? selectedOption.label : placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        testID={testID}
        style={[styles.pickerButton, Boolean(error) && styles.pickerError]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pickerText,
            !value && styles.placeholderText,
          ]}
        >
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} />
      </TouchableOpacity>

      {error ? (
        <Text testID={errorTestID} style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select an option'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item.value}_${index}`}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, isSelected && styles.selectedOption]}
                    onPress={() => {
                      onSelect(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                        !item.value && styles.emptyChoiceText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.captionBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  pickerButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerError: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.errorLight,
  },
  pickerText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  placeholderText: {
    color: theme.colors.textMuted,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    maxHeight: 380,
    overflow: 'hidden',
    ...theme.shadows.hover,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: theme.colors.primaryLight,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  emptyChoiceText: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});

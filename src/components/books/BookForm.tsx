import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../common/Input';
import { SelectPicker } from '../common/SelectPicker';
import { Button } from '../common/Button';
import { theme } from '../../theme';
import {
  BookFormData,
  BookFormErrors,
  BookGenre,
  BookStatus,
} from '../../models/book';
import { GENRE_OPTIONS, STATUS_OPTIONS } from '../../constants/options';

interface BookFormProps {
  initialValues?: BookFormData;
  onSubmit: (data: BookFormData) => Promise<{ success: boolean; error?: string }>;
  submitButtonText?: string;
  isEditMode?: boolean;
  onCancel?: () => void;
  successMessage?: string;
}

const emptyFormData: BookFormData = {
  title: '',
  author: '',
  genre: '',
  status: '',
  rating: '',
  notes: '',
};

export const BookForm: React.FC<BookFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText = 'Add Book',
  isEditMode = false,
  onCancel,
  successMessage,
}) => {
  const [formData, setFormData] = useState<BookFormData>(initialValues || emptyFormData);
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  // Validate a single field
  const validateField = (field: keyof BookFormData, value: any): string | undefined => {
    switch (field) {
      case 'title':
        if (!value || value.trim() === '') {
          return 'Title is required';
        }
        if (value.length > 100) {
          return 'Title must be at most 100 characters';
        }
        return undefined;

      case 'author':
        if (!value || value.trim() === '') {
          return 'Author is required';
        }
        if (value.length > 60) {
          return 'Author must be at most 60 characters';
        }
        return undefined;

      case 'genre':
        if (!value || value === '') {
          return 'Please choose a genre';
        }
        return undefined;

      case 'status':
        if (!value || value === '') {
          return 'Please choose a status';
        }
        return undefined;

      case 'rating':
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          const strVal = String(value).trim();
          if (!/^[0-5]$/.test(strVal)) {
            return 'Rating must be a whole number from 0 to 5';
          }
        }
        return undefined;

      case 'notes':
        if (value && value.length > 300) {
          return 'Notes must be at most 300 characters';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  // Full validation check
  const validateForm = (data: BookFormData): BookFormErrors => {
    const newErrors: BookFormErrors = {};

    const titleError = validateField('title', data.title);
    if (titleError) newErrors.title = titleError;

    const authorError = validateField('author', data.author);
    if (authorError) newErrors.author = authorError;

    const genreError = validateField('genre', data.genre);
    if (genreError) newErrors.genre = genreError;

    const statusError = validateField('status', data.status);
    if (statusError) newErrors.status = statusError;

    const ratingError = validateField('rating', data.rating);
    if (ratingError) newErrors.rating = ratingError;

    const notesError = validateField('notes', data.notes);
    if (notesError) newErrors.notes = notesError;

    return newErrors;
  };

  // Update field and clear error immediately once valid
  const handleChange = (field: keyof BookFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setServerError(null);
    setShowSuccess(false);

    if (hasSubmitted) {
      const fieldError = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) {
          next[field] = fieldError;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setServerError(null);
    setShowSuccess(false);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    const result = await onSubmit(formData);
    setLoading(false);

    if (result.success) {
      setShowSuccess(true);
      if (!isEditMode) {
        // Reset form on successful add
        setFormData(emptyFormData);
        setHasSubmitted(false);
        setErrors({});
      }
    } else if (result.error) {
      setServerError(result.error);
    }
  };

  const genreOptions = [
    { label: 'Choose genre', value: '' as const },
    ...GENRE_OPTIONS.map((g) => ({ label: g, value: g })),
  ];

  const statusOptions = [
    { label: 'Choose status', value: '' as const },
    ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
  ];

  return (
    <View testID="book-form" style={styles.formContainer}>
      {/* Title */}
      <Input
        label="Title *"
        placeholder="Enter book title"
        value={formData.title}
        onChangeText={(text) => handleChange('title', text)}
        error={errors.title}
      />

      {/* Author */}
      <Input
        label="Author *"
        placeholder="Enter author name"
        value={formData.author}
        onChangeText={(text) => handleChange('author', text)}
        error={errors.author}
      />

      {/* Genre Picker */}
      <SelectPicker<BookGenre>
        label="Genre *"
        placeholder="Choose genre"
        value={formData.genre}
        options={genreOptions}
        onSelect={(val) => handleChange('genre', val)}
        error={errors.genre}
      />

      {/* Status Picker */}
      <SelectPicker<BookStatus>
        label="Status *"
        placeholder="Choose status"
        value={formData.status}
        options={statusOptions}
        onSelect={(val) => handleChange('status', val)}
        error={errors.status}
      />

      {/* Rating (optional) */}
      <Input
        label="Rating (optional, 0-5)"
        placeholder="Enter rating (0 to 5)"
        value={formData.rating}
        onChangeText={(text) => handleChange('rating', text)}
        keyboardType="numeric"
        maxLength={1}
        error={errors.rating}
      />

      {/* Notes (optional) */}
      <Input
        label="Notes (optional, max 300 characters)"
        placeholder="Enter notes about the book"
        value={formData.notes}
        onChangeText={(text) => handleChange('notes', text)}
        multiline
        numberOfLines={3}
        style={styles.notesInput}
        error={errors.notes}
      />

      {/* Server error (e.g. duplicate title + author) */}
      {serverError ? (
        <View style={styles.errorBox}>
          <Text testID="error-book" style={styles.serverErrorText}>
            {serverError}
          </Text>
        </View>
      ) : null}

      {/* Success banner */}
      {showSuccess && !isEditMode ? (
        <View style={styles.successBox}>
          <Text testID="book-success" style={styles.successText}>
            {successMessage || 'Book added'}
          </Text>
        </View>
      ) : null}

      {/* Action buttons */}
      {isEditMode ? (
        <View style={styles.buttonRow}>
          {onCancel ? (
            <Button
              title="Cancel"
              variant="outline"
              onPress={onCancel}
              style={styles.halfButton}
            />
          ) : null}
          <Button
            title="Save"
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            style={styles.halfButton}
          />
        </View>
      ) : (
        <Button
          title={submitButtonText}
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  notesInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  halfButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  errorBox: {
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  serverErrorText: {
    ...theme.typography.captionBold,
    color: theme.colors.error,
  },
  successBox: {
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  successText: {
    ...theme.typography.captionBold,
    color: theme.colors.success,
  },
});

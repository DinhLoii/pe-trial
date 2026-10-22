import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBooks } from '../../../hooks/useBooks';
import { AppHeader } from '../../../components/common/AppHeader';
import { BookForm } from '../../../components/books/BookForm';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { BookFormData } from '../../../models/book';
import { theme } from '../../../theme';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books, updateBook, deleteBook, toggleFavorite } = useBooks();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const book = books.find((b) => b.id === id);

  if (!book && !deleting) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <AppHeader title="Book Details" showBack onBackPress={() => router.back()} />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
          <Text style={styles.notFoundText}>Book not found</Text>
          <Button
            title="Back to List"
            variant="primary"
            onPress={() => router.back()}
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book?.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              setDeleting(true);
              await deleteBook(id);
              router.back();
            } catch (err) {
              setDeleting(false);
              Alert.alert('Error', 'Failed to delete book. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async (formData: BookFormData) => {
    if (!id) return { success: false, error: 'Book ID missing' };
    const result = await updateBook(id, formData);
    if (result.success) {
      setIsEditMode(false);
    }
    return result;
  };

  const initialFormValues: BookFormData = {
    title: book?.title || '',
    author: book?.author || '',
    genre: book?.genre || '',
    status: book?.status || '',
    rating: book?.rating !== null && book?.rating !== undefined ? String(book.rating) : '',
    notes: book?.notes || '',
  };

  const getStatusBadgeStyle = () => {
    switch (book?.status) {
      case 'To Read':
        return { bg: theme.colors.statusToReadBg, text: theme.colors.statusToRead };
      case 'Reading':
        return { bg: theme.colors.statusReadingBg, text: theme.colors.statusReading };
      case 'Finished':
        return { bg: theme.colors.statusFinishedBg, text: theme.colors.statusFinished };
      default:
        return { bg: theme.colors.background, text: theme.colors.textSecondary };
    }
  };

  const getGenreBadgeStyle = () => {
    switch (book?.genre) {
      case 'Fiction':
        return { bg: theme.colors.genreFictionBg, text: theme.colors.genreFiction };
      case 'Non-Fiction':
        return { bg: theme.colors.genreNonFictionBg, text: theme.colors.genreNonFiction };
      case 'Academic':
        return { bg: theme.colors.genreAcademicBg, text: theme.colors.genreAcademic };
      case 'Other':
        return { bg: theme.colors.genreOtherBg, text: theme.colors.genreOther };
      default:
        return { bg: theme.colors.background, text: theme.colors.textSecondary };
    }
  };

  const statusStyle = getStatusBadgeStyle();
  const genreStyle = getGenreBadgeStyle();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <AppHeader
        title={isEditMode ? 'Edit Book' : 'Book Details'}
        showBack
        onBackPress={() => {
          if (isEditMode) {
            setIsEditMode(false);
          } else {
            router.back();
          }
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isEditMode ? (
          /* Edit Mode */
          <View style={styles.editContainer}>
            <BookForm
              initialValues={initialFormValues}
              onSubmit={handleUpdate}
              isEditMode
              onCancel={() => setIsEditMode(false)}
            />
          </View>
        ) : (
          /* View Mode */
          <View style={styles.viewContainer}>
            {/* Main Book Card */}
            <Card style={styles.detailCard}>
              {/* Header with Title and Favorite star */}
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.bookTitle}>{book?.title}</Text>
                  <Text style={styles.bookAuthor}>by {book?.author}</Text>
                </View>
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={() => book && toggleFavorite(book.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={book?.favorite ? 'star' : 'star-outline'}
                    size={32}
                    color={book?.favorite ? theme.colors.starActive : theme.colors.starInactive}
                  />
                </TouchableOpacity>
              </View>

              {/* Badges row */}
              <View style={styles.badgesRow}>
                <View style={[styles.badge, { backgroundColor: genreStyle.bg }]}>
                  <Text style={[styles.badgeText, { color: genreStyle.text }]}>
                    {book?.genre}
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                    {book?.status}
                  </Text>
                </View>
              </View>

              {/* Rating section */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rating:</Text>
                {book?.rating !== null && book?.rating !== undefined ? (
                  <View style={styles.ratingStarsRow}>
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Ionicons
                        key={starIndex}
                        name={starIndex <= (book.rating ?? 0) ? 'star' : 'star-outline'}
                        size={20}
                        color={starIndex <= (book.rating ?? 0) ? theme.colors.starActive : theme.colors.starInactive}
                      />
                    ))}
                    <Text style={styles.ratingNumber}>({book.rating} / 5)</Text>
                  </View>
                ) : (
                  <Text style={styles.infoValueMuted}>No rating assigned</Text>
                )}
              </View>

              {/* Notes section */}
              <View style={styles.notesSection}>
                <Text style={styles.infoLabel}>Notes:</Text>
                <Text style={book?.notes ? styles.notesText : styles.infoValueMuted}>
                  {book?.notes ? book.notes : 'No notes added for this book.'}
                </Text>
              </View>
            </Card>

            {/* Action buttons: Edit & Delete */}
            <View style={styles.actionRow}>
              <Button
                title="Edit Book"
                variant="primary"
                onPress={() => setIsEditMode(true)}
                style={styles.actionBtn}
              />
              <Button
                title="Delete Book"
                variant="danger"
                onPress={handleDelete}
                loading={deleting}
                style={styles.actionBtn}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  notFoundText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  viewContainer: {
    gap: theme.spacing.xl,
  },
  editContainer: {
    marginTop: theme.spacing.sm,
  },
  detailCard: {
    padding: theme.spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  bookTitle: {
    ...theme.typography.h1,
    fontSize: 24,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  bookAuthor: {
    ...theme.typography.bodyBold,
    color: theme.colors.textSecondary,
  },
  starButton: {
    padding: theme.spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    ...theme.typography.captionBold,
  },
  infoRow: {
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  infoValueMuted: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
    marginLeft: 6,
  },
  notesSection: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  notesText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
});

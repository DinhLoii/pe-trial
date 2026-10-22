import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Book } from '../../models/book';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onToggleFavorite,
}) => {
  const getStatusBadgeStyle = () => {
    switch (book.status) {
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
    switch (book.genre) {
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
    <TouchableOpacity
      testID="book-item"
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentRow}>
        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            by {book.author}
          </Text>

          <View style={styles.badgeRow}>
            {/* Genre Badge */}
            <View style={[styles.badge, { backgroundColor: genreStyle.bg }]}>
              <Text style={[styles.badgeText, { color: genreStyle.text }]}>
                {book.genre}
              </Text>
            </View>

            {/* Status Badge */}
            <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                {book.status}
              </Text>
            </View>

            {/* Rating if present */}
            {book.rating !== null && book.rating !== undefined ? (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={theme.colors.starActive} />
                <Text style={styles.ratingText}>{book.rating}/5</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Favorite toggle star */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={book.favorite ? 'star' : 'star-outline'}
            size={26}
            color={book.favorite ? theme.colors.starActive : theme.colors.starInactive}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  author: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    ...theme.typography.small,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningLight,
    paddingVertical: 3,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: 3,
  },
  ratingText: {
    ...theme.typography.small,
    color: theme.colors.warning,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

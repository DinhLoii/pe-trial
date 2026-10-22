import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { StatusCountBreakdown } from '../../models/book';

interface BooksSummaryProps {
  bookCount: number;
  favoriteCount: number;
  breakdown: StatusCountBreakdown[];
}

export const BooksSummary: React.FC<BooksSummaryProps> = ({
  bookCount,
  favoriteCount,
  breakdown,
}) => {
  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Books Overview</Text>

      {/* Stats Counter Row */}
      <View style={styles.statsRow}>
        {/* Total Books */}
        <View style={styles.statBox}>
          <View style={styles.statIconContainer}>
            <Ionicons name="book-outline" size={20} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.statLabel}>Total Books</Text>
            <Text testID="book-count" style={styles.statValue}>
              {bookCount}
            </Text>
          </View>
        </View>

        {/* Favorite Books */}
        <View style={styles.statBox}>
          <View style={[styles.statIconContainer, { backgroundColor: theme.colors.warningLight }]}>
            <Ionicons name="star" size={20} color={theme.colors.starActive} />
          </View>
          <View>
            <Text style={styles.statLabel}>Favorites</Text>
            <Text testID="favorite-count" style={styles.statValue}>
              {favoriteCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Status Breakdown Section */}
      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>Status Breakdown</Text>
        {breakdown.length === 0 ? (
          <Text style={styles.noBreakdownText}>No books to display</Text>
        ) : (
          breakdown.map((item) => (
            <View key={item.status} style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View
                  style={[
                    styles.statusIndicator,
                    item.status === 'To Read' && { backgroundColor: theme.colors.statusToRead },
                    item.status === 'Reading' && { backgroundColor: theme.colors.statusReading },
                    item.status === 'Finished' && { backgroundColor: theme.colors.statusFinished },
                  ]}
                />
                <Text style={styles.statusName}>{item.status}</Text>
              </View>
              <Text style={styles.statusCount}>{item.count}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  summaryTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  statIconContainer: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  breakdownSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  breakdownTitle: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  noBreakdownText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  statusCount: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
});

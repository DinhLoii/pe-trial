import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { FilterOptions } from '../../models/book';
import { GENRE_OPTIONS, STATUS_OPTIONS } from '../../constants/options';

interface BookFiltersProps {
  filters: FilterOptions;
  onGenreChange: (genre: string) => void;
  onStatusChange: (status: string) => void;
  onFavoritesOnlyChange: (favOnly: boolean) => void;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  filters,
  onGenreChange,
  onStatusChange,
  onFavoritesOnlyChange,
  onSearchChange,
  onClear,
}) => {
  const genreList = ['All', ...GENRE_OPTIONS];
  const statusList = ['All', ...STATUS_OPTIONS];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={18}
            color={theme.colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or author..."
            placeholderTextColor={theme.colors.textMuted}
            value={filters.searchQuery}
            onChangeText={onSearchChange}
          />
          {filters.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Clear Filters Button */}
        <TouchableOpacity style={styles.clearButton} onPress={onClear} activeOpacity={0.7}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Genre Filter Pills */}
      <View style={styles.filterGroup}>
        <Text style={styles.groupLabel}>Genre:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {genreList.map((g) => {
            const isSelected = filters.genre === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.pill, isSelected && styles.activePill]}
                onPress={() => onGenreChange(g)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, isSelected && styles.activePillText]}>
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Status Filter Pills */}
      <View style={styles.filterGroup}>
        <Text style={styles.groupLabel}>Status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {statusList.map((s) => {
            const isSelected = filters.status === s;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.pill, isSelected && styles.activePill]}
                onPress={() => onStatusChange(s)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, isSelected && styles.activePillText]}>
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Favorites Only Switch */}
      <View style={styles.favoritesRow}>
        <View style={styles.favoriteLabelContainer}>
          <Ionicons name="star" size={18} color={theme.colors.starActive} />
          <Text style={styles.favoriteLabel}>Favorites only</Text>
        </View>
        <Switch
          value={filters.favoritesOnly}
          onValueChange={onFavoritesOnlyChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
          thumbColor={filters.favoritesOnly ? theme.colors.primary : '#FFFFFF'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 42,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    ...theme.typography.captionBold,
    color: theme.colors.primary,
  },
  filterGroup: {
    marginBottom: theme.spacing.sm,
  },
  groupLabel: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 6,
  },
  activePill: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pillText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  activePillText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  favoritesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 4,
  },
  favoriteLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favoriteLabel: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
});

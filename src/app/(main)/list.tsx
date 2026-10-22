import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { AppHeader } from '../../components/common/AppHeader';
import { BookForm } from '../../components/books/BookForm';
import { BookCard } from '../../components/books/BookCard';
import { BookFilters } from '../../components/books/BookFilters';
import { BooksSummary } from '../../components/books/BooksSummary';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';

export default function ListScreen() {
  const { signOut } = useAuth();
  const {
    filteredBooks,
    loading,
    filters,
    setGenreFilter,
    setStatusFilter,
    setFavoritesOnly,
    setSearchQuery,
    clearFilters,
    addBook,
    toggleFavorite,
    seedSampleBooks,
    summary,
  } = useBooks();

  const [showAddForm, setShowAddForm] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);

  const handleSeedSampleData = async () => {
    try {
      setSeeding(true);
      await seedSampleBooks();
    } catch (e) {
      console.error('Failed to seed books:', e);
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView testID="list-screen" style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header showing User Email and Logout Button */}
      <AppHeader title="BookShelf" showLogout />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section A: Add a Book Header Toggle */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="add-circle" size={22} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Add a Book</Text>
          </View>
          <TouchableOpacity
            style={styles.collapseToggle}
            onPress={() => setShowAddForm(!showAddForm)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showAddForm ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Section A: Add a Book Form */}
        {showAddForm && (
          <View style={styles.formWrapper}>
            <BookForm
              onSubmit={addBook}
              submitButtonText="Add Book"
              successMessage="Book added"
            />
          </View>
        )}

        {/* Section C: Filters & Search */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="filter" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Filter & Search</Text>
          </View>
        </View>

        <BookFilters
          filters={filters}
          onGenreChange={setGenreFilter}
          onStatusChange={setStatusFilter}
          onFavoritesOnlyChange={setFavoritesOnly}
          onSearchChange={setSearchQuery}
          onClear={clearFilters}
        />

        {/* Section C: Summary */}
        <BooksSummary
          bookCount={summary.bookCount}
          favoriteCount={summary.favoriteCount}
          breakdown={summary.breakdown}
        />

        {/* Section B: Books List */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="book" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>My Books</Text>
          </View>
          <TouchableOpacity
            style={styles.seedBadgeBtn}
            onPress={handleSeedSampleData}
            activeOpacity={0.7}
            disabled={seeding}
          >
            <Ionicons name="sparkles" size={14} color={theme.colors.primary} />
            <Text style={styles.seedBadgeText}>{seeding ? 'Creating...' : '+ Demo Data'}</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading books...</Text>
          </View>
        ) : filteredBooks.length === 0 ? (
          /* Empty State: exactly testID="books-empty" and text "No books found" */
          <View testID="books-empty" style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptySubtitle}>
              {filters.searchQuery || filters.genre !== 'All' || filters.status !== 'All' || filters.favoritesOnly
                ? 'Try adjusting your filters or search terms.'
                : 'Add your first book above or tap below to generate sample books for testing.'}
            </Text>
            <Button
              title="✨ Generate 7 Sample Books (Tạo data mẫu)"
              variant="primary"
              size="md"
              loading={seeding}
              onPress={handleSeedSampleData}
              style={{ marginTop: theme.spacing.lg }}
            />
          </View>
        ) : (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPress={() => router.push(`/(main)/book/${book.id}`)}
              onToggleFavorite={() => toggleFavorite(book.id)}
            />
          ))
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  seedBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
  },
  seedBadgeText: {
    ...theme.typography.captionBold,
    color: theme.colors.primary,
  },
  collapseToggle: {
    padding: theme.spacing.xs,
  },
  formWrapper: {
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.sm,
    ...theme.shadows.card,
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

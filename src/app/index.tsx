import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { theme } from '../theme';

export default function HomeScreen() {
  const { user, authLoading } = useAuth();

  // When logged in, the app opens directly on the List screen instead
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/(main)/list');
    }
  }, [user, authLoading]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header with App Name and Login/Register buttons */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="library" size={28} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>BookShelf</Text>
        </View>
        <View style={styles.headerAuthButtons}>
          <Button
            title="Login"
            variant="outline"
            size="sm"
            onPress={() => router.push('/(auth)/login')}
            style={styles.headerBtn}
          />
          <Button
            title="Register"
            variant="primary"
            size="sm"
            onPress={() => router.push('/(auth)/register')}
            style={styles.headerBtn}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconBadge}>
            <Ionicons name="book" size={44} color={theme.colors.primary} />
          </View>
          <Text testID="home-title" style={styles.heroTitle}>
            BookShelf
          </Text>
          <Text style={styles.heroDescription}>
            Your personal digital reading sanctuary. Keep your private collection of books,
            track reading progress across customized statuses, discover genres, and highlight your all-time favorites.
          </Text>
          <View style={styles.heroCtaRow}>
            <Button
              title="Get Started"
              variant="primary"
              size="lg"
              onPress={() => router.push('/(auth)/register')}
              style={styles.heroCta}
            />
          </View>
        </View>

        {/* Feature Cards Section */}
        <Text style={styles.featuresSectionTitle}>Features</Text>
        <View style={styles.cardsContainer}>
          {/* Feature Card 1 */}
          <Card style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="bookmark" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Track your books</Text>
            <Text style={styles.cardDescription}>
              Keep an organized private record of all the books you own, are currently enjoying, or plan to read next.
            </Text>
          </Card>

          {/* Feature Card 2 */}
          <Card style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.statusReadingBg }]}>
              <Ionicons name="layers" size={24} color={theme.colors.statusReading} />
            </View>
            <Text style={styles.cardTitle}>Sort by status</Text>
            <Text style={styles.cardDescription}>
              Effortlessly filter and group your library into To Read, Reading, and Finished with instant statistical breakdowns.
            </Text>
          </Card>

          {/* Feature Card 3 */}
          <Card style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.warningLight }]}>
              <Ionicons name="star" size={24} color={theme.colors.starActive} />
            </View>
            <Text style={styles.cardTitle}>Rate your favorites</Text>
            <Text style={styles.cardDescription}>
              Star your most cherished reads with one tap and assign ratings to build your personal Hall of Fame.
            </Text>
          </Card>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.card,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  headerAuthButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerBtn: {
    minWidth: 70,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  heroIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  heroTitle: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  heroDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  heroCtaRow: {
    width: '100%',
    maxWidth: 240,
  },
  heroCta: {
    width: '100%',
  },
  featuresSectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  cardsContainer: {
    gap: theme.spacing.md,
  },
  featureCard: {
    padding: theme.spacing.lg,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showLogout?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'BookShelf',
  showBack = false,
  onBackPress,
  showLogout = false,
}) => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {showBack && onBackPress ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
        <Text style={styles.appTitle}>{title}</Text>
      </View>

      {showLogout && user ? (
        <View style={styles.rightSection}>
          <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="middle">
            {user.email}
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={signOut}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.card,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  appTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '65%',
  },
  userEmail: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
    maxWidth: 140,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorLight,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  logoutText: {
    ...theme.typography.captionBold,
    color: theme.colors.error,
    marginLeft: 4,
  },
});

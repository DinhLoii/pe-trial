import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '../store/AuthContext';
import { BooksProvider } from '../store/BooksContext';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

function RootNavigationLayout() {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashIcon}>
          <Ionicons name="library" size={54} color={theme.colors.primary} />
        </View>
        <Text style={styles.splashTitle}>BookShelf</Text>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BooksProvider>
          <StatusBar style="dark" />
          <RootNavigationLayout />
        </BooksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  splashIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  splashTitle: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
});

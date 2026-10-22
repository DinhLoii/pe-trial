import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { validateEmail, validatePassword } from '../../utils/validation';
import { theme } from '../../theme';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [authError, setAuthError] = useState<string | null>(null);

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setAuthError(null);
    if (hasSubmitted) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setAuthError(null);
    if (hasSubmitted) {
      setPasswordError(validatePassword(text));
    }
  };

  const handleLogin = async () => {
    setHasSubmitted(true);
    setAuthError(null);

    const errEmail = validateEmail(email);
    const errPassword = validatePassword(password);

    setEmailError(errEmail);
    setPasswordError(errPassword);

    if (errEmail || errPassword) {
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(main)/list');
    } catch (err: any) {
      let message = 'Failed to sign in. Please check your credentials.';
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password'
      ) {
        message = 'Invalid email or password';
      } else if (err?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address';
      } else if (err?.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later';
      } else if (err?.message) {
        message = err.message;
      }
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          {/* Form Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your personal BookShelf</Text>
          </View>

          {/* Error Banner from Firebase */}
          {authError ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
              <Text testID="error-auth" style={styles.authErrorText}>
                {authError}
              </Text>
            </View>
          ) : null}

          {/* Form Inputs */}
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              error={passwordError}
            />

            <Button
              title="Sign In"
              variant="primary"
              size="lg"
              onPress={handleLogin}
              loading={loading}
              style={styles.submitBtn}
            />
          </View>

          {/* Navigation to Register */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Register now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    flexGrow: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorLight,
    borderWidth: 1,
    borderColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  authErrorText: {
    ...theme.typography.captionBold,
    color: theme.colors.error,
    flex: 1,
  },
  form: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  submitBtn: {
    marginTop: theme.spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  footerLink: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
  },
});

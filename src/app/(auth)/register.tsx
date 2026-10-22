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
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validation';
import { theme } from '../../theme';

export default function RegisterScreen() {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(undefined);
  const [authError, setAuthError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setAuthError(null);
    setRegistrationSuccess(false);
    if (hasSubmitted) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setAuthError(null);
    setRegistrationSuccess(false);
    if (hasSubmitted) {
      setPasswordError(validatePassword(text, true));
      if (confirmPassword.length > 0) {
        setConfirmPasswordError(validateConfirmPassword(confirmPassword, text));
      }
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setAuthError(null);
    setRegistrationSuccess(false);
    if (hasSubmitted) {
      setConfirmPasswordError(validateConfirmPassword(text, password));
    }
  };

  const handleRegister = async () => {
    setHasSubmitted(true);
    setAuthError(null);
    setRegistrationSuccess(false);

    const errEmail = validateEmail(email);
    const errPassword = validatePassword(password, true);
    const errConfirm = validateConfirmPassword(confirmPassword, password);

    setEmailError(errEmail);
    setPasswordError(errPassword);
    setConfirmPasswordError(errConfirm);

    if (errEmail || errPassword || errConfirm) {
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      setRegistrationSuccess(true);
    } catch (err: any) {
      let message = 'Registration failed. Please try again.';
      if (err?.code === 'auth/email-already-in-use') {
        message = 'This email is already in use';
      } else if (err?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address';
      } else if (err?.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters';
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start organizing your reading library</Text>
          </View>

          {/* Registration Success Banner */}
          {registrationSuccess ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text testID="form-success" style={styles.successText}>
                Registration successful
              </Text>
            </View>
          ) : null}

          {/* Firebase Auth Error Banner */}
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
              placeholder="At least 6 characters"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              error={passwordError}
            />

            <Input
              label="Confirm password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
              error={confirmPasswordError}
            />

            <Button
              title="Register"
              variant="primary"
              size="lg"
              onPress={handleRegister}
              loading={loading}
              style={styles.submitBtn}
            />
          </View>

          {/* Navigation to Login */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign in</Text>
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
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.successLight,
    borderWidth: 1,
    borderColor: theme.colors.success,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  successText: {
    ...theme.typography.captionBold,
    color: theme.colors.success,
    flex: 1,
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

/**
 * KONAN Mobile v2 — Forgot Password Screen
 * Réinitialisation mot de passe
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { usePasswordReset, useEmailValidation } from '../hooks/useAuthPremium';

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useTheme();
  const { sendPasswordResetEmail, isLoading } = usePasswordReset();
  const { validateEmail } = useEmailValidation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Validation email en temps réel
  useEffect(() => {
    if (email.trim()) {
      const validation = validateEmail(email);
      setIsEmailValid(validation.isValid);
      setEmailError(validation.message || null);
    } else {
      setIsEmailValid(false);
      setEmailError(null);
    }
  }, [email, validateEmail]);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre adresse email.');
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      Alert.alert('Erreur', emailValidation.message || 'Veuillez saisir une adresse email valide.');
      return;
    }

    try {
      await sendPasswordResetEmail(email);
      setIsEmailSent(true);
    } catch (error) {
      Alert.alert(
        'Erreur',
        error?.message || 'Impossible d\'envoyer l\'email. Veuillez vérifier votre adresse et réessayer.'
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (isEmailSent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.surfaceElevated }]}>
            <Text style={styles.icon}>✉️</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>Email envoyé !</Text>

          {/* Description */}
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Un lien de réinitialisation a été envoyé à :
          </Text>
          <Text style={[styles.email, { color: theme.primary }]}>{email}</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe.
          </Text>

          {/* Tips */}
          <View style={[styles.tipsContainer, { backgroundColor: theme.surfaceElevated }]}>
            <Text style={[styles.tipsTitle, { color: theme.text }]}>💡 Conseils</Text>
            <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
              • Vérifiez votre dossier spam{'\n'}
              • Le lien est valable 1 heure{'\n'}
              • En cas de problème, réessayez
            </Text>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleBackToLogin}
          >
            <Text style={styles.buttonText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Mot de passe oublié ?</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: emailError
                      ? theme.error
                      : isEmailValid
                      ? theme.success
                      : theme.inputBorder,
                    color: theme.inputText,
                  },
                ]}
                placeholder="votre.email@exemple.com"
                placeholderTextColor={theme.inputPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {emailError && (
                <Text style={[styles.fieldError, { color: theme.error }]}>
                  {emailError}
                </Text>
              )}
              {isEmailValid && !emailError && (
                <Text style={[styles.fieldSuccess, { color: theme.success }]}>
                  ✓ Email valide
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.button,
                { 
                  backgroundColor: theme.primary,
                  opacity: (isLoading || !isEmailValid) ? 0.7 : 1,
                },
              ]}
              onPress={handleResetPassword}
              disabled={isLoading || !isEmailValid}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Envoyer le lien</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
              <Text style={[styles.backButtonText, { color: theme.textMuted }]}>
                ← Retour à la connexion
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  fieldError: {
    fontSize: 12,
    marginTop: 4,
  },
  fieldSuccess: {
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 12,
  },
  backButtonText: {
    fontSize: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  email: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsContainer: {
    marginTop: 32,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 22,
  },
});


/**
 * KONAN Mobile v2 — Email Verification Screen
 * Vérification email après inscription
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useEmailVerification } from '../hooks/useAuthPremium';

export default function EmailVerificationScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { sendVerificationEmail, isLoading } = useEmailVerification();
  const { email } = route.params || { email: 'votre email' };
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!canResend || isLoading) return;
    
    try {
      await sendVerificationEmail(email);
      
      Alert.alert(
        'Email renvoyé',
        'Un nouveau lien de vérification a été envoyé à votre adresse email.',
        [{ text: 'OK' }]
      );
      
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      Alert.alert('Erreur', error?.message || 'Impossible de renvoyer l\'email. Veuillez réessayer.');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={styles.icon}>📧</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text }]}>Vérifiez votre email</Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Nous avons envoyé un lien de vérification à :
        </Text>
        <Text style={[styles.email, { color: theme.primary }]}>{email}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Cliquez sur le lien dans l'email pour activer votre compte.
        </Text>

        {/* Resend Button */}
        <TouchableOpacity
          style={[
            styles.resendButton,
            { 
              backgroundColor: canResend && !isLoading ? theme.primary : theme.surfaceElevated,
              opacity: canResend && !isLoading ? 1 : 0.5,
            },
          ]}
          onPress={handleResendEmail}
          disabled={!canResend || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.resendButtonText}>
              {canResend ? 'Renvoyer l\'email' : `Renvoyer dans ${countdown}s`}
            </Text>
          )}
        </TouchableOpacity>

        {/* Tips */}
        <View style={[styles.tipsContainer, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.tipsTitle, { color: theme.text }]}>💡 Conseils</Text>
          <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
            • Vérifiez votre dossier spam/courrier indésirable{'\n'}
            • Assurez-vous d'avoir saisi le bon email{'\n'}
            • Le lien est valable 24 heures
          </Text>
        </View>
      </View>

      {/* Back to Login */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
        <Text style={[styles.backButtonText, { color: theme.textMuted }]}>
          ← Retour à la connexion
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
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
  resendButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  tipsContainer: {
    marginTop: 32,
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
  backButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
  },
});


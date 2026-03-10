/**
 * KONAN Mobile v2 — Google Auth Button
 * Bouton de connexion Google (UI only - backend integration required)
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function GoogleAuthButton({ onSuccess, onError, mode = 'signin' }) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      // TODO: Backend integration
      // Implement Google OAuth flow:
      // 1. Open Google sign-in prompt
      // 2. Get authorization code
      // 3. Exchange code for tokens
      // 4. Create/login user on backend
      
      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Fonctionnalité à venir',
        'La connexion avec Google sera bientôt disponible. Pour l\'instant, utilisez l\'inscription par email.',
        [{ text: 'OK' }]
      );
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('[GoogleAuth] Error:', error);
      
      Alert.alert(
        'Erreur',
        'Impossible de se connecter avec Google. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = mode === 'signin' 
    ? 'Continuer avec Google' 
    : 'S\'inscrire avec Google';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: isLoading ? 0.7 : 1,
        },
      ]}
      onPress={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.text} />
      ) : (
        <>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.buttonText, { color: theme.text }]}>{buttonText}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});


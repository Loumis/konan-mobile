/**
 * KONAN Mobile v2 — Onboarding Screen
 * Introduction produit + premiers pas
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      emoji: '⚖️',
      title: 'Bienvenue sur KONAN',
      description: 'Votre agent juridique intelligent, toujours à votre service.',
    },
    {
      emoji: '🔍',
      title: 'Analyse Intelligente',
      description: 'KONAN pose les bonnes questions avant de répondre, garantissant des conseils pertinents.',
    },
    {
      emoji: '🎭',
      title: 'Rôles Dynamiques',
      description: 'Inspecteur, Avocat ou Juge : KONAN s\'adapte à votre besoin pour un conseil optimal.',
    },
    {
      emoji: '🚀',
      title: 'Prêt à commencer ?',
      description: 'Créez votre compte gratuitement et posez votre première question juridique.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Register');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      {/* Skip Button */}
      {currentSlide < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.textMuted }]}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.emoji}>{slides[currentSlide].emoji}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{slides[currentSlide].title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {slides[currentSlide].description}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentSlide ? theme.primary : theme.border,
                width: index === currentSlide ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Next/Start Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {currentSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
        </Text>
      </TouchableOpacity>

      {/* Login Link (only on last slide) */}
      {currentSlide === slides.length - 1 && (
        <>
          <TouchableOpacity style={styles.loginLink} onPress={handleSkip}>
            <Text style={[styles.loginLinkText, { color: theme.textMuted }]}>
              Déjà un compte ?{' '}
              <Text style={[styles.loginLinkHighlight, { color: theme.primary }]}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
          
          {/* Legal Links */}
          <View style={styles.legalLinks}>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => navigation.navigate('Presentation')}
            >
              <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
                En savoir plus
              </Text>
            </TouchableOpacity>
            <Text style={[styles.legalLinkSeparator, { color: theme.textMuted }]}>•</Text>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => navigation.navigate('Terms')}
            >
              <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
                CGU
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginLinkText: {
    fontSize: 15,
  },
  loginLinkHighlight: {
    fontWeight: '600',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  legalLink: {
    paddingVertical: 4,
  },
  legalLinkText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  legalLinkSeparator: {
    fontSize: 13,
  },
});


/**
 * PHASE A.2 - Écran de Présentation KONAN
 * Présentation détaillée du produit avec support thème Jour/Nuit
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function PresentationScreen({ navigation }) {
  const { theme } = useTheme();

  const features = [
    {
      icon: '⚖️',
      title: 'Agent Juridique Intelligent',
      description: 'KONAN est votre assistant juridique personnel, disponible 24/7 pour répondre à toutes vos questions juridiques.',
    },
    {
      icon: '🔍',
      title: 'Analyse Intelligente',
      description: 'KONAN pose les bonnes questions avant de répondre, garantissant des conseils pertinents et adaptés à votre situation.',
    },
    {
      icon: '🎭',
      title: 'Rôles Dynamiques',
      description: 'Inspecteur, Avocat ou Juge : KONAN s\'adapte à votre besoin pour un conseil optimal selon le contexte.',
    },
    {
      icon: '📚',
      title: 'Base de Connaissances',
      description: 'Accès à une vaste base de données juridiques, régulièrement mise à jour avec les dernières lois et jurisprudences.',
    },
    {
      icon: '🔒',
      title: 'Confidentialité Totale',
      description: 'Vos conversations sont sécurisées et privées. Vos données ne sont jamais partagées avec des tiers.',
    },
    {
      icon: '🚀',
      title: 'Rapide et Efficace',
      description: 'Obtenez des réponses en quelques secondes, sans attendre un rendez-vous avec un avocat.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      features: [
        '5 questions par mois',
        'Accès aux fonctionnalités de base',
        'Réponses standard',
      ],
    },
    {
      name: 'Premium',
      features: [
        'Questions illimitées',
        'Analyses approfondies',
        'Rôles dynamiques (Inspecteur, Avocat, Juge)',
        'Support prioritaire',
        'Export de documents',
      ],
    },
  ];

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      edges={['top', 'bottom']}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Bienvenue sur KONAN
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Votre agent juridique intelligent
          </Text>
        </View>

        {/* Introduction */}
        <View style={[styles.section, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Qu'est-ce que KONAN ?
          </Text>
          <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
            KONAN est un assistant juridique intelligent conçu pour vous aider à naviguer dans le monde complexe du droit. 
            Que vous ayez besoin de comprendre une procédure, analyser un contrat ou obtenir des conseils juridiques, 
            KONAN est là pour vous accompagner.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Fonctionnalités
          </Text>
          {features.map((feature, index) => (
            <View 
              key={index} 
              style={[
                styles.featureCard, 
                { 
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }
              ]}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Formules d'abonnement
          </Text>
          {plans.map((plan, index) => (
            <View 
              key={index}
              style={[
                styles.planCard,
                { 
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                }
              ]}
            >
              <Text style={[styles.planName, { color: theme.primary }]}>
                {plan.name}
              </Text>
              <View style={styles.planFeatures}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.planFeature}>
                    <Text style={[styles.planFeatureBullet, { color: theme.primary }]}>
                      •
                    </Text>
                    <Text style={[styles.planFeatureText, { color: theme.textSecondary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.ctaButtonText}>Commencer gratuitement</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.ctaLinkText, { color: theme.textMuted }]}>
              Déjà un compte ?{' '}
              <Text style={[styles.ctaLinkHighlight, { color: theme.primary }]}>
                Se connecter
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Legal Links */}
        <View style={styles.legalSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Terms')}
            style={styles.legalLink}
          >
            <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
              Conditions Générales d'Utilisation
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  planCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  planFeatures: {
    marginLeft: 8,
  },
  planFeature: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  planFeatureBullet: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
  },
  planFeatureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  ctaSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  ctaButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  ctaLink: {
    alignItems: 'center',
  },
  ctaLinkText: {
    fontSize: 15,
  },
  ctaLinkHighlight: {
    fontWeight: '600',
  },
  legalSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  legalLink: {
    paddingVertical: 8,
  },
  legalLinkText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});


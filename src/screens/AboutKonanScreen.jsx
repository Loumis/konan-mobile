/**
 * KONAN Mobile v2 — About KONAN Screen
 * Présentation de KONAN : mission, différenciation, expertise
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/AppThemeContext';

export default function AboutKonanScreen() {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.primary }]}>KONAN</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Agent Juridique Intelligent
          </Text>
        </View>

        {/* Qu'est-ce que KONAN ? */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Qu'est-ce que KONAN ?
          </Text>
          <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
            KONAN est un agent juridique intelligent spécialisé dans le conseil et l'analyse juridique. 
            Contrairement aux chatbots généralistes, KONAN est conçu pour poser les bonnes questions 
            avant de répondre, garantissant ainsi des conseils pertinents et fiables.
          </Text>
        </View>

        {/* Pourquoi différent de ChatGPT ? */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Pourquoi différent de ChatGPT ?
          </Text>
          <View style={styles.comparison}>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: theme.textMuted }]}>ChatGPT</Text>
              <Text style={[styles.comparisonText, { color: theme.textSecondary }]}>
                • Répond immédiatement{'\n'}
                • Généraliste{'\n'}
                • Peut halluciner{'\n'}
                • Pas de validation juridique
              </Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: theme.primary }]}>KONAN</Text>
              <Text style={[styles.comparisonText, { color: theme.textSecondary }]}>
                • Analyse avant de répondre{'\n'}
                • Spécialisé juridique{'\n'}
                • Détecte les manques d'info{'\n'}
                • Rôles dynamiques (Inspecteur/Avocat/Juge)
              </Text>
            </View>
          </View>
        </View>

        {/* Domaines d'expertise */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Domaines d'expertise
          </Text>
          {[
            'Droit Pénal : Infractions, procédures, défense',
            'Droit Civil : Contrats, responsabilité, succession',
            'Droit Commercial : Sociétés, commerce, concurrence',
            'Droit du Travail : Contrats, licenciements, conflits',
            'Droit Administratif : Contentieux, urbanisme',
          ].map((domain, index) => (
            <View key={index} style={styles.domainItem}>
              <Text style={[styles.domainBullet, { color: theme.primary }]}>●</Text>
              <Text style={[styles.domainText, { color: theme.textSecondary }]}>{domain}</Text>
            </View>
          ))}
        </View>

        {/* Limites et avertissements */}
        <View style={[styles.section, styles.warningSection, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.sectionTitle, { color: theme.warning }]}>
            ⚠️ Avertissements
          </Text>
          <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
            • KONAN est un assistant juridique, pas un avocat.{'\n'}
            • Les conseils fournis ne constituent pas un avis juridique formel.{'\n'}
            • Pour des situations complexes, consultez un avocat.{'\n'}
            • KONAN ne peut pas représenter vos intérêts devant un tribunal.{'\n'}
            • Les informations fournies sont basées sur le droit français.
          </Text>
        </View>

        {/* Comment KONAN fonctionne */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Comment KONAN fonctionne
          </Text>
          <View style={styles.steps}>
            {[
              { step: '1', title: 'Analyse', desc: 'KONAN analyse votre demande et détecte le domaine juridique.' },
              { step: '2', title: 'Questions', desc: 'KONAN vous pose des questions pour compléter les informations manquantes.' },
              { step: '3', title: 'Rôle', desc: 'KONAN adopte le rôle adapté : Inspecteur, Avocat ou Juge.' },
              { step: '4', title: 'Réponse', desc: 'KONAN fournit une réponse claire, structurée et argumentée.' },
            ].map((item, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
                  <Text style={styles.stepNumberText}>{item.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Version 2.0 • © 2025 KONAN
          </Text>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  comparison: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonItem: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  comparisonText: {
    fontSize: 13,
    lineHeight: 20,
  },
  domainItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  domainBullet: {
    fontSize: 12,
    marginRight: 8,
    marginTop: 3,
  },
  domainText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  warningSection: {
    padding: 16,
    borderRadius: 12,
  },
  steps: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerText: {
    fontSize: 12,
  },
});


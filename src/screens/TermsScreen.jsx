/**
 * PHASE A.2 - Terms Screen
 * Conditions Générales d'Utilisation + Politique de Confidentialité
 * Compatible thème global Jour/Nuit
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

// Import du contenu CGU versionné
const cguContent = require('../content/cgu.json');

export default function TermsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('cgu'); // 'cgu' | 'privacy'

  const tabs = [
    { id: 'cgu', label: 'CGU' },
    { id: 'privacy', label: 'Confidentialité' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.id ? theme.primary : theme.textMuted },
                activeTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.id && (
              <View style={[styles.tabIndicator, { backgroundColor: theme.primary }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'cgu' ? (
          <CGUContent theme={theme} content={cguContent.cgu} />
        ) : (
          <PrivacyContent theme={theme} content={cguContent.privacy} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CGUContent({ theme, content }) {
  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>
        {content.title}
      </Text>
      <Text style={[styles.lastUpdate, { color: theme.textMuted }]}>
        Dernière mise à jour : {cguContent.lastUpdate}
      </Text>

      {/* Render sections from JSON */}
      {content.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {section.id}. {section.title}
          </Text>
          {section.content && typeof section.content === 'string' ? (
            <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
              {section.content}
            </Text>
          ) : section.subsections ? (
            section.subsections.map((subsection, idx) => (
              <View key={idx} style={styles.subsection}>
                <Text style={[styles.subsectionTitle, { color: theme.text }]}>
                  {subsection.title} :
                </Text>
                {Array.isArray(subsection.content) ? (
                  subsection.content.map((item, itemIdx) => (
                    <Text 
                      key={itemIdx} 
                      style={[styles.sectionText, { color: theme.textSecondary }]}
                    >
                      • {item}
                    </Text>
                  ))
                ) : (
                  <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
                    {subsection.content}
                  </Text>
                )}
              </View>
            ))
          ) : null}
        </View>
      ))}

      {/* Contact */}
      {content.contact && (
        <View style={[styles.contactSection, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.contactTitle, { color: theme.text }]}>
            {content.contact.title}
          </Text>
          <Text style={[styles.contactText, { color: theme.textSecondary }]}>
            {content.contact.description}
            {content.contact.email && `\nEmail : ${content.contact.email}`}
            {content.contact.dpo && `\n${content.contact.description} :\nEmail : ${content.contact.dpo}`}
          </Text>
        </View>
      )}
    </View>
  );
}

function PrivacyContent({ theme, content }) {
  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>
        {content.title}
      </Text>
      <Text style={[styles.lastUpdate, { color: theme.textMuted }]}>
        Dernière mise à jour : {cguContent.lastUpdate}
      </Text>

      {/* Render sections from JSON */}
      {content.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {section.id}. {section.title}
          </Text>
          {section.content && typeof section.content === 'string' ? (
            <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
              {section.content}
            </Text>
          ) : Array.isArray(section.content) ? (
            section.content.map((item, idx) => (
              <Text key={idx} style={[styles.sectionText, { color: theme.textSecondary }]}>
                • {item}
              </Text>
            ))
          ) : section.subsections ? (
            section.subsections.map((subsection, idx) => (
              <View key={idx} style={styles.subsection}>
                <Text style={[styles.subsectionTitle, { color: theme.text }]}>
                  {subsection.title} :
                </Text>
                {Array.isArray(subsection.content) ? (
                  subsection.content.map((item, itemIdx) => (
                    <Text 
                      key={itemIdx} 
                      style={[styles.sectionText, { color: theme.textSecondary }]}
                    >
                      • {item}
                    </Text>
                  ))
                ) : (
                  <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
                    {subsection.content}
                  </Text>
                )}
              </View>
            ))
          ) : null}
        </View>
      ))}

      {/* Contact */}
      {content.contact && (
        <View style={[styles.contactSection, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.contactTitle, { color: theme.text }]}>
            {content.contact.title}
          </Text>
          <Text style={[styles.contactText, { color: theme.textSecondary }]}>
            {content.contact.description}
            {content.contact.email && `\nEmail : ${content.contact.email}`}
            {content.contact.dpo && `\n${content.contact.description} :\nEmail : ${content.contact.dpo}`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  lastUpdate: {
    fontSize: 13,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
  },
  subsection: {
    marginTop: 8,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactSection: {
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 32,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 22,
  },
});


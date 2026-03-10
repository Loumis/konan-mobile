/**
 * KONAN Mobile v2 — Settings Screen
 * Paramètres de l'application (thème, langue, compte)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/AppThemeContext';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { theme, mode, setMode, isDark } = useAppTheme();
  const { language } = useLanguage();
  const { user, logout } = useAuth();

  const settingsSections = [
    {
      title: 'Apparence',
      items: [
        {
          label: 'Thème',
          value: mode === 'auto' ? 'Automatique' : mode === 'light' ? 'Clair' : 'Sombre',
          onPress: () => {
            // Cycle : auto → light → dark → auto
            const nextMode = mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
            setMode(nextMode);
          },
          type: 'selector',
        },
      ],
    },
    {
      title: 'Informations',
      items: [
        {
          label: 'À propos de KONAN',
          onPress: () => navigation.navigate('AboutKonan'),
          type: 'link',
        },
        {
          label: 'Présentation KONAN',
          onPress: () => navigation.navigate('Presentation'),
          type: 'link',
        },
        {
          label: 'Conditions Générales',
          onPress: () => navigation.navigate('Terms'),
          type: 'link',
        },
      ],
    },
    {
      title: 'Debug (Temporaire)',
      items: [
        {
          label: '🔍 Voir Présentation',
          onPress: () => navigation.navigate('Presentation'),
          type: 'link',
        },
        {
          label: '📄 Voir CGU',
          onPress: () => navigation.navigate('Terms'),
          type: 'link',
        },
      ],
    },
    {
      title: 'Compte',
      items: [
        {
          label: 'Email',
          value: user?.email || 'Non connecté',
          type: 'info',
        },
        {
          label: 'Abonnement',
          value: user?.subscription === 'premium' ? 'Premium' : 'Free',
          onPress: () => navigation.navigate('Subscribe'),
          type: 'link',
        },
        {
          label: 'Déconnexion',
          onPress: () => {
            logout();
            navigation.navigate('Login');
          },
          type: 'danger',
        },
      ],
    },
  ];

  const renderItem = (item) => {
    if (item.type === 'selector') {
      return (
        <TouchableOpacity
          key={item.label}
          style={[styles.item, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
          onPress={item.onPress}
        >
          <Text style={[styles.itemLabel, { color: theme.text }]}>{item.label}</Text>
          <View style={styles.itemRight}>
            <Text style={[styles.itemValue, { color: theme.primary }]}>{item.value}</Text>
            <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === 'link') {
      return (
        <TouchableOpacity
          key={item.label}
          style={[styles.item, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
          onPress={item.onPress}
        >
          <Text style={[styles.itemLabel, { color: theme.text }]}>{item.label}</Text>
          <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
        </TouchableOpacity>
      );
    }

    if (item.type === 'info') {
      return (
        <View
          key={item.label}
          style={[styles.item, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
        >
          <Text style={[styles.itemLabel, { color: theme.text }]}>{item.label}</Text>
          <Text style={[styles.itemValue, { color: theme.textMuted }]}>{item.value}</Text>
        </View>
      );
    }

    if (item.type === 'danger') {
      return (
        <TouchableOpacity
          key={item.label}
          style={[styles.item, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
          onPress={item.onPress}
        >
          <Text style={[styles.itemLabel, { color: theme.error }]}>{item.label}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{section.title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: theme.surface }]}>
              {section.items.map(renderItem)}
            </View>
          </View>
        ))}

        {/* Version & Credits */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            KONAN Mobile v2.0
          </Text>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            © 2025 KONAN • Agent Juridique Intelligent
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 15,
    marginRight: 4,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
});


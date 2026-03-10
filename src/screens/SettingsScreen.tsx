/**
 * FI9_NAYEK: Settings Screen
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKonanTheme } from '../hooks/useKonanTheme';
import { useTheme } from '../theme/ThemeProvider';
import { useSystemStatus } from '../services/status.service';
import { StatusIndicator } from '../components/StatusIndicator';
import { useAuth } from '../hooks/useAuth';

export default function SettingsScreen() {
  const theme = useKonanTheme();
  const { fi9Mode, setFI9Mode } = useTheme();
  const { status, setFI9Mode: setStatusFI9Mode } = useSystemStatus();
  const { user, logout } = useAuth();

  const handleFI9ModeChange = (mode: 'ACTIVE' | 'BYPASS' | 'STRICT') => {
    setFI9Mode(mode);
    setStatusFI9Mode(mode);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      edges={['top', 'bottom']}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.xl },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontSize: theme.typography['2xl'].fontSize,
              fontWeight: '700',
              marginBottom: theme.spacing.xl,
            },
          ]}
        >
          Paramètres
        </Text>

        {/* System Status */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.xl,
              padding: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.lg.fontSize,
                fontWeight: '600',
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            Statut système
          </Text>
          
          <View style={styles.statusGrid}>
            <StatusIndicator label="Online" status={status.online ? 'online' : 'offline'} />
            <StatusIndicator label="Supabase" status={status.supabaseConnected ? 'connected' : 'disconnected'} />
            <StatusIndicator label="RLS" status={status.rlsActive ? 'active' : 'inactive'} />
            <StatusIndicator label="FI9" status={fi9Mode} />
          </View>
        </View>

        {/* FI9 Mode */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.xl,
              padding: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.lg.fontSize,
                fontWeight: '600',
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            Mode FI9
          </Text>
          
          {(['ACTIVE', 'BYPASS', 'STRICT'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => handleFI9ModeChange(mode)}
              style={[
                styles.modeButton,
                {
                  backgroundColor: fi9Mode === mode ? theme.colors.surfaceActive : 'transparent',
                  borderRadius: theme.radius.lg,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.sm,
                  borderWidth: 1,
                  borderColor: fi9Mode === mode ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  {
                    color: fi9Mode === mode ? theme.colors.primary : theme.colors.textSecondary,
                    fontSize: theme.typography.base.fontSize,
                    fontWeight: fi9Mode === mode ? '600' : '400',
                  },
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User Info */}
        {user && (
          <View
            style={[
              styles.section,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.xl,
                padding: theme.spacing.lg,
                marginBottom: theme.spacing.lg,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.lg.fontSize,
                  fontWeight: '600',
                  marginBottom: theme.spacing.md,
                },
              ]}
            >
              Compte
            </Text>
            <Text
              style={[
                styles.userInfo,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.base.fontSize,
                  marginBottom: theme.spacing.sm,
                },
              ]}
            >
              {user.email}
            </Text>
            <TouchableOpacity
              onPress={logout}
              style={[
                styles.logoutButton,
                {
                  backgroundColor: theme.colors.error,
                  borderRadius: theme.radius.lg,
                  padding: theme.spacing.md,
                  marginTop: theme.spacing.md,
                },
              ]}
            >
              <Text
                style={[
                  styles.logoutButtonText,
                  {
                    color: '#ffffff',
                    fontSize: theme.typography.base.fontSize,
                    fontWeight: '600',
                    textAlign: 'center',
                  },
                ]}
              >
                Déconnexion
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontWeight: '700',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeButton: {
    marginBottom: 8,
  },
  modeButtonText: {
    fontWeight: '500',
  },
  userInfo: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 12,
  },
  logoutButtonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});


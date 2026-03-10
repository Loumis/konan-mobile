// FI9_NAYEK: LEGACY UI COMPONENT - not used in current mobile flow
/**
 * FI9_NAYEK: Dynamic Header Component with Status Indicators
 * ChatGPT-style header with online status, Supabase, RLS, FI9 mode
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useKonanTheme } from '../hooks/useKonanTheme';
import { Avatar } from './Avatar';
import { StatusIndicator } from './StatusIndicator';
import { useSystemStatus } from '../services/status.service';

interface HeaderDynamicProps {
  title?: string;
  userAvatar?: { uri: string };
  userName?: string;
  style?: ViewStyle;
}

export const HeaderDynamic: React.FC<HeaderDynamicProps> = ({
  title = 'KONAN Assistant',
  userAvatar,
  userName,
  style,
}) => {
  const theme = useKonanTheme();
  const { status } = useSystemStatus();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bgSecondary,
          borderBottomColor: theme.colors.border,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
      accessibilityRole="header"
    >
      <View style={styles.leftSection}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontSize: theme.typography.lg.fontSize,
              fontWeight: '600',
            },
          ]}
        >
          {title}
        </Text>
        
        <View style={styles.statusRow}>
          <StatusIndicator
            label="Online"
            status={status.online ? 'online' : 'offline'}
            size="sm"
          />
          <StatusIndicator
            label="Supabase"
            status={status.supabaseConnected ? 'connected' : 'disconnected'}
            size="sm"
          />
          <StatusIndicator
            label="RLS"
            status={status.rlsActive ? 'active' : 'inactive'}
            size="sm"
          />
          <StatusIndicator
            label="FI9"
            status={status.fi9Mode}
            size="sm"
          />
        </View>
      </View>

      <Avatar type="user" size={36} source={userAvatar} name={userName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});


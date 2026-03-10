/**
 * FI9_NAYEK: Dynamic header with status indicators
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useKonanTheme } from '../hooks/useKonanTheme';
import { Avatar } from './Avatar';
import { StatusIndicator } from './StatusIndicator';

interface HeaderProps {
  title?: string;
  online?: boolean;
  supabaseConnected?: boolean;
  rlsActive?: boolean;
  fi9Mode?: 'ACTIVE' | 'BYPASS' | 'STRICT';
  userAvatar?: { uri: string };
  userName?: string;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'KONAN Assistant',
  online = true,
  supabaseConnected = true,
  rlsActive = true,
  fi9Mode = 'ACTIVE',
  userAvatar,
  userName,
  style,
}) => {
  const theme = useKonanTheme();

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
            status={online ? 'online' : 'offline'}
            size="sm"
          />
          <StatusIndicator
            label="Supabase"
            status={supabaseConnected ? 'connected' : 'disconnected'}
            size="sm"
          />
          <StatusIndicator
            label="RLS"
            status={rlsActive ? 'active' : 'inactive'}
            size="sm"
          />
          <StatusIndicator
            label="FI9"
            status={fi9Mode.toLowerCase() as any}
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


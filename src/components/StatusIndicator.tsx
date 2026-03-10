/**
 * FI9_NAYEK: Status indicator pill component
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useKonanTheme } from '../hooks/useKonanTheme';

type StatusType =
  | 'online'
  | 'offline'
  | 'connected'
  | 'disconnected'
  | 'active'
  | 'inactive'
  | 'ACTIVE'
  | 'BYPASS'
  | 'STRICT';

interface StatusIndicatorProps {
  label: string;
  status: StatusType;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const getStatusColor = (status: StatusType, theme: ReturnType<typeof useKonanTheme>) => {
  switch (status) {
    case 'online':
    case 'connected':
    case 'active':
    case 'ACTIVE':
      return theme.colors.success;
    case 'offline':
    case 'disconnected':
    case 'inactive':
      return theme.colors.error;
    case 'BYPASS':
      return theme.colors.warning;
    case 'STRICT':
      return theme.colors.primary;
    default:
      return theme.colors.textMuted;
  }
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status,
  size = 'md',
  style,
}) => {
  const theme = useKonanTheme();
  const statusColor = getStatusColor(status, theme);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${statusColor}20`,
          borderColor: statusColor,
          paddingHorizontal: size === 'sm' ? theme.spacing.sm : theme.spacing.md,
          paddingVertical: size === 'sm' ? 2 : 4,
          borderRadius: theme.radius.full,
          borderWidth: 1,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${status}`}
    >
      <View
        style={[
          styles.dot,
          {
            width: size === 'sm' ? 6 : 8,
            height: size === 'sm' ? 6 : 8,
            borderRadius: size === 'sm' ? 3 : 4,
            backgroundColor: statusColor,
            marginRight: theme.spacing.xs,
          },
        ]}
      />
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
            fontSize: size === 'sm' ? theme.typography.xs.fontSize : theme.typography.sm.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 4,
  },
  label: {
    fontWeight: '500',
  },
});


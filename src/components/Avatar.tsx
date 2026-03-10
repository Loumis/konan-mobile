/**
 * FI9_NAYEK: Avatar component (user and AI)
 */
import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { useKonanTheme } from '../hooks/useKonanTheme';
import { PrimaryGradient } from '../styles/gradients';

interface AvatarProps {
  type: 'user' | 'assistant';
  size?: number;
  source?: { uri: string };
  name?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  type,
  size = 40,
  source,
  name,
  style,
}) => {
  const theme = useKonanTheme();
  const isAssistant = type === 'assistant';

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    style,
  ];

  if (isAssistant) {
    // KONAN AI avatar with gradient
    return (
      <View style={containerStyle} accessibilityRole="image" accessibilityLabel="KONAN Assistant">
        <PrimaryGradient
          style={[
            styles.gradient,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>K</Text>
        </PrimaryGradient>
      </View>
    );
  }

  // User avatar
  if (source?.uri) {
    return (
      <Image
        source={source}
        style={containerStyle}
        accessibilityRole="image"
        accessibilityLabel={name || 'User avatar'}
      />
    );
  }

  // Fallback: initials
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <View
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surfaceActive,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={name || 'User avatar'}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4, color: theme.colors.text }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '600',
    color: '#ffffff',
  },
});


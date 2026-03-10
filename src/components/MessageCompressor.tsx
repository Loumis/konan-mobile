/**
 * FI9_NAYEK: Message compressor for long messages (>600 chars)
 * ChatGPT-style compression with smooth height animation
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useKonanTheme } from '../hooks/useKonanTheme';

interface MessageCompressorProps {
  messageId: string;
  text: string;
  maxChars?: number;
  textStyle?: any;
}

const DEFAULT_MAX_CHARS = 600;

export const MessageCompressor: React.FC<MessageCompressorProps> = ({
  messageId,
  text,
  maxChars = DEFAULT_MAX_CHARS,
  textStyle,
}) => {
  const theme = useKonanTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCompression, setNeedsCompression] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setNeedsCompression(text.length > maxChars);
  }, [text, maxChars]);

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: theme.animations.normal,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, heightAnim, theme.animations.normal]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  if (!needsCompression) {
    return <Text style={textStyle}>{text}</Text>;
  }

  const previewText = text.substring(0, maxChars);
  const remainingText = text.substring(maxChars);

  return (
    <View>
      <Text style={textStyle}>{previewText}</Text>
      {!isExpanded && <Text style={textStyle}>...</Text>}
      <Animated.View
        style={{
          maxHeight: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000],
          }),
          overflow: 'hidden',
        }}
      >
        {isExpanded && <Text style={textStyle}>{remainingText}</Text>}
      </Animated.View>
      <TouchableOpacity
        onPress={toggleExpansion}
        style={styles.toggleButton}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Show less' : 'Show more'}
      >
        <Text style={[styles.toggleText, { color: theme.colors.primary }]}>
          {isExpanded ? 'Afficher moins' : 'Afficher plus'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    marginTop: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
});


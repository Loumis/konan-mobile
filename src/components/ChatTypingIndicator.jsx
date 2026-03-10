// FI9_NAYEK v13.1 – ChatTypingIndicator.jsx
// FI9_PATCH: Enhanced with Rork animated dots (Animated API)
// Separate file to avoid conflict with TypingIndicator.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useAppTheme } from "../context/AppThemeContext";

export default function ChatTypingIndicator({ visible }) {
  const { theme } = useAppTheme();
  
  // FI9_PATCH: Animated dots with pulse effect (from Rork)
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const createPulse = (animValue, delay) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };

    const animation = Animated.parallel([
      createPulse(dot1, 0),
      createPulse(dot2, 150),
      createPulse(dot3, 300),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [visible, dot1, dot2, dot3]);

  if (!visible) return null;
  
  const getDotStyle = (animValue) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.1],
        }),
      },
    ],
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: theme.surface || "#F2F2F7" }]}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, getDotStyle(dot1), { backgroundColor: theme.textMuted || "#8E8E93" }]} />
          <Animated.View style={[styles.dot, getDotStyle(dot2), { backgroundColor: theme.textMuted || "#8E8E93" }]} />
          <Animated.View style={[styles.dot, getDotStyle(dot3), { backgroundColor: theme.textMuted || "#8E8E93" }]} />
        </View>
      </View>
    </View>
  );
}

// FI9_PATCH: Styles updated for animated dots
const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  bubble: {
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});


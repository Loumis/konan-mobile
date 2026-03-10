// LEGACY_FI9: fichier déplacé automatiquement, plus utilisé par l'app mobile
// FI9_NAYEK_PATCH_UI: TypingIndicator style ChatGPT moderne
// Note: This is the .jsx version to avoid conflict with TypingIndicator.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

function ChatTypingIndicator({ visible }) {
  if (!visible) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bubble: {
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    borderTopLeftRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 18,
    maxWidth: "75%",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.8,
  },
});

// Export as default to match import in ChatScreen
export default ChatTypingIndicator;


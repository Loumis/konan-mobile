// FI9_PATCH v13.1 - Rork UI integration
// AnimatedMessageBubble.jsx - ChatGPT-like message bubbles
// Preserves KONAN features (avatars, TTS), uses Rork UI style

import React, { memo, useMemo, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { chatColors } from "../constants/colors";
import TTSButton from "./TTSButton";

// Try to import Ionicons, fallback to Text if not available
let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

function AnimatedMessageBubble({ role = "assistant", content = "", username, onTTS, index = 0 }) {
  const { theme, isDark } = useAppTheme();
  const isUser = role === "user";
  
  // FI9_PATCH: Animation d'apparition ChatGPT-style (fade + translateY)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const hasAnimated = useRef(false);

  useEffect(() => {
    // FI9_PATCH: Animer seulement la première fois
    if (hasAnimated.current) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }
    
    hasAnimated.current = true;
    
    // Délai progressif pour effet cascade
    const delay = index * 50;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, slideAnim]);

  // FI9_PATCH: Styles Rork ChatGPT-like avec support thème KONAN
  const dynamicStyles = useMemo(() => StyleSheet.create({
    assistantAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? "#1f1f1f" : chatColors.assistantBubble,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.1)" : chatColors.border,
    },
    assistantAvatarText: {
      color: isDark ? "#FFFFFF" : chatColors.assistantText,
      fontSize: 14,
      fontWeight: "600",
    },
    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? "#FFFFFF" : chatColors.userBubble,
      justifyContent: "center",
      alignItems: "center",
    },
    userAvatarText: {
      color: isDark ? chatColors.userBubble : "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    assistantBubble: {
      backgroundColor: isDark ? "#1f1f1f" : chatColors.assistantBubble,
      borderBottomLeftRadius: 4,
    },
    userBubble: {
      backgroundColor: isDark ? "#FFFFFF" : chatColors.userBubble,
      borderBottomRightRadius: 4,
    },
    assistantContent: {
      color: isDark ? "#FFFFFF" : chatColors.assistantText,
    },
    userContent: {
      color: isDark ? chatColors.userBubble : chatColors.userText,
    },
  }), [theme, isDark]);

  // Avatar pour assistant (icône robot) - KONAN feature preserved
  const AssistantAvatar = () => (
    <View style={styles.avatarContainer}>
      <View style={dynamicStyles.assistantAvatar}>
        {Ionicons ? (
          <Ionicons 
            name="chatbubbles" 
            size={16} 
            color={isDark ? "#FFFFFF" : chatColors.assistantText} 
          />
        ) : (
          <Text style={dynamicStyles.assistantAvatarText}>K</Text>
        )}
      </View>
    </View>
  );

  // Avatar pour user (initiale extraite de username/email) - KONAN feature preserved
  const UserAvatar = () => {
    const initial = username 
      ? username.charAt(0).toUpperCase() 
      : "U";
    return (
      <View style={styles.avatarContainer}>
        <View style={dynamicStyles.userAvatar}>
          <Text style={dynamicStyles.userAvatarText}>{initial}</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {!isUser && <AssistantAvatar />}
      
      <View style={[styles.bubble, isUser ? dynamicStyles.userBubble : dynamicStyles.assistantBubble]}>
        <View style={styles.bubbleContent}>
          <Text style={[styles.content, isUser ? dynamicStyles.userContent : dynamicStyles.assistantContent]}>
            {content}
          </Text>
          {/* FI9_PATCH: TTSButton preserved (KONAN feature) */}
          {!isUser && content && (
            <TTSButton text={content} onPress={onTTS} />
          )}
        </View>
      </View>

      {isUser && <UserAvatar />}
    </Animated.View>
  );
}

export default memo(AnimatedMessageBubble);

// FI9_PATCH: Styles Rork ChatGPT-like
const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantContainer: {
    alignItems: "flex-start",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    maxWidth: "80%", // FI9_PATCH: Rork style (was 75%)
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
  },
});

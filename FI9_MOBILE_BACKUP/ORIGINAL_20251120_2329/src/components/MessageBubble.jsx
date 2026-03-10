// FI9_NAYEK v14: MessageBubble component - simpler version without animations
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
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

export default function MessageBubble({ role = "assistant", content = "", username, onTTS }) {
  const { theme, isDark } = useAppTheme();
  const isUser = role === "user";

  const dynamicStyles = StyleSheet.create({
    assistantAvatar: {
      backgroundColor: isDark ? "#1f1f1f" : "#E5E5E5",
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(31,31,31,0.1)",
    },
    assistantAvatarText: {
      color: isDark ? "#FFFFFF" : "#1f1f1f",
    },
    userAvatar: {
      backgroundColor: isDark ? "#FFFFFF" : "#1f1f1f",
    },
    userAvatarText: {
      color: isDark ? "#1f1f1f" : "#FFFFFF",
    },
    assistantBubble: {
      backgroundColor: isDark ? "#1f1f1f" : "#E5E5E5",
    },
    userBubble: {
      backgroundColor: isDark ? "#FFFFFF" : "#1f1f1f",
    },
    assistantContent: {
      color: isDark ? "#FFFFFF" : "#1f1f1f",
    },
    userContent: {
      color: isDark ? "#1f1f1f" : "#FFFFFF",
    },
  });

  // Avatar for assistant
  const AssistantAvatar = () => (
    <View style={styles.avatarContainer}>
      <View style={[styles.avatar, dynamicStyles.assistantAvatar]}>
        {Ionicons ? (
          <Ionicons
            name="chatbubbles"
            size={16}
            color={isDark ? "#FFFFFF" : "#1f1f1f"}
          />
        ) : (
          <Text style={[styles.avatarText, dynamicStyles.assistantAvatarText]}>K</Text>
        )}
      </View>
    </View>
  );

  // Avatar for user
  const UserAvatar = () => {
    const initial = username
      ? username.charAt(0).toUpperCase()
      : "U";
    return (
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, dynamicStyles.userAvatar]}>
          <Text style={[styles.avatarText, dynamicStyles.userAvatarText]}>{initial}</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      {!isUser && <AssistantAvatar />}

      <View
        style={[
          styles.bubble,
          isUser ? dynamicStyles.userBubble : dynamicStyles.assistantBubble,
        ]}
      >
        <View style={styles.bubbleContent}>
          <Text
            style={[
              styles.content,
              isUser ? dynamicStyles.userContent : dynamicStyles.assistantContent,
            ]}
          >
            {content}
          </Text>
          {!isUser && content && <TTSButton text={content} onPress={onTTS} />}
        </View>
      </View>

      {isUser && <UserAvatar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    marginBottom: 4,
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  assistantContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bubble: {
    maxWidth: "75%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});


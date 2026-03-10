// FI9_NAYEK v13.1 – SessionsSidebar.jsx
// FI9_PATCH: New component based on Rork UI, adapted for KONAN structure
// Modal sidebar for session management (ChatGPT-style)
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/components/SessionsSidebar.jsx");

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Platform,
} from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";

// FI9_PATCH: Try to import lucide-react-native (optional, fallback to Ionicons)
let PlusIcon = null;
let TrashIcon = null;
let MessageSquareIcon = null;
try {
  const lucide = require("lucide-react-native");
  if (lucide) {
    PlusIcon = lucide.Plus;
    TrashIcon = lucide.Trash2;
    MessageSquareIcon = lucide.MessageSquare;
  }
} catch (e) {
  PlusIcon = null;
  TrashIcon = null;
  MessageSquareIcon = null;
}

// Try Ionicons for icons
let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

// FI9_PATCH: Try to import haptics (optional)
let Haptics = null;
try {
  Haptics = require("expo-haptics");
} catch (e) {
  Haptics = null;
}

export default function SessionsSidebar({
  sessions = [],
  currentSessionId,
  isSidebarOpen,
  toggleSidebar,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/components/SessionsSidebar.jsx");

  const { theme } = useAppTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        sidebar: {
          width: "80%",
          maxWidth: 320,
          height: "100%",
          backgroundColor: theme.background || "#FFFFFF",
          paddingTop: 60,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || "#E5E5EA",
        },
        headerTitle: {
          fontSize: 28,
          fontWeight: "700",
          color: theme.text || "#000000",
        },
        newChatButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.surface || "#F2F2F7",
          alignItems: "center",
          justifyContent: "center",
        },
        sessionsList: {
          paddingVertical: 8,
        },
        sessionItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 12,
          gap: 12,
        },
        sessionItemActive: {
          backgroundColor: theme.surface || "#F2F2F7",
        },
        sessionIcon: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.surface || "#F2F2F7",
          alignItems: "center",
          justifyContent: "center",
        },
        sessionContent: {
          flex: 1,
        },
        sessionTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.text || "#000000",
          marginBottom: 2,
        },
        sessionTitleActive: {
          color: theme.primary || "#007AFF",
        },
        sessionMeta: {
          fontSize: 13,
          color: theme.textMuted || "#8E8E93",
        },
        deleteButton: {
          padding: 4,
        },
      }),
    [theme]
  );

  const handleNewChat = useCallback(async () => {
    if (Platform.OS !== "web" && Haptics) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        // Ignore haptic errors
      }
    }
    if (onNewChat) {
      await onNewChat();
    }
    if (toggleSidebar) {
      toggleSidebar();
    }
  }, [onNewChat, toggleSidebar]);

  const handleSelectSession = useCallback(
    (sessionId) => {
      if (Platform.OS !== "web" && Haptics) {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {
          // Ignore haptic errors
        }
      }
      if (onSelectSession) {
        onSelectSession(sessionId);
      }
      if (toggleSidebar) {
        toggleSidebar();
      }
    },
    [onSelectSession, toggleSidebar]
  );

  const handleDeleteSession = useCallback(
    async (sessionId, e) => {
      if (e) {
        e.stopPropagation();
      }
      if (Platform.OS !== "web" && Haptics) {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch (e) {
          // Ignore haptic errors
        }
      }
      if (onDeleteSession) {
        await onDeleteSession(sessionId);
      }
    },
    [onDeleteSession]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const isActive = item.id === currentSessionId;
      // FI9_PATCH: Get message count from messages array or lastMessage
      const messageCount = item.messages ? item.messages.length : 0;

      return (
        <TouchableOpacity
          style={[styles.sessionItem, isActive && styles.sessionItemActive]}
          onPress={() => handleSelectSession(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.sessionIcon}>
            {MessageSquareIcon ? (
              <MessageSquareIcon
                size={20}
                color={isActive ? (theme.primary || "#007AFF") : (theme.textMuted || "#8E8E93")}
                strokeWidth={2}
              />
            ) : Ionicons ? (
              <Ionicons
                name="chatbubbles-outline"
                size={20}
                color={isActive ? (theme.primary || "#007AFF") : (theme.textMuted || "#8E8E93")}
              />
            ) : (
              <Text style={{ fontSize: 16 }}>💬</Text>
            )}
          </View>
          <View style={styles.sessionContent}>
            <Text
              style={[styles.sessionTitle, isActive && styles.sessionTitleActive]}
              numberOfLines={1}
            >
              {item.title || t("newChat") || "New Chat"}
            </Text>
            <Text style={styles.sessionMeta}>
              {messageCount} {messageCount === 1 ? (t("message") || "message") : (t("messages") || "messages")}
            </Text>
          </View>
          {sessions.length > 1 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => handleDeleteSession(item.id, e)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {TrashIcon ? (
                <TrashIcon size={18} color="#FF3B30" strokeWidth={2} />
              ) : Ionicons ? (
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              ) : (
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    },
    [currentSessionId, sessions.length, styles, theme, t, handleSelectSession, handleDeleteSession]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  if (!isSidebarOpen) return null;

  return (
    <Modal
      visible={isSidebarOpen}
      animationType="slide"
      transparent
      onRequestClose={toggleSidebar}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleSidebar}>
        <Animated.View style={styles.sidebar} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("chats") || "Chats"}</Text>
            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
              {PlusIcon ? (
                <PlusIcon size={24} color={theme.primary || "#007AFF"} strokeWidth={2.5} />
              ) : Ionicons ? (
                <Ionicons name="add" size={24} color={theme.primary || "#007AFF"} />
              ) : (
                <Text style={{ fontSize: 24 }}>+</Text>
              )}
            </TouchableOpacity>
          </View>

          <FlatList
            data={sessions}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.sessionsList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}


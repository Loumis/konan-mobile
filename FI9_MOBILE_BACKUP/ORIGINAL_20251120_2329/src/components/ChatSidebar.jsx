// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/components/ChatSidebar.jsx");
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";

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

export default function ChatSidebar({
  visible,
  onClose,
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
}) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/components/ChatSidebar.jsx");
  const { theme } = useAppTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  const username =
    user?.name ||
    user?.full_name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "User";

  const planRaw = user?.plan || user?.subscription || "free";
  const planLabel =
    planRaw?.toLowerCase() === "legal+"
      ? "Legal+"
      : planRaw?.toLowerCase() === "pro"
      ? "Pro"
      : "Free";

  if (!visible) return null;

  const renderItem = ({ item }) => {
    const isActive = item.id === activeSessionId;
    return (
      <TouchableOpacity
        style={[
          styles.sessionItem,
          { borderColor: theme.border },
          isActive && { backgroundColor: theme.surface },
        ]}
        onPress={() => onSelectSession?.(item.id)}
        activeOpacity={0.8}
      >
        <Text
          style={[styles.sessionTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.title || t("newChat")}
        </Text>
        {item.lastMessage ? (
          <Text
            style={[styles.sessionSubtitle, { color: theme.textMuted }]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        ) : (
          <Text
            style={[styles.sessionSubtitle, { color: theme.textMuted }]}
            numberOfLines={1}
          >
            {t("emptyChat")}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <View
          style={[
            styles.sidebar,
            {
              backgroundColor: theme.background,
              borderRightColor: theme.border,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: theme.border, backgroundColor: theme.surface },
            ]}
          >
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {t("conversations") || "Conversations"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              {Ionicons ? (
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.textMuted || theme.text}
                />
              ) : (
                <Text style={{ color: theme.text }}>×</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* New Chat button */}
          <TouchableOpacity
            style={[
              styles.newChatButton,
              {
                borderColor: theme.border,
                backgroundColor: theme.surface,
              },
            ]}
            onPress={onNewChat}
            activeOpacity={0.85}
          >
            {Ionicons ? (
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={theme.text}
              />
            ) : (
              <Text style={[styles.newChatText, { color: theme.text }]}>+</Text>
            )}
            <Text style={[styles.newChatText, { color: theme.text }]}>
              {t("newChat") || "New Chat"}
            </Text>
          </TouchableOpacity>

          {/* Sessions list */}
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                  {t("noSessions") || "No conversations yet"}
                </Text>
              </View>
            }
          />

          {/* Footer user info */}
          <View
            style={[
              styles.footer,
              { borderTopColor: theme.border, backgroundColor: theme.surface },
            ]}
          >
            <View style={styles.footerUser}>
              {Ionicons ? (
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color={theme.text}
                />
              ) : (
                <Text style={{ fontSize: 20, color: theme.text }}>👤</Text>
              )}
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text
                  style={[styles.footerUsername, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {username}
                </Text>
                <Text
                  style={[styles.footerPlan, { color: theme.textMuted }]}
                  numberOfLines={1}
                >
                  {planLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  sidebar: {
    width: "80%",
    borderRightWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  newChatButton: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  newChatText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  sessionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  sessionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerUsername: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerPlan: {
    fontSize: 12,
  },
});

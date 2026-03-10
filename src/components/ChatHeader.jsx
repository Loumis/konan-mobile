// FI9_NAYEK v14: ChatHeader component for chat screen top bar
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";

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

export default function ChatHeader({ onMenuPress, onLogout, navigation }) {
  const { theme } = useAppTheme();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const username =
    user?.name ||
    user?.full_name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "User";

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else if (logout) {
      await logout();
      if (navigation) {
        navigation.replace("Login");
      }
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderBottomColor: theme.border,
    },
    menuButtonText: {
      color: theme.text,
    },
    title: {
      color: theme.text,
    },
    userLabel: {
      color: theme.textMuted,
    },
    logoutButton: {
      backgroundColor: "rgba(255,255,255,0.12)",
      borderColor: theme.border,
    },
    logoutText: {
      color: theme.text,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuButton}
        activeOpacity={0.7}
        accessibilityLabel="Ouvrir le menu des conversations"
        accessibilityRole="button"
      >
        {Ionicons ? (
          <Ionicons name="menu" size={24} color={theme.text} />
        ) : (
          <Text style={dynamicStyles.menuButtonText}>☰</Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.title, dynamicStyles.title]}>{t("title")}</Text>

      <View style={styles.rightContainer}>
        <Text style={[styles.userLabel, dynamicStyles.userLabel]} numberOfLines={1}>
          {username}
        </Text>
        <LanguageSelector />
        <ThemeSelector />
        <TouchableOpacity
          style={[styles.logoutButton, dynamicStyles.logoutButton]}
          onPress={handleLogout}
          activeOpacity={0.85}
          accessibilityLabel="Se déconnecter"
          accessibilityRole="button"
        >
          {Ionicons ? (
            <Ionicons name="log-out-outline" size={18} color={theme.text} />
          ) : (
            <Text style={[styles.logoutText, dynamicStyles.logoutText]}>
              {t("logout")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userLabel: {
    fontSize: 13,
    maxWidth: 80,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    fontWeight: "600",
    fontSize: 13,
  },
});


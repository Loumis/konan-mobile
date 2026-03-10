// PHASE 3.1: Extracted from ChatScreen.jsx
// ChatHeader - TopBar minimaliste style ChatGPT Mobile 2025

import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppTheme } from "../../context/AppThemeContext";
import { chatColors } from "../../constants/colors";

export default function ChatHeader({ planLabel, onMenuPress, agentRole }) {
  const { theme } = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        topBar: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || chatColors.border,
          backgroundColor: theme.background || chatColors.background || "#181818",
        },
        topBarLeft: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        },
        topBarTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: theme.text || chatColors.textPrimary,
        },
        roleIndicator: {
          fontSize: 16,
          marginLeft: 4,
        },
        roleLabel: {
          fontSize: 11,
          fontWeight: "500",
          color: theme.textMuted || chatColors.textSecondary,
          marginLeft: 4,
        },
        planBadge: {
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 8,
          backgroundColor: planLabel === "Free" ? "rgba(156, 163, 175, 0.15)" : "rgba(34, 197, 94, 0.15)",
          marginLeft: 8,
        },
        planBadgeText: {
          fontSize: 12,
          fontWeight: "600",
          color: planLabel === "Free" ? theme.textMuted || chatColors.textSecondary : "#22c55e",
        },
        mobileMenuButton: {
          padding: 4,
        },
      }),
    [theme, planLabel]
  );

  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <TouchableOpacity
          style={styles.mobileMenuButton}
          onPress={onMenuPress}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20, color: theme.text || chatColors.textPrimary }}>
            ☰
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.topBarTitle}>KONAN</Text>
          {/* Hide "Inspecteur" role label from UI - Inspector mode remains active internally */}
          {agentRole && agentRole.name !== 'Inspecteur' && (
            <>
              <Text style={styles.roleIndicator}>{agentRole.icon}</Text>
              <Text style={styles.roleLabel}>{agentRole.name}</Text>
            </>
          )}
        </View>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>{planLabel}</Text>
        </View>
      </View>
    </View>
  );
}


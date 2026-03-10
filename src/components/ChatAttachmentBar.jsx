// FI9_NAYEK v13: AttachmentBar avec boutons image et file (UI seulement)
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAppTheme } from "../context/AppThemeContext";

let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

export default function ChatAttachmentBar({ visible, onImagePress, onFilePress }) {
  const { theme } = useAppTheme();
  
  if (!visible) return null;

  const dynamicStyles = {
    container: {
      backgroundColor: theme.background,
      borderTopColor: theme.border,
    },
    button: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    buttonLabel: {
      color: theme.text,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <TouchableOpacity style={[styles.button, dynamicStyles.button]} onPress={onImagePress} activeOpacity={0.7}>
        {Ionicons ? (
          <Ionicons name="image-outline" size={20} color={theme.text} />
        ) : (
          <Text style={styles.buttonText}>📷</Text>
        )}
        <Text style={[styles.buttonLabel, dynamicStyles.buttonLabel]}>Image</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, dynamicStyles.button]} onPress={onFilePress} activeOpacity={0.7}>
        {Ionicons ? (
          <Ionicons name="document-attach-outline" size={20} color={theme.text} />
        ) : (
          <Text style={styles.buttonText}>📎</Text>
        )}
        <Text style={[styles.buttonLabel, dynamicStyles.buttonLabel]}>File</Text>
      </TouchableOpacity>
    </View>
  );
}

// FI9_NAYEK v14 FIX: Styles hardcodés retirés - uniquement dynamicStyles utilisés
const styles = StyleSheet.create({
  // Styles non redondants uniquement (gap, padding, etc.)
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 18,
  },
});


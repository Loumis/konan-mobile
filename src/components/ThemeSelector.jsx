// FI9_NAYEK v13: Theme Selector (Light/Dark/Auto)
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/components/ThemeSelector.jsx");
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";

let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

export default function ThemeSelector() {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/components/ThemeSelector.jsx");
  const { mode, setMode, isDark } = useAppTheme();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  const handleSelectTheme = async (newMode) => {
    await setMode(newMode);
    setVisible(false);
  };

  const getIcon = () => {
    if (mode === "light") return "sunny";
    if (mode === "dark") return "moon";
    return "contrast";
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        accessibilityLabel="Changer de thème"
        accessibilityRole="button"
        accessibilityHint="Ouvre le menu de sélection de thème (Clair, Sombre, Auto)"
      >
        {Ionicons ? (
          <Ionicons 
            name={getIcon()} 
            size={20} 
            color={isDark ? "#FFFFFF" : "#1f1f1f"} 
          />
        ) : (
          <Text style={styles.buttonText}>
            {mode === "light" ? "☀️" : mode === "dark" ? "🌙" : "🌓"}
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: isDark ? "#1f1f1f" : "#FFFFFF" }]}>
            <Text style={[styles.modalTitle, { color: isDark ? "#FFFFFF" : "#1f1f1f" }]}>
              {t("theme")}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.option,
                { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(31,31,31,0.05)" },
                mode === "light" && styles.optionActive,
              ]}
              onPress={() => handleSelectTheme("light")}
            >
              <View style={styles.optionLeft}>
                {Ionicons ? (
                  <Ionicons name="sunny" size={20} color={isDark ? "#FFFFFF" : "#1f1f1f"} />
                ) : (
                  <Text style={styles.optionIcon}>☀️</Text>
                )}
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "rgba(255,255,255,0.8)" : "rgba(31,31,31,0.8)" },
                    mode === "light" && styles.optionTextActive,
                  ]}
                >
                  {t("light")}
                </Text>
              </View>
              {mode === "light" && (
                <Text style={[styles.checkmark, { color: isDark ? "#FFFFFF" : "#1f1f1f" }]}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(31,31,31,0.05)" },
                mode === "dark" && styles.optionActive,
              ]}
              onPress={() => handleSelectTheme("dark")}
            >
              <View style={styles.optionLeft}>
                {Ionicons ? (
                  <Ionicons name="moon" size={20} color={isDark ? "#FFFFFF" : "#1f1f1f"} />
                ) : (
                  <Text style={styles.optionIcon}>🌙</Text>
                )}
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "rgba(255,255,255,0.8)" : "rgba(31,31,31,0.8)" },
                    mode === "dark" && styles.optionTextActive,
                  ]}
                >
                  {t("dark")}
                </Text>
              </View>
              {mode === "dark" && (
                <Text style={[styles.checkmark, { color: isDark ? "#FFFFFF" : "#1f1f1f" }]}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(31,31,31,0.05)" },
                mode === "auto" && styles.optionActive,
              ]}
              onPress={() => handleSelectTheme("auto")}
            >
              <View style={styles.optionLeft}>
                {Ionicons ? (
                  <Ionicons name="contrast" size={20} color={isDark ? "#FFFFFF" : "#1f1f1f"} />
                ) : (
                  <Text style={styles.optionIcon}>🌓</Text>
                )}
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? "rgba(255,255,255,0.8)" : "rgba(31,31,31,0.8)" },
                    mode === "auto" && styles.optionTextActive,
                  ]}
                >
                  {t("auto")}
                </Text>
              </View>
              {mode === "auto" && (
                <Text style={[styles.checkmark, { color: isDark ? "#FFFFFF" : "#1f1f1f" }]}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}
            >
              <Text style={[styles.cancelText, { color: isDark ? "rgba(255,255,255,0.6)" : "rgba(31,31,31,0.6)" }]}>
                {t("cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  buttonText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionText: {
    fontSize: 16,
  },
  optionTextActive: {
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
  },
});

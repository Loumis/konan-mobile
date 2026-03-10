// FI9_NAYEK v13: Language Selector (FR/EN/AR) - Using LanguageContext
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/components/LanguageSelector.jsx");
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
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


export default function LanguageSelector() {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/components/LanguageSelector.jsx");
  const { language, setLanguage, t } = useLanguage();
  const [visible, setVisible] = useState(false);

  const handleSelectLanguage = async (lang) => {
    await setLanguage(lang);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        accessibilityLabel="Changer de langue"
        accessibilityRole="button"
        accessibilityHint="Ouvre le menu de sélection de langue (Français, English, العربية)"
      >
        {Ionicons ? (
          <Ionicons name="language" size={20} color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>🌐</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("selectLanguage")}</Text>
            
            <TouchableOpacity
              style={[
                styles.option,
                language === "fr" && styles.optionActive,
              ]}
              onPress={() => handleSelectLanguage("fr")}
            >
              <Text
                style={[
                  styles.optionText,
                  language === "fr" && styles.optionTextActive,
                ]}
              >
                Français
              </Text>
              {language === "fr" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                language === "en" && styles.optionActive,
              ]}
              onPress={() => handleSelectLanguage("en")}
            >
              <Text
                style={[
                  styles.optionText,
                  language === "en" && styles.optionTextActive,
                ]}
              >
                English
              </Text>
              {language === "en" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                language === "ar" && styles.optionActive,
              ]}
              onPress={() => handleSelectLanguage("ar")}
            >
              <Text
                style={[
                  styles.optionText,
                  language === "ar" && styles.optionTextActive,
                ]}
              >
                العربية
              </Text>
              {language === "ar" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>{t("cancel")}</Text>
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
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    color: "#FFFFFF",
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
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  optionActive: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  optionText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
  optionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
});


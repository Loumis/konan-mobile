// FI9_PATCH v14.0 - Attachments Bottom Sheet
// Bottom sheet style ChatGPT pour les attachments (Image, File, Scan, Import)
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { chatColors } from "../constants/colors";

// Try to import Ionicons
let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

export default function FI9_AttachmentsSheet({
  visible,
  onClose,
  onImagePress,
  onFilePress,
  onScanPress,
  onImportPress,
}) {
  const { theme } = useAppTheme();
  const { t } = useLanguage();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
      flexDirection: "column",
    },
    sheetContainer: {
      backgroundColor: theme.surface || chatColors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
      paddingHorizontal: 16,
      maxHeight: "50%",
    },
    sheetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text || chatColors.textPrimary,
    },
    closeButton: {
      padding: 4,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: theme.background || chatColors.background,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surface || chatColors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    optionText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text || chatColors.textPrimary,
    },
  });

  const handleOptionPress = (callback) => {
    if (callback) {
      callback();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {t("attachments") || "Attachments"}
            </Text>
            {Ionicons ? (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.text || chatColors.textPrimary}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onClose}>
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {onImagePress && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionPress(onImagePress)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                {Ionicons ? (
                  <Ionicons
                    name="image-outline"
                    size={20}
                    color={theme.text || chatColors.textPrimary}
                  />
                ) : (
                  <Text style={{ fontSize: 18 }}>📷</Text>
                )}
              </View>
              <Text style={styles.optionText}>
                {t("image") || "Image"}
              </Text>
            </TouchableOpacity>
          )}

          {onFilePress && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionPress(onFilePress)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                {Ionicons ? (
                  <Ionicons
                    name="document-attach-outline"
                    size={20}
                    color={theme.text || chatColors.textPrimary}
                  />
                ) : (
                  <Text style={{ fontSize: 18 }}>📎</Text>
                )}
              </View>
              <Text style={styles.optionText}>
                {t("file") || "File"}
              </Text>
            </TouchableOpacity>
          )}

          {onScanPress && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionPress(onScanPress)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                {Ionicons ? (
                  <Ionicons
                    name="scan-outline"
                    size={20}
                    color={theme.text || chatColors.textPrimary}
                  />
                ) : (
                  <Text style={{ fontSize: 18 }}>📄</Text>
                )}
              </View>
              <Text style={styles.optionText}>
                {t("scan") || "Scan"}
              </Text>
            </TouchableOpacity>
          )}

          {onImportPress && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionPress(onImportPress)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                {Ionicons ? (
                  <Ionicons
                    name="download-outline"
                    size={20}
                    color={theme.text || chatColors.textPrimary}
                  />
                ) : (
                  <Text style={{ fontSize: 18 }}>📥</Text>
                )}
              </View>
              <Text style={styles.optionText}>
                {t("importDocument") || "Import Document"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}


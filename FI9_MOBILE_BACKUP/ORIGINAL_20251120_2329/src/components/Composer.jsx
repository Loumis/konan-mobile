// FI9_NAYEK v14: Composer simplifié - pas de useKeyboardHeight (adjustResize gère déjà)
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/components/Composer.jsx");
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  Text,
} from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/AppThemeContext";

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

export default function Composer({ onSend, disabled, onAttachmentPress }) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/components/Composer.jsx");
  const { t } = useLanguage();
  const { theme, isDark } = useAppTheme();
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(46); // Hauteur minimale
  const inputRef = useRef(null);

  // Auto-focus style ChatGPT
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Styles dynamiques basés sur le thème
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          // ChatGPT style: Input fixé en bas avec position absolute
          // Android avec adjustResize: bottom doit être 0 (le clavier pousse déjà l'input)
          // iOS: bottom peut être 0 car KeyboardAvoidingView gère le déplacement
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingTop: 12,
          // INPUT ALIGNMENT HERE: safe area for manual padding/margin adjustments
          // Padding bottom adaptatif : iOS a besoin de plus d'espace pour safe area
          paddingBottom: Platform.OS === "ios" ? 34 : 16,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          zIndex: 10,
          // Shadow pour effet flottant ChatGPT
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        inputContainer: {
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 8,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(31,31,31,0.05)",
          borderRadius: 24,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: theme.border,
        },
        input: {
          flex: 1,
          minHeight: 46,
          maxHeight: 140,
          paddingHorizontal: 12,
          paddingVertical: 12,
          color: theme.text,
          fontSize: 15,
          lineHeight: 20,
        },
        sendButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(31,31,31,0.1)",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: theme.border,
        },
        sendButtonActive: {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.25)"
            : "rgba(31,31,31,0.25)",
        },
        sendButtonText: {
          color: theme.text,
          fontSize: 18,
          fontWeight: "600",
        },
        sendButtonTextDisabled: {
          color: theme.textMuted,
        },
        attachmentButtonText: {
          fontSize: 18,
        },
      }),
    [theme, isDark]
  );

  // Auto-expand: ajuster la hauteur selon le contenu
  const handleContentSizeChange = (event) => {
    const newHeight = Math.min(
      Math.max(46, event.nativeEvent.contentSize.height + 20),
      140
    );
    setHeight(newHeight);
  };

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled) {
      return;
    }
    setValue("");
    setHeight(46); // Reset height
    Keyboard.dismiss();
    onSend?.(text);
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.inputContainer}>
        {onAttachmentPress && (
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={onAttachmentPress}
            activeOpacity={0.7}
            accessibilityLabel="Ouvrir les options de pièces jointes"
            accessibilityRole="button"
            accessibilityHint="Permet d'ajouter une image ou un fichier au message"
          >
            {Ionicons ? (
              <Ionicons
                name="attach-outline"
                size={20}
                color={theme.textMuted}
              />
            ) : (
              <Text style={dynamicStyles.attachmentButtonText}>📎</Text>
            )}
          </TouchableOpacity>
        )}

        <TextInput
          ref={inputRef}
          style={[dynamicStyles.input, { height }]}
          placeholder={t("placeholder")}
          placeholderTextColor={theme.textMuted}
          value={value}
          onChangeText={setValue}
          onContentSizeChange={handleContentSizeChange}
          multiline
          textAlignVertical="top"
          editable={!disabled}
          returnKeyType="send"
          blurOnSubmit={false}
        />

        <TouchableOpacity
          style={[
            dynamicStyles.sendButton,
            canSend && dynamicStyles.sendButtonActive,
          ]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
          accessibilityLabel="Envoyer le message"
          accessibilityRole="button"
          accessibilityHint="Envoie le message à KONAN"
        >
          {Ionicons ? (
            <Ionicons
              name="arrow-forward"
              size={20}
              color={canSend ? theme.text : theme.textMuted}
            />
          ) : (
            <Text
              style={[
                dynamicStyles.sendButtonText,
                !canSend && dynamicStyles.sendButtonTextDisabled,
              ]}
            >
              →
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  attachmentButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
});

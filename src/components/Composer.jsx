// FI9_PATCH v14.0 + FINAL CHAT EXPERIENCE - ChatGPT Mobile 2025 Composer
// Composer avec bouton "+" intégré style ChatGPT + Voice Button
// Preserves all KONAN logic, uses ChatGPT Mobile 2025 UI style

import React, { memo, useCallback, useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from "react-native";
import VoiceButton from "../features/voice/VoiceButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/AppThemeContext";
import { chatColors } from "../constants/colors";

// FI9_PATCH: Try to import haptics (optional, fallback if not available)
let Haptics = null;
try {
  Haptics = require("expo-haptics");
} catch (e) {
  Haptics = null;
}

// FI9_PATCH: Try to import lucide-react-native (optional, fallback to Ionicons)
let SendIcon = null;
let PlusIcon = null;
try {
  const lucide = require("lucide-react-native");
  if (lucide) {
    SendIcon = lucide.Send;
    PlusIcon = lucide.Plus;
  }
} catch (e) {
  SendIcon = null;
  PlusIcon = null;
}

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

const Composer = ({ onSend, disabled = false, onAttachmentPress, keyboardHeight }) => {
  // ============================================
  // HOOKS (ordre fixe, pas de conditions)
  // ============================================
  const { t } = useLanguage();
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // SPACING FIX: Écouter la hauteur du clavier pour ajuster le padding
  useEffect(() => {
    if (!keyboardHeight) return;

    const listenerId = keyboardHeight.addListener(({ value }) => {
      setIsKeyboardVisible(Math.abs(value) > 0);
    });

    return () => {
      keyboardHeight.removeListener(listenerId);
    };
  }, [keyboardHeight]);

  // FI9_PATCH: Auto-focus style ChatGPT (une seule fois)
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // FI9_PATCH v14.0 + SPACING FIX: Styles ChatGPT Mobile 2025
  const styles = useMemo(
    () => {
      // SPACING FIX: Padding conditionnel basé sur la visibilité du clavier
      // Clavier visible → padding minimal (8px)
      // Clavier fermé → padding avec SafeAreaInset
      const bottomPadding = isKeyboardVisible 
        ? 8 
        : (Platform.OS === "android" ? Math.max(insets.bottom, 12) : Math.max(insets.bottom, 10));

      return StyleSheet.create({
        container: {
          backgroundColor: theme.background || chatColors.background,
          borderTopWidth: 1,
          borderTopColor: theme.border || chatColors.border,
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          zIndex: 10,
          elevation: 5,
        },
        innerContainer: {
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 8,
        },
        plusButton: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: theme.surface || chatColors.surface,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        },
        input: {
          flex: 1,
          backgroundColor: theme.surface || chatColors.surface,
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 16,
          minHeight: 44,
          maxHeight: 120,
          color: theme.text || chatColors.textPrimary,
          textAlignVertical: "top",
        },
        sendButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        },
        sendButtonDisabled: {
          opacity: 0.5,
        },
      });
    },
    [theme, isDark, insets.bottom, isKeyboardVisible]
  );

  // Handlers mémorisés pour éviter re-renders
  const handleChangeText = useCallback((value) => {
    setText(value);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !onSend || disabled) return;

    // FI9_PATCH: Haptic feedback on send (if available)
    if (Haptics && Platform.OS !== "web") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        // Ignore haptic errors
      }
    }

    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  }, [text, onSend, disabled]);

  const handlePlusPress = useCallback(() => {
    if (onAttachmentPress) {
      onAttachmentPress();
    }
  }, [onAttachmentPress]);

  // FINAL CHAT EXPERIENCE: Handler pour le transcript vocal
  const handleVoiceTranscript = useCallback((transcript) => {
    if (!transcript || disabled) return;
    
    // Injecter le transcript dans le champ texte
    setText(transcript);
    
    // Auto-envoi du message vocal (optionnel, peut être désactivé)
    if (onSend) {
      onSend(transcript);
    }
  }, [disabled, onSend]);

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* FINAL CHAT EXPERIENCE: Voice Button */}
        <VoiceButton
          onTranscript={handleVoiceTranscript}
          disabled={disabled}
        />

        {/* FI9_PATCH v14.0: Bouton "+" style ChatGPT */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handlePlusPress}
          activeOpacity={0.7}
        >
          {PlusIcon ? (
            <PlusIcon
              size={18}
              color={theme.text || chatColors.textPrimary}
              strokeWidth={2.5}
            />
          ) : Ionicons ? (
            <Ionicons
              name="add"
              size={20}
              color={theme.text || chatColors.textPrimary}
            />
          ) : (
            <Text style={{ fontSize: 18, color: theme.text || chatColors.textPrimary }}>
              +
            </Text>
          )}
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          placeholder={t("placeholder") || "Message..."}
          placeholderTextColor={theme.textMuted || chatColors.textMuted}
          multiline
          maxLength={4000}
          editable={!disabled}
          returnKeyType="default"
          blurOnSubmit={false}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.sendButton, (!canSend || disabled) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          {SendIcon ? (
            <SendIcon
              size={20}
              color={!canSend || disabled ? chatColors.textMuted : chatColors.accent}
              strokeWidth={2}
            />
          ) : Ionicons ? (
            <Ionicons
              name="arrow-forward"
              size={20}
              color={!canSend || disabled ? (theme.textMuted || chatColors.textMuted) : (theme.text || chatColors.accent)}
            />
          ) : (
            <Text style={{ fontSize: 18, color: !canSend || disabled ? chatColors.textMuted : chatColors.accent }}>
              →
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(Composer);

// PHASE 3.1: Extracted from ChatScreen.jsx
// MessageList - FlatList avec messages + typing indicator
// KEYBOARD FIX: Ajustement dynamique du paddingBottom avec clavier

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, Animated } from "react-native";
import { useAppTheme } from "../../context/AppThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { chatColors } from "../../constants/colors";
import ChatTypingIndicator from "../ChatTypingIndicator";
import MessageItem from "./MessageItem";

export default function MessageList({
  messages,
  isTyping,
  username,
  flatListRef,
  onRetry, // PHASE 3.2: Callback pour retry
  keyboardHeight, // KEYBOARD FIX: Animated.Value pour ajuster le padding
}) {
  const [currentKeyboardHeight, setCurrentKeyboardHeight] = useState(0);

  // KEYBOARD FIX: Écouter les changements de keyboardHeight
  useEffect(() => {
    if (!keyboardHeight) return;

    const listenerId = keyboardHeight.addListener(({ value }) => {
      // value est négatif (translateY), donc on inverse pour avoir la hauteur réelle
      setCurrentKeyboardHeight(Math.abs(value));
    });

    return () => {
      keyboardHeight.removeListener(listenerId);
    };
  }, [keyboardHeight]);
  const { theme } = useAppTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        messagesContainer: {
          flex: 1,
        },
        emptyContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          maxWidth: 420,
          alignSelf: "center",
        },
        emptyText: {
          color: theme.text || chatColors.textPrimary,
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 6,
          textAlign: "center",
        },
        emptySubtext: {
          color: theme.textMuted || chatColors.textSecondary,
          fontSize: 14,
          textAlign: "center",
        },
      }),
    [theme]
  );

  // KEYBOARD FIX: Style dynamique pour le contentContainerStyle
  const messagesContentStyle = useMemo(
    () => ({
      paddingTop: 12,
      paddingBottom: 12 + currentKeyboardHeight,
    }),
    [currentKeyboardHeight]
  );

  // FI9_NAYEK: Filter out system/status messages (ChatGPT-style: only real messages)
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Exclude system messages and agent questions (UI-only indicators)
      if (msg.isSystem || msg.isAgentQuestions) {
        return false;
      }
      // Only include user and assistant messages
      return msg.role === "user" || msg.role === "assistant";
    });
  }, [messages]);

  const renderMessageItem = useCallback(
    ({ item, index }) => (
      <MessageItem 
        item={item} 
        index={index} 
        username={username}
        onRetry={onRetry} // PHASE 3.2
      />
    ),
    [username, onRetry]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t("emptyChat") || "Aucune conversation"}
        </Text>
        <Text style={styles.emptySubtext}>
          {t("emptySubtext") || "Commencez une nouvelle conversation"}
        </Text>
      </View>
    ),
    [styles, t]
  );

  return (
    <View style={styles.messagesContainer}>
      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        keyExtractor={keyExtractor}
        renderItem={renderMessageItem}
        contentContainerStyle={messagesContentStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
      {isTyping && <ChatTypingIndicator visible={true} />}
    </View>
  );
}


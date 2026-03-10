// FI9: Keyboard Safe Test Screen
// Standard chat layout pattern: SafeAreaView + KeyboardAvoidingView + FlatList + Input
// This is a test screen to validate the keyboard fix pattern

import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EnhancedMessageInput from "../components/EnhancedMessageInput";
import { useAppTheme } from "../context/AppThemeContext";
import { chatColors } from "../constants/colors";

export default function ChatScreenKeyboardSafe() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  const messages = [
    { id: "1", text: "Message test 1" },
    { id: "2", text: "Message test 2" },
    { id: "3", text: "Message test 3" },
    { id: "4", text: "Message test 4" },
    { id: "5", text: "Message test 5" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background || chatColors.background,
    },
    messageItem: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    messageText: {
      color: theme.text || chatColors.textPrimary,
      fontSize: 16,
    },
    inputContainer: {
      paddingBottom: insets.bottom || 8,
      backgroundColor: theme.background || chatColors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.messageItem}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 8 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputContainer}>
            <EnhancedMessageInput
              disabled={false}
              onSend={(text) => {
                console.log("[FI9] Test send:", text);
              }}
              placeholder="Message..."
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


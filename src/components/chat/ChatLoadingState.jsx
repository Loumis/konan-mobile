// PHASE 3.1: Extracted from ChatScreen.jsx
// ChatLoadingState - Écran de chargement initial

import React, { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../context/AppThemeContext";
import { chatColors } from "../../constants/colors";

export default function ChatLoadingState() {
  const { theme } = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: theme.background || chatColors.background,
        },
        loadingContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background || chatColors.background,
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    </SafeAreaView>
  );
}


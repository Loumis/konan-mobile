// PHASE 3.1: Extracted from ChatScreen.jsx
// ChatComposer - Container pour le composant Composer
// SPACING FIX: Passe keyboardHeight au Composer

import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme } from "../../context/AppThemeContext";
import { chatColors } from "../../constants/colors";
import Composer from "../Composer";

export default function ChatComposer({ disabled, onSend, onAttachmentPress, keyboardHeight }) {
  const { theme } = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        composerContainer: {
          backgroundColor: theme.background || chatColors.background,
          zIndex: 10,
          elevation: 6,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.composerContainer}>
      <Composer
        disabled={disabled}
        onSend={onSend}
        onAttachmentPress={onAttachmentPress}
        keyboardHeight={keyboardHeight}
      />
    </View>
  );
}


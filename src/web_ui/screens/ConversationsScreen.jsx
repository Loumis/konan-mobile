// LEGACY_FI9: fichier déplacé automatiquement, plus utilisé par l'app mobile
// FI9_NAYEK: Conversations Screen (version JSX)
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from '../theme/colors';

export default function ConversationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Conversations Screen (Legacy)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
});


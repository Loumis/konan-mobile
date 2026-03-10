// FI9_NAYEK v13: TTS Button pour messages assistant (UI only)
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/components/TTSButton.jsx");
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Alert, Text } from "react-native";

let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

export default function TTSButton({ text, onPress }) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/components/TTSButton.jsx");
  const [playing, setPlaying] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress(text);
    } else {
      // UI only - fallback
      Alert.alert("TTS", "Text-to-Speech (UI only)");
    }
    setPlaying(!playing);
  };

  return (
    <TouchableOpacity
      style={[styles.button, playing && styles.buttonActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {Ionicons ? (
        <Ionicons
          name={playing ? "volume-high" : "volume-low-outline"}
          size={16}
          color={playing ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
        />
      ) : (
        <Text style={styles.buttonText}>{playing ? "🔊" : "🔈"}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buttonActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  buttonText: {
    fontSize: 14,
  },
});


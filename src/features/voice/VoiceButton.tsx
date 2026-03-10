// FINAL CHAT EXPERIENCE: Voice Button Component
// Bouton micro avec appui long pour enregistrement vocal

import React, { useCallback } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  View,
} from "react-native";
import { useAppTheme } from "../../context/AppThemeContext";
import { chatColors } from "../../constants/colors";
import { useVoiceRecorder } from "./useVoiceRecorder";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceButton({ onTranscript, disabled = false }: VoiceButtonProps) {
  const { theme } = useAppTheme();
  const { state, startRecording, stopRecording, cancelRecording } = useVoiceRecorder();

  // Gestion appui long
  const handlePressIn = useCallback(async () => {
    if (disabled) return;
    await startRecording();
  }, [disabled, startRecording]);

  const handlePressOut = useCallback(async () => {
    if (disabled || !state.isRecording) return;
    
    const transcript = await stopRecording();
    if (transcript) {
      onTranscript(transcript);
    }
  }, [disabled, state.isRecording, stopRecording, onTranscript]);

  const styles = StyleSheet.create({
    button: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: state.isRecording 
        ? "rgba(239, 68, 68, 0.15)" // Rouge clair quand enregistrement
        : theme.surface || chatColors.surface,
      marginRight: 8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    icon: {
      fontSize: 20,
      color: state.isRecording 
        ? "#ef4444" // Rouge vif quand enregistrement
        : theme.text || chatColors.textPrimary,
    },
    recordingPulse: {
      position: "absolute",
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "#ef4444",
      opacity: 0.5,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, (disabled || state.isProcessing) && styles.buttonDisabled]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || state.isProcessing}
      activeOpacity={0.7}
    >
      {state.isProcessing ? (
        <ActivityIndicator size="small" color={theme.text || chatColors.textPrimary} />
      ) : (
        <>
          {state.isRecording && <View style={styles.recordingPulse} />}
          <Animated.Text style={styles.icon}>
            {state.isRecording ? "🎤" : "🎙️"}
          </Animated.Text>
        </>
      )}
    </TouchableOpacity>
  );
}


// FI9_UI_UPGRADE v15.0 - Voice Input Component
// Speech-to-text recording with STT backend integration
// Preserves all existing KONAN logic - UI only upgrade

import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { chatColors } from "../constants/colors";
import { API } from "../api/client";

// Icons
let MicIcon = null;
let MicOffIcon = null;
let StopIcon = null;
try {
  const lucide = require("lucide-react-native");
  if (lucide) {
    MicIcon = lucide.Mic;
    MicOffIcon = lucide.MicOff;
    StopIcon = lucide.Square;
  }
} catch (e) {
  // Fallback
}

let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

// Haptics
let Haptics = null;
try {
  Haptics = require("expo-haptics");
} catch (e) {
  Haptics = null;
}

const VoiceInput = memo(({
  onTextReceived,
  onError,
  disabled = false,
  style,
}) => {
  // ============================================
  // HOOKS
  // ============================================
  const { theme } = useAppTheme();

  // ============================================
  // STATE
  // ============================================
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // ============================================
  // REFS
  // ============================================
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const abortControllerRef = useRef(null);
  const timerRef = useRef(null);

  // ============================================
  // PERMISSIONS
  // ============================================
  const requestPermissions = useCallback(async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Permission microphone",
            message: "KONAN a besoin d'accéder au microphone pour la dictée vocale",
            buttonNeutral: "Plus tard",
            buttonNegative: "Refuser",
            buttonPositive: "Autoriser",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error("[FI9] Permission error:", err);
        return false;
      }
    } else if (Platform.OS === "ios") {
      // iOS permissions are handled automatically on first use
      return true;
    }
    return false;
  }, []);

  // ============================================
  // RECORDING
  // ============================================
  const startRecording = useCallback(async () => {
    if (disabled || isRecording) return;

    // Request permissions
    const hasPerm = await requestPermissions();
    if (!hasPerm) {
      Alert.alert(
        "Permission refusée",
        "L'accès au microphone est nécessaire pour la dictée vocale."
      );
      if (onError) onError("Permission refusée");
      return;
    }

    setHasPermission(true);

    try {
      // Check if getUserMedia is available
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create MediaRecorder
        if (typeof MediaRecorder !== "undefined") {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            // Convert chunks to blob
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            
            // Send to STT backend
            await sendToSTT(audioBlob);
            
            // Stop all tracks
            stream.getTracks().forEach((track) => track.stop());
          };

          mediaRecorder.start();
          setIsRecording(true);
          setRecordingTime(0);

          // Start timer
          timerRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
          }, 1000);

          // Haptic feedback
          if (Haptics && Platform.OS !== "web") {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (e) {
              // Ignore
            }
          }
        } else {
          throw new Error("MediaRecorder non disponible");
        }
      } else {
        // Fallback: Use native recording if available
        throw new Error("getUserMedia non disponible");
      }
    } catch (error) {
      console.error("[FI9] Recording start error:", error);
      setIsRecording(false);
      if (onError) {
        onError(error.message || "Erreur lors du démarrage de l'enregistrement");
      } else {
        Alert.alert("Erreur", "Impossible de démarrer l'enregistrement vocal.");
      }
    }
  }, [disabled, isRecording, requestPermissions, onError]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setRecordingTime(0);

    // Haptic feedback
    if (Haptics && Platform.OS !== "web") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        // Ignore
      }
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    stopRecording();
  }, [stopRecording]);

  // ============================================
  // STT BACKEND
  // ============================================
  const sendToSTT = useCallback(async (audioBlob) => {
    try {
      // Convert blob to base64 or FormData
      const formData = new FormData();
      formData.append("audio", {
        uri: audioBlob, // Note: May need adjustment for React Native
        type: "audio/webm",
        name: "recording.webm",
      });

      // Send to STT endpoint
      const response = await API.post("/api/stt/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const transcribedText = response.data?.text || response.data?.transcription || "";
      
      if (transcribedText && onTextReceived) {
        onTextReceived(transcribedText);
      } else if (onError) {
        onError("Aucun texte transcrit");
      }
    } catch (error) {
      console.error("[FI9] STT error:", error);
      
      // Fallback: Show error
      if (onError) {
        onError(error.message || "Erreur lors de la transcription");
      } else {
        Alert.alert("Erreur", "Impossible de transcrire l'audio.");
      }
    }
  }, [onTextReceived, onError]);

  // ============================================
  // CLEANUP
  // ============================================
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ============================================
  // STYLES
  // ============================================
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: "center",
          justifyContent: "center",
        },
        button: {
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isRecording
            ? theme.error || "#FF3B30"
            : theme.primary || chatColors.accent,
          alignItems: "center",
          justifyContent: "center",
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        buttonDisabled: {
          opacity: 0.5,
        },
        timerText: {
          marginTop: 8,
          fontSize: 12,
          color: theme.textMuted || chatColors.textMuted,
        },
      }),
    [theme, isRecording]
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={isRecording ? stopRecording : startRecording}
        onLongPress={isRecording ? cancelRecording : undefined}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {isRecording ? (
          StopIcon ? (
            <StopIcon size={24} color="#FFFFFF" strokeWidth={2} />
          ) : Ionicons ? (
            <Ionicons name="stop" size={24} color="#FFFFFF" />
          ) : (
            <Text style={{ fontSize: 20, color: "#FFFFFF" }}>⏹</Text>
          )
        ) : (
          MicIcon ? (
            <MicIcon size={24} color="#FFFFFF" strokeWidth={2} />
          ) : Ionicons ? (
            <Ionicons name="mic" size={24} color="#FFFFFF" />
          ) : (
            <Text style={{ fontSize: 20, color: "#FFFFFF" }}>🎤</Text>
          )
        )}
      </TouchableOpacity>

      {isRecording && recordingTime > 0 && (
        <Text style={styles.timerText}>
          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
        </Text>
      )}
    </View>
  );
});

VoiceInput.displayName = "VoiceInput";

export default VoiceInput;


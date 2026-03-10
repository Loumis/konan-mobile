// FINAL CHAT EXPERIENCE: Voice Recording Hook
// Utilise expo-av pour l'enregistrement vocal
// Simulation STT locale (placeholder pour future intégration)

import { useState, useCallback, useRef, useEffect } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";

export interface VoiceRecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

export interface UseVoiceRecorderReturn {
  state: VoiceRecorderState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  cancelRecording: () => Promise<void>;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isProcessing: false,
    error: null,
  });

  const recordingRef = useRef<Audio.Recording | null>(null);

  // Cleanup au démontage du composant
  useEffect(() => {
    return () => {
      // Cleanup de l'enregistrement en cours si le composant est démonté
      if (recordingRef.current) {
        recordingRef.current
          .stopAndUnloadAsync()
          .then(() => {
            console.log("[VOICE] Cleanup enregistrement au démontage");
          })
          .catch((err) => {
            console.error("[VOICE] Erreur cleanup:", err);
          });
      }
    };
  }, []);

  // Démarrer l'enregistrement
  const startRecording = useCallback(async () => {
    try {
      // PROTECTION: Ne pas démarrer si un enregistrement est déjà en cours
      if (recordingRef.current) {
        console.warn("[VOICE] Enregistrement déjà en cours, nettoyage...");
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch (e) {
          console.error("[VOICE] Erreur nettoyage enregistrement précédent:", e);
        }
        recordingRef.current = null;
      }

      console.log("[VOICE] Demande permission microphone...");
      
      // Demander permission microphone
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setState((prev) => ({
          ...prev,
          error: "Permission microphone refusée",
        }));
        return;
      }

      // Configuration audio pour l'enregistrement
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("[VOICE] Démarrage enregistrement...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setState({
        isRecording: true,
        isProcessing: false,
        error: null,
      });

      console.log("[VOICE] Enregistrement démarré");
    } catch (error) {
      console.error("[VOICE] Erreur startRecording:", error);
      setState({
        isRecording: false,
        isProcessing: false,
        error: "Impossible de démarrer l'enregistrement",
      });
    }
  }, []);

  // Arrêter l'enregistrement et simuler STT
  const stopRecording = useCallback(async (): Promise<string | null> => {
    try {
      if (!recordingRef.current) {
        console.warn("[VOICE] Aucun enregistrement actif");
        setState({
          isRecording: false,
          isProcessing: false,
          error: null,
        });
        return null;
      }

      console.log("[VOICE] Arrêt enregistrement...");
      setState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: true,
      }));

      // Sauvegarder la référence avant de nettoyer
      const recording = recordingRef.current;
      
      try {
        await recording.stopAndUnloadAsync();
      } catch (stopError) {
        console.warn("[VOICE] Erreur stopAndUnloadAsync (ignorée):", stopError);
      }

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      } catch (audioError) {
        console.warn("[VOICE] Erreur setAudioModeAsync (ignorée):", audioError);
      }

      const uri = recording.getURI();
      console.log("[VOICE] Enregistrement sauvegardé:", uri);

      // IMPORTANT: Nettoyer la référence AVANT le traitement STT
      recordingRef.current = null;

      // SIMULATION STT (placeholder pour future intégration)
      // Dans une vraie implémentation, ici on enverrait l'audio à un service STT
      // (Google Cloud Speech-to-Text, Whisper API, etc.)
      
      console.log("[VOICE] Simulation STT...");
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simule latence réseau

      // Texte placeholder basé sur la plateforme
      const simulatedText = Platform.OS === "ios"
        ? "Message vocal simulé iOS"
        : "Message vocal simulé Android";

      console.log("[VOICE] STT simulé:", simulatedText);

      setState({
        isRecording: false,
        isProcessing: false,
        error: null,
      });

      return simulatedText;
    } catch (error) {
      console.error("[VOICE] Erreur stopRecording:", error);
      
      // CRITIQUE: Nettoyer la référence même en cas d'erreur
      recordingRef.current = null;
      
      setState({
        isRecording: false,
        isProcessing: false,
        error: "Erreur lors du traitement vocal",
      });
      return null;
    }
  }, []);

  // Annuler l'enregistrement
  const cancelRecording = useCallback(async () => {
    try {
      if (!recordingRef.current) {
        console.log("[VOICE] Aucun enregistrement à annuler");
        return;
      }

      console.log("[VOICE] Annulation enregistrement...");
      
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (stopError) {
        console.warn("[VOICE] Erreur lors de l'arrêt (ignorée):", stopError);
      }

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      } catch (audioError) {
        console.warn("[VOICE] Erreur réinitialisation audio (ignorée):", audioError);
      }

      recordingRef.current = null;

      setState({
        isRecording: false,
        isProcessing: false,
        error: null,
      });

      console.log("[VOICE] Enregistrement annulé");
    } catch (error) {
      console.error("[VOICE] Erreur cancelRecording:", error);
      // Forcer le reset même en cas d'erreur
      recordingRef.current = null;
      setState({
        isRecording: false,
        isProcessing: false,
        error: null,
      });
    }
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}


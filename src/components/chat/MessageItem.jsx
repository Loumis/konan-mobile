// PHASE 3.1 + 3.2: Extracted from ChatScreen.jsx
// MessageItem - Wrapper pour AnimatedMessageBubble avec statuts (sending/error/sent)

import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAppTheme } from "../../context/AppThemeContext";
import { chatColors } from "../../constants/colors";
import { API } from "../../api/client";
import AnimatedMessageBubble from "../AnimatedMessageBubble";

export default function MessageItem({ 
  item, 
  index, 
  username,
  onRetry, // PHASE 3.2: Callback pour retry
}) {
  const { theme } = useAppTheme();

  // PHASE 3.2: Déterminer le statut du message
  const status = item.status || "sent"; // "sending" | "sent" | "error"
  const isUserMessage = item.role === "user";
  const hasFingerprint = !isUserMessage && !!item?.response_fingerprint;
  const fingerprint = hasFingerprint ? String(item.response_fingerprint) : "";
  const shortFingerprint =
    fingerprint && fingerprint.length > 12 ? `${fingerprint.slice(0, 10)}…` : fingerprint;

  const [copyState, setCopyState] = useState("idle"); // idle | copied
  const copyTimerRef = useRef(null);

  const [verifyState, setVerifyState] = useState("idle"); // idle | loading | valid | invalid | not_found | error
  const [verifyError, setVerifyError] = useState("");
  const [proofOpen, setProofOpen] = useState(false);
  const [verifyPayload, setVerifyPayload] = useState(null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false); // State for expandable sources

  const clearCopyTimer = useCallback(() => {
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = null;
    }
  }, []);

  const onCopyFingerprint = useCallback(async () => {
    if (!fingerprint) return;
    try {
      await Clipboard.setStringAsync(fingerprint);
      setCopyState("copied");
      clearCopyTimer();
      copyTimerRef.current = setTimeout(() => setCopyState("idle"), 1200);
    } catch {
      // silent
    }
  }, [fingerprint, clearCopyTimer]);

  const onVerify = useCallback(async () => {
    if (!fingerprint || verifyState === "loading") return;
    setVerifyError("");
    setVerifyState("loading");
    setProofOpen(true);
    try {
      const res = await API.get(`/api/v1/verify/${encodeURIComponent(fingerprint)}`);
      const raw = res?.data || {};
      setVerifyPayload(raw);
      const statusValue = String(raw?.status || raw?.result || raw?.state || "").toLowerCase();

      if (statusValue === "valid") setVerifyState("valid");
      else if (statusValue === "invalid") setVerifyState("invalid");
      else if (statusValue === "not_found" || statusValue === "notfound") setVerifyState("not_found");
      else if (statusValue === "refused" || statusValue === "refusal") setVerifyState("not_found");
      else {
        setVerifyState("error");
        setVerifyError("Vérification indisponible.");
      }
    } catch {
      setVerifyState("error");
      setVerifyError("Erreur réseau.");
    }
  }, [fingerprint, verifyState]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: "relative",
        },
        statusContainer: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: isUserMessage ? "flex-end" : "flex-start",
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 8,
          gap: 8,
        },
        statusText: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
        },
        errorText: {
          fontSize: 12,
          color: "#EF4444",
          fontWeight: "500",
        },
        retryButton: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: theme.surface || chatColors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#EF4444",
        },
        retryButtonText: {
          fontSize: 12,
          color: "#EF4444",
          fontWeight: "600",
        },
        fingerprintRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 2,
          paddingBottom: 6,
        },
        signatureText: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
          fontWeight: "500",
        },
        signatureCopied: {
          fontSize: 12,
          color: "#16A34A",
          fontWeight: "700",
        },
        verifyButton: {
          paddingVertical: 2,
          paddingHorizontal: 4,
        },
        verifyButtonText: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
          fontWeight: "700",
          textDecorationLine: "underline",
        },
        verifyStatusRow: {
          paddingHorizontal: 16,
          paddingTop: 0,
          paddingBottom: 8,
        },
        verifyStatusText: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
          fontWeight: "600",
        },
        verifyOk: { color: "#16A34A" },
        verifyBad: { color: "#DC2626" },
        verifyNeutral: { color: theme.textMuted || chatColors.textSecondary },
        proofCard: {
          marginHorizontal: 16,
          marginBottom: 10,
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border || chatColors.border,
          backgroundColor: theme.surface || chatColors.surface,
        },
        proofTitle: {
          fontSize: 13,
          fontWeight: "700",
          color: theme.text || chatColors.textPrimary,
          marginBottom: 8,
        },
        proofRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 6,
        },
        proofLabel: {
          fontSize: 12,
          fontWeight: "700",
          color: theme.textMuted || chatColors.textSecondary,
        },
        proofValue: {
          fontSize: 12,
          fontWeight: "600",
          color: theme.text || chatColors.textPrimary,
          flexShrink: 1,
          textAlign: "right",
        },
        proofSmall: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
          fontWeight: "600",
        },
        proofAction: {
          paddingVertical: 2,
          paddingHorizontal: 4,
        },
        proofActionText: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
          fontWeight: "700",
          textDecorationLine: "underline",
        },
        sourcesTitle: {
          marginTop: 6,
          marginBottom: 4,
          fontSize: 12,
          fontWeight: "700",
          color: theme.textMuted || chatColors.textSecondary,
        },
        sourceItem: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
          marginBottom: 2,
        },
        sourceButton: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginTop: 8,
          marginHorizontal: 16,
          alignSelf: "flex-start",
        },
        sourceButtonText: {
          fontSize: 13,
          fontWeight: "600",
          color: theme.primary || chatColors.primary || "#007AFF",
          textDecorationLine: "underline",
        },
        citationContainer: {
          paddingTop: 12,
          paddingBottom: 8,
          marginTop: 8,
          marginHorizontal: 16,
          borderTopWidth: 1,
          borderTopColor: theme.border || chatColors.border,
          backgroundColor: theme.surface || chatColors.surface,
          borderRadius: 8,
          paddingHorizontal: 12,
        },
        citationTitle: {
          fontSize: 12,
          fontWeight: "700",
          color: theme.textMuted || chatColors.textSecondary,
          marginBottom: 8,
        },
        citationText: {
          fontSize: 12,
          color: theme.text || chatColors.textPrimary,
          lineHeight: 18,
        },
      }),
    [theme, isUserMessage]
  );

  // FI9_NAYEK: Use reply field (pure conversational text) and citation_block separately
  // Backend returns: { reply, citation_block, fi9_proof, fi9 }
  // Only reply is rendered in bubble, citations/proof below
  const mainText = useMemo(() => {
    // Use reply field if available (from backend), otherwise fallback to content
    return item.reply || item.content || "";
  }, [item.reply, item.content]);
  
  const citationText = useMemo(() => {
    // Citation block is stored separately (not in content)
    return item.citation_block || "";
  }, [item.citation_block]);

  return (
    <View style={styles.container}>
      <AnimatedMessageBubble
        role={item.role}
        content={mainText}
        username={item.role === "user" ? username : undefined}
        onTTS={undefined}
        index={index}
      />
      
      {/* FI9_NAYEK: Sources displayed on-demand (ChatGPT-style expandable) */}
      {/* Show "Source" button when citations exist, expand on click */}
      {citationText && item.role === "assistant" && (
        <>
          <TouchableOpacity
            style={styles.sourceButton}
            activeOpacity={0.7}
            onPress={() => setSourcesExpanded(!sourcesExpanded)}
          >
            <Text style={styles.sourceButtonText}>
              {sourcesExpanded ? "Masquer les sources" : "Source"}
            </Text>
          </TouchableOpacity>
          
          {sourcesExpanded && (
            <View style={styles.citationContainer}>
              <Text style={styles.citationTitle}>Sources</Text>
              <Text style={styles.citationText}>{citationText}</Text>
            </View>
          )}
        </>
      )}
      
      {/* FI9_NAYEK: Signature/fingerprint verification hidden from UI */}
      {/* Backend functionality remains fully active for audit and inspector logs */}
      {/* Technical elements (signatures, hashes, fingerprints) are not displayed to end users */}
      
      {/* PHASE 3.2: Indicateurs de statut (uniquement messages user) */}
      {isUserMessage && status !== "sent" && (
        <View style={styles.statusContainer}>
          {status === "sending" && (
            <>
              <ActivityIndicator size="small" color={theme.textMuted || chatColors.textSecondary} />
              <Text style={styles.statusText}>Envoi en cours...</Text>
            </>
          )}
          
          {status === "error" && (
            <>
              <Text style={styles.errorText}>⚠ Échec de l'envoi</Text>
              {onRetry && (
                <TouchableOpacity 
                  style={styles.retryButton} 
                  onPress={() => onRetry(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryButtonText}>Réessayer</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}

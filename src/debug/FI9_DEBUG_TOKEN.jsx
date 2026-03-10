// FI9_NAYEK: LEGACY UI COMPONENT - not used in current mobile flow (DEBUG ONLY)
// FI9_NAYEK: Composant de debug pour diagnostiquer les problèmes de token JWT
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { FI9_FORCE_LOGOUT } from "../utils/FI9_FORCE_LOGOUT";
import AsyncStorage from "@react-native-async-storage/async-storage";

function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1] || "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      normalized.length % 4 === 0
        ? normalized
        : normalized.padEnd(normalized.length + (4 - (normalized.length % 4)), "=");
    const decoded =
      typeof globalThis.atob === "function"
        ? globalThis.atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch (error) {
    return { error: `Erreur décodage: ${error.message}` };
  }
}

export default function FI9_DEBUG_TOKEN() {
  const { token, user, status, logout } = useAuth();
  const [meResponse, setMeResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShowToken = async () => {
    const decoded = decodeJwtPayload(token);
    
    // FI9_NAYEK: Vérifier aussi le storage
    const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    // FI9_NAYEK: Utiliser l'utilitaire unifié pour récupérer le token
    const { getToken } = await import("../utils/token");
    const storedToken = await getToken();
    
    const message = 
      `Token depuis AuthContext: ${token ? token.substring(0, 50) + "..." : "NULL"}\n\n` +
      `Token depuis Storage: ${storedToken ? storedToken.substring(0, 50) + "..." : "NULL"}\n\n` +
      `Tokens identiques: ${token === storedToken ? "✅ OUI" : "❌ NON"}\n\n` +
      `Payload décodé:\n${JSON.stringify(decoded, null, 2)}\n\n` +
      `User depuis AuthContext:\n${JSON.stringify(user, null, 2)}`;
    
    Alert.alert("Token JWT Actuel", message, [{ text: "OK" }]);
    console.log("[FI9] DEBUG_TOKEN - Token complet:", token);
    console.log("[FI9] DEBUG_TOKEN - Token depuis storage:", storedToken);
    console.log("[FI9] DEBUG_TOKEN - Tokens identiques:", token === storedToken);
    console.log("[FI9] DEBUG_TOKEN - Payload:", decoded);
    console.log("[FI9] DEBUG_TOKEN - User:", user);
  };

  const handleForceLogout = async () => {
    try {
      await FI9_FORCE_LOGOUT();
      await logout();
      Alert.alert("✅", "Déconnexion forcée effectuée. Tous les tokens ont été supprimés.");
    } catch (error) {
      Alert.alert("❌ Erreur", `Erreur lors de la déconnexion: ${error.message}`);
    }
  };

  const handleCheckMe = async () => {
    if (!token) {
      Alert.alert("❌", "Aucun token disponible");
      return;
    }

    setLoading(true);
    setMeResponse(null);

    try {
      // FI9_NAYEK: Utilise le client API (interceptor Bearer automatique)
      // Le token est ajouté automatiquement par l'interceptor
      console.log("[FI9] Calling /api/auth/me via API client - token injected");
      const { API } = await import("../api/client");
      const response = await API.get("/api/auth/me");
      
      setMeResponse({ success: true, data: response.data });
      Alert.alert("✅ Succès", `Réponse /api/auth/me:\n${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      const errorData = error?.response?.data || error?.message || "Erreur inconnue";
      setMeResponse({ success: false, error: errorData });
      Alert.alert("❌ Erreur", `Status: ${error?.response?.status || "Unknown"}\n${JSON.stringify(errorData, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const decoded = decodeJwtPayload(token);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 FI9 Debug Token</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Status Auth:</Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Token présent:</Text>
        <Text style={styles.value}>{token ? "✅ OUI" : "❌ NON"}</Text>
      </View>

      {token && (
        <View style={styles.section}>
          <Text style={styles.label}>Token (preview):</Text>
          <Text style={styles.code}>{token.substring(0, 50)}...</Text>
        </View>
      )}

      {decoded && (
        <View style={styles.section}>
          <Text style={styles.label}>Payload JWT décodé:</Text>
          <Text style={styles.code}>{JSON.stringify(decoded, null, 2)}</Text>
        </View>
      )}

      {user && (
        <View style={styles.section}>
          <Text style={styles.label}>User depuis AuthContext:</Text>
          <Text style={styles.code}>{JSON.stringify(user, null, 2)}</Text>
        </View>
      )}

      {meResponse && (
        <View style={styles.section}>
          <Text style={styles.label}>Réponse /api/auth/me:</Text>
          <Text style={[styles.code, meResponse.success ? styles.success : styles.error]}>
            {JSON.stringify(meResponse, null, 2)}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="📋 Show Current Token" onPress={handleShowToken} />
        <View style={styles.spacer} />
        <Button title="🚪 Force Logout" onPress={handleForceLogout} color="#EF4444" />
        <View style={styles.spacer} />
        <Button 
          title="🔍 Check /api/auth/me" 
          onPress={handleCheckMe} 
          disabled={!token || loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0B0B0B",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#93C5FD",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  code: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#EDEDED",
    backgroundColor: "#111111",
    padding: 8,
    borderRadius: 4,
  },
  success: {
    color: "#22C55E",
  },
  error: {
    color: "#EF4444",
  },
  buttonContainer: {
    marginTop: 20,
  },
  spacer: {
    height: 12,
  },
});


// FI9_NAYEK v13: ChatScreen complet avec persistance, sessions, TTS, et language selector
// FI9_NAYEK v14: ChatScreen ChatGPT-style complet avec gestion clavier dynamique + auto-scroll amélioré
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/screens/ChatScreen.jsx");
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";
import { sendMessage } from "../services/ChatService";
import AnimatedMessageBubble from "../components/AnimatedMessageBubble";
import Composer from "../components/Composer";
import ChatTypingIndicator from "../components/ChatTypingIndicator";
import ChatSidebar from "../components/ChatSidebar";
import ChatAttachmentBar from "../components/ChatAttachmentBar";
import LanguageSelector from "../components/LanguageSelector";
import ThemeSelector from "../components/ThemeSelector";
import { useLanguage } from "../context/LanguageContext";
import { useAppTheme } from "../context/AppThemeContext";
import {
  saveSession,
  getSessions,
  deleteSession,
  saveMessages,
  getMessages,
  saveCurrentSession,
  getCurrentSession,
  createNewSession,
} from "../utils/chatStorage";

let Ionicons = null;
try {
  const vectorIcons = require("@expo/vector-icons");
  if (vectorIcons && vectorIcons.Ionicons) {
    Ionicons = vectorIcons.Ionicons;
  }
} catch (e) {
  Ionicons = null;
}

// FI9_NAYEK v14: LayoutAnimation removed per Android requirements

export default function ChatScreen({ navigation }) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/screens/ChatScreen.jsx");
  const { token, user, logout, status } = useAuth();
  const { t } = useLanguage();
  const { theme } = useAppTheme();
  // FI9_NAYEK v14 FIX: keyboardHeight retiré - paddingBottom fixe dans FlatList
  
  // Create styles with theme
  const styles = React.useMemo(() => StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    topbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
      gap: 12,
    },
    menuButton: {
      padding: 4,
    },
    menuButtonText: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "300",
    },
    logoutText: {
      color: theme.text,
      fontWeight: "600",
      fontSize: 13,
    },
    topbarTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "600",
      letterSpacing: 0.5,
      flex: 1,
    },
    topbarRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    userLabel: {
      color: theme.textMuted,
      fontSize: 13,
      maxWidth: 80,
    },
    logoutButton: {
      padding: 8,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.12)",
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
    },
    logoutText: {
      color: theme.text,
      fontWeight: "600",
      fontSize: 13,
    },
    messageListContainer: {
      paddingTop: 20,
      paddingBottom: 20,
    },
    emptyListContainer: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
    },
    emptyText: {
      color: theme.textMuted,
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 8,
      textAlign: "center",
    },
    emptySubtext: {
      color: theme.textMuted,
      fontSize: 14,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
    },
  }), [theme]);
  
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [attachmentBarVisible, setAttachmentBarVisible] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const flatListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  
  // FI9_NAYEK v14 FIX: Cleanup scrollTimeoutRef pour éviter fuites mémoire
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  // FI9_NAYEK v14: Fonction auto-scroll ChatGPT améliorée (dédupliquée)
  const scrollToEnd = useCallback((animated = true) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 100);
  }, []);

  // FI9_NAYEK v13: Extract username from user (email/name/username, not id/sub)
  const username = user?.name || user?.full_name || user?.username || user?.email?.split("@")[0] || user?.email || user?.sub || "User";
  const userEmail = user?.email || user?.sub || "";

  // Load chat history and sessions on mount
  useEffect(() => {
    if (status === "authenticated") {
      loadChatData();
    }
  }, [status]);

  // FI9_NAYEK v13: Save messages whenever they change (persist ALL messages)
  useEffect(() => {
    if (currentSessionId && messages.length > 0 && !loadingHistory) {
      // Filter out pending messages before saving
      const messagesToSave = messages.filter((msg) => !msg.pending);
      if (messagesToSave.length > 0) {
        saveMessages(currentSessionId, messagesToSave);
        updateSessionLastMessage();
      }
    }
  }, [messages, currentSessionId, loadingHistory]);

  const loadChatData = async () => {
    try {
      setLoadingHistory(true);
      
      // Load sessions
      const loadedSessions = await getSessions();
      setSessions(loadedSessions);

      // FI9_NAYEK v14 ANDROID FIX: Ne charger les messages qu'une seule fois au mount initial
      // Utiliser un flag pour éviter les rechargements multiples
      let sessionIdToLoad = null;

      // Load current session
      const savedSessionId = await getCurrentSession();
      if (savedSessionId) {
        const session = loadedSessions.find((s) => s.id === savedSessionId);
        if (session) {
          sessionIdToLoad = savedSessionId;
          setCurrentSessionId(savedSessionId);
          await saveCurrentSession(savedSessionId);
        }
      } else if (loadedSessions.length > 0) {
        // Load first session if no current session
        const firstSession = loadedSessions[0];
        sessionIdToLoad = firstSession.id;
        setCurrentSessionId(firstSession.id);
        await saveCurrentSession(firstSession.id);
      }

      // FI9_NAYEK v14 ANDROID FIX: Charger les messages une seule fois, de manière atomique
      if (sessionIdToLoad) {
        const stored = await getMessages(sessionIdToLoad);
        if (stored && Array.isArray(stored) && stored.length > 0) {
          // Au mount initial, messages est toujours vide, donc on peut charger directement
          console.log(`[FI9] Restauration ${stored.length} messages depuis storage (session: ${sessionIdToLoad})`);
          setMessages(stored);
        } else {
          // Session vide, initialiser avec tableau vide
          setMessages([]);
        }
      } else {
        // Aucune session, initialiser avec tableau vide
        setMessages([]);
      }
    } catch (error) {
      console.error("[FI9] Erreur chargement chat data:", error);
      // En cas d'erreur, initialiser avec tableau vide pour éviter un état incohérent
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const updateSessionLastMessage = async () => {
    if (!currentSessionId) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      const session = sessions.find((s) => s.id === currentSessionId);
      if (session) {
        await saveSession({
          ...session,
          updatedAt: Date.now(),
          lastMessage: lastMessage.content.substring(0, 50),
        });
        // Reload sessions
        const updatedSessions = await getSessions();
        setSessions(updatedSessions);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      navigation.replace("Login");
    }
  }, [status, navigation]);

  // FI9_NAYEK v14 FIX: Auto-scroll stable - un seul useEffect, pas de LayoutAnimation
  // IMPORTANT: Ce useEffect ne contient AUCUN setMessages() - uniquement scroll
  useEffect(() => {
    if (messages.length > 0 && !loadingHistory) {
      scrollToEnd(true);
    }
  }, [messages.length, loadingHistory, scrollToEnd]);

  const handleSend = async (text) => {
    if (!token) {
      console.warn("[FI9] ChatScreen handleSend - Token manquant, redirection vers Login");
      Alert.alert("Session", "Veuillez vous reconnecter");
      navigation.replace("Login");
      return;
    }

    // Create session if needed
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = await createNewSession(text.substring(0, 30));
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
      const updatedSessions = await getSessions();
      setSessions(updatedSessions);
    }

    // TASK A: Ajouter message optimiste SANS écraser l'historique
    const optimistic = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
      pending: true,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setBusy(true);
    
    // FI9_NAYEK v14: Auto-scroll immédiat après message utilisateur
    scrollToEnd(true);

    try {
      const nextMessages = await sendMessage(text, token, sessionId);
      
      // FI9_NAYEK v13 TASK A: Préserver TOUT l'historique - merge intelligent SANS écrasement
      setMessages((prev) => {
        // Garder tous les messages existants (sauf pending)
        const history = prev.filter((msg) => !msg.pending);
        
        if (!Array.isArray(nextMessages) || nextMessages.length === 0) {
          return history;
        }

        // TASK A: Toujours merger, jamais remplacer complètement
        // Créer une map pour éviter les doublons
        const existingById = new Map(history.map((msg) => [msg.id, msg]));
        const merged = [...history];

        // Ajouter/mettre à jour les messages du backend
        nextMessages.forEach((msg) => {
          if (existingById.has(msg.id)) {
            // Mettre à jour message existant
            const index = merged.findIndex((item) => item.id === msg.id);
            if (index >= 0) {
              merged[index] = { ...merged[index], ...msg };
            }
          } else {
            // Ajouter nouveau message (pas de doublon)
            merged.push(msg);
          }
        });

        // TASK A: Sauvegarder TOUT l'historique (toujours le tableau complet)
        if (sessionId && merged.length > 0) {
          saveMessages(sessionId, merged).catch((err) => {
            console.error("[FI9] Erreur sauvegarde messages:", err);
          });
        }

        return merged;
      });
    } catch (error) {
      const errorMessage = {
        id: `${Date.now()}-error`,
        role: "assistant",
        content: `Erreur: ${error?.message || "échec de la requête"}`,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => {
        const updated = [...prev.filter((msg) => !msg.pending), errorMessage];
        
        // FI9_NAYEK v13: Sauvegarder même en cas d'erreur
        if (sessionId && updated.length > 0) {
          saveMessages(sessionId, updated).catch((err) => {
            console.error("[FI9] Erreur sauvegarde après erreur:", err);
          });
        }
        
        return updated;
      });
    } finally {
      setBusy(false);
    }
  };

  const handleTTS = (text) => {
    // UI only - TTS implementation can be added later
    console.log("[FI9] TTS requested for:", text.substring(0, 50));
    // TODO: Integrate with TTS library if available
  };

  // FI9_NAYEK v14: renderMessage mémorisé pour éviter rerenders inutiles
  const renderMessage = useCallback(({ item, index }) => (
    <AnimatedMessageBubble 
      role={item.role} 
      content={item.content}
      username={item.role === "user" ? username : undefined}
      onTTS={handleTTS}
      index={index}
    />
  ), [username, handleTTS]);

  const handleNewChat = async () => {
    const newSession = await createNewSession();
    setCurrentSessionId(newSession.id);
    setMessages([]);
    const updatedSessions = await getSessions();
    setSessions(updatedSessions);
    setSidebarVisible(false);
  };

  const handleSelectSession = async (sessionId) => {
    // FI9_NAYEK v14 FIX: Si on clique sur la session déjà active, ne rien faire
    if (sessionId === currentSessionId) {
      setSidebarVisible(false);
      return;
    }

    // FI9_NAYEK v14 ANDROID FIX: Sauvegarder les messages de la session actuelle avant de changer
    if (currentSessionId && messages.length > 0) {
      const messagesToSave = messages.filter((msg) => !msg.pending);
      if (messagesToSave.length > 0) {
        await saveMessages(currentSessionId, messagesToSave);
      }
    }

    await saveCurrentSession(sessionId);
    setCurrentSessionId(sessionId);

    // FI9_NAYEK v14 ANDROID FIX: Charger les messages de la nouvelle session de manière sûre
    const sessionMessages = await getMessages(sessionId);
    
    // Utiliser setMessages avec fonction pour garantir la cohérence
    setMessages((prev) => {
      // Si on change de session, on remplace complètement (pas de merge)
      if (sessionMessages && Array.isArray(sessionMessages) && sessionMessages.length > 0) {
        console.log(`[FI9] Session ${sessionId} chargée: ${sessionMessages.length} messages`);
        return sessionMessages;
      }
      // Nouvelle session ou aucune donnée
      console.log(`[FI9] Session ${sessionId} vide, initialisation`);
      return [];
    });

    setSidebarVisible(false);
  };

  const handleImagePress = () => {
    Alert.alert(t("image"), "Image selection (UI only)");
    setAttachmentBarVisible(false);
  };

  const handleFilePress = () => {
    Alert.alert(t("file"), "File selection (UI only)");
    setAttachmentBarVisible(false);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t("emptyChat")}</Text>
      <Text style={styles.emptySubtext}>{t("emptySubtext")}</Text>
    </View>
  );

  // FI9_NAYEK v14 ANDROID FIX: Extraire le contenu du chat pour éviter la duplication iOS/Android
  const ChatContent = () => (
    <View style={{ flex: 1 }}>
      {/* Sidebar */}
      <ChatSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        sessions={sessions}
        activeSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />

      {/* Header */}
      <View style={styles.topbar}>
        <TouchableOpacity 
          onPress={() => setSidebarVisible(true)}
          style={styles.menuButton}
          activeOpacity={0.7}
          accessibilityLabel="Ouvrir le menu des conversations"
          accessibilityRole="button"
        >
          {Ionicons ? (
            <Ionicons name="menu" size={24} color={theme.text} />
          ) : (
            <Text style={styles.menuButtonText}>☰</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{t("title")}</Text>
        <View style={styles.topbarRight}>
          <Text style={styles.userLabel} numberOfLines={1}>
            {username}
          </Text>
          <LanguageSelector />
          <ThemeSelector />
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await logout();
              navigation.replace("Login");
            }}
            activeOpacity={0.85}
            accessibilityLabel="Se déconnecter"
            accessibilityRole="button"
          >
            {Ionicons ? (
              <Ionicons name="log-out-outline" size={18} color={theme.text} />
            ) : (
              <Text style={[styles.logoutText, { color: theme.text }]}>{t("logout")}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {status === "loading" ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.text} size="large" />
        </View>
      ) : (
        <>
          {/* Messages avec FlatList - ChatGPT style avec padding bottom fixe pour Android */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={
              messages.length === 0 
                ? styles.emptyListContainer 
                : [styles.messageListContainer, { paddingBottom: 120 }]
            }
            ListEmptyComponent={renderEmpty}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
          />

          {/* Typing Indicator */}
          {busy && <ChatTypingIndicator visible={true} />}

          {/* Attachment Bar */}
          <ChatAttachmentBar
            visible={attachmentBarVisible}
            onImagePress={handleImagePress}
            onFilePress={handleFilePress}
          />

          {/* Composer fixé en bas avec position absolute (ChatGPT style) */}
          {/* FI9_NAYEK v14 ANDROID FIX: Android adjustResize gère automatiquement le clavier */}
          <Composer 
            onSend={handleSend} 
            disabled={busy || status !== "authenticated"}
            onAttachmentPress={() => setAttachmentBarVisible(!attachmentBarVisible)}
          />
        </>
      )}
    </View>
  );

  return (
    <>
      {/* FI9-NAYEK FIX A: afficher un vrai écran de chargement tant que l'historique n'est pas prêt */}
      {loadingHistory && (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.text} />
        </SafeAreaView>
      )}

      {!loadingHistory && (
        <SafeAreaView style={styles.safe} edges={["top"]}>
          {/* FI9_NAYEK v14 ANDROID FIX: Android uses adjustResize, no KeyboardAvoidingView needed */}
          {/* iOS needs KeyboardAvoidingView, Android doesn't */}
          {Platform.OS === "ios" ? (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior="padding"
              keyboardVerticalOffset={90}
            >
              <ChatContent />
            </KeyboardAvoidingView>
          ) : (
            <ChatContent />
          )}
        </SafeAreaView>
      )}
    </>
  );
}


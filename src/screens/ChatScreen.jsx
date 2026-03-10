// FI9_PATCH v14.0 + PHASE 3.1 - ChatGPT Mobile 2025 UI
// ChatScreen.jsx - Orchestration principale (composants extraits vers /components/chat)
// Preserves ALL KONAN logic (hooks, callbacks, services, storage)

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { chatColors } from "../constants/colors";
import { useAgentLogic } from "../features/agent";

import { sendMessage } from "../services/ChatService";
import ChatSidebarModal from "../components/ChatSidebarModal";
import FI9_AttachmentsSheet from "../components/FI9_AttachmentsSheet";

// PHASE 3.1: Sous-composants extraits
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatComposer from "../components/chat/ChatComposer";
import ChatLoadingState from "../components/chat/ChatLoadingState";

import {
  getSessions,
  getMessages,
  saveMessages,
  saveCurrentSession,
  getCurrentSession,
  createNewSession,
  renameSession, // PHASE 3.3
  deleteSession, // PHASE 3.3
  generateChatTitle, // PHASE 3.5
  saveSession, // PHASE 3.5
} from "../utils/chatStorage";

export default function ChatScreen() {
  // ============================================
  // 1. CONTEXT HOOKS (toujours en premier, ordre fixe)
  // ============================================
  const { theme } = useAppTheme();
  const { t } = useLanguage();
  const { user, status, logout, token } = useAuth();
  const navigation = useNavigation();
  const { 
    analyzeUserMessage, 
    formatKonanMessage, 
    formatUserMessageWithLanguage,
    getCurrentRole, 
    resetAgent, 
    forceReadyToAnswer,
    currentRole,
    agentState,
    userLanguage,
  } = useAgentLogic();

  // ============================================
  // 2. STATE HOOKS (tous les useState)
  // ============================================
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isAttachmentsSheetVisible, setIsAttachmentsSheetVisible] = useState(false);

  // ============================================
  // 3. REF HOOKS (tous les useRef)
  // ============================================
  const flatListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  
  // KEYBOARD FIX: Animated value pour translateY du composer
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  // ============================================
  // 4. MEMO HOOKS (useMemo)
  // ============================================
  const username = useMemo(
    () =>
      user?.name ||
      user?.full_name ||
      user?.username ||
      user?.email?.split("@")[0] ||
      user?.email ||
      "User",
    [user]
  );

  const planLabel = useMemo(() => {
    const planRaw = user?.plan || user?.subscription || "free";
    return planRaw?.toLowerCase() === "legal+"
      ? "Legal+"
      : planRaw?.toLowerCase() === "pro"
      ? "Pro"
      : "Free";
  }, [user]);

  // PHASE 3.1: Styles simplifiés (layouts uniquement)
  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: theme.background || chatColors.background,
        },
        container: {
          flex: 1,
          backgroundColor: theme.background || chatColors.background,
          width: "100%",
          height: "100%",
        },
        mainColumn: {
          flex: 1,
          flexDirection: "column",
          backgroundColor: theme.background || chatColors.background || "#111",
        },
      }),
    [theme]
  );

  // ============================================
  // 5. EFFECT HOOKS (tous les useEffect)
  // ============================================
  // KEYBOARD FIX: Gestion centrale du clavier avec listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        const height = event.endCoordinates.height;
        Animated.spring(keyboardHeight, {
          toValue: -height,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.spring(keyboardHeight, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [keyboardHeight]);

  // Cleanup scrollTimeoutRef
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Redirection si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }, [status, navigation]);

  // Initialisation : dernière session + messages
  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      try {
        // Charger toutes les sessions
        const loadedSessions = await getSessions();
        if (!isMounted) return;
        setSessions(loadedSessions);

        // Charger la session courante
        const lastSessionId = await getCurrentSession();
        let sessionIdToLoad = null;

        if (lastSessionId) {
          const session = loadedSessions.find((s) => s.id === lastSessionId);
          if (session) {
            sessionIdToLoad = lastSessionId;
          }
        } else if (loadedSessions.length > 0) {
          sessionIdToLoad = loadedSessions[0].id;
        }

        if (sessionIdToLoad) {
          const storedMessages = await getMessages(sessionIdToLoad);
          if (!isMounted) return;
          setCurrentSessionId(sessionIdToLoad);
          setMessages(storedMessages || []);
          await saveCurrentSession(sessionIdToLoad);
        } else {
          // Créer une nouvelle session si aucune n'existe
          const newSession = await createNewSession();
          if (!isMounted) return;
          setCurrentSessionId(newSession.id);
          setMessages([]);
          const updatedSessions = await getSessions();
          setSessions(updatedSessions);
        }
      } catch (error) {
        console.error("[FI9][ERROR] initChat:", error);
        if (isMounted) {
          Alert.alert(
            "Erreur",
            "Impossible de charger la session de conversation."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll FI9 stable avec timeout (évite les conflits)
  useEffect(() => {
    if (!messages || messages.length === 0 || loading) return;
    if (!flatListRef.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      try {
        flatListRef.current?.scrollToEnd({ animated: true });
      } catch (e) {
        console.warn("[FI9][WARN] scrollToEnd failed:", e?.message);
      }
    }, 150);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages.length, loading]);

  // ============================================
  // 6. CALLBACK HOOKS (tous les useCallback)
  // ============================================
  const persistMessages = useCallback(
    async (nextMessages) => {
      if (!currentSessionId) return;
      try {
        // Do NOT persist response_fingerprint (explicit requirement)
        const messagesToSave = nextMessages
          .filter((msg) => !msg.pending)
          .map(({ response_fingerprint, ...rest }) => rest);
        if (messagesToSave.length > 0) {
          await saveMessages(currentSessionId, messagesToSave);
        }
      } catch (error) {
        console.error("[FI9][ERROR] persistMessages:", error);
      }
    },
    [currentSessionId]
  );

  const handleSendMessage = useCallback(
    async (text, retryMessageId = null) => {
      const content = text.trim();
      if (!content || !currentSessionId || sending || !token) {
        if (!token) {
          Alert.alert("Session", "Veuillez vous reconnecter");
          navigation.replace("Login");
        }
        return;
      }

      setSending(true);

      // PHASE B.1: Analyser le message avec l'agent avant d'envoyer
      const existingMessages = messages.map((m) => ({
        role: m.role,
        text: m.content,
      }));
      
      const agentAnalysis = analyzeUserMessage(content, existingMessages);

      // PHASE 3.2: Si retry, mettre à jour le message existant, sinon créer nouveau
      let userMessageId = retryMessageId || `user-${Date.now()}`;
      
      if (!retryMessageId) {
        // Nouveau message avec statut "sending"
        const userMessage = {
          id: userMessageId,
          role: "user",
          content,
          timestamp: Date.now(),
          status: "sending", // PHASE 3.2
        };

        setMessages((prev) => [...prev, userMessage]);
      } else {
        // Retry: mettre statut à "sending"
        setMessages((prev) =>
          prev.map((m) =>
            m.id === retryMessageId ? { ...m, status: "sending" } : m
          )
        );
      }

      // FI9_NAYEK: ChatGPT-style - no system messages in chat
      // Role transitions and questions are UI-only (not added to messages array)
      // If agent needs questions, we still send to API and let backend handle it
      // (Backend will return appropriate response)

      // PHASE B.1 FIX: Si on était en mode questions mais qu'on ne pose plus de questions, forcer le mode réponse
      if (agentState === 'collecting_info' && !agentAnalysis.needsQuestions) {
        forceReadyToAnswer();
      }

      try {
        setIsTyping(true);
        
        // PHASE B.1 FIX: Formater le message avec la langue détectée
        const messageWithLanguage = formatUserMessageWithLanguage(content);
        
        // PHASE B.1: Formater le message avec le contexte de l'agent avant envoi
        const messageToSend = agentAnalysis.role 
          ? formatKonanMessage(messageWithLanguage, agentAnalysis, {})
          : messageWithLanguage;

        const responseMessages = await sendMessage(
          messageToSend,
          token,
          currentSessionId
        );

        // PHASE 3.2: Marquer le message user comme "sent"
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessageId ? { ...m, status: "sent" } : m
          )
        );

        // FI9_NAYEK: ChatGPT-style - no system messages in chat
        // Role transitions are UI-only (badge/indicator), not added to messages

        if (Array.isArray(responseMessages) && responseMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMessages = responseMessages
              .filter((m) => !existingIds.has(m.id))
              .map((msg) => {
                // FI9_NAYEK: Only render 'reply' field from backend (ChatGPT-style)
                // Backend returns: { reply, citation_block, fi9_proof, fi9 }
                // We store reply in content, citations/proof separately
                if (msg.role === 'assistant') {
                  return {
                    ...msg,
                    // Use reply field if available (pure conversational text)
                    content: msg.reply || msg.content || "",
                    // Store citations and proof separately (not in content)
                    citation_block: msg.citation_block || null,
                    fi9_proof: msg.fi9_proof || null,
                    fi9: msg.fi9 || null,
                  };
                }
                return msg;
              });
            
            if (newMessages.length === 0) {
              return prev;
            }
            const merged = [...prev, ...newMessages];
            persistMessages(merged).catch((err) =>
              console.error("[FI9][ERROR] persistMessages async:", err)
            );

            // PHASE 3.5: Auto-générer titre si c'est le premier échange
            const hasUserMessage = merged.some((m) => m.role === "user");
            const hasAssistantMessage = merged.some((m) => m.role === "assistant");
            if (hasUserMessage && hasAssistantMessage && merged.length <= 4) {
              const currentSession = sessions.find((s) => s.id === currentSessionId);
              if (currentSession && (currentSession.title === "Nouveau Chat" || currentSession.title === "New Chat")) {
                const newTitle = generateChatTitle(merged);
                renameSession(currentSessionId, newTitle).then(() => {
                  getSessions().then((updatedSessions) => {
                    setSessions(updatedSessions);
                  });
                });
              }
            }

            return merged;
          });
        } else {
          const assistantMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content:
              "Je n'ai pas pu générer de réponse pour cette requête.",
            timestamp: Date.now(),
          };

          setMessages((prev) => {
            const next = [...prev, assistantMessage];
            persistMessages(next).catch((err) =>
              console.error("[FI9][ERROR] persistMessages async:", err)
            );
            return next;
          });
        }
      } catch (error) {
        console.error("[FI9][ERROR] handleSendMessage:", error);
        
        // PHASE 3.2: Marquer le message user comme "error"
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessageId ? { ...m, status: "error" } : m
          )
        );

        const errMsg = String(error?.message || "");
        if (errMsg.toLowerCase().includes("reconnecter") || errMsg.includes("401")) {
          Alert.alert("Session", "Votre session a expiré. Veuillez vous reconnecter.");
          navigation.replace("Login");
        } else {
          // Feedback toast simple (non bloquant)
          Alert.alert(
            "Erreur réseau",
            "Impossible d'envoyer le message. Vérifiez votre connexion.",
            [{ text: "OK" }]
          );
        }
      } finally {
        setSending(false);
        setIsTyping(false);
      }
    },
    [currentSessionId, token, persistMessages, sending, navigation, sessions, messages, analyzeUserMessage, formatKonanMessage]
  );

  const handleSelectSession = useCallback(
    async (sessionId) => {
      if (!sessionId || sessionId === currentSessionId) return;

      setLoading(true);

      try {
        if (currentSessionId && messages.length > 0) {
          const messagesToSave = messages.filter((msg) => !msg.pending);
          if (messagesToSave.length > 0) {
            await saveMessages(currentSessionId, messagesToSave);
          }
        }

        const storedMessages = await getMessages(sessionId);
        setCurrentSessionId(sessionId);
        setMessages(storedMessages || []);
        await saveCurrentSession(sessionId);
      } catch (error) {
        console.error("[FI9][ERROR] handleSelectSession:", error);
        Alert.alert(
          "Erreur",
          "Impossible de charger l'historique de cette conversation."
        );
      } finally {
        setLoading(false);
      }
    },
    [currentSessionId, messages, resetAgent]
  );

  const handleNewChat = useCallback(async () => {
    // PHASE B.1: Réinitialiser l'agent pour nouvelle conversation
    resetAgent();
    
    if (currentSessionId && messages.length > 0) {
      const messagesToSave = messages.filter((msg) => !msg.pending);
      if (messagesToSave.length > 0) {
        await saveMessages(currentSessionId, messagesToSave);
      }
    }

    const newSession = await createNewSession();
    setCurrentSessionId(newSession.id);
    setMessages([]);
    await saveCurrentSession(newSession.id);
    const updatedSessions = await getSessions();
    setSessions(updatedSessions);
  }, [currentSessionId, messages]);

  const handleAttachmentPress = useCallback(() => {
    setIsAttachmentsSheetVisible(true);
  }, []);

  const handleImagePress = useCallback(() => {
    Alert.alert(t("image") || "Image", "Image selection (UI only)");
  }, [t]);

  const handleFilePress = useCallback(() => {
    Alert.alert(t("file") || "File", "File selection (UI only)");
  }, [t]);

  const handleScanPress = useCallback(() => {
    Alert.alert(t("scan") || "Scan", "Scan document (UI only)");
  }, [t]);

  const handleImportPress = useCallback(() => {
    Alert.alert(t("importDocument") || "Import", "Import document (UI only)");
  }, [t]);

  // PHASE 3.2: Retry d'un message en erreur
  const handleRetryMessage = useCallback(
    (message) => {
      if (message.role === "user" && message.content) {
        handleSendMessage(message.content, message.id);
      }
    },
    [handleSendMessage]
  );

  // PHASE 3.3: Rename session
  const handleRenameSession = useCallback(
    async (sessionId, newTitle) => {
      try {
        const success = await renameSession(sessionId, newTitle);
        if (success) {
          const updatedSessions = await getSessions();
          setSessions(updatedSessions);
        }
      } catch (error) {
        console.error("[FI9][ERROR] handleRenameSession:", error);
        Alert.alert("Erreur", "Impossible de renommer la conversation.");
      }
    },
    []
  );

  // PHASE 3.3: Delete session
  const handleDeleteSession = useCallback(
    async (sessionId) => {
      try {
        await deleteSession(sessionId);
        const updatedSessions = await getSessions();
        setSessions(updatedSessions);

        // Si session supprimée = session active, charger une autre ou créer nouvelle
        if (sessionId === currentSessionId) {
          if (updatedSessions.length > 0) {
            const nextSession = updatedSessions[0];
            const storedMessages = await getMessages(nextSession.id);
            setCurrentSessionId(nextSession.id);
            setMessages(storedMessages || []);
            await saveCurrentSession(nextSession.id);
          } else {
            // Aucune session restante, créer nouvelle
            const newSession = await createNewSession();
            setCurrentSessionId(newSession.id);
            setMessages([]);
            const reloadedSessions = await getSessions();
            setSessions(reloadedSessions);
          }
        }
      } catch (error) {
        console.error("[FI9][ERROR] handleDeleteSession:", error);
        Alert.alert("Erreur", "Impossible de supprimer la conversation.");
      }
    },
    [currentSessionId]
  );

  // ============================================
  // 7. CONDITIONAL RETURN (APRÈS TOUS LES HOOKS)
  // ============================================
  // PHASE 3.1: Loading state extrait
  if (loading) {
    return <ChatLoadingState />;
  }

  // ============================================
  // 8. MAIN RETURN (JSX principal)
  // ============================================
  const isIOS = Platform.OS === "ios";

  // PHASE 3.1: Contenu avec composants extraits
  const chatContent = (
    <View style={styles.container}>
      {/* Sidebar en overlay (mobile + desktop) */}
      <ChatSidebarModal
        visible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        user={user}
        onLogout={logout}
        onRenameSession={handleRenameSession} // PHASE 3.3
        onDeleteSession={handleDeleteSession} // PHASE 3.3
      />

      {/* Colonne droite : Chat principal */}
      <View style={styles.mainColumn}>
        {/* PHASE 3.1: Header extrait */}
        <ChatHeader
          planLabel={planLabel}
          onMenuPress={() => setIsSidebarVisible(true)}
          agentRole={currentRole}
        />

        {/* PHASE 3.1: MessageList extrait */}
        <MessageList
          messages={messages}
          isTyping={isTyping}
          username={username}
          flatListRef={flatListRef}
          onRetry={handleRetryMessage} // PHASE 3.2
          keyboardHeight={keyboardHeight} // KEYBOARD FIX
        />

        {/* KEYBOARD FIX: Composer avec Animated translateY */}
        <Animated.View
          style={{
            transform: [{ translateY: keyboardHeight }],
          }}
        >
          <ChatComposer
            disabled={sending || status !== "authenticated"}
            onSend={handleSendMessage}
            onAttachmentPress={handleAttachmentPress}
            keyboardHeight={keyboardHeight}
          />
        </Animated.View>
      </View>
    </View>
  );

  // KEYBOARD FIX: Gestion clavier centralisée avec Animated (suppression KeyboardAvoidingView)
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        {typeof chatContent === "string" ? <Text>{chatContent}</Text> : chatContent}
      </View>

      {/* FI9_PATCH v14.0: Bottom Sheet pour attachments */}
      <FI9_AttachmentsSheet
        visible={isAttachmentsSheetVisible}
        onClose={() => setIsAttachmentsSheetVisible(false)}
        onImagePress={handleImagePress}
        onFilePress={handleFilePress}
        onScanPress={handleScanPress}
        onImportPress={handleImportPress}
      />
    </SafeAreaView>
  );
}

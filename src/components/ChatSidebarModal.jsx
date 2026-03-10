// FI9_PATCH v13.4 - ChatSidebarModal component (PHASE 3.4)
// Drawer modal pour mobile (ouverture depuis la GAUCHE avec animation fluide)
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Animated } from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { chatColors } from "../constants/colors";
import ChatSidebar from "./ChatSidebar";

const SIDEBAR_WIDTH = 280;

export default function ChatSidebarModal({
  visible,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  user,
  onLogout,
  onRenameSession, // PHASE 3.3
  onDeleteSession, // PHASE 3.3
}) {
  const { theme } = useAppTheme();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current; // Départ: hors écran à gauche

  // Animation entrée/sortie
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0, // Position finale: visible
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH, // Position finale: hors écran
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      flexDirection: "row",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: SIDEBAR_WIDTH,
      backgroundColor: theme.background || chatColors.background,
      borderRightWidth: 1,
      borderRightColor: theme.border || chatColors.border,
      elevation: 14,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 2, height: 0 },
      paddingTop: 16,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade" // Animation overlay
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            activeSessionId={currentSessionId}
            onSelectSession={(sessionId) => {
              onSelectSession(sessionId);
              onClose(); // Fermer le drawer après sélection
            }}
            onNewChat={() => {
              onNewChat();
              onClose(); // Fermer le drawer après nouveau chat
            }}
            onLogout={onLogout}
            onRenameSession={onRenameSession} // PHASE 3.3
            onDeleteSession={onDeleteSession} // PHASE 3.3
          />
        </Animated.View>
      </View>
    </Modal>
  );
}


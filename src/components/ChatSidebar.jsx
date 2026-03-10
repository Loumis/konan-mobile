// FI9_PATCH v14.0 + PHASE 3.3 - ChatGPT Mobile 2025 Sidebar
// ChatSidebar.jsx - Gestion sessions complète (search, rename, delete, empty state)
// Preserves KONAN structure, style ChatGPT Mobile 2025

import React, { useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { chatColors } from "../constants/colors";

export default function ChatSidebar({
  currentSessionId,
  onSelectSession,
  sessions = [],
  activeSessionId,
  onNewChat,
  onLogout,
  onRenameSession, // PHASE 3.3: Callback rename
  onDeleteSession, // PHASE 3.3: Callback delete
  style,
}) {
  // ============================================
  // HOOKS (ordre fixe, pas de conditions)
  // ============================================
  const { theme } = useAppTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  // PHASE 3.3: State pour search + modals
  const [searchQuery, setSearchQuery] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [renameInputValue, setRenameInputValue] = useState("");

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

  // PHASE 3.3: Filtrer sessions par recherche
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    
    const query = searchQuery.toLowerCase();
    return sessions.filter((session) =>
      session.title?.toLowerCase().includes(query)
    );
  }, [sessions, searchQuery]);

  // PHASE 3.3: Styles ChatGPT Mobile 2025 + nouvelles features
  const styles = useMemo(
    () =>
      StyleSheet.create({
        sidebar: {
          flex: 1,
          backgroundColor: theme.background || chatColors.background,
        },
        // Header style ChatGPT "KONAN • [Plan]"
        header: {
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || chatColors.border,
          backgroundColor: theme.background || chatColors.background,
        },
        headerTitle: {
          fontSize: 22,
          fontWeight: "700",
          color: theme.text || chatColors.textPrimary,
        },
        headerPlan: {
          fontSize: 16,
          fontWeight: "400",
          color: theme.textMuted || chatColors.textSecondary,
          marginTop: 4,
        },
        // PHASE 3.3: Search input
        searchContainer: {
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
        searchInput: {
          backgroundColor: theme.surface || chatColors.surface,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 14,
          color: theme.text || chatColors.textPrimary,
          borderWidth: 1,
          borderColor: theme.border || chatColors.border,
        },
        // Menu flottant style ChatGPT
        menuSection: {
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
        newChatButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderRadius: 12,
          backgroundColor: theme.surface || chatColors.surface,
          alignSelf: "stretch",
          marginBottom: 8,
        },
        newChatText: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.text || chatColors.textPrimary,
          marginLeft: 8,
        },
        // Sessions list
        sessionsHeader: {
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
        },
        sessionsHeaderText: {
          fontSize: 14,
          fontWeight: "600",
          color: theme.textMuted || chatColors.textSecondary,
          textTransform: "uppercase",
        },
        sessionsList: {
          flex: 1,
        },
        // PHASE 3.3: Session item avec actions
        sessionItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 20,
          justifyContent: "space-between",
        },
        sessionItemActive: {
          backgroundColor: theme.surface || chatColors.surface,
        },
        sessionItemLeft: {
          flex: 1,
          marginRight: 8,
        },
        sessionTitle: {
          fontSize: 15,
          fontWeight: "400",
          color: theme.text || chatColors.textPrimary,
        },
        sessionTitleActive: {
          fontWeight: "600",
        },
        // PHASE 3.3: Menu actions button (⋮)
        sessionActionsButton: {
          padding: 8,
        },
        sessionActionsText: {
          fontSize: 18,
          color: theme.textMuted || chatColors.textSecondary,
        },
        // PHASE 3.3: Empty state
        emptyContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
        },
        emptyText: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.textMuted || chatColors.textSecondary,
          textAlign: "center",
          marginBottom: 8,
        },
        emptySubtext: {
          fontSize: 14,
          color: theme.textMuted || chatColors.textSecondary,
          textAlign: "center",
        },
        // Footer
        footer: {
          borderTopWidth: 1,
          borderTopColor: theme.border || chatColors.border,
          paddingVertical: 16,
          paddingHorizontal: 20,
        },
        footerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        userInfo: {
          flex: 1,
        },
        userName: {
          fontSize: 14,
          fontWeight: "600",
          color: theme.text || chatColors.textPrimary,
        },
        userPlan: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textSecondary,
          marginTop: 2,
        },
        logoutButton: {
          paddingVertical: 8,
          paddingHorizontal: 12,
        },
        logoutText: {
          fontSize: 14,
          color: "#EF4444",
          fontWeight: "600",
        },
        // PHASE 3.3: Modals
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          justifyContent: "center",
          alignItems: "center",
        },
        modalContent: {
          backgroundColor: theme.background || chatColors.background,
          borderRadius: 16,
          padding: 24,
          width: "85%",
          maxWidth: 400,
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: "700",
          color: theme.text || chatColors.textPrimary,
          marginBottom: 16,
        },
        modalInput: {
          backgroundColor: theme.surface || chatColors.surface,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 14,
          color: theme.text || chatColors.textPrimary,
          borderWidth: 1,
          borderColor: theme.border || chatColors.border,
          marginBottom: 16,
        },
        modalActions: {
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 12,
        },
        modalButton: {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          minWidth: 80,
          alignItems: "center",
        },
        modalButtonCancel: {
          backgroundColor: theme.surface || chatColors.surface,
        },
        modalButtonConfirm: {
          backgroundColor: theme.primary || "#10A37F",
        },
        modalButtonDelete: {
          backgroundColor: "#EF4444",
        },
        modalButtonText: {
          fontSize: 14,
          fontWeight: "600",
          color: theme.text || chatColors.textPrimary,
        },
        modalButtonTextConfirm: {
          color: "#FFFFFF",
        },
      }),
    [theme]
  );

  // ============================================
  // PHASE 3.3: Handlers
  // ============================================
  const handleOpenRenameModal = useCallback((session) => {
    setSelectedSession(session);
    setRenameInputValue(session.title || "");
    setRenameModalVisible(true);
  }, []);

  const handleConfirmRename = useCallback(() => {
    if (selectedSession && renameInputValue.trim() && onRenameSession) {
      onRenameSession(selectedSession.id, renameInputValue.trim());
    }
    setRenameModalVisible(false);
    setSelectedSession(null);
    setRenameInputValue("");
  }, [selectedSession, renameInputValue, onRenameSession]);

  const handleOpenDeleteModal = useCallback((session) => {
    setSelectedSession(session);
    setDeleteModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedSession && onDeleteSession) {
      onDeleteSession(selectedSession.id);
    }
    setDeleteModalVisible(false);
    setSelectedSession(null);
  }, [selectedSession, onDeleteSession]);

  const handleCancelModal = useCallback(() => {
    setRenameModalVisible(false);
    setDeleteModalVisible(false);
    setSelectedSession(null);
    setRenameInputValue("");
  }, []);

  // PHASE 3.3: Show actions menu (Alert pour simplifier)
  const handleShowActionsMenu = useCallback((session) => {
    Alert.alert(
      session.title || "Session",
      "Choisissez une action :",
      [
        {
          text: "Renommer",
          onPress: () => handleOpenRenameModal(session),
        },
        {
          text: "Supprimer",
          onPress: () => handleOpenDeleteModal(session),
          style: "destructive",
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ]
    );
  }, [handleOpenRenameModal, handleOpenDeleteModal]);

  // ============================================
  // RENDER
  // ============================================
  const renderSessionItem = useCallback(
    ({ item }) => {
      const isActive = item.id === (currentSessionId || activeSessionId);
      
      return (
        <TouchableOpacity
          style={[
            styles.sessionItem,
            isActive && styles.sessionItemActive,
          ]}
          onPress={() => onSelectSession && onSelectSession(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.sessionItemLeft}>
            <Text
              style={[
                styles.sessionTitle,
                isActive && styles.sessionTitleActive,
              ]}
              numberOfLines={1}
            >
              {item.title || "Untitled"}
            </Text>
          </View>
          
          {/* PHASE 3.3: Actions menu button */}
          <TouchableOpacity
            style={styles.sessionActionsButton}
            onPress={() => handleShowActionsMenu(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.sessionActionsText}>⋮</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [currentSessionId, activeSessionId, onSelectSession, styles, handleShowActionsMenu]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  // PHASE 3.3: Empty state
  const renderEmpty = useCallback(() => {
    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun résultat</Text>
          <Text style={styles.emptySubtext}>
            Essayez une autre recherche
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune conversation</Text>
        <Text style={styles.emptySubtext}>
          Cliquez sur "Nouveau Chat" pour commencer
        </Text>
      </View>
    );
  }, [searchQuery, styles]);

  return (
    <View style={[styles.sidebar, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KONAN</Text>
        <Text style={styles.headerPlan}>• {planLabel}</Text>
      </View>

      {/* PHASE 3.3: Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor={theme.textMuted || chatColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* New Chat Button */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={onNewChat}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20 }}>+</Text>
          <Text style={styles.newChatText}>
            {t("newChat") || "Nouveau Chat"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sessions Header */}
      {filteredSessions.length > 0 && (
        <View style={styles.sessionsHeader}>
          <Text style={styles.sessionsHeaderText}>
            {searchQuery.trim()
              ? `${filteredSessions.length} résultat(s)`
              : "Historique"}
          </Text>
        </View>
      )}

      {/* Sessions List */}
      <FlatList
        style={styles.sessionsList}
        data={filteredSessions}
        keyExtractor={keyExtractor}
        renderItem={renderSessionItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />

      {/* Footer (User + Logout) */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {username}
            </Text>
            <Text style={styles.userPlan}>{planLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>
              {t("logout") || "Déconnexion"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PHASE 3.3: Rename Modal */}
      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Renommer la conversation</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nouveau titre..."
              placeholderTextColor={theme.textMuted || chatColors.textSecondary}
              value={renameInputValue}
              onChangeText={setRenameInputValue}
              autoFocus
              autoCapitalize="sentences"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCancelModal}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmRename}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextConfirm,
                  ]}
                >
                  Confirmer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PHASE 3.3: Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Supprimer la conversation ?</Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.textMuted || chatColors.textSecondary,
                marginBottom: 20,
              }}
            >
              Cette action est irréversible. Tous les messages de cette
              conversation seront définitivement supprimés.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCancelModal}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={handleConfirmDelete}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextConfirm,
                  ]}
                >
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

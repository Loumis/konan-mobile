// FI9_UI_UPGRADE v15.0 - User Menu Component
// Profile, Settings, Subscription management
// Preserves all existing KONAN logic - UI only upgrade

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useAppTheme } from "../context/AppThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { chatColors } from "../constants/colors";
import { API } from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Icons
let UserIcon = null;
let SettingsIcon = null;
let CreditCardIcon = null;
let LogOutIcon = null;
let TrashIcon = null;
let MoonIcon = null;
let SunIcon = null;
let LockIcon = null;
let ShieldIcon = null;
try {
  const lucide = require("lucide-react-native");
  if (lucide) {
    UserIcon = lucide.User;
    SettingsIcon = lucide.Settings;
    CreditCardIcon = lucide.CreditCard;
    LogOutIcon = lucide.LogOut;
    TrashIcon = lucide.Trash2;
    MoonIcon = lucide.Moon;
    SunIcon = lucide.Sun;
    LockIcon = lucide.Lock;
    ShieldIcon = lucide.Shield;
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

const THEME_STORAGE_KEY = "KONAN_THEME_PREFERENCE";
const HISTORY_ENABLED_KEY = "KONAN_HISTORY_ENABLED";
const PRIVACY_ENABLED_KEY = "KONAN_PRIVACY_ENABLED";

export const UserMenu = memo(({
  visible,
  onClose,
  onLogout,
  onNavigateToSettings,
  onNavigateToSubscription,
}) => {
  // ============================================
  // HOOKS
  // ============================================
  const { theme, isDark, toggleTheme } = useAppTheme();
  const { t } = useLanguage();
  const { user, status, logout } = useAuth();

  // ============================================
  // STATE
  // ============================================
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // profile, settings, subscription

  // ============================================
  // FETCH PROFILE
  // ============================================
  const fetchProfile = useCallback(async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    try {
      const response = await API.get("/api/auth/me");
      setProfile(response.data);
    } catch (error) {
      console.error("[FI9] Profile fetch error:", error);
      // Use user from context as fallback
      setProfile(user);
    } finally {
      setLoading(false);
    }
  }, [status, user]);

  // ============================================
  // FETCH SUBSCRIPTION
  // ============================================
  const fetchSubscription = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      // Try subscription endpoint
      try {
        const response = await API.get("/api/user/subscription");
        setSubscription(response.data);
      } catch (subError) {
        // Fallback: get plan from profile
        if (profile) {
          setSubscription({
            plan: profile.plan || "free",
            status: "active",
          });
        }
      }
    } catch (error) {
      console.error("[FI9] Subscription fetch error:", error);
      setSubscription({ plan: "free", status: "active" });
    }
  }, [status, profile]);

  // ============================================
  // LOAD SETTINGS
  // ============================================
  const loadSettings = useCallback(async () => {
    try {
      const history = await AsyncStorage.getItem(HISTORY_ENABLED_KEY);
      const privacy = await AsyncStorage.getItem(PRIVACY_ENABLED_KEY);
      setHistoryEnabled(history !== "false");
      setPrivacyEnabled(privacy !== "false");
    } catch (error) {
      console.error("[FI9] Settings load error:", error);
    }
  }, []);

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    if (visible && status === "authenticated") {
      fetchProfile();
      fetchSubscription();
      loadSettings();
    }
  }, [visible, status, fetchProfile, fetchSubscription, loadSettings]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleThemeToggle = useCallback(async () => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? "light" : "dark");
      toggleTheme();
    } catch (error) {
      console.error("[FI9] Theme save error:", error);
    }
  }, [isDark, toggleTheme]);

  const handleHistoryToggle = useCallback(async (value) => {
    try {
      await AsyncStorage.setItem(HISTORY_ENABLED_KEY, value.toString());
      setHistoryEnabled(value);
      
      // Sync with API
      try {
        await API.patch("/api/user/settings", { historyEnabled: value });
      } catch (apiError) {
        console.error("[FI9] History sync error:", apiError);
      }
    } catch (error) {
      console.error("[FI9] History save error:", error);
    }
  }, []);

  const handlePrivacyToggle = useCallback(async (value) => {
    try {
      await AsyncStorage.setItem(PRIVACY_ENABLED_KEY, value.toString());
      setPrivacyEnabled(value);
      
      // Sync with API
      try {
        await API.patch("/api/user/settings", { privacyEnabled: value });
      } catch (apiError) {
        console.error("[FI9] Privacy sync error:", apiError);
      }
    } catch (error) {
      console.error("[FI9] Privacy save error:", error);
    }
  }, []);

  const handlePasswordChange = useCallback(() => {
    // Redirect to OAuth/Auth0 or password change screen
    if (onNavigateToSettings) {
      onNavigateToSettings("password");
    } else {
      Alert.alert(
        "Changement de mot de passe",
        "Redirection vers la page de changement de mot de passe..."
      );
    }
  }, [onNavigateToSettings]);

  const handlePurgeLocal = useCallback(() => {
    Alert.alert(
      "Purge locale",
      "Voulez-vous supprimer toutes les données locales ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Succès", "Données locales supprimées");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer les données");
            }
          },
        },
      ]
    );
  }, []);

  const handlePurgeCloud = useCallback(() => {
    Alert.alert(
      "Purge cloud",
      "Voulez-vous supprimer toutes vos données du serveur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete("/api/user/data");
              Alert.alert("Succès", "Données cloud supprimées");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer les données");
            }
          },
        },
      ]
    );
  }, []);

  const handlePayment = useCallback(() => {
    if (onNavigateToSubscription) {
      onNavigateToSubscription();
    } else {
      Alert.alert("Paiement", "Redirection vers le portail de paiement...");
    }
  }, [onNavigateToSubscription]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            // Invalidate token
            try {
              await API.post("/api/auth/logout");
            } catch (error) {
              // Continue even if logout fails
            }
            
            // Purge store
            try {
              await AsyncStorage.clear();
            } catch (error) {
              // Continue
            }
            
            // Call logout
            if (logout) {
              logout();
            } else if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  }, [logout, onLogout]);

  // ============================================
  // STYLES
  // ============================================
  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        },
        modalContent: {
          backgroundColor: theme.background || chatColors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "80%",
          paddingBottom: 20,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || chatColors.border,
        },
        headerTitle: {
          fontSize: 20,
          fontWeight: "700",
          color: theme.text || chatColors.textPrimary,
        },
        closeButton: {
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        tabs: {
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || chatColors.border,
        },
        tab: {
          flex: 1,
          paddingVertical: 8,
          alignItems: "center",
          borderRadius: 8,
        },
        tabActive: {
          backgroundColor: theme.surface || chatColors.surface,
        },
        tabText: {
          fontSize: 14,
          fontWeight: "500",
          color: theme.textMuted || chatColors.textMuted,
        },
        tabTextActive: {
          color: theme.primary || chatColors.accent,
          fontWeight: "600",
        },
        content: {
          padding: 20,
        },
        section: {
          marginBottom: 24,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: theme.text || chatColors.textPrimary,
          marginBottom: 12,
        },
        profileItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || chatColors.border,
        },
        profileLabel: {
          fontSize: 14,
          color: theme.textMuted || chatColors.textMuted,
          flex: 1,
        },
        profileValue: {
          fontSize: 14,
          fontWeight: "500",
          color: theme.text || chatColors.textPrimary,
        },
        settingItem: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || chatColors.border,
        },
        settingLabel: {
          fontSize: 14,
          color: theme.text || chatColors.textPrimary,
          flex: 1,
        },
        button: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: theme.surface || chatColors.surface,
          marginBottom: 8,
        },
        buttonText: {
          fontSize: 14,
          fontWeight: "500",
          color: theme.text || chatColors.textPrimary,
          marginLeft: 12,
        },
        planCard: {
          padding: 16,
          borderRadius: 12,
          backgroundColor: theme.surface || chatColors.surface,
          marginBottom: 12,
        },
        planName: {
          fontSize: 18,
          fontWeight: "700",
          color: theme.text || chatColors.textPrimary,
          marginBottom: 4,
        },
        planStatus: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textMuted,
        },
        restrictions: {
          marginTop: 12,
        },
        restrictionItem: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        },
        restrictionText: {
          fontSize: 12,
          color: theme.textMuted || chatColors.textMuted,
          marginLeft: 8,
        },
      }),
    [theme]
  );

  // ============================================
  // RENDER PROFILE TAB
  // ============================================
  const renderProfile = () => {
    if (loading) {
      return (
        <View style={styles.content}>
          <ActivityIndicator size="large" color={theme.primary || chatColors.accent} />
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("profile") || "Profil"}
          </Text>

          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>
              {t("name") || "Nom"}
            </Text>
            <Text style={styles.profileValue}>
              {profile?.full_name || profile?.name || user?.full_name || user?.name || "N/A"}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>
              {t("email") || "Email"}
            </Text>
            <Text style={styles.profileValue}>
              {profile?.email || user?.email || "N/A"}
            </Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>
              {t("plan") || "Plan"}
            </Text>
            <Text style={styles.profileValue}>
              {subscription?.plan || profile?.plan || "free"}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // ============================================
  // RENDER SETTINGS TAB
  // ============================================
  const renderSettings = () => {
    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("appearance") || "Apparence"}
          </Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {t("darkMode") || "Mode sombre"}
            </Text>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: chatColors.border, true: chatColors.accent }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("security") || "Sécurité"}
          </Text>

          <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
            {LockIcon ? (
              <LockIcon size={20} color={theme.text || chatColors.textPrimary} />
            ) : Ionicons ? (
              <Ionicons name="lock-closed-outline" size={20} color={theme.text || chatColors.textPrimary} />
            ) : (
              <Text style={{ fontSize: 16 }}>🔒</Text>
            )}
            <Text style={styles.buttonText}>
              {t("changePassword") || "Changer le mot de passe"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("privacy") || "Confidentialité"}
          </Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {t("history") || "Historique"}
            </Text>
            <Switch
              value={historyEnabled}
              onValueChange={handleHistoryToggle}
              trackColor={{ false: chatColors.border, true: chatColors.accent }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {t("privacyMode") || "Mode confidentialité"}
            </Text>
            <Switch
              value={privacyEnabled}
              onValueChange={handlePrivacyToggle}
              trackColor={{ false: chatColors.border, true: chatColors.accent }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("data") || "Données"}
          </Text>

          <TouchableOpacity style={styles.button} onPress={handlePurgeLocal}>
            {TrashIcon ? (
              <TrashIcon size={20} color={theme.error || "#FF3B30"} />
            ) : Ionicons ? (
              <Ionicons name="trash-outline" size={20} color={theme.error || "#FF3B30"} />
            ) : (
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            )}
            <Text style={[styles.buttonText, { color: theme.error || "#FF3B30" }]}>
              {t("purgeLocal") || "Purge locale"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePurgeCloud}>
            {TrashIcon ? (
              <TrashIcon size={20} color={theme.error || "#FF3B30"} />
            ) : Ionicons ? (
              <Ionicons name="trash-outline" size={20} color={theme.error || "#FF3B30"} />
            ) : (
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            )}
            <Text style={[styles.buttonText, { color: theme.error || "#FF3B30" }]}>
              {t("purgeCloud") || "Purge cloud"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            {LogOutIcon ? (
              <LogOutIcon size={20} color={theme.error || "#FF3B30"} />
            ) : Ionicons ? (
              <Ionicons name="log-out-outline" size={20} color={theme.error || "#FF3B30"} />
            ) : (
              <Text style={{ fontSize: 16 }}>🚪</Text>
            )}
            <Text style={[styles.buttonText, { color: theme.error || "#FF3B30" }]}>
              {t("logout") || "Déconnexion"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // ============================================
  // RENDER SUBSCRIPTION TAB
  // ============================================
  const renderSubscription = () => {
    const currentPlan = subscription?.plan || profile?.plan || "free";
    const plans = [
      { id: "free", name: "Free", features: ["Messages limités", "Modèles de base"] },
      { id: "plus", name: "Plus", features: ["Messages illimités", "Modèles avancés", "Outils premium"] },
      { id: "pro", name: "Pro", features: ["Tout Plus", "API access", "Support prioritaire"] },
      { id: "team", name: "Team", features: ["Tout Pro", "Gestion d'équipe", "Analytics"] },
      { id: "enterprise", name: "Enterprise", features: ["Tout Team", "SLA", "Support dédié"] },
    ];

    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("currentPlan") || "Plan actuel"}
          </Text>

          <View style={styles.planCard}>
            <Text style={styles.planName}>
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </Text>
            <Text style={styles.planStatus}>
              {subscription?.status === "active" ? "Actif" : "Inactif"}
            </Text>

            {subscription?.restrictions && (
              <View style={styles.restrictions}>
                {Object.entries(subscription.restrictions).map(([key, value]) => (
                  <View key={key} style={styles.restrictionItem}>
                    <Text style={styles.restrictionText}>
                      {key}: {value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("availablePlans") || "Plans disponibles"}
          </Text>

          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                plan.id === currentPlan && {
                  borderWidth: 2,
                  borderColor: theme.primary || chatColors.accent,
                },
              ]}
              onPress={handlePayment}
            >
              <Text style={styles.planName}>{plan.name}</Text>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.restrictionText}>
                  • {feature}
                </Text>
              ))}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          {CreditCardIcon ? (
            <CreditCardIcon size={20} color={theme.primary || chatColors.accent} />
          ) : Ionicons ? (
            <Ionicons name="card-outline" size={20} color={theme.primary || chatColors.accent} />
          ) : (
            <Text style={{ fontSize: 16 }}>💳</Text>
          )}
          <Text style={[styles.buttonText, { color: theme.primary || chatColors.accent }]}>
            {t("manageSubscription") || "Gérer l'abonnement"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // ============================================
  // RENDER
  // ============================================
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {t("account") || "Compte"}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              {Ionicons ? (
                <Ionicons name="close" size={24} color={theme.text || chatColors.textPrimary} />
              ) : (
                <Text style={{ fontSize: 20 }}>✕</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "profile" && styles.tabActive]}
              onPress={() => setActiveTab("profile")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "profile" && styles.tabTextActive,
                ]}
              >
                {t("profile") || "Profil"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "settings" && styles.tabActive]}
              onPress={() => setActiveTab("settings")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "settings" && styles.tabTextActive,
                ]}
              >
                {t("settings") || "Paramètres"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "subscription" && styles.tabActive]}
              onPress={() => setActiveTab("subscription")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "subscription" && styles.tabTextActive,
                ]}
              >
                {t("subscription") || "Abonnement"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === "profile" && renderProfile()}
          {activeTab === "settings" && renderSettings()}
          {activeTab === "subscription" && renderSubscription()}
        </View>
      </TouchableOpacity>
    </Modal>
  );
});

UserMenu.displayName = "UserMenu";

export default UserMenu;


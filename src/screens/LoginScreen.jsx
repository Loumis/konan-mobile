/**
 * PHASE A.3 - LoginScreen Premium
 * Authentification avec thème global, Google Auth, validation UX
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useGoogleAuth, useEmailValidation } from "../hooks/useAuthPremium";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function LoginScreen({ navigation }) {
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { validateEmail } = useEmailValidation();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace("Chat");
    }
  }, [isAuthenticated, navigation]);

  // Validation email en temps réel
  useEffect(() => {
    if (email.trim()) {
      const validation = validateEmail(email);
      setIsEmailValid(validation.isValid);
      setEmailError(validation.message || null);
    } else {
      setIsEmailValid(false);
      setEmailError(null);
    }
  }, [email, validateEmail]);

  const handleSubmit = async () => {
    if (busy) return;
    
    // Validation
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message || "Email invalide");
      return;
    }

    setBusy(true);
    setError(null);
    
    try {
      await login(email, password);
      navigation.replace("Chat");
    } catch (err) {
      const message = err?.message || "Identifiants invalides";
      setError(message);
      Alert.alert("Connexion", message);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      // TODO: Backend integration - le hook retournera token et user
      // navigation.replace("Chat");
    } catch (err) {
      // Erreur gérée par le hook
      console.error("[Login] Google Auth error:", err);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.safe}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>Connexion</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Bienvenue sur KONAN
              </Text>
            </View>

            {/* Google Auth */}
            <GoogleAuthButton
              onSuccess={handleGoogleAuth}
              onError={(err) => setError(err.message)}
              mode="signin"
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textMuted }]}>ou</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: emailError
                      ? theme.error
                      : isEmailValid
                      ? theme.success
                      : theme.inputBorder,
                    color: theme.inputText,
                  },
                ]}
                placeholder="votre.email@exemple.com"
                placeholderTextColor={theme.inputPlaceholder}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                editable={!busy}
              />
              {emailError && (
                <Text style={[styles.fieldError, { color: theme.error }]}>
                  {emailError}
                </Text>
              )}
              {isEmailValid && !emailError && (
                <Text style={[styles.fieldSuccess, { color: theme.success }]}>
                  ✓ Email valide
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordHeader}>
                <Text style={[styles.label, { color: theme.text }]}>Mot de passe</Text>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={[styles.forgotPassword, { color: theme.primary }]}>
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.inputBorder,
                      color: theme.inputText,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.inputPlaceholder}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoComplete="password"
                  editable={!busy}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={[styles.eyeIcon, { color: theme.textMuted }]}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: `${theme.error}15` }]}>
                <Text style={[styles.error, { color: theme.error }]}>⚠️ {error}</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.primary,
                  opacity: (busy || !isEmailValid || !password.trim()) ? 0.6 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={busy || !isEmailValid || !password.trim()}
              activeOpacity={0.85}
            >
              {busy ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textMuted }]}>
                Pas de compte ?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={[styles.footerLink, { color: theme.primary }]}>
                  Créer un compte
                </Text>
              </TouchableOpacity>
            </View>

            {/* Legal Links */}
            <View style={styles.legalLinks}>
              <TouchableOpacity 
                style={styles.legalLink}
                onPress={() => navigation.navigate('Presentation')}
              >
                <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
                  En savoir plus
                </Text>
              </TouchableOpacity>
              <Text style={[styles.legalLinkSeparator, { color: theme.textMuted }]}>•</Text>
              <TouchableOpacity 
                style={styles.legalLink}
                onPress={() => navigation.navigate('Terms')}
              >
                <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
                  CGU
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security Info */}
            <View style={[styles.securityInfo, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.securityText, { color: theme.textMuted }]}>
                🔒 Vos données sont sécurisées
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 13,
    fontWeight: "600",
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 0,
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  fieldError: {
    fontSize: 12,
    marginTop: 4,
  },
  fieldSuccess: {
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "600",
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  legalLink: {
    paddingVertical: 4,
  },
  legalLinkText: {
    fontSize: 13,
    textDecorationLine: "underline",
  },
  legalLinkSeparator: {
    fontSize: 13,
  },
  securityInfo: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  securityText: {
    fontSize: 12,
  },
});

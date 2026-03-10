/**
 * PHASE A.3 - RegisterScreen Premium
 * Inscription avec validation mot de passe, indicateurs sécurité, thème global
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
import { useGoogleAuth, useEmailValidation, usePasswordValidation } from "../hooks/useAuthPremium";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function RegisterScreen({ navigation }) {
  const { register, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { validateEmail } = useEmailValidation();
  const { validatePassword } = usePasswordValidation();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(null);

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

  // Validation mot de passe en temps réel
  useEffect(() => {
    if (password.trim()) {
      const strength = validatePassword(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [password, validatePassword]);

  // Vérification correspondance mots de passe
  useEffect(() => {
    if (confirmPassword.trim()) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async () => {
    if (busy) return;
    
    // Validation
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message || "Email invalide");
      return;
    }

    if (!passwordStrength?.isValid) {
      setError("Le mot de passe ne respecte pas les critères de sécurité");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setBusy(true);
    setError(null);
    
    try {
      await register(email, password);
      // TODO: Backend integration - rediriger vers EmailVerification si nécessaire
      // navigation.navigate("EmailVerification", { email });
      navigation.replace("Chat");
    } catch (err) {
      const message = err?.message || "Création de compte impossible";
      setError(message);
      Alert.alert("Inscription", message);
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
      console.error("[Register] Google Auth error:", err);
    }
  };

  const getPasswordStrengthColor = (score) => {
    if (score === 0) return theme.error;
    if (score === 1) return theme.error;
    if (score === 2) return theme.warning;
    if (score === 3) return theme.info;
    return theme.success;
  };

  const getPasswordStrengthLabel = (score) => {
    if (score === 0) return "Très faible";
    if (score === 1) return "Faible";
    if (score === 2) return "Moyen";
    if (score === 3) return "Fort";
    return "Très fort";
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
              <Text style={[styles.title, { color: theme.text }]}>Créer un compte</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Rejoignez KONAN dès aujourd'hui
              </Text>
            </View>

            {/* Google Auth */}
            <GoogleAuthButton
              onSuccess={handleGoogleAuth}
              onError={(err) => setError(err.message)}
              mode="signup"
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
              <Text style={[styles.label, { color: theme.text }]}>Mot de passe</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: passwordStrength
                        ? getPasswordStrengthColor(passwordStrength.score)
                        : theme.inputBorder,
                      color: theme.inputText,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.inputPlaceholder}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoComplete="password-new"
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
              
              {/* Password Strength Indicator */}
              {passwordStrength && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBar}>
                    {[0, 1, 2, 3].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.passwordStrengthSegment,
                          {
                            backgroundColor:
                              level < passwordStrength.score
                                ? getPasswordStrengthColor(passwordStrength.score)
                                : theme.border,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.passwordStrengthLabel,
                      { color: getPasswordStrengthColor(passwordStrength.score) },
                    ]}
                  >
                    {getPasswordStrengthLabel(passwordStrength.score)}
                  </Text>
                </View>
              )}

              {/* Password Requirements */}
              {passwordStrength && passwordStrength.feedback.length > 0 && (
                <View style={styles.requirementsContainer}>
                  {passwordStrength.feedback.map((req, idx) => (
                    <Text key={idx} style={[styles.requirement, { color: theme.textMuted }]}>
                      • {req}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Confirmer le mot de passe</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor:
                        passwordMatch === null
                          ? theme.inputBorder
                          : passwordMatch
                          ? theme.success
                          : theme.error,
                      color: theme.inputText,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.inputPlaceholder}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoComplete="password-new"
                  editable={!busy}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={[styles.eyeIcon, { color: theme.textMuted }]}>
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
              {passwordMatch !== null && (
                <Text
                  style={[
                    passwordMatch ? styles.fieldSuccess : styles.fieldError,
                    { color: passwordMatch ? theme.success : theme.error },
                  ]}
                >
                  {passwordMatch ? "✓ Mots de passe identiques" : "✗ Mots de passe différents"}
                </Text>
              )}
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
                  opacity:
                    busy ||
                    !isEmailValid ||
                    !passwordStrength?.isValid ||
                    !passwordMatch
                      ? 0.6
                      : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={
                busy ||
                !isEmailValid ||
                !passwordStrength?.isValid ||
                !passwordMatch
              }
              activeOpacity={0.85}
            >
              {busy ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Créer mon compte</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={[styles.termsText, { color: theme.textMuted }]}>
              En créant un compte, vous acceptez nos{" "}
              <TouchableOpacity onPress={() => navigation.navigate("Terms")}>
                <Text style={[styles.termsLink, { color: theme.primary }]}>
                  Conditions Générales d'Utilisation
                </Text>
              </TouchableOpacity>
            </Text>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textMuted }]}>
                Déjà un compte ?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={[styles.footerLink, { color: theme.primary }]}>Se connecter</Text>
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
            </View>

            {/* Security Info */}
            <View style={[styles.securityInfo, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.securityText, { color: theme.textMuted }]}>
                🔒 Vos données sont sécurisées et cryptées
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
  passwordStrengthContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  passwordStrengthBar: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    height: 4,
  },
  passwordStrengthSegment: {
    flex: 1,
    borderRadius: 2,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirement: {
    fontSize: 12,
    marginTop: 4,
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
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: "600",
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
  securityInfo: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  securityText: {
    fontSize: 12,
  },
});

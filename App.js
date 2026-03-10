// FI9_NAYEK v14 — MOBILE FIX
// App.js — React Native root component
// PHASE A.1: Thème global Jour/Nuit
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "App.js");
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeProvider";
import { LanguageProvider } from "./src/context/LanguageContext";
import { AppThemeProvider } from "./src/context/AppThemeContext";
import { ThemeProvider as GlobalThemeProvider } from "./src/contexts/ThemeContext";
import ChatScreen from "./src/screens/ChatScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SubscribeScreen from "./src/screens/SubscribeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AboutKonanScreen from "./src/screens/AboutKonanScreen";
import TermsScreen from "./src/screens/TermsScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import PresentationScreen from "./src/screens/PresentationScreen";
import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { useTheme } from "./src/hooks/useTheme";

const Stack = createNativeStackNavigator();

function TextButton({ onPress, children }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 12 }}>
      <Text style={{ color: theme.primary, fontWeight: "600" }}>{children}</Text>
    </TouchableOpacity>
  );
}

function Router() {
  const { status, subscription, isAuthenticated } = useContext(AuthContext);
  const { theme } = useTheme();
  
  // FI9_NAYEK: Attendre que le token soit chargé avant de rendre la navigation
  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 8 }}>[FI9] Chargement du token...</Text>
      </View>
    );
  }
  
  // FI9_NAYEK: Route initiale dynamique selon l'auth status
  const initial = isAuthenticated ? "Chat" : "Login";
  
  console.log(`[FI9] Router - Status: ${status}, isAuthenticated: ${isAuthenticated}, initialRoute: ${initial}`);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initial}
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Presentation" component={PresentationScreen} options={{ title: "Présentation KONAN" }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "KONAN" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Créer un compte" }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: "Mot de passe oublié" }} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} options={{ title: "Vérification" }} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            title: subscription === "premium" ? "KONAN • Premium" : "KONAN • Free",
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {subscription !== "premium" && (
                  <TextButton onPress={() => navigation.navigate("Subscribe")}>Premium</TextButton>
                )}
                <TextButton onPress={() => navigation.navigate("Settings")}>⚙️</TextButton>
              </View>
            ),
          })}
        />
        <Stack.Screen name="Subscribe" component={SubscribeScreen} options={{ title: "Abonnement" }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Paramètres" }} />
        <Stack.Screen name="AboutKonan" component={AboutKonanScreen} options={{ title: "À propos" }} />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ title: "CGU & Confidentialité" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "App.js");
  return (
    <SafeAreaProvider>
      <GlobalThemeProvider initialMode="auto">
        <AppThemeProvider>
          <LanguageProvider>
            <ThemeProvider initialFI9Mode="ACTIVE">
              <AuthProvider>
                <Router />
              </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AppThemeProvider>
      </GlobalThemeProvider>
    </SafeAreaProvider>
  );
}

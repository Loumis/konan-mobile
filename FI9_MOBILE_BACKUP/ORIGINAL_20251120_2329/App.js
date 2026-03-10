// App.js
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
import ChatScreen from "./src/screens/ChatScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SubscribeScreen from "./src/screens/SubscribeScreen"; // ← correspond exactement au fichier
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

function TextButton({ onPress, children }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 12 }}>
      <Text style={{ color: "#10A37F", fontWeight: "600" }}>{children}</Text>
    </TouchableOpacity>
  );
}

function Router() {
  const { status, subscription, isAuthenticated } = useContext(AuthContext);
  
  // FI9_NAYEK: Attendre que le token soit chargé avant de rendre la navigation
  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B0B0B" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={{ color: "#fff", marginTop: 8 }}>[FI9] Chargement du token...</Text>
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
          headerStyle: { backgroundColor: "#0B0B0B" },
          headerTintColor: "#FFFFFF",
          contentStyle: { backgroundColor: "#0B0B0B" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "KONAN" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Créer un compte" }} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            title: subscription === "premium" ? "KONAN • Premium" : "KONAN • Free",
            headerRight: () =>
              subscription === "premium" ? null : (
                <TextButton onPress={() => navigation.navigate("Subscribe")}>Premium</TextButton>
              ),
          })}
        />
        <Stack.Screen name="Subscribe" component={SubscribeScreen} options={{ title: "Abonnement" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "App.js");
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <LanguageProvider>
          <ThemeProvider initialFI9Mode="ACTIVE">
            <AuthProvider>
              <Router />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

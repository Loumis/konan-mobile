// FI9_NAYEK: Configuration Expo unifiée avec EXPO_PUBLIC_API_URL
import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

// Priorité: EXPO_PUBLIC_API_URL > VITE_API_BASE_URL > API_BASE_URL > fallback
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.VITE_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://192.168.0.184:8000';

const config: ExpoConfig = {
  name: 'Konanmobile2',
  slug: 'konanmobile2',
  version: '1.0.0',
  android: {
    package: 'com.anonymous.konanmobile2',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    softwareKeyboardLayoutMode: 'resize',
  },
  extra: {
    API_URL, // FI9_NAYEK: Utilisation de API_URL unifié
    API_BASE_URL: API_URL, // Compatibilité avec le code existant
  },
  plugins: [
    'expo-secure-store',
    'expo-sqlite',
  ],
  experiments: {
    tsconfigPaths: true,
  },
};

export default config;

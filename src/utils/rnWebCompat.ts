/**
 * FI9_NAYEK: React Native Web Compatibility Layer
 * Provides web-compatible alternatives for RN components
 * 
 * NOTE: Components should import directly from 'react-native' 
 * react-native-web handles the compatibility automatically
 */

// Platform detection utilities
export const isWeb = typeof window !== 'undefined';
export const isMobile = !isWeb;

// Re-export react-native components (react-native-web handles web compatibility)
export {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';


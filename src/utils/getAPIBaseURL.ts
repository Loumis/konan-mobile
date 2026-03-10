/**
 * FI9_NAYEK: Universal API Base URL Detection (RN + Web)
 * Stable implementation using Platform.OS
 */
import { Platform } from "react-native";

const LOCAL_API = "http://127.0.0.1:8000";
const LAN_API = "http://192.168.0.184:8000";

/**
 * Check if we're in a web environment (React Native safe)
 */
function isWebEnv() {
  if (typeof window === "undefined") return false;
  if (typeof window.location === "undefined") return false;
  return true;
}

export function getAPIBaseURL() {
  // React Native Mobile (Android/iOS)
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return LAN_API;
  }

  // Web environment
  if (isWebEnv()) {
    const host = window.location.hostname;

    // Local network IP detection (192.x, 10.x, 172.x)
    if (host.startsWith("192.") || host.startsWith("10.") || host.startsWith("172.")) {
      return LAN_API;
    }

    // Localhost
    return LOCAL_API;
  }

  // Default fallback (should not happen, but safety net)
  return LAN_API;
}

// Export singleton instance
export const API_BASE_URL = getAPIBaseURL();

console.log(`[FI9] API Base URL detected: ${API_BASE_URL} (Platform: ${Platform.OS})`);

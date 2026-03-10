// FI9_NAYEK v14 — MOBILE FIX
// useKeyboardHeight.js — Hook for Android keyboard height tracking
// Android-first implementation using Keyboard API
import { useState, useEffect } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Hook to track keyboard height
 * For Android with adjustResize, this provides the keyboard height for manual adjustments
 * @returns {number} Keyboard height in pixels
 */
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android") {
      // iOS uses KeyboardAvoidingView, so we don't need this
      return;
    }

    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
}

export default useKeyboardHeight;

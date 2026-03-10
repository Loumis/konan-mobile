// FI9_PATCH v13.1 - Rork UI integration
// Color constants inspired by Rork ChatGPT-like UI
// Adapted for KONAN theme system

const tintColorLight = "#2f95dc";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  // FI9_PATCH: ChatGPT-like chat colors (from Rork)
  chat: {
    // Message bubbles
    userBubble: "#007AFF",
    assistantBubble: "#F2F2F7",
    
    // Text colors
    textPrimary: "#000000",
    textSecondary: "#8E8E93",
    userText: "#FFFFFF",
    assistantText: "#000000",
    
    // UI elements
    border: "#E5E5EA",
    surface: "#F2F2F7",
    background: "#FFFFFF",
    
    // Accent
    accent: "#007AFF",
    
    // Sidebar
    sidebarBackground: "#FFFFFF",
    sidebarBorder: "#E5E5EA",
    sidebarActive: "#F2F2F7",
  },
};

// Export chat colors for easy access
export const chatColors = {
  userBubble: "#007AFF",
  assistantBubble: "#F2F2F7",
  textMuted: "#8E8E93",
  border: "#E5E5EA",
  surface: "#F2F2F7",
  background: "#FFFFFF",
  accent: "#007AFF",
};

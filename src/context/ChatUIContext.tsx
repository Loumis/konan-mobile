/**
 * FI9_NAYEK: Chat UI Context (scroll state, compression state, etc.)
 */
import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

interface MessageCompressionState {
  [messageId: string]: boolean; // true = expanded, false = compressed
}

interface ChatUIContextValue {
  // Auto-scroll state
  isAtBottom: boolean;
  setIsAtBottom: (value: boolean) => void;
  shouldAutoScroll: boolean;
  setShouldAutoScroll: (value: boolean) => void;
  
  // Message compression
  compressionState: MessageCompressionState;
  toggleMessageExpansion: (messageId: string) => void;
  isMessageExpanded: (messageId: string) => boolean;
  
  // Scroll refs
  scrollViewRef: React.RefObject<any>;
  messagesEndRef: React.RefObject<any>;
}

const ChatUIContext = createContext<ChatUIContextValue | undefined>(undefined);

export const useChatUI = () => {
  const context = useContext(ChatUIContext);
  if (!context) {
    throw new Error('useChatUI must be used within ChatUIProvider');
  }
  return context;
};

interface ChatUIProviderProps {
  children: ReactNode;
}

export const ChatUIProvider: React.FC<ChatUIProviderProps> = ({ children }) => {
  const [isAtBottom, setIsAtBottomState] = useState(true);
  const [shouldAutoScroll, setShouldAutoScrollState] = useState(true);
  const [compressionState, setCompressionState] = useState<MessageCompressionState>({});
  
  const scrollViewRef = useRef<any>(null);
  const messagesEndRef = useRef<any>(null);

  const setIsAtBottom = useCallback((value: boolean) => {
    setIsAtBottomState(value);
    // If user scrolls up, disable auto-scroll
    if (!value) {
      setShouldAutoScrollState(false);
    }
  }, []);

  const setShouldAutoScroll = useCallback((value: boolean) => {
    setShouldAutoScrollState(value);
    // If enabling auto-scroll, assume user is at bottom
    if (value) {
      setIsAtBottomState(true);
    }
  }, []);

  const toggleMessageExpansion = useCallback((messageId: string) => {
    setCompressionState((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  }, []);

  const isMessageExpanded = useCallback((messageId: string) => {
    return compressionState[messageId] ?? false;
  }, [compressionState]);

  const value: ChatUIContextValue = {
    isAtBottom,
    setIsAtBottom,
    shouldAutoScroll,
    setShouldAutoScroll,
    compressionState,
    toggleMessageExpansion,
    isMessageExpanded,
    scrollViewRef,
    messagesEndRef,
  };

  return <ChatUIContext.Provider value={value}>{children}</ChatUIContext.Provider>;
};


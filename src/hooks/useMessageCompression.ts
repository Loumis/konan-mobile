/**
 * FI9_NAYEK: Message compression hook for long messages
 */
import { useMemo, useCallback } from 'react';
import { useChatUI } from '../context/ChatUIContext';

interface UseMessageCompressionOptions {
  maxLines?: number;
  maxChars?: number;
}

const DEFAULT_MAX_LINES = 6;
const DEFAULT_MAX_CHARS = 500;

export const useMessageCompression = (options: UseMessageCompressionOptions = {}) => {
  const { maxLines = DEFAULT_MAX_LINES, maxChars = DEFAULT_MAX_CHARS } = options;
  const { isMessageExpanded, toggleMessageExpansion } = useChatUI();

  /**
   * Check if message should be compressed
   */
  const shouldCompress = useCallback((text: string) => {
    if (!text) return false;
    
    // Check character count
    if (text.length > maxChars) return true;
    
    // Check line count
    const lines = text.split('\n');
    if (lines.length > maxLines) return true;
    
    return false;
  }, [maxLines, maxChars]);

  /**
   * Get compressed text preview
   */
  const getCompressedText = useCallback((text: string, messageId: string) => {
    if (!shouldCompress(text)) return text;
    if (isMessageExpanded(messageId)) return text;

    const lines = text.split('\n');
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n');
    }
    
    if (text.length > maxChars) {
      return text.substring(0, maxChars);
    }
    
    return text;
  }, [shouldCompress, isMessageExpanded, maxLines, maxChars]);

  /**
   * Toggle expansion for a message
   */
  const toggleExpansion = useCallback((messageId: string) => {
    toggleMessageExpansion(messageId);
  }, [toggleMessageExpansion]);

  return {
    shouldCompress,
    getCompressedText,
    toggleExpansion,
    isExpanded: isMessageExpanded,
  };
};


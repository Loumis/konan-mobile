// LEGACY_FI9: fichier déplacé automatiquement, plus utilisé par l'app mobile
/**
 * FI9_NAYEK: Chat Input Component - ChatGPT Style
 * Auto-resize input with gradient send button
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// WEB_UI: Composant web actif
import { useKonanTheme } from '../../hooks/useKonanTheme';
import { PrimaryGradient } from '../../styles/gradients';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Tapez votre message...',
  disabled = false,
  maxLength = 4000,
}) => {
  const theme = useKonanTheme();
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || disabled) return;
    
    onSend(trimmed);
    setInputText('');
    setInputHeight(40);
  };

  const handleChangeText = (text: string) => {
    if (text.length <= maxLength) {
      setInputText(text);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bgSecondary,
          borderTopColor: theme.colors.border,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius['2xl'],
            borderColor: theme.colors.border,
            borderWidth: 1,
            minHeight: 40,
            maxHeight: 120,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={inputText}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          multiline
          maxLength={maxLength}
          editable={!disabled}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              fontSize: theme.typography.base.fontSize,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              height: Math.max(40, inputHeight),
            },
          ]}
          onContentSizeChange={(event) => {
            const height = Math.min(Math.max(40, event.nativeEvent.contentSize.height), 120);
            setInputHeight(height);
          }}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim() || disabled}
          style={styles.sendButton}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <PrimaryGradient
            style={[
              styles.sendButtonGradient,
              {
                borderRadius: theme.radius.full,
                opacity: inputText.trim() && !disabled ? 1 : 0.5,
              },
            ]}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </PrimaryGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

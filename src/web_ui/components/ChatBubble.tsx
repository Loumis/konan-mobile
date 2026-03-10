// LEGACY_FI9: fichier déplacé automatiquement, plus utilisé par l'app mobile
/**
 * FI9_NAYEK: Chat bubble component (user and assistant)
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
// WEB_UI: Composant web actif
import { useKonanTheme } from '../../hooks/useKonanTheme';
import { PrimaryGradient } from '../../styles/gradients';
import { Avatar } from '../../components/Avatar';
import { MessageCompressor } from '../../components/MessageCompressor';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
  avatar?: { uri: string };
  userName?: string;
}

interface ChatBubbleProps {
  message: Message;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  style?: ViewStyle;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  showAvatar = true,
  showTimestamp = false,
  style,
}) => {
  const theme = useKonanTheme();
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTimestamp = (ts?: Date | string) => {
    if (!ts) return '';
    const date = typeof ts === 'string' ? new Date(ts) : ts;
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`${message.role} message`}
    >
      <View style={styles.contentRow}>
        {isAssistant && showAvatar && (
          <Avatar type="assistant" size={32} style={styles.avatar} />
        )}
        
        <View
          style={[
            styles.bubble,
            isUser
              ? {
                  backgroundColor: theme.colors.bubbleUser,
                  borderTopRightRadius: theme.radius.sm,
                }
              : {
                  borderTopLeftRadius: theme.radius.sm,
                },
            {
              borderRadius: theme.radius['2xl'], // 22px ChatGPT style
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
            },
          ]}
        >
          {isAssistant ? (
            <PrimaryGradient
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: theme.radius['2xl'], // 22px ChatGPT style
                  opacity: 0.9,
                },
              ]}
            />
          ) : null}
          
          <View style={styles.messageContent}>
            <MessageCompressor
              messageId={message.id}
              text={message.content}
              textStyle={[
                styles.messageText,
                {
                  color: isAssistant ? '#ffffff' : theme.colors.text,
                  fontSize: theme.typography.base.fontSize,
                  lineHeight: theme.typography.base.lineHeight,
                },
              ]}
            />
            
            {showTimestamp && (
              <Text
                style={[
                  styles.timestamp,
                  {
                    color: isAssistant ? 'rgba(255, 255, 255, 0.7)' : theme.colors.textMuted,
                    fontSize: theme.typography.xs.fontSize,
                  },
                ]}
              >
                {formatTimestamp(message.timestamp)}
              </Text>
            )}
          </View>
        </View>
        
        {isUser && showAvatar && (
          <Avatar
            type="user"
            size={32}
            source={message.avatar}
            name={message.userName}
            style={styles.avatar}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
    gap: 8,
  },
  bubble: {
    overflow: 'hidden',
  },
  messageContent: {
    position: 'relative',
    zIndex: 1,
  },
  messageText: {
    fontWeight: '400',
  },
  timestamp: {
    marginTop: 4,
    fontWeight: '400',
  },
  avatar: {
    marginBottom: 4,
  },
});



/**
 * FI9_NAYEK: Message utility functions
 * LEGACY_FI9: ChatBubble déplacé vers legacy_ui, Message type défini localement
 */
// LEGACY_FI9: ChatBubble déplacé vers legacy_ui, définir Message localement
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
  avatar?: { uri: string };
  userName?: string;
}

/**
 * Check if message is from user
 */
export const isUserMessage = (message: Message): boolean => {
  return message.role === 'user';
};

/**
 * Check if message is from assistant
 */
export const isAssistantMessage = (message: Message): boolean => {
  return message.role === 'assistant';
};

/**
 * Group consecutive messages from same sender
 */
export const groupMessages = (messages: Message[]): Message[][] => {
  if (messages.length === 0) return [];

  const groups: Message[][] = [];
  let currentGroup: Message[] = [messages[0]];

  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];

    // Group if same role and within 5 minutes
    const timeDiff = new Date(curr.timestamp || 0).getTime() - new Date(prev.timestamp || 0).getTime();
    const within5Min = timeDiff < 5 * 60 * 1000;

    if (prev.role === curr.role && within5Min) {
      currentGroup.push(curr);
    } else {
      groups.push(currentGroup);
      currentGroup = [curr];
    }
  }

  groups.push(currentGroup);
  return groups;
};

/**
 * Extract mentions from message
 */
export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return [...new Set(mentions)]; // Remove duplicates
};

/**
 * Extract URLs from message
 */
export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls: string[] = [];
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    urls.push(match[1]);
  }

  return urls;
};


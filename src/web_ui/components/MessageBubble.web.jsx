// LEGACY_FI9: fichier déplacé automatiquement, plus utilisé par l'app mobile
// FI9_NAYEK_PATCH_UI: MessageBubble style ChatGPT (Web version)
import React, { memo } from "react";

function MessageBubble({ role = "assistant", content = "" }) {
  const isUser = role === "user";

  // Avatar pour assistant (icône robot)
  const AssistantAvatar = () => (
    <div style={styles.avatarContainer}>
      <div style={styles.assistantAvatar}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    </div>
  );

  // Avatar pour user (initiale)
  const UserAvatar = () => {
    const initial = "U"; // Peut être extrait de user?.email?.[0]?.toUpperCase() || "U"
    return (
      <div style={styles.avatarContainer}>
        <div style={styles.userAvatar}>
          <span style={styles.userAvatarText}>{initial}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ ...styles.container, ...(isUser ? styles.userContainer : styles.assistantContainer) }}>
      {!isUser && <AssistantAvatar />}
      
      <div style={{ ...styles.bubble, ...(isUser ? styles.userBubble : styles.assistantBubble) }}>
        <p style={{ ...styles.content, ...(isUser ? styles.userContent : styles.assistantContent) }}>
          {content}
        </p>
      </div>

      {isUser && <UserAvatar />}
    </div>
  );
}

export default memo(MessageBubble);

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "12px",
    paddingBottom: "12px",
    gap: "12px",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  assistantContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  assistantAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "16px",
    backgroundColor: "#1f1f1f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#FFFFFF",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "16px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarText: {
    color: "#1f1f1f",
    fontSize: "14px",
    fontWeight: "600",
  },
  bubble: {
    maxWidth: "75%",
    paddingTop: "14px",
    paddingBottom: "14px",
    paddingLeft: "18px",
    paddingRight: "18px",
    borderRadius: "20px",
  },
  assistantBubble: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: "4px",
  },
  userBubble: {
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: "4px",
  },
  content: {
    fontSize: "15px",
    lineHeight: "22px",
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  assistantContent: {
    color: "#FFFFFF",
  },
  userContent: {
    color: "#1f1f1f",
  },
};


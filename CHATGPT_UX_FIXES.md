# ChatGPT-Style UX Fixes

**Date**: 2025-12-20  
**Status**: ✅ Complete

---

## Objective

Make the chat UX indistinguishable from ChatGPT by removing system/status messages from chat bubbles and ensuring only real user messages and assistant replies are displayed.

---

## Problems Fixed

### 1. System/Status Messages in Chat Bubbles
**Before**: Messages like "🔍 **KONAN • Mode Inspecteur**" and "🔍 **Analyse en cours...**" were being added as assistant messages in the chat history.

**After**: These are now UI-only indicators (not added to messages array). Only real user messages and assistant replies appear in chat.

### 2. Markdown Prefixes in Assistant Messages
**Before**: Assistant messages had prefixes like:
- `🔍 **Analyse en cours...**`
- `⚖️ **Conseil juridique**`
- `⚡ **Évaluation juridique**`

**After**: Assistant messages contain only pure conversational text (ChatGPT-style).

### 3. Citation Block Rendering
**Before**: Citations were mixed with message content.

**After**: Citations are rendered separately below the message (not interrupting reading flow).

---

## Files Changed

### 1. `src/features/agent/roleManager.js`
**Change**: Removed markdown prefixes from `applyRoleBehavior()`.
- **Before**: Added prefixes like "🔍 **Analyse en cours...**" to messages
- **After**: Returns base message unchanged (role behavior is UI-only)

### 2. `src/screens/ChatScreen.jsx`
**Changes**:
- Removed code that added `roleTransitionMessage` as assistant messages
- Removed code that added `questionsMessage` as assistant messages
- Updated message processing to extract `reply` field from backend response
- Store `citation_block`, `fi9_proof`, and `fi9` separately (not in content)

### 3. `src/components/chat/MessageList.jsx`
**Change**: Added filtering to exclude system messages.
- Filters out messages with `isSystem: true` or `isAgentQuestions: true`
- Only renders real user and assistant messages

### 4. `src/components/chat/MessageItem.jsx`
**Changes**:
- Use `reply` field from backend (pure conversational text)
- Render `citation_block` separately below message
- Citations don't interrupt reading flow

### 5. `src/services/ChatService.js`
**Change**: Updated to extract backend response fields correctly.
- Extracts `reply` field (pure conversational text)
- Stores `citation_block`, `fi9_proof`, and `fi9` separately

---

## Backend Response Format

The backend now returns:
```json
{
  "reply": "pure conversational text",
  "citation_block": "---\nSources:\n...",
  "fi9_proof": {...},
  "fi9": {
    "legal_scope": "tunisia",
    "source": "JORT",
    "confidence": "high",
    "refusal": false
  }
}
```

Frontend:
- Renders `reply` in assistant bubble
- Renders `citation_block` below message (separate section)
- `fi9_proof` shown only via "Vérifier" button
- `fi9` metadata used for badges/indicators (not in chat)

---

## Acceptance Tests

### ✅ Test A: User sends "Bonjour"
- Chat shows user bubble "Bonjour"
- Shows typing indicator (three dots)
- Then assistant reply bubble only (no "Analyse en cours", no "Mode Inspecteur" in chat)

### ✅ Test B: Backend refuses
- Shows refusal text as normal assistant reply (ChatGPT-style)
- Citations/proof appear only in optional expandable sections

### ✅ Test C: Reload chat
- History contains only real messages; no system/status messages

---

## UI Behavior

### Typing Indicator
- Shows three animated dots while awaiting `/api/chat` response
- Positioned below last assistant bubble OR at bottom above input
- **Not** added as a message entry
- Hidden when response arrives

### Citations
- Rendered below assistant message in separate section
- Collapsed by default in Free mode
- Visible in Inspecteur mode (optional)
- Don't interrupt reading flow

### FI9 Proof
- Hidden by default
- Shown only via "Vérifier" button
- Not rendered in main chat flow

---

## Confirmation

✅ **Chat stream contains only real user + assistant messages**

- No system messages
- No status messages
- No markdown prefixes
- Pure conversational text only
- Citations/proof separate (not interrupting)

**Chat UX is now indistinguishable from ChatGPT while maintaining FI9 legal integrity.**


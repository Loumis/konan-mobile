# Web UI Components

**IMPORTANT**: Ce dossier contient les composants UI ACTIFS pour la version WEB (Vite) de KONAN.

**CLARIFICATION**: Le nom "legacy_ui" était trompeur. Ces composants sont **ACTIFS** et utilisés par `src/App.jsx` (version web).

## Composants Actifs (Version Web)

### Screens
- `ConversationsScreen.jsx` - Écran de conversations (web)
- `PdfPreviewScreen.jsx` - Écran de prévisualisation PDF (web)

### Components
- `Sidebar.jsx` - Sidebar web (utilisé par src/App.jsx) ✅ ACTIF
- `ChatArea.jsx` - Zone de chat web (utilisé par src/App.jsx) ✅ ACTIF
- `MessageInput.jsx` - Input de message web (utilisé par ChatArea) ✅ ACTIF
- `ChatBubble.tsx` - Bulle de message web ✅ ACTIF
- `ChatInput.tsx` - Input alternatif web ✅ ACTIF
- `TypingIndicator.jsx` - Indicateur typing web ✅ ACTIF
- `HeaderDynamic.tsx` - Header dynamique web
- `AttachmentBar.jsx` - Barre d'attachements web
- `MessageBubble.web.jsx` - Bulle de message web alternative

### Navigation
- Vide (navigation dans App.js mobile)

## Architecture Duale

**Mobile**: 
- Entry point: `App.js` (root)
- UI: `src/components/` + `src/screens/`
- Runtime: Expo / React Native

**Web**:
- Entry point: `src/App.jsx`
- UI: `src/web_ui/components/`
- Runtime: Vite / React

## Fichiers Déplacés vers /src/debug

Les fichiers de debug/test ont été déplacés vers `/src/debug`:
- `ApiTester.jsx` - Test API (debug)
- `FI9_DEBUG_TOKEN.jsx` - Debug token (debug)
- `AuthTest.js` - Test auth (debug)

## Fichiers Supprimés (Nettoyage Phase 2)

Fichiers inutiles/doublons supprimés:
- `SidebarKonan.tsx` - Sidebar alternative (non utilisé)
- `CitationChips.jsx` - Composant citations (non utilisé)
- `PlanGate.jsx` - Gate pour plans (non utilisé)
- `Sidebar.tsx` - Doublon (garder .jsx)
- `TypingIndicator.tsx` - Doublon (garder .jsx)
- `ConversationsScreen.tsx` - Doublon (garder .jsx)
- `AppNavigator.jsx` - Navigation (non utilisé)

## Restauration

Si vous avez besoin d'un fichier supprimé, consultez l'historique Git.

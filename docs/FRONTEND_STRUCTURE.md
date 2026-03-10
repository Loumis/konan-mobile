# FRONTEND STRUCTURE - KONAN Mobile v2

**Date**: 17 Décembre 2025  
**Version**: Post-Cleanup Phase 2  
**Status**: Architecture Duale (Mobile + Web)

---

## ARCHITECTURE GLOBALE

KONAN Mobile v2 utilise une **architecture duale** permettant de déployer sur :
1. **Mobile** (iOS/Android) via Expo / React Native
2. **Web** via Vite / React

---

## ENTRY POINTS (POINTS D'ENTRÉE)

### 📱 Mobile (React Native / Expo)

```
index.js (racine)
  ↓
App.js (racine)
  ↓
src/screens/ChatScreen.jsx (écran principal)
```

**Détails**:
- `index.js` : Point d'entrée Expo (`registerRootComponent`)
- `App.js` : Root component mobile avec navigation (`@react-navigation/native`)
- Navigation Stack : Login → Register → Chat → Subscribe
- UI : `src/components/` + `src/screens/`

### 🌐 Web (Vite / React)

```
src/main.jsx (Vite entry)
  ↓
src/App.jsx (Web app)
  ↓
src/web_ui/components/ChatArea.jsx + Sidebar.jsx
```

**Détails**:
- `src/main.jsx` : Point d'entrée Vite
- `src/App.jsx` : Root component web (sans navigation native)
- UI : `src/web_ui/components/`
- Styles : Tailwind CSS + inline styles

---

## STRUCTURE DOSSIERS

```
D:\dev\konanmobile2\
│
├── 📱 MOBILE ENTRY POINTS
│   ├── index.js                     → Expo entry
│   └── App.js                       → Mobile root (navigation)
│
├── 🌐 WEB ENTRY POINTS
│   ├── src/main.jsx                 → Vite entry
│   └── src/App.jsx                  → Web root
│
├── 📂 src/ (CODE SOURCE)
│   │
│   ├── 🖥️ screens/ (MOBILE SCREENS)
│   │   ├── ChatScreen.jsx           ✅ Écran principal mobile
│   │   ├── ChatScreenKeyboardSafe.jsx ⚠️ Backup ?
│   │   ├── LoginScreen.jsx          ✅ Mobile login
│   │   ├── RegisterScreen.jsx       ✅ Mobile register
│   │   ├── SettingsScreen.tsx       ✅ Mobile settings
│   │   └── SubscribeScreen.jsx      ✅ Mobile subscribe
│   │
│   ├── 🧩 components/ (MOBILE COMPONENTS)
│   │   ├── ChatSidebar.jsx          ✅ Sidebar mobile
│   │   ├── ChatSidebarModal.jsx     ✅ Drawer mobile
│   │   ├── Composer.jsx             ✅ Input principal mobile
│   │   ├── AnimatedMessageBubble.jsx ✅ Messages animés
│   │   ├── ChatHeader.jsx           ✅ Header mobile
│   │   ├── ChatTypingIndicator.jsx  ✅ Typing mobile
│   │   ├── FI9_AttachmentsSheet.jsx ✅ Attachments mobile
│   │   ├── VoiceInput.jsx           ✅ Voice input
│   │   ├── TTSButton.jsx            ✅ Text-to-speech
│   │   └── ... (22 composants total)
│   │
│   ├── 🌐 web_ui/ (WEB COMPONENTS)
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          ✅ Sidebar web (utilisé par src/App.jsx)
│   │   │   ├── ChatArea.jsx         ✅ Zone chat web (utilisé par src/App.jsx)
│   │   │   ├── MessageInput.jsx     ✅ Input web
│   │   │   ├── ChatBubble.tsx       ✅ Bubble web
│   │   │   ├── ChatInput.tsx        ✅ Input alternatif
│   │   │   └── TypingIndicator.jsx  ✅ Typing web
│   │   └── screens/
│   │       ├── ConversationsScreen.jsx ✅ Conversations web
│   │       └── PdfPreviewScreen.jsx    ✅ PDF preview web
│   │
│   ├── 🔐 context/ (SHARED CONTEXTS)
│   │   ├── AuthContext.js           ✅ Auth principal
│   │   ├── AppThemeContext.tsx      ✅ Theme mobile
│   │   ├── AppThemeProvider.jsx     ✅ Theme provider
│   │   ├── LanguageContext.tsx      ✅ i18n
│   │   ├── LanguageProvider.jsx     ✅ i18n provider
│   │   ├── ThemeContext.tsx         ⚠️ À unifier avec theme/
│   │   ├── ThemeProvider.js         ⚠️ À unifier avec theme/
│   │   └── ChatUIContext.tsx        ✅ UI state
│   │
│   ├── 🌐 api/ (API CLIENT)
│   │   ├── client.ts                ✅ API client principal (Axios)
│   │   ├── client.js                ✅ Wrapper pour compat
│   │   ├── authInterceptor.ts       ✅ Interceptor auth
│   │   ├── http.js                  ⚠️ Utilisé ?
│   │   └── types.ts                 ✅ Types API
│   │
│   ├── 🛠️ services/ (BUSINESS LOGIC)
│   │   ├── AuthService.js           ✅ Service auth
│   │   ├── ChatService.js           ✅ Service chat (principal)
│   │   ├── UploadService.js         ✅ Upload files
│   │   ├── PdfService.js            ✅ PDF handling
│   │   ├── SyncService.js           ✅ Sync data
│   │   ├── DiagService.js           ✅ Diagnostics
│   │   ├── chat.ts                  ⚠️ Doublon avec ChatService ?
│   │   ├── client.ts                ⚠️ Doublon avec api/client ?
│   │   ├── status.service.ts        ✅ Status API
│   │   └── ui.sync.ts               ✅ UI sync
│   │
│   ├── 🪝 hooks/ (CUSTOM HOOKS)
│   │   ├── useAuth.js               ✅ Hook auth
│   │   ├── useTheme.js              ✅ Hook theme
│   │   ├── useLanguage.js           ✅ Hook i18n
│   │   ├── useKonanTheme.ts         ✅ Hook theme Konan
│   │   ├── useKeyboardHeight.js     ✅ Keyboard mobile
│   │   └── useMessageCompression.ts ✅ Compression messages
│   │
│   ├── 🗄️ store/ (LOCAL STORAGE)
│   │   ├── sqlite.js                ✅ SQLite init
│   │   ├── dao.js                   ✅ SQLite DAO
│   │   └── localStore.js            ✅ AsyncStorage wrapper
│   │
│   ├── 🛠️ utils/ (UTILITIES)
│   │   ├── chatStorage.js           ✅ Storage chat SQLite
│   │   ├── getAPIBaseURL.ts         ✅ API URL config
│   │   ├── token.ts                 ✅ Token management
│   │   ├── env.js                   ✅ Env variables
│   │   ├── host.ts                  ✅ Host utils
│   │   ├── formatting.ts            ✅ Format utils
│   │   ├── messageTools.ts          ✅ Message helpers
│   │   ├── citations.js             ✅ Citations parser
│   │   ├── htmlExport.js            ✅ Export HTML
│   │   ├── languageStorage.js       ✅ Language storage
│   │   ├── rnWebCompat.ts           ✅ RN/Web compat
│   │   └── constants.ts             ✅ Constants
│   │
│   ├── 🎨 styles/ (DESIGN SYSTEM)
│   │   ├── DesignSystem.ts          ✅ Design tokens
│   │   ├── shadows.ts               ✅ Shadows
│   │   └── gradients.tsx            ✅ Gradients
│   │
│   ├── 🎨 theme/ (THEME)
│   │   ├── colors.js                ⚠️ Doublon avec constants/colors
│   │   ├── fi9-dark.ts              ✅ Dark theme
│   │   ├── fi9Layout.js             ✅ Layout
│   │   ├── ThemeContext.ts          ⚠️ Doublon avec context/
│   │   └── ThemeProvider.tsx        ⚠️ Doublon avec context/
│   │
│   ├── 🌍 i18n/ (INTERNATIONALISATION)
│   │   ├── fr.json                  ✅ Français
│   │   ├── en.json                  ✅ Anglais
│   │   └── ar.json                  ✅ Arabe
│   │
│   ├── 📦 config/
│   │   ├── api.ts                   ✅ Config API
│   │   └── config.ts                ✅ Config app
│   │
│   ├── 🔒 auth/
│   │   ├── AuthContext.js           ⚠️ DEPRECATED (wrapper)
│   │   └── endpoints.ts             ✅ Auth endpoints
│   │
│   └── 🐛 debug/ (DEBUG FILES)
│       ├── ApiTester.jsx            🔧 Debug API
│       ├── FI9_DEBUG_TOKEN.jsx      🔧 Debug token
│       ├── AuthTest.js              🔧 Test auth
│       ├── FI9_FORCE_LOGOUT.js      🔧 Force logout
│       └── FI9_NETWORK_TEST_TEMP.ts 🔧 Network test
│
└── 📄 CONFIGURATION
    ├── app.config.ts                ✅ Expo config (SDK 54)
    ├── babel.config.js              ✅ Babel (Reanimated)
    ├── vite.config.js/mjs           ⚠️ Doublon (2 fichiers)
    ├── tailwind.config.js           ✅ Tailwind (web)
    └── package.json                 ✅ Dépendances
```

---

## RÈGLES D'ARCHITECTURE

### 📱 Mobile UI

**Utiliser**:
- `src/components/` → Composants mobile
- `src/screens/` → Écrans mobile
- `src/hooks/` → Hooks custom
- `src/services/` → Logique métier
- `src/store/` → Storage local (SQLite, AsyncStorage)

**Entry Point**: `App.js` (root)

**Navigation**: `@react-navigation/native` (Stack Navigator)

**Styling**: StyleSheet.create + inline styles + constants/colors

### 🌐 Web UI

**Utiliser**:
- `src/web_ui/components/` → Composants web
- `src/web_ui/screens/` → Écrans web (si nécessaire)
- `src/services/` → Logique métier (partagée)
- `localStorage` → Storage (pas SQLite)

**Entry Point**: `src/App.jsx`

**Navigation**: Gestion manuelle (pas de React Navigation)

**Styling**: Tailwind CSS + inline styles

### 🔄 Code Partagé (Mobile + Web)

**Partager**:
- `src/api/` → API client
- `src/services/` → Services métier
- `src/context/` → Contexts (Auth, Theme, Language)
- `src/hooks/` → Hooks (sauf useKeyboardHeight)
- `src/utils/` → Utilitaires (sauf chatStorage pour SQLite)
- `src/i18n/` → Traductions

**NE PAS partager**:
- Components UI (mobile ≠ web)
- Storage (SQLite mobile vs localStorage web)
- Navigation

---

## FLUX DE DONNÉES

### Authentification

```
User Login
  ↓
LoginScreen/src/App.jsx
  ↓
AuthService.login()
  ↓
api/client.ts (POST /auth/login)
  ↓
AuthContext.setToken()
  ↓
AsyncStorage.setItem('token')
  ↓
Navigate to ChatScreen
```

### Envoi Message (Mobile)

```
User types message
  ↓
Composer.jsx (onSend)
  ↓
ChatScreen.handleSendMessage()
  ↓
ChatService.sendMessage(text, token)
  ↓
api/client.ts (POST /chat/send)
  ↓
Response → Update messages state
  ↓
chatStorage.saveMessages() → SQLite
  ↓
FlatList re-render
```

### Envoi Message (Web)

```
User types message
  ↓
MessageInput.jsx (onSend)
  ↓
App.jsx handleSend()
  ↓
ChatService.sendMessage(text, token)
  ↓
api/client.ts (POST /chat/send)
  ↓
Response → Update chats state
  ↓
ChatArea re-render
```

---

## DOUBLONS À RÉSOUDRE (PHASE 3)

⚠️ **Doublons identifiés** (non critiques, à unifier plus tard):

1. **Theme**:
   - `src/context/ThemeContext.tsx` + `src/context/ThemeProvider.js`
   - `src/theme/ThemeContext.ts` + `src/theme/ThemeProvider.tsx`
   - **Action**: Unifier vers `context/` OU `theme/`

2. **Colors**:
   - `src/constants/colors.js`
   - `src/theme/colors.js`
   - **Action**: Fusionner en 1 fichier

3. **Vite Config**:
   - `vite.config.js`
   - `vite.config.mjs`
   - **Action**: Garder 1 seul

4. **Services** (à clarifier):
   - `src/services/chat.ts` vs `src/services/ChatService.js`
   - `src/services/client.ts` vs `src/api/client.ts`
   - **Action**: Vérifier usage, supprimer doublons

---

## TESTS

**Status actuel**: ❌ Aucun test

**À ajouter** (Phase 3+):
- Tests unitaires : Services, Utils, Hooks
- Tests composants : React Testing Library
- Tests E2E : Detox (mobile) / Playwright (web)

---

## MIGRATION LEGACY → MODERNE

### Phase 2 (COMPLÉTÉE) ✅

- ✅ Suppression fichiers inutiles (11 fichiers)
- ✅ Déplacement debug vers `/src/debug` (5 fichiers)
- ✅ Renommage `legacy_ui/` → `web_ui/`
- ✅ Update imports

### Phase 3 (À VENIR)

- ⚠️ Unification Theme (context vs theme)
- ⚠️ Unification Colors
- ⚠️ Résolution doublons services
- ⚠️ Ajout actions sessions (rename, delete)
- ⚠️ Ajout recherche historique

---

## MAINTENANCE

### Ajout Nouveau Composant Mobile

1. Créer dans `src/components/NomComposant.jsx`
2. Utiliser hooks depuis `src/hooks/`
3. Importer dans `src/screens/ChatScreen.jsx` si nécessaire
4. Styles : StyleSheet.create + constants/colors

### Ajout Nouveau Composant Web

1. Créer dans `src/web_ui/components/NomComposant.jsx`
2. Utiliser services depuis `src/services/`
3. Importer dans `src/App.jsx` si nécessaire
4. Styles : Tailwind CSS

### Modification API

1. Modifier `src/api/client.ts`
2. Ajouter types dans `src/api/types.ts`
3. Modifier services concernés dans `src/services/`
4. Aucune modification UI nécessaire (séparation concerns)

---

## RESSOURCES

**Documentation**:
- `/docs/FRONTEND_UI_AUDIT_PHASE_0_1.md` → Audit complet
- `/docs/FRONTEND_CLEANUP_PHASE_2.md` → Rapport nettoyage
- `/docs/FRONTEND_STRUCTURE.md` → Ce fichier

**Backend**:
- Status : STABLE & GELÉ
- Ne PAS modifier sans validation Release Manager

**Support**:
- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
- Vite 6.x

---

**Dernière mise à jour**: 17 Décembre 2025  
**Auteur**: Architecte Frontend Senior  
**Protocole**: FI9_NAYEK Phase 2


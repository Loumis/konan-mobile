# FI9 Deprecated Files

**Date:** 2025-01-22  
**Mission:** Fichiers déplacés lors de l'audit FI9 v13.1

## 📋 Fichiers déplacés

Ces fichiers ont été déplacés car ils sont:
- ❌ Non utilisés dans l'app mobile
- ❌ Doublons de composants actifs
- ❌ Composants Rork créés mais jamais intégrés

## 🔄 Restauration

Si vous avez besoin de restaurer un fichier, déplacez-le simplement depuis `docs/deprecated_fi9/` vers son emplacement d'origine dans `src/`.

---

## 📁 Structure

### Components

1. **MessageBubble.jsx**
   - **Ancien chemin:** `src/components/MessageBubble.jsx`
   - **Raison:** Doublon de `AnimatedMessageBubble.jsx` (version simple sans animations)
   - **Remplacement:** `src/components/AnimatedMessageBubble.jsx` (utilisé dans ChatScreen)

2. **SessionsSidebar.jsx**
   - **Ancien chemin:** `src/components/SessionsSidebar.jsx`
   - **Raison:** Composant Rork créé mais jamais utilisé (ChatSidebar fixe préféré)
   - **Remplacement:** `src/components/ChatSidebar.jsx` (utilisé dans ChatScreen)

---

## ✅ Status

- ✅ Fichiers déplacés (non supprimés)
- ✅ Projet mobile fonctionnel sans ces fichiers
- ✅ Restauration possible si nécessaire

---

**FI9_DEPRECATED v13.1**  
**Date:** 2025-01-22


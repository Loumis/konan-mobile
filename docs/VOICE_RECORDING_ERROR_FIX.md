# 🔧 CORRECTION ERREUR VOICE RECORDING

**Date** : 17 Décembre 2025  
**Issue** : `Error: Only one Recording object can be prepared at a given time.`  
**Fichier** : `src/features/voice/useVoiceRecorder.ts`  

---

## ⚠️ PROBLÈME IDENTIFIÉ

### **Erreur observée**
```
ERROR  [VOICE] Erreur startRecording: [Error: Only one Recording object can be prepared at a given time.]
```

### **Cause racine**

Le problème survient quand :
1. Un objet `Recording` n'est **pas correctement nettoyé** après utilisation
2. L'utilisateur tente de créer un **nouvel enregistrement** alors qu'un ancien est encore en mémoire
3. Le composant est **démonté** sans cleanup de l'enregistrement en cours

**expo-av** limite strictement à **UN SEUL objet Recording actif** à la fois.

---

## ✅ SOLUTION IMPLÉMENTÉE

### **1. Ajout useEffect Cleanup**

```typescript
// Cleanup au démontage du composant
useEffect(() => {
  return () => {
    // Cleanup de l'enregistrement en cours si le composant est démonté
    if (recordingRef.current) {
      recordingRef.current
        .stopAndUnloadAsync()
        .then(() => {
          console.log("[VOICE] Cleanup enregistrement au démontage");
        })
        .catch((err) => {
          console.error("[VOICE] Erreur cleanup:", err);
        });
    }
  };
}, []);
```

**Rôle** : Nettoie automatiquement l'enregistrement si le composant est démonté (changement de screen, navigation, etc.)

---

### **2. Protection startRecording**

**AVANT** :
```typescript
const startRecording = useCallback(async () => {
  // Pas de vérification de l'enregistrement précédent
  const { recording } = await Audio.Recording.createAsync(...);
  recordingRef.current = recording;
}, []);
```

**APRÈS** :
```typescript
const startRecording = useCallback(async () => {
  // PROTECTION: Ne pas démarrer si un enregistrement est déjà en cours
  if (recordingRef.current) {
    console.warn("[VOICE] Enregistrement déjà en cours, nettoyage...");
    try {
      await recordingRef.current.stopAndUnloadAsync();
    } catch (e) {
      console.error("[VOICE] Erreur nettoyage enregistrement précédent:", e);
    }
    recordingRef.current = null;
  }

  // Maintenant on peut créer un nouvel enregistrement
  const { recording } = await Audio.Recording.createAsync(...);
  recordingRef.current = recording;
}, []);
```

**Rôle** : Vérifie et nettoie un enregistrement précédent avant d'en créer un nouveau

---

### **3. Amélioration stopRecording**

**AVANT** :
```typescript
await recordingRef.current.stopAndUnloadAsync();
await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

const uri = recordingRef.current.getURI();
recordingRef.current = null;  // Nettoyage APRÈS getURI

// Si erreur ici, recordingRef.current n'est JAMAIS nettoyé
```

**APRÈS** :
```typescript
// Sauvegarder la référence AVANT de nettoyer
const recording = recordingRef.current;

try {
  await recording.stopAndUnloadAsync();
} catch (stopError) {
  console.warn("[VOICE] Erreur stopAndUnloadAsync (ignorée):", stopError);
}

const uri = recording.getURI();

// IMPORTANT: Nettoyer la référence AVANT le traitement STT
recordingRef.current = null;

// ... traitement STT (peut échouer sans bloquer le cleanup)
```

**Rôle** : 
- Sauvegarde la référence avant cleanup
- Nettoie `recordingRef.current` **AVANT** les opérations asynchrones longues
- Gère les erreurs sans bloquer le cleanup

---

### **4. Amélioration cancelRecording**

**AVANT** :
```typescript
await recordingRef.current.stopAndUnloadAsync();
await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
recordingRef.current = null;
```

**APRÈS** :
```typescript
try {
  await recordingRef.current.stopAndUnloadAsync();
} catch (stopError) {
  console.warn("[VOICE] Erreur lors de l'arrêt (ignorée):", stopError);
}

try {
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
} catch (audioError) {
  console.warn("[VOICE] Erreur réinitialisation audio (ignorée):", audioError);
}

recordingRef.current = null;

// En cas d'erreur globale, forcer le reset
} catch (error) {
  recordingRef.current = null;  // CRITIQUE
  setState({ isRecording: false, isProcessing: false, error: null });
}
```

**Rôle** : Gère les erreurs individuellement et **garantit** le cleanup même en cas d'échec

---

## 🔬 POURQUOI CES CORRECTIONS FONCTIONNENT

### **Principe de base expo-av**

```
┌─────────────────────────────────────────┐
│   expo-av Audio Recording Lifecycle     │
└─────────────────────────────────────────┘

1. createAsync()      ← Crée un Recording (MAX 1 à la fois)
2. Enregistrement     ← Audio capturé
3. stopAndUnloadAsync() ← LIBÈRE les ressources système
4. Nouveau createAsync() possible
```

**Problème sans cleanup** :
```
Recording #1 créé → Erreur → Recording #1 JAMAIS nettoyé
Recording #2 tenté → ERREUR: "Only one Recording at a time"
```

**Solution avec cleanup** :
```
Recording #1 créé → Erreur → recordingRef.current = null ✓
Recording #2 tenté → Vérification → Cleanup #1 si nécessaire → Succès ✓
```

---

## 📊 TESTS DE VALIDATION

### ✅ **TEST 1 : Enregistrement normal**
1. Appui long sur 🎙️
2. Parler 3 secondes
3. Relâcher
4. Vérifier message envoyé

**Résultat** : ✅ Fonctionne

---

### ✅ **TEST 2 : Appuis multiples rapides**
1. Appui long sur 🎙️
2. Relâcher immédiatement
3. Réappuyer immédiatement
4. Répéter 5 fois

**Résultat** : ✅ Aucune erreur "Only one Recording"

---

### ✅ **TEST 3 : Navigation pendant enregistrement**
1. Appui long sur 🎙️
2. Pendant l'enregistrement, naviguer vers une autre screen
3. Revenir au ChatScreen
4. Réessayer un enregistrement

**Résultat** : ✅ Cleanup automatique, nouvel enregistrement fonctionne

---

### ✅ **TEST 4 : Erreur réseau pendant STT**
1. Enregistrer un message
2. Simuler une erreur pendant le traitement STT
3. Réessayer un nouvel enregistrement

**Résultat** : ✅ recordingRef nettoyé, nouvel enregistrement fonctionne

---

## 🎯 BONNES PRATIQUES APPLIQUÉES

1. **Cleanup systématique** : `useEffect` return pour démontage
2. **Vérification avant création** : Nettoyer l'ancien avant le nouveau
3. **Gestion d'erreur granulaire** : Try/catch individuels
4. **État cohérent** : `recordingRef.current = null` même en cas d'erreur
5. **Logs détaillés** : Facilite le debug

---

## 📋 CHECKLIST CORRECTION

- [x] Ajout useEffect cleanup
- [x] Protection startRecording
- [x] Amélioration stopRecording
- [x] Amélioration cancelRecording
- [x] Import useEffect ajouté
- [x] Tests multiples appuis
- [x] Tests navigation
- [x] Tests erreur
- [x] Aucune erreur linter
- [x] Documentation complète

---

## 🏁 CONCLUSION

### **AVANT**
❌ Erreur "Only one Recording" fréquente  
❌ Enregistrements bloqués après une erreur  
❌ Pas de cleanup au démontage  

### **APRÈS**
✅ Aucune erreur "Only one Recording"  
✅ Enregistrements toujours possibles  
✅ Cleanup automatique garanti  

**Le module Voice est maintenant robuste et production-ready.** ✅

---

**KONAN Mobile v2 — Voice Module corrigé et stabilisé** 🎙️✅


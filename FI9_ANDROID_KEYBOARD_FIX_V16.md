# FI9: Android Keyboard Fix v16.0 - ÉLIMINATION DÉFINITIVE DES BUGS CLAVIER

## ✅ MODIFICATIONS APPLIQUÉES

### 1. app.json / app.config.ts ✅
- `windowSoftInputMode: "adjustResize"` ✅
- `softwareKeyboardLayoutMode: "resize"` ✅

### 2. ChatScreen.jsx ✅
- ❌ **SUPPRIMÉ** : `KeyboardAvoidingView`
- ❌ **SUPPRIMÉ** : `SafeAreaView` autour du chat
- ✅ **Layout fixe** : Input en position absolute en bas
- ✅ **Messages** : `flex: 1` avec `paddingBottom: 70`

### 3. EnhancedMessageInput.jsx ✅
- ✅ **Container neutre** : Pas de `position: absolute`, `bottom`, ou `height` fixe
- ✅ **Flux normal** : Le composant gère uniquement l'apparence, pas la position

---

## 📋 ÉTAPE 4 — MODIFICATION AndroidManifest.xml (APRÈS PREBUILD)

### Commande à exécuter :

```bash
npx expo prebuild --clean
```

### Fichier à modifier :

`android/app/src/main/AndroidManifest.xml`

### Dans la balise `<activity>` principale :

**AVANT** (peut varier) :
```xml
<activity
  android:name=".MainActivity"
  android:windowSoftInputMode="adjustPan"
  ...>
```

**APRÈS** (OBLIGATOIRE) :
```xml
<activity
  android:name=".MainActivity"
  android:windowSoftInputMode="stateAlwaysHidden|adjustResize"
  ...>
```

### ⚠️ RÈGLES STRICTES :

1. ❌ **AUCUN** `adjustPan` autorisé
2. ✅ **UNIQUEMENT** `adjustResize`
3. ✅ Optionnel : `stateAlwaysHidden` (masque le clavier au démarrage)

### Exemple complet :

```xml
<activity
  android:name=".MainActivity"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|smallestScreenSize|uiMode"
  android:windowSoftInputMode="stateAlwaysHidden|adjustResize"
  android:launchMode="singleTask"
  android:theme="@style/Theme.App.SplashScreen"
  android:exported="true">
  <intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
  </intent-filter>
</activity>
```

---

## 🚀 BUILD NATIF OBLIGATOIRE

```bash
npx expo prebuild --clean
npx expo run:android
```

---

## ✅ CRITÈRES DE SUCCÈS NON NÉGOCIABLES

- ✅ Le clavier **pousse l'écran** (resize natif)
- ✅ L'input **RESTE ENTIÈREMENT visible**
- ✅ **Aucun débordement visuel**
- ✅ Messages **scrollables normalement**
- ✅ **Zéro clavier qui écrase l'UI**

---

## 🔍 VÉRIFICATION POST-BUILD

1. Ouvrir l'app sur Android
2. Taper dans le champ de saisie
3. **VÉRIFIER** :
   - Le clavier pousse l'écran vers le haut
   - L'input reste visible au-dessus du clavier
   - Les messages scrollent correctement
   - Aucun chevauchement visuel

---

## 📝 NOTES TECHNIQUES

- **adjustResize** : Android redimensionne la fenêtre pour que l'input reste visible
- **adjustPan** : ❌ INTERDIT - Déplace l'écran mais peut masquer l'input
- **KeyboardAvoidingView** : ❌ SUPPRIMÉ - Conflit avec adjustResize natif
- **Position absolute** : ✅ Utilisé uniquement pour fixer l'input en bas (layout stable)

---

## 🐛 DÉPANNAGE

Si le clavier masque encore l'input :

1. Vérifier `AndroidManifest.xml` : `adjustResize` présent ?
2. Vérifier `app.json` : `windowSoftInputMode: "adjustResize"` ?
3. Rebuild complet : `npx expo prebuild --clean && npx expo run:android`
4. Vérifier qu'aucun `KeyboardAvoidingView` n'est présent dans le code


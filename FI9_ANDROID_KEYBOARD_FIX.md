# FI9: Android Keyboard Fix - Instructions

## ÉTAPE 1 — Configuration app.json/app.config.ts ✅

Les fichiers ont été mis à jour avec :
- `softwareKeyboardLayoutMode: "resize"`
- `windowSoftInputMode: "adjustResize"`

## ÉTAPE 2 — AndroidManifest.xml (après prebuild)

Après avoir exécuté `npx expo prebuild --clean`, vérifier le fichier :

`android/app/src/main/AndroidManifest.xml`

Dans la balise `<activity>` principale, AJOUTER ou REMPLACER :

```xml
android:windowSoftInputMode="stateAlwaysHidden|adjustResize"
```

**IMPORTANT :** Vérifier qu'il n'existe PAS `adjustPan` dans cette ligne.

## ÉTAPE 3 — Structure React Native ✅

- ✅ EnhancedMessageInput n'a plus `position: "absolute"` ni `bottom: 0`
- ✅ L'input est dans le flux vertical normal
- ✅ KeyboardAvoidingView utilise `behavior="height"` sur Android

## ÉTAPE 4 — Rebuild natif OBLIGATOIRE

```bash
npx expo prebuild --clean
npx expo run:android
```

## Vérification

✅ Quand le clavier s'ouvre :
- La zone de saisie REMONTE
- Aucun recouvrement visuel
- Aucun décalage écran
- Comportement identique à WhatsApp / ChatGPT


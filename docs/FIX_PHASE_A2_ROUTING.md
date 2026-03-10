# Fix Phase A.2 - Routage Présentation & CGU

## Problème Identifié

Les écrans **PresentationScreen** et **TermsScreen** (CGU) existaient dans le code mais n'étaient pas facilement accessibles depuis l'application. Bien que les routes soient correctement définies dans `App.js`, les liens de navigation manquaient dans plusieurs écrans.

## Cause Exacte

1. **Routage correct** : Les écrans étaient bien enregistrés dans le Stack Navigator (`App.js` lignes 70 et 93)
2. **Liens manquants** : Les écrans Login et Register n'avaient pas de liens vers Presentation et Terms
3. **Accessibilité limitée** : Seul l'écran Onboarding avait des liens vers ces écrans (mais uniquement sur la dernière slide)

## Corrections Appliquées

### 1. Ajout de liens dans LoginScreen (`src/screens/LoginScreen.jsx`)

**Ajouté** : Section "Legal Links" avec liens vers Presentation et Terms
- Position : Entre le lien "Créer un compte" et "Security Info"
- Styles : `legalLinks`, `legalLink`, `legalLinkText`, `legalLinkSeparator`

```jsx
{/* Legal Links */}
<View style={styles.legalLinks}>
  <TouchableOpacity 
    style={styles.legalLink}
    onPress={() => navigation.navigate('Presentation')}
  >
    <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
      En savoir plus
    </Text>
  </TouchableOpacity>
  <Text style={[styles.legalLinkSeparator, { color: theme.textMuted }]}>•</Text>
  <TouchableOpacity 
    style={styles.legalLink}
    onPress={() => navigation.navigate('Terms')}
  >
    <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
      CGU
    </Text>
  </TouchableOpacity>
</View>
```

### 2. Ajout de liens dans RegisterScreen (`src/screens/RegisterScreen.jsx`)

**Ajouté** :
- Lien cliquable sur "Conditions Générales d'Utilisation" dans le texte des termes
- Section "Legal Links" avec lien vers Presentation

```jsx
{/* Terms */}
<Text style={[styles.termsText, { color: theme.textMuted }]}>
  En créant un compte, vous acceptez nos{" "}
  <TouchableOpacity onPress={() => navigation.navigate("Terms")}>
    <Text style={[styles.termsLink, { color: theme.primary }]}>
      Conditions Générales d'Utilisation
    </Text>
  </TouchableOpacity>
</Text>

{/* Legal Links */}
<View style={styles.legalLinks}>
  <TouchableOpacity 
    style={styles.legalLink}
    onPress={() => navigation.navigate('Presentation')}
  >
    <Text style={[styles.legalLinkText, { color: theme.textMuted }]}>
      En savoir plus
    </Text>
  </TouchableOpacity>
</View>
```

### 3. Amélioration de SettingsScreen (`src/screens/SettingsScreen.jsx`)

**Ajouté** :
- Lien "Présentation KONAN" dans la section "Informations"
- Section "Debug (Temporaire)" avec boutons de test :
  - 🔍 Voir Présentation
  - 📄 Voir CGU

```jsx
{
  title: 'Informations',
  items: [
    {
      label: 'À propos de KONAN',
      onPress: () => navigation.navigate('AboutKonan'),
      type: 'link',
    },
    {
      label: 'Présentation KONAN',
      onPress: () => navigation.navigate('Presentation'),
      type: 'link',
    },
    {
      label: 'Conditions Générales',
      onPress: () => navigation.navigate('Terms'),
      type: 'link',
    },
  ],
},
{
  title: 'Debug (Temporaire)',
  items: [
    {
      label: '🔍 Voir Présentation',
      onPress: () => navigation.navigate('Presentation'),
      type: 'link',
    },
    {
      label: '📄 Voir CGU',
      onPress: () => navigation.navigate('Terms'),
      type: 'link',
    },
  ],
},
```

## Points d'Accès aux Écrans

### Présentation KONAN (`Presentation`)
- ✅ OnboardingScreen (dernière slide) : "En savoir plus"
- ✅ LoginScreen : "En savoir plus"
- ✅ RegisterScreen : "En savoir plus"
- ✅ SettingsScreen : "Présentation KONAN" (section Informations)
- ✅ SettingsScreen : "🔍 Voir Présentation" (section Debug)

### CGU & Confidentialité (`Terms`)
- ✅ OnboardingScreen (dernière slide) : "CGU"
- ✅ LoginScreen : "CGU"
- ✅ RegisterScreen : "Conditions Générales d'Utilisation" (cliquable)
- ✅ SettingsScreen : "Conditions Générales" (section Informations)
- ✅ SettingsScreen : "📄 Voir CGU" (section Debug)
- ✅ PresentationScreen : Lien vers Terms

## Vérification du Routage

### App.js - Stack Navigator
```jsx
<Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
<Stack.Screen name="Presentation" component={PresentationScreen} options={{ title: "Présentation KONAN" }} />
<Stack.Screen name="Terms" component={TermsScreen} options={{ title: "CGU & Confidentialité" }} />
```

✅ **Toutes les routes sont correctement définies**

## Tests Effectués

- ✅ Navigation vers Présentation depuis Onboarding → OK
- ✅ Navigation vers CGU depuis Onboarding → OK
- ✅ Navigation vers Présentation depuis Login → OK
- ✅ Navigation vers CGU depuis Login → OK
- ✅ Navigation vers Présentation depuis Register → OK
- ✅ Navigation vers CGU depuis Register → OK
- ✅ Navigation depuis Settings → OK
- ✅ Thème Jour/Nuit appliqué sur tous les écrans → OK
- ✅ Aucun impact sur Chat/Auth → OK

## Impact

### ✅ Aucune régression
- Chat fonctionne normalement
- Authentification non affectée
- Onboarding intact

### ✅ Améliorations
- Meilleure accessibilité aux écrans légaux
- Conformité RGPD améliorée (CGU facilement accessibles)
- Expérience utilisateur améliorée (liens cohérents)

## Notes

- La section "Debug (Temporaire)" dans SettingsScreen doit être supprimée avant la mise en production
- Les liens légaux sont maintenant accessibles depuis tous les points d'entrée principaux
- Le thème Jour/Nuit est correctement appliqué sur tous les écrans grâce à `useTheme()`

## Fichiers Modifiés

1. `konanmobile2/src/screens/LoginScreen.jsx`
   - Ajout section "Legal Links"
   - Ajout styles `legalLinks`, `legalLink`, `legalLinkText`, `legalLinkSeparator`

2. `konanmobile2/src/screens/RegisterScreen.jsx`
   - Lien cliquable sur "Conditions Générales d'Utilisation"
   - Ajout section "Legal Links"
   - Ajout styles `legalLinks`, `legalLink`, `legalLinkText`

3. `konanmobile2/src/screens/SettingsScreen.jsx`
   - Ajout lien "Présentation KONAN" dans section Informations
   - Ajout section "Debug (Temporaire)" avec boutons de test

## Prochaines Étapes

1. ✅ Tester la navigation depuis tous les points d'accès
2. ✅ Vérifier l'affichage sur différents appareils
3. ⏳ Supprimer la section "Debug (Temporaire)" avant production
4. ⏳ Ajouter analytics pour tracker les accès aux CGU (optionnel)


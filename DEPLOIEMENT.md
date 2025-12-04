# 🚀 Guide de déploiement rapide

Ce guide vous explique comment mettre en ligne rapidement l'application **Village Numérique Résistant** pour la Nuit de l'Info 2025.

## ⚡ Démarrage local (pour tester)

### Windows
Double-cliquez sur `start-server.bat` ou exécutez dans PowerShell :
```powershell
python -m http.server 8000
```

### Linux/Mac
Rendez le script exécutable puis lancez-le :
```bash
chmod +x start-server.sh
./start-server.sh
```

Puis ouvrez votre navigateur à : **http://localhost:8000**

## 🌐 Déploiement en ligne (hébergement gratuit)

### Option 1 : Netlify (recommandé - le plus simple)

1. Allez sur [netlify.com](https://www.netlify.com)
2. Créez un compte gratuit
3. Glissez-déposez le dossier contenant `index.html`, `styles.css` et `script.js` dans la zone de dépôt
4. Votre site est en ligne en quelques secondes !

**Avantages** : HTTPS automatique, nom de domaine gratuit, déploiement continu si vous utilisez Git

### Option 2 : GitHub Pages

1. Créez un dépôt GitHub
2. Uploadez tous les fichiers du projet
3. Allez dans **Settings** > **Pages**
4. Sélectionnez la branche `main` et le dossier `/ (root)`
5. Votre site sera accessible à : `https://votre-username.github.io/nom-du-repo`

### Option 3 : Vercel

1. Installez Vercel CLI : `npm i -g vercel`
2. Dans le dossier du projet, exécutez : `vercel`
3. Suivez les instructions
4. Votre site est déployé !

### Option 4 : GitLab Pages

1. Créez un projet sur GitLab
2. Uploadez les fichiers
3. Créez un fichier `.gitlab-ci.yml` :
```yaml
pages:
  script:
    - echo "Deploying static site"
  artifacts:
    paths:
      - public
  only:
    - main
```
4. Votre site sera accessible via GitLab Pages

### Option 5 : Surge.sh

1. Installez Surge : `npm install -g surge`
2. Dans le dossier du projet : `surge`
3. Suivez les instructions pour créer un compte et choisir un nom de domaine
4. Votre site est en ligne !

## 📦 Structure minimale requise

Pour que l'application fonctionne, vous devez avoir ces fichiers :
```
.
├── index.html    (obligatoire)
├── styles.css    (obligatoire)
└── script.js     (obligatoire)
```

Les autres fichiers (`README.md`, `LICENSE`, etc.) sont optionnels mais recommandés.

## ✅ Checklist avant déploiement

- [ ] Tous les fichiers sont présents (`index.html`, `styles.css`, `script.js`)
- [ ] Le diagnostic fonctionne (testez localement)
- [ ] Le menu mobile fonctionne (testez sur un téléphone ou en mode responsive)
- [ ] Les liens de navigation fonctionnent
- [ ] Le site est responsive (testez différentes tailles d'écran)
- [ ] Aucune erreur dans la console du navigateur (F12)

## 🔧 Personnalisation avant déploiement

### Ajouter des liens externes

Dans `index.html`, section `#ressources`, vous pouvez ajouter des liens vers :
- La Forge des communs numériques éducatifs
- Le site officiel NIRD
- Des ressources spécifiques

Exemple :
```html
<a href="https://forge.education.gouv.fr" target="_blank" rel="noopener">
  Forge des communs numériques éducatifs
</a>
```

### Modifier les couleurs

Dans `styles.css`, modifiez les variables CSS (lignes 7-18) :
```css
:root {
  --color-primary: #2d8659;  /* Changez cette couleur */
  /* ... */
}
```

## 🐛 Problèmes courants

### Les styles ne s'appliquent pas
- Vérifiez que `styles.css` est dans le même dossier que `index.html`
- Vérifiez le chemin dans la balise `<link>` : `<link rel="stylesheet" href="styles.css" />`

### Le JavaScript ne fonctionne pas
- Vérifiez que `script.js` est dans le même dossier que `index.html`
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que JavaScript est activé dans votre navigateur

### Le site ne s'affiche pas correctement
- Videz le cache du navigateur (Ctrl+F5 ou Cmd+Shift+R)
- Vérifiez que tous les fichiers sont bien uploadés
- Testez avec un autre navigateur

## 📱 Test responsive

Testez votre site sur différentes tailles d'écran :
- Mobile : 375px (iPhone)
- Tablette : 768px (iPad)
- Desktop : 1920px

Utilisez les outils de développement du navigateur (F12) pour tester différentes tailles.

## 🎯 Performance

L'application est très légère :
- HTML : ~15 KB
- CSS : ~12 KB
- JavaScript : ~8 KB
- **Total : ~35 KB** (chargement très rapide)

## 📝 Notes importantes

- **Licences** : N'oubliez pas de mentionner les licences (MIT pour le code, CC BY-SA pour les contenus)
- **Images** : Si vous ajoutez des images, utilisez uniquement des ressources libres
- **Liens** : Vérifiez que tous les liens externes fonctionnent avant le déploiement final

---

**Bon déploiement et bonne Nuit de l'Info ! 🌿**


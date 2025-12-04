# 🌿 Village Numérique Résistant

**Application web pour la Nuit de l'Info 2025**

Une application simple et pédagogique pour aider les établissements scolaires (collèges/lycées) à réduire leurs dépendances aux Big Tech et à entrer dans la démarche NIRD (Numérique Inclusif, Responsable et Durable).

## 📋 Contenu

Cette application propose :

- **Une page d'accueil** expliquant les principes du numérique NIRD
- **Un diagnostic interactif** pour évaluer la situation numérique d'un établissement
- **Des fiches-actions** prêtes à l'emploi avec des actions concrètes
- **Une page ressources** listant des logiciels libres et des pratiques durables

## 🚀 Déploiement rapide

### Option 1 : Serveur HTTP simple (Python)

Si Python est installé sur votre machine :

```bash
# Python 3
python -m http.server 8000

# Ou Python 2
python -m SimpleHTTPServer 8000
```

Puis ouvrez votre navigateur à l'adresse : `http://localhost:8000`

### Option 2 : Serveur HTTP simple (Node.js)

Si Node.js est installé :

```bash
# Installer http-server globalement (une seule fois)
npm install -g http-server

# Lancer le serveur
http-server -p 8000
```

### Option 3 : Hébergement statique gratuit

Vous pouvez déployer cette application sur n'importe quel hébergeur de sites statiques :

- **Netlify** : glissez-déposez le dossier ou utilisez Git
- **GitHub Pages** : poussez le code sur GitHub et activez Pages
- **Vercel** : `vercel deploy`
- **GitLab Pages** : similaire à GitHub Pages

### Option 4 : Serveur web classique (Apache/Nginx)

Copiez simplement les fichiers dans le répertoire web de votre serveur (par exemple `/var/www/html` ou `C:\inetpub\wwwroot`).

## 📁 Structure des fichiers

```
.
├── index.html          # Page principale (tout-en-un)
├── styles.css          # Feuille de styles
├── script.js           # Scripts JavaScript
└── README.md           # Ce fichier
```

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans `styles.css` via des variables CSS (lignes 7-18). Vous pouvez les modifier facilement :

```css
:root {
  --color-primary: #2d8659;      /* Couleur principale (vert) */
  --color-secondary: #f4a261;    /* Couleur secondaire (orange) */
  --color-accent: #e76f51;       /* Couleur d'accent (rouge-orange) */
  /* ... */
}
```

### Contenu

Le contenu est directement dans `index.html`. Vous pouvez :
- Modifier les textes des sections
- Ajouter des fiches-actions dans la section `#fiches-actions`
- Ajouter des ressources dans la section `#ressources`

## 📝 Licences

- **Code source (HTML/CSS/JS)** : Licence MIT
- **Contenus textuels** : Licence CC BY-SA 4.0
- **Images/icônes** : À utiliser uniquement des ressources libres (par exemple depuis [The Noun Project](https://thenounproject.com/) avec licence appropriée, ou [Flaticon](https://www.flaticon.com/) en libre)

## 🔧 Technologies utilisées

- HTML5 sémantique
- CSS3 (variables, Grid, Flexbox)
- JavaScript vanilla (pas de dépendances)
- Design responsive (mobile-first)

## 🌐 Compatibilité

L'application fonctionne sur tous les navigateurs modernes :
- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Opéra (dernières versions)

## 📱 Responsive

L'interface s'adapte automatiquement aux écrans :
- Mobile (< 768px)
- Tablette (768px - 968px)
- Desktop (> 968px)

## 🎯 Fonctionnalités

- ✅ Navigation fluide avec menu mobile
- ✅ Diagnostic interactif avec calcul de score
- ✅ Recommandations personnalisées selon le profil
- ✅ Animations au scroll
- ✅ Accessibilité (navigation au clavier, ARIA labels)
- ✅ Design moderne et pédagogique

## 🐛 Dépannage

### Le diagnostic ne s'affiche pas

Vérifiez que le fichier `script.js` est bien chargé et qu'il n'y a pas d'erreurs dans la console du navigateur (F12).

### Les styles ne s'appliquent pas

Vérifiez que le fichier `styles.css` est dans le même répertoire que `index.html` et que le chemin dans la balise `<link>` est correct.

### Le menu mobile ne fonctionne pas

Vérifiez que JavaScript est activé dans votre navigateur.

## 📞 Support

Pour toute question ou suggestion, vous pouvez :
- Ouvrir une issue sur le dépôt Git
- Contacter l'équipe de développement

## 🙏 Remerciements

Cette application a été créée pour la **Nuit de l'Info 2025** sur le thème "Le Village Numérique Résistant : Comment les établissements scolaires peuvent tenir tête aux Big Tech ?".

---

**Bonne résistance numérique ! 🌿**


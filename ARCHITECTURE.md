# 🏗️ Architecture de l'application

## Vue d'ensemble

L'application **Village Numérique Résistant** est une Single Page Application (SPA) construite avec HTML, CSS et JavaScript vanilla (sans framework).

## Structure des fichiers

```
.
├── index.html              # Page principale (tout-en-un)
├── styles.css              # Feuille de styles complète
├── script.js               # Logique JavaScript
├── README.md               # Documentation principale
├── DEPLOIEMENT.md          # Guide de déploiement
├── ARCHITECTURE.md         # Ce fichier
├── LICENSE                 # Licences (MIT + CC BY-SA)
├── start-server.bat        # Script de démarrage Windows
├── start-server.sh         # Script de démarrage Linux/Mac
└── .gitignore              # Fichiers à ignorer pour Git
```

## Structure HTML

L'application est organisée en sections dans un seul fichier HTML :

1. **Header** (`<header class="site-header">`)
   - Logo et titre
   - Navigation principale (responsive avec menu mobile)

2. **Section Accueil** (`<section id="accueil">`)
   - Hero avec introduction
   - Présentation des 5 piliers NIRD
   - Call-to-action vers le diagnostic

3. **Section Diagnostic** (`<section id="diagnostic">`)
   - Formulaire avec 5 questions + sélection du rôle
   - Calcul automatique du score
   - Affichage des résultats et recommandations personnalisées

4. **Section Fiches-actions** (`<section id="fiches-actions">`)
   - 5 fiches-actions prêtes à l'emploi
   - Chaque fiche contient : objectif, étapes, bénéfices, astuce

5. **Section Ressources** (`<section id="ressources">`)
   - Logiciels libres recommandés
   - Pratiques de réemploi
   - Communautés et communs éducatifs

6. **Footer** (`<footer class="site-footer">`)
   - Informations sur les licences
   - Crédits Nuit de l'Info

## Système de design

### Couleurs (variables CSS)

- **Primary** : `#2d8659` (vert) - Couleur principale
- **Secondary** : `#f4a261` (orange) - Couleur secondaire
- **Accent** : `#e76f51` (rouge-orange) - Accents
- **Background** : `#fefefe` / `#f5f7fa` - Arrière-plans
- **Text** : `#2b2d42` / `#6c757d` - Textes

### Typographie

- Police système : `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...`
- Hiérarchie : h1 (2rem) > h2 (1.75rem) > h3 (1.5rem) > h4 (1.25rem)

### Composants réutilisables

- **Cards** : `.pillar-card`, `.action-card`, `.resource-column`
- **Boutons** : `.btn.primary`, `.btn.ghost`
- **Formulaires** : `.question-card`, `.role-options`
- **Badges** : `.result-badge` avec différents niveaux

## Fonctionnalités JavaScript

### Navigation mobile
- Toggle du menu hamburger
- Fermeture automatique au clic sur un lien

### Diagnostic interactif
- Calcul du score basé sur 5 questions (0-2 points chacune)
- Détermination du niveau : initial / transition / resistant
- Génération de recommandations personnalisées selon :
  - Le rôle (chef/enseignant/élève)
  - Les réponses faibles
  - Le niveau global

### Animations
- Fade-in au scroll pour les cartes
- Transitions CSS pour les interactions
- Support de `prefers-reduced-motion` pour l'accessibilité

### Smooth scroll
- Navigation fluide entre les sections
- Gestion des ancres (#accueil, #diagnostic, etc.)

## Responsive Design

### Breakpoints

- **Mobile** : < 768px
  - Menu hamburger
  - Colonnes uniques
  - Boutons pleine largeur

- **Tablette** : 768px - 968px
  - Grilles adaptatives
  - Navigation horizontale

- **Desktop** : > 968px
  - Layout en colonnes multiples
  - Navigation complète visible

### Grilles CSS

- **Pillars** : `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- **Actions** : `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
- **Resources** : `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`

## Accessibilité

- **ARIA labels** : Navigation, sections, boutons
- **Semantic HTML** : `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`
- **Focus visible** : Outline pour la navigation au clavier
- **Contrastes** : Respect des ratios WCAG
- **Reduced motion** : Support des préférences utilisateur

## Performance

- **Pas de dépendances** : JavaScript vanilla uniquement
- **CSS optimisé** : Variables, pas de préprocesseur nécessaire
- **Taille totale** : ~35 KB (très léger)
- **Chargement** : Instantané sur connexion normale

## Logique du diagnostic

### Calcul du score

Chaque question vaut 0, 1 ou 2 points :
- **0 point** : Situation dépendante des Big Tech
- **1 point** : Situation mixte / en transition
- **2 points** : Situation résistante / autonome

**Score total** : Somme des 5 questions (max 10 points)
**Pourcentage** : (Score / 10) × 100

### Niveaux

- **Initial** (0-30%) : "Village assiégé" - À la merci des Big Tech
- **Transition** (31-70%) : "Village en transition" - En chemin vers la résistance
- **Resistant** (71-100%) : "Village résistant" - Bien protégé et autonome

### Recommandations

Les recommandations sont générées dynamiquement selon :
1. **Réponses faibles** : Si une question a ≤ 1 point, une recommandation spécifique est ajoutée
2. **Rôle** : Une recommandation adaptée au profil (chef/enseignant/élève)
3. **Niveau global** : Une recommandation générale selon le niveau atteint

## Extensibilité

### Ajouter une nouvelle fiche-action

Dans `index.html`, section `#fiches-actions`, ajoutez :

```html
<article class="action-card" data-tags="chef enseignant">
  <h3>Titre de l'action</h3>
  <p class="action-meta">Difficulté : ⭐⭐☆ – Acteurs : ...</p>
  <ul class="action-points">
    <li><strong>Objectif</strong> : ...</li>
    <li><strong>Étapes clés</strong> : ...</li>
    <li><strong>Bénéfices</strong> : ...</li>
  </ul>
  <p class="action-tip">Astuce : ...</p>
</article>
```

### Ajouter une question au diagnostic

1. Ajoutez la question dans le formulaire HTML
2. Modifiez `calculateDiagnostic()` dans `script.js` pour inclure la nouvelle question
3. Ajustez `maxScore` si nécessaire (actuellement 10)

### Modifier les couleurs

Dans `styles.css`, modifiez les variables `:root` (lignes 7-18).

## Sécurité

- **Pas de backend** : Aucune donnée n'est envoyée à un serveur
- **Pas de cookies** : Aucun tracking
- **Pas de dépendances externes** : Pas de CDN, tout est local
- **Validation côté client** : Le formulaire est validé avant affichage des résultats

## Compatibilité navigateurs

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Opéra (dernières versions)
- ⚠️ IE11 : Non supporté (utilisation de CSS Grid et JavaScript moderne)

---

**Architecture simple, efficace et maintenable pour la Nuit de l'Info 2025 ! 🌿**


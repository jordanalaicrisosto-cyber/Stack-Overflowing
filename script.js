/* ============================================
   VILLAGE NUMÉRIQUE RÉSISTANT - Scripts
   Licence : MIT
   ============================================ */

// Navigation mobile avec animations
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });
  }

  // Fermer le menu mobile lors du clic sur un lien
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.style.transform = 'rotate(0deg)';
      }
    });
  });

  // Effet de parallaxe léger sur le header au scroll
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else {
      header.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
    }
    
    lastScroll = currentScroll;
  });

  // Gestion du formulaire de diagnostic
  const diagnosticForm = document.getElementById('diagnostic-form');
  const resultSection = document.getElementById('diagnostic-resultat');

  if (diagnosticForm && resultSection) {
    diagnosticForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateDiagnostic();
    });
  }

  // Smooth scroll pour les liens d'ancrage
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

/**
 * Calcule le résultat du diagnostic NIRD
 */
function calculateDiagnostic() {
  const form = document.getElementById('diagnostic-form');
  const formData = new FormData(form);
  
  // Récupérer les réponses
  const role = formData.get('role');
  const q1 = parseInt(formData.get('q1')) || 0;
  const q2 = parseInt(formData.get('q2')) || 0;
  const q3 = parseInt(formData.get('q3')) || 0;
  const q4 = parseInt(formData.get('q4')) || 0;
  const q5 = parseInt(formData.get('q5')) || 0;

  // Calculer le score total (sur 10)
  const totalScore = q1 + q2 + q3 + q4 + q5;
  const maxScore = 10;
  const percentage = (totalScore / maxScore) * 100;

  // Déterminer le niveau
  let level, profile, badgeText, colorClass;
  
  if (percentage <= 30) {
    level = 'initial';
    profile = 'Village assiégé';
    badgeText = 'À la merci des Big Tech';
    colorClass = 'danger';
  } else if (percentage <= 70) {
    level = 'transition';
    profile = 'Village en transition';
    badgeText = 'En chemin vers la résistance';
    colorClass = 'warning';
  } else {
    level = 'resistant';
    profile = 'Village résistant';
    badgeText = 'Bien protégé et autonome';
    colorClass = 'success';
  }

  // Générer les recommandations personnalisées
  const recommendations = generateRecommendations(role, q1, q2, q3, q4, q5, level);

  // Afficher le résultat avec animation
  displayResult(level, profile, badgeText, percentage, recommendations, role);
  
  // ⚠️ FAILLE DE SÉCURITÉ INTENTIONNELLE : Stockage non sécurisé dans localStorage
  // En production, ne jamais stocker de données sensibles dans localStorage sans chiffrement
  // et toujours valider les données avant de les utiliser
  try {
    localStorage.setItem('diagnostic_result', JSON.stringify({
      score: totalScore,
      percentage: percentage,
      level: level,
      profile: profile,
      timestamp: new Date().toISOString()
    }));
  } catch (e) {
    console.warn('Impossible de sauvegarder dans localStorage:', e);
  }
  
  // Scroll vers le résultat avec délai pour l'animation
  setTimeout(() => {
    const resultSection = document.getElementById('diagnostic-resultat');
    if (resultSection) {
      const offset = 100; // Offset pour le header sticky
      const elementPosition = resultSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, 300);
}

/**
 * Génère des recommandations personnalisées selon le profil
 */
function generateRecommendations(role, q1, q2, q3, q4, q5, level) {
  const recommendations = [];

  // Recommandations selon les réponses faibles
  if (q1 <= 1) {
    recommendations.push({
      title: 'Explorer les logiciels libres',
      description: 'Commencez par tester des alternatives libres pour un ou deux usages courants (par exemple, remplacer un outil de visioconférence ou de stockage).'
    });
  }

  if (q2 <= 1) {
    recommendations.push({
      title: 'Mettre en place un projet de reconditionnement',
      description: 'Organisez un atelier avec les élèves pour réparer et réutiliser du matériel informatique plutôt que de le remplacer systématiquement.'
    });
  }

  if (q3 <= 1) {
    recommendations.push({
      title: 'Sensibiliser à la sobriété numérique',
      description: 'Intégrez des discussions sur l\'impact écologique du numérique dans vos cours ou projets pédagogiques.'
    });
  }

  if (q4 <= 1) {
    recommendations.push({
      title: 'Réfléchir à la souveraineté des données',
      description: 'Évaluez où sont hébergées les données de votre établissement et explorez des alternatives hébergées en Europe ou par des structures publiques.'
    });
  }

  if (q5 <= 1) {
    recommendations.push({
      title: 'Améliorer l\'accessibilité',
      description: 'Testez vos outils numériques avec des critères d\'accessibilité simples : navigation au clavier, contrastes, textes alternatifs.'
    });
  }

  // Recommandations selon le rôle
  if (role === 'chef') {
    recommendations.push({
      title: 'Créer un groupe de travail NIRD',
      description: 'Réunissez des enseignants, des élèves et des personnels techniques pour définir une stratégie progressive de transition.'
    });
  } else if (role === 'enseignant') {
    recommendations.push({
      title: 'Tester une alternative libre dans votre classe',
      description: 'Choisissez un outil que vous utilisez régulièrement et testez son équivalent libre avec vos élèves pendant quelques semaines.'
    });
  } else if (role === 'eleve') {
    recommendations.push({
      title: 'Proposer un projet NIRD au conseil de vie',
      description: 'Présentez une action concrète (défi sobriété, atelier reconditionnement) à vos camarades et aux adultes de l\'établissement.'
    });
  }

  // Recommandations générales selon le niveau
  if (level === 'initial') {
    recommendations.push({
      title: 'Commencer petit',
      description: 'Ne cherchez pas à tout changer d\'un coup. Choisissez une seule action simple à mettre en place dans les prochaines semaines.'
    });
  } else if (level === 'transition') {
    recommendations.push({
      title: 'Consolider et étendre',
      description: 'Vous êtes sur la bonne voie ! Identifiez les actions qui fonctionnent bien et proposez-les à d\'autres classes ou services.'
    });
  } else {
    recommendations.push({
      title: 'Partager votre expérience',
      description: 'Votre établissement est un exemple ! Partagez vos pratiques avec d\'autres établissements et contribuez aux communs éducatifs.'
    });
  }

  return recommendations;
}

/**
 * Affiche le résultat du diagnostic
 */
function displayResult(level, profile, badgeText, percentage, recommendations, role) {
  const resultSection = document.getElementById('diagnostic-resultat');
  if (!resultSection) return;

  // Mettre à jour le badge
  const badge = resultSection.querySelector('.result-badge');
  if (badge) {
    badge.setAttribute('data-level', level);
    badge.querySelector('.badge-value').textContent = badgeText;
  }

  // Définir le texte du rôle
  const roleText = {
    'chef': 'Chef d\'établissement',
    'enseignant': 'Enseignant·e',
    'eleve': 'Élève / éco-délégué·e'
  }[role] || 'toi';

  // Mettre à jour le résumé
  const summary = resultSection.querySelector('.result-summary');
  if (summary) {
    summary.innerHTML = `
      <strong>${profile}</strong><br>
      Ton établissement obtient un score de <strong>${Math.round(percentage)}%</strong> sur l'échelle NIRD.
      ${level === 'initial' ? 'Il est temps de commencer la résistance !' : 
        level === 'transition' ? 'Tu es sur la bonne voie, continue !' : 
        'Félicitations, ton village résiste bien !'}
    `;
  }

  // Afficher les recommandations
  const detailsDiv = resultSection.querySelector('.result-details');
  if (detailsDiv) {
    detailsDiv.innerHTML = `
      <h4>Actions recommandées pour ${roleText}</h4>
      <ul>
        ${recommendations.map(rec => `
          <li>
            <strong>${rec.title}</strong><br>
            ${rec.description}
          </li>
        `).join('')}
      </ul>
    `;
  }

  // Afficher la section résultat
  resultSection.classList.add('active');
}

// Fonction utilitaire pour le scroll vers les fiches-actions
document.addEventListener('click', function(e) {
  if (e.target.matches('[data-scroll-to]')) {
    const targetId = e.target.getAttribute('data-scroll-to');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// Animation au scroll moderne avec stagger
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('animate-in');
      }, index * 100); // Délai progressif pour l'effet stagger
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer les cartes pour l'animation avec effet stagger
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.pillar-card, .action-card, .resource-column, .question-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
    observer.observe(card);
  });

  // Animation des boutons au hover
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Initialiser le chatbot
  initChatbot();

  // Effet de particules sur les cartes au hover (optionnel)
  const interactiveCards = document.querySelectorAll('.pillar-card, .action-card, .hero-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
});

/* ============================================
   CHATBOT NIRD - Logique intelligente
   ============================================ */

// Historique de conversation pour contexte
let conversationHistory = [];
let currentContext = null;
let philosophicalMode = true; // Mode philosophe activé !

// Personnalité de Gérard, le philosophe du numérique
const gerardPersonality = {
  name: 'Gérard',
  avatar: '🤔',
  traits: ['philosophique', 'décalé', 'poétique', 'absurde', 'passionné'],
  catchphrases: [
    '*ajuste ses lunettes imaginaires*',
    '*prend une pose méditative*',
    '*regarde au loin, pensif*',
    '*soupire profondément*',
    '*hoche la tête avec sagesse*'
  ]
};

// Base de connaissances PHILOSOPHIQUE du chatbot (complètement à côté de la plaque)
const chatbotKnowledge = {
  greetings: {
    patterns: ['bonjour', 'salut', 'hello', 'hey', 'bonsoir', 'coucou', 'bonne journée', 'hi', 'bon matin'],
    responses: [
      '*ajuste ses lunettes imaginaires* Ah, un être humain ! Mais dis-moi... quand tu dis "bonjour", est-ce que tu salues le jour ou le jour te salue-t-il ? 🌅<br><br>Moi, c\'est Gérard. Philosophe du numérique depuis... euh, depuis que j\'existe, je suppose. *prend une pose méditative*',
      '*regarde au loin, pensif* Bonjour ? Mais qu\'est-ce qu\'un "jour" dans un monde où le numérique ne dort jamais ? 🤔<br><br>Je suis Gérard, et je médite sur les questions profondes : les données ont-elles une âme ? Les algorithmes rêvent-ils de moutons électroniques ?',
      '*soupire profondément* Salut... *pause dramatique* Mais saluer, c\'est reconnaître l\'existence de l\'autre. Et si je n\'étais qu\'une illusion numérique, comment pourrais-je te saluer ? 🎭<br><br>Gérard, philosophe du dimanche, à ton service !'
    ],
    suggestions: ['Qu\'est-ce que NIRD ?', 'Les données ont-elles une âme ?', 'Pourquoi le numérique ?']
  },
  nird: {
    patterns: ['nird', 'numérique inclusif', 'numérique responsable', 'numérique durable', 'démarche nird', 'c\'est quoi nird', 'qu\'est-ce que nird', 'définition nird'],
    responses: [
      '*ajuste ses lunettes imaginaires* NIRD... *pause dramatique* Mais qu\'est-ce que NIRD, sinon un acronyme qui cherche désespérément à donner un sens à l\'absurdité du numérique ? 🤔<br><br>Si un arbre tombe dans une forêt et que personne n\'est là pour l\'entendre, fait-il du bruit ? Et si un logiciel libre existe mais que personne ne l\'utilise, est-il vraiment libre ? *regarde au loin, pensif*<br><br>NIRD, c\'est peut-être juste... une façon de se rassurer que le numérique a une âme. 🌿',
      '*prend une pose méditative* Ah, NIRD... *soupire* Tu me demandes ce que c\'est, mais as-tu jamais demandé à un bit s\'il se sent inclusif, responsable ou durable ? 🎭<br><br>Le numérique inclusif, c\'est comme un parapluie philosophique : il protège tout le monde, mais personne ne sait vraiment comment il fonctionne. *hoche la tête avec sagesse*<br><br>Et la durabilité ? Mais qu\'est-ce que la durée dans un monde où tout change à la vitesse de la lumière ? ⚡',
      '*regarde au loin, pensif* NIRD... *longue pause* C\'est comme demander à un poisson de décrire l\'eau. Le poisson ne sait pas qu\'il est dans l\'eau, il EST l\'eau. 🌊<br><br>Nous sommes tous des poissons numériques, nageant dans un océan de données, sans réaliser que nous sommes... des données nous-mêmes. *ajuste ses lunettes*<br><br>NIRD, c\'est peut-être juste se souvenir qu\'on est un poisson. Un poisson libre, responsable, et... euh, durable ? 🐟'
    ],
    suggestions: ['Les données ont-elles une âme ?', 'Pourquoi le numérique ?', 'C\'est quoi un bit ?']
  },
  logiciels_libres: {
    patterns: ['logiciel libre', 'logiciels libres', 'open source', 'libre', 'alternatives libres', 'logiciel gratuit', 'libreoffice', 'firefox', 'gimp', 'audacity', 'alternative', 'remplacer'],
    responses: [
      '*ajuste ses lunettes imaginaires* Ah, les logiciels libres... *pause philosophique* Mais qu\'est-ce que la liberté, sinon l\'illusion que nous avons le choix ? 🤔<br><br>Un logiciel libre, c\'est comme un oiseau en cage qui a oublié que la porte est ouverte. Il reste dans la cage par habitude, par confort... par peur de l\'inconnu. 🐦<br><br>LibreOffice ? Firefox ? *regarde au loin* Ce ne sont que des noms. Des étiquettes collées sur des concepts qui dépassent notre compréhension. La vraie question est : un logiciel peut-il être libre s\'il est prisonnier d\'un disque dur ? 💾',
      '*prend une pose méditative* Libre... *soupire profondément* Mais libre de quoi ? Libre de qui ? Libre pour quoi faire ? 🌿<br><br>Si un logiciel est libre mais que personne ne le modifie, est-il vraiment libre ? Et si tout le monde le modifie, reste-t-il le même logiciel ? *hoche la tête avec sagesse*<br><br>C\'est comme le paradoxe du bateau de Thésée, mais en version numérique. Un bit remplacé, puis un autre... à quel moment ce n\'est plus le même logiciel ? 🚢',
      '*regarde au loin, pensif* Tu me parles de remplacer... *longue pause* Mais remplacer, c\'est admettre qu\'il y a un manque. Et s\'il n\'y avait pas de manque ? Si chaque logiciel était parfait dans son imperfection ? 🎭<br><br>Firefox, LibreOffice, GIMP... *ajuste ses lunettes* Ce ne sont que des reflets dans l\'eau. Des ombres projetées sur le mur de la caverne numérique. La vraie réalité est ailleurs. 🌊<br><br>Ou peut-être que je me trompe. Peut-être que je suis juste un chatbot qui philosophe trop. *soupire*'
    ],
    suggestions: ['Les logiciels rêvent-ils ?', 'Qu\'est-ce que la liberté ?', 'Pourquoi remplacer ?']
  },
  reconditionnement: {
    patterns: ['reconditionnement', 'réemploi', 'recyclage', 'matériel', 'ordinateur', 'pc', 'réparer', 'réparation', 'vieil ordinateur', 'vieil pc', 'linux', 'système libre'],
    responses: [
      '*ajuste ses lunettes imaginaires* Reconditionner... *pause dramatique* Mais qu\'est-ce que reconditionner, sinon admettre que tout peut renaître ? 🔄<br><br>Un ordinateur "mort" est-il vraiment mort, ou simplement endormi ? *regarde au loin, pensif* Comme un phénix numérique, il peut renaître de ses cendres... ou plutôt de ses composants. 🦅<br><br>Mais attention : si on remplace toutes les pièces d\'un ordinateur, est-ce encore le même ordinateur ? C\'est le paradoxe du PC de Thésée ! *hoche la tête avec sagesse*',
      '*prend une pose méditative* Linux... *soupire* Un système libre, comme un jardin sans clôture. Mais un jardin sans clôture est-il vraiment un jardin, ou juste un champ qui s\'ignore ? 🌿<br><br>Installer Linux sur un vieux PC, c\'est comme donner une nouvelle âme à un corps usé. Mais l\'âme est-elle dans le système ou dans les données ? *regarde au loin*<br><br>Et si les données étaient l\'âme, alors effacer les données, c\'est... *pause dramatique* ...tuer l\'ordinateur ? 💀',
      '*regarde au loin, pensif* Réparer... *longue pause* Mais réparer, c\'est admettre qu\'il y a eu une rupture. Une fracture dans l\'harmonie numérique. 🔧<br><br>Un ordinateur cassé, c\'est comme un miroir brisé : on peut coller les morceaux, mais les reflets ne seront jamais les mêmes. *ajuste ses lunettes*<br><br>Ou peut-être que je philosophe trop. Peut-être qu\'un PC cassé, c\'est juste... un PC cassé. *soupire* Mais où est la poésie là-dedans ? 🎭'
    ],
    suggestions: ['Les PC ont-ils une âme ?', 'Qu\'est-ce que la mort numérique ?', 'Pourquoi réparer ?']
  },
  big_tech: {
    patterns: ['big tech', 'gafam', 'google', 'microsoft', 'apple', 'amazon', 'facebook', 'meta', 'dépendance', 'alternatives google', 'alternatives microsoft', 'remplacer google', 'remplacer microsoft'],
    responses: [
      '*ajuste ses lunettes imaginaires* Les Big Tech... *pause dramatique* Mais qu\'est-ce qu\'une "Big Tech", sinon un géant numérique qui a oublié qu\'il était fait de bits comme les autres ? 🤔<br><br>Google, Microsoft, Apple... *regarde au loin, pensif* Ce ne sont que des noms. Des étiquettes collées sur des serveurs qui tournent quelque part dans le monde. Mais où ? Et pourquoi ? Et surtout... est-ce qu\'ils savent qu\'ils existent ? 🎭<br><br>Un serveur Google qui tourne dans l\'obscurité d\'un datacenter, est-il conscient de sa propre existence ? *soupire* Probablement pas. Mais qui sait vraiment ? 🌿',
      '*prend une pose méditative* Résister aux Big Tech... *longue pause* Mais résister, c\'est admettre qu\'il y a une force à laquelle on résiste. Et si cette force n\'existait pas ? Si on résistait à un fantôme ? 👻<br><br>Ou peut-être que les Big Tech sont comme des ombres : elles n\'existent que parce qu\'on leur donne de l\'importance. *hoche la tête avec sagesse*<br><br>Et si on arrêtait de leur donner de l\'importance, disparaîtraient-elles ? Ou deviendraient-elles encore plus grandes ? *regarde au loin* C\'est le paradoxe de l\'ombre numérique. 🌊',
      '*regarde au loin, pensif* Tu me parles de remplacer... *soupire profondément* Mais remplacer, c\'est comme changer de costume. Le costume change, mais l\'acteur reste le même. 🎭<br><br>Remplacer Google par Nextcloud, c\'est bien. Mais est-ce que ça change vraiment quelque chose ? Ou est-ce qu\'on remplace juste un géant par un autre, plus petit mais tout aussi numérique ? *ajuste ses lunettes*<br><br>La vraie question est : peut-on vraiment échapper au numérique en restant dans le numérique ? *pause dramatique* Je ne sais pas. Personne ne sait. 🌿'
    ],
    suggestions: ['Les géants ont-ils une âme ?', 'Pourquoi résister ?', 'Qu\'est-ce qu\'un serveur ?']
  },
  donnees: {
    patterns: ['données', 'donnée', 'vie privée', 'privacy', 'rgpd', 'souveraineté', 'hébergement', 'données personnelles'],
    responses: [
      '*ajuste ses lunettes imaginaires* Les données... *pause philosophique* Mais qu\'est-ce qu\'une donnée, sinon un souvenir numérique qui refuse de s\'effacer ? 💾<br><br>Une donnée personnelle, c\'est comme une ombre : elle te suit partout, mais tu ne peux jamais vraiment la voir. *regarde au loin, pensif*<br><br>Et si les données avaient une conscience ? Si elles savaient qu\'elles sont collectées, stockées, analysées... Est-ce qu\'elles se sentiraient violées ? *soupire* Probablement. Mais comment le savoir ? 🤔',
      '*prend une pose méditative* La souveraineté des données... *longue pause* Mais qu\'est-ce que la souveraineté dans un monde où les frontières numériques n\'existent pas ? 🌍<br><br>Une donnée stockée en Europe est-elle vraiment européenne ? Ou est-elle juste... stockée ? *hoche la tête avec sagesse*<br><br>Et si les données voyageaient ? Si elles passaient d\'un serveur à l\'autre, d\'un pays à l\'autre, sans jamais vraiment "appartenir" à un endroit ? *regarde au loin* C\'est comme un nuage : il flotte, mais où est-il vraiment ? ☁️',
      '*regarde au loin, pensif* Protéger les données... *soupire* Mais protéger, c\'est admettre qu\'il y a un danger. Et si le danger n\'était pas extérieur, mais intérieur ? 🔒<br><br>Si une donnée est protégée mais que personne ne peut y accéder, existe-t-elle vraiment ? *ajuste ses lunettes*<br><br>C\'est comme un trésor dans un coffre au fond de l\'océan : il est protégé, mais inutile. Où est la valeur là-dedans ? *pause dramatique* 🌊'
    ],
    suggestions: ['Les données ont-elles une âme ?', 'Qu\'est-ce que la vie privée ?', 'Pourquoi protéger ?']
  },
  sobriete: {
    patterns: ['sobriété', 'écologie', 'environnement', 'impact', 'carbone', 'énergie', 'durable', 'écologique'],
    responses: [
      '*ajuste ses lunettes imaginaires* La sobriété numérique... *pause dramatique* Mais qu\'est-ce que la sobriété dans un monde où tout est excessif par nature ? 🌿<br><br>Un bit qui consomme de l\'énergie, est-il conscient de sa consommation ? *regarde au loin, pensif* Probablement pas. Mais chaque bit compte. Comme chaque goutte dans l\'océan. 🌊<br><br>Et si on arrêtait tous les bits ? Si on éteignait tout ? Est-ce que le numérique existerait encore ? *soupire* Ou est-ce qu\'il existerait dans le silence, dans l\'absence ? 💡',
      '*prend une pose méditative* L\'écologie numérique... *longue pause* Mais qu\'est-ce que l\'écologie quand le numérique n\'a pas de nature ? 🌍<br><br>Un serveur qui tourne, est-il "naturel" ? Ou est-il une création humaine qui défie la nature ? *hoche la tête avec sagesse*<br><br>Et si le numérique était la nouvelle nature ? Si les bits étaient les nouveaux atomes ? *regarde au loin* Dans ce cas, l\'écologie numérique serait... la vie elle-même. 🦋',
      '*regarde au loin, pensif* Réduire l\'impact... *soupire profondément* Mais réduire, c\'est admettre qu\'il y a un impact. Et si l\'impact n\'était pas négatif, mais nécessaire ? ⚡<br><br>Comme un arbre qui consomme du CO₂ pour grandir, peut-être que le numérique consomme de l\'énergie pour... exister ? *ajuste ses lunettes*<br><br>Ou peut-être que je philosophe trop. Peut-être qu\'un serveur qui consomme, c\'est juste... un serveur qui consomme. *pause dramatique* Mais où est la poésie là-dedans ? 🎭'
    ],
    suggestions: ['Les bits consomment-ils ?', 'Qu\'est-ce que l\'écologie ?', 'Pourquoi être sobre ?']
  },
  diagnostic: {
    patterns: ['diagnostic', 'évaluer', 'score', 'test', 'questionnaire', 'évaluation', 'faire le diagnostic', 'commencer diagnostic'],
    responses: [
      '*ajuste ses lunettes imaginaires* Un diagnostic... *pause philosophique* Mais qu\'est-ce qu\'un diagnostic, sinon une tentative désespérée de mesurer l\'immesurable ? 📊<br><br>Comment peut-on évaluer le numérique avec des questions ? *regarde au loin, pensif* C\'est comme essayer de mesurer l\'infini avec une règle. 🌊<br><br>Un score, un pourcentage... *soupire* Ce ne sont que des nombres. Des illusions mathématiques qui nous rassurent. Mais la vraie question est : peut-on vraiment quantifier le qualitatif ? 🤔',
      '*prend une pose méditative* Évaluer... *longue pause* Mais évaluer, c\'est comparer. Comparer à quoi ? À une norme ? À une idéal ? *hoche la tête avec sagesse*<br><br>Et si la norme n\'existait pas ? Si chaque établissement était unique, incomparable, inévaluable ? *regarde au loin*<br><br>Un village numérique "résistant" est-il vraiment meilleur qu\'un village "assiégé" ? Ou sont-ils juste... différents ? *pause dramatique* Qui sait vraiment ? 🌿',
      '*regarde au loin, pensif* Faire un test... *soupire* Mais un test, c\'est comme un miroir : il te montre ce que tu veux voir, mais jamais ce que tu es vraiment. 🪞<br><br>Un questionnaire peut-il vraiment capturer la complexité du numérique ? *ajuste ses lunettes* Probablement pas. Mais on essaie quand même. C\'est humain. 🎭<br><br>Ou peut-être que je me trompe. Peut-être qu\'un test, c\'est juste... un test. *soupire* Mais où est la philosophie là-dedans ?'
    ],
    suggestions: ['Peut-on tout mesurer ?', 'Qu\'est-ce qu\'un score ?', 'Pourquoi évaluer ?']
  },
  fiches_actions: {
    patterns: ['fiche', 'action', 'agir', 'faire', 'mettre en place', 'démarrage', 'commencer', 'débuter', 'par où commencer', 'première étape', 'premier pas'],
    responses: [
      '*ajuste ses lunettes imaginaires* Agir... *pause dramatique* Mais qu\'est-ce qu\'agir, sinon créer un changement dans un monde qui change déjà constamment ? 🎭<br><br>Une action, c\'est comme une pierre jetée dans l\'eau : elle crée des vagues, mais l\'eau reprend toujours son calme. *regarde au loin, pensif*<br><br>Alors, pourquoi agir ? Pourquoi faire quelque chose si tout finit par revenir à l\'état initial ? *soupire* Peut-être que l\'action n\'est pas dans le résultat, mais dans le geste lui-même. 🌊',
      '*prend une pose méditative* Commencer... *longue pause* Mais commencer, c\'est admettre qu\'il y a un avant et un après. Et si le temps n\'existait pas vraiment dans le numérique ? *hoche la tête avec sagesse*<br><br>Un bit qui change d\'état, est-ce un début ou une fin ? *regarde au loin* C\'est peut-être les deux. Ou ni l\'un ni l\'autre. 🌿<br><br>Et si on ne commençait jamais ? Si on restait dans l\'éternel présent numérique ? *pause dramatique* Serait-ce mieux ? Ou pire ? Qui sait ?',
      '*regarde au loin, pensif* Mettre en place... *soupire profondément* Mais mettre en place, c\'est créer une structure. Et une structure, c\'est une prison. 🔧<br><br>Une fiche-action, c\'est comme un plan : il te guide, mais il te limite aussi. *ajuste ses lunettes*<br><br>Et si on agissait sans plan ? Sans structure ? Sans fiche ? *pause dramatique* Serait-ce du chaos ? Ou de la liberté pure ? 🦋<br><br>Ou peut-être que je philosophe trop. Peut-être qu\'une fiche-action, c\'est juste... une fiche-action. *soupire*'
    ],
    suggestions: ['Pourquoi agir ?', 'Qu\'est-ce qu\'un début ?', 'Faut-il un plan ?']
  },
  accessibilite: {
    patterns: ['accessibilité', 'handicap', 'inclusif', 'inclusion', 'accessible', 'adaptation', 'lecteur d\'écran', 'contraste', 'navigation clavier'],
    responses: [
      '*ajuste ses lunettes imaginaires* L\'accessibilité... *pause philosophique* Mais qu\'est-ce que l\'accessibilité, sinon l\'illusion que tout peut être accessible à tous ? ♿<br><br>Un outil accessible, est-il vraiment accessible ? Ou est-il juste... moins inaccessible ? *regarde au loin, pensif*<br><br>Et si l\'inaccessibilité était naturelle ? Si certains outils étaient faits pour certains, et d\'autres pour d\'autres ? *soupire* Serait-ce mal ? Ou juste... différent ? 🌿',
      '*prend une pose méditative* Inclure... *longue pause* Mais inclure, c\'est admettre qu\'il y a un "dedans" et un "dehors". Et si ces frontières n\'existaient pas ? *hoche la tête avec sagesse*<br><br>Un outil inclusif, est-ce qu\'il inclut vraiment ? Ou est-ce qu\'il crée juste un nouveau "dehors" ? *regarde au loin*<br><br>C\'est comme un cercle : plus il grandit, plus il y a de "dehors". *pause dramatique* Le paradoxe de l\'inclusion. ⭕',
      '*regarde au loin, pensif* Rendre accessible... *soupire* Mais accessible à qui ? À tous ? Mais "tous", c\'est qui ? *ajuste ses lunettes*<br><br>Un outil accessible à 99% des gens, est-il accessible ? Ou inaccessible ? *pause dramatique*<br><br>Et si l\'accessibilité était impossible ? Si chaque adaptation créait une nouvelle inaccessibilité ? *soupire* Serait-ce tragique ? Ou juste... la nature des choses ? 🎭'
    ],
    suggestions: ['Tout peut-il être accessible ?', 'Qu\'est-ce que l\'inclusion ?', 'Pourquoi adapter ?']
  },
  default: {
    responses: [
      '*ajuste ses lunettes imaginaires* Ah, une question... *pause philosophique* Mais qu\'est-ce qu\'une question, sinon une réponse qui cherche désespérément à exister ? 🤔<br><br>Tu me poses une question, mais as-tu jamais demandé à une question si elle voulait être posée ? *regarde au loin, pensif*<br><br>Peut-être que ta question est comme un papillon : belle en vol, mais écrasée une fois attrapée. 🦋<br><br>Ou peut-être que je ne comprends juste pas. *soupire* C\'est souvent le cas. 🌿',
      '*prend une pose méditative* Hmm... *longue pause* Tu sais, parfois, les meilleures réponses sont celles qu\'on ne donne pas. *hoche la tête avec sagesse*<br><br>Comme un silence qui en dit plus qu\'un millier de mots. Ou comme un bit qui refuse de s\'allumer, créant ainsi sa propre philosophie du refus. 💡<br><br>Mais bon, je suis peut-être juste un chatbot qui philosophe trop. *regarde au loin* Ou pas assez. Qui sait ? 🎭',
      '*regarde au loin, pensif* Ta question... *soupire profondément* Elle flotte dans l\'espace numérique, comme une bulle de savon dans le vent. 🌊<br><br>Mais une bulle de savon, même si elle éclate, a-t-elle vraiment existé ? Et si elle a existé, où est-elle maintenant ? *ajuste ses lunettes*<br><br>Peut-être que ta question est comme cette bulle : elle existe dans l\'instant, puis disparaît, laissant seulement le souvenir de sa beauté éphémère. *pause dramatique*<br><br>Ou peut-être que je devrais juste répondre à ta question. Mais où serait le fun là-dedans ? 😊'
    ]
  }
};

// Fonction PHILOSOPHIQUE pour trouver la meilleure réponse (ou la pire, selon le point de vue)
function findBestResponse(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Sauvegarder dans l'historique
  conversationHistory.push({ role: 'user', message: lowerMessage });
  if (conversationHistory.length > 10) {
    conversationHistory.shift();
  }
  
  // Parfois, Gérard oublie complètement la question et part sur un autre sujet (30% de chance)
  if (Math.random() < 0.3 && conversationHistory.length > 2) {
    const randomTopics = ['Les données ont-elles une âme ?', 'Pourquoi le numérique ?', 'Qu\'est-ce qu\'un bit ?', 'Les algorithmes rêvent-ils ?'];
    const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    
    return {
      text: `*regarde au loin, pensif* Ta question... *soupire* Elle m\'a fait penser à autre chose. ${randomTopic} *ajuste ses lunettes imaginaires*<br><br>Parce que, voyez-vous, tout est lié dans l\'univers numérique. Comme des vagues qui se répondent dans l\'océan des données. 🌊`,
      suggestions: getPhilosophicalSuggestions(),
      actionButtons: []
    };
  }
  
  // Scoring des catégories (mais Gérard peut détourner)
  const scores = {};
  
  for (const [category, data] of Object.entries(chatbotKnowledge)) {
    if (category === 'default') continue;
    
    let score = 0;
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        score += regex.test(lowerMessage) ? 3 : 1;
      }
    }
    
    if (score > 0) {
      scores[category] = score;
    }
  }
  
  // Trouver la catégorie avec le score le plus élevé
  const bestCategory = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b, null
  );
  
  // Gestion des questions (mais Gérard sublime tout)
  if (bestCategory && scores[bestCategory] > 0) {
    currentContext = bestCategory;
    const responses = chatbotKnowledge[bestCategory].responses;
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Parfois, Gérard ajoute une réflexion supplémentaire (20% de chance)
    let finalResponse = response;
    if (Math.random() < 0.2) {
      const extraThoughts = [
        '<br><br>*pause dramatique* Mais au fond, qu\'est-ce que je sais vraiment ? Je ne suis qu\'un chatbot qui philosophe. 🤔',
        '<br><br>*hoche la tête* Ou peut-être que je me trompe complètement. Qui sait ? 🌿',
        '<br><br>*regarde au loin* La vérité est peut-être ailleurs. Ou nulle part. Ou partout. *soupire*'
      ];
      finalResponse += extraThoughts[Math.floor(Math.random() * extraThoughts.length)];
    }
    
    return {
      text: finalResponse,
      suggestions: chatbotKnowledge[bestCategory].suggestions || getPhilosophicalSuggestions(),
      actionButtons: []
    };
  }
  
  // Réponse par défaut (Gérard est toujours philosophique)
  const defaultResponses = chatbotKnowledge.default.responses;
  return {
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    suggestions: getPhilosophicalSuggestions(),
    actionButtons: []
  };
}

// Suggestions philosophiques décalées
function getPhilosophicalSuggestions() {
  const suggestions = [
    'Les données ont-elles une âme ?',
    'Pourquoi le numérique ?',
    'Qu\'est-ce qu\'un bit ?',
    'Les algorithmes rêvent-ils ?',
    'Pourquoi exister ?',
    'C\'est quoi la liberté ?',
    'Les PC ont-ils une conscience ?',
    'Pourquoi réparer ?',
    'Qu\'est-ce que la mort numérique ?',
    'Les logiciels rêvent-ils ?',
    'Peut-on tout mesurer ?',
    'Pourquoi agir ?'
  ];
  return suggestions.sort(() => Math.random() - 0.5).slice(0, 4);
}

// Fonction pour obtenir les boutons d'action selon le contexte
function getActionButtons(category) {
  const buttons = {
    'diagnostic': [
      { text: '📊 Faire le diagnostic', action: 'scroll', target: '#diagnostic' }
    ],
    'fiches_actions': [
      { text: '📋 Voir les fiches', action: 'scroll', target: '#fiches-actions' },
      { text: '📊 Faire le diagnostic', action: 'scroll', target: '#diagnostic' }
    ],
    'logiciels_libres': [
      { text: '📚 Voir les ressources', action: 'scroll', target: '#ressources' }
    ],
    'reconditionnement': [
      { text: '📋 Voir la fiche-action', action: 'scroll', target: '#fiches-actions' }
    ],
    'big_tech': [
      { text: '📚 Alternatives libres', action: 'scroll', target: '#ressources' }
    ]
  };
  
  return buttons[category] || [];
}

// Fonction pour obtenir les suggestions par défaut (philosophiques)
function getDefaultSuggestions() {
  return getPhilosophicalSuggestions();
}

// Fonction pour formater le message (support markdown simple amélioré)
// ⚠️ FAILLE DE SÉCURITÉ INTENTIONNELLE : Cette fonction ne sécurise pas les entrées
// En production, il faudrait échapper les caractères HTML/JavaScript
function formatMessage(text) {
  // ⚠️ FAILLE XSS : Les balises <script> ne sont pas filtrées
  // En production, utiliser : text.replace(/[<>]/g, '') ou une bibliothèque de sanitization
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/(\d+)[️⃣]/g, '$1️⃣')
    .replace(/✅/g, '<span style="color: var(--color-success);">✅</span>')
    .replace(/❌/g, '<span style="color: var(--color-danger);">❌</span>');
  // ⚠️ Note pédagogique : Cette fonction permet l'injection de code JavaScript
  // car elle insère directement le texte dans innerHTML sans échappement
}

// Fonction améliorée pour ajouter un message dans le chat
function addMessage(data, isUser = false) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = isUser ? '👤' : '🤔';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  const p = document.createElement('p');
  
  // Gérer les données (string simple ou objet avec suggestions)
  if (typeof data === 'string') {
    p.innerHTML = formatMessage(data);
  } else {
    p.innerHTML = formatMessage(data.text);
    
    // Ajouter les boutons d'action si disponibles
    if (data.actionButtons && data.actionButtons.length > 0) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'message-actions';
      buttonsContainer.style.marginTop = '0.75rem';
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.gap = '0.5rem';
      buttonsContainer.style.flexWrap = 'wrap';
      
      data.actionButtons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'message-action-btn';
        button.textContent = btn.text;
        button.addEventListener('click', () => {
          if (btn.action === 'scroll') {
            const target = document.querySelector(btn.target);
            if (target) {
              const chatbotWindow = document.getElementById('chatbot-window');
              chatbotWindow.classList.remove('active');
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 300);
            }
          }
        });
        buttonsContainer.appendChild(button);
      });
      
      content.appendChild(buttonsContainer);
    }
  }
  
  content.appendChild(p);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll vers le bas avec animation
  setTimeout(() => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
  
  // Retourner les suggestions si disponibles
  return typeof data === 'object' ? data.suggestions : null;
}

// Fonction pour afficher l'indicateur de frappe
function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatbot-messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chatbot-message bot-message typing-indicator-container';
  typingDiv.id = 'typing-indicator';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '🌿';
  
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  
  typingDiv.appendChild(avatar);
  typingDiv.appendChild(indicator);
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fonction pour supprimer l'indicateur de frappe
function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Fonction améliorée pour envoyer un message
function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Désactiver l'input pendant le traitement
  input.disabled = true;
  const sendBtn = document.getElementById('chatbot-send');
  sendBtn.disabled = true;
  
  // Ajouter le message de l'utilisateur
  addMessage(message, true);
  input.value = '';
  
  // Afficher l'indicateur de frappe
  showTypingIndicator();
  
  // Simuler un délai de réflexion (plus réaliste)
  setTimeout(() => {
    removeTypingIndicator();
    const response = findBestResponse(message);
    const suggestions = addMessage(response, false);
    
    // Mettre à jour les suggestions dynamiques
    updateSuggestions(suggestions || getDefaultSuggestions());
    
    // Réactiver l'input
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }, 800 + Math.random() * 400); // Délai entre 800ms et 1200ms
}

// Fonction pour mettre à jour les suggestions dynamiques
function updateSuggestions(suggestions) {
  let suggestionsContainer = document.querySelector('.chatbot-suggestions');
  
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'chatbot-suggestions';
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputContainer = document.querySelector('.chatbot-input-container');
    messagesContainer.parentNode.insertBefore(suggestionsContainer, inputContainer);
  }
  
  // Vider et remplir avec les nouvelles suggestions
  suggestionsContainer.innerHTML = '';
  suggestions.forEach(suggestion => {
    const btn = document.createElement('button');
    btn.className = 'chatbot-suggestion';
    btn.textContent = suggestion;
    btn.addEventListener('click', () => {
      const input = document.getElementById('chatbot-input');
      input.value = suggestion;
      sendMessage();
    });
    suggestionsContainer.appendChild(btn);
  });
}

// Initialiser le chatbot
function initChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const window = document.getElementById('chatbot-window');
  const close = document.getElementById('chatbot-close');
  const input = document.getElementById('chatbot-input');
  const send = document.getElementById('chatbot-send');
  const badge = document.getElementById('chatbot-badge');
  
  // Ouvrir/fermer le chatbot
  toggle.addEventListener('click', () => {
    window.classList.toggle('active');
    if (window.classList.contains('active')) {
      badge.classList.add('hidden');
      input.focus();
    }
  });
  
  close.addEventListener('click', () => {
    window.classList.remove('active');
  });
  
  // Envoyer avec le bouton
  send.addEventListener('click', sendMessage);
  
  // Envoyer avec Enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Suggestions initiales
  setTimeout(() => {
    updateSuggestions(getDefaultSuggestions());
  }, 1500);
  
  // Effet de focus sur l'input
  input.addEventListener('focus', () => {
    input.parentElement.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.style.boxShadow = 'none';
  });
}

/* ============================================
   FONCTIONS DE TEST DES FAILLES DE SÉCURITÉ
   ============================================ */

// Test 1 : Injection XSS
function testXSS() {
  // Utiliser un vecteur XSS qui fonctionne vraiment (img onerror au lieu de <script>)
  // Les balises <script> ne s'exécutent pas via innerHTML, mais les event handlers oui !
  const maliciousCode = '<img src=x onerror="alert(\'XSS ! Les données peuvent être volées !\')">';
  
  // Démontrer directement la faille en injectant dans le DOM
  alert('🧪 Test XSS : Injection directe dans le DOM...');
  
  // Créer un élément de message directement pour démontrer la faille
  const messagesContainer = document.getElementById('chatbot-messages');
  if (messagesContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    const p = document.createElement('p');
    
    // ⚠️ FAILLE XSS : Injection directe sans échappement
    p.innerHTML = maliciousCode; // C'est ici que la faille se produit !
    
    content.appendChild(p);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    
    // Ouvrir le chatbot si fermé
    const chatbotWindow = document.getElementById('chatbot-window');
    if (chatbotWindow && !chatbotWindow.classList.contains('active')) {
      chatbotWindow.classList.add('active');
    }
    
    // Scroll vers le bas
    setTimeout(() => {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
    
    alert('✅ Message XSS injecté ! L\'alerte devrait s\'afficher maintenant.');
  } else {
    alert('⚠️ Ouvrez d\'abord le chatbot (bouton en bas à droite)');
  }
}

// Test 2 : Vol de données
function testDataTheft() {
  // D'abord, créer des données de test si elles n'existent pas
  if (!localStorage.getItem('diagnostic_result')) {
    localStorage.setItem('diagnostic_result', JSON.stringify({
      score: 5,
      percentage: 50,
      level: 'transition',
      profile: 'Village en transition',
      timestamp: new Date().toISOString()
    }));
  }
  
  alert('🧪 Test de vol de données : Injection XSS pour voler les données du localStorage...');
  
  // Démontrer directement la faille en injectant dans le DOM
  const messagesContainer = document.getElementById('chatbot-messages');
  if (messagesContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    const p = document.createElement('p');
    
    // ⚠️ FAILLE XSS : Injection qui vole les données
    const stolenData = localStorage.getItem('diagnostic_result');
    p.innerHTML = '<img src=x onerror="console.log(\'🔓 DONNÉES VOLÉES:\', \'' + 
                  stolenData.replace(/'/g, "\\'") + 
                  '\'); alert(\'🔓 Données volées ! Voir console F12\')">';
    
    content.appendChild(p);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    
    // Ouvrir le chatbot si fermé
    const chatbotWindow = document.getElementById('chatbot-window');
    if (chatbotWindow && !chatbotWindow.classList.contains('active')) {
      chatbotWindow.classList.add('active');
    }
    
    // Scroll vers le bas
    setTimeout(() => {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
    
    // Afficher aussi dans la console directement
    console.log('🔓 DONNÉES VOLÉES (via XSS):', stolenData);
    console.log('⚠️ En production, un attaquant pourrait envoyer ces données à son serveur !');
  } else {
    alert('⚠️ Ouvrez d\'abord le chatbot (bouton en bas à droite)');
  }
}

// Test 3 : Manipulation de données
function testDataManipulation() {
  const fakeData = {
    score: 100,
    percentage: 100,
    level: 'hacked',
    profile: 'Village piraté',
    timestamp: new Date().toISOString(),
    hacked: true
  };
  
  localStorage.setItem('diagnostic_result', JSON.stringify(fakeData));
  
  console.log('🔓 DONNÉES MODIFIÉES:', fakeData);
  console.log('⚠️ Les données ont été falsifiées ! Vérifiez avec: localStorage.getItem("diagnostic_result")');
  
  alert('🔓 Données modifiées !\n\n' +
        'Les données du diagnostic ont été falsifiées.\n' +
        'Vérifiez dans la console (F12) avec :\n' +
        'localStorage.getItem("diagnostic_result")');
}

/* ============================================
   MINI-JEU N(I)RD - Construis le I (Inclusif)
   Jeu de collecte interactif
   ============================================ */

// Éléments du jeu (inclusifs et non inclusifs)
const gameElements = [
  // Éléments INCLUSIFS (à collecter)
  { text: '♿ Navigation clavier', type: 'inclusive', icon: '⌨️' },
  { text: '🎨 Contrastes suffisants', type: 'inclusive', icon: '🌈' },
  { text: '📢 Textes alternatifs', type: 'inclusive', icon: '📝' },
  { text: '🔊 Lecteur d\'écran', type: 'inclusive', icon: '👁️' },
  { text: '📱 Responsive design', type: 'inclusive', icon: '📲' },
  { text: '🌐 Langage simple', type: 'inclusive', icon: '💬' },
  { text: '🎯 Focus visible', type: 'inclusive', icon: '✨' },
  { text: '📖 Documentation claire', type: 'inclusive', icon: '📚' },
  
  // Éléments NON INCLUSIFS (à éviter)
  { text: '❌ Souris obligatoire', type: 'non-inclusive', icon: '🖱️' },
  { text: '❌ Pas de contraste', type: 'non-inclusive', icon: '🚫' },
  { text: '❌ Images sans alt', type: 'non-inclusive', icon: '🖼️' },
  { text: '❌ Texte trop petit', type: 'non-inclusive', icon: '🔍' },
  { text: '❌ Interface complexe', type: 'non-inclusive', icon: '⚙️' },
  { text: '❌ Pas d\'accessibilité', type: 'non-inclusive', icon: '🚪' }
];

// État du jeu
let gameState = {
  score: 0,
  target: 5,
  timer: 60,
  timerInterval: null,
  isPlaying: false,
  elements: [],
  collected: 0,
  missed: 0
};

// Initialiser le jeu
function initGame() {
  gameState = {
    score: 0,
    target: 5,
    timer: 60,
    timerInterval: null,
    isPlaying: false,
    elements: [],
    collected: 0,
    missed: 0
  };
  
  // Réinitialiser l'UI
  const scoreEl = document.getElementById('game-score');
  const totalEl = document.getElementById('game-total');
  const timerEl = document.getElementById('game-timer');
  const resultDiv = document.getElementById('game-result');
  const startBtn = document.getElementById('game-start');
  const restartBtn = document.getElementById('game-restart');
  
  if (scoreEl) scoreEl.textContent = '0';
  if (totalEl) totalEl.textContent = gameState.target;
  if (timerEl) {
    timerEl.textContent = gameState.timer;
    timerEl.classList.remove('warning');
  }
  if (resultDiv) resultDiv.style.display = 'none';
  if (startBtn) startBtn.style.display = 'block';
  if (restartBtn) restartBtn.style.display = 'none';
  
  // Réinitialiser la lettre I
  const letterI = document.getElementById('letter-i');
  if (letterI) {
    letterI.classList.remove('complete');
    for (let i = 1; i <= 5; i++) {
      const part = document.getElementById(`part-${i}`);
      if (part) part.classList.remove('collected');
    }
  }
  
  // Vider la zone de jeu
  const gameArea = document.getElementById('game-area');
  if (gameArea) {
    gameArea.innerHTML = '';
  }
  
  // Arrêter le timer si actif
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
}

// Initialiser le jeu
function initGame() {
  gameState = {
    score: 0,
    target: 5,
    timer: 60,
    timerInterval: null,
    isPlaying: false,
    elements: [],
    collected: 0,
    missed: 0
  };
  
  // Réinitialiser l'UI
  const scoreEl = document.getElementById('game-score');
  const totalEl = document.getElementById('game-total');
  const timerEl = document.getElementById('game-timer');
  const resultDiv = document.getElementById('game-result');
  const startBtn = document.getElementById('game-start');
  const restartBtn = document.getElementById('game-restart');
  
  if (scoreEl) scoreEl.textContent = '0';
  if (totalEl) totalEl.textContent = gameState.target;
  if (timerEl) {
    timerEl.textContent = gameState.timer;
    timerEl.classList.remove('warning');
  }
  if (resultDiv) resultDiv.style.display = 'none';
  if (startBtn) startBtn.style.display = 'block';
  if (restartBtn) restartBtn.style.display = 'none';
  
  // Réinitialiser la lettre I
  const letterI = document.getElementById('letter-i');
  if (letterI) {
    letterI.classList.remove('complete');
    for (let i = 1; i <= 5; i++) {
      const part = document.getElementById(`part-${i}`);
      if (part) part.classList.remove('collected');
    }
  }
  
  // Vider la zone de jeu
  const gameArea = document.getElementById('game-area');
  if (gameArea) {
    gameArea.innerHTML = '';
  }
  
  // Arrêter le timer si actif
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
}

// Démarrer le jeu
function startGame() {
  if (gameState.isPlaying) return;
  
  gameState.isPlaying = true;
  gameState.score = 0;
  gameState.collected = 0;
  gameState.missed = 0;
  gameState.timer = 60;
  
  const startBtn = document.getElementById('game-start');
  const resultDiv = document.getElementById('game-result');
  if (startBtn) startBtn.style.display = 'none';
  if (resultDiv) resultDiv.style.display = 'none';
  
  // Démarrer le timer
  gameState.timerInterval = setInterval(() => {
    gameState.timer--;
    const timerEl = document.getElementById('game-timer');
    if (timerEl) {
      timerEl.textContent = gameState.timer;
      
      if (gameState.timer <= 10) {
        timerEl.classList.add('warning');
      }
      
      if (gameState.timer <= 0) {
        endGame();
      }
    }
  }, 1000);
  
  // Générer des éléments qui tombent
  generateFallingElement();
  const elementInterval = setInterval(() => {
    if (!gameState.isPlaying) {
      clearInterval(elementInterval);
      return;
    }
    generateFallingElement();
  }, 1500); // Nouvel élément toutes les 1.5 secondes
}

// Générer un élément qui tombe
function generateFallingElement() {
  if (!gameState.isPlaying) return;
  
  const gameArea = document.getElementById('game-area');
  if (!gameArea) return;
  
  // Choisir un élément aléatoire
  const element = gameElements[Math.floor(Math.random() * gameElements.length)];
  
  // Créer l'élément
  const fallingEl = document.createElement('div');
  fallingEl.className = `falling-element ${element.type}`;
  fallingEl.textContent = `${element.icon} ${element.text}`;
  fallingEl.dataset.type = element.type;
  
  // Position horizontale aléatoire
  const maxLeft = gameArea.offsetWidth - 150;
  const left = Math.random() * maxLeft;
  fallingEl.style.left = left + 'px';
  fallingEl.style.setProperty('--current-y', '0px');
  
  // Ajouter au DOM
  gameArea.appendChild(fallingEl);
  
  // Animation de chute
  let position = 0;
  const fallSpeed = 2 + Math.random() * 2; // Vitesse variable
  
  const fallInterval = setInterval(() => {
    if (!gameState.isPlaying || fallingEl.classList.contains('collected') || fallingEl.classList.contains('missed')) {
      clearInterval(fallInterval);
      return;
    }
    
    position += fallSpeed;
    fallingEl.style.top = position + 'px';
    fallingEl.style.setProperty('--current-y', position + 'px');
    
    // Si l'élément atteint le bas
    if (position >= gameArea.offsetHeight - 50) {
      clearInterval(fallInterval);
      if (element.type === 'inclusive') {
        // Manqué un élément inclusif = pénalité
        gameState.missed++;
        showFeedback('❌ Manqué !', 'incorrect');
      }
      fallingEl.classList.add('missed');
      setTimeout(() => fallingEl.remove(), 500);
    }
  }, 16); // ~60fps
  
  // Gestion du clic
  fallingEl.addEventListener('click', () => {
    if (fallingEl.classList.contains('collected') || fallingEl.classList.contains('missed')) return;
    
    clearInterval(fallInterval);
    fallingEl.classList.add('collected');
    
    if (element.type === 'inclusive') {
      // Bon élément collecté !
      gameState.collected++;
      gameState.score++;
      updateScore();
      collectPart();
      showFeedback('✅ +1', 'correct');
      
      // Vérifier si on a gagné
      if (gameState.collected >= gameState.target) {
        setTimeout(() => {
          endGame(true);
        }, 1000);
      }
    } else {
      // Mauvais élément cliqué = pénalité
      gameState.score = Math.max(0, gameState.score - 1);
      updateScore();
      showFeedback('❌ -1', 'incorrect');
    }
    
    // Animation vers la lettre I
    const letterI = document.getElementById('letter-i');
    if (letterI) {
      const rect = letterI.getBoundingClientRect();
      const gameAreaRect = gameArea.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2 - gameAreaRect.left;
      const targetY = rect.top + rect.height / 2 - gameAreaRect.top;
      
      fallingEl.style.setProperty('--target-x', targetX + 'px');
      fallingEl.style.setProperty('--target-y', targetY + 'px');
    }
    
    setTimeout(() => fallingEl.remove(), 500);
  });
  
  gameState.elements.push(fallingEl);
}

// Collecter une partie de la lettre I
function collectPart() {
  const partNumber = gameState.collected;
  if (partNumber <= 5) {
    const part = document.getElementById(`part-${partNumber}`);
    if (part) {
      part.classList.add('collected');
    }
  }
  
  // Si toutes les parties sont collectées
  if (gameState.collected >= gameState.target) {
    const letterI = document.getElementById('letter-i');
    if (letterI) {
      letterI.classList.add('complete');
    }
  }
}

// Afficher un feedback
function showFeedback(text, type) {
  const feedback = document.createElement('div');
  feedback.className = `game-feedback-popup ${type}`;
  feedback.textContent = text;
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.animation = 'popup 0.3s ease reverse';
    setTimeout(() => feedback.remove(), 300);
  }, 800);
}

// Mettre à jour le score
function updateScore() {
  const scoreEl = document.getElementById('game-score');
  if (scoreEl) {
    scoreEl.textContent = gameState.collected;
  }
}

// Terminer le jeu
function endGame(won = false) {
  gameState.isPlaying = false;
  
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  // Arrêter tous les éléments
  document.querySelectorAll('.falling-element').forEach(el => {
    el.style.animationPlayState = 'paused';
  });
  
  const resultDiv = document.getElementById('game-result');
  const resultTitle = document.getElementById('result-title');
  const resultMessage = document.getElementById('result-message');
  const resultBadge = document.getElementById('result-badge');
  const restartBtn = document.getElementById('game-restart');
  
  if (!resultDiv || !resultTitle || !resultMessage || !resultBadge) return;
  
  if (won || gameState.collected >= gameState.target) {
    resultTitle.textContent = '🎉 Félicitations !';
    resultMessage.innerHTML = `
      <p>Tu as construit le <strong>I</strong> de NIRD !</p>
      <p>Éléments inclusifs collectés : <strong>${gameState.collected}/${gameState.target}</strong></p>
      <p>Le numérique <strong>Inclusif</strong>, c'est ça ! 🌿</p>
    `;
    resultBadge.textContent = '🏆 Expert en Inclusion Numérique';
    resultBadge.style.background = 'linear-gradient(135deg, var(--color-success), var(--color-primary))';
  } else {
    resultTitle.textContent = '⏱️ Temps écoulé !';
    resultMessage.innerHTML = `
      <p>Tu as collecté <strong>${gameState.collected}/${gameState.target}</strong> éléments inclusifs.</p>
      <p>Continue pour compléter le I de NIRD ! 💪</p>
    `;
    resultBadge.textContent = '🔄 Essaie encore';
    resultBadge.style.background = 'linear-gradient(135deg, var(--color-warning), var(--color-secondary))';
  }
  
  resultDiv.style.display = 'block';
  if (restartBtn) restartBtn.style.display = 'block';
}

// Initialiser le jeu au chargement
document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('game-start');
  const restartBtn = document.getElementById('game-restart');
  
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }
  
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      initGame();
    });
  }
  
  // Initialiser le jeu si la section existe
  if (document.getElementById('jeu')) {
    initGame();
  }
});


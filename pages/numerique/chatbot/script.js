const questions = [
  {
    text: "Ton PC est vieux et lent, que fais-tu pour prolonger sa vie ?",
    choices: [
      { text: "Installer Linux léger et optimiser le système", good: true },
      { text: "Acheter un PC neuf immédiatement", good: false },
    ],
  },
  {
    text: "Tu dois stocker des fichiers personnels et sensibles. Quelle solution choisis-tu ?",
    choices: [
      {
        text: "Utiliser un cloud libre et auto-hébergé (Nextcloud, etc.)",
        good: true,
      },
      { text: "Mettre tout sur Google Drive sans chiffrement", good: false },
    ],
  },
  {
    text: "Un logiciel libre peut remplacer un logiciel propriétaire coûteux. Que fais-tu ?",
    choices: [
      {
        text: "Migrer vers le logiciel libre pour économiser et rester autonome",
        good: true,
      },
      { text: "Continuer à payer la licence propriétaire", good: false },
    ],
  },
  {
    text: "Tu as plusieurs périphériques électroniques à recycler. Quelle est la bonne démarche ?",
    choices: [
      { text: "Les donner à des associations ou reconditionneurs", good: true },
      { text: "Les jeter directement à la poubelle", good: false },
    ],
  },
  {
    text: "Tu veux créer un projet éducatif collaboratif. Où héberges-tu le code ?",
    choices: [
      {
        text: "Sur une plateforme ouverte et libre pour favoriser l’autonomie",
        good: true,
      },
      { text: "Sur un dépôt privé d’une Big Tech", good: false },
    ],
  },
];

let currentQuestion = 0;
let score = 0;

const messagesDiv = document.getElementById("messages");
const choicesDiv = document.getElementById("choices");
const scoreSpan = document.getElementById("score");
const progressBar = document.getElementById("progress");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Simulation IA (remplace un vrai API pour l'instant)
function fakeAIResponse(choiceText, good) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (good) {
        resolve(`👍 Bien joué ! "${choiceText}" est une décision durable.`);
      } else {
        resolve(`⚠️ "${choiceText}" est risqué pour l'autonomie numérique.`);
      }
    }, 1000);
  });
}

function updateProgress() {
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
}

function showQuestion() {
  choicesDiv.innerHTML = "";
  updateProgress();
  if (currentQuestion >= questions.length) {
    addMessage(
      `🎉 Quiz terminé ! Score final : ${score} / ${questions.length}`,
      "bot"
    );
    return;
  }

  const q = questions[currentQuestion];
  addMessage(q.text, "bot");

  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => handleChoice(choice);
    choicesDiv.appendChild(btn);
  });
}

async function handleChoice(choice) {
  addMessage(choice.text, "user");
  choicesDiv.innerHTML = "";

  const comment = await fakeAIResponse(choice.text, choice.good);
  addMessage(comment, "bot");

  if (choice.good) {
    score++;
    scoreSpan.innerText = score;
    currentQuestion++;
  } else {
    // Pas de passage automatique, l'utilisateur revoit la question
  }

  setTimeout(showQuestion, 1500);
}
// CODE VULNÉRABLE (NE PAS UTILISER DANS VOTRE VERSION FINALE)
function addMessage_VULNERABLE(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  // 🚨 DANGER : Ceci interprète tout le contenu de 'text' comme du code HTML !
  msg.innerHTML = text;

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
// CODE SÉCURISÉ (Votre version actuelle)
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  // ✅ SÉCURITÉ : Ceci insère le contenu comme du texte brut
  msg.innerText = text;

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
// Démarrage
addMessage("Bienvenue dans Chat'Bruti Gamifié ! 🚀", "bot");
setTimeout(showQuestion, 1500);

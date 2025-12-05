const questionsIncl = [
    {
        question: "Qui a crée le premier algorithme informatique executable par une machine ?",
        reponses: ["Ada Lovelace", "Alan Turing"],
        correcte: 0
    },
    {
        question: "Qui a crée le premier langage de programmation ?",
        reponses: ["Grace Hopper", "Dennis Ritchie", "Ken Thompson", "James Gosling"],
        correcte: 0
    },
    {
        question: "Qui a crée le premier système de télécommunications ?",
        reponses: ["Hedy Lamarr", "Claude Shannon", "Tim Berners"],
        correcte: 0
    },
    {
        question: "Qui a participé à Apollo 11 parmi ces propositions : ",
        reponses: ["Geoffrey Hinton", "Andrew Ng", "Katherine Johnson"],
        correcte: 2
    },
    {
        question: "Qui a crée la première calculatrice infomatique ?",
        reponses: ["Hedy Lamarr", "Geoffrey Hinton", "Alice Recoque"],
        correcte: 2
    },
    {
        question: "Qui a crée les boîtes noires ?",
        reponses: ["Ada Lovelace", "Stéphanie Shirley", "John von Neumann"],
        correcte: 1
    },
    {
        question: "Il y a une deuxième personne qui a participé au projet Apollo 11, qui est-ce ?",
        reponses: ["Ada Lovelace", "Margaret Hamilton"],
        correcte: 1
    }
];

const quizDiv = document.getElementById("quiz");
const validerBtn = document.getElementById("valider");
const resultatPre = document.getElementById("resultat");

let currentQuestionIncl = 0;
let waitingForNext = false;

function afficherQuestion(index) {
    const q = questionsIncl[index];
    quizDiv.innerHTML = `<h3>Question ${index + 1} / ${questionsIncl.length}</h3><p>${q.question}</p>`;
    q.reponses.forEach((rep, i) => {
        quizDiv.innerHTML += `
        <label>
            <input type="radio" name="reponse" value="${i}">
            ${rep}
        </label>
        `;
    });
    resultatPre.textContent = "";
    resultatPre.classList.remove("mauvais");
    validerBtn.textContent = "Valider ma réponse";
    waitingForNext = false;
}

validerBtn.addEventListener("click", () => {
    if (!waitingForNext) {
        // Validation de la réponse
        const choix = document.querySelector('input[name="reponse"]:checked');
        if (!choix) {
            alert("Veuillez sélectionner une réponse !");
            return;
        }
        const reponseChoisie = Number(choix.value);
        const q = questionsIncl[currentQuestionIncl];
        const bonneReponse = q.reponses[q.correcte];

        if (reponseChoisie === q.correcte) {
            resultatPre.textContent = `Bonne réponse : ${bonneReponse}`;
            resultatPre.classList.remove("mauvais");
        } else {
            resultatPre.textContent = `Mauvaise réponse.\nLa bonne réponse était : ${bonneReponse}`;
            resultatPre.classList.add("mauvais");
        }

        // Désactive les options pour empêcher changement
        document.querySelectorAll('input[name="reponse"]').forEach(input => input.disabled = true);

        validerBtn.textContent = currentQuestionIncl === questionsIncl.length - 1 ? "Terminer" : "Question suivante";
        waitingForNext = true;
    } else {
        // Passage à la question suivante
        currentQuestionIncl++;
        if (currentQuestionIncl < questionsIncl.length) {
            afficherQuestion(currentQuestionIncl);
        } else {
            // Fin du quiz : affichage du message + bouton source
            quizDiv.innerHTML = `
                <h3>Quiz terminé !</h3>
                <p>Le point commun entre toutes ces réponses ? Ce sont toutes des femmes oubliées de l'informatique !</p>
                <button id="btnSource">Source</button>
            `;
            resultatPre.textContent = "";
            validerBtn.style.display = "none";

            document.getElementById('btnSource').addEventListener('click', () => {
                window.open('https://www.cnil.fr/fr/8-femmes-qui-ont-marque-lhistoire-du-numerique', '_blank');
            });
        }
    }
});

// Affiche la première question au chargement
afficherQuestion(currentQuestionIncl);
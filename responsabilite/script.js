
function buildCookiePopup() {
    // Créer un clone du popup afin de l'afficher à plusieurs reprises
    const popup = document.getElementById('cookie-popup');
    if (!popup) {
        console.warn('Cookie popup element not found.');
        return;
    }

    popup.classList.add('active');
    
    const acceptButton = popup.querySelector('.accept-all');
    acceptButton.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    const declineButton = popup.querySelector('.customize');
    declineButton.addEventListener('click', () => {
        window.scrollTo(0, 0);
        alert("Non ! Vous ne pouvez pas refuser les cookies sur ce site !");
        window.location.reload();
    });

    window.addEventListener('mousemove', (event) => {
        if (getActivePageName() != "responsabilite") {
            return;
        }

        const rect = declineButton.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const distanceColeur = 500;
        if (distance < distanceColeur) {
            // Calculer une couleur rouge plus intense en fonction de la proximité
            const intensity = Math.floor((distance / distanceColeur) * 255);
            declineButton.style.backgroundColor = `rgb(255, ${intensity}, ${intensity})`;
        } else {
            declineButton.style.backgroundColor = '#ffffff';
        }

        const distanceDeplace = 100;
        if (distance < distanceDeplace) {
            // On fait s'échapper le boutton
            const directionX = (mouseX > window.innerWidth / 2) ? -1 : 1; // Si le curseur est à gauche, on part à droite et inversement
            const directionY = (mouseY > window.innerHeight / 2) ? -1 : 1; // Même chose pour le haut et la bas

            const strength = Math.max(0, (distanceDeplace - distance) / distanceDeplace); // 0 à 1
            const moveX = directionX * strength * 0.5 * distanceDeplace;
            const moveY = directionY * strength * 0.5 * distanceDeplace;

            let newLeft = rect.left + moveX;
            let newTop = rect.top + moveY;
            newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));

            // De façon occasionnelle, on déplace le bouton en un endroit aléatoire
            if (Math.random() < 0.01) {
                newLeft = Math.random() * (window.innerWidth - rect.width);
                newTop = Math.random() * (window.innerHeight - rect.height);
            }

            declineButton.style.position = 'fixed';
            declineButton.style.left = newLeft + 'px';
            declineButton.style.top = newTop + 'px';
        }
    });
}

function buildAdWindow() {
    const bouttonVaisselle = document.getElementById("button-ad-vaiselle");
    bouttonVaisselle.addEventListener("click", () => {
        alert("Félicitations ! Vous venez de contracter une maladie rare et incurable : la vaissellophilie aiguë. Vos symptômes incluent une obsession compulsive pour la vaisselle et une incapacité à résister à l'envie de faire la vaisselle en toutes circonstances. Consultez immédiatement un spécialiste en vaisselle pour un traitement approprié.");
    });

    const bouttonBiscuits = document.getElementById("button-ad-biscuits");
    bouttonBiscuits.addEventListener("click", () => {
        alert("Alerte santé : La consommation excessive de biscuits peut entraîner une dépendance sucrée sévère, des crises de gourmandise incontrôlables et une obsession pour les boîtes de biscuits. Les symptômes incluent également des rêves récurrents de biscuits géants et une incapacité à résister à l'appel du goûter. Consultez un spécialiste en nutrition sucrée pour un traitement adapté.");
    });
}

function main() {
    buildCookiePopup();
    buildAdWindow();
}

main();

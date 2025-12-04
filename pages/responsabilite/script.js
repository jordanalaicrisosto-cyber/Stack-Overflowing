
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
        alert("Non ! Vous ne pouvez pas refuser les cookies sur ce site !");
        // Scroll up
        window.scrollTo(0, 0);zieruhfuighiue
        window.location.reload();
    });

    window.addEventListener('mousemove', (event) => {
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

        const distanceDeplace = 300;
        if (distance < distanceDeplace) {
            // Make the button literally run away based on the cursor position and the screen borders
                        // Decide direction based on which half of the screen the cursor is in
                        const directionX = (mouseX > window.innerWidth / 2) ? -1 : 1; // if cursor on right -> move left, else move right
                        const directionY = (mouseY > window.innerHeight / 2) ? -1 : 1; // if cursor on bottom -> move up, else move down

                        // Strength scales with proximity (closer => stronger)
                        const strength = Math.max(0, (distanceDeplace - distance) / distanceDeplace); // 0..1

                        // Compute movement amounts (tweak multiplier to taste)
                        const moveX = directionX * strength * 0.5 * distanceDeplace;
                        const moveY = directionY * strength * 0.5 * distanceDeplace;

                        let newLeft = rect.left + moveX;
                        let newTop = rect.top + moveY;

                        // Ensure the button stays within the viewport
                        newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
                        newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));

                        declineButton.style.position = 'fixed';
                        declineButton.style.left = newLeft + 'px';
                        declineButton.style.top = newTop + 'px';
        }
    });
}

function main() {
    buildCookiePopup();
}

main();


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
        alert("Il n'est pas possible de refuser les cookies sur ce site. Pour son bon fonctionnement, l'acceptation des cookies est obligatoire.");
    });
}

function main() {
    buildCookiePopup();
}

main();

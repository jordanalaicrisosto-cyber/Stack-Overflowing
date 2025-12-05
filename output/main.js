let currentOpen = null;
let nomPageActive = null;

function openPage(element, nom = null) {
    if (currentOpen != null) {
        currentOpen.classList.remove("active");
    }

    if (element == null) {
        nomPageActive = null;
        return;
    }

    currentOpen = element;
    currentOpen.classList.add("active");
    currentOpen.scrollIntoView({ behavior: "smooth", block: "start" });
    nomPageActive = nom;
}

function getActivePageName() {
    return nomPageActive;
}

function createLandingButtons() {
    const letters = document.querySelectorAll(".landing .lettre");

    letters.forEach(element => {
        element.addEventListener("click", () => {
            const targetPage = element.getAttribute("data-page");
            if (targetPage == null) {
                console.error("No target page found for this button.");
                openPage(null);
                return;
            }
            const pageElement = document.querySelector(`section#${targetPage}`);
            if (pageElement == null) {
                console.error(`No page found with id: ${targetPage}`);
                openPage(null);
                return;
            }
            
            openPage(pageElement, targetPage);
        });
    });
}

function main() {
    createLandingButtons();
}

main();

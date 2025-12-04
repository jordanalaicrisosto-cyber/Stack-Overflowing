
let currentOpen = null;

function openPage(element) {
    if (currentOpen != null) {
        currentOpen.style.display = "none";
    }

    if (element == null) {
        return;
    }

    currentOpen = element;
    currentOpen.style.display = "block";
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
            
            openPage(pageElement);
        });
    });
}

function main() {
    createLandingButtons();
}

main();

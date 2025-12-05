import os

PATH_PAGES = "./pages"
PATH_MAIN = "./main"
PATH_OUTPUT = "./output"

class Page:
    def __init__(self, name, content):
        self.name = name
        self.content = content
        self.resources = []

    def add_resource(self, resource_path):
        self.resources.append(resource_path)

def clean_output():
    # Ne pas supprimer le dossier output, mais le vider entièrement
    if os.path.exists(PATH_OUTPUT):
        for root, dirs, files in os.walk(PATH_OUTPUT, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
    else:
        os.makedirs(PATH_OUTPUT)

def resolve_paths():
    global PATH_PAGES, PATH_MAIN, PATH_OUTPUT

    # Résolution des chemins absolus
    PATH_PAGES = os.path.abspath(PATH_PAGES)
    PATH_MAIN = os.path.abspath(PATH_MAIN)
    PATH_OUTPUT = os.path.abspath(PATH_OUTPUT)

def commit_page(page: Page, root):
    page_path = os.path.join(PATH_OUTPUT, page.name)
    os.makedirs(os.path.dirname(page_path), exist_ok=True)

    # Copier les ressources
    for resource in page.resources:
        resource_dest = os.path.join(PATH_OUTPUT, os.path.relpath(resource, root))
        os.makedirs(os.path.dirname(resource_dest), exist_ok=True)
        with open(resource, 'rb') as src_file:
            with open(resource_dest, 'wb') as dest_file:
                dest_file.write(src_file.read())

def recursive_load_resources(folder_path, page: Page):
    for item_name in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item_name)

        if os.path.isdir(item_path):
            recursive_load_resources(item_path, page)
        else:
            if item_name != "index.html":
                page.add_resource(item_path)

def load_pages():
    pages = []

    for folder_name in os.listdir(PATH_PAGES):
        folder_path = os.path.join(PATH_PAGES, folder_name)

        # Vérifier que c'est bien un dossier
        if not os.path.isdir(folder_path):
            print(f"Skipping non-directory item: {folder_name}")
            continue

        # Charger le contenu de la page
        contents = None
        index_path = os.path.join(folder_path, "index.html")
        if os.path.isfile(index_path):
            with open(index_path, 'r', encoding='utf-8') as f:
                contents = f.read()
        else:
            print(f"Missing index.html in {folder_name}, skipping.")
            continue
        if contents is None:
            print(f"Failed to load contents for {folder_name}, skipping.")
            continue

        # Créer l'objet Page et charger les ressources
        page = Page(folder_name, contents)
        recursive_load_resources(folder_path, page)
        pages.append(page)

    return pages

def build_main(pages):
    # Charger le contenu principal
    main_index_path = os.path.join(PATH_MAIN, "index.html")
    if not os.path.isfile(main_index_path):
        print("Main index.html not found, skipping main build.")
        exit(1)

    with open(main_index_path, 'r', encoding='utf-8') as f:
        main_content = f.read()

        # Générer le contenu des pages
        pages_content = ""
        for page in pages:
            pages_content += f'<section id="{page.name}">\n{page.content}\n</section>\n'

        # Rechercher et remplacer la balise de contenu
        main_content = main_content.replace("{{content}}", pages_content)

        main_page = Page(name="index.html", content=main_content)
        recursive_load_resources(PATH_MAIN, main_page)
        commit_page(main_page, PATH_MAIN)

        # Écrire le fichier principal
        main_output_path = os.path.join(PATH_OUTPUT, "index.html")
        os.makedirs(os.path.dirname(main_output_path), exist_ok=True)
        with open(main_output_path, 'w', encoding='utf-8') as out_file:
            out_file.write(main_page.content)

if __name__ == "__main__":
    clean_output()

    resolve_paths()
    pages = load_pages()

    build_main(pages)
    for page in pages:
        commit_page(page, PATH_PAGES)

/**
 * Connects the category list, search and detail forms to the API.
 */
class CategoryController {
    /**
     * Loads the category list and registers its form handlers.
     */
    static async initialize() {
        const addCategoryForm = document.querySelector('#add-category');
        const searchCategoryForm = document.querySelector('#search-category');

        // This controller also runs on the detail page, which has no category list.
        if (!document.querySelector('#category-list')) {
            return;
        }

        await CategoryController.getAllCategories();


        addCategoryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // The API expects 1 or 0 for the active status.
            const formIsActiveValue = document.querySelector('#add-category-active')?.checked ? 1 : 0;
            const formCategoryNameValue = document.querySelector('#add-category-name')?.value.trim();

            const dataToAdd = {
                "active": formIsActiveValue,
                "name": formCategoryNameValue
            }

            CategoryController.addCategory(dataToAdd);
        });

        // Restore controls when the browser reuses the page after Back navigation.
        window.addEventListener('pageshow', (event) => {
            searchCategoryForm.inert = false;

            const table = document.querySelector('.shop-table-scroll');
            if (event.persisted && table) {
                table.inert = false;
            }
        });

        searchCategoryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formInputId = Number(document.querySelector('#category-search-number')?.value);

            CategoryController.searchCategory(formInputId);

        });

    }

    /**
     * Renders the category list or shows why it could not load.
     * @returns {Promise<void>}
     */
    static async getAllCategories() {
        try {
            const data = await CategoryModel.getAllCategories();
            CategoryListView.buildAllCategoriesList(data);
        } catch (error) {
            CategoryListView.getAllCategoriesFailed(error.message);
        }
    }

    /**
     * Opens the permalink for a category.
     * @param {number|string} categoryId Category ID.
     */
    static showCategoryInDetail(categoryId) {
        const url = new URL('/item.php', baseURL);
        url.searchParams.set('category', "category");
        url.searchParams.set('id', categoryId)

        window.location.href = url.href;
    }

    /**
     * Deletes a category and refreshes the list on success.
     * @param {MouseEvent} event Click on the delete button.
     * @param {number|string} categoryId Category ID.
     * @returns {Promise<void>}
     */
    static async deleteCategory(event, categoryId) {
        // Keep the delete click from opening the detail page through the row handler.
        event.stopPropagation()

        const table = document.querySelector(".shop-table-scroll");
        table.inert = true;

        try {
            const hadSuccess = await CategoryModel.deleteCategory(categoryId);
            if (hadSuccess) {
                MessageView.buildSuccess("all-categories-info", `Kategorie mit der ID ${categoryId} wurde gelöscht!`);
                await CategoryController.reloadAllCategoriesList();
            }
        } catch (error) {
            MessageView.buildError("all-categories-info", `Fehler beim löschen der Kategorie: ${error.message}`);
        } finally {
            table.inert = false;
        }
    }

    /**
     * Creates a category and refreshes the list on success.
     * @param {{active: number, name: string}} data Name and active status (1 or 0).
     * @returns {Promise<void>}
     */
    static async addCategory(data) {
        MessageView.closeAllErrors(["input-category-active-p", "input-category-name-p", "input-category-form-p"]);

        if (!CategoryController.validateUserInput(data)) {
            return;
        }

        const form = document.querySelector("#add-category");
        form.inert = true;

        try {
            const hadSuccesses = await CategoryModel.postCategory(data);
            if (hadSuccesses) {
                MessageView.buildInputFormSuccess("input-category-form-p",
                    `Die Kategorie ${data.name} erfolgreich hinzugefügt!`);
                await CategoryController.reloadAllCategoriesList();
            }
        } catch (error) {
            MessageView.buildInputFormError("input-category-form-p",
                `Ein Fehler ist aufgetreten: ${error.message}`);
        } finally {
            form.inert = false;
        }
    }

    /**
     * Validates the search input and opens the matching detail page.
     * @param {number} idQuery Category ID entered in the search form.
     */
    static searchCategory(idQuery) {
        if (!idQuery || typeof idQuery !== "number" || idQuery <= 0) {
            MessageView.buildInputFormError("category-search-query-p", "Die eingeben ID ist ungültig.");
            return;
        }

        document.querySelector("#search-category").inert = true;
        CategoryController.showCategoryInDetail(idQuery);
    }

    /**
     * Saves the category and refreshes its detail view on success.
     * @param {number|string} id ID of the category to update.
     * @param {{active: number, name: string}} data Name and active status (1 or 0).
     * @returns {Promise<void>}
     */
    static async patchCategory(id, data) {
        MessageView.closeAllErrors(["input-category-active-p", "input-category-name-p", "input-category-form-p"]);

        if (!CategoryController.validateUserInput(data)) {
            return;
        }

        const form = document.querySelector("#patch-category");
        form.inert = true;

        try {
            const hadSuccesses = await CategoryModel.patchCategory(id, data);
            if (hadSuccesses) {
                CategoryDetailView.buildSite(id, data);
                MessageView.buildInputFormSuccess("input-category-form-p",
                    `Die Kategorie ${data.name} erfolgreich geändert!`);
            }
        } catch (error) {
            MessageView.buildInputFormError("input-category-form-p",
                "Konnte nicht gespeichert werden: " + error.message);
        } finally {
            form.inert = false;
        }

    }


    /**
     * Shows the first validation error next to the relevant field.
     * @param {{active: number, name: string}} data Name and active status (1 or 0).
     * @returns {boolean} True if the data passes validation.
     */
    static validateUserInput(data) {
        if (typeof data.active !== "number" || (data.active !== 0 && data.active !== 1)) {
            MessageView.buildInputFormError("input-category-active-p", "Bitte geben Sie ein gültiges Aktiv-Wert ein.")
            return false;
        }

        if (!data.name || typeof data.name !== "string") {
            MessageView.buildInputFormError("input-category-name-p", "Bitte geben Sie ein gültiges Kategorienamen ein.");
            return false;
        }

        return true;
    }


    /**
     * Refreshes the category list after a change.
     * @returns {Promise<void>}
     */
    static async reloadAllCategoriesList() {
        await CategoryController.getAllCategories();
    }


    /**
     * Loads the category and connects its edit form.
     * @param {number|string} categoryId Category ID.
     * @returns {Promise<void>}
     */
    static async showDetailCategory(categoryId) {
        const patchCategoryForm = document.querySelector('#patch-category');
        await CategoryController.getOneCategory(categoryId);

        patchCategoryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const activeValue = document.querySelector('#patch-category-active')?.checked ? 1 : 0;
            const nameValue = document.querySelector('#patch-category-name')?.value;

            const data = {
                active: activeValue,
                name: nameValue,
            }

            CategoryController.patchCategory(categoryId, data);
        })
    }

    /**
     * Renders one category or shows a message for the failed request.
     * @param {number|string} categoryId Category ID.
     * @returns {Promise<void>}
     */
    static async getOneCategory(categoryId) {
        try {
            const data = await CategoryModel.getCategory(categoryId);
            CategoryDetailView.buildSite(categoryId, data);
        } catch (error) {
            if (error.message === "Not authorized") {
                CategoryDetailView.buildNotAuthorized();
            } else if (error.message === "Not found") {
                CategoryDetailView.buildNotFound(categoryId);
            } else {
                CategoryDetailView.buildError(error.message);
            }
        }
    }
}

CategoryController.initialize().catch((error) => console.error(error));

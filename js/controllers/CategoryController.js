/**
 * Handels Category
 */
class CategoryController {
    /**
     * Initialize the Site with data and Event listeners
     */
    static async initialize() {
        const addCategoryForm = document.querySelector('#add-category');
        const searchCategoryForm = document.querySelector('#search-category');

        // Category list and create/search forms only exist on category.php.
        if (!document.querySelector('#category-list')) {
            return;
        }

        // fill the Categories List with data
        await CategoryController.getAllCategories();


        // add Event listener
        addCategoryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // if element not exits or was not checked get 0, otherwise 1
            const formIsActiveValue = document.querySelector('#add-category-active')?.checked ? 1 : 0;
            // if element not exits get null otherwise extract the value with trim
            const formCategoryNameValue = document.querySelector('#add-category-name')?.value.trim();

            const dataToAdd = {
                "active": formIsActiveValue,
                "name": formCategoryNameValue
            }

            CategoryController.addCategory(dataToAdd);
        });

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
     * Get all Categories
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
     * Redirect the User to the details Site
     * @param categoryId id of the category
     */
    static showCategoryInDetail(categoryId) {
        const url = new URL('/item.php', baseURL);
        url.searchParams.set('category', "category");
        url.searchParams.set('id', categoryId)

        window.location.href = url.href;
    }

    /**
     * Delete the given Category
     * @param event Event listener Event Object
     * @param categoryId Category ID to delete
     * @returns {Promise<void>}
     */
    static async deleteCategory(event, categoryId) {
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
     * Add a new Category
     * @param data Object that has the data to add. Needs to have the key active and name.
     * @returns {Promise<void>}
     */
    static async addCategory(data) {
        MessageView.closeAllErrors(["input-category-active-p", "input-category-name-p", "input-category-form-p"]);

        if (!CategoryController.validateUserInput(data)) {
            return;
        }

        // add the new category
        const form = document.querySelector("#add-category");
        form.inert = true;

        try {
            const hadSuccesses = await CategoryModel.postCategory(data);
            if (hadSuccesses) {
                MessageView.buildInputFormSuccess("input-category-form-p",
                    `Die Kategorie ${data.name} erfolgreich hinzugefügt!`);
                // load list new
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
     * Validate and do a search (via redirect @CategoryController.showCategoryInDetail)
     * From a Form
     * @param idQuery ID to search from the user
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
     * Update the Category
     * @param id the category to update
     * @param data the data to change. Object with the key active and name
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
     * Validate the user Input
     * @param data object with the key active and name
     * @returns {boolean} true if OK, false if not
     */
    static validateUserInput(data) {
        // check the value active
        // checks for value has a value, value is a number, value is not equal to 0 or 1
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
     * Reload all categories in the list
     * @returns {Promise<void>}
     */
    static async reloadAllCategoriesList() {
        await CategoryController.getAllCategories();
    }


    /**
     * Initialize the detail Category site
     * @param categoryId the category to show
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
     * Get one Category
     * @param categoryId the category id
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

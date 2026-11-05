import {MessageView} from "../views/MessageView.js";
import {InteractionView} from "../views/InteractionView.js";
import {App} from "../app.js";

/**
 * Connects the category list, search and detail forms to the API.
 */
export class CategoryController {
    /**
     * Shared instance for the current browser page.
     * @type {CategoryController|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Model used to load and save records.
     * @type {CategoryModel}
     */
    categoryModel;

    /**
     * View for the overview forms and table.
     * @type {CategoryListView}
     */
    listView;

    /**
     * View for record details and edits.
     * @type {CategoryDetailView}
     */
    detailView;

    /**
     * View for logout Button.
     * @type {NavigationView}
     */
    navigationView;

    /**
     * Receives the dependencies when the shared instance is created.
     * @param {CategoryModel} categoryModel Model used to load and save records.
     * @param {CategoryListView} listView View for the overview forms and table.
     * @param {CategoryDetailView} detailView View for record details and edits.
     * @param {NavigationView} navigationView View for logout Button.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(categoryModel, listView, detailView, navigationView, key) {
        if (key !== CategoryController.#key) {
            throw new Error("Use CategoryController.getInstance().");
        }

        this.categoryModel = categoryModel;
        this.listView = listView;
        this.detailView = detailView;
        this.navigationView = navigationView;

        CategoryController.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @param {CategoryModel} categoryModel Model used to load and save records.
     * @param {CategoryListView} listView View for the overview forms and table.
     * @param {CategoryDetailView} detailView View for record details and edits.
     * @param {NavigationView} navigationView View for logout Button.
     * @returns {CategoryController} Shared instance for this page.
     */
    static getInstance(categoryModel, listView, detailView, navigationView) {
        return CategoryController.#instance ??= new CategoryController(
            categoryModel,
            listView,
            detailView,
            navigationView,
            CategoryController.#key,
        );
    }

    /**
     * Loads the category list and registers its form handlers.
     * @returns {Promise<void>}
     */
    async initialize() {
        await this.getAllCategories();

        this.listView.bindCreate((data) => this.addCategory(data));
        this.listView.bindSearch((id) => this.searchCategory(id));
    }

    /**
     * Renders the category list or shows why it could not load.
     * @returns {Promise<void>}
     */
    async getAllCategories() {
        try {
            const data = await this.categoryModel.getAllCategories();
            this.navigationView.logoutText()
            this.listView.buildAllCategoriesList(data, {
                onOpen: (id) => this.showCategoryInDetail(id),
                onDelete: (id) => this.deleteCategory(id),
            });
        } catch (error) {
            if (error.message === "Not authorized") {
                this.navigationView.loginText();
            }
            this.listView.getAllCategoriesFailed(error.message);
        }
    }

    /**
     * Opens the permalink for a category.
     * @param {number|string} categoryId Category ID.
     */
    showCategoryInDetail(categoryId) {
        window.location.href = App.buildDetailUrl("category", categoryId);
    }

    /**
     * Deletes a category and refreshes the list on success.
     * @param {number|string} categoryId Category ID.
     * @returns {Promise<void>}
     */
    async deleteCategory(categoryId) {
        InteractionView.setDisabled(".shop-table-scroll", true);

        try {
            const hadSuccess = await this.categoryModel.deleteCategory(categoryId);
            if (hadSuccess) {
                MessageView.buildSuccess("all-categories-info", `Kategorie mit der ID ${categoryId} wurde gelöscht!`);
                await this.reloadAllCategoriesList();
            }
        } catch (error) {
            MessageView.buildError("all-categories-info", `Fehler beim löschen der Kategorie: ${error.message}`);
        } finally {
            InteractionView.setDisabled(".shop-table-scroll", false);
        }
    }

    /**
     * Creates a category and refreshes the list on success.
     * @param {{active: number, name: string}} data Name and active status (1 or 0).
     * @returns {Promise<void>}
     */
    async addCategory(data) {
        MessageView.closeAllErrors(["input-category-active-p", "input-category-name-p", "input-category-form-p"]);

        if (!this.validateUserInput(data)) {
            return;
        }

        InteractionView.setDisabled("#add-category", true);

        try {
            const hadSuccesses = await this.categoryModel.postCategory(data);
            if (hadSuccesses) {
                MessageView.buildInputFormSuccess("input-category-form-p",
                    `Die Kategorie ${data.name} erfolgreich hinzugefügt!`);
                await this.reloadAllCategoriesList();
            }
        } catch (error) {
            MessageView.buildInputFormError("input-category-form-p",
                `Ein Fehler ist aufgetreten: ${error.message}`);
        } finally {
            InteractionView.setDisabled("#add-category", false);
        }
    }

    /**
     * Validates the search input and opens the matching detail page.
     * @param {number} idQuery Category ID entered in the search form.
     */
    searchCategory(idQuery) {
        if (!idQuery || typeof idQuery !== "number" || idQuery <= 0) {
            MessageView.buildInputFormError("category-search-query-p", "Die eingeben ID ist ungültig.");
            return;
        }

        InteractionView.showNavigation("#search-category");
        this.showCategoryInDetail(idQuery);
    }

    /**
     * Saves the category and refreshes its detail view on success.
     * @param {number|string} id ID of the category to update.
     * @param {{active: number, name: string}} data Name and active status (1 or 0).
     * @returns {Promise<void>}
     */
    async patchCategory(id, data) {
        MessageView.closeAllErrors(["input-category-active-p", "input-category-name-p", "input-category-form-p"]);

        if (!this.validateUserInput(data)) {
            return;
        }

        InteractionView.setDisabled("#patch-category", true);

        try {
            const hadSuccesses = await this.categoryModel.patchCategory(id, data);
            if (hadSuccesses) {
                this.detailView.buildSite(id, data);
                MessageView.buildInputFormSuccess("input-category-form-p",
                    `Die Kategorie ${data.name} erfolgreich geändert!`);
            }
        } catch (error) {
            MessageView.buildInputFormError("input-category-form-p",
                "Konnte nicht gespeichert werden: " + error.message);
        } finally {
            InteractionView.setDisabled("#patch-category", false);
        }

    }


    /**
     * Shows the first validation error next to the relevant field.
     * @param {{active: number, name: string}} data Name and active status (1 or 0).
     * @returns {boolean} True if the data passes validation.
     */
    validateUserInput(data) {
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
    async reloadAllCategoriesList() {
        await this.getAllCategories();
    }


    /**
     * Loads the category and connects its edit form.
     * @param {number|string} categoryId Category ID.
     * @returns {Promise<void>}
     */
    async showDetailCategory(categoryId) {
        await this.getOneCategory(categoryId);

        // Keep the category ID in the callback so the view only passes the edited fields.
        this.detailView.bindEdit((data) => this.patchCategory(categoryId, data));
    }

    /**
     * Renders one category or shows a message for the failed request.
     * @param {number|string} categoryId Category ID.
     * @returns {Promise<void>}
     */
    async getOneCategory(categoryId) {
        try {
            const data = await this.categoryModel.getCategory(categoryId);
            this.navigationView.logoutText()
            this.detailView.buildSite(categoryId, data);
        } catch (error) {
            if (error.message === "Not authorized") {
                this.navigationView.loginText();
                this.detailView.buildNotAuthorized();
            } else if (error.message === "Not found") {
                this.detailView.buildNotFound(categoryId);
            } else {
                this.detailView.buildError(error.message);
            }
        }
    }
}

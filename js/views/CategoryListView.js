import {InteractionView} from "./InteractionView.js";
import {App} from "../app.js";

/**
 * Renders the category overview and handles input from its forms and rows.
 */
export class CategoryListView {
    /**
     * Shared instance for the current browser page.
     * @type {CategoryListView|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Creates the shared view through its private constructor key.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(key) {
        if (key !== CategoryListView.#key) {
            throw new Error("Use CategoryListView.getInstance().");
        }

        CategoryListView.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {CategoryListView} Shared instance for this page.
     */
    static getInstance() {
        return CategoryListView.#instance ??= new CategoryListView(CategoryListView.#key);
    }


    /**
     * Reads the create form when it is submitted.
     * @param {function(Object): Promise<void>} onCreate Receives the name and numeric active flag.
     */
    bindCreate(onCreate) {
        document.querySelector("#add-category").addEventListener("submit", (event) => {
            event.preventDefault();

            const data = {
                active: document.querySelector("#add-category-active")?.checked ? 1 : 0,
                name: document.querySelector("#add-category-name")?.value.trim(),
            };


            return onCreate(data);
        });
    }

    /**
     * Converts the entered category ID to a number on submit.
     * @param {function(number): void} onSearch Receives the category ID from the form.
     */
    bindSearch(onSearch) {
        document.querySelector("#search-category").addEventListener("submit", (event) => {
            event.preventDefault();

            const categoryId = Number(document.querySelector("#category-search-number")?.value);
            onSearch(categoryId);
        });
    }

    /**
     * Replaces the category list with an error message.
     * @param {string} text Reason the list could not load.
     */
    getAllCategoriesFailed(text) {
        const tbody = document.querySelector("#category-list");
        const htmlString =
            `
            <tr>
            <td colspan="7">
                Liste konnte nicht geladen werden. ${App.escapeHTML(text)}
            </td>
            </tr>
            `;
        tbody.innerHTML = "";
        tbody.innerHTML = htmlString;
    }

    /**
     * Renders the categories and connects the detail and delete actions.
     * @param {Object[]} allCategoriesList Categories returned by the API.
     * @param {Object} actions Callbacks supplied by the controller.
     * @param {function(number|string): void} actions.onOpen Receives the category ID when the row is clicked.
     * @param {function(number|string): Promise<void>} actions.onDelete Receives the category ID when Delete is clicked.
     */
    buildAllCategoriesList(allCategoriesList, actions) {
        const categoriesListElement = document.querySelector('#category-list');
        categoriesListElement.innerHTML = '';

        for (const category of allCategoriesList) {
            const url = App.buildDetailUrl("category", category.category_id);

            const htmlString =
                `
                <tr id="category-item-${App.escapeHTML(category.category_id)}">
                    <td>${App.escapeHTML(category.category_id)}</td>
                    <td class="shop-name">
                        <a href="${url}">${App.escapeHTML(category.name)}</a>
                    </td>
                    <td>${Number(App.escapeHTML(category.active)) === 1 ? "aktiv" : "inaktiv"}</td>
                    <td>
                        <button type="button" class="shop-delete" id="category-item-delete-${category.category_id}">
                            Löschen
                        </button>
                    </td>
                </tr>
                `;

            categoriesListElement.insertAdjacentHTML('beforeend', htmlString);

            document.getElementById(`category-item-${category.category_id}`)
                .addEventListener('click', (event) => {

                    InteractionView.showNavigation(".shop-table-scroll");
                    actions.onOpen(category.category_id);
                });

            document.getElementById(`category-item-delete-${category.category_id}`)
                .addEventListener('click', (event) => {
                    event.stopPropagation();
                    return actions.onDelete(category.category_id);
                });
        }
    }
}

import {InteractionView} from "./InteractionView.js";
import { App } from "../app.js";

/**
 * Renders the product overview and handles input from its forms and rows.
 */
export class ProductListView {
    /**
     * Shared instance for the current browser page.
     * @type {ProductListView|null}
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
        if (key !== ProductListView.#key) {
            throw new Error("Use ProductListView.getInstance().");
        }

        ProductListView.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {ProductListView} Shared instance for this page.
     */
    static getInstance() {
        return ProductListView.#instance ??= new ProductListView(ProductListView.#key);
    }

    /**
     * Reads the create form when it is submitted.
     * @param {function(string, Object): Promise<void>} onCreate Receives the SKU and product fields.
     */
    bindCreate(onCreate) {
        document.querySelector("#add-product").addEventListener("submit", (event) => {
            event.preventDefault();

            const sku = document.querySelector("#add-product-sku")?.value.trim();
            const data = {
                active: document.querySelector("#add-product-active")?.checked ? 1 : 0,
                id_category: Number(document.querySelector("#add-product-category")?.value),
                name: document.querySelector("#add-product-name")?.value.trim(),
                image: document.querySelector("#add-product-image")?.value.trim(),
                description: document.querySelector("#add-product-description")?.value.trim(),
                price: Number(document.querySelector("#add-product-price")?.value),
                stock: Number(document.querySelector("#add-product-stock")?.value),
            };

            return onCreate(sku, data);
        });
    }

    /**
     * Passes the entered SKU to the search action on submit.
     * @param {function(string): void} onSearch Receives the trimmed SKU.
     */
    bindSearch(onSearch) {
        document.querySelector("#search-product").addEventListener("submit", (event) => {
            event.preventDefault();

            const sku = document.querySelector("#product-search-sku")?.value.trim();
            onSearch(sku);
        });
    }

    /**
     * Replaces the product list with an error message.
     * @param {string} text Reason the list could not load.
     */
    getAllProductFailed(text) {
        const productsSection = document.querySelector('#all-products-section');
        const htmlString =
            `
            <h2>Liste konnte nicht geladen werden.</h2>
            <p>${text}</p>
            `;
        productsSection.innerHTML = "";
        productsSection.innerHTML = htmlString;
    }

    /**
     * Renders the products and connects their row actions.
     * @param {Object[]} productsList Products returned by the API.
     * @param {Object} actions Callbacks supplied by the controller.
     * @param {function(string): void} actions.onOpen Receives the SKU when the row is clicked.
     * @param {function(string): Promise<void>} actions.onDelete Receives the SKU when Delete is clicked.
     */
    buildAllProductList(productsList, actions) {
        const productsListElement = document.querySelector('#product-list');
        productsListElement.innerHTML = '';

        for (const product of productsList) {
            const url = App.buildDetailUrl("product", product.sku);

            const htmlString =
                `
                <tr id="product-row-${product.sku}">
                    <td>${product.sku}</td>
                    <td class="shop-name"><a href="${url}">${product.name}</a></td>
                    <td>${product.id_category}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${Number(product.active) === 1 ? "aktiv" : "inaktiv"}</td>
                    <td>
                        <button type="button" class="shop-delete" id="product-item-delete-${product.sku}">
                            Löschen
                        </button>
                    </td>
                </tr>
                `;

            productsListElement.insertAdjacentHTML('beforeend', htmlString);

            document.getElementById(`product-row-${product.sku}`)
                .addEventListener('click', (event) => {
                    const link = event.target.closest("a");
                    // Keep browser shortcuts such as opening a link in a new tab.
                    if (link && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
                        return;
                    }

                    InteractionView.showNavigation(".shop-table-scroll");
                    // The name link already handles its own navigation.
                    if (!link) {
                        actions.onOpen(product.sku);
                    }
                });

            document.getElementById(`product-item-delete-${product.sku}`)
                .addEventListener('click', (event) => {
                    // Stop the click at the button so it does not open the row.
                    event.stopPropagation();
                    return actions.onDelete(product.sku);
                });
        }
    }
}

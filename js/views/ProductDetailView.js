import {App} from "../app.js";

/**
 * Renders product details and collects edits from the form.
 */
export class ProductDetailView {
    /**
     * Shared instance for the current browser page.
     * @type {ProductDetailView|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Receives the dependencies when the shared instance is created.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(key) {
        if (key !== ProductDetailView.#key) {
            throw new Error("Use ProductDetailView.getInstance().");
        }

        ProductDetailView.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {ProductDetailView} Shared instance for this page.
     */
    static getInstance() {
        return ProductDetailView.#instance ??= new ProductDetailView(ProductDetailView.#key);
    }


    /**
     * Reads the current edit values when the form is submitted.
     * @param {function(Object): Promise<void>} onSave Receives the edited fields. The controller supplies the SKU.
     */
    bindEdit(onSave) {
        document.querySelector("#put-product")?.addEventListener("submit", (event) => {
            event.preventDefault();

            const data = {
                active: document.querySelector("#put-product-active")?.checked ? 1 : 0,
                id_category: Number(document.querySelector("#put-product-category")?.value),
                name: document.querySelector("#put-product-name")?.value.trim(),
                image: document.querySelector("#put-product-image")?.value.trim(),
                description: document.querySelector("#put-product-description")?.value.trim(),
                price: Number(document.querySelector("#put-product-price")?.value),
                stock: Number(document.querySelector("#put-product-stock")?.value),
            };

            return onSave(data);
        });
    }

    /**
     * Replaces the detail page with a sign-in message after a 401 response.
     */
    buildNotAuthorized() {
        const page = document.querySelector('#product-detail-page');
        const htmlString =
            `
            <h1>Produkt konnte nicht geladen werden!</h1>
            <p>Sie sind nicht dafür autorisiert. Melden Sie sich bitte zuerst und versuchen Sie es erneut.</p>
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    /**
     * Shows which product could not be found.
     * @param {string} sku SKU requested in the detail URL.
     */
    buildNotFound(sku) {
        const page = document.querySelector('#product-detail-page');
        const htmlString =
            `
            <h1>Produkt konnte nicht gefunden werden!</h1>
            <p>Bitte erstellen Sie zuerst das Produkt und versuchen Sie es dann erneut oder passen sie die SKU an.<br>
            Aktuelle SKU: ${App.escapeHTML(sku)}<br>
            </p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;
    }

    /**
     * Replaces the details and edit form with a load error.
     */
    buildError() {
        const page = document.querySelector('#product-detail-page');
        const htmlString =
            `
            <h1>Produkt konnte nicht geladen werden!</h1>
            <p>Bitte versuchen Sie es erneut.</p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    /**
     * Renders the product and fills the edit form with the same values.
     * @param {string} sku SKU from the detail URL, used if the record has no SKU.
     * @param {Object} data Product record used for the details and form.
     */
    buildSite(sku, data) {
        const view = document.querySelector('#product-detail-view');

        const viewHTMLString = `
        <h2>Produkt: ${App.escapeHTML(data.name)}</h2>
        <div class="product-details">
            <dl class="shop-properties">
                <dt>Produkt-ID</dt>
                <dd>${App.escapeHTML(data.product_id)}</dd>
                <dt>SKU</dt>
                <dd>${App.escapeHTML(data.sku ?? sku)}</dd>
                <dt>Aktivstatus</dt>
                <dd>${Number(App.escapeHTML(data.active)) === 1 ? "aktiv" : "inaktiv"}</dd>
                <dt>Kategorie-ID</dt>
                <dd>${App.escapeHTML(data.id_category)}</dd>
                <dt>Bild-URL</dt>
                <dd>${App.escapeHTML(data.image)}</dd>
                <dt>Beschreibung</dt>
                <dd>${App.escapeHTML(data.description)}</dd>
                <dt>Preis (CHF)</dt>
                <dd>${App.escapeHTML(data.price)}</dd>
                <dt>Lagerbestand</dt>
                <dd>${App.escapeHTML(data.stock)}</dd>
            </dl>
            <img src="${App.escapeHTML(data.image)}" alt="Bild: ${App.escapeHTML(data.name)}">
        </div>
    `;

        view.innerHTML = "";
        view.innerHTML = viewHTMLString;

        document.querySelector('#put-product-sku-p').textContent =
            `SKU: ${data.sku ?? sku}`;

        document.querySelector('#put-product-name').value = data.name;
        document.querySelector('#put-product-category').value = data.id_category;
        document.querySelector('#put-product-description').value = data.description;
        document.querySelector('#put-product-image').value = data.image;
        document.querySelector('#put-product-price').value = data.price;
        document.querySelector('#put-product-stock').value = data.stock;
        // Convert the active flag so a value such as "1" also checks the box.
        document.querySelector('#put-product-active').checked =
            Number(data.active) === 1;
    }
}

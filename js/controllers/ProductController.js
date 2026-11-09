import {MessageView} from "../views/MessageView.js";
import {InteractionView} from "../views/InteractionView.js";
import {App} from "../app.js";

/**
 * Connects the product list, search and detail forms to the API.
 */
export class ProductController {
    /**
     * Shared instance for the current browser page.
     * @type {ProductController|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Model used to load and save records.
     * @type {ProductModel}
     */
    productModel;

    /**
     * View for the overview forms and table.
     * @type {ProductListView}
     */
    listView;

    /**
     * View for record details and edits.
     * @type {ProductDetailView}
     */
    detailView;

    /**
     * View for logout Button.
     * @type {NavigationView}
     */
    navigationView

    /**
     * Receives the dependencies when the shared instance is created.
     * @param {ProductModel} productModel Model used to load and save records.
     * @param {ProductListView} listView View for the overview forms and table.
     * @param {ProductDetailView} detailView View for record details and edits.
     * @param navigationView View for logout Button.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(productModel, listView, detailView, navigationView, key) {
        if (key !== ProductController.#key) {
            throw new Error("Use ProductController.getInstance().");
        }

        this.productModel = productModel;
        this.listView = listView;
        this.detailView = detailView;
        this.navigationView = navigationView;

        ProductController.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @param {ProductModel} productModel Model used to load and save records.
     * @param {ProductListView} listView View for the overview forms and table.
     * @param {ProductDetailView} detailView View for record details and edits.
     * @param navigationView View for logout Button.
     * @returns {ProductController} Shared instance for this page.
     */
    static getInstance(productModel, listView, detailView, navigationView) {
        return ProductController.#instance ??= new ProductController(
            productModel,
            listView,
            detailView,
            navigationView,
            ProductController.#key,
        );
    }

    /**
     * Loads the product list and registers its form handlers.
     * @returns {Promise<void>}
     */
    async initialize() {
        await this.reloadAllProductsList();

        this.listView.bindCreate((sku, data) => this.addProduct(sku, data));
        this.listView.bindSearch((sku) => this.searchProduct(sku));
    }

    /**
     * Renders the product list or shows why it could not load.
     * @returns {Promise<void>}
     */
    async getAllProducts() {
        try {
            const data = await this.productModel.getAllProducts();
            this.navigationView.logoutText();
            this.listView.buildAllProductList(data, {
                onOpen: (sku) => this.showProductInDetail(sku),
                onDelete: (sku) => this.deleteProduct(sku),
            });
        } catch (error) {
            if (error.message === "Not authorized") {
                this.navigationView.loginText();
            }
            this.listView.getAllProductFailed(
                MessageView.requestErrorText(error, "Bitte versuchen Sie es erneut.")
            );
        }
    }

    /**
     * Opens the permalink for a product.
     * @param {string} sku Product SKU.
     * @returns {void}
     */
    showProductInDetail(sku) {
        window.location.href = App.buildDetailUrl("product", sku);
    }

    /**
     * Deletes a product and refreshes the list on success.
     * @param {string} sku Product SKU.
     * @returns {Promise<void>}
     */
    async deleteProduct(sku) {
        InteractionView.setDisabled(".shop-table-scroll", true);

        try {
            const hadSuccess = await this.productModel.deleteProduct(sku);
            if (hadSuccess) {
                MessageView.buildSuccess("all-products-info", `Produkt mit der SKU ${sku} wurde gelöscht!`);
                await this.reloadAllProductsList();
            }
        } catch (error) {
            MessageView.buildError("all-products-info", MessageView.requestErrorText(
                error, "Das Produkt konnte nicht gelöscht werden. Bitte versuchen Sie es erneut."
            ));
        } finally {
            InteractionView.setDisabled(".shop-table-scroll", false);
        }
    }

    /**
     * Saves a product under the entered SKU and refreshes the list.
     * @param {string} sku Product SKU.
     * @param {Object} data Product fields for PUT /product/{sku}.
     * @returns {Promise<void>}
     */
    async addProduct(sku, data) {
        MessageView.closeAllErrors([
            "input-product-sku-p",
            "input-product-name-p",
            "input-product-category-p",
            "input-product-description-p",
            "input-product-image-p",
            "input-product-price-p",
            "input-product-stock-p",
            "input-product-active-p",
            "input-product-form-p"
        ]);

        if (!this.validateUserInput(sku, data, "input")) {
            return;
        }

        InteractionView.setDisabled("#add-product", true);

        try {
            const hadSuccesses = await this.productModel.putProduct(data, sku);
            if (hadSuccesses) {
                MessageView.buildInputFormSuccess("input-product-form-p",
                    `Die Produkt-SKU ${sku} erfolgreich hinzugefügt!`);
                await this.reloadAllProductsList();
            }
        } catch (error) {
            MessageView.buildInputFormError("input-product-form-p", MessageView.requestErrorText(
                error, "Das Produkt konnte nicht gespeichert werden. Bitte versuchen Sie es erneut."
            ));
        } finally {
            InteractionView.setDisabled("#add-product", false);
        }
    }

    /**
     * Shows the first validation error next to the relevant field.
     * @param {string} sku Product SKU.
     * @param {Object} data Product fields for PUT /product/{sku}.
     * @param {string} [elementPrefix="input"] Use "input" for creation or "put" for editing.
     * @returns {boolean} True if the data passes validation.
     */
    validateUserInput(sku, data, elementPrefix = "input") {

        // The edit form uses the SKU from the detail URL.
        if (elementPrefix !== "put" && (!sku || typeof sku !== "string")) {
            MessageView.buildInputFormError(`${elementPrefix}-product-sku-p`, "Bitte geben Sie eine gültige SKU ein.");
            return false;
        }

        if (!data.name || typeof data.name !== "string") {
            MessageView.buildInputFormError(`${elementPrefix}-product-name-p`, "Bitte geben Sie einen Produktnamen ein.");
            return false;
        }

        if (!data.id_category || typeof data.id_category !== "number" || data.id_category <= 0) {
            MessageView.buildInputFormError(`${elementPrefix}-product-category-p`, "Bitte geben Sie eine gültige Kategorie-ID ein.");
            return false;
        }

        if (!data.description || typeof data.description !== "string") {
            MessageView.buildInputFormError(`${elementPrefix}-product-description-p`, "Bitte geben Sie eine Beschreibung ein.");
            return false;
        }

        if (!data.image || typeof data.image !== "string") {
            MessageView.buildInputFormError(`${elementPrefix}-product-image-p`, "Bitte geben Sie eine Bild-URL ein.");
            return false;
        }

        // Number.isFinite also rejects NaN and Infinity.
        if (!Number.isFinite(data.price) || data.price < 0) {
            MessageView.buildInputFormError(`${elementPrefix}-product-price-p`, "Bitte geben Sie einen gültigen Preis ein.");
            return false;
        }

        if (typeof data.stock !== "number" || data.stock < 0) {
            MessageView.buildInputFormError(`${elementPrefix}-product-stock-p`, "Bitte geben Sie einen gültigen Lagerbestand ein.");
            return false;
        }

        if (typeof data.active !== "number" || (data.active !== 0 && data.active !== 1)) {
            MessageView.buildInputFormError(`${elementPrefix}-product-active-p`, "Bitte wählen Sie einen gültigen Aktiv-Status.");
            return false;
        }

        return true;
    }

    /**
     * Validates the search input and opens the matching detail page.
     * @param {string} sku SKU entered in the search form.
     * @returns {void}
     */
    searchProduct(sku) {
        if (!sku || typeof sku !== "string") {
            MessageView.buildInputFormError("product-search-query-p", "Bitte geben Sie eine gültige SKU ein.");
            return;
        }

        InteractionView.showNavigation("#search-product");
        this.showProductInDetail(sku);
    }

    /**
     * Refreshes the product list after a change.
     * @returns {Promise<void>}
     */
    async reloadAllProductsList() {
        await this.getAllProducts();
    }

    /**
     * Loads the product before binding the edit form.
     * @param {string} sku SKU from the detail URL.
     * @returns {Promise<void>}
     */
    async showDetailProduct(sku) {
        await this.getOneProduct(sku);

        // Keep the SKU in the callback so the view only passes the edited fields.
        this.detailView.bindEdit((data) => this.updateProduct(sku, data));
    }

    /**
     * Renders the requested product or shows the matching load error.
     * @param {string} sku SKU of the product to load.
     * @returns {Promise<void>}
     */
    async getOneProduct(sku) {
        try {
            const data = await this.productModel.getProduct(sku);
            this.navigationView.logoutText();
            this.detailView.buildSite(sku, data);
        } catch (error) {
            if (error.message === "Not authorized") {
                this.navigationView.loginText();
                this.detailView.buildNotAuthorized();
            } else if (error.message === "Not found") {
                this.detailView.buildNotFound(sku);
            } else {
                this.detailView.buildError();
            }
        }
    }

    /**
     * Validates and saves the edits, then reloads the stored product.
     * @param {string} sku SKU of the product to update.
     * @param {Object} data Product fields from the edit form.
     * @returns {Promise<void>}
     */
    async updateProduct(sku, data) {
        MessageView.closeAllErrors([
            "put-product-name-p",
            "put-product-category-p",
            "put-product-description-p",
            "put-product-image-p",
            "put-product-price-p",
            "put-product-stock-p",
            "put-product-active-p",
            "put-product-form-p"
        ]);

        if (!this.validateUserInput(sku, data, "put")) {
            return;
        }

        InteractionView.setDisabled("#put-product", true);

        try {
            const hadSuccesses = await this.productModel.putProduct(data, sku);
            if (hadSuccesses) {
                // putProduct returns a success flag. Fetch the record again to display its product_id.
                const savedProduct = await this.productModel.getProduct(sku);
                this.detailView.buildSite(sku, savedProduct);
                MessageView.buildInputFormSuccess("put-product-form-p",
                    `Die Produkt SKU ${sku} erfolgreich geändert!`);
            }
        } catch (error) {
            MessageView.buildInputFormError("put-product-form-p", MessageView.requestErrorText(
                error, "Das Produkt konnte nicht gespeichert werden. Bitte versuchen Sie es erneut."
            ));
        } finally {
            InteractionView.setDisabled("#put-product", false);
        }
    }
}

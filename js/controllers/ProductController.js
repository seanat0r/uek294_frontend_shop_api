/**
 * Connects the product list, search and detail forms to the API.
 */
class ProductController {
    /**
     * Loads the product list and registers its form handlers.
     * @returns {Promise<void>}
     */
    static async initialize() {
        const productAddForm = document.querySelector('#add-product');
        const productSearchForm = document.querySelector('#search-product');

        // This controller also runs on the detail page, which has no product list.
        if (!document.querySelector('#product-list')) {
            return;
        }

        await ProductController.reloadAllProductsList();

        productAddForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Convert form values to the types expected by the API.
            const sku = document.querySelector("#add-product-sku")?.value.trim();
            const name = document.querySelector("#add-product-name")?.value.trim();
            const idCategory = Number(document.querySelector("#add-product-category")?.value);
            const description = document.querySelector("#add-product-description")?.value.trim();
            const image = document.querySelector("#add-product-image")?.value.trim();
            const price = Number(document.querySelector("#add-product-price")?.value);
            const stock = Number(document.querySelector("#add-product-stock")?.value);
            const active = document.querySelector("#add-product-active")?.checked ? 1 : 0;

            const productData = {
                active,
                id_category: idCategory,
                name,
                image,
                description,
                price,
                stock
            };

            ProductController.addProduct(sku, productData);
        });

        // Restore controls when the browser reuses the page after Back navigation.
        window.addEventListener('pageshow', (event) => {
            productSearchForm.inert = false;

            const table = document.querySelector('.shop-table-scroll');
            if (event.persisted && table) {
                table.inert = false;
            }
        });

        productSearchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const sku = document.querySelector("#product-search-sku")?.value.trim();

            ProductController.searchProduct(sku);
        })

    }

    /**
     * Renders the product list or shows why it could not load.
     * @returns {Promise<void>}
     */
    static async getAllProducts() {
        try {
            const data = await ProductModel.getAllProducts();
            ProductListView.buildAllProductList(data);
        } catch (error) {
            ProductListView.getAllProductFailed(error.message);
        }
    }

    /**
     * Opens the permalink for a product.
     * @param {string} sku Product SKU.
     * @returns {void}
     */
    static showProductInDetail(sku) {
        const url = new URL('/item.php', baseURL);
        url.searchParams.set('category', "product");
        url.searchParams.set('id', sku)

        window.location.href = url.href;
    }

    /**
     * Deletes a product and refreshes the list on success.
     * @param {MouseEvent} event Click on the delete button.
     * @param {string} sku Product SKU.
     * @returns {Promise<void>}
     */
    static async deleteProduct(event, sku) {
        event.stopPropagation()

        const table = document.querySelector(".shop-table-scroll");
        table.inert = true;

        try {
            const hadSuccess = await ProductModel.deleteProduct(sku);
            if (hadSuccess) {
                MessageView.buildSuccess("all-products-info", `Produkt mit der SKU ${sku} wurde gelöscht!`);
                await ProductController.reloadAllProductsList();
            }
        } catch (error) {
            MessageView.buildError("all-products-info", `Fehler beim Löschen des Produkts: ${error.message}`);
        } finally {
            table.inert = false;
        }
    }

    /**
     * Saves a product under the entered SKU and refreshes the list.
     * @param {string} sku Product SKU.
     * @param {Object} data Product fields for PUT /product/{sku}.
     * @returns {Promise<void>}
     */
    static async addProduct(sku, data) {
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

        if (!ProductController.validateUserInput(sku, data, "input")) {
            return;
        }

        const form = document.querySelector("#add-product");
        form.inert = true;

        try {
            const hadSuccesses = await ProductModel.putProduct(data, sku);
            if (hadSuccesses) {
                MessageView.buildInputFormSuccess("input-product-form-p",
                    `Die Produkt-SKU ${sku} erfolgreich hinzugefügt!`);
                await ProductController.reloadAllProductsList();
            }
        } catch (error) {
            MessageView.buildInputFormError("input-product-form-p",
                `Ein Fehler ist aufgetreten: ${error.message}`);
        } finally {
            form.inert = false;
        }
    }

    /**
     * Shows the first validation error next to the relevant field.
     * @param {string} sku Product SKU.
     * @param {Object} data Product fields for PUT /product/{sku}.
     * @param {string} [elementPrefix="input"] Use "input" for creation or "put" for editing.
     * @returns {boolean} True if the data passes validation.
     */
    static validateUserInput(sku, data, elementPrefix = "input") {

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
    static searchProduct(sku) {
        if (!sku || typeof sku !== "string") {
            MessageView.buildInputFormError("product-search-query-p", "Bitte geben Sie eine gültige SKU ein.");
            return;
        }

        document.querySelector("#search-product").inert = true;
        ProductController.showProductInDetail(sku);
    }

    /**
     * Refreshes the product list after a change.
     * @returns {Promise<void>}
     */
    static async reloadAllProductsList() {
        await ProductController.getAllProducts();
    }

    static async showDetailProduct(sku) {
        const putProductForm = document.querySelector('#put-product');

        await ProductController.getOneProduct(sku);

        putProductForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.querySelector("#put-product-name")?.value.trim();
            const idCategory = Number(document.querySelector("#put-product-category")?.value);
            const description = document.querySelector("#put-product-description")?.value.trim();
            const image = document.querySelector("#put-product-image")?.value.trim();
            const price = Number(document.querySelector("#put-product-price")?.value);
            const stock = Number(document.querySelector("#put-product-stock")?.value);
            const active = document.querySelector("#put-product-active")?.checked ? 1 : 0;

            const productData = {
                active,
                id_category: idCategory,
                name,
                image,
                description,
                price,
                stock
            };

            ProductController.updateProduct(sku, productData);
        });
    }

    static async getOneProduct(sku, data) {
        try {
            const data = await ProductModel.getProduct(sku);
            ProductDetailView.buildSite(sku, data);
        } catch (error) {
            if (error.message === "Not authorized") {
                ProductDetailView.buildNotAuthorized();
            } else if (error.message === "Not found") {
                ProductDetailView.buildNotFound(sku);
            } else {
                ProductDetailView.buildError(error.message);
            }
        }
    }

    static async updateProduct(sku, data) {
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

        if (!ProductController.validateUserInput(sku, data, "put")) {
            return;
        }

        const form = document.querySelector("#put-product");
        form.inert = true;

        try {
            const hadSuccesses = await ProductModel.putProduct(data, sku);
            if (hadSuccesses) {
                // Reload the saved product to get its product_id, which the edit form does not submit.
                const savedProduct = await ProductModel.getProduct(sku);
                ProductDetailView.buildSite(sku, savedProduct);
                MessageView.buildInputFormSuccess("put-product-form-p",
                    `Die Produkt SKU ${sku} erfolgreich geändert!`);
            }
        } catch (error) {
            MessageView.buildInputFormError("put-product-form-p",
                "Konnte nicht gespeichert werden: " + error.message);
        } finally {
            form.inert = false;
        }
    }
}

ProductController.initialize().catch((error) => console.error(error));

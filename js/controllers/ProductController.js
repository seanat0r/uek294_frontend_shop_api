/**
 * Handles product-related interactions.
 */
class ProductController {
    /**
     * Loads the product page and registers its event listeners.
     * @returns {Promise<void>}
     */
    static async initialize() {
        const productAddForm = document.querySelector('#add-product');
        const productSearchForm = document.querySelector('#search-product');

        // Product list and create/search forms only exist on product.php.
        if (!document.querySelector('#product-list')) {
            return;
        }

        await ProductController.reloadAllProductsList();

        productAddForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // get the value of the forms input element. Translate the Data with trim or in 1/0
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
     * Loads all products and passes them to the product list view.
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
     * Redirects to the detail view for the given product.
     * @param {string} sku SKU of the product to display.
     * @returns {void}
     */
    static showProductInDetail(sku) {
        const url = new URL('/item.php', baseURL);
        url.searchParams.set('category', "product");
        url.searchParams.set('id', sku)

        window.location.href = url.href;
    }

    /**
     * Deletes the product with the given SKU.
     *
     * @param {Event} event Click event from the delete button.
     * @param {string} sku SKU of the product to delete.
     * @returns {Promise<void>}
     */
    static async deleteProduct(event, sku) {
        event.stopPropagation()

        const table = document.querySelector(".shop-table-scroll");
        table.inert = true;

        try {
            const hadSuccess = await ProductModel.deleteCategory(sku);
            if (hadSuccess) {
                MessageView.buildSuccess("all-products-info", `Produkt mit der SKU ${sku} wurde gelöscht!`);
                await ProductController.reloadAllProductsList();
            }
        } catch (error) {
            MessageView.buildError("all-products-info", `Fehler beim löschen der Kategorie: ${error.message}`);
        } finally {
            table.inert = false;
        }
    }

    /**
     * Validates and creates a product.
     * @param {string} sku SKU for the product.
     * @param {Object} data Product data to submit.
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

        // add the new product
        const form = document.querySelector("#add-product");
        form.inert = true;

        try {
            const hadSuccesses = await ProductModel.putProduct(data, sku);
            if (hadSuccesses) {
                MessageView.buildInputFormSuccess("input-product-form-p",
                    `Die Produkt-SKU ${sku} erfolgreich hinzugefügt!`);
                // load list new
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
     * Validate each field. All field get checks for its datatype and is not null.
     * Numbers get also check for greater or equal to zero
     * @param sku SKU of the product
     * @param data Object with all the keys from the OpenAPI Doc (https://campus.csbe.ch/uek294/api/v1/public/swagger-ui/index.html#/)
     * from the PUT /prodocut/{sku} section
     * @param elementPrefix Prefix for the right ID, to select the right element. Should be "input" or "put"
     * @returns {boolean} true if OK, otherwise false
     */
    static validateUserInput(sku, data, elementPrefix = "input") {

        // "put" prefix doesn't set the SKU, skip it
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

        // TODO: reason for isFinite
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
     * Validates a SKU and opens the matching product detail view.
     * @param {string} sku SKU entered by the user.
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
     * Reloads the product list.
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

            // get the value of the forms input element. Translate the Data with trim or in 1/0
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
            const data = await ProductModel.getCategory(sku);
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
                ProductDetailView.buildSite(sku, data);
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

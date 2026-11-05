/**
 * Dispatches detail requests to the supplied controllers.
 */
export class ItemRouter {
    /**
     * Shared instance for the current browser page.
     * @type {ItemRouter|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Creates the shared router through its private constructor key.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(key) {
        if (key !== ItemRouter.#key) {
            throw new Error("Use ItemRouter.getInstance().");
        }

        ItemRouter.#instance = this;
    }

    /**
     * Returns the shared router.
     * @returns {ItemRouter} Shared router for this page.
     */
    static getInstance() {
        return ItemRouter.#instance ??= new ItemRouter(ItemRouter.#key);
    }

    /**
     * Reads the detail URL and waits for the selected action.
     * @param {Object} actions Callbacks supplied by the application startup.
     * @param {function(string): Promise<void>} actions.onProduct Loads a product by SKU.
     * @param {function(string): Promise<void>} actions.onCategory Loads a category by ID.
     * @returns {Promise<void>}
     */
    async initialize(actions) {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const id = params.get('id');

        await this.redirects(category, id, actions);
    }

    /**
     * Loads the requested detail page or redirects an incomplete link.
     * @param {string|null} category Record type from the URL.
     * @param {string|null} id Product SKU or category ID from the URL.
     * @param {Object} actions Callbacks for product and category details.
     * @param {function(string): Promise<void>} actions.onProduct Loads a product.
     * @param {function(string): Promise<void>} actions.onCategory Loads a category.
     * @returns {Promise<void>|undefined} The detail load promise when a record is requested.
     */
    redirects(category, id, actions) {
        if (!category && !id) {
            window.location.href = "./index.php";
            return;
        }

        // A recognized type without an ID leads back to its list.
        if (category === "product" && !id) {
            window.location.href = "./product.php";
            return;
        }

        if (category === "category" && !id) {
            window.location.href = "./category.php";
            return;
        }

        if (category === "product" && id) {
            return actions.onProduct(id);
        }

        if (category === "category" && id) {
            return actions.onCategory(id);
        }

        window.location.href = "./index.php";
    }
}

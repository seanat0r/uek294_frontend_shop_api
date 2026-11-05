import { API } from "../config/api.js";

/**
 * Calls the shop API to read and change products by SKU.
 */
export class ProductModel {
    /**
     * Shared instance for the current browser page.
     * @type {ProductModel|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Creates the shared model through its private constructor key.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(key) {
        if (key !== ProductModel.#key) {
            throw new Error("Use ProductModel.getInstance().");
        }

        ProductModel.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {ProductModel} Shared instance for this page.
     */
    static getInstance() {
        return ProductModel.#instance ??= new ProductModel(ProductModel.#key);
    }

    /**
     * Maps API status codes to errors the controller can handle.
     * @param {Response} res Response from fetch.
     * @returns {boolean} True for a successful response.
     * @throws {Error} The API returned an unsuccessful HTTP status.
     */
    handleResponse(res) {
        if (res.status === 400) {
            throw new Error("Validation failed");
        }

        if (res.status === 401) {
            throw new Error("Not authorized");
        }

        if (res.status === 404) {
            throw new Error("Not found");
        }

        if (!res.ok) {
            throw new Error("Internal Server Error");
        }

        return true;
    }

    /**
     * Fetches the product list.
     * @returns {Promise<Object[]>} Products returned by the API.
     */
    async getAllProducts() {
        const response = await fetch(API + "/products", {
            method: "GET",
            credentials: "include",
        });

        console.log(response);

        this.handleResponse(response);

        return await response.json();
    }

    /**
     * Fetches one product by SKU. The detail view uses product_id from this response.
     * @param {string} sku Product SKU.
     * @returns {Promise<Object|Array>} Product record, with an empty array as a fallback.
     */
    async getProduct(sku) {
        const response = await fetch(API + "/product/" + sku, {
            method: "GET",
            credentials: "include",
        });

        this.handleResponse(response);

        return await response.json() || [];
    }

    /**
     * Creates or updates the product at the given SKU.
     * @param {Object} product Product fields to save.
     * @param {string} sku Product SKU.
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    async putProduct(product, sku = null) {
        const response = await fetch(API + "/product/" + sku, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(product),
        });

        this.handleResponse(response);

        return true;
    }

    /**
     * Deletes the product with the given SKU.
     * @param {string} sku Product SKU.
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    async deleteProduct(sku) {
        const response = await fetch(API + "/product/" + sku, {
            method: "DELETE",
            credentials: "include",
        });

        this.handleResponse(response);

        return true;
    }
}

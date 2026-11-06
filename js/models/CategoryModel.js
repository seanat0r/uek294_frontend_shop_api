import {API} from "../config/api.js";

/**
 * Calls the shop API to list, create, edit and delete categories.
 */
export class CategoryModel {
    /**
     * Shared instance for the current browser page.
     * @type {CategoryModel|null}
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
        if (key !== CategoryModel.#key) {
            throw new Error("Use CategoryModel.getInstance().");
        }

        CategoryModel.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {CategoryModel} Shared instance for this page.
     */
    static getInstance() {
        return CategoryModel.#instance ??= new CategoryModel(CategoryModel.#key);
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
     * Fetches the category list.
     * @returns {Promise<Object[]>} Categories returned by the API.
     */
    async getAllCategories() {
        const response = await fetch(API + "/categories", {
            method: "GET",
            credentials: "include",
        });

        this.handleResponse(response);

        return await response.json();
    }

    /**
     * Fetches one category by ID.
     * @param {number|string} id Category ID.
     * @returns {Promise<Object|Array>} Category record, with an empty array as a fallback.
     */
    async getCategory(id) {
        const response = await fetch(API + "/category/" + id, {
            method: "GET",
            credentials: "include",
        });

        this.handleResponse(response);

        return await response.json() || [];
    }

    /**
     * Creates a category.
     * @param {{active: number, name: string}} body Name and active status (1 or 0).
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    async postCategory(body) {
        console.log(body);
        const response = await fetch(API + "/category", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
        });

        this.handleResponse(response);

        return true;
    }

    /**
     * Deletes the category with the given ID.
     * @param {number|string} id ID of the category to delete.
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    async deleteCategory(id) {
        const response = await fetch(API + "/category/" + id, {
            method: "DELETE",
            credentials: "include",
        });

        this.handleResponse(response);

        return true;
    }

    /**
     * Updates the category with the given ID.
     * @param {number|string} id ID of the category to update.
     * @param {{active: number, name: string}} body Name and active status (1 or 0).
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    async patchCategory(id, body) {
        const response = await fetch(API + "/category/" + id, {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(body),
        });

        this.handleResponse(response);

        return true;
    }

}

class ProductModel {
    /**
     * Maps API status codes to errors the controller can handle.
     * @param {Response} res Response from fetch.
     * @returns {boolean} True for a successful response. Throws otherwise.
     */
    static handleResponse(res) {
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
    static async getAllProducts() {
        const response = await fetch(API + "/products", {
            method: "GET",
            credentials: "include",
        });

        console.log(response);

        ProductModel.handleResponse(response);

        return await response.json();
    }

    /**
     * Fetches one product by SKU. The detail view uses product_id from this response.
     * @param {string} sku Product SKU.
     * @returns {Promise<Object|Array>} Product record, with an empty array as a fallback.
     */
    static async getProduct(sku) {
        const response = await fetch(API + "/product/" + sku, {
            method: "GET",
            credentials: "include",
        });

        ProductModel.handleResponse(response);

        return await response.json() || [];
    }

    /**
     * Creates or updates the product at the given SKU.
     * @param {Object} product Product fields to save.
     * @param {string} sku Product SKU.
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    static async putProduct(product, sku = null) {
        const response = await fetch(API + "/product/" + sku, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(product),
        });

        ProductModel.handleResponse(response);

        return true;
    }

    /**
     * Deletes the product with the given SKU.
     * @param {string} sku Product SKU.
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    static async deleteProduct(sku) {
        const response = await fetch(API + "/product/" + sku, {
            method: "DELETE",
            credentials: "include",
        });

        ProductModel.handleResponse(response);

        return true;
    }
}

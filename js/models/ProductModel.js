class ProductModel {
    /**
     * Throws Error if the HTTP status not in 2xx range
     * @param res Response Obj from fetch
     * @returns {boolean} if successfully return true
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
     * GET request to products; Get all products
     * @returns {Promise<any>} returns all product
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
     * GET request to product/id; Get one specific product
     * @param sku sku to request
     * @returns {Promise<any>} returns the product
     */
    static async getCategory(sku) {
        const response = await fetch(API + "/product/" + sku, {
            method: "GET",
            credentials: "include",
        });

        ProductModel.handleResponse(response);

        return await response.json() || [];
    }

    /**
     * PUT request. Update or Create a new Product
     * @param product
     * @param sku
     * @returns {Promise<boolean>}
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
     * DELETE product to product/sku; delete a specific product
     * @param sku product to delete
     * @returns {Promise<boolean>} true if deleted
     */
    static async deleteCategory(sku) {
        const response = await fetch(API + "/product/" + sku, {
            method: "DELETE",
            credentials: "include",
        });

        ProductModel.handleResponse(response);

        return true;
    }
}

class CategoryModel {

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
     * Fetches the category list.
     * @returns {Promise<Object[]>} Categories returned by the API.
     */
    static async getAllCategories() {
        const response = await fetch(API + "/categories", {
            method: "GET",
            credentials: "include",
        });

        console.log(response);

        CategoryModel.handleResponse(response);

        return await response.json();
    }

    /**
     * Fetches one category by ID.
     * @param {number|string} id Category ID.
     * @returns {Promise<Object|Array>} Category record, with an empty array as a fallback.
     */
    static async getCategory(id) {
        const response = await fetch(API + "/category/" + id, {
            method: "GET",
            credentials: "include",
        });

        CategoryModel.handleResponse(response);

        return await response.json() || [];
    }

    /**
     * Creates a category.
     * @param {{active: number, name: string}} body Name and active status (1 or 0).
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    static async postCategory(body) {
        const response = await fetch(API + "/category", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
        });

        CategoryModel.handleResponse(response);

        return true;
    }

    /**
     * Deletes the category with the given ID.
     * @param {number|string} id ID of the category to delete.
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    static async deleteCategory(id) {
        const response = await fetch(API + "/category/" + id, {
            method: "DELETE",
            credentials: "include",
        });

        CategoryModel.handleResponse(response);

        return true;
    }

    /**
     * Updates the category with the given ID.
     * @param {number|string} id ID of the category to update.
     * @param {{active: number, name: string}} body Name and active status (1 or 0).
     * @returns {Promise<boolean>} Resolves to true when the API accepts the request.
     */
    static async patchCategory(id, body) {
        const response = await fetch(API + "/category/" + id, {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(body),
        });

        CategoryModel.handleResponse(response);

        return true;
    }

}

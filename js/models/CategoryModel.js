class CategoryModel {

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
     * GET request to categorize; Get all categories
     * @returns {Promise<any>} returns all categories
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
     * GET request to category/id; Get one specific Category
     * @param id id to request
     * @returns {Promise<any>} returns the category
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
     * POST request to category; create a new category
     * @param body body request; needs key: active and name
     * @returns {Promise<boolean>}
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
     * DELETE request to category/id; delete a specific category
     * @param id Category to delete
     * @returns {Promise<boolean>} true if deleted
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
     * PATCH request to category
     * @param id category to delete
     * @param body body request; needs key: active and name
     * @returns {Promise<boolean>}
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

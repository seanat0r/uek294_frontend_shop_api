/**
 * Renders category details and collects edits from the form.
 */
export class CategoryDetailView {
    /**
     * Shared instance for the current browser page.
     * @type {CategoryDetailView|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Receives the dependencies when the shared instance is created.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(key) {
        if (key !== CategoryDetailView.#key) {
            throw new Error("Use CategoryDetailView.getInstance().");
        }

        CategoryDetailView.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {CategoryDetailView} Shared instance for this page.
     */
    static getInstance() {
        return CategoryDetailView.#instance ??= new CategoryDetailView(CategoryDetailView.#key);
    }


    /**
     * Reads the current edit values when the form is submitted.
     * @param {function(Object): Promise<void>} onSave Receives the edited fields. The controller supplies the category ID.
     */
    bindEdit(onSave) {
        document.querySelector("#patch-category")?.addEventListener("submit", (event) => {
            event.preventDefault();

            const data = {
                active: document.querySelector("#patch-category-active")?.checked ? 1 : 0,
                name: document.querySelector("#patch-category-name")?.value,
            };

            return onSave(data);
        });
    }

    /**
     * Replaces the detail page with a sign-in message after a 401 response.
     */
    buildNotAuthorized() {
        const page = document.querySelector('#category-detail-page');
        const htmlString =
            `
            <h1>Kategorie konnte nicht geladen werden!</h1>
            <p>Sie sind nicht dafür autorisiert. Melden Sie sich bitte zuerst und versuchen Sie es erneut.</p>
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    /**
     * Shows which category could not be found.
     * @param {number|string} categoryId Category ID requested in the detail URL.
     */
    buildNotFound(categoryId) {
        const page = document.querySelector('#category-detail-page');
        const htmlString =
            `
            <h1>Kategorie konnte nicht gefunden werden!</h1>
            <p>Bitte erstellen Sie zuerst die Kategorie und versuchen Sie es dann erneut oder passen sie die ID an.<br>
            Aktuelle ID: ${categoryId}<br>
            </p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;
    }

    /**
     * Replaces the details and edit form with a load error.
     * @param {string} message Error from the failed request.
     */
    buildError(message) {
        const page = document.querySelector('#category-detail-page');
        const htmlString =
            `
            <h1>Kategorie konnte nicht geladen werden!</h1>
            <p>Bitte überprüfen Sie Ihre URL. <br>
            Error: ${message}<br>
            </p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    /**
     * Renders the category and fills the edit form with the same values.
     * @param {number|string} categoryId ID from the detail URL, used if the data has no category ID.
     * @param {Object} data Category fields from the API or a successful edit.
     */
    buildSite(categoryId, data) {
        const view = document.querySelector('#category-detail-view');
        const viewHTMLString =
            `
            <h2>Kategorie: ${data.name}</h2>
            <dl class="shop-properties">
                <dt>ID</dt>
                <dd>${data.category_id ?? categoryId}</dd>
                <dt>Aktivstatus</dt>
                <dd>${Number(data.active) === 1 ? "aktiv" : "inaktiv"}</dd>
            </dl>
            `
        view.innerHTML = "";
        view.innerHTML = viewHTMLString;

        const activeFormInput = document.querySelector('#patch-category-active');
        const nameFormInput = document.querySelector('#patch-category-name');

        // Convert the active flag so a value such as "1" also checks the box.
        activeFormInput.checked = Number(data.active) === 1;
        nameFormInput.value = data.name;
    }
}

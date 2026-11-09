/**
 * Displays feedback in the form and list message elements.
 */
export class MessageView {

    /**
     * Clears and hides the specified messages.
     * @param {string[]} elementIdArray Message element IDs without the leading #.
     */
    static closeAllErrors(elementIdArray) {

        for (const elementId of elementIdArray) {
            const currentElement = document.querySelector(`#${elementId}`);

            // Forms can share a list of IDs even when some message elements are absent.
            if (!currentElement) {
                continue;
            }
            currentElement.textContent = '';
            currentElement.style.display = 'none';
        }
    }

    /**
     * Shows an error next to a field or below the form.
     * @param {string} elementId Message element ID without the leading #.
     * @param {string} text Message shown to the user.
     */
    static buildInputFormError(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.classList.remove("form-success");
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    /**
     * Returns a message the user can act on after a failed request.
     * @param {Error} error Error from the failed request.
     * @param {string} fallback Message for other failures during this action.
     * @returns {string} Message to display.
     */
    static requestErrorText(error, fallback) {
        switch (error.message) {
            case "Not authorized":
                return "Bitte melden Sie sich zuerst an.";
            case "Validation failed":
                return "Bitte prüfen Sie Ihre Eingaben.";
            case "Not found":
                return "Der Eintrag wurde nicht gefunden.";
            default:
                return fallback;
        }
    }

    /**
     * Shows a success message in the form.
     * @param {string} elementId Message element ID without the leading #.
     * @param {string} text Message shown to the user.
     */
    static buildInputFormSuccess(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.className = "form-success";
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    /**
     * Shows a success message outside a form.
     * @param {string} elementId Message element ID without the leading #.
     * @param {string} text Message shown to the user.
     */
    static buildSuccess(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.className = "success";
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    /**
     * Shows an error message outside a form.
     * @param {string} elementId Message element ID without the leading #.
     * @param {string} text Message shown to the user.
     */
    static buildError(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.className = "error";
        pElement.style.display = 'block';
        pElement.textContent = text;
    }
}

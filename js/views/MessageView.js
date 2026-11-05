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
        pElement.style.display = 'block';
        pElement.textContent = text;
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

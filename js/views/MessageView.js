class MessageView {

    /**
     * Hide all Error Messages, that was given
     * @param elementIdArray expect an array with string. That should hide. ID are without #
     */
    static closeAllErrors(elementIdArray) {

        for (const elementId of elementIdArray) {
            const currentElement = document.querySelector(`#${elementId}`);

            // skip if the element does not exits
            if (!currentElement) {
                continue;
            }
            currentElement.textContent = '';
            currentElement.style.display = 'none';
        }
    }

    /**
     * Build an Error Display
     * @param elementId the Element where to show the text. ID are without #
     * @param text the value, that get displayed
     */
    static buildInputFormError(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    /**
     * Show Form Success Message
     * @param elementId the Element where to show the text. ID are without #
     * @param text the value, that get displayed
     */
    static buildInputFormSuccess(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.className = "form-success";
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    /**
     * Show generally Success Message
     * @param elementId the Element where to show the text. ID are without #
     * @param text the value, that get displayed
     */
    static buildSuccess(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.className = "success";
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    /**
     * Show generally Success Message
     * @param elementId the Element where to show the text. ID are without #
     * @param text the value, that get displayed
     */
    static buildError(elementId, text) {
        const pElement = document.querySelector(`#${elementId}`);
        pElement.className = "error";
        pElement.style.display = 'block';
        pElement.textContent = text;
    }
}
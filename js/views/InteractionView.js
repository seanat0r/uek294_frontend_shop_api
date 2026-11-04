/**
 * Displays temporary interaction states.
 */
class InteractionView {
    /**
     * Shows or hides the loading overlay for authentication.
     * @param {string} selector Area to update.
     * @param {boolean} loading Whether authentication is pending.
     */
    static setLoading(selector, loading) {
        document.querySelector(selector)?.classList.toggle("loading", loading);
    }

    /**
     * Dims or restores a shop form or table during an API request.
     * @param {string} selector Area to update.
     * @param {boolean} disabled Whether the area is disabled.
     */
    static setDisabled(selector, disabled) {
        document.querySelector(selector)?.classList.toggle("is-disabled", disabled);
    }

    /**
     * Briefly dims the area that triggered navigation.
     * @param {string} selector Area to update.
     */
    static showNavigation(selector) {
        const area = document.querySelector(selector);
        if (!area) {
            return;
        }

        area.classList.add("is-navigating");
        setTimeout(() => area.classList.remove("is-navigating"), 1000);
    }
}

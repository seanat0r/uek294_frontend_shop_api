/**
 * Connects the header buttons to their actions.
 */
export class NavigationView {
    /**
     * Shared instance for the current browser page.
     * @type {NavigationView|null}
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
        if (key !== NavigationView.#key) {
            throw new Error("Use NavigationView.getInstance().");
        }

        NavigationView.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {NavigationView} Shared instance for this page.
     */
    static getInstance() {
        return NavigationView.#instance ??= new NavigationView(NavigationView.#key);
    }

    /**
     * Registers the click handlers for the product and category buttons.
     * @param {Object} actions Navigation callbacks.
     * @param {function(): void} actions.onProducts Opens the product overview.
     * @param {function(): void} actions.onCategories Opens the category overview.
     */
    bindNavigation(actions) {
        document.querySelector("#nav-product")?.addEventListener("click", actions.onProducts);
        document.querySelector("#nav-category")?.addEventListener("click", actions.onCategories);
    }

    /**
     * Connects the logout button when the current page has one.
     * @param {function(): Promise<void>} onLogout Runs when the button is clicked.
     */
    bindLogout(onLogout) {
        document.querySelector("#nav-login")?.addEventListener("click", () => onLogout());
    }
}

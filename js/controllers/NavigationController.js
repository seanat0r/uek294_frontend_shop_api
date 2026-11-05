/**
 * Connects the shared navigation buttons to their pages.
 */
export class NavigationController {
    /**
     * Shared instance for the current browser page.
     * @type {NavigationController|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * View containing the section navigation buttons.
     * @type {NavigationView}
     */
    navigationView;

    /**
     * Receives the dependencies when the shared instance is created.
     * @param {NavigationView} navigationView View containing the section navigation buttons.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(navigationView, key) {
        if (key !== NavigationController.#key) {
            throw new Error("Use NavigationController.getInstance().");
        }

        this.navigationView = navigationView;

        NavigationController.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @param {NavigationView} navigationView View containing the section navigation buttons.
     * @returns {NavigationController} Shared instance for this page.
     */
    static getInstance(navigationView) {
        return NavigationController.#instance ??= new NavigationController(
            navigationView,
            NavigationController.#key,
        );
    }

    /**
     * Assigns a destination to each section button in the header.
     */
    initialize() {
        this.navigationView.bindNavigation({
            onProducts: () => { window.location.href = "/product.php"; },
            onCategories: () => { window.location.href = "/category.php"; },
        });
    }
}

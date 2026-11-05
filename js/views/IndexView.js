/**
 * Connects the login form and displays the available sections after sign-in.
 */
export class IndexView {
    /**
     * Shared instance for the current browser page.
     * @type {IndexView|null}
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
        if (key !== IndexView.#key) {
            throw new Error("Use IndexView.getInstance().");
        }

        IndexView.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {IndexView} Shared instance for this page.
     */
    static getInstance() {
        return IndexView.#instance ??= new IndexView(IndexView.#key);
    }


    /**
     * Reads the credentials when the login form is submitted.
     * @param {function(string, string): Promise<void>} onLogin Receives the username followed by the password.
     */
    bindLogin(onLogin) {
        document.querySelector("#login-form")?.addEventListener("submit", (event) => {
            event.preventDefault();

            const username = document.querySelector("#input-username")?.value;
            const password = document.querySelector("#input-password")?.value;
            return onLogin(username, password);
        });
    }

    /**
     * Replaces the login form with links to products and categories.
     */
    buildNewIndex() {
        const indexForm = document.getElementById("index-form");
        const htmlString =
            `
        <h1>Erfolgreich angemeldet</h1>
        <p>Wählen Sie den Bereich, den Sie öffnen möchten.</p>
        <ul class="login-links">
            <li>
                <a href="product.php">Produkte</a>
            </li>
            <li>
                <a href="category.php">Kategorien</a>
            </li>
        </ul>
        `
        indexForm.innerHTML = "";
        indexForm.innerHTML = htmlString;
    }

}

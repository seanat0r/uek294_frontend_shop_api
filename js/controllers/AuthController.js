import {MessageView} from "../views/MessageView.js";
import {InteractionView} from "../views/InteractionView.js";

/**
 * Handles sign-in and sign-out interactions.
 */
export class AuthController {
    /**
     * Shared instance for the current browser page.
     * @type {AuthController|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * View containing the logout button.
     * @type {NavigationView}
     */
    navigationView;

    /**
     * View containing the login form.
     * @type {IndexView}
     */
    indexView;

    /**
     * Model used to start and end the API session.
     * @type {AuthModel}
     */
    authModel;

    /**
     * Receives the dependencies when the shared instance is created.
     * @param {NavigationView} navigationView View containing the logout button.
     * @param {IndexView} indexView View containing the login form.
     * @param {AuthModel} authModel Model used to start and end the API session.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(navigationView, indexView, authModel, key) {
        if (key !== AuthController.#key) {
            throw new Error("Use AuthController.getInstance().");
        }

        this.navigationView = navigationView;
        this.indexView = indexView;
        this.authModel = authModel;

        AuthController.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @param {NavigationView} navigationView View containing the logout button.
     * @param {IndexView} indexView View containing the login form.
     * @param {AuthModel} authModel Model used to start and end the API session.
     * @returns {AuthController} Shared instance for this page.
     */
    static getInstance(navigationView, indexView, authModel) {
        return AuthController.#instance ??= new AuthController(
            navigationView,
            indexView,
            authModel,
            AuthController.#key,
        );
    }

    /**
     * Returns to the login page after the API ends the session.
     * @returns {Promise<void>}
     */
    async logout() {
        InteractionView.setLoading(".logout-action", true);
        // Redirect to the login page unless the logout request fails.
        let changeSite = true;
        try {
            const isLogout = await this.authModel.unauthenticate();
            if (isLogout) {
                changeSite = true;
            }
        } catch (error) {
            changeSite = false;
            alert(`Error: ${error}\nTry again!`);
        } finally {
            InteractionView.setLoading(".logout-action", false);
            if (changeSite) {
                window.location.href = "/index.php";
            }
        }
    }

    /**
     * Shows field errors or sends the credentials to the API.
     * @param {string} username Username entered in the login form.
     * @param {string} password Password entered in the login form.
     * @returns {Promise<void>}
     */
    async login(username, password) {
        MessageView.closeAllErrors(["input-username-p", "input-password-p", "form-error"]);

        // validation
        if (!password || typeof password !== "string") {
            MessageView.buildInputFormError("input-password-p", "Bitte geben Sie ein gültiges Passwort ein.")
            return;
        }

        if (!username || typeof username !== "string") {
            MessageView.buildInputFormError("input-username-p", "Bitte geben Sie ein gültiges Nutzername ein.");
            return;
        }

        InteractionView.setLoading("#login-form", true);

        try {
            const hadLoginSuccess = await this.authModel.authenticate(username, password);
            if (!hadLoginSuccess) {
                MessageView.buildInputFormError("form-error", "Passwort oder Nutzername falsch!")
                return;
            }

            MessageView.closeAllErrors(["input-username-p", "input-password-p", "form-error"]);
            this.indexView.buildNewIndex();
        } catch (error) {
            if (error.message === "Wrong username or password") {
                MessageView.buildInputFormError("form-error", "Passwort oder Nutzername falsch!")
            } else {
                MessageView.buildInputFormError("form-error", `Server Fehler: ${error}`);
            }
        } finally {
            InteractionView.setLoading("#login-form", false);
        }
    }

    /**
     * Connects the login form and logout button where they are available.
     */
    initialize() {
        // Keep this controller as the receiver when the view calls the callbacks.
        this.indexView.bindLogin(
            (username, password) => this.login(username, password)
        );
        this.navigationView.bindLogout(() => this.logout());
    }
}

import {API} from "../config/api.js";

/**
 * Calls the API endpoints that manage the session.
 */
export class AuthModel {
    /**
     * Shared instance for the current browser page.
     * @type {AuthModel|null}
     */
    static #instance = null;

    /**
     * Key used to restrict construction to getInstance.
     * @type {symbol}
     */
    static #key = Symbol();

    /**
     * Creates the shared model through its private constructor key.
     * @param {symbol} key Constructor key supplied by getInstance.
     * @throws {Error} The constructor was called without the private key.
     */
    constructor(key) {
        if (key !== AuthModel.#key) {
            throw new Error("Use AuthModel.getInstance().");
        }

        AuthModel.#instance = this;
    }

    /**
     * Returns the shared instance, creating it on the first call.
     * @returns {AuthModel} Shared instance for this page.
     */
    static getInstance() {
        return AuthModel.#instance ??= new AuthModel(AuthModel.#key);
    }


    /**
     * Starts an API session and lets the browser accept the session cookie.
     * @param {string} username Username for the API account.
     * @param {string} password Password for the API account.
     * @returns {Promise<boolean>} Resolves to true on success. Rejects on failure.
     */
    async authenticate(username, password) {
        const response = await fetch(API + "/authenticate", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        // Give the login form a specific error for rejected credentials.
        if (response.status === 401) {
            throw new Error("Wrong username or password");
        }

        if (!response.ok) {
            throw new Error(`Authentication failed (HTTP ${response.status}).`);
        }

        return true;
    }


    /**
     * Sends the session cookie so the API can end the current session.
     * @returns {Promise<boolean>} Resolves to true on success. Rejects on failure.
     */
    async unauthenticate() {
        const response = await fetch(API + "/unauthenticate", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Unauthenticate failed (HTTP ${response.status}).`);
        }

        return true;
    }
}

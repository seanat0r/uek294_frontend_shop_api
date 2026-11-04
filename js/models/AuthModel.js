/**
 * Calls the API endpoints that manage the session.
 */
class AuthModel {

    /**
     * Starts an API session and lets the browser accept the session cookie.
     * @param {string} username Username for the API account.
     * @param {string} password Password for the API account.
     * @returns {Promise<boolean>} Resolves to true on success. Rejects on failure.
     */
    static async authenticate(username, password) {
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
    static async unauthenticate() {
        const response = await fetch(API + "/unauthenticate", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Unauthenticate failed (HTTP ${response.status}).`);
        }

        console.log(response);

        return true;
    }
}

class AuthModel {

    /**
     * Authenticates the user. Send a POST to the backend. Backend set automatically the cookie.
     * @param username Username for the authentication
     * @param password Password for authentication
     * @returns {Promise<boolean>} returns true if authenticate
     */
    static async authenticate(username, password) {
        const response = await fetch(API + "/authenticate", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        if (response.status === 401) {
            throw new Error("Wrong username or password");
        }

        if (!response.ok) {
            throw new Error(`Authentication failed (HTTP ${response.status}).`);
        }

        isLoggedIn = true;
        return true;
    }


    /**
     * Logout the user by sending a POST request to the Backend. The cookie gets invalid/ removed in Backend.
     * @returns {Promise<boolean>}
     */
    static async unauthenticate() {
        const response = await fetch(API + "/unauthenticate", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Unauthenticate failed (HTTP ${response.status}).`);
        }

        isLoggedIn = false;
        return true;
    }
}

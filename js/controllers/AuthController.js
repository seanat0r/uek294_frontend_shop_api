/**
 * Handles sign-in and sign-out interactions.
 */
class AuthController {

    /**
     * Connects the login form and logout button where they are available.
     */
    static initialize() {
        // The login form and logout button are on different pages.
        const logoutButton = document.querySelector("#nav-login");
        const formElement = document.querySelector("#login-form");

        logoutButton?.addEventListener("click", () => AuthController.logout());

        if (formElement) {
            formElement.addEventListener("submit", async (event) => {
                event.preventDefault();

                const formInputPassword = document.querySelector("#input-password")?.value;
                const formInputUsername = document.querySelector("#input-username")?.value;

                await AuthController.login(formInputUsername, formInputPassword);
            });
        }

    }

    /**
     * Shows field errors or sends the credentials to the API.
     * @param {string} username Username entered in the login form.
     * @param {string} password Password entered in the login form.
     * @returns {Promise<void>}
     */
    static async login(username, password) {
        MessageView.closeAllErrors(["input-username-p", "input-password-p", "form-error"]);

        if (!password || typeof password !== "string") {
            MessageView.buildInputFormError("input-password-p", "Bitte geben Sie ein gültiges Passwort ein.")
            return;
        }

        if (!username || typeof username !== "string") {
            MessageView.buildInputFormError("input-username-p", "Bitte geben Sie ein gültiges Nutzername ein.");
            return;
        }

        const loadingArea = document.querySelector('#login-form');
        loadingArea.classList.add('loading');

        try {
            const hadLoginSuccess = await AuthModel.authenticate(username, password);
            if (!hadLoginSuccess) {
                MessageView.buildInputFormError("form-error", "Passwort oder Nutzername falsch!")
                return;
            }

            MessageView.closeAllErrors(["input-username-p", "input-password-p", "form-error"]);
            IndexView.buildNewIndex();
        } catch (error) {
            if (error.message === "Wrong username or password") {
                MessageView.buildInputFormError("form-error", "Passwort oder Nutzername falsch!")
            } else {
                MessageView.buildInputFormError("form-error", `Server Fehler: ${error}`);
            }
        } finally {
            loadingArea.classList.remove('loading');
        }
    }


    /**
     * Returns to the login page after the API ends the session.
     * @returns {Promise<void>}
     */
    static async logout() {
        const loadingArea = document.querySelector('.logout-action');
        loadingArea.classList.add('loading');

        try {
            const isLogout = await AuthModel.unauthenticate();
            if (isLogout) {
                window.location.href = "/index.php";
            }
        } catch (error) {
            alert(`Error: ${error}\nTry again!`);
        } finally {
            loadingArea.classList.remove('loading');
        }
    }
}

AuthController.initialize();

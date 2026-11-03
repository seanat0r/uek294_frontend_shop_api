class AuthController {

    static initialize() {
        const logoutButton = document.querySelector("#nav-login");
        const formElement = document.querySelector("#login-form");

        if (logoutButton) {
            logoutButton.addEventListener("click", () => AuthController.logout());
        }

        if (formElement && isLoggedIn) {
            IndexView.buildNewIndex();
        } else if (formElement) {
            formElement.addEventListener("submit", async (event) => {
                // prevent to send the form normally
                event.preventDefault();

                const formInputPassword = document.querySelector("#input-password")?.value;
                const formInputUsername = document.querySelector("#input-username")?.value;

                await AuthController.login(formInputUsername, formInputPassword);
            });
        }

    }

    static async login(username, password) {
        IndexView.closeAllErrors();

        if (!password || typeof password !== "string") {
            IndexView.buildErrorPassword("Bitte geben Sie ein gültiges Passwort ein.")
            return;
        }

        if (!username || typeof username !== "string") {
            IndexView.buildErrorUsername("Bitte geben Sie ein gültiges Nutzername ein.");
            return;
        }

        try {
            const hadLoginSuccess = await AuthModel.authenticate(username, password);
            if (!hadLoginSuccess) {
                IndexView.buildErrorForm("Passwort oder Nutzername falsch!")
                return;
            }

            IndexView.closeAllErrors();
            IndexView.buildNewIndex();
        } catch (error) {
            if (error.message === "Wrong username or password") {
                IndexView.buildErrorForm("Passwort oder Nutzername falsch!")
            } else {
                IndexView.buildErrorForm(`Server Fehler: ${error}`);
            }
        }
    }

    static async logout() {
        try {
            const isLogout = await AuthModel.unauthenticate();
            if (isLogout) {
                window.location.href = "/index.php";
            }
        } catch (error) {
            alert(`Error: ${error}\nTry again!`);
        }
    }
}

AuthController.initialize();

class IndexView {
    static buildNewIndex() {
        const indexForm = document.getElementById("index-form");
        const htmlString =
            `
        <h2>Login Erfolgreich!</h2>
        <p>Wählen Sie nun aus was sie Suchen möchte. Produkte und Kategorien in ihren jeweiligen Ort.</p>
        <ul>
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

    static buildErrorUsername(text) {
        const pElement = document.querySelector('#input-username-p');
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    static buildErrorPassword(text) {
        const pElement = document.querySelector('#input-password-p');
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    static buildErrorForm(text) {
        const pElement = document.querySelector('#form-error');
        pElement.style.display = 'block';
        pElement.textContent = text;
    }

    static closeAllErrors() {
        const pElementUsername = document.querySelector('#input-username-p');
        const pElementPassword = document.querySelector('#input-password-p');
        const pElementForm = document.querySelector('#form-error');

        pElementUsername.textContent = '';
        pElementPassword.textContent = '';
        pElementForm.textContent = '';

        pElementUsername.style.display = 'none';
        pElementPassword.style.display = 'none';
        pElementForm.style.display = 'none';
    }
}
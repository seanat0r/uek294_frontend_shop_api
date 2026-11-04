/**
 * Handels Index View.
 */
class IndexView {

    /**
     * Replace Login Form with Successfully Login
     */
    static buildNewIndex() {
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
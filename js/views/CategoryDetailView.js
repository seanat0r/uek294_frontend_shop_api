class CategoryDetailView {

    static buildNotAuthorized() {
        const page = document.querySelector('#category-detail-page');
        const htmlString =
            `
            <h1>Kategorie konnte nicht geladen werden!</h1>
            <p>Sie sind nicht dafür autorisiert. Melden Sie sich bitte zuerst und versuchen Sie es erneut.</p>
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    static buildNotFound(categoryId) {
        const page = document.querySelector('#category-detail-page');
        const htmlString =
            `
            <h1>Kategorie konnte nicht gefunden werden!</h1>
            <p>Bitte erstellen Sie zuerst die Kategorie und versuchen Sie es dann erneut oder passen sie die ID an.<br>
            Aktuelle ID: ${categoryId}<br>
            </p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;
    }

    static buildError(message) {
        const page = document.querySelector('#category-detail-page');
        const htmlString =
            `
            <h1>Kategorie konnte nicht geladen werden!</h1>
            <p>Bitte überprüfen Sie Ihre URL. <br>
            Error: ${message}<br>
            </p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    static buildSite(categoryId, data) {
        const view = document.querySelector('#category-detail-view');
        const viewHTMLString =
            `
            <h2>Kategorie: ${data.name}</h2>
            <dl class="shop-properties">
                <dt>ID</dt>
                <dd>${data.category_id ?? categoryId}</dd>
                <dt>Aktivstatus</dt>
                <dd>${Number(data.active) === 1 ? "aktiv" : "inaktiv"}</dd>
            </dl>
            `
        view.innerHTML = "";
        view.innerHTML = viewHTMLString;

        // Prefill the edit form with the values shown in the detail view.
        const activeFormInput = document.querySelector('#patch-category-active');
        const nameFormInput = document.querySelector('#patch-category-name');

        activeFormInput.checked = Number(data.active) === 1;
        nameFormInput.value = data.name;
    }
}
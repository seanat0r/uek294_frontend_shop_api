class ProductDetailView {

    static buildNotAuthorized() {
        const page = document.querySelector('#product-detail-page');
        const htmlString =
            `
            <h1>Produkt konnte nicht geladen werden!</h1>
            <p>Sie sind nicht dafür autorisiert. Melden Sie sich bitte zuerst und versuchen Sie es erneut.</p>
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    static buildNotFound(sku) {
        const page = document.querySelector('#product-detail-page');
        const htmlString =
            `
            <h1>Produkt konnte nicht gefunden werden!</h1>
            <p>Bitte erstellen Sie zuerst das Produkt und versuchen Sie es dann erneut oder passen sie die SKU an.<br>
            Aktuelle SKU: ${sku}<br>
            </p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;
    }

    static buildError(message) {
        const page = document.querySelector('#product-detail-page');
        const htmlString =
            `
            <h1>Produkt konnte nicht geladen werden!</h1>
            <p>Bitte überprüfen Sie Ihre URL. <br>
            Error: ${message}<br>
            </p>
          
            `
        page.innerHTML = "";
        page.innerHTML = htmlString;

    }

    static buildSite(sku, data) {
        const view = document.querySelector('#product-detail-view');

        const viewHTMLString = `
        <h2>Produkt: ${data.name}</h2>
        <div class="product-details">
            <dl class="shop-properties">
                <dt>Produkt-ID</dt>
                <dd>${data.product_id}</dd>
                <dt>SKU</dt>
                <dd>${data.sku ?? sku}</dd>
                <dt>Aktivstatus</dt>
                <dd>${Number(data.active) === 1 ? "aktiv" : "inaktiv"}</dd>
                <dt>Kategorie-ID</dt>
                <dd>${data.id_category}</dd>
                <dt>Bild-URL</dt>
                <dd>${data.image}</dd>
                <dt>Beschreibung</dt>
                <dd>${data.description}</dd>
                <dt>Preis</dt>
                <dd>${data.price}</dd>
                <dt>Lagerbestand</dt>
                <dd>${data.stock}</dd>
            </dl>
            <img src="${data.image}" alt="Bild: ${data.name}">
        </div>
    `;

        view.innerHTML = "";
        view.innerHTML = viewHTMLString;

        document.querySelector('#put-product-sku-p').textContent =
            `SKU: ${data.sku ?? sku}`;

        document.querySelector('#put-product-name').value = data.name;
        document.querySelector('#put-product-category').value = data.id_category;
        document.querySelector('#put-product-description').value = data.description;
        document.querySelector('#put-product-image').value = data.image;
        document.querySelector('#put-product-price').value = data.price;
        document.querySelector('#put-product-stock').value = data.stock;
        document.querySelector('#put-product-active').checked =
            Number(data.active) === 1;
    }
}

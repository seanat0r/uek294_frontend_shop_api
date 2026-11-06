<?php
declare(strict_types=1);

$page_title = "product";
$page_controller_type = "product";
$is_index = false;

require_once __DIR__ . '/include/header.php';
?>

    <main class="shop-page">
        <h1>Produkte</h1>

        <form id="add-product" class="shop-form">
            <h2>Produkt erstellen</h2>
            <p>Mit einer bestehenden SKU aktualisieren Sie das zugehörige Produkt.</p>

            <div class="shop-field">
                <label for="add-product-sku">SKU</label>
                <input
                        type="text"
                        id="add-product-sku"
                        name="sku"
                        placeholder="Bsp. ABC123"
                        required
                >
                <p id="input-product-sku-p"></p>
            </div>

            <div class="shop-field">
                <label for="add-product-name">Produktname</label>
                <input
                        type="text"
                        id="add-product-name"
                        name="name"
                        placeholder="Bsp. Apfelkuchen"
                        required
                >
                <p id="input-product-name-p"></p>
            </div>

            <div class="shop-field">
                <label for="add-product-category">Kategorie-ID</label>
                <input
                        type="number"
                        id="add-product-category"
                        name="id_category"
                        min="1"
                        required
                >
                <p id="input-product-category-p"></p>
            </div>

            <div class="shop-field">
                <label for="add-product-description">Beschreibung</label>
                <textarea
                        id="add-product-description"
                        name="description"
                        required
                ></textarea>
                <p id="input-product-description-p"></p>
            </div>

            <div class="shop-field">
                <label for="add-product-image">Bild-URL</label>
                <input
                        type="url"
                        id="add-product-image"
                        name="image"
                        placeholder="https://example.com/bild.jpg"
                        required
                >
                <p id="input-product-image-p"></p>
            </div>

            <div class="shop-field">
                <label for="add-product-price">Preis (CHF)</label>
                <input
                        type="number"
                        id="add-product-price"
                        name="price"
                        min="0"
                        step="0.01"
                        required
                >
                <p id="input-product-price-p"></p>
            </div>

            <div class="shop-field">
                <label for="add-product-stock">Lagerbestand</label>
                <input
                        type="number"
                        id="add-product-stock"
                        name="stock"
                        min="0"
                        step="1"
                        required
                >
                <p id="input-product-stock-p"></p>
            </div>

            <div class="shop-field shop-check">
                <label for="add-product-active">Aktiv</label>
                <input
                        type="checkbox"
                        id="add-product-active"
                        name="active"
                        checked
                >
                <p id="input-product-active-p"></p>
            </div>

            <p id="input-product-form-p"></p>
            <button type="submit">Produkt erstellen</button>
        </form>

        <form id="search-product" class="shop-form shop-search">
            <h2>Produkt suchen</h2>

            <div class="shop-field">
                <label for="product-search-sku">Produkt nach SKU suchen</label>
                <input
                        type="text"
                        id="product-search-sku"
                        name="sku"
                        placeholder="Bsp. ABC123"
                        required
                >
                <p id="product-search-query-p"></p>
            </div>

            <p id="product-search-form-p"></p>
            <button type="submit">Suchen</button>
        </form>

        <section id="all-products-section" class="shop-table-section">
            <h2>Alle Produkte</h2>
            <p>Wählen Sie einen Produktnamen, um das Produkt anzuzeigen oder zu bearbeiten.</p>
            <p id="all-products-info"></p>

            <div class="shop-table-scroll" tabindex="0">
                <table>
                    <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Kategorie-ID</th>
                        <th>Preis (CHF)</th>
                        <th>Lagerbestand</th>
                        <th>Aktiv</th>
                        <th>Löschen</th>
                    </tr>
                    </thead>
                    <tbody id="product-list">
                    <tr>
                        <td>Tabelle ist am Laden ...</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

<?php
require_once __DIR__ . '/include/footer.php';
?>
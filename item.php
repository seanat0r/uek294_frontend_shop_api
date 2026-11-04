<?php
declare(strict_types=1);

$page_title = "Item";
$page_controller_type = "item";
$is_index = false;

require_once __DIR__ . '/include/header.php';

// Render the matching edit form. The browser loads the record through the API.
$params = $_SERVER['QUERY_STRING'] ?? '';

if (str_contains($params, "category=product")): ?>
    <div id="product-detail-page" class="shop-page">
        <section id="product-detail-view"></section>
        <section>
            <form id="put-product" class="shop-form">
                <h2>Produkt bearbeiten</h2>
                <div>
                    <p id="put-product-sku-p">SKU: </p>
                </div>

                <div class="shop-field">
                    <label for="put-product-name">Produktname</label>
                    <input
                            type="text"
                            id="put-product-name"
                            name="name"
                            placeholder="Bsp. Apfelkuchen"
                            required
                    >
                    <p id="put-product-name-p"></p>
                </div>

                <div class="shop-field">
                    <label for="put-product-category">Kategorie-ID</label>
                    <input
                            type="number"
                            id="put-product-category"
                            name="id_category"
                            min="1"
                            required
                    >
                    <p id="put-product-category-p"></p>
                </div>

                <div class="shop-field">
                    <label for="put-product-description">Beschreibung</label>
                    <textarea
                            id="put-product-description"
                            name="description"
                            required
                    ></textarea>
                    <p id="put-product-description-p"></p>
                </div>

                <div class="shop-field">
                    <label for="put-product-image">Bild-URL</label>
                    <input
                            type="url"
                            id="put-product-image"
                            name="image"
                            placeholder="https://example.com/bild.jpg"
                            required
                    >
                    <p id="put-product-image-p"></p>
                </div>

                <div class="shop-field">
                    <label for="put-product-price">Preis</label>
                    <input
                            type="number"
                            id="put-product-price"
                            name="price"
                            min="0"
                            step="0.01"
                            required
                    >
                    <p id="put-product-price-p"></p>
                </div>

                <div class="shop-field">
                    <label for="put-product-stock">Lagerbestand</label>
                    <input
                            type="number"
                            id="put-product-stock"
                            name="stock"
                            min="0"
                            step="1"
                            required
                    >
                    <p id="put-product-stock-p"></p>
                </div>

                <div class="shop-field shop-check">
                    <label for="put-product-active">Aktiv</label>
                    <input
                            type="checkbox"
                            id="put-product-active"
                            name="active"
                            checked
                    >
                    <p id="put-product-active-p"></p>
                </div>

                <p id="put-product-form-p"></p>
                <button type="submit">Speichern</button>
            </form>
        </section>
    </div>

<?php elseif (str_contains($params, "category=category")): ?>
    <div id="category-detail-page" class="shop-page">
        <h1>Kategorie Detailansicht</h1>
        <section id="category-detail-view"></section>

        <section>
            <form id="patch-category" class="shop-form">
                <h2>Kategorie bearbeiten</h2>

                <div class="shop-field">
                    <label for="patch-category-name">Kategoriename</label>
                    <input type="text" id="patch-category-name" name="add-category-name" placeholder="Bsp. Backwaren"
                           required>
                    <p id="input-category-name-p"></p>
                </div>

                <div class="shop-field shop-check">
                    <label for="patch-category-active">Aktiv</label>
                    <input type="checkbox" id="patch-category-active" name="add-category-active">
                    <p id="input-category-active-p"></p>
                </div>

                <p id="input-category-form-p"></p>
                <button type="submit">Speichern</button>
            </form>
        </section>
    </div>

<?php endif; ?>

<?php
require_once __DIR__ . '/include/footer.php';
?>

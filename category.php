<?php
declare(strict_types=1);

$page_title = "category";
$page_controller_type = "category";
$is_index = false;

require_once __DIR__ . '/include/header.php';
?>

<main class="shop-page">
    <h1>Kategorien <span class="sub-title">Erstellen • Suchen • Alle</span></h1>

    <form id="add-category" class="shop-form">
        <h2>Kategorie erstellen</h2>
        <p>Geben Sie einen Namen ein und wählen Sie, ob die Kategorie aktiv sein soll.</p>

        <div class="shop-field">
            <label for="add-category-name">Kategoriename</label>
            <input
                    type="text"
                    id="add-category-name"
                    name="add-category-name"
                    placeholder="Bsp. Backwaren"
                    maxlength="500"
                    minlength="1"
                    required
            >
            <p id="input-category-name-p"></p>
        </div>

        <div class="shop-field shop-check">
            <label for="add-category-active">Aktiv</label>
            <input
                    type="checkbox"
                    id="add-category-active"
                    name="add-category-active"
                    checked
            >
            <p id="input-category-active-p"></p>
        </div>

        <p id="input-category-form-p"></p>
        <button type="submit">Kategorie erstellen</button>
    </form>

    <form id="search-category" class="shop-form shop-search">
        <h2>Kategorie suchen</h2>

        <div class="shop-field">
            <label for="category-search-number">Kategorie nach ID suchen</label>
            <input
                    type="number"
                    id="category-search-number"
                    maxlength="500"
                    minlength="1"
                    required
            >
            <p id="category-search-query-p"></p>
        </div>

        <p id="category-search-form-p"></p>
        <button type="submit">Suchen</button>
    </form>

    <section id="all-categories-section" class="shop-table-section">
        <h2>Alle Kategorien</h2>
        <p>Wählen Sie einen Kategorienamen, um die Kategorie anzuzeigen oder zu bearbeiten.</p>
        <p id="all-categories-info"></p>

        <div class="shop-table-scroll" tabindex="0">
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Aktiv</th>
                    <th>Löschen</th>
                </tr>
                </thead>
                <tbody id="category-list">
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

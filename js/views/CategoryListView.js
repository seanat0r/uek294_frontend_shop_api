class CategoryListView {

    /**
     * All Categories List could not be loaded, show a error message.
     * @param text to display
     */
    static getAllCategoriesFailed(text) {
        const categoriesList = document.querySelector('#all-categories-section');
        const htmlString =
            `
            <h2>Liste konnte nicht geladen werden.</h2>
            <p>${text}</p>
            `;
        categoriesList.innerHTML = "";
        categoriesList.innerHTML = htmlString;
    }

    /**
     * Builds the row for each categorie
     * @param allCategoriesList
     */
    static buildAllCategoriesList(allCategoriesList) {
        const categoriesListElement = document.querySelector('#category-list');
        categoriesListElement.innerHTML = '';

        for (const category of allCategoriesList) {
            const htmlString =
                `
                <tr id="category-item-${category.category_id}">
                    <td>${category.category_id}</td>
                    <td class="shop-name">${category.name}</td>
                    <td>${Number(category.active) === 1 ? "aktiv" : "inaktiv"}</td>
                    <td>
                        <button type="button" class="shop-delete" id="category-item-delete-${category.category_id}">
                            Löschen
                        </button>
                    </td>
                </tr>
                `;

            categoriesListElement.insertAdjacentHTML('beforeend', htmlString);

            // select the hole <tr> and add an EventListener and select the <button> and add an EventListener
            document.querySelector(`#category-item-${category.category_id}`)
                .addEventListener('click', () => {
                    categoriesListElement.closest('.shop-table-scroll').inert = true;
                    CategoryController.showCategoryInDetail(category.category_id);
                });

            document.querySelector(`#category-item-delete-${category.category_id}`)
                .addEventListener('click', (event) =>
                    CategoryController.deleteCategory(event, category.category_id)
                );
        }
    }
}
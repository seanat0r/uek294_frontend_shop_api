class CategoryListView {

    /**
     * Replaces the category list with an error message.
     * @param {string} text Reason the list could not load.
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
     * Renders the categories and connects the detail and delete actions.
     * @param {Object[]} allCategoriesList Categories returned by the API.
     */
    static buildAllCategoriesList(allCategoriesList) {
        const categoriesListElement = document.querySelector('#category-list');
        categoriesListElement.innerHTML = '';

        for (const category of allCategoriesList) {
            const url = new URL('/item.php', baseURL);
            url.searchParams.set('category', "category");
            url.searchParams.set('id', category.category_id);

            const htmlString =
                `
                <tr id="category-item-${category.category_id}">
                    <td>${category.category_id}</td>
                    <td class="shop-name">
                        <a href="${url}">${category.name}</a>
                    </td>
                    <td>${Number(category.active) === 1 ? "aktiv" : "inaktiv"}</td>
                    <td>
                        <button type="button" class="shop-delete" id="category-item-delete-${category.category_id}">
                            Löschen
                        </button>
                    </td>
                </tr>
                `;

            categoriesListElement.insertAdjacentHTML('beforeend', htmlString);

            // Make the full row clickable. The name link also lets keyboard users open the detail page.
            document.querySelector(`#category-item-${category.category_id}`)
                .addEventListener('click', () => {
                    InteractionView.showNavigation(".shop-table-scroll");
                    CategoryController.showCategoryInDetail(category.category_id);
                });

            document.querySelector(`#category-item-delete-${category.category_id}`)
                .addEventListener('click', (event) =>
                    CategoryController.deleteCategory(event, category.category_id)
                );
        }
    }
}
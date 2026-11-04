class ProductListView {
    static getAllProductFailed(text) {
        const categoriesList = document.querySelector('#all-products-section');
        const htmlString =
            `
            <h2>Liste konnte nicht geladen werden.</h2>
            <p>${text}</p>
            `;
        categoriesList.innerHTML = "";
        categoriesList.innerHTML = htmlString;
    }

    static buildAllProductList(productsList) {
        const productsListElement = document.querySelector('#product-list');
        productsListElement.innerHTML = '';

        for (const product of productsList) {
            const htmlString =
                `
                <tr id="category-item-${product.sku}">
                    <td>${product.sku}</td>
                    <td class="shop-name">${product.name}</td>
                    <td>${product.id_category}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${Number(product.active) === 1 ? "aktiv" : "inaktiv"}</td>
                    <td>
                        <button type="button" class="shop-delete" id="product-item-delete-${product.sku}">
                            Löschen
                        </button>
                    </td>
                </tr>
                `;

            productsListElement.insertAdjacentHTML('beforeend', htmlString);

            // select the hole <tr> and add an EventListener and select the <button> and add an EventListener
            document.querySelector(`#category-item-${product.sku}`)
                .addEventListener('click', () => {
                    productsListElement.closest('.shop-table-scroll').inert = true;
                    ProductController.showProductInDetail(product.sku);
                });

            document.querySelector(`#product-item-delete-${product.sku}`)
                .addEventListener('click', (event) =>
                    ProductController.deleteProduct(event, product.sku)
                );
        }
    }
}
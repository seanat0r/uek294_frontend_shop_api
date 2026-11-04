class ProductListView {
    static getAllProductFailed(text) {
        const productsSection = document.querySelector('#all-products-section');
        const htmlString =
            `
            <h2>Liste konnte nicht geladen werden.</h2>
            <p>${text}</p>
            `;
        productsSection.innerHTML = "";
        productsSection.innerHTML = htmlString;
    }

    static buildAllProductList(productsList) {
        const productsListElement = document.querySelector('#product-list');
        productsListElement.innerHTML = '';

        for (const product of productsList) {
            const url = new URL('/item.php', baseURL);
            url.searchParams.set('category', "product");
            url.searchParams.set('id', product.sku);

            const htmlString =
                `
                <tr id="product-row-${product.sku}">
                    <td>${product.sku}</td>
                    <td class="shop-name"><a href="${url}">${product.name}</a></td>
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

            // Make the full row clickable. The name link also lets keyboard users open the detail page.
            document.querySelector(`#product-row-${product.sku}`)
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

class ItemRouter {
    static initialize() {
        const params = new URLSearchParams(window.location.search);
        let category = params.get('category');
        let id = params.get('id');

        ItemRouter.redirects(category, id);

    }

    static redirects(category, id) {
        if (!category && !id) {
            window.location.href = "./index.php";
            return;
        }

        if (category === "product" && !id) {
            window.location.href = "./product.php";
            return;
        }

        if (category === "category" && !id) {
            window.location.href = "./category.php";
            return;
        }

        if (category === "product" && id) {
            ProductController.showDetailProduct(id);
            return;
        }

        if (category === "category" && id) {
            CategoryController.showDetailCategory(id);
            return;
        }

        window.location.href = "./index.php";
    }
}

ItemRouter.initialize();
import {baseURL} from "./config/api.js";
import {ItemRouter} from "./router/ItemRouter.js";
import {AuthModel} from "./models/AuthModel.js";
import {ProductModel} from "./models/ProductModel.js";
import {CategoryModel} from "./models/CategoryModel.js";
import {IndexView} from "./views/IndexView.js";
import {NavigationView} from "./views/NavigationView.js";
import {ProductListView} from "./views/ProductListView.js";
import {ProductDetailView} from "./views/ProductDetailView.js";
import {CategoryListView} from "./views/CategoryListView.js";
import {CategoryDetailView} from "./views/CategoryDetailView.js";
import {AuthController} from "./controllers/AuthController.js";
import {NavigationController} from "./controllers/NavigationController.js";
import {ProductController} from "./controllers/ProductController.js";
import {CategoryController} from "./controllers/CategoryController.js";

/**
 * Connects the shared objects and starts the current page.
 */
export class App {

    /**
     * Escaping an HTML String with `textContent`.
     * @param unsafeString non escaped HTML String
     * @returns {string} escaped HTML String
     */
    static escapeHTML(unsafeString) {
        if (typeof unsafeString !== "string") return "";
        const div = document.createElement("div");
        div.textContent = unsafeString;
        return div.innerHTML;
    }

    /**
     * Builds the same record link for table rows and search results.
     * @param {"product"|"category"} category Type of record to open.
     * @param {string|number} id Product SKU or category ID.
     * @returns {string} Absolute detail URL with encoded query parameters.
     */
    static buildDetailUrl(category, id) {
        const url = new URL('/item.php', baseURL);
        url.searchParams.set('category', category);
        url.searchParams.set('id', id);
        return url.href;
    }

    /**
     * Injects dependencies and starts the controllers needed by this page.
     * @returns {Promise<void>}
     */
    async main() {
        const router = ItemRouter.getInstance();

        const indexView = IndexView.getInstance();
        const navigationView = NavigationView.getInstance();
        const productListView = ProductListView.getInstance();
        const productDetailView = ProductDetailView.getInstance();
        const categoryListView = CategoryListView.getInstance();
        const categoryDetailView = CategoryDetailView.getInstance();

        const authModel = AuthModel.getInstance();
        const productModel = ProductModel.getInstance();
        const categoryModel = CategoryModel.getInstance();

        const authController = AuthController.getInstance(navigationView, indexView, authModel);
        const navigationController = NavigationController.getInstance(navigationView);
        const productController = ProductController.getInstance(
            productModel, productListView, productDetailView, navigationView
        );
        const categoryController = CategoryController.getInstance(
            categoryModel, categoryListView, categoryDetailView, navigationView
        );

        authController.initialize();
        navigationController.initialize();

        const page = document.body.dataset.page;

        if (page === "product") {
            await productController.initialize();
        } else if (page === "category") {
            await categoryController.initialize();
        } else if (page === "item") {
            await router.initialize({
                onProduct: (sku) => productController.showDetailProduct(sku),
                onCategory: (id) => categoryController.showDetailCategory(id),
            });
        }
    }
}

/**
 * Application entry point for the current page.
 * @type {App}
 */
const app = new App();
app.main().catch(console.error);
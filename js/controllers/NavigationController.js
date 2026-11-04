/**
 * Navigation Controller
 */
class NavigationController {
    static initialize() {
        document.querySelector("#nav-product")?.addEventListener("click", () => {
            window.location.href = "/product.php";
        });

        document.querySelector("#nav-category")?.addEventListener("click", () => {
            window.location.href = "/category.php";
        });
    }
}

NavigationController.initialize();
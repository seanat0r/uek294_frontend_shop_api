<?php
declare(strict_types=1);
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop API | <?= htmlspecialchars($page_title) ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">

    <script defer src="/js/config/api.js"></script>
    <script defer src="/js/services/ApiClient.js"></script>
    <script defer src="/js/models/AuthModel.js"></script>
    <script defer src="/js/views/IndexView.js"></script>
    <script defer src="/js/controllers/AuthController.js"></script>

    <?php if ($page_controller_type === "product"): ?>
        <script defer src="/js/models/ProductModel.js"></script>
        <script defer src="/js/views/MessageView.js"></script>
        <script defer src="/js/views/ProductListView.js"></script>
        <script defer src="/js/views/ProductDetailView.js"></script>
        <script defer src="/js/views/ProductFormView.js"></script>
        <script defer src="/js/controllers/ProductController.js"></script>
    <?php elseif ($page_controller_type === "category"): ?>
        <script defer src="/js/models/CategoryModel.js"></script>
        <script defer src="/js/views/MessageView.js"></script>
        <script defer src="/js/views/CategoryListView.js"></script>
        <script defer src="/js/views/CategoryDetailView.js"></script>
        <script defer src="/js/views/CategoryFormView.js"></script>
        <script defer src="/js/controllers/CategoryController.js"></script>
    <?php elseif ($page_controller_type === "item"): ?>
        <script defer src="/js/models/ProductModel.js"></script>
        <script defer src="/js/models/CategoryModel.js"></script>
        <script defer src="/js/views/ProductDetailView.js"></script>
        <script defer src="/js/views/CategoryDetailView.js"></script>
        <script defer src="/js/controllers/ProductController.js"></script>
        <script defer src="/js/controllers/CategoryController.js"></script>
    <?php endif; ?>
    <script defer src="/js/app.js"></script>
</head>
<body>
<header>
    <h1>Shop API</h1>

    <nav aria-label="Hauptnavigation">
        <ul>
            <li>
                <button id="nav-login">Abmelden</button>
            </li>
            <li>
                <button id="nav-product">Produkte</button>
            </li>
            <li>
                <button id="nav-category">Kategorien</button>
            </li>

        </ul>
    </nav>
</header>


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

    <script type="module" src="/js/app.js"></script>
</head>
<body data-page="<?= htmlspecialchars($page_controller_type) ?>"<?= $page_controller_type === 'index' ? ' class="login-body"' : '' ?>>
<header class="site-header">
    <div class="header-inner">
        <p class="brand">Shop API</p>
        <nav>
            <ul>
                <li>
                    <button type="button" id="nav-category">Kategorie</button>
                </li>
                <li>
                    <button type="button" id="nav-product">Produkt</button>
                </li>
                <?php if (!$is_index): ?>
                    <li class="logout-action">
                        <button type="button" id="nav-login">Abmelden</button>
                    </li>
                <?php endif; ?>
            </ul>
        </nav>
    </div>
</header>

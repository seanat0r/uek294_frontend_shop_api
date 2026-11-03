<?php
declare(strict_types=1);
?>
<!DOCTYPE>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CsBe | <?= htmlspecialchars($page_title) ?></title>
    <link rel="stylesheet" href="views/css/style.css">
    <?php if ($page_controller_path): ?>
        <script defer src="<?= htmlspecialchars($page_controller_path) ?>"></script>
    <?php endif; ?>
    <script defer src="model/index-model.js"></script>
    <script defer src="views/index-view.js"></script>
</head>
<body>

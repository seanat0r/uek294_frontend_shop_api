<?php
declare(strict_types=1);
$page_title = "Home";
$page_controller_path = "controller/index-controller.js";

require_once __DIR__ . '/views/blocks/header.php';
?>

    <h1>Hello World!</h1>

<?php
require_once __DIR__ . '/views/blocks/footer.php';
?>
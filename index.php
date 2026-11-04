<?php
declare(strict_types=1);

$page_title = "Login";
$page_controller_type = "index";
$is_index = true;

require_once __DIR__ . '/include/header.php';
?>

    <main class="login-page">
        <div id="index-form" class="login-card">
            <h1>Login</h1>
            <form id="login-form">
                <div>
                    <p id="input-username-p"></p>
                    <label for="input-username">Nutzername:</label>
                    <input type="text" id="input-username" name="username" autocomplete="username" required>
                </div>
                <div>
                    <p id="input-password-p"></p>
                    <label for="input-password">Passwort:</label>
                    <input type="password" id="input-password" name="password" autocomplete="current-password" required>
                </div>
                <button type="submit">Login</button>

                <p id="form-error"></p>
            </form>
        </div>
    </main>

<?php
require_once __DIR__ . '/include/footer.php';
?>
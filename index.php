<?php
declare(strict_types=1);

$page_title = "Login";
$page_controller_type = "index";

require_once __DIR__ . '/include/header.php';
?>

    <h1>Login</h1>
    <div id="index-form">
        <form id="login-form">
            <div>
                <p id="input-username-p"></p>
                <label for="input-username">Nutzername:</label>
                <input type="text" id="input-username" name="username" placeholder="Max Mustermann" required>
            </div>
            <div>
                <p id="input-password-p"></p>
                <label for="input-password">Passwort:</label>
                <input type="password" id="input-password" name="password" placeholder="Passwort" required>
            </div>
            <button type="submit">Senden!</button>

            <p id="form-error"></p>
        </form>
    </div>

<?php
require_once __DIR__ . '/include/footer.php';
?>
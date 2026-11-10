# Shop API (üK 294 LB02)

Mit der Webapplikation verwaltest du Produkte und Kategorien. PHP 8 rendert die Seiten. JavaScript verarbeitet die
Formulare und sendet Anfragen per `fetch` an die CSBE-Shop-API. Die Datenbank läuft auf dem API-Server.

## Lokal mit MAMP oder XAMPP starten

1. Kopiere die Projektdateien in den Ordner `htdocs/` deiner MAMP- oder XAMPP-Installation, sodass die Startdatei unter
   `htdocs/index.php` liegt.
2. Prüfe, ob deine Installation PHP 8 verwendet. Stelle den Apache-Port auf `80`.
3. Starte Apache.

## Lokal mit dem integrierten PHP-Webserver starten

Für diese Variante brauchst du PHP 8 im Terminal. Prüfe die Version mit `php -v`. Falls Apache bereits Port `80` belegt,
stoppe Apache vor dem Start.

1. Wechsle im Terminal in den Projektordner, in dem `index.php` liegt.
2. Starte den integrierten PHP-Webserver.

   ```sh
   php -S localhost:80
   ```

3. Lass das Terminal geöffnet, solange du die Applikation verwendest. Mit `Ctrl+C` beendest du den Server.

## Applikation öffnen

Öffne [http://localhost/index.php](http://localhost/index.php) und melde dich mit deinen Zugangsdaten für die
CSBE-Shop-API an. Verwende `http://localhost` ohne Portangabe. Die API erwartet diese Adresse für Browseranfragen, und
die Applikation verwendet sie für Links zur Detailansicht.

## Hinweise und bekannte API-Abweichungen

Stand 10.11.2026

- Beim **Abmelden** kann die API auf `POST /unauthenticate` auch mit `200 OK` antworten.
- Laut Vorgabe aus dem üK-Modul 295 darf ein **Produkt ohne Kategorie** gespeichert werden. Im Test lehnte die API das
  Speichern in vier Fällen ab. Das Feld `id_category` fehlte, enthielt `null`, enthielt `""` oder enthielt eine ID ohne
  passende Kategorie, zum Beispiel `99999999`.
- Bei den **maximalen Feldlängen** deuten einzelne Tests auf Abweichungen von den Vorgaben des üK-Moduls 295 hin. Welche
  Grenzen die API tatsächlich verwendet, ist offen.
- Beim **Erstellen einer Kategorie** speicherte die API in den Tests `active = 0`, obwohl der Request `active = 1`
  enthielt. Mit `PATCH /category/{id}` liess sich die Kategorie anschliessend aktivieren.

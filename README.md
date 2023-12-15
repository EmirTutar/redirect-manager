# URL Redirect Manager

Willkommen beim URL Redirect Manager! Dieses Tool ermöglicht es Ihnen, benutzerdefinierte URL-Weiterleitungen zu verwalten.

## Installation

1. Stellen Sie sicher, dass Node.js auf Ihrem System installiert ist. [Node.js herunterladen](https://nodejs.org/)

2. Navigieren Sie zum Projektverzeichnis in Ihrer Befehlszeile oder Terminal.

3. Installieren Sie die Abhängigkeiten, indem Sie den folgenden Befehl ausführen:

   ```bash
   npm install express
   ```

## Konfiguration

Stellen Sie sicher, dass Sie die Umgebungsvariable BEARER_TOKEN für die Authentifizierung gesetzt haben. Wenn nicht angegeben, wird der Standardwert "secret" verwendet.


## Verwendung

### 1. Willkommensnachricht

Um die Willkommensnachricht und Anweisungen aufzurufen, besuchen Sie:

```bash
GET http://localhost:3000/
```

### 2. Anzeigen aller Redirect-Einträge (Authentifizierung erforderlich)

```bash
GET http://localhost:3000/entries
```

### 3. Hinzufügen eines neuen Redirect-Eintrags (Authentifizierung erforderlich)

```bash
POST http://localhost:3000/entry
```

Body (JSON):
```json
{
  "slug": "your_slug",
  "url": "your_url"
}
```

### 4. Löschen eines Redirect-Eintrags (Authentifizierung erforderlich)

```bash
DELETE http://localhost:3000/entry/your_slug
```

### 5. Umleitung basierend auf dem Slug

Besuchen Sie einfach die gewünschte URL:

```bash
GET http://localhost:3000/your_slug
```
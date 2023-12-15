// index.js
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

// Lese die Slugs aus der JSON-Datei beim Start des Servers
let entries = loadSlugs();

// Middleware für die Authentifizierung
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  // Hier sollte Ihre Logik zur Überprüfung des Tokens stehen.
  // Das folgende ist ein einfaches Beispiel, bitte durch sicherere Methoden ersetzen.
  if (token === 'IhrBearerToken') {
    next(); // Fortsetzen mit der nächsten Middleware oder Route
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// GET /:slug
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;

  // Überprüfen, ob der Slug in der Datenstruktur vorhanden ist
  if (entries.hasOwnProperty(slug)) {
    res.redirect(entries[slug].url);
  } else {
    res.status(404).json({ message: 'Slug not found' });
  }
});

// GET /entries (Mit Authentication Middleware)
app.get('/entries', authenticate, (req, res) => {
  res.json(entries);
});

// DELETE /entry/:slug
app.delete('/entry/:slug', authenticate, (req, res) => {
  const slugToDelete = req.params.slug;
  if (entries.hasOwnProperty(slugToDelete)) {
    delete entries[slugToDelete];
    saveSlugs(entries); // Speichere die Änderungen in der JSON-Datei
    res.json({ message: 'Entry deleted successfully' });
  } else {
    res.status(404).json({ message: 'Slug not found' });
  }
});

// POST /entry
app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;

  // Überprüfen, ob der Slug bereits existiert
  if (entries.hasOwnProperty(slug)) {
    res.status(409).json({ message: 'Slug already exists' });
  } else {
    // Speichern Sie den Eintrag
    entries[slug] = { slug, url };
    saveSlugs(entries); // Speichere die Änderungen in der JSON-Datei
    res.json({ message: 'Entry added successfully', slug, url });
  }
});

function loadSlugs() {
  try {
    const slugsData = fs.readFileSync('slugs.json', 'utf8');
    return JSON.parse(slugsData);
  } catch (error) {
    // Falls die Datei nicht vorhanden ist oder ein Fehler beim Lesen auftritt, starte mit einer leeren Datenstruktur
    return {};
  }
}

function saveSlugs(entries) {
  const slugsData = JSON.stringify(entries, null, 2);
  fs.writeFileSync('slugs.json', slugsData);
}

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

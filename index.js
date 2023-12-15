// index.js
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

// Beispiel-Datenstruktur
let entries = {
  "example-slug": "https://rwu.de",
};

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
  const targetURL = entries[slug];
  if (targetURL) {
    res.redirect(targetURL);
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
  if (entries[slugToDelete]) {
    delete entries[slugToDelete];
    res.json({ message: 'Entry deleted successfully' });
  } else {
    res.status(404).json({ message: 'Slug not found' });
  }
});

// POST /entry
app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;
  
  // Wenn keine Slug angegeben ist, generiere eine zufällige
  const newSlug = slug || generateRandomSlug();

  // Speichere den Eintrag
  entries[newSlug] = url;

  res.json({ message: 'Entry added successfully', slug: newSlug, url });
});

// Generiere eine zufällige Slug
function generateRandomSlug() {
  return Math.random().toString(36).substring(7);
}

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

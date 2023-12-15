const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware für die Authentifizierung mit Bearer-Token
const authenticate = (req, res, next) => {
  const authToken = req.header('Authorization');
  
  if (!authToken || authToken !== 'Bearer YOUR_TOKEN') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

app.use(bodyParser.json());

// GET /:slug - Umleitung basierend auf dem Slug
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const entries = loadEntries();

  if (entries[slug]) {
    const targetURL = entries[slug];
    return res.redirect(targetURL);
  } else {
    return res.status(404).json({ message: 'Slug not found' });
  }
});

// GET /entries - Alle Einträge anzeigen (mit Authentifizierung)
app.get('/entries', authenticate, (req, res) => {
  const entries = loadEntries();
  return res.json(entries);
});

// DELETE /entry/:slug - Eintrag mit gegebener Slug löschen
app.delete('/entry/:slug', authenticate, (req, res) => {
  const slug = req.params.slug;
  const entries = loadEntries();

  if (entries[slug]) {
    delete entries[slug];
    saveEntries(entries);
    return res.json({ message: 'Entry deleted successfully' });
  } else {
    return res.status(404).json({ message: 'Slug not found' });
  }
});

// POST /entry - URL und optionaler Slug für Weiterleitung speichern
app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;
  const entries = loadEntries();

  if (!slug) {
    // Wenn keine Slug angegeben ist, generiere eine zufällige
    const randomSlug = uuidv4().substring(0, 8);
    entries[randomSlug] = url;
    saveEntries(entries);
    return res.json({ slug: randomSlug, url: url });
  } else {
    entries[slug] = url;
    saveEntries(entries);
    return res.json({ slug: slug, url: url });
  }
});

// Funktion zum Laden der Einträge aus der JSON-Datei
const loadEntries = () => {
  try {
    const data = fs.readFileSync('entries.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Funktion zum Speichern der Einträge in der JSON-Datei
const saveEntries = (entries) => {
  fs.writeFileSync('entries.json', JSON.stringify(entries, null, 2), 'utf-8');
};

// Starten Sie den Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

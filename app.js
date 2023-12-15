// app.js
const express = require('express');
const fs = require('fs');
const authenticate = require('./middleware');

const app = express();
const port = 3000;

app.use(express.json());

// Beispiel-Datenstruktur
let entries = {
  "rwu": "https://rwu.de",
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

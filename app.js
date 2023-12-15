// app.js
const express = require('express');
const fs = require('fs');
const authenticate = require('./middleware');

const app = express();
const port = 3000; 

app.use(express.json()); // Verwenden Sie JSON als Middleware für die Verarbeitung von Anfragen

// GET /:slug
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  // Hier die Logik zum Auflösen der Slug und zur Umleitung einfügen
  res.redirect(/* Ziel-URL hier */);
});

// GET /entries (Mit Authentication Middleware)
app.get('/entries', authenticate, (req, res) => {
  // Hier die Logik zum Lesen der JSON-Datei und Ausgeben der Einträge einfügen
});

// DELETE /entry/:slug
app.delete('/entry/:slug', authenticate, (req, res) => {
  const slugToDelete = req.params.slug;
  // Hier die Logik zum Entfernen des Eintrags aus der JSON-Datei einfügen
});

// POST /entry
app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;
  // Hier die Logik zum Speichern der URL und Slug in der JSON-Datei einfügen
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

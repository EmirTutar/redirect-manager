// app.js

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware für die Authentifizierung mit Bearer-Token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  // Hier sollte die Überprüfung des Bearer-Tokens erfolgen
  // Zum Beispiel: if (token === 'IHR_BEARER_TOKEN') { next(); }
  // Beachten Sie, dass dies nur ein einfaches Beispiel ist und Sie sicherstellen müssen, dass die Authentifizierung sicher ist.

  if (token === 'IHR_BEARER_TOKEN') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware für das Parsen von JSON-Daten im Anfragekörper
app.use(bodyParser.json());

// GET /:slug
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  const data = loadRedirectData();
  
  if (data[slug]) {
    res.redirect(301, data[slug]);
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

// GET /entries (Mit Authentication Middleware)
app.get('/entries', authenticate, (req, res) => {
  const data = loadRedirectData();
  res.json(data);
});

// DELETE /entry/:slug
app.delete('/entry/:slug', authenticate, (req, res) => {
  const slug = req.params.slug;
  const data = loadRedirectData();
  
  if (data[slug]) {
    delete data[slug];
    saveRedirectData(data);
    res.json({ message: 'Entry deleted successfully' });
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

// POST /entry
app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;
  const data = loadRedirectData();

  // Wenn keine Slug mitgegeben wird, generiere eine zufällige
  const newSlug = slug || generateRandomSlug();
  data[newSlug] = url;

  saveRedirectData(data);
  res.json({ slug: newSlug, url });
});

// Standard-Route für den Wurzelpfad
app.get('/', (req, res) => {
    res.send('Willkommen beim URL Redirect Manager!');
  });

// Funktion zum Laden der Daten aus der JSON-Datei
function loadRedirectData() {
  try {
    const rawData = fs.readFileSync('redirects.json');
    return JSON.parse(rawData);
  } catch (error) {
    return {};
  }
}

// Funktion zum Speichern der Daten in der JSON-Datei
function saveRedirectData(data) {
  fs.writeFileSync('redirects.json', JSON.stringify(data, null, 2));
}

// Funktion zur Generierung einer zufälligen Slug
function generateRandomSlug() {
  return Math.random().toString(36).substring(2, 8);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

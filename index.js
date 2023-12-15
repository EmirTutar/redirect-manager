
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const dataPath = './redirects.json';

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (token === 'IHR_BEARER_TOKEN') {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error(err);
    return {};
  }
};

// Schreibt die Daten in die JSON-Datei
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Hinzufügen eines neuen Redirect-Eintrags
app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;

  if (!slug || !url) {
    return res.status(400).send('Slug und URL sind erforderlich.');
  }

  const data = readData();
  data[slug] = url;
  writeData(data);

  res.status(201).send(`Redirect für ${slug} hinzugefügt.`);
});

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

// Umleitung basierend auf dem Slug
app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const data = readData();

  if (data[slug]) {
    return res.redirect(data[slug]);
  } else {
    return res.status(404).send('Slug nicht gefunden.');
  }
});

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

// Starten des Servers
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const TOKEN = process.env.BEARER_TOKEN || "secret";
const dataPath = './redirects.json';

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === TOKEN) {
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

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

app.get('/', (req, res) => {

    const welcomeMessage = 'Willkommen beim URL Redirect Manager!';
    const explanations = `
      <p>(Achtung: Token in Headers Notwendig!) <br><br> Um alle Redirect-Einträge anzuzeigen, verwenden Sie:</p>
      <code>GET /entries</code>
      <br><br>

      <p>(Achtung: Token in Headers Notwendig!) <br><br> Um einen Redirect-Eintrag hinzuzufügen, verwenden Sie:</p>
      <code>POST /entry</code>
      <br><br>

      <p>(Achtung: Token in Headers Notwendig!) <br><br> Um einen Redirect-Eintrag zu löschen, verwenden Sie:</p>
      <code>DELETE /entry/:slug</code>
      <br><br>

      <p>(Kein Token Notwendig!) <br><br> Um auf einen Redirect zuzugreifen, verwenden Sie:</p>
      <code>GET /:slug</code>
      <br><br>
      `;
  
    res.send(`${welcomeMessage}<br><br>${explanations}`);
});

app.get('/entries', authenticate, (req, res) => {
  const entries = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  res.json(entries);
});

app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const data = readData();

  if (data[slug]) {
    return res.redirect(data[slug]);
  } else {
    return res.status(404).send('Slug nicht gefunden.');
  }
});

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
    const data = readData();
    
    if (data[slug]) {
      delete data[slug];
      writeData(data);
      //res.json({ message: 'Entry deleted successfully' });
      res.status(200).json({ message: 'Entry deleted successfully' });      

    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
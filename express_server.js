const express = require('express');
const app = express();
const PORT = 8080; // default port

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
};

const urlDataBase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDataBase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDataBase };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortId = generateRandomString();
  urlDataBase[shortId] = req.body.longURL;
  res.redirect(`/urls/${shortId}`);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get('/urls/:id', (req, res) => {
  const urlID = req.params.id;
  const longURL = urlDataBase[urlID];
  
  const templateVars = { id: urlID, longURL };
  res.render('urls_show', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
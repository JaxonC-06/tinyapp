const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const templateVars = { username: req.cookies['username'], urls: urlDataBase };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortId = generateRandomString();
  urlDataBase[shortId] = req.body.longURL;
  res.redirect(`/urls/${shortId}`);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { username: req.cookies['username'] }
  res.render('urls_new', templateVars);
});

app.get('/urls/:id', (req, res) => {
  const urlID = req.params.id;
  const longURL = urlDataBase[urlID];
  
  const templateVars = { username: req.cookies["username"], id: urlID, longURL };
  res.render('urls_show', templateVars);
});

app.get('/u/:id', (req, res) => {
  const urlId = req.params.id;
  const longURL = urlDataBase[urlId];
  res.redirect(longURL);
});

app.post('/urls/:id', (req, res) => {
  const urlId = req.params.id;
  const newLongURL = req.body.longURL;

  urlDataBase[urlId] = newLongURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  const urlId = req.params.id;

  delete urlDataBase[urlId];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
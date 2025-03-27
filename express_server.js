const express = require('express');
const app = express();
const PORT = 8080; // default port

const urlDataBase = {
  b2xVn2: 'http://wwww.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDataBase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
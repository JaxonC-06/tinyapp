// Initializing the app, and importing the required packages

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port

// Set up app to use EJS and cookie-parser

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// This function generates a random string, to be used with links and user_id's

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
};

const urlDataBase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "orange-lion-dev",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "grey-zebra-coder",
  },
};

// This function verifies a registered user

const userLookup = function (email) {
  for (const userID in users) {
    const currentUser = users[userID]
    if (currentUser.email === email) {
      return currentUser;
    }
  }

  return null;
};

// The following three functions are implemented for project grading, but provide no practical use

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDataBase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// The two functions below control the '/register' url

app.get('/register', (req, res) => {
  const user_id = req.cookies['user_id'];
  const user = users[user_id];
  const templateVars = { user };
  
  if (user) {
    res.redirect('/urls');
  } else {
    res.render('register', templateVars);
  }
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send(`
      <h1>400: Page Not Found</h1>
      <h3>No email or password was provided, please try again.</h3>
      <a href="/register">Go back to registration</a>
    `);
  }

  if (userLookup(email)) {
    return res.status(400).send(`
      <h1>400: Page Not Found</h1>
      <h3>An account with this email already exists, please try again.</h3>
      <a href="/register">Go back to registration</a>
    `);
  }

  const newID = generateRandomString();

  users[newID] = {
    id: newID,
    email: req.body.email,
    password: req.body.password
  },

  res.cookie('user_id', newID);
  res.redirect('/urls');
});

// The two functions below control the '/login' url

app.get('/login', (req, res) => {
  const user_id = req.cookies['user_id'];
  const user = users[user_id];
  const templateVars = { user };

  if (user) {
    res.redirect('/urls');
  } else {
    res.render('login', templateVars);
  }
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = userLookup(email);

  if (!user) {
    return res.status(403).send(`
      <h1>Status Code: 403</h1>
      <h3>There is no account linked to this email. Please verify your spelling, or click the link below to create an account.</h3>
      <a href="/register">Create an Account</a>
    `);
  }

  if (user) {
    if (password !== user.password) {
      return res.status(403).send(`
        <h1>Status Code: 403</h1>
        <h3>The password was not correct. Please verify your spelling and click the link below to try again.</h3>
        <a href="/login">Login</a>
      `);
    }
  }

  res.cookie('user_id', user.id);
  res.redirect('/urls');
});

// The '/logout' function allows the user to clear their cookies

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

// User can view their saved urls

app.get('/urls', (req, res) => {
  const user_id = req.cookies['user_id'];
  const user = users[user_id];
  const templateVars = { user, urls: urlDataBase };
  res.render('urls_index', templateVars);
});

// Posts a new url and short url to page '/urls'

app.post('/urls', (req, res) => {
  const shortId = generateRandomString();
  urlDataBase[shortId] = req.body.longURL;
  res.redirect(`/urls/${shortId}`);
});

// Create a new short url

app.get('/urls/new', (req, res) => {
  const user_id = req.cookies['user_id'];
  const user = users[user_id];
  const templateVars = { user }
  res.render('urls_new', templateVars);
});

// Fetches a page for a specific short url id

app.get('/urls/:id', (req, res) => {
  const urlID = req.params.id;
  const longURL = urlDataBase[urlID];
  
  const user_id = req.cookies['user_id'];
  const user = users[user_id];
  const templateVars = { user, id: urlID, longURL };
  res.render('urls_show', templateVars);
});

// Uses the short id to access the normal url

app.get('/u/:id', (req, res) => {
  const urlId = req.params.id;
  const longURL = urlDataBase[urlId];
  res.redirect(longURL);
});

// Update an existing long url

app.post('/urls/:id', (req, res) => {
  const urlId = req.params.id;
  const newLongURL = req.body.longURL;

  urlDataBase[urlId] = newLongURL;
  res.redirect('/urls');
});

// Delete a short and long url pair

app.post('/urls/:id/delete', (req, res) => {
  const urlId = req.params.id;

  delete urlDataBase[urlId];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
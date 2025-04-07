// Initializing the app, and importing the required packages

const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port

// Set up app to use EJS and cookie-parser

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['lighthouse'],
}));
app.set('view engine', 'ejs');

// This function generates a random string, to be used with links and user_id's

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
};

const urlDataBase = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'aJ481W',
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'aJ481W',
  },
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

const urlsForUser = function (id) {
  const usersShortURLs = {};

  for (const shortURL in urlDataBase) {
    if (urlDataBase[shortURL].userID === id) {
      usersShortURLs[shortURL] = urlDataBase[shortURL];
    }
  }

  return usersShortURLs;
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
  const user_id = req.session.user_id;
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
  const hashedPassword = bcrypt.hashSync(password, 10);

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
    password: hashedPassword,
  },

  req.session.user_id = newID;
  res.redirect('/urls');
});

// The two functions below control the '/login' url

app.get('/login', (req, res) => {
  const user_id = req.session.user_id;
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
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      res.redirect('/urls');
    } else {
      return res.status(403).send(`
        <h1>Status Code: 403</h1>
        <h3>The password was not correct. Please verify your spelling and click the link below to try again.</h3>
        <a href="/login">Login</a>
      `);
    }
  }
});

// The '/logout' function allows the user to clear their cookies

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// User can view their saved urls

app.get('/urls', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const urls = urlsForUser(user_id);
  const templateVars = { user, urls };

  if (!user) {
    res.send(`
      <h1>To access your URLs page, please login first.</h1>
      <a href="/login">Login here!</a>
    `);
  } else {
    res.render('urls_index', templateVars);
  }
});

// Posts a new url and short url to page '/urls'

app.post('/urls', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    return res.send(`
      <h1>You must be logged in to shorten URLs</h1>
    `);
  } else {
    const shortId = generateRandomString();
    urlDataBase[shortId] = {
      longURL: req.body.longURL,
      userID: user_id,
    };
  
    res.redirect(`/urls/${shortId}`);
  }
});

// Create a new short url

app.get('/urls/new', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const templateVars = { user }

  if (!user) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});

// Fetches a page for a specific short url id

app.get('/urls/:id', (req, res) => {
  const urlID = req.params.id;
  const urlEntry = urlDataBase[urlID];
  const longURL = urlEntry ? urlEntry.longURL : null;
  
  const user_id = req.session.user_id;
  const user = users[user_id];
  const templateVars = { user, id: urlID, longURL };

  if (!user) {
    return res.send(`
      <h1>You must be logged in to view this page.</h1>
      <a href="/login">Login here!</a>
    `);
  } else if (user && !urlsForUser(user_id)[urlID]) {
    return res.send(`
      <h1>You do not own the shortened URL ID ${urlID}</h1>  
    `);
  } else {
    res.render('urls_show', templateVars);
  }
});

// Uses the short id to access the normal url

app.get('/u/:id', (req, res) => {
  const urlId = req.params.id;
  const longURL = urlDataBase[urlId];

  if (!longURL) {
    res.send(`
      <h1>The shortened ID ${urlId} does not exist at http://localhost:8080/u/${urlId}</h1>
    `);
  } else {
    res.redirect(longURL.longURL);
  }
});

// Update an existing long url

app.post('/urls/:id', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const urlId = req.params.id;
  const newLongURL = req.body.longURL;

  if (!urlDataBase[urlId]) {
    return res.send(`<h1>The short URL ID ${urlId} does not exist.</h1>`);
  } else if (!user) {
    return res.send(`<h1>You must log in to edit a URL!</h1>`);
  } else if (user && !urlsForUser(user_id)[urlId]) {
    return res.send(`<h1>You do not own this short URL!</h1>`);
  } else {
    urlDataBase[urlId].longURL = newLongURL;
    res.redirect('/urls');
  }
});

// Delete a short and long url pair

app.post('/urls/:id/delete', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  const urlId = req.params.id;

  if (!urlDataBase[urlId]) {
    return res.send(`<h1>The short URL ID ${urlId} does not exist.</h1>`);
  } else if (!user) {
    return res.send(`<h1>You must log in to delete a URL!</h1>`);
  } else if (user && !urlsForUser(user_id)[urlId]) {
    return res.send(`<h1>You do not own this short URL!</h1>`);
  } else {
    delete urlDataBase[urlId];
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
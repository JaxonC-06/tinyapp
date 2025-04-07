// This function verifies a registered user

const userLookup = function (email, database) {
  for (const userID in database) {
    const currentUser = database[userID]
    if (currentUser.email === email) {
      return currentUser;
    }
  }

  return null;
};

// This function finds a specific users shortURL ID's

const urlsForUser = function (id, database) {
  const usersShortURLs = {};

  for (const shortURL in database) {
    if (database[shortURL].userID === id) {
      usersShortURLs[shortURL] = database[shortURL];
    }
  }

  return usersShortURLs;
};

module.exports = { userLookup, urlsForUser };
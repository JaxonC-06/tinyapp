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

module.exports = { userLookup }
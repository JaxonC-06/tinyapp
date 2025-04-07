const { assert } = require('chai');
const { userLookup, urlsForUser } = require('../helpers.js');

const testUsers = {
  '123456': {
    id: '123456',
    email: 'numberuser@test.com',
    password: 'i-love-numbers',
  },
  'abcdef': {
    id: 'abcdef',
    email: 'lettersuser@test.com',
    password: 'i-love-letters',
  }
};

describe('userLookup', () => {
  it('should return a user with a valid email', () => {
    const user = userLookup('lettersuser@test.com', testUsers);
    assert.deepEqual(user, testUsers.abcdef);
  });

  it('should return null for an invalid email', () => {
    const user = userLookup('symbolsuser@test.com', testUsers);
    assert.deepEqual(user, null);
  });
});

describe('urlsForUser', () => {
  it('should return urls belonging to a specific user', () => {
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userID: "user2" },
      "3xYz12": { longURL: "http://www.example.com", userID: "user1" }
    };

    const userID = "user1";
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "3xYz12": { longURL: "http://www.example.com", userID: "user1" }
    };

    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should return the URLs specific to the provided user ID.");
  });

  it('should return an empty object if the user has no URLs', () => {
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userID: "user2" }
    };

    const userID = "user3";
    const expectedOutput = {};

    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should return an empty object if the user has no URLs.");
  });

  it('should return an empty object if there are no URLs in the urlDatabase', () => {
    const urlDatabase = {}; // Empty database

    const userID = "user1";
    const expectedOutput = {};

    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should return an empty object when the urlDatabase is empty.");
  });

  it("should not return URLs that do not belong to the specific user", () => {
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userID: "user2" },
      "3xYz12": { longURL: "http://www.example.com", userID: "user1" }
    };

    const userID = "user2";
    const expectedOutput = {
      "9sm5xK": { longURL: "http://www.google.com", userID: "user2" }
    };

    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, "The function should only return URLs that belong to the specific user.");
  });
});

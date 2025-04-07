const { assert } = require('chai');
const { userLookup } = require('../helpers.js');

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
})
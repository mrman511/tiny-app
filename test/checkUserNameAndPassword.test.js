const mocha = require('mocha');
const chai = require('chai');
const { users } = require('../expressServer');
const { checkEmailAndPassword } = require('../helperFuncs');
const { assert } = require('chai');

const bcrypt = require('bcryptjs');

const mockUserData = {
  // id: {
  //  id: alpha Numeric id,
  //  email: user email,
  //  hashedPass: hashed password,
  //  }
  TxY76: {
    id: 'TxY76',
    email: 'paul@paul.com',
    hashedPass: bcrypt.hashSync('paul', 10),
  }
};

describe('#checkUserNameAndPassword', function() {
  it('returns object error of invalid input when entered no email or pass word submited', function() {
    assert.equal('invalid input', checkEmailAndPassword(mockUserData).error);
  });

  it('when entered only an email currently in users returns obj.data === match', function() {
    const email = 'paul@paul.com';
    const result = checkEmailAndPassword(mockUserData, email);
    assert.equal(result.data, 'match');
  });

  it('should return error of invalid input when both email and password are present but email is incorrect', () => {
    const email = 'wrong@wrong.com';
    const password = 'paul';
    assert.equal('invalid input', checkEmailAndPassword(mockUserData, email, password).error);
  });

  it('should return error of invalid input when both email and password are present but password is incorrect', () => {
    const email = 'paul@paul.com';
    const password = 'notpaul';
    assert.equal('invalid input', checkEmailAndPassword(mockUserData, email, password).error);
  });

  it('should return the data: (correct id) when email and password are correct', () => {
    const email = 'paul@paul.com';
    const password = 'paul';
    assert.equal('TxY76', checkEmailAndPassword(mockUserData, email, password).data);
  });
});
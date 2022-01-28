const bcrypt = require('bcryptjs');

const generateRandomString = (num) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let randomItems = [];
  for (let i = 0; randomItems.length < num; i++) {
    let num = Math.floor(Math.random() * 2);
    if (num === 0) {
      randomItems.push(String(Math.floor(Math.random() * 10)));
    } else {
      randomItems.push(alphabet[Math.floor(Math.random() * 26)]);
    }
  }
  return (randomItems.join(''));
};



const checkEmailAndPassword = (usersDB, email, password) => {
  if (!email) {
    return {'error': 'invalid input', data: null};
  }
  // if no password compare emails to emails in the data base
  if (password === undefined) {
    for (let user in usersDB) {
      if (email === usersDB[user].email) {
        return {'error': 'matching email found in users', data: "match"};
      }
    }
    return {'error': 'invalid input', 'data': 'register'};
  }

  //if email and password checks to see if they are
  //mathches to one user returns login data

  for (let user in usersDB) {
    if (usersDB[user].email === email) {
      if (bcrypt.compareSync(password, usersDB[user].hashedPass)) {
        return {'error': null, 'data': usersDB[user].id};
      }
    }
  }
  return {'error': 'invalid input', data: null};
};

module.exports = {
  generateRandomString,
  checkEmailAndPassword,
};
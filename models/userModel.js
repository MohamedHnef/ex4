const db = require('../db');

const User = {
  findByUsername: (username, callback) => {
    db.query('SELECT * FROM tbl_42_users WHERE username = ?', [username], callback);
  },

  createUser: (username, password, accessCode, callback) => {
    db.query('INSERT INTO tbl_42_users (username, password, access_code) VALUES (?, ?, ?)', [username, password, accessCode], callback);
  }
};

module.exports = User;

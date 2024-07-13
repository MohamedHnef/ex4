const db = require('../db');

const Preferences = {
  save: (userId, start_date, end_date, destination, vacation_type, callback) => {
    db.query('INSERT INTO tbl_42_preferences (user_id, start_date, end_date, destination, vacation_type) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE start_date = VALUES(start_date), end_date = VALUES(end_date), destination = VALUES(destination), vacation_type = VALUES(vacation_type)', [userId, start_date, end_date, destination, vacation_type], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM tbl_42_preferences', callback);
  }
};

module.exports = Preferences;

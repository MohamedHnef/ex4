const db = require('../db');
const jwt = require('jsonwebtoken');

exports.savePreferences = (req, res) => {
  const { start_date, end_date, destination, vacation_type } = req.body;
  const accessCode = req.headers['authorization']; // Correct place to get the access code

  if (!accessCode || !start_date || !end_date || !destination || !vacation_type) {
    console.log('Missing fields:', req.body);
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('Access code received for saving preferences:', accessCode);
    const decoded = jwt.verify(accessCode, process.env.JWT_SECRET);
    const username = decoded.username;
    console.log('Decoded username:', username);

    db.query('SELECT id FROM tbl_42_users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.log('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        console.log('No user found for username:', username);
        return res.status(401).json({ message: 'Invalid access code' });
      }

      const userId = results[0].id;
      console.log('User ID:', userId);

      db.query('INSERT INTO tbl_42_preferences (user_id, start_date, end_date, destination, vacation_type) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE start_date = VALUES(start_date), end_date = VALUES(end_date), destination = VALUES(destination), vacation_type = VALUES(vacation_type)', [userId, start_date, end_date, destination, vacation_type], (err, results) => {
        if (err) {
          console.log('Database error on insert:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Preferences saved successfully' });
      });
    });
  } catch (err) {
    console.log('Invalid access code:', err);
    return res.status(401).json({ message: 'Invalid access code', error: err });
  }
};

exports.getPreferences = (req, res) => {
    db.query('SELECT * FROM tbl_42_preferences', (err, results) => {
      if (err) {
        console.log('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(200).json(results);
    });
  };
  
  exports.getDestinations = (req, res) => {
    const destinations = loadJSON('data/destinations.json');
    res.json(destinations);
  };
  
  exports.getVacationTypes = (req, res) => {
    const vacationTypes = loadJSON('data/vacationTypes.json');
    res.json(vacationTypes);
  };
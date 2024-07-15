const Preferences = require('../models/preferencesModel');
const jwt = require('jsonwebtoken');
const { loadJSON } = require('../utils/jsonLoader'); // Correct import statement

const db = require('../db');

const destinations = loadJSON('data/destinations.json'); // Correct usage
const vacationTypes = loadJSON('data/vacationTypes.json'); // Correct usage

exports.savePreferences = (req, res) => {
  const { start_date, end_date, destination, vacation_type } = req.body;
  const accessCode = req.headers['authorization']; 

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

      Preferences.save(userId, start_date, end_date, destination, vacation_type, (err, results) => {
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

exports.updatePreferences = async (req, res) => {
  const { user_id, start_date, end_date, destination, vacation_type } = req.body;
  const accessCode = req.headers.authorization;

  if (!accessCode) {
    return res.status(401).json({ message: 'Access code required' });
  }

  try {
    console.log('Access code received for updating preferences:', accessCode);
    const decoded = jwt.verify(accessCode, process.env.JWT_SECRET);
    console.log('Decoded username:', decoded.username);

    db.query('SELECT username FROM tbl_42_users WHERE id = ?', [user_id], (err, results) => {
      if (err) {
        console.log('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        console.log('No user found for user ID:', user_id);
        return res.status(401).json({ message: 'Invalid access code' });
      }

      const dbUsername = results[0].username;
      console.log('Username from DB:', dbUsername);

      if (decoded.username !== dbUsername) {
        console.log('Decoded username does not match DB username');
        return res.status(401).json({ message: 'Invalid access code' });
      }

      Preferences.update(user_id, start_date, end_date, destination, vacation_type, (err, results) => {
        if (err) {
          console.log('Error updating preferences:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }

        console.log('Update results:', results);

        if (results.affectedRows === 0) {
          console.log('No rows affected');
          return res.status(404).json({ message: 'Preferences not found' });
        }

        console.log('Preferences updated successfully for user ID:', user_id);
        res.status(200).json({ message: 'Preferences updated successfully' });
      });
    });
  } catch (error) {
    console.log('Invalid access code:', error);
    res.status(401).json({ message: 'Invalid access code', error });
  }
};



exports.getPreferences = (req, res) => {
  Preferences.getAll((err, results) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
};

exports.getDestinations = (req, res) => {
  res.json(destinations);
};

exports.getVacationTypes = (req, res) => {
  res.json(vacationTypes);
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

exports.register = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Error hashing password', error: err });

    db.query('INSERT INTO tbl_42_users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      const payload = { username }; 
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

      res.status(201).json({ message: 'User registered successfully', accessCode: token });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.query('SELECT * FROM tbl_42_users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords', error: err });

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const payload = { username: user.username }; 
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

      res.json({ message: 'Login successful', accessCode: token });
    });
  });
};

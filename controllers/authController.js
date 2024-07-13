const db = require('../db');
const bcrypt = require('bcryptjs'); // Use bcryptjs
const jwt = require('jsonwebtoken'); // Use jsonwebtoken for JWT

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessCode = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated access code:', accessCode); // Log the generated token

    db.query('INSERT INTO tbl_42_users (username, password, access_code) VALUES (?, ?, ?)', [username, hashedPassword, accessCode], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Username already exists' });
        }
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(201).json({ message: 'User registered successfully', accessCode });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    db.query('SELECT * FROM tbl_42_users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const accessCode = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log('Generated access code:', accessCode); // Log the generated token

      res.status(200).json({ message: 'Login successful', accessCode });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

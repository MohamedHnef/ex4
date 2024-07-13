const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessCode = req.headers['authorization'];

  if (!accessCode) {
    console.log('Access code missing');
    return res.status(401).json({ message: 'Access code required' });
  }

  try {
    console.log('Access code received:', accessCode);
    const decoded = jwt.verify(accessCode, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Access code valid:', decoded);
    next();
  } catch (err) {
    console.log('Invalid access code', err);
    return res.status(401).json({ message: 'Invalid access code' });
  }
};

module.exports = authMiddleware;

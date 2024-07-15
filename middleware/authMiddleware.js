const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessCode = req.header('Authorization');

  if (!accessCode) {
    return res.status(401).json({ message: 'Access code required' });
  }

  try {
    const decoded = jwt.verify(accessCode, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid access code' });
  }
};

module.exports = authMiddleware;

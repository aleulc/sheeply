const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {

    if (req.method === 'OPTIONS') {
      return next();
    }

    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = auth;
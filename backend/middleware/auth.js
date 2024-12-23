// auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};

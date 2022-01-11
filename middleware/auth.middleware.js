const {
  verifyJWT
} = require('../utils/jwt.util');

const verifyToken = (req, res, next) => {
  const token = req.cookies['access_token']

  if (!token) {
    return res.status(403).redirect('/login')
  }

  const decoded = verifyJWT(token)

  if (!decoded) {
    return res.status(401).redirect('/login')
  }
  next()
};

module.exports = verifyToken;
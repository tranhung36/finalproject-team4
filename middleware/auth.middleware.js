const {
  verifyJWT
} = require('../utils/jwt.util');
const decodeJWT = require('jwt-decode')

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

const checkAuth = (req, res, next) => {
  const token = req.cookies['access_token']
  if (token) {
    const user = decodeJWT(token)
    res.locals.userInfo = user.user_id
    next()
  } else {
    next()
  }
}


module.exports = {
  verifyToken,
  checkAuth
};
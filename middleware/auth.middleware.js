const {
  verifyJWT
} = require('../utils/jwt.util');
const decodeJWT = require('jwt-decode')
const User = require('../models/user.model')

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

const checkAuth = async (req, res, next) => {
  const token = req.cookies['access_token']
  if (token) {
    const decoded = decodeJWT(token)
    const user = await User.findOne({
      _id: decoded.user_id
    })
    res.locals.userInfo = user
    next()
  } else {
    next()
  }
}

const checkRole = (req, res, next) => {
  const token = req.cookies['access_token']
  if (token) {
    const user = decodeJWT(token)
    res.locals.role = user.role
    next()
  } else {
    next()
  }
}

module.exports = {
  verifyToken,
  checkAuth,
  checkRole
};
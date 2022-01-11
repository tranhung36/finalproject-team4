const jwt = require('jsonwebtoken')

module.exports = {
    signJWT: (data, expiresIn) => {
        return jwt.sign(data, process.env.TOKEN_KEY, expiresIn)
    },
    verifyJWT: (token) => {
        return jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
            if (err) return false
            return true
        })
    }
}
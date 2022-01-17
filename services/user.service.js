const decodeJWT = require('jwt-decode')

module.exports = (req, res) => {
    const accessToken = req.cookies['access_token']
    const user = decodeJWT(accessToken)
    return user
}
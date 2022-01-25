const {
    WishList
} = require('../models/user.model')
const decodeJWT = require('jwt-decode')

module.exports = async (req, res, next) => {
    const accessToken = req.cookies['access_token']

    if (accessToken) {
        const user = decodeJWT(accessToken)
        const myWish = await WishList.find({
            user: user.user_id,
            wish: true
        })
        if (myWish) {
            const countProductWish = myWish.length
            res.locals.myWish = countProductWish
        }
    }
    next()
}
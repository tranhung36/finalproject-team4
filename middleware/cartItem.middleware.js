const Order = require('../models/order.model')
const decodeJWT = require('jwt-decode')

module.exports = async (req, res, next) => {
    const accessToken = req.cookies['access_token']

    if (accessToken) {
        const user = decodeJWT(accessToken)
        const order = await Order.findOne({
            userId: user.user_id,
            ordered: false
        }).populate({
            path: 'orderItems',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        }).exec()
        if (order) {
            const countItem = order.orderItems.length
            res.locals.cart = countItem
        }
    }
    next()
}
const Order = require('../models/order.model')
const decodeJWT = require('jwt-decode')


const orderInfo = async (req, res) => {
    const accessToken = req.cookies['access_token']
    const user = decodeJWT(accessToken)
    const order = await Order.findOne({
        userId: user.user_id,
        ordered: false
    }).populate({
        path: 'orderItems',
        populate: {
            path: 'productId',
            model: 'Product'
        },
    }).populate('userId').exec()
    return order
}

module.exports = {
    orderInfo
}
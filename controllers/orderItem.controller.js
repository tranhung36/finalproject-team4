const OrderItem = require('../models/orderItem.model')
const jsdom = require('jsdom')
const {
    JSDOM
} = jsdom


async function cart(req, res, next) {
    try {
        const orderItems = await OrderItem.find().populate('productId').exec()
        const totalItem = orderItems.reduce((total, item) => {
            return total += item.quantity * item.productId.price
        }, 0)
        if (orderItems) {
            res.render('products/cart', {
                orderItems,
                totalItem
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    cart
}
const OrderItem = require('../models/orderItem.model')
const Product = require('../models/product.model')
const Order = require('../models/order.model')
const userInfo = require('../services/user.service')

async function cart(req, res, next) {
    try {
        const user = userInfo(req)
        const order = await Order.findOne({
            userId: user.user_id,
            ordered: false,
        }).populate({
            path: 'orderItems',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        }).exec()
        const totalItem = order.orderItems.reduce((total, item) => {
            return total += item.quantity * item.productId.price
        }, 0)
        if (order) {
            res.render('products/cart', {
                orderItems: order.orderItems,
                totalItem
            })
        }
    } catch (error) {
        next(error)
    }
}

async function addToCart(req, res, next) {
    try {
        let orderItem
        const user = userInfo(req)
        const item = await Product.findOne({
            slug: req.params.slug
        })
        orderItem = await OrderItem.findOne({
            productId: item._id,
            ordered: false,
            userId: user.user_id
        })
        if (!orderItem) {
            orderItem = await OrderItem.create({
                productId: item._id,
                userId: user.user_id
            })
        }

        const order = await Order.findOne({
            userId: user.user_id,
            ordered: false
        })
        if (order) {
            const ordItem = order.orderItems.find(id => {
                return id.toString() === orderItem._id.toString()
            })
            if (ordItem) {
                orderItem.quantity += 1
                orderItem.save()
            } else {
                order.orderItems.push(orderItem)
                order.save()
            }
        } else {
            const order = await Order.create({
                userId: user.user_id,
                ordered: false,
                orderItems: [orderItem]
            })
        }
        res.writeHead(303, {
            Location: req.headers.referer
        }).end()
    } catch (error) {
        next(error)
    }
}

async function removeItemSingleFromCart(req, res, next) {
    try {
        const user = userInfo(req)
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
            const orderItem = order.orderItems.find(item => {
                return item.productId.slug === req.params.slug
            })
            if (orderItem.quantity > 1) {
                orderItem.quantity -= 1
                orderItem.save()
            } else {
                order.orderItems.pull(orderItem)
                orderItem.remove()
                order.save()
            }
        }
        res.writeHead(303, {
            Location: req.headers.referer
        }).end()
    } catch (error) {
        next(error)
    }
}

async function removeItemFromCart(req, res, next) {
    try {
        const user = userInfo(req)
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
            const orderItem = order.orderItems.find(item => {
                return item.productId.slug === req.params.slug
            })
            if (orderItem) {
                order.orderItems.pull(orderItem)
                orderItem.remove()
                order.save()
            }
        }
        res.writeHead(303, {
            Location: req.headers.referer
        }).end()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    cart,
    addToCart,
    removeItemSingleFromCart,
    removeItemFromCart
}
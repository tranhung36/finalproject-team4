const OrderItem = require('../models/orderItem.model')
const Product = require('../models/product.model')
const Order = require('../models/order.model')
const userInfo = require('../services/user.service')
const Coupon = require('../models/coupon.model')
const {
    orderInfo
} = require('../services/order.service')

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

        if (order) {
            const totalItem = order.orderItems.reduce((total, item) => {
                return total += item.quantity * item.productId.price
            }, 0)

            // Start p.nguyen add coupon
            const coupons = await Coupon.find({
                active: true
            })
            const findCoupon = await Coupon.find({
                code: req.query.couponCode
            })

            let notice
            let priceAfterDiscount
            let discount
            if (findCoupon.length > 0) {
                const today = new Date()

                findCoupon.map(coupon => {

                    const validTo = new Date(coupon.validTo)
                    const validFrom = new Date(coupon.validFrom)
                    if (today >= validFrom && today <= validTo && coupon.active === true) {
                        notice = 'Coupon Has Been Applied'

                        if (coupon.byCategory == null) {
                            discount = totalItem * coupon.amount / 100

                            if (discount > coupon.maxDiscount && Number(coupon.maxDiscount) != 0) {

                                discount = Number(coupon.maxDiscount)
                                priceAfterDiscount = totalItem - discount

                            } else {
                                priceAfterDiscount = totalItem - discount
                            }
                        } else {

                            const findDiscountProduct = order.orderItems.filter(product => product.productId.categoryId == coupon.byCategory)
                            const findRestProduct = order.orderItems.filter(product => product.productId.categoryId != coupon.byCategory)

                            const priceOfDiscountProduct = findDiscountProduct.reduce((a, b) => {
                                return a += b.quantity * b.productId.price
                            }, 0)

                            const priceOfRestProduct = findRestProduct.reduce((a, b) => {
                                return a += b.quantity * b.productId.price
                            }, 0)

                            discount = priceOfDiscountProduct * coupon.amount / 100

                            if (discount > coupon.maxDiscount && Number(coupon.maxDiscount) != 0) {

                                discount = coupon.maxDiscount
                                priceAfterDiscount = priceOfDiscountProduct + priceOfRestProduct - discount

                            } else {
                                priceAfterDiscount = priceOfDiscountProduct + priceOfRestProduct - discount
                            }
                        }
                    } else {
                        notice = 'Invalid Coupon'
                    }
                })
            }

            // End add coupon

            res.render('products/cart', {
                order,
                orderItems: order.orderItems,
                totalItem,
                coupons,
                price: priceAfterDiscount,
                notice,
                discount
            })

        } else {
            res.render('products/cart_empty')
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
            slug: req.params.slug,
            userID: {
                $nin: [user.user_id]
            }
        })

        if (!item) {
            res.status(400).json({
                msg: 'You can not buy your product'
            })
        }

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
    removeItemFromCart,
}
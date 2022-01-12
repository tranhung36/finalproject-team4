const Order = require('../models/order.model')
const User = require('../models/user.model')
const Payment = require('../models/payment.model')
const OrderItem = require('../models/orderItem.model')
const decodeJWT = require('jwt-decode')
const config = require('../config/stripe/secretKey.config')
const stripe = require('stripe')(config.stripe.secretKey);

async function checkoutHandle(req, res, next) {
    try {
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
        res.render('products/payment', {
            title: 'Payment'
        })
    } catch (error) {
        next(error)
    }
}

async function checkout(req, res, next) {
    try {
        const accessToken = req.cookies['access_token']
        if (accessToken) {
            const decoded = decodeJWT(accessToken)
            const user = await User.findOne({
                _id: decoded.user_id
            })
            const order = await Order.findOne({
                userId: user._id,
                ordered: false
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
            res.render('products/checkout', {
                user,
                order,
                totalItem,
                title: 'Checkout'
            })
        }
    } catch (error) {
        next(error)
    }
}

async function payment(req, res, next) {
    try {
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
        const session = await stripe.checkout.sessions.create({
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'VN'],
            },
            shipping_options: [{
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    //Delivers between 5 - 7 business days
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    }
                }
            }],
            payment_method_types: ['card'],
            customer_email: order.userId.email,
            line_items: order.orderItems.map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.productId.name,
                        },
                        unit_amount: item.productId.price,
                    },
                    quantity: item.quantity
                }
            }),
            mode: 'payment',
            success_url: `${process.env.DOMAIN}/success`,
            cancel_url: `${process.env.DOMAIN}/cancel`,
        });

        const payment = await Payment.create({
            userId: user.user_id,
            stripeChargeId: session.id,
            amount: session.amount_total
        })

        if (payment) {
            order.ordered = true
            order.stripeId = payment._id
            order.orderItems.forEach(item => {
                item.ordered = true
                item.save()
            })
            order.save()
            res.redirect(303, session.url);
        }
    } catch (error) {
        next(error)
    }

}

module.exports = {
    checkoutHandle,
    checkout,
    payment
}
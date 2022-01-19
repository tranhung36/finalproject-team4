const Payment = require('../models/payment.model')
const config = require('../config/stripe/secretKey.config')
const BillingAddress = require('../models/bill.model')
const stripe = require('stripe')(config.stripe.secretKey);
const {
    orderInfo
} = require('../services/order.service')


async function checkout(req, res, next) {
    try {
        const order = await orderInfo(req)
        const totalItem = order.orderItems.reduce((total, item) => {
            return total += item.quantity * item.productId.price
        }, 0)
        res.render('products/checkout', {
            order,
            totalItem,
            title: 'Checkout'
        })
    } catch (error) {
        next(error)
    }
}

async function payment(req, res, next) {
    try {
        const order = await orderInfo(req)
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
            customer_details: {},
            payment_method_types: ['card'],
            customer_email: order.userId.email,
            line_items: order.orderItems.map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.productId.name,
                            images: [item.productId.thumbnail]
                        },
                        unit_amount: item.productId.price * 100,
                    },
                    quantity: item.quantity
                }
            }),
            mode: 'payment',
            success_url: `${process.env.DOMAIN}/success?id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.DOMAIN}/cart`,
        });

        res.redirect(303, session.url)
    } catch (error) {
        next(error)
        console.log(error)
    }
}

async function successPayment(req, res, next) {
    try {
        const order = await orderInfo(req)
        const session = await stripe.checkout.sessions.retrieve(req.query.id, {
            expand: ['line_items']
        })

        const payment = await Payment.create({
            userId: order.userId._id,
            stripeChargeId: session.id,
            amount: session.amount_total
        })

        let lineAddress
        let billingAddress
        if (session.shipping.address.line1) {
            lineAddress = session.shipping.address.line1
        } else {
            lineAddress = session.shipping.address.line2
        }

        billingAddress = await BillingAddress.findOne({
            userId: order.userId._id,
            city: session.shipping.address.city,
            address: lineAddress,
        })

        if (billingAddress) {
            order.billingAddress = billingAddress._id
        } else {
            billingAddress = await BillingAddress.create({
                userId: order.userId._id,
                city: session.shipping.address.city,
                address: lineAddress,
            })
        }

        if (payment) {
            order.ordered = true
            order.stripeId = payment._id
            order.orderItems.forEach(item => {
                item.ordered = true
                item.save()
            })
            order.save()
            res.redirect('/payment-success')
        }

    } catch (error) {
        next(error)
    }
}

function cancelPayment(req, res, next) {
    res.render('cancel')
}

module.exports = {
    checkout,
    payment,
    successPayment,
    cancelPayment,
}
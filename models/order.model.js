const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const orderSchema = new Schema({
    orderItems: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    ordered: {
        type: Boolean,
    },
    address: String,
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    stripeId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
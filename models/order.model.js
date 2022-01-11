const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const orderSchema = new Schema({
    orderItem: {
        type: ObjectId,
        require: true
    },
    userId: {
        type: ObjectId,
        require: true,
    },
    ordered: {
        type: Boolean,
        require: true
    },
    billingAddress: {
        type: ObjectId,
        require: true
    },
    coupon: {
        type: ObjectId,
        require: true
    },
    stripeId: {
        type: ObjectId,
        require: true
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

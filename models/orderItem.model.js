const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    ordered: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    isRate: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true
})

const orderItem = mongoose.model('OrderItem', orderItemSchema)

module.exports = orderItem
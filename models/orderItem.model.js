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
    quantity: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true
})

const orderItem = mongoose.model('OrderItem', orderItemSchema)

module.exports = orderItem
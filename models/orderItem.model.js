const mongoose = require('mongoose')
const {
    Schema
} = mongoose
const Product = require('./product.model')

const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: Product,
    },
    quantity: {
        type: Number,
        require: true,
    },
}, {
    timestamps: true
})

const orderItem = mongoose.model('OrderItem', orderItemSchema)

module.exports = orderItem
const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const orderitemSchema = new Schema({
    productId: {
        type: ObjectId,
        require: true
    },
    quantity: {
        type: Number,
        require: true,
    },

}, {
    timestamps: true
})

const Orderitem = mongoose.model('Order', orderitemSchema)

module.exports = Orderitem

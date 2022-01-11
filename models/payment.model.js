const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    stripeId: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    }
}, {
    timestamps: true
})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
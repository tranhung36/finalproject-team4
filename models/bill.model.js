const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const billSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    }
}, {
    timestamps: true
})

const BillingAddress = mongoose.model('BillingAddress', billSchema)

module.exports = BillingAddress
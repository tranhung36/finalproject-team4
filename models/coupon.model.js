const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const couponSchema = new Schema({
    code: {
        type: String,
        max: 12,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    byCategory:{
        type: String,
        ref: 'category'
    },
    amount: {
        type: Number,
        require: true
    },
    maxDiscount:{
        type: Number
    },
    description:{
        type: String,
        require: true
    },
    validFrom: {
        type: String,
        require: true
    },
    validTo: {
        type: String,
        require: true
    },
    active:{
        type: Boolean,
        require: true
    }
}, {
    timestamps: true
})

const coupons = mongoose.model('coupons', couponSchema)

module.exports = coupons
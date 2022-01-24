const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const rateSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    star: Number,
    comment: String
}, {
    timestamps: true
});

module.exports = mongoose.model("Rate", rateSchema);
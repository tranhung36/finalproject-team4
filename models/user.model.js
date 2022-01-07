const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    user: {
        type: String,
        max: 255,
        require: true
    },
    address: {
        type: String,
        require: true,
        unique: true
    },
    telephone: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

const Products = mongoose.model('User', userSchema)

module.exports = Products
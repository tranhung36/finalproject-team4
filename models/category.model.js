const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        max: 255,
        require: true
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
}, {
    timestamps: true
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
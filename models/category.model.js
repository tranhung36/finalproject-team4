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
        unique: true
    },
}, {
    timestamps: true
})

categorySchema.pre('save', (next) => {
    const slug = this.name.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')

    this.slug = slug

    next();
});


const Category = mongoose.model('Category', categorySchema)

module.exports = Category
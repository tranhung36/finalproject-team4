const mongoose = require('mongoose')
const {
    Schema
} = mongoose
const slugify = require('slugify')

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

categorySchema.pre('save', async function (next) {
    let count = 1
    const slug = slugify(this.name, {
        lower: true
    })

    this.slug = slug

    next();
});


const Category = mongoose.model('Category', categorySchema)

module.exports = Category
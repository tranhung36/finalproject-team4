const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const productSchema = new Schema({
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
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    thumbnail: {
        type: String,
        require: true
    },
    images: {
        type: Array,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {
    timestamps: true
})

productSchema.pre('save', (next) => {
    const slug = this.name.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')

    this.slug = slug

    next();
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product
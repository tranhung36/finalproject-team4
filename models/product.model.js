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
    images: [{
        type: String,
    }],
    stock: {
        type: Number,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    userID: {
        type: String,
    }
}, {
    timestamps: true
})

productSchema.pre('save', function(next) {
    const slug = this.name.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')

    this.slug = slug

    next();
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product
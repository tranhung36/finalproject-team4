const mongoose = require('mongoose')
const {
    Schema
} = mongoose
const slugify = require('slugify')

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
        ref: 'ChildCategory'
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: Number
}, {
    timestamps: true
})

productSchema.pre('save', function (next) {
    let slug = slugify(this.name, {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true // trim leading and trailing replacement chars, defaults to `true`
    })

    this.slug = slug

    next();
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product
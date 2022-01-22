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

categorySchema.pre('save', function (next) {
    const slug = slugify(this.name, {
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

const Category = mongoose.model('Category', categorySchema)

const childCategorySchema = new Schema({
    name: {
        type: String,
        max: 255,
        require: true
    },
    slug: {
        type: String,
        unique: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {
    timestamps: true
})

childCategorySchema.pre('save', function (next) {
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

const ChildCategory = mongoose.model('ChildCategory', childCategorySchema)

module.exports = {
    Category,
    ChildCategory,
}
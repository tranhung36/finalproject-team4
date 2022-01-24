const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const userSchema = new Schema({
    first_name: {
        type: String,
        default: null
    },
    last_name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'User'
    },
}, {
    timestamps: true
});

const wishListSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    wish: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)
const WishList = mongoose.model('WishList', wishListSchema)

module.exports = {
    User,
    WishList
}
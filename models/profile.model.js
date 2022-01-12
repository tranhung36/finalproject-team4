const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: Product,
    },
    address: {
        type: String,
        require: true
    },
    telephone: {
        type: String,
        max: 12,
        require: true
    }
}, {
    timestamps: true
})

const profile = mongoose.model('Profile', profileSchema)

module.exports = profile
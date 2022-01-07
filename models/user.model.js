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
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
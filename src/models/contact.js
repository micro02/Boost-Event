const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
        default: null,
    },
    message: {
        type: String,
        default: null,
    }
});

module.exports = mongoose.model('user', userSchema);
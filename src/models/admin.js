const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "admin",
    },
});

module.exports = mongoose.model('admin', adminSchema);
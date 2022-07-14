const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    event: {
        type: String,
    },
    phone: {
        type: Number,
        default: null,
    },
});

module.exports = mongoose.model('event', eventSchema);
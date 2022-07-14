const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    details: {
        type: String,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model('gallery', gallerySchema);
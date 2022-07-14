
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    message: {
        type: String,
    },
    date: {
        type: String,
    },
});

module.exports = mongoose.model('testimonial', testimonialSchema);
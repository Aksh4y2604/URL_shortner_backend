const mongoose = require('mongoose');

const URL_shortner = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
        unique: true
    }
});

const URLs = mongoose.model('URL_shortner', URL_shortner);

module.exports = URLs;
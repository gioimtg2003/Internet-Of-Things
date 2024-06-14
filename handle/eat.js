const mongoose = require('mongoose');
const eatSchema = new mongoose.Schema({
    time: {
        type: Date,
        default: Date.now
    },
    eat: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('eats', eatSchema);


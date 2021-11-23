const mongoose = require('mongoose');

const prestadorSchema = new mongoose.Schema({
    pr_name: {
        type: String,
        required: true,
        min: 2,
        max: 40
    },
    pr_fone: { type: String,
        required: true,
        max: 20,
        min: 12,
    },
    pr_email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    pr_status: {
        type: String,
        required: true,
        min: 1
    },
    user_id: {
        type: String,
        required: false,
        min: 2,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prestador', prestadorSchema);
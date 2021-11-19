const { number } = require('@hapi/joi');
const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    service_name: {
        type: String,
        required: true,
        min: 4,
        max: 50
    },
    service_status: {
        type: String,
        required: true,
        min: 2
    },
    service_descricao: {
        type: String,
        required: true,
        max: 255,
        min: 2
    },
    service_tipo: {
        type: String,
        required: true,
        max: 30,
        min: 3
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


module.exports = mongoose.model('Servico', servicoSchema);
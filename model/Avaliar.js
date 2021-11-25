const { number } = require('@hapi/joi');
const mongoose = require('mongoose');

const avaliarSchema = new mongoose.Schema({
    comentario_pedido: {
        type: String,
        required: true,
        max: 255
    },
   stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user_id: {
        type: String,
        required: false,
        min: 2,
    },

    pedido_id: {
        type: String,
        required: false,
        min: 2,
    },
    date: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model('Avaliar', avaliarSchema);
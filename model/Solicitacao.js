const { number } = require('@hapi/joi');
const mongoose = require('mongoose');

const solicitacaoSchema = new mongoose.Schema({
    descricao_pedido: {
        type: String,
        required: true,
        max: 255
    },
    obs_prestador_pedido: {
        type: String,
        required: true,
        max: 160
    },
    pcd_obs_pedido: {
        type: String,
        required: true,
        max: 40
    },
    endereco_pedido: {
        type: String,
        required: true,
        max: 80
    },
    cep_pedido: {
        type: String,
        required: true,
        max: 15
    },
    cidade_pedido: {
        type: String,
        required: true,
        max: 30
    },
    complemento: {
        type: String,
        required: true,
        max: 30
    },
    localizacao_pedido: {
        type: Boolean, 
        required: true,
    },

    user_id: {
        type: String,
        required: false,
        min: 2,
    },

    servico_id: {
        type: String,
        required: false,
        min: 2,
    },
    date: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model('Solicitacao', solicitacaoSchema);
const { number } = require('@hapi/joi');
const mongoose = require('mongoose');

const solicitacaoSchema = new mongoose.Schema({});


module.exports = mongoose.model('Solicitacao', solicitacaoSchema);
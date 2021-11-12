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
    
})
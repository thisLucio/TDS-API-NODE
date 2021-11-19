//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        phone: Joi.string().min(12).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

//Login Validation
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

// Servico Validation
const servicoValidation = data => {
    const schema = Joi.object({
        service_name: Joi.string().min(4).required(),
        service_status: Joi.string().min(2).required(),
        service_descricao: Joi.string().min(2).required(),
        service_tipo: Joi.string().min(3).required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.servicoValidation = servicoValidation;
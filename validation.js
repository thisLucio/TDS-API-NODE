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
        service_tipo: Joi.string().min(3).required(),
        pr_id: Joi.string().min(2).required()
    });
    return schema.validate(data);
}

// Prestador Validation
const prestadorValidation = data => {
    const schema = Joi.object({
        pr_name: Joi.string().min(2).max(40).required(),
        pr_fone : Joi.string().min(12).required(),
        pr_email: Joi.string().min(6).required(),
        pr_status: Joi.string().min(1).required(),
        pr_description: Joi.string().max(255).required(),
        pr_city: Joi.string().max(40).required(),
        pr_uf: Joi.string().max(3).required()
    });
    return schema.validate(data);
}

// Solicitacao Validation
const solicitacaoValidation = data => {
    const schema = Joi.object({
        descricao_pedido: Joi.string().max(255).required(),
        obs_prestador_pedido:Joi.string().max(160).required(),
        pcd_obs_pedido: Joi.string().max(40).required(),
        endereco_pedido: Joi.string().max(80).required(),
        cep_pedido: Joi.string().max(15).required(),
        cidade_pedido: Joi.string().max(30).required(),
        complemento: Joi.string().max(30).required(),
        localizacao_pedido: Joi.boolean().required(),
        servico_id: Joi.string().min(2).required()
    });
    return schema.validate(data);
}

// Avaliar Validation
const avaliarValidation = data => {
    const schema = Joi.object({
        comentario_pedido: Joi.string().max(255).required(),
        stars: Joi.number().max(5).required()
    });
    return schema.validate(data);
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.servicoValidation = servicoValidation;
module.exports.prestadorValidation = prestadorValidation;
module.exports.solicitacaoValidation = solicitacaoValidation;
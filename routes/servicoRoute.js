const router = require('express').Router();
const Servico = require('../model/Servico');
const User = require('../model/User');
const verify = require('./verifyToken');
const {servicoValidation } = require ('../validation');
const { Mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

//INSERIR REGISTRO
router.post('/servico', verify, async (req, res) => {

    const {error } = servicoValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    const token = req.header('auth-token');
    const decodeToken = jwt.decode(token);
   
    const userId = decodeToken._id;
    

    //CREATE A NEW USER
    const servico = new Servico({
        service_name: req.body.service_name,
        service_status: req.body.service_status,
        service_descricao: req.body.service_descricao,
        service_tipo: req.body.service_tipo,
        user_id: userId

    });
    try {
        const savedServico = await servico.save();
        res.send({savedServico});
   } catch (error) {
       res.status(400).send(error);
   }
});

//FIND ALL
router.get('/servico', verify, function (req, res) {
    const token = req.header('auth-token');
    const decodeToken = jwt.decode(token);
   
    const userId = decodeToken._id;
    Servico.find({user_id: userId}, function (err, servicos) {
        if(err){
            res.status(400).send(error.details[0].message);
            next();
        }
            res.json(servicos);
    });
});


module.exports = router;
const router = require('express').Router();
const Servico = require('../model/Servico');
const User = require('../model/User');
const verify = require('./verifyToken');
const {servicoValidation } = require ('../validation');
const { Mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const Prestadores = require('../model/Prestadores');

//INSERIR REGISTRO
router.post('/servico', verify, async (req, res) => {

    const {error } = servicoValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //CREATE A NEW USER
    const servico = new Servico({
        service_name: req.body.service_name,
        service_status: req.body.service_status,
        service_descricao: req.body.service_descricao,
        service_tipo: req.body.service_tipo,
        pr_id: req.body.pr_id

    });
    
    try {
        const savedServico = await servico.save();
        res.send({savedServico});
   } catch (error) {
       res.status(400).send(error);
   }
});


let jsonPrestador = function(data){
    var jsonObject = JSON.parse(data);
    return jsonObject;
}
//FIND ALL
router.get('/servicos', verify, (req, res, next) => {

    Servico.find(function (err, servicos) {
        if(err){
            res.status(400).send(error.details[0].message);
            next();
        }   
        
        res.send(servicos);
    });

});

//FIND BY ID
router.get('/servico/:id', verify, function (req, res){
    
    Servico.findOne({ _id: req.params.id}, function (err, servico){
            if(err){
                res.status(400).send(error.details[0].message);
            next();
            }
            const retornoServico = servico;

            if(retornoServico != null){
                Prestadores.findById({_id: retornoServico.pr_id}, (err, prestador) => {
                   
                   res.json({
                       "Serviço": servico,
                       "Prestador": prestador,

                   });
                });
                
            }
            else {
                return res.status(400).send('Serviço não encontrado');
            }
       });

    });

// PUT UPDATE SERVICO
router.put('/servico/:id', verify, async (req, res) =>{

    const conditions = { _id: req.params.id};

    try {
        const savedServico = await Servico.updateOne(conditions, req.body);
        Servico.findOne({ _id: req.params.id}, function (err, servico){
            if(err){
                res.status(400).send(error.details[0].message);
            next();
            }
            const retornoServico = servico;

            if(retornoServico != null){
                res.json(servico);
            }
            else {
                return res.status(400).send('Serviço não encontrado');
            }
       });

   } catch (error) {
       res.status(400).send(error);
   }

});

//DELETE SERVICO
router.delete('/servico/:id', verify, async (req, res) => {
  
    try {
        Servico.findByIdAndDelete({_id: req.params.id}).exec().then(doc => {
            if(!doc) { return res.status(404).send('Serviço não existe').end();}
            return res.status(200).send('Serviço removido').end();
        })
    }catch(error){
        return res.status(400).send('Serviço não encontrado');
    }
});

//Buscar pelo nome
router.get('/servicos/nome/:nome', verify, async (req, res, next) => {
    Servico.find({service_name: req.params.nome}, function (err, servicos) {
        if(err){
            res.status(400).send(error.details[0].message);
            next();
        }   
        
        res.send(servicos);
    });

});

//Buscar pelo prestador
router.get('/servicos/prestador/:id', verify, async (req, res, next) => {
    Servico.find({pr_id: req.params.id},function (err, servicos) {
        if(err){
            res.status(400).send(error.details[0].message);
            next();
        }   
        
        res.send(servicos);
    });
});


module.exports = router;

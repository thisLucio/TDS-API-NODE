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

    // const token = req.header('auth-token');
    // const decodeToken = jwt.decode(token);

    // const userId = decodeToken._id;


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
    // const token = req.header('auth-token');
    // const decodeToken = jwt.decode(token);

    // const userId = decodeToken._id;
    Servico.find(function (err, servicos) {
        if(err){
            res.status(400).send(error.details[0].message);
            next();
        }   
        
        res.send(servicos);
    });

    // Servico.find()
    // .then(servicos => res.status(200).json(servicos))
    // .catch(error => res.status(500).json(error.details[0].message))
});

//FIND BY ID
router.get('/servico/:id', verify, function (req, res){
    // const token = req.header('auth-token');
    // const decodeToken = jwt.decode(token);

    // const userId = decodeToken._id;
    Servico.findOne({ _id: req.params.id}, function (err, servico){
            if(err){
                res.status(400).send(error.details[0].message);
            next();
            }
            const retornoServico = servico;

            if(retornoServico != null){
                Prestadores.findById({_id: retornoServico.pr_id}, (err, prestador) => {
                    const mergeObj = {servico , prestador}
                   res.json(mergeObj);
                });
                
            }
            else {
                return res.status(400).send('Serviço não encontrado');
            }
       });

    });

// PUT UPDATE SERVICO
router.put('/servico/:id', verify, async (req, res) =>{
    // const token = req.header('auth-token');
    // const decodeToken = jwt.decode(token);
    // const userId = decodeToken._id;

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
    // const token = req.header('auth-token');
    // const decodeToken = jwt.decode(token);
    // const userId = decodeToken._id;
    try {
        Servico.findByIdAndDelete({_id: req.params.id}).exec().then(doc => {
            if(!doc) { return res.status(404).send('Serviço não existe').end();}
            return res.status(200).send('Serviço removido').end();
        })
    }catch(error){
        return res.status(400).send('Serviço não encontrado');
    }
})


module.exports = router;

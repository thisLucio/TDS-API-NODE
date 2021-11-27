const router = require('express').Router();
const Solicitacao = require('../model/Solicitacao');
const Prestadores = require('../model/Prestadores');
const Servico = require('../model/Servico');
const User = require('../model/User');
const verify = require('./verifyToken');
const { solicitacaoValidation, avaliarValidation } = require ('../validation');
const { Mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const Avaliar = require('../model/Avaliar');



let verifyUser = function(req, res){
    const token = req.header('auth-token');
    const decodeToken = jwt.decode(token);

    const userId = decodeToken._id;
    return userId;
};

//INSERIR PEDIDO
router.post('/pedido', verify, async (req, res) =>{
    const {error } = solicitacaoValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    const userId = verifyUser(req, res);

    // CREATE A NEW PEDIDO
    const pedido = new Solicitacao({
        descricao_pedido: req.body.descricao_pedido,
        obs_prestador_pedido: req.body.obs_prestador_pedido,
        pcd_obs_pedido: req.body.pcd_obs_pedido,
        endereco_pedido: req.body.endereco_pedido,
        cep_pedido: req.body.cep_pedido,
        cidade_pedido: req.body.cidade_pedido,
        complemento: req.body.complemento,
        localizacao_pedido: req.body.localizacao_pedido,
        servico_id: req.body.servico_id,
        user_id: userId
    });
    try {
        const savedPedido = await pedido.save();
        res.send({savedPedido});
   } catch (error) {
       res.status(400).send(error);
   }
});

//BUSCAR PEDIDOS
router.get('/pedidos', verify, function(req, res) {
    const userId = verifyUser(req, res);
    Solicitacao.find({user_id: userId}, function (err, pedidos) {
        if(err){
            res.status(400).send(error.details[0].message);
        next();
        }
        const retornoPedidos = pedidos;

        if(retornoPedidos != null){
            res.json(pedidos)
            
        }
        else {
            return res.status(400).send('Serviço não encontrado');
        }
      });
});

//BUSCAR PEDIDO PELO ID
router.get('/pedidos/:id', verify, function(req, res){
    const userId = verifyUser(req, res);
    Solicitacao.findOne({ user_id: userId, _id: req.params.id}, function(err, pedido){
        if(err){
            res.status(400).send(error.details[0].message);
        next();
        }
        const retornoPedidos = pedido;
        if(retornoPedidos != null){
            Servico.findOne({ _id: retornoPedidos.servico_id}, function (err, servico){
                const retornoServico = servico;
                Prestadores.findById({_id: retornoServico.pr_id}, (err, prestador) => {
                    const mergeObj = {pedido, servico , prestador}
                   res.json(mergeObj);
                });
            });
        }
        else {
            return res.status(400).send('Pedido não encontrado');
        }
    });
});

//APAGAR PEDIDOS
router.delete('/pedido/:id', verify, async (req, res) => {
    try {
        Solicitacao.findByIdAndDelete({_id: req.params.id}).exec().then(doc => {
            if(!doc) { return res.status(404).send('Pedido não existe').end();}
            return res.status(200).send('Pedido removido').end();
        })
    }catch(error){
        return res.status(400).send('Pedido não encontrado');
    }
});

//ATUALIZAR PEDIDO 

router.put('/pedido/:id', verify, async (req, res) =>{

    const conditions = { _id: req.params.id};

    try {
        const savedPedido = await Solicitacao.updateOne(conditions, req.body);
        Solicitacao.findOne({ _id: req.params.id}, function (err, pedido){
            if(err){
                res.status(400).send(error.details[0].message);
            next();
            }
            const retornoPedidos = pedido;

            if(retornoPedidos != null){
                res.json(pedido);
            }
            else {
                return res.status(400).send('Pedido não encontrado');
            }
       });

   } catch (error) {
       res.status(400).send(error);
   }

});
//AVALIAR PEDIDO
router.post('/pedido/avaliar/:id', verify, async (req, res) =>{ 
    const {error } = avaliarValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //TRATATIVA PARA BLOQUEAR O USUÁRIO DE FAZER A MESMA AVALIAÇÃO
    const idAvaliadoExist = await Solicitacao.findOne({pedido_id: req.params.id});
    if(idAvaliadoExist) return res.status(400).send('Você já avaliou esse pedido ');

    const userId = verifyUser(req, res);

    Solicitacao.findOne({ user_id: userId, _id: req.params.id}, function(err, pedido){
        if(err){
            res.status(400).send(error.details[0].message);
        next();
        }
        const retornoPedidos = pedido;
        if(retornoPedidos != null){
            const avaliacao = new Avaliar({
                comentario_pedido: req.body.comentario_pedido,
                stars: req.body.stars,
                pedido_id: req.params.id
            });
            try {
                const savedAvaliar = avaliacao.save();
                res.status(200).send('Avaliação enviada!');
           } catch (error) {
               res.status(400).send(error);
           }
        }
    });
});

// APAGAR AVALIAÇÃO
router.delete('/pedidos/avaliado/:id', verify, function(req, res){
    try {
        Avaliar.findByIdAndDelete({_id: req.params.id}).exec().then(doc => {
            if(!doc) { return res.status(404).send('Pedido não existe').end();}
            return res.status(200).send('Pedido removido').end();
        })
    }catch(error){
        return res.status(400).send('Pedido não encontrado');
    }
    
});

//ATUALIZAR AVALIAÇÃO 

router.put('/pedidos/avaliado/:id', verify, async (req, res) =>{

    const conditions = { pedido_id: req.params.id};

    try {
        const savedAval = await Avaliar.updateOne(conditions, req.body);
        Avaliar.findOne({ pedido_id: req.params.id}, function (err, avaliacao){
            if(err){
                res.status(400).send(error.details[0].message);
            next();
            }
            const retornoAval = avaliacao;

            if(retornoAval != null){
                res.json(avaliacao);
            }
            else {
                return res.status(400).send('Avaliação não encontrada');
            }
       });

   } catch (error) {
       res.status(400).send(error);
   }

});

//BUSCAR PEDIDO AVALIADO
router.get('/pedidos/avaliado/:id', verify, function(req, res){
    const userId = verifyUser(req, res);
    Solicitacao.findOne({ user_id: userId, _id: req.params.id}, function(err, pedido){
        if(err){
            res.status(400).send(error.details[0].message);
        next();
        }
        const retornoPedidos = pedido;
        if(retornoPedidos != null){
            Servico.findOne({ _id: retornoPedidos.servico_id}, function (err, servico){
                if(err){
                    res.status(400).send(error.details[0].message);
                next();
                }
                const retornoServico = servico;
                Prestadores.findById({_id: retornoServico.pr_id}, (err, prestador) => {
                    if(err){
                        res.status(400).send(error.details[0].message);
                    next();
                    }
                    Avaliar.find({pedido_id: req.params.id }, (err, avaliar) => {
                        if(err){
                            res.status(400).send(error.details[0].message);
                        next();
                        }
                            res.json({
                                "pedido": pedido,
                                "servico": servico,
                                "prestador": prestador,
                                "avaliação": avaliar
                            })
                    });

                });
            });
        }
        else {
            return res.status(400).send('Pedido não encontrado');
        }
    });
});

module.exports = router;
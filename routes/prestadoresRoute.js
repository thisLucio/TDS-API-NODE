const Prestadores = require('../model/Prestadores');
const verify = require('./verifyToken');
const {prestadorValidation } = require ('../validation');
const router = require('express').Router();
const { Mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');


let verifyUser = function(req, res){
    const token = req.header('auth-token');
    const decodeToken = jwt.decode(token);

    const userId = decodeToken._id;
    return userId;
};


//INSERIR PRESTADOR
router.post('/prestadores', verify, async (req, res) => {

    // const {error } = prestadorValidation(req.body)
    // if(error) return res.status(400).send(error.details[0].message);

    // const userId = verifyUser(req, res);


    //CREATE A NEW PRESTADOR
    const prestador = new Prestadores({
        pr_name: req.body.pr_name,
        pr_fone: req.body.pr_fone,
        pr_email: req.body.pr_email,
        pr_status: req.body.pr_status,
        pr_description: req.body.pr_description,
        pr_city: req.body.pr_city,
        pr_uf: req.body.pr_uf
        // user_id: userId

    });
    try {
        const savedPrestador = await prestador.save();
        res.send({savedPrestador});
   } catch (error) {
       res.status(400).send(error);
   }
});
//FIND ALL
router.get('/prestadores', verify, function(req, res){
//   const userId = verifyUser(req, res);
  Prestadores.find(
    //   {user_id: userId},
     function (err, prestadores) {
    if(err){
      res.status(400).send(error.details[0].message);
      next();
    }
    res.json(prestadores);
  })
});

//FIND BY ID
router.get('/prestadores/:id', verify, function (req, res){
    // const userId = verifyUser(req, res);
    Prestadores.findOne(
        {
            // user_id: userId,
             _id: req.params.id}, function(err, prestador){
      if(err){
          res.status(400).send(error.details[0].message);
      next();
      }
      const retornoPrestador = prestador;

      if(retornoPrestador != null){
        res.json(prestador);
      }
      else{
        return res.status(400).send('Prestador não encontrado');
      }
    });
});

// PUT UPDATE PRESTADOR
router.put('/prestadores/:id', verify, async (req, res) => {
    // const userId = verifyUser(req, res);
    const conditions = { _id: req.params.id
        // , user_id: userId
    };
    try {
        const savedPrestador = await Prestadores.updateOne(conditions, req.body);
        Prestadores.findOne(
            {
                // user_id: userId,
                 _id: req.params.id
            }, function (err, prestador){
            if(err){
                res.status(400).send(error.details[0].message);
            next();
            }
            const retornoPrestadores = prestador;

            if(retornoPrestadores != null){
                res.json(prestador);
            }
            else {
                return res.status(400).send('Prestador não encontrado');
            }
       });

   } catch (error) {
       res.status(400).send(error);
   }
});

//DELETE PRESTADOR
router.delete('/prestadores/:id', verify, async (req, res) => {
    //   const userId = verifyUser(req, res);
      try {
            Prestadores.findByIdAndDelete({_id: req.params.id}).exec().then(doc => {
              if(!doc) { return res.status(404).send('Prestador não encontrado').end();}
              return res.status(200).send('Prestador removido');
          })
      }catch(error){
          return res.status(400).send('Prestador não encontrado');
      }
})

module.exports = router;

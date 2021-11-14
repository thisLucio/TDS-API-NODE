const router = require('express').Router();
const Servico = require('../model/Servico');


//INSERIR REGISTRO
router.post('/servico', async (req, res) => {
    res.send('Teste');
});

module.exports = router;
const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation } = require ('../validation');
const { route } = require('./auth');



let verifyUser = function(req, res){
    const token = req.header('auth-token');
    const decodeToken = jwt.decode(token);

    const userId = decodeToken._id;
    return userId;
};

var filepath = './assets/ProfessorX.jpg';

router.get('/', (req, res) => {
     
     res.sendFile(filepath, { root: '.' });
});

router.get('/root', (req, res) => {
   return res.status(200).send('E você é gatinha 😶');
});

module.exports = router;
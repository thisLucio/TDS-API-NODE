const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('./verifyToken');
const {registerValidation, loginValidation } = require ('../validation');

//REGISTER
router.post('/register', async (req, res) =>{
    // LETS VALIDATE THE DATA BEFORE SUBMIT
   const {error } = registerValidation(req.body)
   if(error) return res.status(400).send(error.details[0].message);

   //CHECKING IF THE USER IS ALREADY IN THE DATABASE
   const emailExist = await User.findOne({email: req.body.email});
   if(emailExist) return res.status(400).send('O Email já existe bro');

   //HASH THE PASSWORD
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.password, salt);

   //CREATE A NEW USER 
   const user = new User({
       username:req.body.username,
       email: req.body.email,
       phone: req.body.phone,
       password: hashedPassword
   });
   try {
        const savedUser = await user.save();
        res.send({user: user._id});
   } catch (error) {
       res.status(400).send(error);
   }
});

//LOGIN
router.post('/login', async (req, res) => {
    const {error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECKING IF THE email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email não foi encontrado ');
    //CHECKING IF THE password exists
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Senha Inválida')
    
    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token);

    const decodeToken = jwt.decode(token);

    const userId = decodeToken._id;
    try{
        User.findById({_id: userId},  function (err, usuario){
            if(err){
                res.status(400).send(error.details[0].message);
                next();
              }
              res.json({
                "auth-token": token,
                "username": usuario.username
            });
               
        });
        
    }
    catch(err){
        res.status(400).send('Tem algo errado, só não sei oq é');
    }
   
});


module.exports = router;
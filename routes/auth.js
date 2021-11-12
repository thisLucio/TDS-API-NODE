const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    if(!validPass) return res.status(400).send('Invalid password')
    
    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
  
 
});

module.exports = router;
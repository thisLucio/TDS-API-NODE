const router = require('express').Router();
const Servico = require('../model/Servico');
const User = require('../model/User');
const verify = require('./verifyToken');
const {servicoValidation } = require ('../validation');
const { Mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');


let verifyUser = function(req, res){
    const token = req.header('auth-token');
    const decodeToken = jwt.decode(token);

    const userId = decodeToken._id;
    return userId;
};

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const { application } = require('express');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true }, () => console.log('Conectou no banco menó'));

//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(5000, () => console.log('Server ta rodando menó'));
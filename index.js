const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const servicoRoute = require('./routes/servicoRoute');
const { application } = require('express');

dotenv.config();

//Connect to DB
mongoose.connect('mongodb+srv://robso:123@api-jwt.717ba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true }, () => console.log('Conectou no banco menó'));

//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/serviceRoute', servicoRoute);


app.listen(process.env.PORT || 5000, () => console.log('Server ta rodando menó'));
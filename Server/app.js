var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

//routes specification
var index = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
//middle ware section
app.use(logger('dev'));
app.use(bodyParser.json());
//handling different requests
app.use('/', index);
app.use('/users', users);
app.use('/signup', signup);







module.exports = app;

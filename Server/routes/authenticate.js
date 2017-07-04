var express=require('express');
var router=express.Router();
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var db=require('./database');
var passport = require("passport");
var passportJWT = require("passport-jwt");
//adding modules
var  JwtStrategy = require('passport-jwt').Strategy;
var  ExtractJwt = require('passport-jwt').ExtractJwt;

router.use(bodyParser.json());
/*********************setting up of options **************************************/
var options={};
options.secretOrKey="s-a-c-h-i-n-@***123456789!!!!!!!~~~~~";
options.jwtFromRequest = ExtractJwt.fromAuthHeader(); // read the JWT from the Authorization http headers of each request
/********************* Configuration of strategy **************************************/
passport.use(new JwtStrategy(options,function(jwt_payload,done){

console.log('payload received', jwt_payload);
var result1=[];
var user=[];
var sql="select * from users where username="+db.connection.escape(jwt_payload.username)+"and email="+db.connection.escape(jwt_payload.email);
db.select(sql,function(result){
 if (result!='[]')
 {
    user=JSON.parse(result);
    done(null, user);
 }
 else
 {
   done(null, false);
 }

});

}));


exports.passport=passport;
exports.option=options;

var express=require('express');
var router=express.Router();
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var db=require('./database');
var auth=require('./authenticate');

router.use(bodyParser.json());

router.post('/',function(req,res){
 var result1=[];
 var sql="select * from users where username="+db.connection.escape(req.body.username)+"and password="+db.connection.escape(req.body.password);
 db.select(sql,function(result){
  if (result!='[]')
  {
    result1=JSON.parse(result);
    var payload = {id: result1[0].user_id,username:result1[0].username,email:result1[0].email};
    var token = jwt.sign(payload, auth.option.secretOrKey);
    res.json({message: "ok", token: token});
  }
  else
  {
   res.status(401).json({message:"passwords did not match"});
  }

 });

});
///////////////////////////////////////////////

module.exports=router;

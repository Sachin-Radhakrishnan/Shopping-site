var express=require('express');
var app=express();
var router=express.Router();
var bodyParser = require('body-parser');
var crypto=require('crypto');
var path = require('path');
var db=require('./database');

router.use(bodyParser.json());
/* GET home page. */
router.post('/', function(req, res) {

  var sql="select * from product where subcategory_id="+req.body.id+" and status='active'";
  db.select(sql,function(result){
    if(result!='[]')
    {
    var result1 = JSON.parse(result);
    res.json(result1);
    res.end();
    }
    else
    {
      res.end("error");
    }
  });


});

module.exports = router;

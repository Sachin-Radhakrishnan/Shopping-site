var express=require('express');
var app=express();
var router=express.Router();
var bodyParser = require('body-parser');
var crypto=require('crypto');
var path = require('path');
var db=require('./database');
var auth=require('./authenticate');

router.use(bodyParser.json());
/* GET home page. */
/*
router.post('/', function(req, res, next) {
  auth.passport.authenticate('jwt', function(err, user, info) {

  if(!user) next();
  else {
    res.end();
      console.log(user);
  }


  })(req, res, next);
});
*/
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
/******************************************************************************************/
router.post('/addtocart', function(req, res,next) {
  auth.passport.authenticate('jwt', function(err, user, info) {

    if(user!=null)
    {
     var sql="select * from shoppingcart where user_id="+user[0].user_id+" and product_id="+req.body.id+" ";
     db.select(sql,function(result){
          if(result=='[]')
          {
            var sql2="insert into shoppingcart(user_id,product_id) values ("+user[0].user_id+","+req.body.id+")";
            db.insert(sql2);
            res.json("Item added to your cart");
          }
          else
          {
            res.json("Already added to cart");
          }
     });

    }
    else
    {
       res.json("error");
    }

  })(req, res, next);

});

module.exports = router;

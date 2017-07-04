var express=require('express');
var app=express();
var router=express.Router();
var bodyParser = require('body-parser');


router.use(bodyParser.json());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var express=require('express');
var app=express();
var router=express.Router();
var bodyParser = require('body-parser');
var crypto=require('crypto');
var path = require('path');
var db=require('./database');

router.use(bodyParser.json());

/**************************************************************************************/
router.get('/', function(req, res) {

  var sql="select count(*) as count from category where status='active'";
  var obj = {};
  var items=[];
  /**************************** Database part ************************************************/
  db.select(sql,function(result){

     if(result!='[]')
     {
         var sql1="select c.category_name ,c.category_id,s.subcategory_name ,s.subcategory_id  from `database`.category as c inner join `database`.subcategory as s on c.category_id=s.category_id where c.status='active' and s.status='active' order by s.subcategory_id,c.category_id ";
         db.select(sql1,function(result){
         var result1 = JSON.parse(result).slice(0);
         var obj={};
         var obj1={};
         var obj2={};
         var item=[];
         var Array=[];
         //extract first item category details
         obj.categoryname=result1[0].category_name;
         obj.category_id=result1[0].category_id;
         //extract first item sub category details and put it in item array
         obj1.subcategory=result1[0].subcategory_name;
         obj1.subcategory_id=result1[0].subcategory_id;
         item.push(obj1);
         ////////////////////////////////////////////////////////////
          for(var i=1;i<result1.length;i++)
           {
             if(result1[i].category_name==result1[i-1].category_name)
              {
                 obj1={};
                 obj1.subcategory=result1[i].subcategory_name;
                 obj1.subcategory_id=result1[i].subcategory_id;
                 item.push(obj1);
              }
              else
              {

                obj.item=item;
                Array.push(obj);
                obj={};
                obj.categoryname=result1[i].category_name;
                obj.category_id=result1[i].category_id;
                obj1={};
                item=[];
                obj1.subcategory=result1[i].subcategory_name;
                obj1.subcategory_id=result1[i].subcategory_id;
                item.push(obj1);

              }
           }
                 obj.item=item;
                 Array.push(obj);
                 res.json(Array);
                 res.end();
               ///////////////////////////////////////////////////////////
               });
           }
           else
           {
            //nothing in db
              res.end('error');
           }
        });
/****************************************************************************/



});
/**************************************************************************************/

module.exports = router;

var mysql = require('mysql');
//configuration
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "database"
});
//
exports.connection=con;
//function to make connection
exports.makeconnection=function ()
{
  con.connect(function(err){
    if(err)
    {
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });
};
//insert function
exports.insert=function(sql,value)
{

con.query(sql,[value], function (err, result)
  {
    if (err) throw err;
    console.log("1 record inserted");
  });
};
//select function
exports.select=function(sql,callback)
{

      con.query(sql,function(err,results)
       {
              if(err) throw err;
              var objs = [];
              console.log('Data received from Db:\n'+sql);
              var obj= JSON.stringify(results);
              callback(obj);
      });
};
//update function
exports.update=function(sql)
{

      con.query(sql,function(err,result)
       {
         if (err) throw err;
         console.log('Changed ' + result.changedRows + ' rows');
      });
};
//delete
exports.delete=function(sql)
{

      con.query(sql,function(err,result)
       {
         if (err) throw err;
         console.log('Deleted ' + result.affectedRows + ' rows');
      });
};

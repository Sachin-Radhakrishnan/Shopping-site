var express=require('express');
var app=express();
var router=express.Router();
var bodyParser = require('body-parser');
var crypto=require('crypto');
var nodemailer = require('nodemailer');
var emailExistence = require('email-existence');
var path = require('path');
var db=require('./database');

router.use(bodyParser.json());
/*************************************************************************************************************/
//what to do when a signup request comes to your page
router.post('/',function(req,res){
var response=res;
var userinfo=req.body;
var token={hashValue:'',expiry:'',user_id:0};
var email=req.body.email;
var username=req.body.username;
var loop1=false,loop2=false,loop3=false;
var data={status:'Registration successfull..Please go to your mail and complete the process',dest:'login'};
var sql1="select * from users where email="+db.connection.escape(email);
db.select(sql1,function(result){
  if(result=='[]')
    {
      loop1=true;
      var sql2="select * from users where username="+db.connection.escape(username);
      db.select(sql2,function(result){
      if(result=='[]')
       {
         //email and username doesnot exists
         emailExistence.check(email, function(err,res){
          if(res==true)
             {
                //email existssss
                var hashValue=crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex');
                //expiry date set up
                var expires = new Date();
                token.expiry=expires;
                token.hashValue=hashValue;
                expires.setMinutes(expires.getMinutes()+30);
                //sending a mail to user
                var url = "http://localhost:3000/signup/"+hashValue;
                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'sachin.kurup02@gmail.com',
                    pass: 'cgpucek@123'
                  }
                });
                console.log(req.body.email);

                var mailOptions = {
                    from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
                    to: email, //email
                    subject: 'Account Confirmation',
                    html: '<p>Click the following link to confirm your account:</p><p>'+url+'</p>'
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error)
                  {
                    console.log(error);
                  }
                  else
                  {
                        console.log('Email sent: ' + info.response);
                        db.insert('insert into users set ?', userinfo);
                        db.select('select max(user_id) as count from users',function(result){
                          var result1=JSON.parse(result);
                          token.user_id=result1[0].count;
                          //storing hashvalue and expiry time in database
                          db.insert('insert into token set ?', token);
                          response.json(data);
                        });
                  }
                });


             }
          else
            {
              //email checker fails
             data.status='The email you entered doesnot exists';
             data.dest='signup';
             response.json(data);
            }


    });


       }
       else
       {
          //username already exists
          data.status='Username already exists...Please try with a different one';
          data.dest='signup';
          response.json(data);
       }
      });

    }
  else
  {
     //emailid already exists
     data.status='User with this emailid already exists...';
     data.dest='login';
     response.json(data);
  }

});


});


/***********************************************************************************************************/
router.get('/:id',function(req,res){
var token,hash,expiry,expiry_time,current_time;
var sql="select * from token where hashValue='"+req.params.id+"' ";
db.select(sql,function(result) {

   if(result!="[]")
     {
           token=JSON.parse(result);
           hash=token[0].hashvalue;
           expiry=token[0].expiry;
           //converts date to UTC
           expiry_time=new Date(expiry).toISOString();
           current_time=new Date().toISOString();
           console.log(expiry_time);
           console.log(current_time);
           if(expiry_time>=current_time)
            {
              //send set password page
            res.sendFile(path.join(__dirname, '../public/pwd.html'));
            }
            else
            {
              //send link expired error message
              var html='<html><head><title>Shopping portal</title></head><body><h1>400 Bad Request...</h1><h3>Sorry...The link you are trying to use is expired...</h3></body></html>';
              res.send(html);
            }
     }
     else
     {
           //invalid URL message
           var html='<html><head><title>Shopping portal</title></head><body><h1>400 Bad Request...</h1><h3>Please use a valid URL</h3></body></html>';
           res.status(403).send(html);
     }
});


});
/************************************************************************************************************************************************/
router.post('/setpassword',function(req,res){
var sqlstmt="select user_id from token where hashValue="+db.connection.escape(req.body.token);
db.select(sqlstmt,function(result){
  var result1=JSON.parse(result);
  var user_id=result1[0].user_id;
  db.update("update users set password='"+req.body.password1+"' where user_id='"+user_id+"'");
  db.delete("delete from token where hashValue='"+req.body.token+"'");
  var html='<html><head><title>Shopping portal</title></head><body><h1Congragulations...</h1><h3>You are registered with our shopping portal....</h3></body></html>';
  res.send(html);
});
});
/************************************************************************************************************************************************/

module.exports=router;

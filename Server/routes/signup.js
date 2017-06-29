var express=require('express');
var app=express();
var router=express.Router();
var bodyParser = require('body-parser');
var crypto=require('crypto');
var nodemailer = require('nodemailer');
var emailExistence = require('email-existence');

var db=require('./database');

router.use(bodyParser.json());
/****************************************************/
//what to do when a signup request comes to your page
router.post('/',function(req,res){
var response=res;
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
                expires.setHours(expires.getHours()+6);
                //storing hashvalue and expiry time in database
                var sql3="insert into token(hashValue,expiry) values ('"+hashValue+"','"+expires+"')";
                db.insert(sql3);
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
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
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


/****************************************************/
module.exports=router;

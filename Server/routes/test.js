var hashValue=crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex');
//expiry date set up
var expires = new Date();
expires.setHours(expires.getHours()+6);
//storing hashvalue and expiry time in database
var sql="insert into token(hashValue,expiry) values ('"+hashValue+"','"+expires+"')";
db.insert(sql);
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
    to: req.body.email,
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

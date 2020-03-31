const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const express=require("express")
const ejs=require("ejs")
const moment=require("moment")
const timestamp=require("mongoose-timestamp")
const nodemailer=require("nodemailer")
const fs=require("fs")

const app=express()
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const regschema=new mongoose.Schema({
  username:String,
  password:String,
 
});

const loginschema=new mongoose.Schema({
	username:String,
	date:Date,
})
loginschema.plugin(timestamp)

const journalschema=new mongoose.Schema({
	username:String,
	text:String,
	date:Date,
})
journalschema.plugin(timestamp)
const journal=new mongoose.model('journal',journalschema)

const reg=new mongoose.model('reg',regschema)

const login=new mongoose.model('login',loginschema)

app.set('view engine','ejs')
app.use(bodyparser.urlencoded({ extended:true }))
app.use(express.static("public"));

var count=0

app.get("/",function(req,res){
	res.sendFile(__dirname+"/"+"index.html")

});

app.post("/",function(req,res){
	var username=req.body.username
	var password=req.body.password
	user=false
	finditems1=false
	var date1=new Date().getTime()
	reg.find({},function(err,finditems){
		if(err){
			console.log("error")
		}
			else{
				for(i=0;i<finditems.length;i++){
					if(finditems[i].username==username && finditems[i].password==password){
						user=true
						var redirecturl="home"
						var username1=finditems[i].username
						console.log(username)
						console.log(password)
						date1=moment().format("YYYY-DD-MM");
						console.log(date1)
						const login1= new login({
							username:username1,
							date:date1,
						});
						login1.save()
						break;
					}
					else{
						var redirecturl="login_error"
					}
			    }
			 }
			 journal.find({},function(err,finditems){
			 	if(err){
			 		console.log(err)
			 	}
			 	else{
			 		res.render(redirecturl,{text:"hi",user:user,usernamelogin:username1,date:date1,finditems:finditems})
			 	}

			 });
			
		});
});
	


app.get("/login-error",function(req,res){
	res.sendFile(__dirname+"/"+"error.html")
});
app.get("/register",function(req,res){
	res.sendFile(__dirname+"/"+"register.html")
	reg.find({},function(err,finditems){
		if(err){
			console.log("error")
		}
		else{
			console.log(finditems)
		}

});
});
app.post("/register",function(req,res){
	var username1=req.body.email
	var password=req.body.pas
	var phone=req.body.phone
	console.log(username1)
	console.log(password)
	console.log(phone)
	finditemsreg=true
	user=true
	const reg2= new reg({
	  username:username1,
	  password:password,
	  phone:phone,
	});
	reg2.save();
	journal.find({},function(err,finditems){
		if(err){
			console.log(err)
		}
		res.render("home",{usernamelogin:username1,finditems:finditems,user:user})
	});
});

app.get("/journal",function(req,res){
	res.sendFile(__dirname+"/"+"journal.html")
	login.find({},function(err,finditems){
		if(err){
			console.log("error")
		}
		else{
			console.log(finditems)
		}
	});
	journal.find({},function(err,finditems){
		if(err){
			console.log("error")
		}
		else{
			console.log(finditems)
		}
	});

})
app.post("/journal",function(req,res){
	var text=req.body.journal
	user=true
	var journalusername=req.body.username
	console.log(journalusername)
	console.log(text)
	var date2=moment().format('lll');
	console.log(date2)
	const journal1= new journal({
		text:text,
		date:date2,
		username:journalusername,
	});
	journal1.save(function(err,book){
		if(err){
			console.log("error")
		}
		else{
			journal.find({},function(err,finditems){
			if(err){
				console.log("error")
			}
			else{
				console.log(finditems)
				res.render("home",{user:user,username:journalusername,text:text,date:date2,finditems:finditems,usernamelogin:journalusername})
			}
		});
		}
	});
	});
	
app.post("/sendemail",function(req,res){
var name=req.body.username;
console.log(name)
var text=[]
var date=[]
journal.find({username:name},function(err,finditems){
	if(err){
		console.log("error")
	}
	else{
		console.log(finditems)

	}
	
	res.render("email",{finditems:finditems,name:name})
});
});
app.post("/sendmail",function(req,res){
	var name=req.body.logeduser
	console.log(name)
journal.find({username:name},function(err,finditems){
	var text=[]
	var date=[]
	for(i=0;i<finditems.length;i++){
		text.push(finditems[i].text)
		date.push(finditems[i].date)
	}
console.log(text)
console.log(date)
for(i=0;i<text.length;i++){
fs.appendFile(name+'.txt',name, function (err) {
  if (err) throw err;
  console.log('File is updated successfully.');
});
fs.appendFile(name+'.txt','\n', function (err) {
  if (err) throw err;
  console.log('File is updated successfully.');
});
fs.appendFile(name+'.txt',text[i], function (err) {
  if (err) throw err;
  console.log('File is updated successfully.');
}); 
fs.appendFile(name+'.txt','\n', function (err) {
  if (err) throw err;
  console.log('File is updated successfully.');
});
fs.appendFile(name+'.txt',date[i], function (err) {
  if (err) throw err;
  console.log('File is updated successfully.');
});
fs.appendFile(name+'.txt','\n', function (err) {
  if (err) throw err;
  console.log('File is updated successfully.');
});   
};
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
  	service:"Gmail",
     // true for 465, false for other ports
    auth: {
      user: "vysakhprakash2@gmail.com", // generated ethereal user
      pass: "ddrrkugkkbdzfovq" // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from:"vysakhprakash2@gmail.com" , // sender address
    to: "vysakhprakash22@gmail.com", // list of receivers
    subject: "project status"+name, // Subject line
    text: "project status?",
     attachments: [
     {   // utf-8 string as an attachment)
            filename: name+'.txt',
            path: __dirname+'/'+name+'.txt',
        },
        ]
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


main().catch(console.error);
});
res.render("sendmail",{username:name})
});



app.listen(3000,function(req,res){
	console.log("server connected at port 30000")
});

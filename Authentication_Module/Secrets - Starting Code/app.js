//jshint esversion:6
require('dotenv').config();
const express= require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption'); // Level 2 password encryption package


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//connect to mongoDB
mongoose.connect(MONGODB,{useNewUrlParse: true});

//create schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields:['password']});

const User = new mongoose.model("User", userSchema);



app.get('/', (req,res)=>{
  res.render('home');
});

app.get('/register', (req,res)=>{
  res.render('register');
});

app.post('/register',(req,res)=>{
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save((err)=>{
    if(err){
      console.error(err);
    }else {
      res.render('secrets');
    }
  });
});

app.get('/login', (req,res)=>{
  res.render('login');
});

app.post('/login',(req,res)=>
  {const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, (err,foundUser)=>{
    if(err){
      console.log(err);
    } else{
      if(foundUser){
        if(foundUser.password === password){
          res.render('secrets');
        }
      }
    }
  });
  }
);


app.listen(3005, ()=>{
  console.log('server is running on port 3005');
});

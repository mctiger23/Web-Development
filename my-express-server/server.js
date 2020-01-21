//jshint esversion:6

const express = require('express');
const app = express();

app.get("/",function(req, res){
  res.send("<h1>Hello, world!</h1>");
});

app.get("/contact", function(req,res){
  res.send("Contact me at: miguel.castro0328@gmail.com");
});

app.get("/About", function(req,res){
  res.send("<div><p><h1>About Me</h1></p></div><div><p><h2>First Name: </h2>Miguel</p></div><div><p><h2>Last Name: </h2>Castro</p></div><div><p><h2>Favorite Sport: </h2>Basketball</p></div>");
});

app.get("/hobbies", function(req,res){
  res.send("<h1>I Love Coffee and Beer!</h1>");
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});

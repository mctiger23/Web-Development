//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true})); //

app.listen(3001, function(){
  console.log("Server has started");

});

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html"); //__dirname allows us to grab/hold the current file location
});

app.post("/",function(req,res){
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);
  var result = num1 + num2;
  res.send("The result of the calculation is " + result);
});


app.get("/bmi",function(req,res){
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmi",function(req,res){
  var weight= parseFloat(req.body.weight);
  var height = parseFloat(req.body.height);
  var resultBMI = weight / Math.pow(height,2);
  //console.log("Weight: " + weight +"\n" +"Height: " + height);
  // if (resultBMI > 24.9){
  //     interpretation = ("Your BMI is " + resultBMI + ". You are overweight");
  // }
  // if (resultBMI > 18.5 && bmi <= 24.9){
  //     interpretation = ("Your BMI is " + resultBMI + ". Keep it up!");
  // }
  // if (resultBMI < 18.5) {
  //     interpretation = ("Your BMI is " + resultBMI + ". Eat more!");
  // }
  res.send("Your BMI is "+ resultBMI);
});

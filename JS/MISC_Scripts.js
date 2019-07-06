//BMI Calculator
function bmiCalculator (weight, height){
    var bmi = Math.round(weight / Math.pow(height,2));
    if (bmi > 24.9){
        interpretation = alert ("Your BMI is " + bmi + ". You are overweight");
    }
    if (bmi > 18.5 && bmi <= 24.9){
        interpretation = alert ("Your BMI is " + bmi + ". Keep it up!");
    }
    if (bmi < 18.5) {
        interpretation = alert ("Your BMI is " + bmi + ". Eat more!");
    }
    return interpretation;
}

bmiCalculator(65, 1.8);


//Using function within a fucntion

function getMilk(startMoney, costPerBottle) {
  console.log("leaveHouse");
  console.log("moveRight");
  console.log("moveRight");
  console.log("moveUp");
  console.log("moveUp");
  console.log("moveUp");
  console.log("moveUp");
  console.log("moveRight");
  console.log("moveRight");
  console.log ("Buy " + calcBottles(startMoney,costPerBottle) + " bottles of milk");
  console.log("moveLeft");
  console.log("moveLeft");
  console.log("moveDown");
  console.log("moveDown");
  console.log("moveDown");
  console.log("moveDown");
  console.log("moveLeft");
  console.log("moveLeft");
  console.log("enterHouse");
  console.log ("Hello, with the money you gave me (" + startMoney + ") I was able to buy " + calcBottles(startMoney,costPerBottle) + " Bottles of Milk");
  return calcChange(startMoney, costPerBottle);
}


function calcBottles (startMoney, costPerBottle){
  var totalBottles = Math.floor(startMoney / costPerBottle);
  return totalBottles;
}

function calcChange (startMoney,costPerBottle){
  var totalChange = startMoney % costPerBottle;
  return totalChange;

}

getMilk (20,1.5);

//random Gen (LoveGen)

var loveScore = Math.random ()* 100;
loveScore = Math.floor(loveScore + 1);
console.log(loveScore);


// You are on the LIST

var guestList =["Miguel", "Reggie", "Paul", "John"];

function guestValidation () {
    var guestName = prompt ("Enter your name:");
    if (guestList.includes(guestName)){
        alert("Welcome, " + guestName + "!");
    }
    else {
        alert ("Sorry, you are not invited.");
    }
}

guestValidation();

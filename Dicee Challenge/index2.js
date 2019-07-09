

//Generates Random Number for Player 1
function ranDice1 (){
  var randomNumber1 = Math.floor(Math.random()* (6)+1);
  document.getElementById("diceP1").src = "images/dice" + randomNumber1 +".png";
  console.log(randomNumber1);
  return randomNumber1;
}

//Generates Random Number for Player 2
function ranDice2 (){
  var randomNumber2 = Math.floor(Math.random()* (6)+1);
  document.getElementById("diceP2").src = "images/dice" + randomNumber2 +".png";
  console.log(randomNumber2);
  return randomNumber2;
}


function main(){
  var playerOne = ranDice1();
  var playerTwo =  ranDice2();
  if (playerOne > playerTwo){
    document.getElementById("notifyText").innerHTML = "Player 1 Wins!🚩";
  }
  if (playerTwo > playerOne){
    document.getElementById("notifyText").innerHTML = "Player 2 Wins!🚩";
  }
  else if (playerOne == playerTwo){
    document.getElementById("notifyText").innerHTML = "DRAW!";
  }
}

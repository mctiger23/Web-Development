// Battleship Game From Head First javascript

var location1 = 3 ;
var location2 = 4 ;
var location3 = 5;
var guess;
var hits = 0 ;
var guesses = 0;
var isSunk = false;

while (isSunk == false){
  guess = prompt ("Ready, aim, fire! (Enter a number from 0-6):");
  if (guess < 0 || guess > 6){
    alert ("Please Enter a valid Cell Number!");
  } else {
    guesses = guesses + 1;

    if (guess == location1 || guess == location2 || guess == location3){
      alert ("HIT!");
      hits = hits + 1;
      if (hits == 3 ){
        isSunk = true;
        alert("You sank my battleship!");
      }
    }else{
      alert ("MISS");
    }
  }
}
var stats = "You took " + guesses + "guesses to sink the battleship, " + "which means your shooting accuracy was " + (3/guesses);
alert(stats);
//test

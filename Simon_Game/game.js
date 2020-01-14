var buttonColours = ["red","blue","green","yellow"];
var gamePattern = []; //At the top of the game.js file, create a new empty array called gamePattern.
var userClickedPattern = []; // array will need to be empty every round
var level = 0;
var started = false;
var newRound = false;
// var gameOver = false;


//Sequence Function
function nextSequence() {
  userClickedPattern = [];
  level ++;
  var randomNumber;
  randomNumber = Math.floor(Math.random()* 4);
  var randomChosenColour = buttonColours[randomNumber]; //Create a new variable called randomChosenColour and use the randomNumber from step 2 to select a random colour from the buttonColours array.
  gamePattern.push(randomChosenColour);  //Add the new randomChosenColour generated in step 4 to the end of the gamePattern.
  $("#" +randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
  $("#level-title").text ("Level " + level);
  //console.log(gamePattern.length); // Line can be deleted. Used for debugging
}

//playSound Function
function playSound(name){
    var audio = new Audio ("sounds/" + name + ".mp3");
    audio.play();
}

//Animate function
function animatePress (currentColour){
  $("#" +currentColour).addClass("pressed");
  setTimeout (function (){
    $("#" +currentColour).removeClass("pressed");
  },100);
}

//button click
$(".btn").click(function(){
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length-1);  // after a user has clicked and chosen their answer, passing in the index of the last answer in the user's sequence.
  //checkAnswer();
});


//start game
// $("body").one("keypress",function(){
//   nextSequence();
//   });
//ALTERNATE
$(document).keypress(function(){
  if (!started){
    $("level-title").text("Level "+ level);
    nextSequence();
    started =true;
  }
});
//Validate answer function
function checkAnswer(currentLevel){
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]){ //Outer IF clause validates clicked pattern
    console.log("success");

    if(userClickedPattern.length === gamePattern.length){ //Inner IF clause triggers a new sequence once both userClickedPattern and gamePattern length is equal to one another

      setTimeout(function(){ //set delay to trigger the nextSequence function
        nextSequence();
      },1000);
    }
  } else { //Outter ELSE clause if the users guest is incorrect
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout (function(){
      $("body").removeClass("game-over");
    }, 100);
    $("#level-title").text("Game Over, Press Any Key to Start");
    console.log("wrong");
    started = false;
    level = 0;
    gamePattern = [];
  }
}







//On Click button functions
//Below is my version of how to each buttons being animated... Longer version
//
// $("#green").click(function(){
//   $(this).animate({opacity:0},"fast");
//   $(this).animate({opacity:1},"fast");
//   $("#greenAudio")[0].play();
// });
//
// $("#red").click(function(){
//   $(this).animate({opacity:0},"fast");
//   $(this).animate({opacity:1},"fast");
//   $("#redAudio")[0].play();
// });
//
// $("#yellow").click(function(){
//   $(this).animate({opacity:0},"fast");
//   $(this).animate({opacity:1},"fast");
//   $("#yellowAudio")[0].play();
// });
//
// $("#blue").click(function(){
//   $(this).animate({opacity:0},"fast");
//   $(this).animate({opacity:1},"fast");
//   $("#blueAudio")[0].play();
// });

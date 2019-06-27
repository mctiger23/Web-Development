//DOM Variables -- Caching the DOM// 

var userScore = 0;
var compScore = 0;
const userScore_span = document.getElementById("user-score");
const computer_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p= document.querySelector(".result > p")
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

function getComputerChoice(){
    const choices = ['r', 'p','s'];
    const randomNumber = Math.floor(Math.random() * 3);
    return choices[randomNumber];
}

function convertText (letter) {
    if (letter === "r") return "Rock";
    if (letter === "p") return "Paper";
    if (letter === "s") return "Scissors";
}

function win(userChoice, computerChoice) {
    userScore ++;
    userScore_span.innerHTML = userScore;
    computer_span.innerHTML = compScore;
    const smallWordUser = "user".fontsize(3).sub();
    const smallWordcomp = "comp".fontsize(3).sub();
    result_p.innerHTML = `${convertText(userChoice)}${smallWordUser}  beats ${convertText(computerChoice)}${smallWordcomp}. You Win!`
    document.getElementById(userChoice).classList.add('green-glow');
    setTimeout(function() { document.getElementById(userChoice).classList.remove('green-glow')}, 1000)
}

function lose(userChoice, computerChoice) {
    compScore ++;
    userScore_span.innerHTML = userScore;
    computer_span.innerHTML = compScore;
    const smallWordUser = "user".fontsize(3).sub();
    const smallWordcomp = "comp".fontsize(3).sub();
    result_p.innerHTML = `${convertText(computerChoice)}${smallWordcomp} beats ${convertText(userChoice)}${smallWordUser}. You Lost!`
}

function draw(userChoice, computerChoice) {
    userScore_span.innerHTML = userScore;
    computer_span.innerHTML = compScore;
    result_p.innerHTML = `DRAW! Try Again!`
}

function game(userChoice){
    const computerChoice = getComputerChoice();
    switch (userChoice + computerChoice) {
        case "rs":
        case "pr":
        case "sp":
            win(userChoice, computerChoice);
            break;
        case "rp":
        case "ps":
        case "sr":
            lose(userChoice, computerChoice);
            break;
        case "rr":
        case "ss":
        case "pp":
            draw();
            break;
        
    }
}

function main(){
    rock_div.addEventListener('click', function() {
        game("r");
    })

    paper_div.addEventListener('click', function() {
        game("p");
    })

    scissors_div.addEventListener('click', function() {
        game("s");
    })
}

main();
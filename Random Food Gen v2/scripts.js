var restoPlace = ["Portillos","Chick Fil-A", "MODS", "Jasons Deli","Panera","Noodle's and Company", ];
var listText = "";
// List pre-defined list//
window.onload = function listOptions(){
    var l;
    for (l =0; l < restoPlace.length; l++) {
      listText += "<h4 class='p-1 d-inline-block'>" + restoPlace[l] +"</h4>" +"<br>";
    }
    document.getElementById("options").innerHTML = listText;
};
function addResto () {
  var  i;
  var text = "";
//Prompt to add a place //
    do {
        i = prompt("Enter a Place You Want to Eat:");
        if (i === null || i === ""){
            break;
        }
        else {
            restoPlace.push(i);
            document.getElementById("options").innerHTML += "<h4 class='p-1 d-inline-block'>" + i +"</h4>" +"<br>";
        }
    } while(1);
    var l;
    for (l =0; l < restoPlace.length; l++) {
      text += "<li>" + restoPlace[l] + "</li>";
    }
    document.getElementById("list").innerHTML= text;
}
// Generate and select a random resto//

function randomResto (){
    var randomNumResto = restoPlace[Math.floor(Math.random ()* restoPlace.length)];
    if (restoPlace[0] === null || restoPlace[0] === undefined){
      document.getElementById("result").innerHTML = "No options listed";
      window.alert ("List Places");
    }else {
      document.getElementById("result").innerHTML = randomNumResto;
    }
}


function removeAllOptions(){
  document.getElementById("options").innerHTML =null;
  restoPlace = [];
}

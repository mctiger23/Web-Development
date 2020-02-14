//jshint esversion:6
//Create a simple function that will pull variables from the html using VANILLA JAVASCRIPT

//1. pull values from html -- Done
function getVal(){
    var textBrew = document.getElementById("brewType");
    var selectedBrew = textBrew.options[textBrew.selectedIndex].text;
    var cupsNum = document.getElementById("cupsNum").value;
    return {selectedBrew,cupsNum};
}

//Output Function: Takes values from getVal and calcGrams functions
//V2 Main function
//Will include the calculation function
function submitCalc2(){
  let {selectedBrew, cupsNum} = getVal(); //Grabbing Submitted values
  var totalCoffee;
    if (selectedBrew === "Espresso"){
      const espressoConst = 7;
      totalCoffee = espressoConst * cupsNum;
    } else {
      const otherConst = 15;
      totalCoffee = otherConst * cupsNum;
    }
  document.getElementById("result").innerHTML = //find a way to simplify Output
    "Brew Type: "+ selectedBrew   + "<p>Cups: "+ cupsNum + "</p>" +"<p>Total Number of Coffee Beans(in grams): " + totalCoffee+"</p>";
}

//Challenge 2: Metric conversion
//User will have an option to convert values
//For example: grams to tablespoon/teaspoon/ounces OR cups to oz/mL

//Challenge 3: Brewing Instructions
//Must include instructions based on the brewing type

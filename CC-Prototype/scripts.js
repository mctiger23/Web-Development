var listEDCAdded = [500815];




// $("#sideNavBtn").on("click",function() {
//   $("nav.sidebar").toggle();
//   $("sidNavBtn").
// });
//addEventListeners


//Side nav toggle options
document.getElementById("sideNavBtn").addEventListener("click",function(){
  var icon = document.getElementById("iconArrow");
  if (icon.classList.contains("fa-arrow-alt-circle-left")){
    icon.classList.remove("fa-arrow-alt-circle-left");
    icon.classList.add("fa-arrow-alt-circle-right");
  }
  else if (icon.classList.contains("fa-arrow-alt-circle-right")){
    icon.classList.remove("fa-arrow-alt-circle-right");
    icon.classList.add("fa-arrow-alt-circle-left");
  }
  });

document.getElementById("addEDCBtn").addEventListener("click",function(){
  var edcAdded = document.getElementById("edcNum").value;
  var isNum = isNaN(edcAdded) === true;
  if (edcAdded === "" || isNum){
    document.getElementById("edcNum").value = "";
    document.getElementById("edcNum").setAttribute("placeholder", "Enter EDC");
  }
  else {
    var node = document.createElement("LI");
    listEDCAdded.push(edcAdded);
    document.getElementById("edcList").innerHTML += "<li>EDC <strong>" + edcAdded +"</strong></li>";
    document.getElementById("edcNum").value = "";}
});

document.getElementById("edcNum").addEventListener("keypress",function(e){
  if (e.keyCode === 13){
    document.getElementById("addEDCBtn").click();
  }
});

// NOT WORKING HEHEHE
// function validateEdc(edc){
//   for (i = 0; i<listEDCAdded.length; i++){
//     if (listEDCAdded[i] === edc){
//       alert("EDC already Added");
//     }
// }
//
// }

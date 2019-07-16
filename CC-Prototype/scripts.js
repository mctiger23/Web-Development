
//Side nav toggle options
// $("#sideNavBtn").on("click",function() {
//   $("nav.sidebar").toggle();
//   $("sidNavBtn").
// });


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

//Read all files in the folder
//count how many files files is inside the folder
//create a foreach loop to add the name of the photos
windows.onload = function loadPhotos(){
  var l;
  var listPhoto = "";
  var addPhoto = document.getElementById("photos");
  for (l= 1; l < 14; l++){
    listPhoto =  "<div class='carousel-item' data-interval='2000'> <img src='photos/img - "+l+".jpeg' class='d-block w-100' alt='Group'></div>";
    addPhoto.innerHTML = listPhoto;
  }

};

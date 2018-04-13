$(document).ready(function() {
    /**
     * When the table or notification is clicked the user is prompted to accept or decline the order
     * If the user accepts the order it is added under "Accepted orders"**/
  $("#table1").on("click", function() {
      var r = confirm("Accept order: 5 BrewDog Trashy");
      if (r==true){
            var para = document.createElement("p");
            var textnode = document.createTextNode("5 x BrewDog Trashy");
            para.appendChild(textnode);
           var div = document.getElementById("ov1");
           div.appendChild(para);
           $("#table1 > .notification").hide();
    }
   });
   $("#table2").on("click", function() {
      var r = confirm("Accept order: 3 BrewDog Trashy");
      if (r==true){
            var para = document.createElement("p");
            var textnode = document.createTextNode("3 x Brooklyn Lager");
            para.appendChild(textnode);
           var div = document.getElementById("ov1");
           div.appendChild(para);
           $("#table2 > .notification").hide();
    }
   });
  });


/**
* Check for waiting player.
**/

function checkForPlayer() {
  var socket = io();
  window.location.href = 'index';
}


$(document).ready(function(){
    $("a.btn").click(function(){
        checkForPlayer();
    });
});

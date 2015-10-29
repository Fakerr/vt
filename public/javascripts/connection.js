/**
* init socket for client side.
**/
var socket = io();
// User's name to send to the server.
var pseudo;
// User must enter a name.
while(!(pseudo = prompt('Enter your name.')));
// Player's number.
var number;
    val = false;
while(!val){
  number = prompt('Give a number');
  if(numberValidity(number))
    val = true;
}

$(document).ready(function (){
  $('form').submit(function () {
    socket.emit('vt', $('.number').val());
    $('.number').val('');
    return false;
  });

  // Sending user nickname.
  socket.emit('pseudo', pseudo);

  // Sending number.
  socket.emit('number', number);

  socket.on('vt', function (msg) {
    $('.messages').append($('<li>').text(msg));
  });
});


/**
 * Return false if number is not valid.
 */

function numberValidity(number) {
  if (typeof number !== "string") {
    return false;
  }
  if (number.length != 4) {
    return false;
  }
  for(var i=0; i<4; i++) {
    var j = 0;
    while(j < 4) {
      if (i != j && number[i] != number[j]){
        j++;
      }else if (i != j) {
        return false;
      }else {
        j++;
      }
    }
  }
  return true;
}

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

// Show player name.
var player = document.createElement('H2');
    player.setAttribute("style", "font-weight: bold");
var t = document.createTextNode(pseudo);
player.appendChild(t);
document.body.appendChild(player);
// Show player number.
var title = document.createElement('H2');
    title.setAttribute("style", "font-weight: bold");
var t = document.createTextNode('Your number is : ' + number);
title.appendChild(t);
document.body.appendChild(title);

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
  // Handle message.
  socket.on('vt', function (data) {
    if(data[1].T === 4){
      $('.messages').append($('<li>')
      .text('GG, You won !')
      .css({'font-weight':'bold', 'color': 'green'}));
    }else{
      $('.messages').append($('<li>')
      .text(data[2] + ' : '  + data[0] + '\t' + data[1].V + 'V' + data[1].T + 'T')
      .css('font-weight', 'bold'));
    }
  });
  // Handle error.
  socket.on('wn', function (msg) {
    $('.messages').append($('<li>').text(msg)
    .css({'color': 'red', 'font-weight': 'bold'}));
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

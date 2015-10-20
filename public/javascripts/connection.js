/**
* init socket for client side.
**/
var socket = io();
// User's name to send to the server.
var pseudo;
// User must enter a name.
while(!(pseudo = prompt('Enter your name.')));

$(document).ready(function (){
  $('form').submit(function () {
    $('.output ul').append('<li>' + $('.number').val() + '</li>');
    socket.emit('vt', $('.number').val());
    $('.number').val('');
    return false;
  });

  // Sending user nickname.
  socket.emit('pseudo', pseudo);

  socket.on('vt', function (msg) {
    $('.messages').append($('<li>').text(msg));
  });
});

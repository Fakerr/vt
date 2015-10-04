/**
* init socket for client side.
**/
var socket = io();
// Nickname of user to send to the server.
var pseudo = prompt('Enter your nickname.');

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

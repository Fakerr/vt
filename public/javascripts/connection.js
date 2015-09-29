/**
* init socket for client side.
**/
var socket = io();

$(document).ready(function (){
  $('form').submit(function () {
    socket.emit('vt', $('.number').val());
    $('.number').val('');
    return false;
  });

  socket.on('vt', function (msg) {
    $('.messages').append($('<li>').text(msg));
  });
});

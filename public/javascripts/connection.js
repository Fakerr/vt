/**
* init socket for client side.
**/
var socket = io();

$(document).ready(function (){
  $('.btn-send').click(function () {
    socket.emit('vt', $('.number').val());
    $('.number').val('');
  });

  socket.on('vt', function (msg) {
    $('.messages').append($('<li>').text(msg));
  });
});

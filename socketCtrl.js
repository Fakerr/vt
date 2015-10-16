
//Room constructor.
/*function Room() {
  this.roomName: 'Default'?
  this.full: false
}*/


/**
* Socket base core.
**/

exports.core = function(socket, rooms){
  var room = {};
  // Logging user connection.
  console.log('User connected');

  socket.on('pseudo', function(pseudo) {
    socket.pseudo = pseudo;
    room = searchForRoom(rooms);
    if(room) {
      socket.join(room.roomName);
      socket.room = room;
    }else {
      socket.join(pseudo);
      room = {
        roomName: pseudo,
        full: false
      };
      socket.room = room;
      rooms.push(room);
    }
  });
  socket.on('vt', function(msg) {
    socket.to(socket.room.roomName).emit('vt', msg);
  });
  // Logging user disconnection
  socket.on('disconnect', function(){
    if(socket.room.full === true)
      socket.room.full = false;
    console.log('User disconnected');
  });
}

/**
 * Search for free room.
 */

function searchForRoom(rooms) {
  for(var i=0; i < rooms.length; i++){
    if(rooms[i].full === false){
      rooms[i].full = true;
      return rooms[i];
     }
   }
 }

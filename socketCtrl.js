
//Room constructor.
function Room(roomName, full, opponent) {
  this.roomName = roomName;
  this.full = full;
  this.opponent = opponent;
}

/**
* Socket base core.
**/

exports.core = function(io, socket, rooms){
  var room = {};
  // Logging user connection.
  console.log('User connected');

  socket.on('pseudo', function(pseudo) {
    socket.pseudo = pseudo;
    room = searchForRoom(rooms, pseudo);
    if(room) {
      socket.join(room.roomName);
      socket.room = room;
    }else {
      socket.join(pseudo);
      room = new Room(pseudo, false, 'none');
      socket.room = room;
      rooms.push(room);
    }
  });
  socket.on('vt', function(msg) {
    socket.to(socket.room.roomName).emit('vt', msg);
  });
  // User disconnection
  socket.on('disconnect', function(){
    if(socket.room.full === true) {
      socket.room.full = false;
      //updateRoomMembers(socket, socket.room, io);
    }
    console.log('User disconnected');
  });
}

/**
 * Search for free room.
 */

function searchForRoom(rooms, pseudo) {
  for(var i=0; i < rooms.length; i++){
    if(rooms[i].full === false){
      rooms[i].full = true;
      rooms[i].opponent = pseudo;
      return rooms[i];
     }
   }
 }

 /**
 * Update room members after someone leaving.
 **/

 function updateRoomMembers(socket, room, io) {
   console.log(Object.keys(io.nsps['/'].adapter.rooms[room.roomName]).length);
 }

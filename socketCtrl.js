var _ = require('underscore');


//Room constructor.
function Room(roomName, full, opponent) {
  this.roomName = roomName;
  this.full = full;
  this.opponent = opponent;
}

/**
* Socket base core.
**/

exports.core = function(io, socket, dualRooms){
  var room = {};
  // Logging user connection.
  console.log('User connected');

  socket.on('pseudo', function(pseudo) {
    socket.pseudo = pseudo;
    //Searching available room or creating one if it doesn't exist.
    room = searchForRoom(dualRooms, pseudo);
    if(room) {
      socket.join(room.roomName);
      socket.room = room;
    }else {
      socket.join(pseudo);
      room = new Room(pseudo, false, 'none');
      socket.room = room;
      dualRooms.push(room);
    }
  });
  socket.on('vt', function(msg) {
    socket.to(socket.room.roomName).emit('vt', msg);
  });
  // User disconnection
  socket.on('disconnect', function(){
    if(socket.room.full === true) {
      //Here, we try to update other opponent status.In this case,
      // we try to found another waiting player in different room.
      //If not we stay in the same room.
      updateRoomMembers(socket, dualRooms, io);
      //Update room status.
      socket.room.full = false;
      socket.room.opponent = 'none';
    }
    console.log('User disconnected');
  });
};

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

 function updateRoomMembers(socket, dualRooms, io) {
   var newRoom = {};
   // Getting id of room player.
   var socketId = Object.keys(io.nsps['/'].adapter.rooms[socket.room.roomName])[0];
   // Get socket from id.
   var oppSocket = io.sockets.connected[socketId];
   //Searching for available room.
   newRoom = searchForRoom(dualRooms, oppSocket.pseudo);
   if(newRoom) {
     oppSocket.leave(oppSocket.room.roomName);
     //Update Rooms.
     dualRooms = _.reject(dualRooms, function(el) {
       return el.roomName === oppSocket.room.roomName;
     });
     oppSocket.join(newRoom.roomName);
     oppSocket.room = newRoom;
   }
 }
